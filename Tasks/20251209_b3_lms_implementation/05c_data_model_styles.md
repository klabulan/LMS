# LMS Data Model and B3 Style Guide

**Document**: Part 3 of B3 LMS Implementation Series
**Created**: 2025-12-09
**Purpose**: Complete data model specification and visual design system for B3 Learning Portal

---

## Part 1: Data Model

### Overview

The B3 Learning Portal uses a **Template → Instance** pattern for courses and assignments, enabling reusable course structures across multiple offerings. The model supports the complete learning lifecycle from course discovery through certification.

### Core Design Patterns

1. **Template → Instance**: Course templates define structure; instances represent actual course offerings
2. **Enrollment-Centric**: Student progress tracked through enrollment records
3. **Status Workflows**: Each entity has explicit status transitions
4. **Thread-Based Communication**: Separate dialogs for course-level and assignment-level discussions

---

## 1. Entity Specifications

### 1.1 Пользователь (User)

**Purpose**: Core user entity with role-based access

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `name` | String(200) | Full name |
| `email` | String(255) | Unique email address |
| `role` | Enum | User role: `student` \| `teacher` \| `methodist` \| `admin` |
| `organization` | String(200) | Company/institution name |
| `department` | String(200) | Department/division |
| `position` | String(200) | Job title |
| `isActive` | Boolean | Account status |
| `createdAt` | DateTime | Registration timestamp |

**Relations**:
- `1 → *` Enrollments (as student)
- `1 → *` Course Instances (as teacher)
- `1 → *` Certificates
- `1 → *` Notifications

---

### 1.2 Шаблон курса (Course Template)

**Purpose**: Reusable course structure and content definition

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `title` | String(300) | Course name |
| `code` | String(50) | Unique course code (e.g., "B3-BASIC-101") |
| `level` | Enum | Difficulty: `basic` \| `intermediate` \| `advanced` |
| `description` | Text | Full course description (markdown) |
| `targetAudience` | Text | Intended learner profile |
| `prerequisites` | Text | Required prior knowledge |
| `isPublic` | Boolean | Visible in public catalog |
| `certificateThreshold` | Integer | Minimum score for certification (0-100) |
| `estimatedHours` | Integer | Expected completion time |
| `createdBy` | UUID | Author user ID |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last modification |

**Relations**:
- `1 → *` Assignment Templates
- `1 → *` Course Instances
- `1 → 1` Certificate Template

---

### 1.3 Шаблон задания (Assignment Template)

**Purpose**: Defines assignment structure within a course template

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `courseTemplateId` | UUID | Parent course template |
| `title` | String(300) | Assignment name |
| `type` | Enum | Assignment type: `lecture` \| `lab` \| `test` \| `project` \| `quiz` |
| `module` | String(200) | Module/section name |
| `order` | Integer | Sequence number within course |
| `description` | Text | Assignment instructions (markdown) |
| `materials` | JSON | Links to files, videos, docs |
| `maxScore` | Integer | Maximum points (0-100) |
| `dueDays` | Integer | Days from course start to deadline |
| `isMandatory` | Boolean | Required for course completion |
| `autoGrade` | Boolean | Supports automatic grading (tests/quizzes) |
| `createdAt` | DateTime | Creation timestamp |

**Relations**:
- `* → 1` Course Template
- `1 → *` Assignment Instances

---

### 1.4 Экземпляр курса (Course Instance)

**Purpose**: Specific course offering with dates and instructor

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `courseTemplateId` | UUID | Source template |
| `teacherId` | UUID | Assigned instructor |
| `cohort` | String(100) | Group/stream identifier (e.g., "2025-Q1-CORP") |
| `startDate` | Date | Course start date |
| `endDate` | Date | Course end date |
| `status` | Enum | Current status: `planned` \| `active` \| `completed` \| `archived` |
| `maxEnrollments` | Integer | Enrollment capacity (null = unlimited) |
| `createdAt` | DateTime | Creation timestamp |

**Status Transitions**:
```
planned → active → completed → archived
```

**Relations**:
- `* → 1` Course Template
- `* → 1` User (teacher)
- `1 → *` Enrollments
- `1 → *` Enrollment Requests
- `1 → *` Dialogs (course-level)

