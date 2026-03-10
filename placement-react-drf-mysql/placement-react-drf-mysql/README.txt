Quick start:
1) Backend:
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   copy .env.example .env
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   python manage.py runserver 8000

2) Frontend (new terminal):
   cd frontend
   npm install
   npm run dev
   Open the printed URL (e.g. http://localhost:5173/). Login at /login.
