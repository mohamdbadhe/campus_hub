# User Stories to Files Mapping

This document provides an exact mapping of user stories to the files that implement them. Use this to quickly find all code related to a specific feature.

---

## Table of Contents

1. [User Story 1: View Library Status](#user-story-1-view-library-status)
2. [User Story 2: Find Available Lab](#user-story-2-find-available-lab)
3. [User Story 3: View Classroom Availability](#user-story-3-view-classroom-availability)
4. [User Story 4: Manager Approval Workflow](#user-story-4-manager-approval-workflow)
5. [User Story 5: Room Request System](#user-story-5-room-request-system)
6. [User Story 6: Filter and Search Rooms](#user-story-6-filter-and-search-rooms)
7. [User Story 7: Track and Manage Faults](#user-story-7-track-and-manage-faults)
8. [User Story 8: User Management](#user-story-8-user-management)

---

## User Story 1: View Library Status

**Description:** Students and staff can view library occupancy and status in real-time. Managers can add new libraries and edit their properties.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/LibraryStatus.jsx` | Main library status page | `fetchLibraries()`, `handleAddLibrary()`, `handleUpdateLibrary()`, `handleEditLibrary()` |
| `src/pages/index.jsx` | Route definition | Route: `/library-status` |

### Backend Files

| File | Purpose | Key Functions/Models |
|------|---------|---------------------|
| `backend/accounts/models.py` | Database model | `LibraryStatus` model (lines ~50-70) |
| `backend/accounts/views.py` | API endpoints | `list_libraries()` (lines ~580-600), `create_library()` (lines ~600-650), `library_update()` (lines ~450-550) |
| `backend/accounts/urls.py` | URL routing | `/api/libraries/list`, `/api/library/create`, `/api/library/update` |

### Key Features
- View all libraries with occupancy
- Add new libraries (managers)
- Edit library name and properties (managers)
- Update occupancy (creates pending request for students)
- Filter by status and search

---

## User Story 2: Find Available Lab

**Description:** Students can quickly locate available computer labs suitable for practice.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/FindLabs.jsx` | Main labs page with filters | `fetchLabs()`, `handleAddLab()`, `handleUpdateLab()`, filter functions |
| `src/pages/index.jsx` | Route definition | Route: `/find-labs` |

### Backend Files

| File | Purpose | Key Functions/Models |
|------|---------|---------------------|
| `backend/accounts/models.py` | Database model | `LabStatus` model (lines ~80-100) |
| `backend/accounts/views.py` | API endpoints | `list_labs()` (lines ~380-400), `create_lab()` (lines ~700-750), `update_lab()` (lines ~550-650) |
| `backend/accounts/urls.py` | URL routing | `/api/labs/list`, `/api/labs/create`, `/api/labs/<id>/update` |

### Key Features
- View all labs with availability status
- Filter by building, status, search
- Add new labs (managers)
- Update lab availability
- Real-time occupancy tracking

---

## User Story 3: View Classroom Availability

**Description:** View and manage classroom availability across campus.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/Classrooms.jsx` | Main classrooms page with filters | `fetchClassrooms()`, `handleAddClassroom()`, `handleUpdateClassroom()`, filter functions |
| `src/pages/index.jsx` | Route definition | Route: `/classrooms` |

### Backend Files

| File | Purpose | Key Functions/Models |
|------|---------|---------------------|
| `backend/accounts/models.py` | Database model | `ClassroomStatus` model (lines ~120-140) |
| `backend/accounts/views.py` | API endpoints | `list_classrooms()` (lines ~680-710), `create_classroom()` (lines ~710-760), `update_classroom()` (lines ~760-790) |
| `backend/accounts/urls.py` | URL routing | `/api/classrooms/list`, `/api/classrooms/create`, `/api/classrooms/<id>/update` |

### Key Features
- View all classrooms with availability
- Filter by building, status, search
- Add new classrooms (managers)
- Update classroom availability
- Real-time occupancy tracking

---

## User Story 4: Manager Approval Workflow

**Description:** Students can update room status, but changes require manager approval before being applied.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/ManagerRequests.jsx` | Manager approval page | `fetchPendingUpdates()`, `handleApprove()`, `handleReject()` |
| `src/pages/LibraryStatus.jsx` | Student update interface | Shows "pending approval" message after update |
| `src/pages/FindLabs.jsx` | Student update interface | Shows "pending approval" message after update |
| `src/pages/index.jsx` | Route definition | Route: `/manager-requests` |

### Backend Files

| File | Purpose | Key Functions/Models |
|------|---------|---------------------|
| `backend/accounts/models.py` | Database models | `LibraryUpdateRequest` (lines ~150-170), `LabUpdateRequest` (lines ~174-195) |
| `backend/accounts/views.py` | API endpoints | `library_update()` (creates requests), `update_lab()` (creates requests), `list_pending_updates()` (lines ~1100-1150), `approve_library_update()` (lines ~1156-1200), `reject_library_update()` (lines ~1201-1235), `approve_lab_update()` (lines ~1236-1285), `reject_lab_update()` (lines ~1286-1318) |
| `backend/accounts/urls.py` | URL routing | `/api/updates/pending`, `/api/updates/library/<id>/approve`, `/api/updates/library/<id>/reject`, `/api/updates/lab/<id>/approve`, `/api/updates/lab/<id>/reject` |

### Key Features
- Students create update requests
- Managers see pending requests
- Managers approve/reject with reasons
- Approved updates apply automatically

---

## User Story 5: Room Request System

**Description:** Lecturers can request classrooms or labs for teaching. Managers approve requests and assign rooms.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/RoomRequests.jsx` | Lecturer request page | `fetchData()`, `handleSubmit()`, displays request status |
| `src/pages/RequestApprovals.jsx` | Manager approval page | `fetchData()`, `handleApprove()`, `handleReject()`, room selection |
| `src/pages/Layout.jsx` | Navigation | Links for "Room Requests" (lecturers) and "Room Approvals" (managers) |
| `src/pages/index.jsx` | Route definitions | Routes: `/room-requests`, `/request-approvals` |

### Backend Files

| File | Purpose | Key Functions/Models |
|------|---------|---------------------|
| `backend/accounts/models.py` | Database model | `RoomRequest` model (lines ~198-236) |
| `backend/accounts/views.py` | API endpoints | `create_room_request()` (lines ~1322-1390), `list_room_requests()` (lines ~1392-1450), `approve_room_request()` (lines ~1452-1520), `reject_room_request()` (lines ~1522-1560) |
| `backend/accounts/urls.py` | URL routing | `/api/room-requests/create`, `/api/room-requests/list`, `/api/room-requests/<id>/approve`, `/api/room-requests/<id>/reject` |

### Key Features
- Lecturers create room requests with date/time
- Managers see all pending requests
- Managers assign rooms and approve
- Approved rooms become unavailable
- Request status tracking

---

## User Story 6: Filter and Search Rooms

**Description:** Filter rooms by building, status (available/booked/full), and search to identify overloads.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/Classrooms.jsx` | Filter implementation | `filteredClassrooms`, `getOccupancyStatus()`, search, building filter, status filter |
| `src/pages/FindLabs.jsx` | Filter implementation | `filteredLabs`, `getOccupancyStatus()`, search, building filter, status filter |
| `src/pages/LibraryStatus.jsx` | Filter implementation | `filteredLibraries`, `getOccupancyStatus()`, search, status filter |

### Backend Files

| File | Purpose | Notes |
|------|---------|-------|
| `backend/accounts/views.py` | Data endpoints | All list endpoints return data for filtering (no backend filtering needed) |

### Key Features
- Search by name, building, room number
- Filter by building (dropdown)
- Filter by status (Available, Partially Booked, Full)
- Statistics dashboard (total, available, partially booked, full, overloaded)
- Real-time filter updates

---

## User Story 7: Track and Manage Faults

**Description:** Students can report faults. Managers track, prioritize, and manage fault resolution.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/ReportFault.jsx` | Student fault reporting | `handleSubmit()`, form with image upload |
| `src/pages/FaultManagement.jsx` | Manager fault dashboard | `loadData()`, `handleUpdateFault()`, filters, status management |
| `src/pages/Reports.jsx` | User's fault reports | `fetchReports()`, displays user's own reports |
| `src/pages/index.jsx` | Route definitions | Routes: `/report-fault`, `/fault-management`, `/reports` |

### Backend Files

| File | Purpose | Key Functions/Models |
|------|---------|---------------------|
| `backend/accounts/models.py` | Database model | `FaultReport` model (lines ~102-148) |
| `backend/accounts/views.py` | API endpoints | `create_fault()` (lines ~250-280), `list_faults()` (lines ~280-320), `update_fault()` (lines ~320-380) |
| `backend/accounts/urls.py` | URL routing | `/api/faults/create`, `/api/faults/list`, `/api/faults/<id>/update` |

### Key Features
- Report faults with photos
- Manager dashboard with statistics
- Filter by severity, category, status
- Status workflow (open → in_progress → done → resolved → closed)
- Assignment to technicians

---

## User Story 8: User Management

**Description:** Admins manage users, roles, and role requests.

### Frontend Files

| File | Purpose | Key Functions/Components |
|------|---------|------------------------|
| `src/pages/UserManagement.jsx` | Admin user management | `fetchUsers()`, `handleApproveRole()`, `handleRejectRole()`, user list |
| `src/pages/Register.jsx` | User registration | `handleRegister()`, role selection |
| `src/pages/RoleSelect.jsx` | Role selection | Role selection after registration |
| `src/pages/index.jsx` | Route definitions | Routes: `/user-management`, `/register` |

### Backend Files

| File | Purpose | Key Functions/Models |
|------|---------|---------------------|
| `backend/accounts/models.py` | Database models | `Profile` model (lines ~4-26), `RoleRequest` model (lines ~29-47) |
| `backend/accounts/views.py` | API endpoints | `register()` (lines ~50-150), `admin_users()` (lines ~800-900), `admin_role_requests()` (lines ~900-1000), `admin_approve_role()` (lines ~1000-1050), `admin_reject_role()` (lines ~1050-1100) |
| `backend/accounts/urls.py` | URL routing | `/api/auth/register`, `/api/admin/users`, `/api/admin/role-requests`, `/api/admin/role-requests/<id>/approve`, `/api/admin/role-requests/<id>/reject` |

### Key Features
- User registration with role selection
- Role requests for lecturers/managers
- Admin approval/rejection of role requests
- User list management
- Role-based access control

---

## Additional Shared Files

### Authentication & Routing

| File | Purpose |
|------|---------|
| `src/pages/Login.jsx` | User login page |
| `src/pages/Dashboard.jsx` | Main dashboard (role-based) |
| `src/pages/Layout.jsx` | Main layout with navigation |
| `src/state/AuthContext.jsx` | Authentication context and API base URL |
| `src/pages/index.jsx` | All route definitions |
| `backend/accounts/views.py` | `login()`, `me()` functions |
| `backend/accounts/jwt.py` | JWT token utilities |

### UI Components

| File | Purpose |
|------|---------|
| `src/components/ui/button.jsx` | Reusable button component |
| `src/components/ui/card.jsx` | Reusable card component |
| `src/components/ui/input.jsx` | Reusable input component |
| `src/components/ErrorBoundary.jsx` | Error handling component |

### Configuration Files

| File | Purpose |
|------|---------|
| `backend/requirements.txt` | Python dependencies |
| `package.json` | Frontend dependencies |
| `backend/campus_infra/settings.py` | Django settings |
| `backend/campus_infra/urls.py` | Main URL configuration |
| `vite.config.js` | Vite configuration |
| `tailwind.config.js` | Tailwind CSS configuration |

---

## Quick Reference: File Locations

### Frontend Pages
- All pages: `src/pages/*.jsx`
- Main routing: `src/pages/index.jsx`
- Authentication: `src/state/AuthContext.jsx`

### Backend
- Models: `backend/accounts/models.py`
- Views/API: `backend/accounts/views.py`
- URLs: `backend/accounts/urls.py`
- Settings: `backend/campus_infra/settings.py`

### Database Migrations
- All migrations: `backend/accounts/migrations/0001_initial.py` (fresh migration)

---

## Testing Each User Story

### US-1: Library Status
1. Visit `/library-status`
2. View libraries
3. (Manager) Add library
4. (Manager) Edit library name

### US-2: Find Labs
1. Visit `/find-labs`
2. View labs
3. Use filters
4. (Manager) Add lab

### US-3: Classrooms
1. Visit `/classrooms`
2. View classrooms
3. Use filters
4. (Manager) Add classroom

### US-4: Approval Workflow
1. (Student) Update library/lab → Creates pending request
2. (Manager) Visit `/manager-requests`
3. Approve/reject requests

### US-5: Room Requests
1. (Lecturer) Visit `/room-requests`
2. Create request
3. (Manager) Visit `/request-approvals`
4. Approve and assign room

### US-6: Filters
1. Visit any room page (`/classrooms`, `/find-labs`, `/library-status`)
2. Use search bar
3. Use building filter
4. Use status filter
5. View statistics

### US-7: Fault Management
1. (Student) Visit `/report-fault`
2. Report a fault
3. (Manager) Visit `/fault-management`
4. Update fault status

### US-8: User Management
1. Visit `/register`
2. Register with role request
3. (Admin) Visit `/user-management`
4. Approve/reject role requests

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/auth/register` | POST | Register user | No |
| `/api/auth/login` | POST | Login | No |
| `/api/auth/me` | GET | Get current user | Yes |
| `/api/libraries/list` | GET | List libraries | Yes |
| `/api/library/create` | POST | Create library | Manager/Admin |
| `/api/library/update` | POST | Update library | Yes (creates request for students) |
| `/api/labs/list` | GET | List labs | Yes |
| `/api/labs/create` | POST | Create lab | Manager/Admin |
| `/api/labs/<id>/update` | POST | Update lab | Yes (creates request for students) |
| `/api/classrooms/list` | GET | List classrooms | Yes |
| `/api/classrooms/create` | POST | Create classroom | Manager/Admin |
| `/api/classrooms/<id>/update` | POST | Update classroom | Manager/Admin |
| `/api/room-requests/create` | POST | Create room request | Lecturer |
| `/api/room-requests/list` | GET | List requests | Yes |
| `/api/room-requests/<id>/approve` | POST | Approve request | Manager/Admin |
| `/api/room-requests/<id>/reject` | POST | Reject request | Manager/Admin |
| `/api/updates/pending` | GET | List pending updates | Manager/Admin |
| `/api/updates/library/<id>/approve` | POST | Approve library update | Manager/Admin |
| `/api/updates/library/<id>/reject` | POST | Reject library update | Manager/Admin |
| `/api/updates/lab/<id>/approve` | POST | Approve lab update | Manager/Admin |
| `/api/updates/lab/<id>/reject` | POST | Reject lab update | Manager/Admin |
| `/api/faults/create` | POST | Create fault report | Yes |
| `/api/faults/list` | GET | List faults | Yes |
| `/api/faults/<id>/update` | POST | Update fault | Manager/Admin |
| `/api/admin/users` | GET | List all users | Admin |
| `/api/admin/role-requests` | GET | List role requests | Admin |
| `/api/admin/role-requests/<id>/approve` | POST | Approve role | Admin |
| `/api/admin/role-requests/<id>/reject` | POST | Reject role | Admin |

---

## Database Models Summary

| Model | File | Purpose |
|-------|------|---------|
| `Profile` | `backend/accounts/models.py` | User profile with role |
| `RoleRequest` | `backend/accounts/models.py` | Role change requests |
| `LibraryStatus` | `backend/accounts/models.py` | Library data |
| `LabStatus` | `backend/accounts/models.py` | Lab data |
| `ClassroomStatus` | `backend/accounts/models.py` | Classroom data |
| `LibraryUpdateRequest` | `backend/accounts/models.py` | Pending library updates |
| `LabUpdateRequest` | `backend/accounts/models.py` | Pending lab updates |
| `RoomRequest` | `backend/accounts/models.py` | Room booking requests |
| `FaultReport` | `backend/accounts/models.py` | Fault reports |

---

This document provides a complete mapping of user stories to implementation files. Use it to quickly navigate the codebase and understand which files to modify for each feature.