---

### 1.5 Заявка на регистрацию (Enrollment Request)

**Purpose**: Manages course enrollment approval workflow

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID | Requesting user |
| `courseInstanceId` | UUID | Target course instance |
| `status` | Enum | Request status: `pending` \| `approved` \| `rejected` |
| `comment` | Text | User's enrollment reason |
| `reviewedBy` | UUID | Admin who processed request |
| `reviewComment` | Text | Admin's decision notes |
| `createdAt` | DateTime | Request timestamp |
| `reviewedAt` | DateTime | Decision timestamp |

**Status Transitions**:
```
pending → approved (creates Enrollment)
pending → rejected
```

**Relations**:
- `* → 1` User
- `* → 1` Course Instance

---

### 1.6 Запись на курс (Enrollment)

**Purpose**: Tracks student's participation and progress in a course instance

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `studentId` | UUID | Enrolled student |
| `courseInstanceId` | UUID | Course instance |
| `status` | Enum | Progress status: `not_started` \| `in_progress` \| `completed` \| `dropped` |
| `progress` | Integer | Completion percentage (0-100) |
| `totalScore` | Integer | Accumulated points |
| `credentials` | JSON | Personal lab access (e.g., `{"vm_url": "...", "username": "..."}`) |
| `enrolledAt` | DateTime | Enrollment timestamp |
| `completedAt` | DateTime | Course completion timestamp |
| `lastActivityAt` | DateTime | Last interaction timestamp |

**Status Transitions**:
```
not_started → in_progress → completed
            ↓
        dropped
```

**Relations**:
- `* → 1` User (student)
- `* → 1` Course Instance
- `1 → *` Assignment Instances

**Progress Calculation**:
```
progress = (completed_mandatory_assignments / total_mandatory_assignments) × 100
```

---

### 1.7 Экземпляр задания (Assignment Instance)

**Purpose**: Tracks student's work on a specific assignment

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `enrollmentId` | UUID | Parent enrollment |
| `assignmentTemplateId` | UUID | Source template |
| `status` | Enum | Submission status: `draft` \| `submitted` \| `under_review` \| `accepted` \| `needs_revision` |
| `submissionText` | Text | Student's text submission |
| `submissionFiles` | JSON | Uploaded file references |
| `submissionUrl` | String(500) | Link to external work (e.g., deployed app) |
| `grade` | Integer | Assigned score (0-maxScore) |
| `feedback` | Text | Instructor's comments |
| `submittedAt` | DateTime | Submission timestamp |
| `gradedAt` | DateTime | Grading timestamp |
| `gradedBy` | UUID | Instructor who graded |
| `attemptCount` | Integer | Number of resubmissions |

**Status Transitions**:
```
draft → submitted → under_review → accepted
                                 ↓
                            needs_revision → submitted (retry)
```

**Relations**:
- `* → 1` Enrollment
- `* → 1` Assignment Template
- `1 → *` Dialogs (assignment-level)

---

### 1.8 Диалог (Dialog/Thread)

**Purpose**: Conversation context for course or assignment discussions

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `type` | Enum | Context type: `course` \| `assignment` |
| `referenceId` | UUID | ID of course instance or assignment instance |
| `participants` | JSON Array | User IDs involved in dialog |
| `isArchived` | Boolean | Dialog closed |
| `createdAt` | DateTime | Creation timestamp |
| `lastMessageAt` | DateTime | Most recent message timestamp |

**Relations**:
- `1 → *` Messages
- Polymorphic: belongs to Course Instance OR Assignment Instance

---

### 1.9 Сообщение (Message)

**Purpose**: Individual message within a dialog

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `dialogId` | UUID | Parent dialog |
| `authorId` | UUID | Message sender |
| `text` | Text | Message content (markdown) |
| `attachments` | JSON Array | File references |
| `isRead` | Boolean | Read status (per recipient) |
| `createdAt` | DateTime | Send timestamp |
| `editedAt` | DateTime | Last edit timestamp |

**Relations**:
- `* → 1` Dialog
- `* → 1` User (author)

---

### 1.10 Шаблон сертификата (Certificate Template)

