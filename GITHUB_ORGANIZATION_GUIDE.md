# GitHub Organization Guide - User Stories Structure

This document shows how to organize files on GitHub by dividing them into user story folders.

---

## 📁 Suggested Folder Structure

```
project_ysodot123/
├── EPIC_1_Real_Time_Occupancy/
│   ├── US_1_Library_Occupancy/
│   │   ├── backend/
│   │   └── frontend/
│   ├── US_2_Find_Available_Lab/
│   │   ├── backend/
│   │   └── frontend/
│   └── US_3_Global_Occupancy_View/
│       ├── backend/
│       └── frontend/
├── EPIC_2_Room_Lab_Allocation/
│   ├── US_4_Request_Room_Lab/
│   │   ├── backend/
│   │   └── frontend/
│   └── US_5_Approve_Room_Allocation/
│       ├── backend/
│       └── frontend/
├── EPIC_3_Fault_Maintenance/
│   ├── US_6_Report_Classroom_Fault/
│   │   ├── backend/
│   │   └── frontend/
│   └── US_7_Track_Manage_Faults/
│       ├── backend/
│       └── frontend/
├── EPIC_4_User_Management/
│   ├── US_8_Manage_User_Roles/
│   │   ├── backend/
│   │   └── frontend/
│   └── US_9_User_Login/
│       ├── backend/
│       └── frontend/
├── EPIC_5_Reports_Insights/
│   ├── US_10_Utilization_Reports/
│   │   ├── backend/
│   │   └── frontend/
│   └── US_11_Recurring_Problems_Report/
│       ├── backend/
│       └── frontend/
└── shared/
    ├── backend/
    └── frontend/
```

---

## 🟦 EPIC 1: Real-Time Occupancy Monitoring

### 🔹 US-1 – Library Occupancy

**Backend Files:**
```
EPIC_1_Real_Time_Occupancy/US_1_Library_Occupancy/backend/
├── accounts/models.py (lines 86-98 only - LibraryStatus model)
└── accounts/views.py (lines 316-374 only - get_library_status, update_library_status)
```

**Frontend Files:**
```
EPIC_1_Real_Time_Occupancy/US_1_Library_Occupancy/frontend/
├── pages/LibraryStatus.jsx
├── components/cards/LibraryCard.jsx
├── components/occupancy/OccupancyBadge.jsx
└── components/occupancy/OccupancyBar.jsx
```

---

### 🔹 US-2 – Find Available Lab

**Backend Files:**
```
EPIC_1_Real_Time_Occupancy/US_2_Find_Available_Lab/backend/
├── accounts/models.py (lines 101-117 only - LabStatus model)
└── accounts/views.py (lines 379-467 only - list_labs, update_lab_status, create_lab)
```

**Frontend Files:**
```
EPIC_1_Real_Time_Occupancy/US_2_Find_Available_Lab/frontend/
├── pages/FindLabs.jsx
└── components/cards/LabCard.jsx
```

---

### 🔹 US-3 – Global Occupancy View

**Backend Files:**
```
EPIC_1_Real_Time_Occupancy/US_3_Global_Occupancy_View/backend/
├── accounts/views.py (lines 316-330, 379-399 only - get_library_status, list_labs)
└── Note: Room data comes from base44 (shared)
```

**Frontend Files:**
```
EPIC_1_Real_Time_Occupancy/US_3_Global_Occupancy_View/frontend/
├── pages/OccupancyOverview.jsx
├── components/occupancy/OccupancyBar.jsx
└── components/occupancy/OccupancyBadge.jsx
```

---

## 🟥 EPIC 2: Room and Lab Allocation

### 🔹 US-4 – Request Room / Lab

**Backend Files:**
```
EPIC_2_Room_Lab_Allocation/US_4_Request_Room_Lab/backend/
└── Note: Uses base44 entities (see shared/api)
```

**Frontend Files:**
```
EPIC_2_Room_Lab_Allocation/US_4_Request_Room_Lab/frontend/
├── pages/RoomRequests.jsx
└── components/cards/RequestCard.jsx
```

---

### 🔹 US-5 – Approve Room Allocation

**Backend Files:**
```
EPIC_2_Room_Lab_Allocation/US_5_Approve_Room_Allocation/backend/
└── Note: Uses base44 entities (see shared/api)
```

**Frontend Files:**
```
EPIC_2_Room_Lab_Allocation/US_5_Approve_Room_Allocation/frontend/
├── pages/RequestApprovals.jsx
└── components/cards/RequestCard.jsx
```

---

## 🟩 EPIC 3: Fault and Maintenance Reporting

### 🔹 US-6 – Report Classroom Fault

