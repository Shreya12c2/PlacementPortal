from fastapi import FastAPI, HTTPException, Depends, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import sqlite3, jwt
from datetime import datetime, timedelta
from pathlib import Path
from passlib.hash import bcrypt

DB_PATH = Path(__file__).parent / "app" / "db" / "placement.db"
JWT_SECRET = "dev-secret-change-me"        # for demo; move to env in prod
JWT_ALG = "HS256"
JWT_EXP_MIN = 120

app = FastAPI(title="Placement Portal API", version="1.2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# ---------- DB helpers ----------
def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def query_one(sql, params=()):
    with get_conn() as c:
        r = c.execute(sql, params).fetchone()
        return dict(r) if r else None

def query_all(sql, params=()):
    with get_conn() as c:
        rs = c.execute(sql, params).fetchall()
        return [dict(r) for r in rs]

# ---------- Schemas ----------
class RegisterReq(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str | None = "student"

class LoginReq(BaseModel):
    email: EmailStr
    password: str

class ApplyReq(BaseModel):
    drive_id: int

# ---------- Auth helpers ----------
def make_token(user):
    payload = {
        "sub": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXP_MIN),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)

def auth_user(authorization: str | None = Header(None)):
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "Missing Bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
    except jwt.PyJWTError:
        raise HTTPException(401, "Invalid/expired token")
    user = query_one("SELECT * FROM users WHERE id = ?", (data["sub"],))
    if not user:
        raise HTTPException(401, "User not found")
    return user

# ---------- Public routes ----------
@app.get("/api/health")
def health():
    return {"ok": True}

@app.post("/api/register")
def register(req: RegisterReq):
    if query_one("SELECT id FROM users WHERE email = ?", (req.email,)):
        raise HTTPException(400, "Email already registered")
    pwd_hash = bcrypt.hash(req.password)
    with get_conn() as c:
        cur = c.execute(
            "INSERT INTO users(name, email, password_hash, role) VALUES (?,?,?,?)",
            (req.name.strip(), req.email.lower(), pwd_hash, req.role or "student"),
        )
        uid = cur.lastrowid
    user = query_one("SELECT * FROM users WHERE id = ?", (uid,))
    token = make_token(user)
    return {"token": token, "name": user["name"], "role": user["role"]}

@app.post("/api/login")
def login(req: LoginReq):
    user = query_one("SELECT * FROM users WHERE email = ?", (req.email.lower(),))
    if not user or not bcrypt.verify(req.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = make_token(user)
    return {"token": token, "name": user["name"], "role": user["role"]}

@app.get("/api/demo-login")
def demo_login(role: str = "student"):
    if role not in {"student", "admin", "recruiter"}:
        raise HTTPException(400, "role must be student|admin|recruiter")
    demo = {"id": 0, "email": f"{role}@demo", "name": role.title(), "role": role}
    return {"token": make_token(demo), "role": role, "name": role.title()}

# ---------- Protected example ----------
@app.get("/api/me")
def me(user=Depends(auth_user)):
    return {"id": user["id"], "name": user["name"], "email": user["email"], "role": user["role"]}

# ---------- Student features: drives & applications ----------
@app.get("/api/drives")
def list_drives(active: int | None = Query(None)):
    """
    List drives. Optional filter: ?active=1 (only active) or ?active=0.
    """
    sql = "SELECT id, company, title, location, ctc, deadline, is_active FROM drives"
    params = ()
    if active is not None:
        sql += " WHERE is_active = ?"
        params = (active,)
    sql += " ORDER BY deadline ASC"
    return query_all(sql, params)

@app.get("/api/me/applications")
def my_applications(user=Depends(auth_user)):
    """
    Past applications for the logged-in user.
    """
    sql = """
      SELECT a.id, a.status, a.applied_at,
             d.id AS drive_id, d.company, d.title, d.location, d.ctc, d.deadline
      FROM applications a
      JOIN drives d ON d.id = a.drive_id
      WHERE a.user_id = ?
      ORDER BY a.applied_at DESC
    """
    return query_all(sql, (user["id"],))

@app.post("/api/apply")
def apply_drive(req: ApplyReq, user=Depends(auth_user)):
    """
    Apply to a drive (unique per user+drive).
    """
    existing = query_one(
        "SELECT id FROM applications WHERE user_id=? AND drive_id=?",
        (user["id"], req.drive_id),
    )
    if existing:
        raise HTTPException(400, "Already applied to this drive")

    with get_conn() as c:
        c.execute(
            "INSERT INTO applications(user_id, drive_id, status, applied_at) VALUES (?,?,?,?)",
            (user["id"], req.drive_id, "applied", datetime.utcnow().isoformat()),
        )
    return {"ok": True, "message": "Application submitted"}

@app.post("/api/withdraw")
def withdraw(drive_id: int, user=Depends(auth_user)):
    """
    Withdraw an application for a given drive_id.
    """
    with get_conn() as c:
        cur = c.execute(
            "DELETE FROM applications WHERE user_id=? AND drive_id=?",
            (user["id"], drive_id),
        )
        if cur.rowcount == 0:
            raise HTTPException(404, "Application not found")
    return {"ok": True}

@app.get("/api/recommendations")
def recommendations(user=Depends(auth_user)):
    """
    Suggest active drives the user hasn't applied to yet.
    """
    sql = """
      SELECT d.id, d.company, d.title, d.location, d.ctc, d.deadline
      FROM drives d
      WHERE d.is_active = 1
        AND d.id NOT IN (SELECT drive_id FROM applications WHERE user_id = ?)
      ORDER BY d.deadline ASC
      LIMIT 5
    """
    return query_all(sql, (user["id"],))

# ---------- Existing data routes ----------
@app.get("/api/summary")
def summary():
    total = query_one("SELECT COUNT(*) AS c FROM students")["c"]
    active = query_one("SELECT COUNT(*) AS c FROM drives WHERE is_active = 1")["c"]
    placed = query_one("SELECT COUNT(*) AS c FROM students WHERE status='placed'")["c"]
    placement_rate = round((placed / total) * 100, 2) if total else 0
    return {"total_students": total, "active_drives": active, "placement_rate": placement_rate}

@app.get("/api/placement-status")
def placement_status():
    rows = query_all("SELECT status, COUNT(*) AS c FROM students GROUP BY status ORDER BY status")
    out = {"placed": 0, "in_process": 0, "not_applied": 0}
    for r in rows:
        out[r["status"]] = r["c"]
    return out

@app.get("/api/company-wise")
def company_wise():
    return query_all("SELECT company AS name, offers AS count FROM companies ORDER BY offers DESC")

@app.get("/api/notifications")
def notifications():
    return [
        {"id": 1, "title": "Infosys Drive Coming Soon", "body": "Online Test on 20 Nov"},
        {"id": 2, "title": "TCS NQT Results", "body": "Check your email for results"},
        {"id": 3, "title": "Resume Workshop", "body": "Join the session at 5 PM IST"},
    ]