**Purpose**: Defines certificate layout and rules for a course

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `courseTemplateId` | UUID | Associated course template |
| `title` | String(300) | Certificate title |
| `layout` | Text | HTML/template markup for PDF generation |
| `requiredScore` | Integer | Minimum score to earn certificate |
| `signatories` | JSON | Names and titles of signers |
| `createdAt` | DateTime | Creation timestamp |

**Relations**:
- `1 → 1` Course Template
- `1 → *` Certificate Instances

---

### 1.11 Экземпляр сертификата (Certificate)

**Purpose**: Issued certificate for a student

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `studentId` | UUID | Certificate recipient |
| `courseInstanceId` | UUID | Completed course instance |
| `certificateTemplateId` | UUID | Template used |
| `serialNumber` | String(50) | Unique certificate serial (e.g., "B3-2025-001234") |
| `issuedAt` | DateTime | Issue timestamp |
| `pdfUrl` | String(500) | Link to generated PDF |
| `verificationCode` | String(100) | Code for public verification |

**Relations**:
- `* → 1` User (student)
- `* → 1` Course Instance
- `* → 1` Certificate Template

---

### 1.12 Уведомление (Notification)

**Purpose**: System notifications for users

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `userId` | UUID | Recipient |
| `title` | String(300) | Notification headline |
| `message` | Text | Full notification text |
| `type` | Enum | Notification type: `info` \| `success` \| `warning` \| `error` |
| `link` | String(500) | Optional deep link to relevant page |
| `isRead` | Boolean | Read status |
| `createdAt` | DateTime | Creation timestamp |

**Relations**:
- `* → 1` User

---

## 2. Entity Relationship Diagram

```
┌─────────────────────┐
│  User               │
│  (Пользователь)     │
└─────────────────────┘
         │1
         │
         │*
┌─────────────────────┐      1      ┌──────────────────────┐
│ Enrollment Request  │─────────────│  Course Instance     │
│ (Заявка)            │             │  (Экземпляр курса)   │
└─────────────────────┘             └──────────────────────┘
                                             │1
                                             │
                                             │*        *│1
┌─────────────────────┐      *      ┌──────────────────────┐      1      ┌─────────────────────┐
│  Enrollment         │─────────────│  Course Template     │─────────────│ Certificate Template│
│  (Запись на курс)   │      1      │  (Шаблон курса)      │             │ (Шаблон сертификата)│
└─────────────────────┘             └──────────────────────┘             └─────────────────────┘
         │1                                  │1
         │                                   │
         │*                                  │*
┌─────────────────────┐      *      ┌──────────────────────┐
│ Assignment Instance │─────────────│ Assignment Template  │
│ (Экземпляр задания) │      1      │ (Шаблон задания)     │
└─────────────────────┘             └──────────────────────┘
         │1
         │
         │*
┌─────────────────────┐      1      ┌──────────────────────┐
│  Dialog             │─────────────│  Message             │
│  (Диалог)           │             │  (Сообщение)         │
└─────────────────────┘             └──────────────────────┘
         │*
         │
         │1 (polymorphic: Course Instance OR Assignment Instance)


┌─────────────────────┐      *      ┌──────────────────────┐
│  Certificate        │─────────────│  User (student)      │
│  (Сертификат)       │      1      │                      │
└─────────────────────┘             └──────────────────────┘

┌─────────────────────┐      *      ┌──────────────────────┐
│  Notification       │─────────────│  User                │
│  (Уведомление)      │      1      │                      │
└─────────────────────┘             └──────────────────────┘
```

### Relationship Summary

| Parent Entity | Relationship | Child Entity | Cardinality |
|---------------|--------------|--------------|-------------|
| Course Template | has many | Assignment Templates | 1:* |
| Course Template | has many | Course Instances | 1:* |
| Course Template | has one | Certificate Template | 1:1 |
| Course Instance | has many | Enrollments | 1:* |
| Course Instance | has many | Enrollment Requests | 1:* |
| Course Instance | has many | Dialogs (course-level) | 1:* |
| Course Instance | belongs to | User (teacher) | *:1 |
| Enrollment | belongs to | User (student) | *:1 |
| Enrollment | belongs to | Course Instance | *:1 |
| Enrollment | has many | Assignment Instances | 1:* |
| Assignment Template | has many | Assignment Instances | 1:* |
| Assignment Instance | has many | Dialogs (assignment-level) | 1:* |
| Dialog | has many | Messages | 1:* |
| Certificate | belongs to | User (student) | *:1 |
| Certificate | belongs to | Course Instance | *:1 |
| Certificate | belongs to | Certificate Template | *:1 |
| Notification | belongs to | User | *:1 |

