🛠️ User Story 7 – Maintenance Dashboard
📌 Overview

User Story 7 introduces a Maintenance Staff Dashboard designed to give infrastructure and maintenance teams a clear, real-time overview of reported issues across the campus.
The dashboard helps prioritize work, track issue status, and ensure faster resolution of faults in labs and facilities.

🎯 Objectives

Centralize all maintenance-related issues in one place

Provide real-time visibility into infrastructure problems

Enable quick decision-making and efficient maintenance workflows

Prevent overlooked or duplicated maintenance tasks

✨ Key Features

Centralized Issue View – Displays all reported infrastructure issues across labs

Real-Time Status Updates – Issue status updates immediately after changes

Clear Visual Indicators – Status badges (e.g., Pending / In Progress / Fixed)

Action-Oriented UI – Maintenance staff can quickly mark issues as resolved

Responsive Dashboard – Optimized for desktop and tablet usage

Clean & Professional Design – Modern UI with cards, icons, and subtle animations

🏗️ System Architecture
Backend (Django)

Framework: Django

Architecture: REST-style endpoints using JsonResponse

Database: SQLite (development) / PostgreSQL (production-ready)

Models

Issue

id

title

description

status (Pending / In Progress / Fixed)

created_at

updated_at

lab (ForeignKey)

API Endpoints
Method	Endpoint	Description
GET	/infrastructure/api/issues/	Retrieve all reported issues
POST	/infrastructure/api/issues/update/<issue_id>/	Update issue status
GET	/infrastructure/api/labs/	Retrieve lab metadata
Frontend

Technology: HTML / CSS / JavaScript

Design Approach: Card-based dashboard UI

UX Highlights:

Status color coding

Hover effects and transitions

Easy-to-scan layout for quick decision making

🧪 Testing

Backend testing ensures data integrity and correct behavior.

Covered Tests

Issue model creation

Issue status transitions

API response validity

Status update persistence in the database

Run Tests
cd BACKEND
python manage.py test infrastructure

🚀 How to Run the Project
1️⃣ Backend Setup
cd BACKEND
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

2️⃣ Frontend

Open the dashboard UI file (e.g., index.html)
or run the frontend server if applicable.

🧹 Repository Hygiene

To prevent unnecessary merge conflicts:

All __pycache__ folders and .pyc files are excluded

node_modules is ignored

Environment and build artifacts are excluded

.gitignore
# Python
__pycache__/
*.py[cod]
*.sqlite3
.env
venv/

# Django
*.log
staticfiles/
media/

# Node
node_modules/
dist/
build/

# OS
.DS_Store
Thumbs.db

📎 Notes

This User Story integrates seamlessly with other campus monitoring features

Designed for future scalability (notifications, filters, analytics)

Suitable for real-world campus infrastructure management systems

👥 Contributors

Team 11 – Campus Infrastructure Project

Software Engineering Program