**Backend Files:**
```
EPIC_3_Fault_Maintenance/US_6_Report_Classroom_Fault/backend/
├── accounts/models.py (lines 38-83 only - FaultReport model, SEVERITY_CHOICES, CATEGORY_CHOICES)
└── accounts/views.py (lines 199-225 only - create_fault_report)
```

**Frontend Files:**
```
EPIC_3_Fault_Maintenance/US_6_Report_Classroom_Fault/frontend/
└── pages/ReportFault.jsx
```

---

### 🔹 US-7 – Track and Manage Faults

**Backend Files:**
```
EPIC_3_Fault_Maintenance/US_7_Track_Manage_Faults/backend/
├── accounts/models.py (lines 38-83 only - FaultReport model with STATUS_CHOICES)
└── accounts/views.py (lines 228-311 only - list_fault_reports, update_fault_report)
```

**Frontend Files:**
```
EPIC_3_Fault_Maintenance/US_7_Track_Manage_Faults/frontend/
├── pages/FaultManagement.jsx
├── pages/Reports.jsx
└── components/cards/FaultCard.jsx
```

---

## 🟪 EPIC 4: User Management and Access

### 🔹 US-8 – Manage User Roles

**Backend Files:**
```
EPIC_4_User_Management/US_8_Manage_User_Roles/backend/
├── accounts/models.py (lines 4-16, 19-35 only - Profile, RoleRequest models)
└── accounts/views.py (lines 102-147, 472-584 only - set_role, list_role_requests, approve/reject_role_request)
```

**Frontend Files:**
```
EPIC_4_User_Management/US_8_Manage_User_Roles/frontend/
├── pages/UserManagement.jsx
└── components/RoleGate.jsx
```

---

### 🔹 US-9 – User Login

**Backend Files:**
```
EPIC_4_User_Management/US_9_User_Login/backend/
├── accounts/views.py (lines 50-99, 150-194 only - register, login, me, google_login, google_callback)
├── accounts/jwt.py (entire file)
└── accounts/auth.py (entire file)
```

**Frontend Files:**
```
EPIC_4_User_Management/US_9_User_Login/frontend/
├── pages/Login.jsx
├── pages/Register.jsx
├── state/AuthContext.jsx
├── components/ProtectedRoute.jsx
└── state/ProtectedRoute.jsx
```

---

## 🟧 EPIC 5: Reports and Insights

### 🔹 US-10 – Utilization Reports

**Backend Files:**
```
EPIC_5_Reports_Insights/US_10_Utilization_Reports/backend/
├── accounts/models.py (lines 86-117 only - LibraryStatus, LabStatus models)
└── accounts/views.py (lines 316-330, 379-399 only - occupancy percentage calculations)
```

**Frontend Files:**
```
EPIC_5_Reports_Insights/US_10_Utilization_Reports/frontend/
├── pages/Dashboard.jsx
├── pages/Reports.jsx
├── pages/OccupancyOverview.jsx (lines 168-189 - chart visualization)
└── components/dashboard/StatsCard.jsx
```

---

### 🔹 US-11 – Recurring Problems Report

**Backend Files:**
```
EPIC_5_Reports_Insights/US_11_Recurring_Problems_Report/backend/
├── accounts/models.py (lines 38-117 only - FaultReport, LibraryStatus, LabStatus models)
└── Note: Pattern detection logic needs to be implemented
```

**Frontend Files:**
```
EPIC_5_Reports_Insights/US_11_Recurring_Problems_Report/frontend/
├── pages/Reports.jsx (can be extended)
└── pages/OccupancyOverview.jsx (lines 70, 200-237 - overload detection)
```

---

## 📦 Shared/Common Files

**Backend Shared Files:**
```
shared/backend/
├── accounts/models.py (complete file - contains all models)
├── accounts/views.py (complete file - contains all views)
├── accounts/urls.py (entire file - all API routes)
├── accounts/admin.py (entire file)
├── accounts/apps.py (entire file)
├── campus_api/
│   ├── settings.py (entire file)
│   ├── urls.py (entire file)
│   ├── wsgi.py (entire file)
│   └── asgi.py (entire file)
├── manage.py (entire file)
└── db.sqlite3 (database file)
```

**Frontend Shared Files:**
```
shared/frontend/
├── api/
│   ├── base44Client.js (entire file)
│   ├── entities.js (entire file)
│   └── integrations.js (entire file)
├── components/ui/ (all UI components - button, card, input, etc.)
├── lib/utils.js (entire file)
├── hooks/use-mobile.jsx (entire file)
├── App.jsx (entire file)
├── App.css (entire file)
├── main.jsx (entire file)
├── index.css (entire file)
├── index.html (entire file)
├── pages/
│   ├── Layout.jsx (entire file)
│   ├── Dashboard.jsx (used by multiple US)
│   └── index.jsx (entire file)
├── state/
│   └── AuthContext.jsx (shared across multiple US)
├── vite.config.js (entire file)
├── tailwind.config.js (entire file)
├── package.json (entire file)
├── jsconfig.json (entire file)
└── postcss.config.js (entire file)
```

