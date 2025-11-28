# StudentStudy - Homework Reminder Web App
## Complete Specification Sheet
**Version:** 1.0  
**Date:** November 27, 2025  
**Tech Stack:** HTML, CSS, JavaScript, React, Firebase

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [User Roles & Authentication](#2-user-roles--authentication)
3. [Core Features](#3-core-features)
4. [User Interface Design](#4-user-interface-design)
5. [Data Models](#5-data-models)
6. [Component Architecture](#6-component-architecture)
7. [Page Structure & Routes](#7-page-structure--routes)
8. [Firebase Configuration](#8-firebase-configuration)
9. [Technical Requirements](#9-technical-requirements)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Project Overview

### 1.1 Product Name
**StudentStudy**

### 1.2 Product Description
StudentStudy is a homework reminder and grade tracking web application designed for high school and college/university students. The app allows students to manage their assignments, track their progress, monitor grades, and receive timely reminders. Teachers can post assignments and monitor student homework status.

### 1.3 Target Audience
- **Primary:** High school students (grades 9-12, ages 14-18)
- **Secondary:** College/University students
- **Tertiary:** Teachers

### 1.4 Expected Scale
- Approximately 500 users (one school)
- Multi-device support with real-time sync

### 1.5 Key Value Propositions
- Centralized homework management
- Smart reminder system with escalating urgency
- Progress tracking (Not Started → In Progress → Completed)
- Teacher-student class connectivity
- Cross-device synchronization
- Calendar visualization of deadlines

---

## 2. User Roles & Authentication

### 2.1 User Types

#### 2.1.1 Students
| Capability | Description |
|------------|-------------|
| Self-register | Create account with student ID + password |
| Join classes | Added by teachers using student ID |
| Manage assignments | Add personal assignments, view teacher-posted assignments |
| Track progress | Update status: Not Started → In Progress → Completed |
| Input grades | Manually enter grades as percentages |
| View calendar | See all assignments on calendar view |
| Receive reminders | In-app notifications for upcoming deadlines |
| Set recurring homework | Create repeating assignments |

#### 2.1.2 Teachers
| Capability | Description |
|------------|-------------|
| Self-register | Create account with teacher ID + password |
| Create classes | Set up class with name and subject |
| Add students | Add students to class by student ID |
| Post assignments | Create assignments for entire class |
| Define milestones | Set milestones for long-term projects |
| View student status | See homework completion status of students |

### 2.2 Authentication System

#### 2.2.1 Registration Flow
```
┌─────────────────────────────────────────────────────────┐
│                    REGISTRATION                         │
├─────────────────────────────────────────────────────────┤
│  1. User selects role (Student / Teacher)               │
│  2. User enters:                                        │
│     - Full Name                                         │
│     - Student ID / Teacher ID                           │
│     - Email (for password recovery)                     │
│     - Password (min 8 chars, 1 number, 1 special)       │
│     - Confirm Password                                  │
│  3. System validates ID uniqueness                      │
│  4. Account created → Redirect to Dashboard             │
└─────────────────────────────────────────────────────────┘
```

#### 2.2.2 Login Flow
```
┌─────────────────────────────────────────────────────────┐
│                      LOGIN                              │
├─────────────────────────────────────────────────────────┤
│  1. User enters Student ID / Teacher ID                 │
│  2. User enters Password                                │
│  3. System authenticates via Firebase Auth              │
│  4. Success → Redirect to Dashboard                     │
│  5. Failure → Show error message                        │
└─────────────────────────────────────────────────────────┘
```

#### 2.2.3 Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

---

## 3. Core Features

### 3.1 Assignment Management

#### 3.1.1 Assignment Types
| Type | Description | Features |
|------|-------------|----------|
| Daily Homework | Regular assignments | Due date, single deadline |
| Long-term Project | Extended assignments | Milestones, multiple checkpoints |
| Recurring | Repeating assignments | Weekly/custom repeat pattern |

#### 3.1.2 Assignment Data Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | String | Yes | Assignment name |
| Subject/Class | Reference | Yes | Associated class |
| Due Date | DateTime | Yes | Deadline |
| Due Time | Time | No | Specific time (default: 11:59 PM) |
| Description | Text | No | Instructions/details |
| Status | Enum | Yes | Not Started / In Progress / Completed |
| Type | Enum | Yes | Daily / Project / Recurring |
| Milestones | Array | Project only | Sub-deadlines for projects |
| Recurrence | Object | Recurring only | Repeat pattern |
| Created By | Reference | Yes | Student or Teacher |
| Is Overdue | Boolean | Auto | True if past due date & not completed |

#### 3.1.3 Assignment Status Flow
```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ NOT STARTED  │ ───► │ IN PROGRESS  │ ───► │  COMPLETED   │
│   (Gray)     │      │   (Yellow)   │      │   (Green)    │
└──────────────┘      └──────────────┘      └──────────────┘
                                                   │
                      ┌──────────────┐             │
                      │   OVERDUE    │ ◄───────────┘
                      │    (Red)     │   (if past due date
                      └──────────────┘    & not completed)
```

#### 3.1.4 Recurring Assignment Options
| Pattern | Example |
|---------|---------|
| Daily | Every day |
| Weekly | Every Monday |
| Bi-weekly | Every other Tuesday |
| Monthly | First day of month |
| Custom | Select specific days |

#### 3.1.5 Milestone Structure (Long-term Projects)
```javascript
milestone: {
  id: string,
  title: string,
  dueDate: DateTime,
  status: "not-started" | "in-progress" | "completed",
  description: string (optional)
}
```

### 3.2 Grade Tracking

#### 3.2.1 Grade Entry
- Students manually input their grades
- Grades stored as percentages (0-100)
- Associated with specific subject/class

#### 3.2.2 Grade Data Fields
| Field | Type | Description |
|-------|------|-------------|
| Subject/Class | Reference | Associated class |
| Assignment Name | String | What was graded |
| Grade | Number | Percentage (0-100) |
| Date Received | Date | When grade was received |
| Notes | String | Optional comments |

#### 3.2.3 Grade Display
- Individual grades shown as percentages
- Average calculated per subject
- Overall GPA/average across all subjects
- Privacy: Students see only their own grades

### 3.3 Reminder System

#### 3.3.1 Reminder Triggers
| Assignment Type | Reminder Schedule |
|-----------------|-------------------|
| Daily Homework | 1 day before due date |
| Long-term Project | 1 week before + 1 day before |
| Project Milestones | 1 day before each milestone |
| Recurring | 1 day before each occurrence |

#### 3.3.2 Escalating Urgency
| Time Until Due | Urgency Level | Visual Style |
|----------------|---------------|--------------|
| > 7 days | Low | Blue, subtle |
| 3-7 days | Medium | Yellow, moderate |
| 1-2 days | High | Orange, prominent |
| < 24 hours | Urgent | Red, bold |
| Overdue | Critical | Red, pulsing |

#### 3.3.3 Notification Types
- **In-app only** (no email/SMS)
- Badge count on notification icon
- Notification inbox for history
- Toast notifications for new alerts

#### 3.3.4 Notification Inbox
- List of all notifications (read/unread)
- Mark as read / Mark all as read
- Delete individual notifications
- Filter by type (homework due, overdue, etc.)

### 3.4 Class Management

#### 3.4.1 Class Structure
| Field | Type | Description |
|-------|------|-------------|
| Class ID | String | Unique identifier |
| Class Name | String | e.g., "AP Chemistry" |
| Subject | String | e.g., "Science" |
| Teacher | Reference | Teacher who created it |
| Students | Array | List of enrolled students |
| Assignments | Array | Class assignments |
| Color | String | For calendar color-coding |

#### 3.4.2 Class Enrollment
- Teachers add students by entering student ID
- Students can be in multiple classes
- Students cannot self-join (teacher-controlled)

#### 3.4.3 Teacher Dashboard for Classes
- View all students in class
- See each student's homework status
- Cannot see student grades (privacy)

### 3.5 Calendar View

#### 3.5.1 Calendar Features
| Feature | Description |
|---------|-------------|
| Monthly View | Default view showing full month |
| Weekly View | Detailed week view |
| Daily View | List of assignments for selected day |
| Color Coding | By subject AND by status |
| Click to View | Click assignment to see details |

#### 3.5.2 Color Coding System
**By Subject:**
- Each class assigned unique color
- User can customize colors

**By Status:**
| Status | Color |
|--------|-------|
| Not Started | Gray |
| In Progress | Yellow/Amber |
| Completed | Green |
| Overdue | Red |

### 3.6 Homework Status Check-in (Interactive Poll Feature)

#### 3.6.1 Functionality
- Students update their assignment status
- Acts as personal progress tracker
- Quick status toggle on dashboard

#### 3.6.2 Status Options
```
┌─────────────────────────────────────────────────────────┐
│  📚 Math Homework - Chapter 5 Problems                  │
│  Due: Nov 28, 2025                                      │
│                                                         │
│  Status: ○ Not Started  ◉ In Progress  ○ Completed     │
└─────────────────────────────────────────────────────────┘
```

#### 3.6.3 Privacy
- Status visible only to individual student
- Teachers see aggregated status (not individual)

---

## 4. User Interface Design

### 4.1 Design System

#### 4.1.1 Color Palette

**Light Mode:**
| Element | Color | Hex |
|---------|-------|-----|
| Primary | Blue | #3B82F6 |
| Secondary | Indigo | #6366F1 |
| Success | Green | #10B981 |
| Warning | Amber | #F59E0B |
| Error | Red | #EF4444 |
| Background | White | #FFFFFF |
| Surface | Light Gray | #F3F4F6 |
| Text Primary | Dark Gray | #111827 |
| Text Secondary | Gray | #6B7280 |

**Dark Mode:**
| Element | Color | Hex |
|---------|-------|-----|
| Primary | Blue | #60A5FA |
| Secondary | Indigo | #818CF8 |
| Success | Green | #34D399 |
| Warning | Amber | #FBBF24 |
| Error | Red | #F87171 |
| Background | Dark | #111827 |
| Surface | Dark Gray | #1F2937 |
| Text Primary | White | #F9FAFB |
| Text Secondary | Light Gray | #9CA3AF |

#### 4.1.2 Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 32px | 700 |
| H2 | Inter | 24px | 600 |
| H3 | Inter | 20px | 600 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Caption | Inter | 12px | 400 |

#### 4.1.3 Spacing System
| Name | Value |
|------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

#### 4.1.4 Border Radius
| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 12px |
| Inputs | 8px |
| Modals | 16px |

### 4.2 Responsive Breakpoints
| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | < 640px | Phones |
| Tablet | 640px - 1024px | Tablets |
| Desktop | > 1024px | Laptops/Desktops |

### 4.3 Component Library

#### 4.3.1 Buttons
```
┌─────────────────────────────────────────────────────────┐
│  Primary    [████████████]  Filled, primary color       │
│  Secondary  [────────────]  Outlined, secondary color   │
│  Ghost      [ Ghost Btn  ]  Text only, hover highlight  │
│  Danger     [████████████]  Red, for destructive acts   │
└─────────────────────────────────────────────────────────┘
```

#### 4.3.2 Form Inputs
- Text input with floating label
- Date picker
- Time picker
- Dropdown select
- Textarea
- Checkbox
- Radio buttons
- Toggle switch (for dark mode)

#### 4.3.3 Cards
- Assignment card
- Grade card
- Class card
- Notification card

#### 4.3.4 Navigation
- Top navbar (desktop)
- Bottom navigation (mobile)
- Sidebar (desktop, collapsible)

---

## 5. Data Models

### 5.1 Firebase Collections

#### 5.1.1 Users Collection
```javascript
users/{userId}: {
  id: string,
  email: string,
  fullName: string,
  schoolId: string,          // Student ID or Teacher ID
  role: "student" | "teacher",
  createdAt: timestamp,
  updatedAt: timestamp,
  settings: {
    darkMode: boolean,
    notificationsEnabled: boolean
  },
  classes: string[]          // Array of class IDs
}
```

#### 5.1.2 Classes Collection
```javascript
classes/{classId}: {
  id: string,
  name: string,
  subject: string,
  color: string,             // Hex color for calendar
  teacherId: string,
  teacherName: string,
  studentIds: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 5.1.3 Assignments Collection
```javascript
assignments/{assignmentId}: {
  id: string,
  title: string,
  description: string,
  classId: string,
  className: string,
  subject: string,
  dueDate: timestamp,
  dueTime: string,           // "23:59" format
  type: "daily" | "project" | "recurring",
  status: "not-started" | "in-progress" | "completed",
  isOverdue: boolean,
  createdBy: {
    id: string,
    role: "student" | "teacher",
    name: string
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // For projects only
  milestones: [{
    id: string,
    title: string,
    dueDate: timestamp,
    status: "not-started" | "in-progress" | "completed"
  }],
  
  // For recurring only
  recurrence: {
    pattern: "daily" | "weekly" | "biweekly" | "monthly" | "custom",
    daysOfWeek: number[],    // 0-6 for custom
    endDate: timestamp       // When to stop recurring
  },
  
  // For student-created assignments
  studentId: string,         // Owner student (if personal)
  
  // For teacher-created assignments
  isClassAssignment: boolean,
  studentStatuses: {         // Track each student's status
    [studentId]: {
      status: "not-started" | "in-progress" | "completed",
      updatedAt: timestamp
    }
  }
}
```

#### 5.1.4 Grades Collection
```javascript
grades/{gradeId}: {
  id: string,
  studentId: string,
  classId: string,
  className: string,
  assignmentName: string,
  grade: number,             // 0-100 percentage
  dateReceived: timestamp,
  notes: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 5.1.5 Notifications Collection
```javascript
notifications/{notificationId}: {
  id: string,
  userId: string,
  type: "reminder" | "overdue" | "milestone" | "class",
  title: string,
  message: string,
  assignmentId: string,      // Related assignment (if applicable)
  isRead: boolean,
  urgency: "low" | "medium" | "high" | "urgent",
  createdAt: timestamp
}
```

### 5.2 Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Classes readable by members, writable by teacher
    match /classes/{classId} {
      allow read: if request.auth != null && 
        (resource.data.teacherId == request.auth.uid || 
         request.auth.uid in resource.data.studentIds);
      allow write: if request.auth != null && 
        resource.data.teacherId == request.auth.uid;
    }
    
    // Assignments - complex rules based on ownership
    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        (resource.data.createdBy.id == request.auth.uid ||
         resource.data.studentId == request.auth.uid);
    }
    
    // Grades - only owner can read/write
    match /grades/{gradeId} {
      allow read, write: if request.auth != null && 
        resource.data.studentId == request.auth.uid;
    }
    
    // Notifications - only owner can read/write
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## 6. Component Architecture

### 6.1 Folder Structure
```
studentstudy/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── DatePicker.jsx
│   │   │   ├── TimePicker.jsx
│   │   │   ├── Toggle.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── Toast.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   └── Layout.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── assignments/
│   │   │   ├── AssignmentCard.jsx
│   │   │   ├── AssignmentList.jsx
│   │   │   ├── AssignmentForm.jsx
│   │   │   ├── AssignmentDetail.jsx
│   │   │   ├── StatusToggle.jsx
│   │   │   ├── MilestoneList.jsx
│   │   │   └── RecurrenceSelector.jsx
│   │   ├── grades/
│   │   │   ├── GradeCard.jsx
│   │   │   ├── GradeList.jsx
│   │   │   ├── GradeForm.jsx
│   │   │   └── GradeStats.jsx
│   │   ├── calendar/
│   │   │   ├── Calendar.jsx
│   │   │   ├── CalendarDay.jsx
│   │   │   ├── CalendarEvent.jsx
│   │   │   └── CalendarFilters.jsx
│   │   ├── classes/
│   │   │   ├── ClassCard.jsx
│   │   │   ├── ClassList.jsx
│   │   │   ├── ClassForm.jsx
│   │   │   ├── StudentList.jsx
│   │   │   └── AddStudentForm.jsx
│   │   ├── notifications/
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── NotificationList.jsx
│   │   │   ├── NotificationItem.jsx
│   │   │   └── NotificationToast.jsx
│   │   └── dashboard/
│   │       ├── DashboardStats.jsx
│   │       ├── UpcomingAssignments.jsx
│   │       ├── OverdueSection.jsx
│   │       └── QuickActions.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Assignments.jsx
│   │   ├── AssignmentDetails.jsx
│   │   ├── Grades.jsx
│   │   ├── Calendar.jsx
│   │   ├── Classes.jsx
│   │   ├── ClassDetails.jsx
│   │   ├── Notifications.jsx
│   │   ├── Settings.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useAssignments.js
│   │   ├── useGrades.js
│   │   ├── useClasses.js
│   │   ├── useNotifications.js
│   │   ├── useDarkMode.js
│   │   └── useMediaQuery.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── NotificationContext.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── authService.js
│   │   ├── assignmentService.js
│   │   ├── gradeService.js
│   │   ├── classService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── dateUtils.js
│   │   ├── validators.js
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── components/
│   │       └── [component styles]
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.jsx
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── tailwind.config.js
```

### 6.2 Key Component Specifications

#### 6.2.1 AssignmentCard Component
```
Props:
  - assignment: Assignment object
  - onStatusChange: function(newStatus)
  - onEdit: function()
  - onDelete: function()
  
Features:
  - Displays title, class, due date
  - Color-coded border by status
  - Status toggle buttons
  - Overdue indicator (red, pulsing)
  - Quick actions (edit, delete)
  - Click to expand details
```

#### 6.2.2 Calendar Component
```
Props:
  - assignments: Assignment[]
  - onDateClick: function(date)
  - onEventClick: function(assignment)
  - view: "month" | "week" | "day"
  
Features:
  - Month/Week/Day view toggle
  - Color-coded events by subject + status
  - Click event to view details
  - Navigate between months
  - Today indicator
  - Overdue items highlighted
```

#### 6.2.3 NotificationBell Component
```
Props:
  - notifications: Notification[]
  - onNotificationClick: function(notification)
  
Features:
  - Bell icon with badge count
  - Dropdown on click
  - Mark as read on click
  - Link to full notifications page
  - Toast popup for new notifications
```

---

## 7. Page Structure & Routes

### 7.1 Route Map

| Path | Page | Access | Description |
|------|------|--------|-------------|
| `/` | Landing | Public | Redirect to login or dashboard |
| `/login` | Login | Public | Login form |
| `/register` | Register | Public | Registration form |
| `/dashboard` | Dashboard | Protected | Main dashboard |
| `/assignments` | Assignments | Protected | All assignments list |
| `/assignments/new` | New Assignment | Protected | Create assignment form |
| `/assignments/:id` | Assignment Detail | Protected | View/edit assignment |
| `/grades` | Grades | Student | Grades list |
| `/grades/new` | Add Grade | Student | Add grade form |
| `/calendar` | Calendar | Protected | Calendar view |
| `/classes` | Classes | Protected | Classes list |
| `/classes/new` | New Class | Teacher | Create class form |
| `/classes/:id` | Class Detail | Protected | View class & students |
| `/notifications` | Notifications | Protected | Notification history |
| `/settings` | Settings | Protected | User settings |

### 7.2 Page Wireframes

#### 7.2.1 Dashboard (Student)
```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────┐  StudentStudy              🔔 3    👤 John    [☀️/🌙]     │
│  │ ≡   │                                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Welcome back, John! 👋                                             │
│                                                                     │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ 📚 12      │ │ ⏳ 3        │ │ ✅ 45       │ │ 📊 87%      │   │
│  │ Active     │ │ Due Soon    │ │ Completed   │ │ Avg Grade   │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                     │
│  ⚠️ Overdue (2)                                        [View All]  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Math Homework Ch.4        │ Due: Nov 25 │ ○ ◉ ○        │   │
│  │ 🔴 History Essay Draft       │ Due: Nov 24 │ ○ ○ ○        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  📅 Due This Week                                      [View All]  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🟡 Physics Lab Report        │ Due: Nov 28 │ ○ ◉ ○        │   │
│  │ ⚪ English Reading Ch.12     │ Due: Nov 29 │ ○ ○ ○        │   │
│  │ 🟢 Chemistry Worksheet       │ Due: Nov 30 │ ○ ○ ◉        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ➕ Quick Add Assignment                                            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  🏠 Home    📚 Tasks    📅 Calendar    📊 Grades    ⚙️ Settings    │
└─────────────────────────────────────────────────────────────────────┘
```

#### 7.2.2 Assignments List
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back      Assignments                           ➕ New           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Sort by: [Due Date ▼]                                             │
│                                                                     │
│  ─── Overdue ───────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🔴 Math │ Homework Ch.4          Nov 25    [ ] [◉] [ ]      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─── Today ─────────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 🟡 Physics │ Lab Report          Today     [ ] [◉] [ ]      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─── This Week ─────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ⚪ English │ Reading Ch.12       Nov 29    [◉] [ ] [ ]      │   │
│  │ 🟢 Chemistry │ Worksheet         Nov 30    [ ] [ ] [◉]      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ─── Next Week ─────────────────────────────────────────────────   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ ⚪ History │ Research Paper      Dec 5     [◉] [ ] [ ]      │   │
│  │    └─ Milestone: Outline        Dec 1     [◉] [ ] [ ]      │   │
│  │    └─ Milestone: First Draft    Dec 3     [◉] [ ] [ ]      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Legend: [ ] Not Started  [◉] In Progress  [✓] Completed
```

#### 7.2.3 Calendar View
```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back      Calendar                    [Month] [Week] [Day]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│              ◄  November 2025  ►                                   │
│                                                                     │
│  Sun    Mon    Tue    Wed    Thu    Fri    Sat                     │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐                │
│  │      │      │      │      │      │      │  1   │                │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                │
│  │  2   │  3   │  4   │  5   │  6   │  7   │  8   │                │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                │
│  │  9   │  10  │  11  │  12  │  13  │  14  │  15  │                │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                │
│  │  16  │  17  │  18  │  19  │  20  │  21  │  22  │                │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                │
│  │  23  │  24  │  25  │  26  │ [27] │  28  │  29  │                │
│  │      │ 🔴   │ 🔴   │      │ 📍   │ 🟡   │ ⚪   │                │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤                │
│  │  30  │      │      │      │      │      │      │                │
│  │ 🟢   │      │      │      │      │      │      │                │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘                │
│                                                                     │
│  📍 Today: Nov 27                                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ No assignments due today! 🎉                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

#### 7.2.4 Teacher Dashboard
```
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────┐  StudentStudy              🔔 1    👤 Ms. Smith  [☀️/🌙]  │
│  │ ≡   │                                                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Welcome back, Ms. Smith! 👋                                        │
│                                                                     │
│  Your Classes                                          [+ New]     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 📘 AP Chemistry         │ 28 students │ 5 active tasks      │   │
│  │ 📗 Chemistry 101        │ 32 students │ 3 active tasks      │   │
│  │ 📙 Chemistry Lab        │ 24 students │ 2 active tasks      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Recent Assignment Status                              [View All]  │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Lab Report (AP Chemistry)           Due: Nov 28             │   │
│  │ ████████████░░░░░░░░  12/28 completed (43%)                 │   │
│  │                                                              │   │
│  │ Worksheet Ch.5 (Chemistry 101)      Due: Nov 30             │   │
│  │ ██████░░░░░░░░░░░░░░  8/32 completed (25%)                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ➕ Post New Assignment                                             │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  🏠 Home    📚 Assignments    👥 Classes    ⚙️ Settings            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 8. Firebase Configuration

### 8.1 Required Firebase Services
- **Authentication** - Email/password auth
- **Cloud Firestore** - Database
- **Hosting** (optional) - Deploy the app

### 8.2 Environment Variables
```
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx
REACT_APP_FIREBASE_PROJECT_ID=xxx
REACT_APP_FIREBASE_STORAGE_BUCKET=xxx
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=xxx
REACT_APP_FIREBASE_APP_ID=xxx
```

### 8.3 Firebase Indexes
```javascript
// Required composite indexes for queries

// Assignments by class, sorted by due date
Collection: assignments
Fields: classId (ASC), dueDate (ASC)

// Assignments by student, sorted by due date
Collection: assignments
Fields: studentId (ASC), dueDate (ASC)

// Notifications by user, sorted by date
Collection: notifications
Fields: userId (ASC), createdAt (DESC)

// Grades by student and class
Collection: grades
Fields: studentId (ASC), classId (ASC), dateReceived (DESC)
```

---

## 9. Technical Requirements

### 9.1 Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "firebase": "^10.x",
    "date-fns": "^2.x",
    "react-calendar": "^4.x",
    "tailwindcss": "^3.x",
    "lucide-react": "^0.x",
    "react-hot-toast": "^2.x"
  },
  "devDependencies": {
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x"
  }
}
```

### 9.2 Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### 9.3 Performance Targets
| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |

### 9.4 Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Minimum contrast ratio 4.5:1
- Focus indicators visible
- Alt text for images
- Semantic HTML

---

## 10. Future Enhancements

### 10.1 Phase 2 Features (Post-Launch)
| Feature | Description | Priority |
|---------|-------------|----------|
| Google Classroom Import | Sync assignments from Google Classroom | High |
| Canvas Integration | Sync assignments from Canvas LMS | High |
| Email Notifications | Optional email reminders | Medium |
| Push Notifications | Browser push for reminders | Medium |
| File Attachments | Attach files to assignments | Medium |
| Grade Trends | Charts showing grade trends over time | Medium |
| Study Timer | Pomodoro timer for studying | Low |
| Gamification | Streaks, badges, achievements | Low |
| Parent Accounts | Parents can view child's progress | Low |
| Mobile App | Native iOS/Android app | Low |

### 10.2 Potential Integrations
- Google Calendar sync
- Microsoft Outlook calendar
- Notion export
- PDF export for assignments

---

## 📝 Document Revision History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 27, 2025 | Initial specification | GitHub Copilot |

---

## ✅ Approval Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| UX Designer | | | |
| Tech Lead | | | |
| Developer | | | |

---

*This specification document serves as the blueprint for the StudentStudy application. All development should adhere to the requirements outlined in this document.*