---

## 3. Key Workflows

### 3.1 Course Enrollment Flow

```
User submits Enrollment Request
    ↓
Admin reviews request
    ↓
[Approved] → Create Enrollment record
           → Create Assignment Instances (from templates)
           → Send welcome notification
    ↓
[Rejected] → Update request status
           → Send rejection notification
```

### 3.2 Assignment Submission Flow

```
Student works on assignment (status: draft)
    ↓
Student submits work (status: submitted)
    ↓
System creates notification for teacher
    ↓
Teacher reviews submission (status: under_review)
    ↓
[Accepted] → Assign grade
           → Update enrollment progress
           → Send acceptance notification
    ↓
[Needs Revision] → Add feedback
                 → Send revision notification
                 → Student resubmits
```

### 3.3 Certificate Generation Flow

```
Student completes course
    ↓
System checks: all mandatory assignments completed
             + total_score >= certificateThreshold
    ↓
[Qualified] → Create Certificate record
            → Generate PDF from template
            → Send notification with download link
    ↓
[Not Qualified] → No action (student can continue working)
```

---

## Part 2: B3 Style Guide

### Overview

The B3 Learning Portal follows a **dark sidebar, light content** design pattern inspired by modern SaaS applications. The style system uses CSS custom properties for consistency and easy theming.

---

## 1. Color Palette

### 1.1 Layout Colors

```css
:root {
  /* Primary Layout */
  --color-bg: #f3f5f8;           /* Main background - light gray */
  --color-topbar: #121826;       /* Top navigation - dark navy */
  --color-sidebar: #192132;      /* Side navigation - dark navy */
  --color-card: #ffffff;         /* Card/panel background - white */
  --color-border: #e5e7eb;       /* Borders and dividers - light gray */
  --color-shadow: rgba(0, 0, 0, 0.05);  /* Subtle shadow */
}
```

**Usage Examples**:
- Page background: `background-color: var(--color-bg);`
- Card components: `background-color: var(--color-card); border: 1px solid var(--color-border);`
- Sidebar: `background-color: var(--color-sidebar);`

---

### 1.2 Text Colors

```css
:root {
  /* Text Hierarchy */
  --color-text-primary: #1f2937;     /* Headings, primary text - dark gray */
  --color-text-secondary: #6b7280;   /* Body text, descriptions - medium gray */
  --color-text-muted: #9ca3af;       /* Hints, metadata - light gray */
  --color-text-inverse: #ffffff;     /* Text on dark backgrounds - white */
  --color-text-link: #3b82f6;        /* Hyperlinks - blue */
}
```

**Text Hierarchy**:
1. **Primary**: Page titles, card headings
2. **Secondary**: Body text, form labels
3. **Muted**: Timestamps, helper text, placeholders
4. **Inverse**: Sidebar navigation, dark topbar text

---

### 1.3 Accent Colors

```css
:root {
  /* Action Colors */
  --color-primary: #4ade80;          /* Primary actions - green */
  --color-primary-hover: #22c55e;    /* Primary hover state - darker green */
  --color-primary-light: #bbf7d0;    /* Primary backgrounds - light green */

  --color-warning: #fbbf24;          /* Warnings, pending states - yellow */
  --color-warning-light: #fef3c7;    /* Warning backgrounds - light yellow */

  --color-danger: #ef4444;           /* Errors, rejections - red */
  --color-danger-hover: #dc2626;     /* Danger hover state - darker red */
  --color-danger-light: #fee2e2;     /* Error backgrounds - light red */

  --color-info: #3b82f6;            /* Info, in-progress - blue */
  --color-info-light: #dbeafe;       /* Info backgrounds - light blue */
}
```

