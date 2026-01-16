# Manual Guide: Push US-2, US-5, and US-7 to GitHub

This guide will help you push only the files related to User Stories 2, 5, and 7 to GitHub.

---

## 📋 Files to Include

### US-2: Find Available Lab
- `src/pages/FindLabs.jsx`
- `src/components/cards/LabCard.jsx`

### US-5: Approve Room Allocation
- `src/pages/RequestApprovals.jsx`
- `src/components/cards/RequestCard.jsx`

### US-7: Track and Manage Faults
- `src/pages/FaultManagement.jsx`
- `src/pages/Reports.jsx`
- `src/components/cards/FaultCard.jsx`

### Supporting/Shared Files
- `src/api/entities.js` (for RoomRequest entity)
- `src/api/base44Client.js`
- `src/components/ui/*` (UI components - card, button, input, etc.)
- `src/lib/utils.js`
- Backend files: `backend/accounts/models.py`, `backend/accounts/views.py`, `backend/accounts/urls.py`

---

## 🚀 Step-by-Step Instructions

### Option 1: Using the PowerShell Script (Easiest)

1. **Open PowerShell in your project folder**
   ```powershell
   cd "C:\Users\Mohamd badhe\Desktop\project_ysodot123"
   ```

2. **Run the script**
   ```powershell
   .\push_us_2_5_7.ps1
   ```

3. **Follow the prompts** and then commit and push as instructed.

---

### Option 2: Manual Steps

#### Step 1: Initialize Git (if not already done)
```powershell
cd "C:\Users\Mohamd badhe\Desktop\project_ysodot123"
git init
```

#### Step 2: Add Only the Required Files

**Add US-2 files:**
```powershell
git add src/pages/FindLabs.jsx
git add src/components/cards/LabCard.jsx
```

**Add US-5 files:**
```powershell
git add src/pages/RequestApprovals.jsx
git add src/components/cards/RequestCard.jsx
```

**Add US-7 files:**
```powershell
git add src/pages/FaultManagement.jsx
git add src/pages/Reports.jsx
git add src/components/cards/FaultCard.jsx
```

**Add supporting files:**
```powershell
git add src/api/entities.js
git add src/api/base44Client.js
git add src/lib/utils.js
```

**Add UI components (add all of them):**
```powershell
git add src/components/ui/
```

**Add backend files:**
```powershell
git add backend/accounts/models.py
git add backend/accounts/views.py
git add backend/accounts/urls.py
```

#### Step 3: Create .gitignore (if not exists)
Create or update `.gitignore` to exclude unnecessary files:
```
node_modules/
__pycache__/
*.pyc
.env
.vscode/
*.log
db.sqlite3
venv/
.venv/
dist/
build/
```

#### Step 4: Check What Will Be Committed
```powershell
git status
```

#### Step 5: Commit the Changes
```powershell
git commit -m "feat: Add implementations for US-2, US-5, and US-7

- US-2: Find Available Lab (FindLabs.jsx, LabCard.jsx)
- US-5: Approve Room Allocation (RequestApprovals.jsx, RequestCard.jsx)
- US-7: Track and Manage Faults (FaultManagement.jsx, Reports.jsx, FaultCard.jsx)
- Includes supporting UI components and backend models/views"
```

#### Step 6: Create GitHub Repository
1. Go to GitHub.com
2. Click "New repository"
3. Name it (e.g., `campus-navigator-us-2-5-7`)
4. **Don't** initialize with README, .gitignore, or license (we already have files)
5. Click "Create repository"

#### Step 7: Add Remote and Push
```powershell
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Or if you prefer a branch:**
```powershell
git checkout -b feature/US-2-5-7
git push -u origin feature/US-2-5-7
```

---

## 🔍 Verify What Will Be Pushed

Before pushing, you can see exactly what files will be included:

```powershell
git status --short
```

Or see the full list:
```powershell
git status
```

---

## 📝 Create a README for the Repository

Create a `README.md` file:

```markdown
# Campus Navigator - User Stories 2, 5, and 7

This repository contains implementations for:
- **US-2**: Find Available Lab
- **US-5**: Approve Room Allocation
- **US-7**: Track and Manage Faults

## User Stories

### US-2: Find Available Lab
Allows students to quickly locate free computer labs suitable for practice.

**Files:**
- `src/pages/FindLabs.jsx` - Main page component
- `src/components/cards/LabCard.jsx` - Lab display card
- Backend: `backend/accounts/models.py` (LabStatus model)
- Backend: `backend/accounts/views.py` (Lab API endpoints)

### US-5: Approve Room Allocation
Prevents double bookings and inefficient room usage.

**Files:**
- `src/pages/RequestApprovals.jsx` - Manager approval interface
- `src/components/cards/RequestCard.jsx` - Request display card
- Uses base44 entities for room requests

### US-7: Track and Manage Faults
Allows infrastructure managers to prioritize and monitor maintenance.

**Files:**
- `src/pages/FaultManagement.jsx` - Manager fault tracking dashboard
- `src/pages/Reports.jsx` - Fault reports view
- `src/components/cards/FaultCard.jsx` - Fault display card
- Backend: `backend/accounts/models.py` (FaultReport model)
- Backend: `backend/accounts/views.py` (Fault API endpoints)

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
npm install
npm run dev
```

## Notes

- Backend files contain code for multiple user stories; only US-2, US-5, and US-7 related sections are relevant here
- UI components in `src/components/ui/` are shared dependencies
```

Then add and commit it:
```powershell
git add README.md
git commit -m "docs: Add README for US-2, US-5, and US-7"
git push
```

---

## ❓ Troubleshooting

### If you get "fatal: remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### If you want to add all UI components at once
```powershell
git add src/components/ui/
```

### If you want to exclude certain files
Create/update `.gitignore` and then:
```powershell
git rm --cached <file-to-exclude>
```

### If you want to see what's already in the repository
```powershell
git log --oneline
```

---

## ✅ Quick Commands Summary

```powershell
# Initialize (if needed)
git init

# Add files
git add src/pages/FindLabs.jsx
git add src/pages/RequestApprovals.jsx
git add src/pages/FaultManagement.jsx
git add src/pages/Reports.jsx
git add src/components/cards/
git add src/api/entities.js
git add src/api/base44Client.js
git add src/components/ui/
git add backend/accounts/models.py
git add backend/accounts/views.py
git add backend/accounts/urls.py

# Commit
git commit -m "feat: Add US-2, US-5, and US-7 implementations"

# Push (first time)
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```