---

## 📋 Alternative: Simplified Structure

If the above structure is too complex, you can use a simpler approach with README files linking to code sections:

### Option 1: Keep Original Structure + Documentation
- Keep files in original structure
- Create a README.md in root with links to specific lines/sections
- Tag commits with user story numbers

### Option 2: By Epic Only
```
project_ysodot123/
├── EPIC_1_Real_Time_Occupancy/
├── EPIC_2_Room_Lab_Allocation/
├── EPIC_3_Fault_Maintenance/
├── EPIC_4_User_Management/
├── EPIC_5_Reports_Insights/
└── shared/
```

Then use the USER_STORIES_CODE_MAPPING.md to know which files relate to which subtasks.

---

## 🔗 Recommended Approach

**Best Practice: Keep one codebase with clear documentation**

1. **Keep the original file structure** (it's more maintainable)
2. **Use GitHub Issues/Labels** to tag commits with user story numbers:
   - Label commits: `US-1`, `US-2`, etc.
   - Link commits to subtasks in commit messages
3. **Create a folder with documentation only**:
   ```
   docs/
   ├── USER_STORIES_CODE_MAPPING.md
   ├── GITHUB_ORGANIZATION_GUIDE.md
   └── README.md (with links to each US)
   ```

**Example commit message:**
```
feat(US-1.1): Define library occupancy data model

- Added LibraryStatus model in accounts/models.py (lines 86-98)
- Implements subtask 1.1 of US-1

Related files:
- backend/accounts/models.py
```

---

## 📝 Notes

1. **Shared Models**: Many models in `models.py` are used by multiple user stories. Consider:
   - Creating separate model files for each US (more complex)
   - Keeping shared models in one file (recommended)

2. **Shared Views**: Same applies to `views.py` - many views are used across multiple US.

3. **Frontend Components**: UI components are heavily reused. Keep them in a shared folder.

4. **Base44 Integration**: Room/Lab requests use base44, not Django models. These files go in shared.

5. **Authentication**: Used by all user stories - definitely belongs in shared.

---

## 🎯 Quick Reference: Which Files for Which US

### US-1 (Library Occupancy)
- `backend/accounts/models.py` (LibraryStatus model)
- `backend/accounts/views.py` (library status endpoints)
- `src/pages/LibraryStatus.jsx`
- `src/components/cards/LibraryCard.jsx`
- `src/components/occupancy/*`

### US-2 (Find Available Lab)
- `backend/accounts/models.py` (LabStatus model)
- `backend/accounts/views.py` (lab endpoints)
- `src/pages/FindLabs.jsx`
- `src/components/cards/LabCard.jsx`

### US-3 (Global Occupancy View)
- `src/pages/OccupancyOverview.jsx`
- `src/components/occupancy/*`

### US-4 (Request Room/Lab)
- `src/api/entities.js` (RoomRequest)
- `src/pages/RoomRequests.jsx`
- `src/components/cards/RequestCard.jsx`

### US-5 (Approve Room Allocation)
- `src/pages/RequestApprovals.jsx`
- `src/components/cards/RequestCard.jsx`

### US-6 (Report Classroom Fault)
- `backend/accounts/models.py` (FaultReport model, categories)
- `backend/accounts/views.py` (create_fault_report)
- `src/pages/ReportFault.jsx`

### US-7 (Track and Manage Faults)
- `backend/accounts/models.py` (FaultReport model, status)
- `backend/accounts/views.py` (list, update fault endpoints)
- `src/pages/FaultManagement.jsx`
- `src/pages/Reports.jsx`
- `src/components/cards/FaultCard.jsx`

### US-8 (Manage User Roles)
- `backend/accounts/models.py` (Profile, RoleRequest)
- `backend/accounts/views.py` (role management endpoints)
- `src/pages/UserManagement.jsx`
- `src/components/RoleGate.jsx`

### US-9 (User Login)
- `backend/accounts/jwt.py`
- `backend/accounts/auth.py`
- `backend/accounts/views.py` (auth endpoints)
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/state/AuthContext.jsx`
- `src/components/ProtectedRoute.jsx`

### US-10 (Utilization Reports)
- `src/pages/Dashboard.jsx`
- `src/pages/Reports.jsx`
- `src/pages/OccupancyOverview.jsx` (charts)
- `src/components/dashboard/StatsCard.jsx`

### US-11 (Recurring Problems Report)
- `src/pages/Reports.jsx` (extendable)
- `src/pages/OccupancyOverview.jsx` (overload detection)
- Backend pattern detection (to be implemented)
