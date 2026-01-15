# Manual Guide: Push US-2, US-5, and US-7 to Separate Branches

This guide will help you create separate branches for each user story and push them to GitHub.

---

## 📋 Branch Structure

- **`feature/US-2-find-available-lab`** - Contains US-2 files
- **`feature/US-5-approve-room-allocation`** - Contains US-5 files
- **`feature/US-7-track-manage-faults`** - Contains US-7 files

---

## 🚀 Quick Start: Using the Script

1. **Open PowerShell in your project folder**
   ```powershell
   cd "C:\Users\Mohamd badhe\Desktop\project_ysodot123"
   ```

2. **Run the separate branches script**
   ```powershell
   .\push_us_2_5_7_separate_branches.ps1
   ```

3. **Follow the prompts** and then push all branches to GitHub.

---

## 📝 Manual Steps: Create Separate Branches

### Step 1: Initialize Git (if not already done)
```powershell
cd "C:\Users\Mohamd badhe\Desktop\project_ysodot123"
git init
```

### Step 2: Create Initial Main Branch
```powershell
git checkout -b main
```

Create a `.gitignore` if it doesn't exist:
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

Then commit it:
```powershell
git add .gitignore
git commit -m "chore: Add .gitignore"
```

---

### Step 3: Create Branch for US-2 (Find Available Lab)

```powershell
# Create and switch to US-2 branch
git checkout -b feature/US-2-find-available-lab
```

**Add US-2 specific files:**
```powershell
git add src/pages/FindLabs.jsx
git add src/components/cards/LabCard.jsx
```

**Add shared dependencies:**
```powershell
git add src/api/entities.js
git add src/api/base44Client.js
git add src/lib/utils.js
git add src/components/ui/
```

**Add backend files:**
```powershell
git add backend/accounts/models.py
git add backend/accounts/views.py
git add backend/accounts/urls.py
```

**Create README for US-2:**
```powershell
# Create README.md file with US-2 content
```

**Commit US-2:**
```powershell
git commit -m "feat(US-2): Add Find Available Lab implementation"
```

---

### Step 4: Create Branch for US-5 (Approve Room Allocation)

```powershell
# Switch back to main, then create US-5 branch
git checkout main
git checkout -b feature/US-5-approve-room-allocation
```

**Add US-5 specific files:**
```powershell
git add src/pages/RequestApprovals.jsx
git add src/components/cards/RequestCard.jsx
```

**Add shared dependencies:**
```powershell
git add src/api/entities.js
git add src/api/base44Client.js
git add src/lib/utils.js
git add src/components/ui/
```

**Add backend files:**
```powershell
git add backend/accounts/models.py
git add backend/accounts/views.py
git add backend/accounts/urls.py
```

**Create README for US-5:**
```powershell
# Create README.md file with US-5 content
```

**Commit US-5:**
```powershell
git commit -m "feat(US-5): Add Approve Room Allocation implementation"
```

---

### Step 5: Create Branch for US-7 (Track and Manage Faults)

```powershell
# Switch back to main, then create US-7 branch
git checkout main
git checkout -b feature/US-7-track-manage-faults
```

**Add US-7 specific files:**
```powershell
git add src/pages/FaultManagement.jsx
git add src/pages/Reports.jsx
git add src/components/cards/FaultCard.jsx
```

**Add shared dependencies:**
```powershell
git add src/api/entities.js
git add src/api/base44Client.js
git add src/lib/utils.js
git add src/components/ui/
```

**Add backend files:**
```powershell
git add backend/accounts/models.py
git add backend/accounts/views.py
git add backend/accounts/urls.py
```

**Create README for US-7:**
```powershell
# Create README.md file with US-7 content
```

**Commit US-7:**
```powershell
git commit -m "feat(US-7): Add Track and Manage Faults implementation"
```

---

### Step 6: Create GitHub Repository

1. Go to GitHub.com
2. Click "New repository"
3. Name it (e.g., `campus-navigator-us-2-5-7`)
4. **Don't** initialize with README, .gitignore, or license
5. Click "Create repository"

---

### Step 7: Push All Branches to GitHub

```powershell
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push main branch first
git checkout main
git push -u origin main

# Push US-2 branch
git checkout feature/US-2-find-available-lab
git push -u origin feature/US-2-find-available-lab

# Push US-5 branch
git checkout feature/US-5-approve-room-allocation
git push -u origin feature/US-5-approve-room-allocation

# Push US-7 branch
git checkout feature/US-7-track-manage-faults
git push -u origin feature/US-7-track-manage-faults
```

**Or push all branches at once:**
```powershell
git push --all origin
```

---

## 📋 Files per Branch

### Branch: `feature/US-2-find-available-lab`

**US-2 Specific:**
- `src/pages/FindLabs.jsx`
- `src/components/cards/LabCard.jsx`

**Shared:**
- `src/api/entities.js`
- `src/api/base44Client.js`
- `src/lib/utils.js`
- `src/components/ui/*`
- `backend/accounts/models.py` (LabStatus model)
- `backend/accounts/views.py` (Lab endpoints)
- `backend/accounts/urls.py`

---

### Branch: `feature/US-5-approve-room-allocation`