**Usage Guidelines**:
- **Primary (Green)**: Submit buttons, "Continue" CTAs, success messages
- **Warning (Yellow)**: Pending approvals, approaching deadlines
- **Danger (Red)**: Delete actions, rejection notices, errors
- **Info (Blue)**: Informational badges, help tooltips

---

### 1.4 Status Colors

```css
:root {
  /* Entity Status Colors */
  --status-draft: #9ca3af;           /* Draft/not started - gray */
  --status-submitted: #fbbf24;       /* Awaiting review - yellow */
  --status-accepted: #4ade80;        /* Approved/completed - green */
  --status-rejected: #ef4444;        /* Rejected/failed - red */
  --status-in-progress: #3b82f6;     /* Active/in progress - blue */
  --status-archived: #6b7280;        /* Archived/inactive - medium gray */
}
```

**Status Mapping**:

| Entity | Status Value | Color Variable |
|--------|-------------|----------------|
| Assignment Instance | `draft` | `--status-draft` |
| Assignment Instance | `submitted` | `--status-submitted` |
| Assignment Instance | `under_review` | `--status-in-progress` |
| Assignment Instance | `accepted` | `--status-accepted` |
| Assignment Instance | `needs_revision` | `--status-rejected` |
| Enrollment | `not_started` | `--status-draft` |
| Enrollment | `in_progress` | `--status-in-progress` |
| Enrollment | `completed` | `--status-accepted` |
| Enrollment | `dropped` | `--status-archived` |
| Course Instance | `planned` | `--status-draft` |
| Course Instance | `active` | `--status-in-progress` |
| Course Instance | `completed` | `--status-accepted` |
| Course Instance | `archived` | `--status-archived` |

---

## 2. Typography

### 2.1 Font Family

```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
                 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'Fira Code', 'Courier New', monospace;
}
```

**Font Loading**:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

### 2.2 Font Sizes

```css
:root {
  --font-size-xs: 10px;    /* 0.625rem - Tiny labels, badges */
  --font-size-sm: 12px;    /* 0.75rem - Small text, captions */
  --font-size-base: 14px;  /* 0.875rem - Body text */
  --font-size-lg: 16px;    /* 1rem - Large body, card titles */
  --font-size-xl: 20px;    /* 1.25rem - Section headings */
  --font-size-2xl: 24px;   /* 1.5rem - Page titles */
  --font-size-3xl: 30px;   /* 1.875rem - Hero text */
}
```

**Usage Examples**:
```css
.page-title { font-size: var(--font-size-2xl); font-weight: 700; }
.card-title { font-size: var(--font-size-lg); font-weight: 600; }
.body-text { font-size: var(--font-size-base); font-weight: 400; }
.caption { font-size: var(--font-size-sm); color: var(--color-text-muted); }
```

---

### 2.3 Font Weights

```css
:root {
  --font-weight-normal: 400;    /* Body text */
  --font-weight-medium: 500;    /* Emphasized text */
  --font-weight-semibold: 600;  /* Subheadings */
  --font-weight-bold: 700;      /* Headings */
}
```

---

### 2.4 Line Heights

```css
:root {
  --line-height-tight: 1.25;    /* Headings */
  --line-height-normal: 1.5;    /* Body text */
  --line-height-relaxed: 1.75;  /* Long-form content */
}
```

---

## 3. Spacing System

### 3.1 Base Spacing Scale

```css
:root {
  --spacing-xs: 4px;      /* 0.25rem - Minimal gaps */
  --spacing-sm: 8px;      /* 0.5rem - Compact spacing */
  --spacing-md: 12px;     /* 0.75rem - Default gap */
  --spacing-lg: 16px;     /* 1rem - Comfortable spacing */
  --spacing-xl: 24px;     /* 1.5rem - Section spacing */
  --spacing-2xl: 32px;    /* 2rem - Major sections */
  --spacing-3xl: 48px;    /* 3rem - Page-level spacing */
}
```

**Usage Guidelines**:
- **xs (4px)**: Icon-text gaps, badge padding
- **sm (8px)**: Button padding, form element gaps
- **md (12px)**: Card padding (vertical)
- **lg (16px)**: Card padding (horizontal), list item gaps
- **xl (24px)**: Card margins, section gaps
- **2xl (32px)**: Page content margins
- **3xl (48px)**: Major section breaks

