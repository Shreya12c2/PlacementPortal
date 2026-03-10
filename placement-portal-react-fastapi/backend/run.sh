
#!/usr/bin/env bash
set -e
python -m pip install -r requirements.txt
python init_db.py
uvicorn main:app --reload --port 8000
