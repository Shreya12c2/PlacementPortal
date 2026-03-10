from pathlib import Path
import sqlite3
from passlib.hash import bcrypt
from datetime import datetime

DB_PATH = Path(__file__).parent / "app" / "db" / "placement.db"
SCHEMA  = Path(__file__).parent / "app" / "db" / "schema.sql"

DB_PATH.unlink(missing_ok=True)
con = sqlite3.connect(DB_PATH)
with open(SCHEMA, "r", encoding="utf-8") as f:
    con.executescript(f.read())

# seed users (password: password123)
users = [
    ("Student Demo", "student@example.com", bcrypt.hash("password123"), "student"),
    ("Admin Demo",   "admin@example.com",   bcrypt.hash("password123"), "admin"),
]
con.executemany("INSERT INTO users(name,email,password_hash,role) VALUES (?,?,?,?)", users)

# seed drives
drives = [
    ("TCS",        "SDE Intern",    "Hyderabad",  "6–8 LPA", "2025-12-20", 1),
    ("Infosys",    "Data Analyst",  "Bengaluru",  "5–7 LPA", "2025-12-18", 1),
    ("Wipro",      "QA Engineer",   "Remote",     "4–6 LPA", "2025-12-25", 1),
    ("Cognizant",  "Cloud Intern",  "Chennai",    "6 LPA",   "2025-12-22", 0),
]
con.executemany(
    "INSERT INTO drives(company,title,location,ctc,deadline,is_active) VALUES (?,?,?,?,?,?)",
    drives,
)

# seed a couple of student applications
student_id = con.execute("SELECT id FROM users WHERE email='student@example.com'").fetchone()[0]
now = datetime.utcnow().isoformat()
con.executemany(
    "INSERT INTO applications(user_id, drive_id, status, applied_at) VALUES (?,?,?,?)",
    [
        (student_id, 1, "applied",     now),
        (student_id, 2, "shortlisted", now),
    ],
)

con.commit()
con.close()
print("Database initialized at", DB_PATH)