---

### 3.2 Border Radius

```css
:root {
  --radius-sm: 4px;       /* Small elements, badges */
  --radius-md: 8px;       /* Buttons, inputs */
  --radius-lg: 12px;      /* Cards */
  --radius-xl: 16px;      /* Modals, large panels */
  --radius-full: 9999px;  /* Pills, circular elements */
}
```

---

## 4. Component Patterns

### 4.1 Cards

**Base Card**:
```css
.card {
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 1px 3px var(--color-shadow);
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px var(--color-shadow);
}
```

**Card Header**:
```css
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
```

**Course Card Example**:
```html
<div class="card course-card">
  <div class="card-header">
    <h3 class="card-title">Основы платформы B3</h3>
    <span class="badge badge-info">В процессе</span>
  </div>
  <p class="card-description">Изучение базовых возможностей платформы</p>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 65%;"></div>
  </div>
  <button class="btn btn-primary">Продолжить</button>
</div>
```

---

### 4.2 Buttons

**Primary Button**:
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(74, 222, 128, 0.3);
}
```

**Secondary Button (Outlined)**:
```css
.btn-secondary {
  background-color: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background-color: var(--color-bg);
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

**Ghost Button (Text Only)**:
```css
.btn-ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
  padding: var(--spacing-sm);
}

.btn-ghost:hover {
  background-color: var(--color-bg);
  color: var(--color-text-primary);
}
```

**Danger Button**:
```css
.btn-danger {
  background-color: var(--color-danger);
  color: white;
}

.btn-danger:hover {
  background-color: var(--color-danger-hover);
}
```

---

### 4.3 Badges/Pills

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: var(--radius-full);
}

.badge-draft {
  background-color: var(--status-draft);
  color: white;
}

.badge-submitted {
  background-color: var(--color-warning-light);
  color: #92400e;
}

.badge-accepted {
  background-color: var(--color-primary-light);
  color: #166534;
}

.badge-rejected {
  background-color: var(--color-danger-light);
  color: #991b1b;
}

.badge-info {
  background-color: var(--color-info-light);
  color: #1e40af;
}
```

**Usage**:
```html
<span class="badge badge-submitted">Отправлено</span>
<span class="badge badge-accepted">Принято</span>
<span class="badge badge-info">Базовый</span>
```

---

### 4.4 Tables

**Base Table**:
```css
.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: var(--color-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table th {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
}

.table tbody tr:hover {
  background-color: var(--color-bg);
}

.table tbody tr:last-child td {
  border-bottom: none;
}
```

**Zebra Striping**:
```css
.table-striped tbody tr:nth-child(even) {
  background-color: #f9fafb;
}
```

**Example (Gradebook)**:
```html
<table class="table table-striped">
  <thead>
    <tr>
      <th>Студент</th>
      <th>Задание 1</th>
      <th>Задание 2</th>
      <th>Итого</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Иванов Иван</td>
      <td><span class="badge badge-accepted">95</span></td>
      <td><span class="badge badge-submitted">-</span></td>
      <td>95</td>
    </tr>
  </tbody>
</table>
```

---

### 4.5 Forms

**Input Field**:
```css
.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.form-input::placeholder {
  color: var(--color-text-muted);
}
```

**Textarea**:
```css
.form-textarea {
  min-height: 120px;
  resize: vertical;
  font-family: var(--font-family);
  line-height: var(--line-height-normal);
}
```

**File Upload Zone**:
```css
.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg);
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.file-upload:hover {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.file-upload-icon {
  font-size: var(--font-size-3xl);
  color: var(--color-text-muted);
  margin-bottom: var(--spacing-md);
}

.file-upload-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}
```

---

### 4.6 Progress Bars

```css
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin: var(--spacing-md) 0;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

/* Progress bar with percentage label */
.progress-container {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.progress-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  white-space: nowrap;
}
```

**Usage**:
```html
<div class="progress-container">
  <div class="progress-bar" style="flex: 1;">
    <div class="progress-fill" style="width: 65%;"></div>
  </div>
  <span class="progress-label">65%</span>
