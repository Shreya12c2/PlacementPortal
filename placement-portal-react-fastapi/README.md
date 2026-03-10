
# Placement Portal — React + FastAPI + SQLite

This project reproduces the UI from your screenshots: a login page with demo buttons and a dashboard showing **Total Students**, **Active Drives**, **Placement Rate**, a **Pie chart** (Placed / In Process / Not Applied), and a **Company‑wise bar chart**.

## Stack
- **Frontend**: React (Vite) + Tailwind + Recharts
- **Backend**: FastAPI (Python) + SQLite (swap to MySQL easily)
- **Charts**: Recharts

---

## 1) Prerequisites
- Python 3.10+
- Node.js 18+
- (Optional) MySQL 8+ if you want to use MySQL instead of SQLite

---

## 2) Run the backend
```bash
cd backend
python -m pip install -r requirements.txt
python init_db.py        # creates and seeds app/db/placement.db
uvicorn main:app --reload --port 8000
```
The API will be at http://localhost:8000

---

## 3) Run the frontend
```bash
cd ../frontend
npm install
npm run dev
```
Open http://localhost:5173

> If your backend runs on a different host/port, create `.env` in `frontend` with:
```
VITE_API=http://localhost:8000
```

---

## 4) Try it
- Click **Demo Student / Demo Admin / Demo Recruiter** to skip real auth.
- Open **Dashboard** to see the numbers and charts (seeded to match the screenshot: 45% placed, 30% in process, 25% not applied; bars 16/12/10/8).

---

## 5) Switch to MySQL (optional)

1. Create a MySQL database (e.g., `placement_portal`).
2. Run the SQL below to create and seed tables:
```sql
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  status ENUM('placed','in_process','not_applied') NOT NULL
);

CREATE TABLE drives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(64) NOT NULL,
  is_active TINYINT NOT NULL DEFAULT 0
);

CREATE TABLE companies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company VARCHAR(64) NOT NULL UNIQUE,
  offers INT NOT NULL DEFAULT 0
);
-- Seed counts: 45 placed, 30 in_process, 25 not_applied (100 total)
INSERT INTO students(name, status) SELECT CONCAT('Student ', LPAD(n,2,'0')), 'placed' FROM (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30 UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40 UNION SELECT 41 UNION SELECT 42 UNION SELECT 43 UNION SELECT 44 UNION SELECT 45) t;
INSERT INTO students(name, status) SELECT CONCAT('Student ', LPAD(45+n,2,'0')), 'in_process' FROM (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30) t;
INSERT INTO students(name, status) SELECT CONCAT('Student ', LPAD(75+n,2,'0')), 'not_applied' FROM (SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25) t;

INSERT INTO drives(company, is_active) VALUES ('TCS', 0), ('Infosys', 0);
INSERT INTO companies(company, offers) VALUES ('TCS', 16), ('Infosys', 12), ('Wipro', 10), ('Cognizant', 8);
```
3. Replace queries in `backend/main.py` with a MySQL connector (e.g., `pymysql`) and connection string.

---

## 6) API endpoints
- `POST /api/login {email, password}` -> demo token
- `GET /api/demo-login?role=student|admin|recruiter`
- `GET /api/summary` -> `{ total_students, active_drives, placement_rate }`
- `GET /api/placement-status` -> `{ placed, in_process, not_applied }`
- `GET /api/company-wise` -> `[ {name, count}, ... ]`
- `GET /api/notifications` -> list
