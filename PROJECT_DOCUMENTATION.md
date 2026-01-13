# Parth Hospital ERP System - Complete Documentation

**Last Updated:** January 2025  
**Status:** Fully Integrated (Payment System Excluded)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Database Schema](#database-schema)
7. [API Integration](#api-integration)
8. [Features Implemented](#features-implemented)
9. [File Structure](#file-structure)
10. [How It Works](#how-it-works)

---

## Project Overview

Parth Hospital ERP is a comprehensive hospital management system built with modern web technologies. The system includes:

- **Public Website**: Appointment booking, contact forms, hospital information
- **Admin Dashboards**: Role-based dashboards for Owner, Manager, Receptionist, Accountant
- **Employee Portal**: Attendance, leave management, profile
- **Complete Backend API**: RESTful API with authentication, authorization, and data management

**Note:** Payment integration (Razorpay) is excluded and will be implemented later.

---

## Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Fastify (high-performance web framework)
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma (type-safe database access)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **File Upload**: Cloudinary (for gallery images)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod (schema validation)

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: React Hooks
- **HTTP Client**: Fetch API (with custom wrapper)
- **File Parsing**: xlsx (for CSV/Excel uploads)
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Date Handling**: date-fns

---

## System Architecture

### Backend Architecture

```
backend/
├── src/
│   ├── app.ts              # Fastify app setup
│   ├── server.ts           # Server entry point
│   ├── config/             # Configuration (env, database)
│   ├── routes/             # API route definitions
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── validators/         # Zod schemas
│   ├── middleware/         # Auth, error handling
│   └── utils/              # Helper functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
└── package.json
```

### Frontend Architecture

```
frontend/
├── app/                    # Next.js app directory
│   ├── page.tsx            # Home page
│   ├── appointment/        # Public appointment booking
│   ├── contact/            # Contact form
│   ├── login/              # Login page
│   └── dashboard/          # All dashboard pages
├── components/              # React components
│   ├── layouts/            # Layout components
│   ├── ui/                 # UI components (shadcn)
│   └── ...                 # Feature components
├── lib/
│   ├── api/                # API client functions
│   ├── auth.ts             # Auth utilities
│   └── utils/              # Helper functions
└── package.json
```

---

## Backend Implementation

### API Routes Structure

All routes are prefixed with `/api` (configurable via `API_PREFIX` env variable).

#### 1. Authentication (`/api/auth`)
- `POST /login` - User login (returns JWT token)
- `POST /register` - User registration
- `GET /me` - Get current user (protected)

**How it works:**
- Passwords are hashed with bcrypt before storage
- JWT tokens are generated with user ID, email, and role
- Tokens expire after 7 days (configurable)
- Middleware verifies tokens on protected routes

#### 2. Appointments (`/api/appointments`)
- `POST /` - Create appointment (public)
- `GET /` - Get all appointments (with filters)
- `GET /:id` - Get appointment by ID
- `GET /current/bookings` - Get today's bookings (protected)
- `POST /offline` - Create offline booking (protected)
- `PATCH /:id/status` - Update appointment status (protected)

**Key Features:**
- **Serial Number Calculation**: For general appointments, serial numbers are calculated based on total bookings (online + offline) for the day
- **Time Slot Allocation**: 30 patients per 30-minute slot (11 AM - 5 PM)
- **Booking Window**: Opens at 5 PM for next day, closes at 8:15 AM on appointment day
- **Doctor Availability Check**: Validates doctor availability before allowing booking
- **Priority Appointments**: No serial numbers, flexible timing, mandatory online payment

#### 3. Doctor Availability (`/api/doctor-availability`)
- `GET /` - Check availability for a date
- `POST /` - Set availability (protected - Owner only)
- `GET /range` - Get availability for date range

**How it works:**
- Owner updates tomorrow's availability by 5 PM today
- System checks availability before allowing appointments
- Default consultation hours: 11 AM - 5 PM
- Operation hours: 5 AM - 10 AM

#### 4. Employees (`/api/employees`)
- `GET /` - Get all employees (protected - Owner/Manager)
- `GET /:id` - Get employee by ID
- `POST /` - Create employee (protected - Manager only)
- `PATCH /:id` - Update employee
- `DELETE /:id` - Delete employee
- `POST /:id/generate-creds` - Generate admin credentials

**Admin Credentials Generation:**
- Email format: `employeename@parthhospital.co.in`
- Password set manually by manager
- Can only be generated once per employee

#### 5. Attendance (`/api/attendance`)
- `POST /` - Create/update attendance (protected - Manager)
- `GET /` - Get attendance records (protected - Owner/Manager)
- `GET /weekly` - Get weekly attendance (protected)
- `GET /employee/:userId` - Get employee's attendance (protected)
- `POST /bulk` - Bulk upload attendance (protected - Manager)

**Attendance Structure:**
- Weekly-based records (Monday to Sunday)
- Status values: PRESENT, ABSENT, ON_LEAVE, OFF
- Supports bulk CSV/Excel upload

#### 6. Leave Management (`/api/leaves`)
- `GET /` - Get all leave requests (protected - Manager)
- `GET /my` - Get current user's leaves (protected - Employee)
- `POST /` - Apply for leave (protected - Employee)
- `PATCH /:id/status` - Approve/reject leave (protected - Manager)

#### 7. Inquiries (`/api/inquiries`)
- `POST /` - Create inquiry (public - from contact form)
- `GET /` - Get all inquiries (protected)
- `GET /:id` - Get inquiry by ID
- `PATCH /:id/status` - Update inquiry status (protected)
- `DELETE /:id` - Delete inquiry (protected - Owner/Manager)

#### 8. Gallery (`/api/gallery`)
- `GET /` - Get all gallery images
- `GET /:id` - Get image by ID
- `POST /` - Upload image (protected - multipart/form-data)
- `PATCH /:id` - Update image details
- `DELETE /:id` - Delete image (with Cloudinary cleanup)

**File Upload:**
- Uses Cloudinary for image storage
- Images uploaded to `parth-hospital` folder
- Automatic cleanup when deleting

#### 9. Achievements (`/api/achievements`)
- `GET /` - Get all achievements
- `GET /:id` - Get achievement by ID
- `POST /` - Create achievement (protected)
- `PATCH /:id` - Update achievement
- `DELETE /:id` - Delete achievement

#### 10. Prescriptions
**Note:** Prescriptions are frontend-only. No backend API exists. Prescriptions are created in the doctor's dashboard using local JSON medicine data and printed directly. No data is stored in the database.

**Frontend Implementation:**
- Medicine data stored in `frontend/lib/data/medicines.json`
- Prescription manager component: `frontend/components/prescription/prescription-manager.tsx`
- Print functionality only - no database storage

**Prescription Structure:**
- Stores medicines as JSON array
- Each medicine has: name, salt, dosage, frequency, duration, instructions
- Frontend has medicine search functionality

#### 11. Notifications (`/api/notifications`)
- `GET /` - Get user notifications (protected)
- `GET /unread-count` - Get unread count (protected)
- `PATCH /:id/read` - Mark as read (protected)
- `PATCH /read-all` - Mark all as read (protected)
- `DELETE /:id` - Delete notification (protected)

#### 12. Analytics (`/api/analytics`)
- `GET /owner` - Owner dashboard stats (protected - Owner)
- `GET /manager` - Manager dashboard stats (protected - Manager/Owner)
- `GET /receptionist` - Receptionist dashboard stats (protected)
- `GET /employee` - Employee dashboard stats (protected - Employee)

**Analytics Provided:**
- Appointment counts and trends
- Attendance statistics
- Staff presence data
- Department distribution
- Patient flow data
- Collection data (when payments are integrated)

#### 13. Hospital Details
**Note:** Hospital details are hardcoded in the frontend and displayed as read-only information. No backend API exists. The "Hospital Details" page shows fixed hospital information that doesn't change.

**Hospital Details Displayed:**
- Hospital name
- Address
- Phone
- Email
- Website

### Security Implementation

1. **JWT Authentication**
   - Tokens stored in localStorage (frontend)
   - Auto-injected in API requests via interceptor
   - Auto-logout on 401 responses

2. **Role-Based Access Control (RBAC)**
   - Roles: OWNER, MANAGER, RECEPTIONIST, ACCOUNTANT, EMPLOYEE
   - Middleware checks roles before allowing access
   - Different permissions for different roles

3. **Input Validation**
   - Zod schemas validate all request bodies
   - Type-safe validation with error messages

4. **Rate Limiting**
   - Configured via `@fastify/rate-limit`
   - Prevents brute-force attacks

5. **CORS**
   - Configured to allow specific origins
   - Credentials enabled for cookie support

6. **Helmet**
   - Security headers configured
   - Protects against common vulnerabilities

---

## Frontend Implementation

### API Client Architecture

**Location:** `frontend/lib/api/client.ts`

**Features:**
- Centralized API client using Fetch API
- Automatic JWT token injection
- Auto-logout on 401 errors
- Consistent error handling
- File upload support (multipart/form-data)

**Usage Pattern:**
```typescript
import { apiClient } from "@/lib/api/client"

// GET request
const response = await apiClient.get<DataType>("/endpoint", { query: "params" })

// POST request
const response = await apiClient.post<DataType>("/endpoint", { data })

// File upload
const formData = new FormData()
formData.append("file", file)
const response = await apiClient.uploadFile<DataType>("/endpoint", formData)
```

### API Service Modules

All API services are in `frontend/lib/api/`:

1. **auth.ts** - Authentication (login, register, get current user)
2. **appointment.ts** - Appointment management
3. **doctorAvailability.ts** - Doctor availability
4. **employee.ts** - Employee management
5. **attendance.ts** - Attendance management
6. **leave.ts** - Leave requests
7. **inquiry.ts** - Patient inquiries
8. **gallery.ts** - Gallery images
9. **achievement.ts** - Hospital achievements
10. **notification.ts** - Notifications
11. **analytics.ts** - Dashboard analytics

### Frontend Pages Integration

#### Public Pages

1. **Home Page** (`/`)
   - Static content, hospital information
   - Links to services, doctor info, booking

2. **Appointment Booking** (`/appointment`)
   - **Integrated Features:**
     - Doctor availability check via API
     - Booking window validation (5 PM - 8:15 AM)
     - Appointment creation via API
     - Serial number display for general appointments
     - Real-time booking status

3. **Contact Page** (`/contact`)
   - **Integrated Features:**
     - Contact form submission via API
     - Inquiry creation with type detection
     - Success/error handling

#### Admin Dashboards

**Owner Dashboard** (`/dashboard/admin/owner`)

1. **Overview** (`/dashboard/admin/owner/page.tsx`)
   - ✅ Integrated with analytics API
   - Shows: General/Priority appointments, Staff present, Revenue
   - Monthly trends chart
   - Daily distribution pie chart

2. **Doctor Availability** (`/dashboard/admin/owner/availability/page.tsx`)
   - ✅ Integrated with doctor availability API
   - Set tomorrow's availability
   - View availability status

3. **Appointments** (`/dashboard/admin/owner/appointments/page.tsx`)
   - ✅ Integrated with appointments API
   - View all appointments
   - Search and filter functionality

4. **Employees** (`/dashboard/admin/owner/employees/page.tsx`)
   - ✅ Integrated with employees API
   - Read-only view
   - Search functionality

5. **Attendance** (`/dashboard/admin/owner/attendance/page.tsx`)
   - ✅ Integrated with attendance API
   - View weekly attendance
   - Attendance trends

6. **Inquiry** (`/dashboard/admin/owner/inquiry/page.tsx`)
   - ✅ Integrated with inquiries API
   - View all inquiries
   - Search functionality

7. **Gallery** (`/dashboard/admin/owner/gallery/page.tsx`)
   - ✅ Integrated with gallery API
   - Upload images (Cloudinary)
   - View, update, delete images

8. **Achievements** (`/dashboard/admin/owner/achievements/page.tsx`)
   - ✅ Integrated with achievements API
   - Add, view, delete achievements

9. **Prescription** (`/dashboard/admin/owner/prescription/page.tsx`)
   - ✅ Frontend-only (no backend API)
   - Medicine search from local JSON data
   - Create and print prescriptions directly (no database storage)

10. **Hospital Details** (`/dashboard/admin/owner/settings/page.tsx`)
    - ✅ Frontend-only (no backend API)
    - Read-only display of hospital information
    - Hardcoded hospital details (not editable)

**Manager Dashboard** (`/dashboard/admin/manager`)

1. **Overview** (`/dashboard/admin/manager/page.tsx`)
   - ✅ Integrated with analytics API
   - Shows: Total employees, Present today, Pending approvals, On leave
   - Weekly attendance charts
   - Department distribution

2. **Employees** (`/dashboard/admin/manager/employees/page.tsx`)
   - ✅ Integrated with employees API
   - Add employees manually
   - Generate admin credentials
   - View all employees

3. **Attendance** (`/dashboard/admin/manager/attendance/page.tsx`)
   - ✅ Integrated with attendance API
   - **CSV/Excel Bulk Upload:**
     - Uses `xlsx` library for parsing
     - Supports CSV and Excel files (.xlsx, .xls)
     - Validates employee IDs
     - Maps status values (Present → PRESENT, etc.)
     - Shows success/failure counts
   - View weekly attendance table
   - Attendance trends charts

4. **Leave Requests** (`/dashboard/admin/manager/leaves/page.tsx`)
   - ✅ Integrated with leave API
   - View pending leave requests
   - Approve/reject with comments

5. **Inquiry** (`/dashboard/admin/manager/inquiry/page.tsx`)
   - ✅ Integrated with inquiries API
   - View and manage inquiries
   - Update inquiry status

6. **Gallery** (`/dashboard/admin/manager/gallery/page.tsx`)
   - ✅ Integrated with gallery API
   - Same functionality as Owner gallery

7. **Achievements** (`/dashboard/admin/manager/achievements/page.tsx`)
   - ✅ Integrated with achievements API
   - Same functionality as Owner achievements

**Receptionist Dashboard** (`/dashboard/admin/receptionist`)

1. **Overview** (`/dashboard/admin/receptionist/page.tsx`)
   - ✅ Integrated with analytics API
   - Patient flow charts
   - Collection data
   - Payment method distribution

2. **Current Bookings** (`/dashboard/admin/receptionist/current-bookings/page.tsx`)
   - ✅ Integrated with appointments API
   - View today's bookings (online + offline)
   - Summary cards: Total, Online, Offline, Priority
   - Add offline booking (no patient details required)
   - Update appointment status (Pending → Arrived → Consulting → Completed)
   - Search functionality

3. **Tokens** (`/dashboard/admin/receptionist/tokens/page.tsx`)
   - ✅ Integrated with appointments API
   - Shows current token, waiting count, total today
   - Patient queue with serial numbers
   - "Next" button to call next patient
   - Status update functionality

4. **Bookings** (`/dashboard/admin/receptionist/bookings/page.tsx`)
   - ✅ Integrated with appointments API
   - View all bookings (historical)
   - Search and filter by status/type
   - Shows token, patient info, date, time, status, type, booking type

5. **Inquiry** (`/dashboard/admin/receptionist/inquiry/page.tsx`)
   - ✅ Integrated with inquiries API
   - View and respond to inquiries
   - Update inquiry status

**Employee Dashboard** (`/dashboard/employee`)

1. **Overview** (`/dashboard/employee/page.tsx`)
   - ✅ Integrated with analytics API
   - Employee information
   - Attendance summary
   - Leave summary
   - Weekly attendance charts

2. **Attendance** (`/dashboard/employee/attendance/page.tsx`)
   - ✅ Integrated with attendance API
   - View weekly attendance
   - Attendance history
   - Uses employee-specific endpoint

3. **Leave** (`/dashboard/employee/leave/page.tsx`)
   - ✅ Integrated with leave API
   - View leave history
   - Apply for leave
   - Uses `getMyLeaveRequests()` endpoint

4. **Profile** (`/dashboard/employee/profile/page.tsx`)
   - ✅ Integrated with `/auth/me` endpoint
   - View employee profile
   - Shows join date and days of service
   - Note about additional fields requiring HR updates

### CSV/Excel Parsing Implementation

**Location:** `frontend/app/dashboard/admin/manager/attendance/page.tsx`

**How it works:**

1. **File Selection**: User selects CSV or Excel file
2. **File Parsing**: 
   - Uses `xlsx` library
   - Reads file as ArrayBuffer (Excel) or Text (CSV)
   - Converts to JSON using `XLSX.utils.sheet_to_json()`
3. **Data Validation**:
   - Normalizes column names (handles variations like "Mon" vs "Monday")
   - Maps status values (Present → PRESENT, Absent → ABSENT, etc.)
   - Validates employee IDs against system
4. **Employee ID Mapping**:
   - Fetches all employees from API
   - Creates map from employeeId to userId
   - Validates each row's employee ID
5. **Data Transformation**:
   - Converts parsed data to attendance record format
   - Includes weekStartDate from selected week
   - Maps all 7 days (Monday-Sunday)
6. **Bulk Upload**:
   - Sends all records to `/api/attendance/bulk` endpoint
   - Shows success/failure counts
   - Reloads attendance data after upload

**Expected File Format:**
- Columns: Employee ID, Name, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
- Status values: Present, Absent, On Leave, Off (case-insensitive)
- First row should contain headers

---

## Database Schema

### Key Models

1. **User** - All system users (Owner, Manager, Employees, etc.)
2. **Employee** - Employee-specific data (employeeId, etc.)
3. **Appointment** - Patient appointments
4. **Payment** - Payment records (structure ready, integration pending)
5. **DoctorAvailability** - Doctor availability calendar
6. **LeaveRequest** - Employee leave requests
7. **Attendance** - Weekly attendance records
8. **Inquiry** - Patient inquiries from contact form
9. **Gallery** - Hospital gallery images
10. **Achievement** - Hospital achievements
11. **Notification** - User notifications

### Relationships

- User ↔ Employee (One-to-One)
- User ↔ Appointment (One-to-Many via createdBy)
- Appointment ↔ Payment (One-to-One)
- User ↔ LeaveRequest (One-to-Many via employeeId)
- User ↔ Attendance (One-to-Many via userId)
- User ↔ Notification (One-to-Many)

---

## API Integration

### Authentication Flow

1. **Login:**
   ```
   Frontend → POST /api/auth/login
   Backend → Validates credentials → Returns JWT token + user data
   Frontend → Stores token in localStorage → Redirects to dashboard
   ```

2. **Protected Requests:**
   ```
   Frontend → Adds "Authorization: Bearer <token>" header
   Backend → Middleware verifies token → Extracts user info → Attaches to request
   Controller → Uses request.user for authorization
   ```

3. **Auto-Logout:**
   ```
   Backend → Returns 401 (token expired/invalid)
   Frontend → Interceptor detects 401 → Removes token → Redirects to /login
   ```

### Error Handling

**Backend:**
- Centralized error handler (`errorHandler` middleware)
- Consistent error response format:
  ```json
  {
    "success": false,
    "message": "Error message",
    "errors": [] // For validation errors
  }
  ```

**Frontend:**
- API client catches errors
- Toast notifications for user feedback
- Console logging for debugging

### File Upload Flow

1. **Gallery Image Upload:**
   ```
   Frontend → Creates FormData → Adds image file
   Frontend → POST /api/gallery (multipart/form-data)
   Backend → Receives file via @fastify/multipart
   Backend → Uploads to Cloudinary → Gets URL
   Backend → Saves URL to database → Returns gallery record
   ```

2. **Attendance CSV Upload:**
   ```
   Frontend → User selects file
   Frontend → Parses file with xlsx library
   Frontend → Validates and transforms data
   Frontend → POST /api/attendance/bulk (JSON array)
   Backend → Validates all records → Bulk upsert → Returns results
   ```

---

## Features Implemented

### ✅ Public Website Features

1. **Appointment Booking**
   - Real-time doctor availability check
   - Booking window validation (5 PM - 8:15 AM)
   - Serial number assignment for general appointments
   - Time slot calculation (30 patients per 30 minutes)
   - Payment method selection
   - Appointment confirmation with ticket

2. **Contact Form**
   - Inquiry submission
   - Type detection (General, Appointment, Emergency)
   - Success/error handling

### ✅ Admin Features

1. **Owner Dashboard**
   - Complete analytics integration
   - Doctor availability management
   - Appointment viewing and filtering
   - Employee viewing (read-only)
   - Attendance viewing (read-only)
   - Inquiry management
   - Gallery management with Cloudinary
   - Achievement management
   - Prescription creation (frontend-only, print directly)
   - Hospital details display (read-only)

2. **Manager Dashboard**
   - Complete analytics integration
   - Employee management (CRUD)
   - Admin credentials generation
   - Attendance management with CSV/Excel bulk upload
   - Leave request approval/rejection
   - Inquiry management
   - Gallery and achievement management

3. **Receptionist Dashboard**
   - Complete analytics integration
   - Current bookings management
   - Offline booking creation
   - Appointment status updates
   - Token/queue management
   - Historical bookings view
   - Inquiry management

4. **Employee Portal**
   - Dashboard with personal stats
   - Attendance viewing
   - Leave application
   - Profile viewing

### ✅ System Features

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - Secure password hashing
   - Session management

2. **Notifications System**
   - Real-time notification fetching
   - Unread count tracking
   - Mark as read functionality
   - Notification deletion

3. **File Management**
   - Cloudinary integration for images
   - CSV/Excel parsing for bulk uploads
   - File validation and error handling

4. **Analytics**
   - Role-specific dashboard statistics
   - Appointment trends
   - Attendance analytics
   - Department distribution
   - Patient flow data

---

## File Structure

### Backend Key Files

```
backend/
├── src/
│   ├── app.ts                    # Main Fastify application
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   ├── env.ts                # Environment variables
│   │   └── database.ts           # Prisma client
│   ├── routes/                   # All API routes
│   │   ├── auth.ts
│   │   ├── appointment.ts
│   │   ├── employee.ts
│   │   ├── attendance.ts
│   │   ├── leave.ts
│   │   ├── inquiry.ts
│   │   ├── gallery.ts
│   │   ├── achievement.ts
│   │   ├── notification.ts
│   │   └── analytics.ts
│   ├── controllers/             # Request handlers
│   ├── services/                 # Business logic
│   ├── validators/               # Zod schemas
│   ├── middleware/
│   │   ├── auth.ts               # JWT verification, RBAC
│   │   └── errorHandler.ts      # Error handling
│   └── utils/
│       └── cloudinary.ts         # Cloudinary integration
└── prisma/
    └── schema.prisma             # Database schema
```

### Frontend Key Files

```
frontend/
├── app/
│   ├── page.tsx                  # Home page
│   ├── appointment/page.tsx      # Public booking
│   ├── contact/page.tsx          # Contact form
│   ├── login/page.tsx            # Login page
│   └── dashboard/                 # All dashboard pages
│       ├── admin/
│       │   ├── owner/            # Owner pages
│       │   ├── manager/          # Manager pages
│       │   └── receptionist/      # Receptionist pages
│       └── employee/             # Employee pages
├── components/
│   ├── layouts/                  # Layout components
│   ├── ui/                       # UI components
│   ├── login-form.tsx            # Login component
│   ├── notifications-modal.tsx   # Notifications
│   └── dashboard-header.tsx      # Dashboard header
└── lib/
    ├── api/                      # API client modules
    │   ├── client.ts             # Base API client
    │   ├── auth.ts
    │   ├── appointment.ts
    │   ├── employee.ts
    │   ├── attendance.ts
    │   └── ... (all API modules)
    ├── auth.ts                    # Auth utilities
    └── utils/                     # Helper functions
```

---

## How It Works

### Appointment Booking Flow

1. **User visits booking page** → Frontend checks booking window
2. **Booking window check:**
   - Current time < 5 PM → Shows "Window not open yet"
   - Current time >= 5 PM → Checks doctor availability
   - Doctor not available → Shows "Doctor not attending tomorrow"
   - Doctor available → Allows booking
3. **User fills form** → Selects appointment type (General/Priority)
4. **Form submission:**
   - For General: Calculates serial number based on total bookings
   - For Priority: No serial number, flexible timing
5. **Backend creates appointment:**
   - Validates booking window
   - Checks doctor availability
   - Calculates serial number and time slot (if General)
   - Creates appointment record
6. **Frontend displays confirmation** → Shows serial number and arrival time

### Attendance Upload Flow

1. **Manager selects CSV/Excel file**
2. **Frontend parses file:**
   - Reads file content
   - Converts to JSON array
   - Normalizes column names
3. **Data validation:**
   - Fetches all employees from API
   - Creates employeeId → userId mapping
   - Validates each row's employee ID
   - Maps status values to enum
4. **Data transformation:**
   - Converts to attendance record format
   - Adds weekStartDate
   - Maps all 7 days
5. **Bulk upload:**
   - Sends array to `/api/attendance/bulk`
   - Backend validates and upserts all records
   - Returns success/failure counts
6. **Frontend reloads attendance table** → Shows updated data

### Notification System Flow

1. **Backend creates notification** (when events occur):
   - New appointment → Creates notification for Owner/Receptionist
   - Leave request → Creates notification for Manager
   - (Can be extended for more events)
2. **Frontend fetches notifications:**
   - Dashboard header loads unread count on mount
   - Refreshes every 30 seconds
   - Notifications modal loads all notifications when opened
3. **User interactions:**
   - Mark as read → Updates notification in database
   - Mark all as read → Bulk update
   - Delete → Removes notification

### Role-Based Access Control

1. **User logs in** → Receives JWT token with role
2. **Frontend stores token** → In localStorage
3. **API requests** → Token automatically added to headers
4. **Backend middleware:**
   - `verifyToken` → Validates JWT, extracts user info
   - `requireRole` → Checks if user role is in allowed roles
5. **Access granted/denied** → Based on role permissions

---

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development
API_PREFIX=/api

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_TIME_WINDOW=60000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Testing the System

### Backend Testing

1. **Start backend:**
   ```bash
   cd backend
   npm install
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

2. **Default users (from seed):**
   - Owner: email from seed, password: "Owner123"
   - Manager: email from seed, password: "Manager123"
   - Receptionist: email from seed, password: "Receptionist123"

### Frontend Testing

1. **Start frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Access:**
   - Public site: http://localhost:3000
   - Login: http://localhost:3000/login
   - Dashboards: After login, redirected based on role

### API Testing

Use Postman or similar tool:
- Base URL: `http://localhost:5000/api`
- For protected routes: Add `Authorization: Bearer <token>` header
- Get token from login endpoint first

---

## Key Implementation Details

### Serial Number Calculation

**Location:** `backend/src/services/appointment.service.ts`

```typescript
function calculateSerialNumberAndTime(totalBookings: number) {
  const serialNumber = totalBookings + 1
  const slotIndex = Math.floor((serialNumber - 1) / 30)
  const slotHour = 11 + Math.floor(slotIndex * 0.5)
  const slotMinute = (slotIndex % 2) * 30
  const maxHour = 17
  const finalHour = Math.min(slotHour, maxHour)
  const finalMinute = finalHour === maxHour ? 0 : slotMinute
  const slotTime = `${String(finalHour).padStart(2, "0")}:${String(finalMinute).padStart(2, "0")}`
  return { serialNumber, arrivalTime: slotTime, slotTime }
}
```

**Logic:**
- 30 patients per 30-minute slot
- Serial 1-30: 11:00 AM
- Serial 31-60: 11:30 AM
- Serial 61-90: 12:00 PM
- And so on until 5:00 PM

### Booking Window Logic

**Location:** `frontend/lib/utils/appointment.ts`

```typescript
// Window opens: After 5 PM today
// Window closes: 8:15 AM on appointment day
// Checks doctor availability before allowing booking
```

### CSV/Excel Parsing

**Location:** `frontend/app/dashboard/admin/manager/attendance/page.tsx`

**Key Functions:**
- `parseFile()` - Reads and parses file
- `normalizeColumnName()` - Handles column name variations
- `mapStatusToEnum()` - Converts text to enum values
- `handleUpload()` - Orchestrates the entire upload process

---

## What's NOT Implemented

1. **Payment System**
   - Razorpay integration (deferred)
   - Payment webhooks
   - Payment status tracking
   - Payment history

2. **Salary Management**
   - Salary model exists but not fully implemented
   - Salary upload/processing
   - Salary reports

3. **Accountant Dashboard Features**
   - Most features depend on payment system
   - Will be implemented after payment integration

---

## Summary

The Parth Hospital ERP system is **fully integrated** end-to-end (excluding payments). All major features are implemented:

- ✅ Complete backend API with 13 route modules
- ✅ Full frontend integration with all dashboard pages
- ✅ Authentication and authorization
- ✅ File uploads (Cloudinary for images, CSV/Excel for attendance)
- ✅ Real-time notifications
- ✅ Analytics dashboards for all roles
- ✅ Appointment booking with serial numbers
- ✅ Attendance management with bulk upload
- ✅ Leave management
- ✅ Employee management
- ✅ Inquiry management
- ✅ Gallery and achievements
- ✅ Prescription creation (frontend-only, print functionality)
- ✅ Hospital details display (read-only, hardcoded)

The system is production-ready (excluding payment flows) and can be deployed after setting up environment variables and database.

---

**Documentation Created:** January 2025  
**System Version:** 1.0  
**Status:** Complete (Payment Excluded)
