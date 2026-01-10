

# 📢 User Story 5: Campus Alerts System

## Project Overview

This module provides a real-time announcement system for the campus management hub. It allows students and staff to stay informed about urgent infrastructure updates, maintenance schedules, and general announcements.

## Features

* **Dynamic Alert Display:** Alerts are fetched from a Django REST API and displayed on the frontend dashboard.
* **Urgency Levels:** Supports three levels of alerts:
* `URGENT` (Red/Siren 🚨) - Critical issues.
* `WARNING` (Yellow/Warning ⚠️) - Maintenance or partial closures.
* `INFO` (Blue/Info ℹ️) - General updates.


* **Active Status Filter:** Only displays alerts marked as "Active" in the database.
* **Responsive UI:** Mobile-friendly grid layout with clean CSS animations.

## Tech Stack

* **Backend:** Python, Django, Django REST Framework.
* **Frontend:** React (Hooks), Axios, CSS-in-JS.
* **Database:** SQLite (Development).

## Backend Implementation

The backend consists of a Django model `Alert` with the following schema:

* `title`: The header of the alert.
* `message`: Detailed description.
* `alert_type`: Selection from `URGENT`, `WARNING`, or `INFO`.
* `is_active`: Boolean to toggle visibility.
* `created_at`: Automatic timestamp.

## Frontend Implementation

The React frontend uses the `useEffect` hook to fetch data on load.

* **Component:** `ActiveAnnouncements.js`
* **Styling:** Custom CSS for hover effects and sliding entrance animations.
* **State Management:** Local React state to handle API responses and loading status.

## How to Test

1. **Backend:**
* Run `python manage.py runserver`.
* Go to `http://127.0.0.1:8000/admin`.
* Add a new **Alert** object and mark it as "Active".


2. **Frontend:**
* Navigate to the homepage.
* Verify the alert appears in the "Active Announcements" section with the correct icon and color.


1. **שמור את הקובץ:** צור קובץ חדש בשם `README_US5.md` בתיקייה הראשית שלך.
2. **עבור US7:** האם תרצה שאצור לך README דומה גם עבור דאשבורד התחזוקה (US7)? שם נוסיף גם את סעיף ה-Unit Tests.
