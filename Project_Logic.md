# Parth Hospital ERP - Business Logic Documentation

**Last Updated:** January 2025
**Purpose:** Non-technical explanation of system business rules and logic

---

## Table of Contents

1. [Appointment Booking System](#appointment-booking-system)
2. [Payment System](#payment-system)
3. [Doctor Availability](#doctor-availability)
4. [Serial Number & Time Slot System](#serial-number--time-slot-system)
5. [Attendance Management](#attendance-management)
6. [Employee Management](#employee-management)
7. [Leave Management](#leave-management)
8. [Role-Based Access](#role-based-access)
9. [Inquiry Management](#inquiry-management)
10. [Other Features](#other-features)

---

## Appointment Booking System

### Booking Window

**When can patients book appointments?**

- **Booking opens:** 5:00 PM today
- **Booking closes:** 8:15 AM on the appointment day
- **What can be booked:** Only next day's appointments (tomorrow)
- **Example:** 
  - If today is January 10th at 6:00 PM, patients can book for January 11th
  - If today is January 11th at 7:00 AM, patients can still book for January 11th (until 8:15 AM)
  - If today is January 11th at 9:00 AM, booking window is closed (must wait until 5:00 PM to book for January 12th)

**Why this window?**
- Doctor updates availability by 5:00 PM each day
- Booking closes at 8:15 AM to allow time for final preparations
- Ensures doctor knows patient count before the day starts

### Appointment Types

#### 1. General Appointment

**Features:**
- Cost: ₹500
- Payment options: Online payment OR Pay at counter
- Gets a serial number (1, 2, 3, 4...)
- Gets a specific arrival time based on serial number
- Can be booked online or offline (by receptionist)

**Serial Number Assignment:**
- Serial numbers are assigned in order (1, 2, 3, 4...)
- Counts all general appointments for that day (online + offline)
- Priority appointments are NOT counted
- Example: If 5 general appointments already exist, new booking gets serial #6

**Time Slots:**
- Consultation hours: 11:00 AM to 5:00 PM
- 30 patients per 30-minute slot
- Serial 1-30: Arrive at 11:00 AM
- Serial 31-60: Arrive at 11:30 AM
- Serial 61-90: Arrive at 12:00 PM
- Serial 91-120: Arrive at 12:30 PM
- And so on until 5:00 PM

#### 2. Priority Appointment

**Features:**
- Cost: ₹1,000
- Payment: **MUST be online only** (cannot pay at counter)
- No serial number assigned
- Can come at any time during consultation hours (11 AM - 5 PM)
- Preferred time can be selected (but not mandatory)

**Preferred Time Selection:**
- Only between 11:00 AM and 5:00 PM
- Minutes: Only 00 and 30 allowed
- Examples: 11:00, 11:30, 12:00, 12:30, 1:00, 1:30... up to 5:00
- Cannot select: 11:15, 12:45, etc.

**Why Priority?**
- Patients pay more for flexibility
- No need to wait in queue
- Can arrive at preferred time

### Offline Bookings

**Who can create offline bookings?**
- Receptionist only

**When is it used?**
- Patient comes to hospital directly
- Patient doesn't have internet access
- Patient prefers to book in person

**What information is required?**
- Only appointment type (General or Priority)
- No patient details needed (can be added later or not at all)
- Payment method: Always "Pay at Counter"

**How does it affect serial numbers?**
- Offline general bookings ARE counted in serial number calculation
- If 3 online + 2 offline general bookings exist, next online booking gets serial #6
- This ensures proper time slot allocation

### Appointment Status Flow

1. **PENDING** - Appointment created, patient hasn't arrived
2. **ARRIVED** - Patient has arrived at hospital
3. **CONSULTING** - Patient is currently with doctor
4. **COMPLETED** - Consultation finished
5. **CANCELLED** - Appointment cancelled

**Who can update status?**
- Receptionist can update status
- Status updates help track patient flow

---

## Payment System

### Payment Methods

#### 1. Online Payment

**Current Status:**
- Using dummy payment system for testing
- Real Razorpay integration pending

**How it works (Dummy):**
- Patient selects "Online Payment"
- Modal opens showing fees (₹500 for General, ₹1,000 for Priority)
- Patient enters: `parth@upi.id`
- Clicks "Pay"
- Payment marked as SUCCESS
- Appointment ticket shows "Online Paid"

**Payment Status:**
- **PENDING** - Payment initiated but not completed
- **SUCCESS** - Payment completed successfully
- **FAILED** - Payment failed

**Who can view payments?**
- Doctor
- Accountant
- Receptionist

**What can they see?**
- All online payments from website
- Payment amount, method, status
- Associated appointment details
- Payment statistics (today, this month, pending, success rate)
- Can export to CSV

#### 2. Pay at Counter

**Features:**
- No online payment required
- Patient pays when they arrive
- Payment is NOT tracked in system
- Only appointment record is created
- Available only for General appointments

**Why not tracked?**
- Payment happens at hospital
- No need to track in online system
- Reduces complexity

### Payment Rules

1. **General Appointment:**
   - Can choose: Online (₹500) OR Pay at Counter
   - If online: Payment tracked in system
   - If at counter: Not tracked

2. **Priority Appointment:**
   - **MUST** choose online payment (₹1,000)
   - Cannot pay at counter
   - Payment always tracked

---

## Doctor Availability

### Default Behavior

**Doctor is available by default:**
- If no availability record exists for a date, doctor is considered available
- Owner only needs to mark dates when doctor is NOT available

### Availability Management

**Who can manage?**
- Owner only

**When to update?**
- Must update by 5:00 PM today for tomorrow's availability
- Cannot update after 5:00 PM (booking window opens)

**How it works:**
- Owner marks doctor as "Available" or "Not Available" for tomorrow
- If marked "Not Available", booking window closes for that date
- If marked "Available" (or not marked), booking window opens at 5:00 PM

**Example:**
- Today is January 10th, 4:00 PM
- Owner marks doctor as "Not Available" for January 11th
- At 5:00 PM, booking window does NOT open
- Patients see: "Doctor is not attending tomorrow"

### Consultation Hours

- **Regular hours:** 11:00 AM to 5:00 PM
- **Operation hours:** 5:00 AM to 10:00 AM (not for appointments)

---

## Serial Number & Time Slot System

### How Serial Numbers Work

**Calculation:**
1. Count all General appointments for the date (online + offline)
2. Add 1 to get next serial number
3. Example: 5 existing general bookings → Next booking gets serial #6

**What is NOT counted:**
- Priority appointments (they don't get serial numbers)
- Cancelled appointments (if cancelled, they don't count)

**Order:**
- Appointments displayed in ascending order (1, 2, 3, 4...)
- Oldest appointments first
- Newest appointments last

### Time Slot Calculation

**Formula:**
- 30 patients per 30-minute slot
- Slot number = (Serial Number - 1) ÷ 30 (rounded down)
- Time = 11:00 AM + (Slot Number × 30 minutes)

**Examples:**
- Serial #1: Slot 0 → 11:00 AM
- Serial #30: Slot 0 → 11:00 AM
- Serial #31: Slot 1 → 11:30 AM
- Serial #60: Slot 1 → 11:30 AM
- Serial #61: Slot 2 → 12:00 PM
- Serial #90: Slot 2 → 12:00 PM
- And so on...

**Maximum:**
- Last slot ends at 5:00 PM
- If more than 360 patients book, they still get 5:00 PM slot

---

## Attendance Management

### Date-Range Based System

**How it works:**
- Each attendance record represents one day for one employee
- Not weekly-based anymore
- Manager or Receptionist selects a date range (1 to 31 days)
- Uploads Excel/CSV file with attendance for that range

### Excel/CSV Format

**Required Columns:**
- Employee ID (e.g., EMP01, EMP02)
- Employee Name
- Date columns (one column per date)

**Date Format:**
- Preferred: DD-MM-YYYY (e.g., 11-01-2026)
- Also accepted: DD/MM/YYYY (e.g., 11/01/2026)
- Or just day number (11, 12, 13...) if month/year is clear from context

**Status Values:**
- **P** = Present
- **A** = Absent
- **L** = On Leave
- **O** = Off

**Example Excel:**
```
Employee ID | Employee Name | 11-01-2026 | 12-01-2026 | 13-01-2026
EMP01      | John Doe      | P          | P          | A
EMP02      | Jane Smith    | P          | A          | P
```

### Date Range Rules

- **Minimum:** 1 day
- **Maximum:** 31 days
- **Any range allowed:** Can select any start and end date (within 31 days)
- **Overlapping dates:** Can upload same date multiple times (updates existing record)

### Who Can Upload?

- **Manager:** Can upload attendance
- **Receptionist:** Can also upload attendance (same permissions as Manager)

### Viewing Attendance

- **Manager/Receptionist:** Can view all employees' attendance
- **Employee:** Can only view their own attendance
- **Owner:** Can view all attendance (read-only)

---

## Employee Management

### Employee Creation

**Who can create?**
- Manager only

**Required Information:**
- Name
- Email (for admin access)
- Phone
- Department
- Position
- Role (Doctor, Manager, Accountant, Receptionist, Employee)

**Employee ID:**
- Automatically generated (e.g., EMP01, EMP02, EMP03...)
- Format: EMP + sequential number
- Unique for each employee

### Admin Credentials

**What are admin credentials?**
- Separate login for employee portal
- Different from main admin account

**Email Format:**
- `employeename@parthhospital.co.in`
- Example: `john.doe@parthhospital.co.in`

**Password:**
- Set manually by Manager
- Can only be generated once per employee

**Why two accounts?**
- Main account: For admin dashboard access
- Employee account: For employee portal (attendance, leave, profile)

---

## Leave Management

### Leave Application

**Who can apply?**
- Employees only (using employee portal)

**Required Information:**
- Start date
- End date
- Reason
- Number of days (calculated automatically)

### Leave Approval

**Who can approve?**
- Manager only

**Status Options:**
- **PENDING** - Awaiting approval
- **APPROVED** - Leave granted
- **REJECTED** - Leave denied

**Approval Process:**
1. Employee applies for leave
2. Manager sees leave request
3. Manager approves or rejects
4. Manager can add comments
5. Employee sees updated status

### Leave Types

**On Leave:**
- Employee is on approved leave
- Shown in attendance as "ON_LEAVE"

**Off:**
- Employee is off (not working day)
- Shown in attendance as "OFF"

---

## Role-Based Access

### Roles in System

1. **OWNER**
   - Full access to everything
   - Can manage doctor availability
   - Can view all data (read-only for some)
   - Cannot create employees (Manager does this)

2. **MANAGER**
   - Can create and manage employees
   - Can upload attendance
   - Can approve/reject leaves
   - Can manage inquiries
   - Can manage gallery and achievements

3. **DOCTOR**
   - Can view all appointments
   - Can view payments
   - Can manage doctor availability
   - Can view employees
   - Can view attendance

4. **ACCOUNTANT**
   - Can view payments
   - Can view financial data
   - Salary management (pending implementation)

5. **RECEPTIONIST**
   - Can create offline bookings
   - Can update appointment status
   - Can view current bookings
   - Can manage token queue
   - Can upload attendance (same as Manager)
   - Can view payments
   - Can view employees (for attendance upload)

6. **EMPLOYEE**
   - Can view own attendance
   - Can apply for leave
   - Can view own profile
   - Can use NexRoutine (todos and notes)

### Access Rules Summary

| Feature | Owner | Manager | Doctor | Accountant | Receptionist | Employee |
|---------|-------|---------|--------|------------|--------------|----------|
| View Appointments | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Create Offline Booking | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Upload Attendance | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| View Payments | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Manage Employees | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Approve Leaves | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Availability | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| View Own Attendance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Apply for Leave | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Inquiry Management

### Inquiry Types

**Automatic Detection:**
- System detects inquiry type from message content
- **GENERAL** - Regular inquiry
- **APPOINTMENT** - Related to booking
- **EMERGENCY** - Urgent inquiry

### Inquiry Status

- **PENDING** - Not yet responded
- **RESPONDED** - Response sent

### Who Can Manage?

- **Owner:** Can view, respond, delete
- **Manager:** Can view, respond, delete
- **Receptionist:** Can view, respond, update status

---

## Other Features

### Gallery Management

**What is it?**
- Hospital photo gallery
- Images stored in Cloudinary (not in database)
- Database only stores image URLs

**Who can manage?**
- Owner
- Manager

**Features:**
- Upload images
- Organize in albums
- Add titles and descriptions
- Delete images (also removes from Cloudinary)

### Achievements

**What is it?**
- Hospital and doctor achievements
- Displayed on website

**Who can manage?**
- Owner
- Manager

**Features:**
- Add achievement
- Set date
- Add description
- Delete achievement

### Prescriptions

**How it works:**
- Frontend-only feature
- No data stored in database
- Doctor creates prescription
- Prints directly
- Medicine data from local JSON file

**Why not in database?**
- Prescriptions are printed documents
- No need to store
- Reduces database size

### Notifications

**When are notifications created?**
- New appointment → Notifies Owner and Receptionist
- Leave request → Notifies Manager
- (Can be extended for more events)

**Features:**
- Unread count badge
- Mark as read
- Mark all as read
- Delete notification

### NexRoutine (Todos & Notes)

**What is it?**
- Personal task and note management
- Available to all users

**Todos:**
- Create tasks
- Set priority (Low, Medium, High)
- Set due dates
- Mark as completed

**Notes:**
- Create notes
- Color-code notes
- Add titles and content

**Purpose:**
- Personal productivity tool
- Not shared with others
- Each user has their own todos and notes

---

## Summary of Key Business Rules

1. **Booking Window:** 5:00 PM today to 8:15 AM tomorrow (for tomorrow's appointments)
2. **Doctor Availability:** Available by default, must mark as unavailable if not attending
3. **General Appointments:** ₹500, get serial number, can pay online or at counter
4. **Priority Appointments:** ₹1,000, must pay online, no serial number, flexible timing (11 AM - 5 PM, 00/30 minutes only)
5. **Serial Numbers:** Assigned in order (1, 2, 3...), count all general bookings (online + offline)
6. **Time Slots:** 30 patients per 30-minute slot, starting at 11:00 AM
7. **Attendance:** Date-range based (1-31 days), Manager and Receptionist can upload
8. **Payments:** Only online payments tracked, at-counter payments not tracked
9. **Ordering:** Appointments displayed in ascending order (oldest first)
10. **Roles:** Each role has specific permissions (see Role-Based Access table)

---

**Documentation Created:** January 2025  
**Purpose:** Business logic reference for non-technical stakeholders
