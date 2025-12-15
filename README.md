# Automated Mail Plan System

## 📌 Overview
An automated email workflow system that allows users to design mail plans with multiple steps (nodes), filter recipients dynamically, and send emails based on time, delay, or events.

Built with Django + Django REST Framework + Celery + React (Vite).

**Features:**
- Create and manage Mail Plans
- Design multi-step workflows using Mail Nodes
- Trigger emails:
    Immediately
    After a delay
    At a scheduled date & time
    On events (future extension)
- Filter recipients using tags
- Reliable background processing using Celery
- Full audit trail using Mail Logs
- Responsive UI for desktop & mobile
- Frontend visual builder (React + React Flow)

---

## 🛠 Tech Stack

**Backend:**
- Django 5.x
- Django REST Framework
- PostgreSQL (Neon/PostgreSQL on Render)
- JWT Authentication (`djangorestframework-simplejwt`)
- django-cors-headers
- Celery
- Redis (broker)

**Frontend:**
- React (Vite)
- React Router
- Axios
- Tailwind CSS
- React Flow


## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/s1999-alt/Kaizen-Payments.git
cd Kaizen_Task
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
cd automail  
pip install --upgrade pip
pip install -r requirements.txt
```

1. **Create `.env` in `backend/`:**
  ```env
  DJANGO_SECRET_KEY=your_secret_key
  DEBUG=1
  ALLOWED_HOSTS=*
  POSTGRES_DB=your POSTGRES_DB
  POSTGRES_USER=your postgres user
  POSTGRES_PASSWORD=your POSTGRES_PASSWORD
  POSTGRES_HOST=your POSTGRES_HOST
  POSTGRES_PORT=your POSTGRES_PORT   
  ```

2. **Run migrations & import data:**
  ```bash
  python manage.py migrate
  ```

3. **Create superuser:**
  ```bash
  python manage.py createsuperuser
  ```

## Celery Setup
**Start Redis:**
  ```bash
  docker start redis-stack
  ```

**Start Celery Worker:**
  ```bash
  celery -A automail worker -l info --pool=solo
  ```

**Run backend:**
  ```bash
  python manage.py runserver
  ```

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

**Run frontend:**
  ```bash
  npm run dev
  ```

---

### 🔑 Environment Variables

**Backend (`.env`):**
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `DJANGO_SECRET_KEY`

---

## API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/mail/register/	Register new user
POST	/mail/login/	Login user
POST	/mail/logout/	Logout user

📧 Mail Plans
Method	Endpoint	Description
GET	/mail/plans/	List all mail plans of the authenticated user
POST	/mail/plans/create/	Create a new mail plan with nodes
GET	/mail/plans/{id}/	Retrieve a specific mail plan
PUT	/mail/plans/{id}/update/	Update an existing mail plan
DELETE	/mail/plans/{id}/	Delete a mail plan
POST	/mail/plans/{id}/run/	Execute a mail plan

👥 Recipients
Method	Endpoint	Description
GET	/mail/recipients/	List recipients (supports filtering by email & tag)