</div>
```

---

### 4.7 Sidebar Navigation

```css
.sidebar {
  width: 240px;
  height: 100vh;
  background-color: var(--color-sidebar);
  padding: var(--spacing-lg);
  overflow-y: auto;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  margin-bottom: var(--spacing-xs);
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-base);
  color: var(--color-text-inverse);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background-color 0.2s ease;
  opacity: 0.7;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.sidebar-link.active {
  background-color: var(--color-primary);
  opacity: 1;
  font-weight: var(--font-weight-medium);
}

.sidebar-icon {
  margin-right: var(--spacing-sm);
  font-size: var(--font-size-lg);
}
```

**Example**:
```html
<aside class="sidebar">
  <nav class="sidebar-nav">
    <ul>
      <li class="sidebar-item">
        <a href="/dashboard" class="sidebar-link active">
          <span class="sidebar-icon">📊</span>
          Мои курсы
        </a>
      </li>
      <li class="sidebar-item">
        <a href="/catalog" class="sidebar-link">
          <span class="sidebar-icon">📚</span>
          Каталог
        </a>
      </li>
      <li class="sidebar-item">
        <a href="/certificates" class="sidebar-link">
          <span class="sidebar-icon">🎓</span>
          Сертификаты
        </a>
      </li>
    </ul>
  </nav>
</aside>
```

---

## 5. Layout Patterns

### 5.1 Page Layout

```css
.app-layout {
  display: flex;
  height: 100vh;
  background-color: var(--color-bg);
}

.app-topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--color-topbar);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-xl);
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 240px;
  background-color: var(--color-sidebar);
  overflow-y: auto;
}

.app-main {
  margin-left: 240px;
  margin-top: 60px;
  padding: var(--spacing-2xl);
  flex: 1;
  overflow-y: auto;
}
```

---

### 5.2 Grid System

```css
.grid {
  display: grid;
  gap: var(--spacing-xl);
}

.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive */
@media (max-width: 1024px) {
  .grid-cols-3 { grid-template-columns: repeat(2, 1fr); }
  .grid-cols-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 { grid-template-columns: 1fr; }
}
```

---

## 6. Accessibility

### 6.1 Focus Styles

```css
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button:focus-visible,
.btn:focus-visible {
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3);
}
```

### 6.2 Screen Reader Text

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 7. Implementation Notes

### 7.1 B3 Platform Integration

When implementing these styles in B3:

1. **CSS Variables**: Define all CSS custom properties in a global stylesheet
2. **Component Library**: Create reusable component templates in B3's interface builder
3. **Theme Configuration**: Store color palette in B3 configuration for easy customization
4. **Responsive Design**: Test layouts in B3's mobile client

### 7.2 Style Priority

1. **Consistency > Novelty**: Use established patterns consistently
2. **Accessibility First**: Ensure WCAG 2.1 AA compliance
3. **Performance**: Minimize custom CSS, leverage B3's built-in styles where possible
4. **Maintainability**: Document all deviations from this guide

---

## Appendix: Quick Reference

### Status Color Mapping Table

| Status | Display Text (RU) | Color Variable | Background | Text Color |
|--------|------------------|----------------|------------|------------|
| `draft` | Черновик | `--status-draft` | `#9ca3af` | `white` |
| `submitted` | Отправлено | `--status-submitted` | `#fef3c7` | `#92400e` |
| `under_review` | На проверке | `--status-in-progress` | `#dbeafe` | `#1e40af` |
| `accepted` | Принято | `--status-accepted` | `#bbf7d0` | `#166534` |
| `needs_revision` | На доработку | `--status-rejected` | `#fee2e2` | `#991b1b` |
| `not_started` | Не начато | `--status-draft` | `#9ca3af` | `white` |
| `in_progress` | В процессе | `--status-in-progress` | `#dbeafe` | `#1e40af` |
| `completed` | Завершено | `--status-accepted` | `#bbf7d0` | `#166534` |
| `dropped` | Отчислен | `--status-archived` | `#e5e7eb` | `#6b7280` |

---

**Document Version**: 1.0
**Last Updated**: 2025-12-09
**Maintained By**: B3 LMS Implementation Team