**US-5 Specific:**
- `src/pages/RequestApprovals.jsx`
- `src/components/cards/RequestCard.jsx`

**Shared:**
- `src/api/entities.js` (RoomRequest entity)
- `src/api/base44Client.js`
- `src/lib/utils.js`
- `src/components/ui/*`
- `backend/accounts/models.py` (if needed)
- `backend/accounts/views.py` (if needed)
- `backend/accounts/urls.py`

---

### Branch: `feature/US-7-track-manage-faults`

**US-7 Specific:**
- `src/pages/FaultManagement.jsx`
- `src/pages/Reports.jsx`
- `src/components/cards/FaultCard.jsx`

**Shared:**
- `src/api/entities.js`
- `src/api/base44Client.js`
- `src/lib/utils.js`
- `src/components/ui/*`
- `backend/accounts/models.py` (FaultReport model)
- `backend/accounts/views.py` (Fault endpoints)
- `backend/accounts/urls.py`

---

## 🔍 Verify Branches

**List all branches:**
```powershell
git branch -a
```

**Switch between branches:**
```powershell
git checkout feature/US-2-find-available-lab
git checkout feature/US-5-approve-room-allocation
git checkout feature/US-7-track-manage-faults
git checkout main
```

**See what's in each branch:**
```powershell
git checkout feature/US-2-find-available-lab
git ls-files

git checkout feature/US-5-approve-room-allocation
git ls-files

git checkout feature/US-7-track-manage-faults
git ls-files
```

---

## 📝 README Template for Each Branch

### For US-2 Branch:
```markdown
# US-2: Find Available Lab

This branch contains the implementation for **US-2: Find Available Lab**.

Allows students to quickly locate free computer labs suitable for practice.

## Files

- `src/pages/FindLabs.jsx` - Main page component
- `src/components/cards/LabCard.jsx` - Lab display card
- Backend: `backend/accounts/models.py` (LabStatus model, lines 101-117)
- Backend: `backend/accounts/views.py` (Lab endpoints, lines 379-467)
```

### For US-5 Branch:
```markdown
# US-5: Approve Room Allocation

This branch contains the implementation for **US-5: Approve Room Allocation**.

Prevents double bookings and inefficient room usage.

## Files

- `src/pages/RequestApprovals.jsx` - Manager approval interface
- `src/components/cards/RequestCard.jsx` - Request display card
- Uses base44 entities: `src/api/entities.js` (RoomRequest entity)
```

### For US-7 Branch:
```markdown
# US-7: Track and Manage Faults

This branch contains the implementation for **US-7: Track and Manage Faults**.

Allows infrastructure managers to prioritize and monitor maintenance.

## Files

- `src/pages/FaultManagement.jsx` - Manager fault tracking dashboard
- `src/pages/Reports.jsx` - Fault reports view
- `src/components/cards/FaultCard.jsx` - Fault display card
- Backend: `backend/accounts/models.py` (FaultReport model, lines 38-83)
- Backend: `backend/accounts/views.py` (Fault endpoints, lines 228-311)
```

---

## ✅ Quick Commands Summary

```powershell
# Initialize
git init
git checkout -b main

# US-2 Branch
git checkout -b feature/US-2-find-available-lab
git add src/pages/FindLabs.jsx src/components/cards/LabCard.jsx
git add src/api/ src/lib/ src/components/ui/
git add backend/accounts/models.py backend/accounts/views.py backend/accounts/urls.py
git commit -m "feat(US-2): Add Find Available Lab implementation"

# US-5 Branch
git checkout main
git checkout -b feature/US-5-approve-room-allocation
git add src/pages/RequestApprovals.jsx src/components/cards/RequestCard.jsx
git add src/api/ src/lib/ src/components/ui/
git add backend/accounts/models.py backend/accounts/views.py backend/accounts/urls.py
git commit -m "feat(US-5): Add Approve Room Allocation implementation"

# US-7 Branch
git checkout main
git checkout -b feature/US-7-track-manage-faults
git add src/pages/FaultManagement.jsx src/pages/Reports.jsx src/components/cards/FaultCard.jsx
git add src/api/ src/lib/ src/components/ui/
git add backend/accounts/models.py backend/accounts/views.py backend/accounts/urls.py
git commit -m "feat(US-7): Add Track and Manage Faults implementation"

# Push all branches
git remote add origin <your-repo-url>
git push --all origin
```

---

## 🎯 Benefits of Separate Branches

1. **Isolation**: Each user story is in its own branch
2. **Easy Review**: Can review each US independently
3. **Selective Merging**: Can merge branches separately
4. **Clear History**: Git history shows work per user story
5. **Team Collaboration**: Different team members can work on different branches

---

## ❓ Troubleshooting

### If branch already exists:
```powershell
git checkout -b feature/US-2-find-available-lab-new
# Or delete and recreate:
git branch -D feature/US-2-find-available-lab
git checkout -b feature/US-2-find-available-lab
```

### To see differences between branches:
```powershell
git diff main..feature/US-2-find-available-lab
```

### To merge a branch back to main:
```powershell
git checkout main
git merge feature/US-2-find-available-lab
```
