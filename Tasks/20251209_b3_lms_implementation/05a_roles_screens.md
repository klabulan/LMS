# B3 LMS Design Part 1: Role Matrix and Screen Map

**Document Version:** 1.0
**Created:** 2024-12-09
**Status:** Final

---

## Executive Summary

This document defines the complete role-based access control and screen architecture for the B3 Learning Portal. It establishes:

- **5 user roles** with distinct permissions and workflows
- **Role matrix** mapping all system functions to roles
- **Complete screen maps** for each role, detailing purpose, components, and navigation

The design follows UX best practices from Canvas LMS, Coursera, SAP Litmos, and other leading platforms, adapted to B3 platform capabilities.

---

## Table of Contents

1. [Role Definitions](#role-definitions)
2. [Role Matrix](#role-matrix)
3. [Screen Maps by Role](#screen-maps-by-role)
   - [Guest Screens](#guest-screens)
   - [Student Screens](#student-screens)
   - [Methodist Screens](#methodist-screens)
   - [Teacher Screens](#teacher-screens)
   - [Admin Screens](#admin-screens)

---

## Role Definitions

### 1. Публичный гость (Guest)
**Purpose:** Unregistered visitors who can explore the course catalog and apply for courses

**Capabilities:**
- Browse public course catalog
- Search and filter courses
- View course descriptions and syllabi
- Submit course application/registration
- Create account or login

**Cannot:**
- Access course content
- View student materials
- Interact with enrolled courses

---

### 2. Студент (Student)
**Purpose:** Enrolled learners who take courses, submit assignments, and track progress

**Capabilities:**
- Access enrolled courses
- View course materials and lectures
- Submit assignments
- Track personal progress
- Communicate with teachers
- View grades and feedback
- Download certificates

**Cannot:**
- Modify course content
- Grade other students
- Manage course instances
- Access administrative functions

---

### 3. Методист (Methodist)
**Purpose:** Course designers who create and maintain course templates and educational content

**Capabilities:**
- Design course templates
- Create assignment templates
- Define course structure and modules
- Set grading criteria
- Create certificate templates
- Manage learning materials library
- Version control for course content

**Cannot:**
- Run live course instances
- Grade students
- Manage enrollments
- Approve course applications

---

### 4. Преподаватель (Teacher)
**Purpose:** Instructors who run course instances, teach students, and evaluate their work

**Capabilities:**
- Launch course instances from templates
- Manage course enrollments
- Grade assignments
- Provide feedback to students
- Communicate with students (1-on-1 and broadcast)
- View class gradebook
- Generate progress reports
- Issue certificates to qualified students
- Customize instance-specific content

**Cannot:**
- Modify course templates
- Create new course structures
- Access system configuration
- Approve registration requests (unless also Admin)

---

### 5. Администратор (Admin)
**Purpose:** System managers who configure platform, manage users, and oversee operations

**Capabilities:**
- Manage all users and roles
- Approve/reject course applications
- Configure system settings
- Manage course catalog visibility
- Oversee all courses and enrollments
- Generate system-wide reports
- Configure certificate templates
- Manage integrations and workflows
- Monitor system health

**Full access to all system functions**

---

## Role Matrix

| Function | Guest | Student | Methodist | Teacher | Admin | Notes |
|----------|:-----:|:-------:|:---------:|:-------:|:-----:|-------|
| **CATALOG & DISCOVERY** |
| Browse course catalog | ✓ | ✓ | ✓ | ✓ | ✓ | All can view public catalog |
| Search courses | ✓ | ✓ | ✓ | ✓ | ✓ | Full-text search |
| Filter courses (type, level, topic) | ✓ | ✓ | ✓ | ✓ | ✓ | Advanced filters available |
| View course description | ✓ | ✓ | ✓ | ✓ | ✓ | Public information only |
| View course syllabus | ✓ | ✓ | ✓ | ✓ | ✓ | Overview of modules |
| View course prerequisites | ✓ | ✓ | ✓ | ✓ | ✓ | Listed in course detail |
| **REGISTRATION & ENROLLMENT** |
| Create account | ✓ | - | - | - | - | Guest → Student conversion |
| Submit course application | ✓ | ✓ | ✗ | ✗ | ✓ | Guests & students can apply |
| Approve course application | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Reject course application | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Self-enroll in course | ✗ | ✓ | ✗ | ✗ | ✗ | If course allows |
| Enroll others in course | ✗ | ✗ | ✗ | ✓ | ✓ | Teacher & Admin |
| Unenroll from course | ✗ | ✓* | ✗ | ✓ | ✓ | *Student: own enrollment only |
| View enrollment status | ✗ | ✓ | ✗ | ✓ | ✓ | |
| **LEARNING & COURSE ACCESS** |
| Access course dashboard | ✗ | ✓ | ✗ | ✓ | ✓ | Enrolled only |
| View "My Courses" | ✗ | ✓ | ✗ | ✓ | ✓ | Personal enrolled list |
| View course progress | ✗ | ✓ | ✗ | ✓ | ✓ | Student: own; Teacher: all students |
| Access course materials | ✗ | ✓ | ✓* | ✓ | ✓ | *Methodist: template editing |
| View lecture content | ✗ | ✓ | ✗ | ✓ | ✓ | Videos, docs, slides |
| Download course files | ✗ | ✓ | ✗ | ✓ | ✓ | Supplementary materials |
| Mark content as complete | ✗ | ✓ | ✗ | ✗ | ✗ | Self-paced tracking |
| View personal credentials (lab access) | ✗ | ✓ | ✗ | ✓ | ✓ | Personalized per student |
| **ASSIGNMENTS & ASSESSMENTS** |
| View assignment list | ✗ | ✓ | ✓* | ✓ | ✓ | *Methodist: template view |
| View assignment details | ✗ | ✓ | ✓* | ✓ | ✓ | |
| Submit assignment | ✗ | ✓ | ✗ | ✗ | ✗ | Student only |
| Upload files for assignment | ✗ | ✓ | ✗ | ✗ | ✗ | Multiple files supported |
| View assignment status | ✗ | ✓ | ✗ | ✓ | ✓ | Not started/submitted/graded |
| View submission history | ✗ | ✓ | ✗ | ✓ | ✓ | All attempts |
| Grade assignment | ✗ | ✗ | ✗ | ✓ | ✓ | Teacher primary, Admin override |
| Provide assignment feedback | ✗ | ✗ | ✗ | ✓ | ✓ | Comments and annotations |
| Request assignment resubmission | ✗ | ✗ | ✗ | ✓ | ✓ | Return for rework |
| View grades | ✗ | ✓ | ✗ | ✓ | ✓ | Student: own; Teacher: all |
| View gradebook | ✗ | ✓* | ✗ | ✓ | ✓ | *Student: personal view only |
| **COMMUNICATION** |
| Send message to teacher | ✗ | ✓ | ✗ | ✗ | ✗ | 1-on-1 communication |
| Send message to student | ✗ | ✗ | ✗ | ✓ | ✓ | Individual or broadcast |
| View course chat/dialog | ✗ | ✓ | ✗ | ✓ | ✓ | General course discussion |
| View assignment-specific chat | ✗ | ✓ | ✗ | ✓ | ✓ | Per-assignment thread |
| Post course announcements | ✗ | ✗ | ✗ | ✓ | ✓ | Broadcast to all enrolled |
| View course announcements | ✗ | ✓ | ✗ | ✓ | ✓ | All enrolled users |
| Access message inbox | ✗ | ✓ | ✓ | ✓ | ✓ | Aggregated messages |
| Receive email notifications | ✗ | ✓ | ✓ | ✓ | ✓ | Configurable |
| **COURSE TEMPLATE DESIGN** |
| Create course template | ✗ | ✗ | ✓ | ✗ | ✓ | Methodist primary role |
| Edit course template | ✗ | ✗ | ✓ | ✗ | ✓ | Structure and content |
| Delete course template | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Version course template | ✗ | ✗ | ✓ | ✗ | ✓ | Track changes |
| Create assignment template | ✗ | ✗ | ✓ | ✗ | ✓ | Define assignment types |
| Edit assignment template | ✗ | ✗ | ✓ | ✗ | ✓ | Criteria, files, instructions |
| Define grading rubric | ✗ | ✗ | ✓ | ✗ | ✓ | Points, criteria |
| Set assignment prerequisites | ✗ | ✗ | ✓ | ✗ | ✓ | Unlock logic |
| Upload course materials | ✗ | ✗ | ✓ | ✓ | ✓ | Videos, docs, links |
| Organize course modules | ✗ | ✗ | ✓ | ✗ | ✓ | Structure and sequencing |
| Preview course template | ✗ | ✗ | ✓ | ✓ | ✓ | As-student view |
| Publish course template | ✗ | ✗ | ✓ | ✗ | ✓ | Make available for instances |
| **COURSE INSTANCE MANAGEMENT** |
| Create course instance | ✗ | ✗ | ✗ | ✓ | ✓ | From template |
| Configure instance settings | ✗ | ✗ | ✗ | ✓ | ✓ | Dates, capacity, etc. |
| Launch course instance | ✗ | ✗ | ✗ | ✓ | ✓ | Start teaching |
| Close course instance | ✗ | ✗ | ✗ | ✓ | ✓ | Complete course |
| Assign teacher to instance | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Customize instance content | ✗ | ✗ | ✗ | ✓ | ✓ | Override template |
| Set instance deadlines | ✗ | ✗ | ✗ | ✓ | ✓ | Per-assignment dates |
| Manage instance enrollments | ✗ | ✗ | ✗ | ✓ | ✓ | Add/remove students |
| **CERTIFICATES** |
| View own certificates | ✗ | ✓ | ✗ | ✗ | ✓ | Student earned certs |
| Download certificate PDF | ✗ | ✓ | ✗ | ✗ | ✓ | |
| Create certificate template | ✗ | ✗ | ✓ | ✗ | ✓ | Design and layout |
| Issue certificate to student | ✗ | ✗ | ✗ | ✓ | ✓ | Upon course completion |
| Revoke certificate | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Configure certificate rules | ✗ | ✗ | ✓ | ✗ | ✓ | Completion criteria |
| View all issued certificates | ✗ | ✗ | ✗ | ✓* | ✓ | *Teacher: own courses only |
| **REPORTS & ANALYTICS** |
| View personal dashboard | ✗ | ✓ | ✓ | ✓ | ✓ | Role-appropriate view |
| View personal progress | ✗ | ✓ | ✗ | ✗ | ✗ | Student only |
| View class gradebook | ✗ | ✗ | ✗ | ✓ | ✓ | Matrix: students × assignments |
| Generate class progress report | ✗ | ✗ | ✗ | ✓ | ✓ | Per course instance |
| View student performance analytics | ✗ | ✗ | ✗ | ✓ | ✓ | Detailed insights |
| Export grade data | ✗ | ✗ | ✗ | ✓ | ✓ | CSV/Excel export |
| View system-wide reports | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| View enrollment statistics | ✗ | ✗ | ✗ | ✗ | ✓ | Across all courses |
| View completion statistics | ✗ | ✗ | ✗ | ✗ | ✓ | System metrics |
| View course popularity metrics | ✗ | ✗ | ✗ | ✗ | ✓ | Applications, enrollments |
| **USER & SYSTEM MANAGEMENT** |
| Manage user profile | ✗ | ✓ | ✓ | ✓ | ✓ | Own profile only |
| Change password | ✗ | ✓ | ✓ | ✓ | ✓ | Own account |
| Configure notifications | ✗ | ✓ | ✓ | ✓ | ✓ | Personal preferences |
| Create user accounts | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Assign user roles | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Deactivate users | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| Manage organizational structure | ✗ | ✗ | ✗ | ✗ | ✓ | Departments, groups |
| Configure system settings | ✗ | ✗ | ✗ | ✗ | ✓ | Platform configuration |
| Manage catalog visibility | ✗ | ✗ | ✗ | ✗ | ✓ | Public/private courses |
| Configure BPMN workflows | ✗ | ✗ | ✗ | ✗ | ✓ | Approval processes |
| Manage integrations | ✗ | ✗ | ✗ | ✗ | ✓ | External systems |
| View audit logs | ✗ | ✗ | ✗ | ✗ | ✓ | System activity tracking |
| **MATERIALS LIBRARY** |
| Browse materials library | ✗ | ✓ | ✓ | ✓ | ✓ | Shared resources |
| Search materials | ✗ | ✓ | ✓ | ✓ | ✓ | By topic, type, keyword |
| Upload to library | ✗ | ✗ | ✓ | ✓ | ✓ | Methodist & Teacher |
| Organize library categories | ✗ | ✗ | ✓ | ✗ | ✓ | Methodist primary |
| Download from library | ✗ | ✓ | ✓ | ✓ | ✓ | All authenticated users |
| **E-COMMERCE (Future)** |
| Purchase course | ✓ | ✓ | ✗ | ✗ | ✗ | Payment integration |
| View course price | ✓ | ✓ | ✓ | ✓ | ✓ | Public information |
| Apply promo code | ✓ | ✓ | ✗ | ✗ | ✗ | During purchase |
| Manage pricing | ✗ | ✗ | ✗ | ✗ | ✓ | Admin only |
| View sales reports | ✗ | ✗ | ✗ | ✗ | ✓ | Revenue analytics |

---

## Screen Maps by Role

---

## Guest Screens

### 1. Landing Page (Homepage)
**Purpose:** Entry point for unauthenticated visitors; showcase platform value and encourage exploration

**Components:**
- Hero section with platform value proposition
- Featured courses carousel (3-5 highlighted courses)
- Course categories/topics overview
- Success stories or testimonials
- Platform features/benefits summary
- CTA buttons: "Browse Courses" / "Sign Up" / "Login"

**Actions:**
- Browse featured courses
- Navigate to course catalog
- Sign up for new account
- Login to existing account
- Search courses (global search bar)

**Data Displayed:**
- Course titles, images, brief descriptions
- Total number of courses available
- Total number of students/completions (social proof)

**Navigation:**
- **Arrives from:** Direct URL, external links
- **Can go to:** Catalog, Course Detail, Registration, Login

---

### 2. Course Catalog Page
**Purpose:** Browse and search all available courses with filtering

**Components:**
- Search bar (full-text search)
- Filter sidebar:
  - Course type (Базовый / Продвинутый)
  - Topic/category
  - Level (beginner, intermediate, advanced)
  - Duration
  - Language
- Course cards grid (3-4 per row):
  - Course image/thumbnail
  - Title and short description
  - Type badge (Базовый / Продвинутый)
  - Duration estimate
  - Prerequisites indicator
  - "View Details" button
- Pagination or infinite scroll
- Sort options (newest, popular, A-Z)

**Actions:**
- Apply filters
- Search courses
- Click course card to view details
- Sort and paginate results

**Data Displayed:**
- Course list with metadata
- Active filter indicators
- Result count

**Navigation:**
- **Arrives from:** Landing page, top navigation
- **Can go to:** Course Detail, back to Landing

---

### 3. Course Detail Page
**Purpose:** Provide comprehensive information about a specific course to help decision-making

**Components:**
- Course header:
  - Title, type, level
  - Cover image or video preview
  - Key stats (duration, number of modules, prerequisites)
- Tabs or sections:
  - **Overview:** Course description, learning objectives
  - **Syllabus:** Module/topic breakdown (high-level, not detailed assignments)
  - **Requirements:** Prerequisites, target audience
  - **About Instructor:** Teacher bio (if public)
- Right sidebar:
  - "Apply for Course" button (primary CTA)
  - Price (if applicable, or "Free")
  - Course format (online, self-paced, instructor-led)
  - Language
- Reviews/testimonials (future feature)

**Actions:**
- Read course information
- Expand/collapse syllabus sections
- Click "Apply for Course" → Registration Form
- Return to catalog

**Data Displayed:**
- Complete course template information (public fields)
- Instructor name
- Course metadata

**Navigation:**
- **Arrives from:** Catalog, Landing (featured courses)
- **Can go to:** Registration Form, Login (if applying), Catalog

---

### 4. Registration / Sign Up Page
**Purpose:** Create new user account for platform access

**Components:**
- Registration form:
  - Full name
  - Email
  - Password (with strength indicator)
  - Confirm password
  - Organization (optional)
  - Phone (optional)
  - Agree to terms & conditions (checkbox)
- "Create Account" button
- Link to login: "Already have account? Login"
- Social login options (future: SSO, OAuth)

**Actions:**
- Fill form fields
- Submit registration
- Navigate to login

**Data Displayed:**
- Form validation errors (inline)

**Navigation:**
- **Arrives from:** Course Detail ("Apply" without account), Landing, Catalog
- **Can go to:** Login page, Email Verification page, or direct to Dashboard (if auto-login)

---

### 5. Course Application Form
**Purpose:** Submit formal request to enroll in a course (for courses requiring approval)

**Components:**
- Course information summary (course name, type)
- Application form:
  - Applicant info (auto-filled if logged in)
  - Motivation statement (textarea)
  - Organization/role
  - How did you hear about course? (dropdown)
  - Upload supporting documents (optional: CV, portfolio)
- "Submit Application" button
- Terms and conditions

**Actions:**
- Fill application form
- Upload documents
- Submit for admin approval

**Data Displayed:**
- Course applied for
- Application status (after submission: "Pending Approval")

**Navigation:**
- **Arrives from:** Course Detail page
- **Can go to:** Confirmation page → Login/Dashboard (if approved), or Thank You page for guests

---

### 6. Login Page
**Purpose:** Authenticate existing users

**Components:**
- Login form:
  - Email/username
  - Password
  - "Remember me" checkbox
- "Login" button
- "Forgot password?" link
- "Don't have account? Sign up" link
- SSO options (future: LDAP, OAuth)

**Actions:**
- Enter credentials and login
- Reset password
- Navigate to registration

**Data Displayed:**
- Error messages (invalid credentials)

**Navigation:**
- **Arrives from:** Any guest page (top nav), Course Detail, Landing
- **Can go to:** Student Dashboard (on successful login), Password Reset

---

### 7. Password Reset Page
**Purpose:** Allow users to reset forgotten passwords

**Components:**
- Email input field
- "Send Reset Link" button
- Back to login link

**Actions:**
- Enter email
- Receive reset link via email
- Click link → reset password form

**Data Displayed:**
- Success/error messages

**Navigation:**
- **Arrives from:** Login page
- **Can go to:** Login page (after reset)

---

## Student Screens

### 1. Student Dashboard (Home)
**Purpose:** Central hub for students; quick access to active courses, upcoming tasks, and progress overview

**Components:**
- Welcome message with student name
- **"My Courses" Section:**
  - Course cards (2-3 per row):
    - Course title and image
    - Progress bar (% complete)
    - Status badge (Not Started / In Progress XX% / Completed)
    - Next action: "Continue" button → next incomplete assignment
    - Teacher name
- **"To-Do / Upcoming" Widget:**
  - List of upcoming assignment deadlines (next 5-7)
  - Each item: Assignment name, course, due date, "Go to Assignment" link
  - Overdue items highlighted in red
- **"Recent Messages" Widget:**
  - Last 3-5 unread messages from teachers
  - Link: "View All Messages"
- **"My Certificates" Widget:**
  - Recently earned certificates (thumbnails)
  - Link: "View All Certificates"
- Top navigation bar:
  - Dashboard, My Courses, Messages, Certificates, Profile
  - Notifications icon (bell)
  - Search bar

**Actions:**
- Click "Continue" on course → next assignment
- Click course card → Course Page
- Click to-do item → Assignment page
- View messages → Messages inbox
- Access global search

**Data Displayed:**
- List of enrolled courses with progress
- Aggregated upcoming deadlines
- Message previews
- Certificate count

**Navigation:**
- **Arrives from:** Login, any internal page (top nav)
- **Can go to:** Course Page, Assignment Page, Messages, Certificates, Profile

---

### 2. My Courses Page
**Purpose:** Complete list of all enrolled courses (current, completed, archived)

**Components:**
- Tabs: "Active" / "Completed" / "All"
- Course list/grid (similar to dashboard but more detailed):
  - Course title, image, teacher
  - Progress bar and percentage
  - Enrollment date, completion date (if finished)
  - Status (active, completed)
  - "Enter Course" button
- Filter/sort options:
  - Sort by: Recent activity, Title, Progress
  - Filter by: Type, Status

**Actions:**
- Switch between tabs
- Enter course
- Sort and filter

**Data Displayed:**
- All enrolled course instances (Запись на курс)
- Progress and status for each

**Navigation:**
- **Arrives from:** Dashboard, top navigation
- **Can go to:** Course Page (specific course)

---

### 3. Course Page (Student View)
**Purpose:** Main interface for accessing course content, assignments, and communication

**Components:**
- **Header:**
  - Course title, type, teacher name
  - Overall progress bar (% complete)
  - "Back to My Courses" breadcrumb
- **Left Sidebar (Navigation Tree):**
  - Module list (collapsible):
    - Module name
    - Nested items:
      - Lectures (video/document icon)
      - Assignments (assignment icon)
      - Status icons: ✓ (complete), • (in progress), ○ (not started)
  - Active item highlighted
- **Main Content Area (center):**
  - Dynamic based on selected item:
    - If lecture: video player or document viewer + description
    - If assignment: Assignment detail (see Assignment Page)
  - "Mark as Complete" button (for lectures)
  - Navigation: "Previous" / "Next" buttons (sequential navigation)
- **Top Tabs (alternative to sidebar):**
  - Overview, Content, Assignments, Grades, Communication, Resources
- **Communication Tab/Section:**
  - General course chat/discussion
  - "New Message to Teacher" button
  - List of course announcements

**Actions:**
- Navigate modules and content
- Mark lectures as complete
- Access assignments
- Send messages to teacher
- View announcements

**Data Displayed:**
- Course structure (from Шаблон курса)
- Student's completion status per item (from Экземпляр задания, progress tracking)
- Personalized content (lab credentials, instance-specific info)

**Navigation:**
- **Arrives from:** Dashboard, My Courses
- **Can go to:** Assignment Page, Lecture Detail, Messages, Grades

---

### 4. Lecture / Content Detail Page
**Purpose:** Display individual lecture or learning material

**Components:**
- Lecture title and description
- Content area:
  - Embedded video player (with controls, captions)
  - OR embedded document viewer (PDF, slide deck)
  - OR rich text content
- Download links (if files available)
- "Resources" section: supplementary files, links
- Discussion/Q&A section (future: comments on lecture)
- "Mark as Complete" checkbox
- Navigation: "Previous Lecture" / "Next Lecture" or back to course

**Actions:**
- Watch video / read content
- Download materials
- Mark complete
- Navigate to next item

**Data Displayed:**
- Lecture content
- Completion status

**Navigation:**
- **Arrives from:** Course Page (module navigation)
- **Can go to:** Next/previous content item, Course Page

---

### 5. Assignment Page (Student View)
**Purpose:** View assignment requirements, submit work, and track grading status

**Components:**
- **Header:**
  - Assignment title, type (lab, quiz, project)
  - Due date (with countdown or "overdue" warning)
  - Points possible
  - Status badge (Not Started / Submitted / Graded / Needs Revision)
- **Instructions Section:**
  - Assignment description (rich text)
  - Attached files (instructions, templates)
  - Grading rubric (if visible)
- **Submission Section:**
  - If not yet submitted:
    - Text editor (for text submissions)
    - File upload area (drag-and-drop, multiple files)
    - Link input (e.g., GitHub repo, deployed app URL)
    - "Submit Assignment" button (primary CTA)
  - If already submitted:
    - "Submitted on [date]" status
    - View submitted files/text
    - "Resubmit" button (if allowed)
- **Feedback Section:**
  - Teacher comments (visible after grading)
  - Grade/score received
  - Status: "Accepted" / "Needs Revision"
- **Discussion Section:**
  - Assignment-specific chat thread with teacher
  - "Ask Question" or "Add Comment" form
  - Message history

**Actions:**
- Read assignment instructions
- Download attached files
- Write/upload submission
- Submit for grading
- Resubmit if requested
- Communicate with teacher about assignment

**Data Displayed:**
- Assignment template details (Шаблон задания)
- Student's assignment instance status (Экземпляр задания)
- Submission history
- Grade and feedback
- Conversation thread (Диалог по заданию)

**Navigation:**
- **Arrives from:** Course Page, Dashboard (to-do list)
- **Can go to:** Course Page (back), Next Assignment

---

### 6. Personal Gradebook / Grades Page
**Purpose:** View all grades and performance across enrolled courses

**Components:**
- Course selector dropdown (or tabs per course)
- **Per-course gradebook table:**
  - Columns: Assignment Name, Type, Due Date, Status, Score, Feedback Link
  - Rows: All assignments in course
  - Final grade/total points at bottom
- Progress chart (optional): visual representation of scores over time
- Filter: Show all / Graded only / Pending

**Actions:**
- Select course
- View individual assignment scores
- Click assignment → Assignment Page (to see feedback)

**Data Displayed:**
- All Экземпляр задания for student
- Grades, statuses, submission dates

**Navigation:**
- **Arrives from:** Course Page, Dashboard, top navigation
- **Can go to:** Assignment Page (for details)

---

### 7. Messages / Inbox Page
**Purpose:** Central communication hub for all conversations with teachers

**Components:**
- Left panel: Conversation list
  - Each conversation: Teacher/course name, last message preview, timestamp
  - Unread indicator (badge with count)
  - Filter: All / Unread / By Course
- Right panel: Message thread
  - Message history (chronological)
  - Each message: sender name, timestamp, message text
  - Reply form at bottom (text area + "Send" button)
  - Attach file option
- "New Message" button (compose to teacher)

**Actions:**
- Select conversation
- Read messages
- Reply to teacher
- Start new conversation
- Filter conversations

**Data Displayed:**
- All Диалог по курсу and Диалог по заданию for student
- Message threads

**Navigation:**
- **Arrives from:** Dashboard, Course Page, top navigation
- **Can go to:** Course Page (if clicking course context link), Assignment Page

---

### 8. Certificates Page
**Purpose:** View and download earned certificates

**Components:**
- Certificate grid/list:
  - Each certificate card:
    - Certificate thumbnail image
    - Course name
    - Issue date
    - Serial number
    - "Download PDF" button
    - "View Details" link
- Filter/sort: By date, by course
- Empty state (if no certificates): "Complete courses to earn certificates"

**Actions:**
- View certificate details
- Download PDF
- Share certificate (future: LinkedIn integration)

**Data Displayed:**
- All Экземпляр сертификата for student
- Certificate metadata

**Navigation:**
- **Arrives from:** Dashboard, top navigation
- **Can go to:** PDF download (opens in new tab)

---

### 9. Profile / Settings Page
**Purpose:** Manage personal account information and preferences

**Components:**
- Profile information section:
  - Avatar/photo upload
  - Name, email, phone
  - Organization, position
  - Edit button
- Password change section:
  - Current password
  - New password, confirm
  - "Update Password" button
- Notification preferences:
  - Email notifications (checkboxes for: New assignment, Grade received, Message from teacher, Course announcement)
  - In-app notifications toggle
- Language preference (if multi-language support)
- Account activity log (optional)

**Actions:**
- Update profile info
- Change password
- Configure notifications
- View activity log

**Data Displayed:**
- User account data (Пользователь, Слушатель курса)

**Navigation:**
- **Arrives from:** Top navigation (user menu)
- **Can go to:** Dashboard

---

### 10. Personal Lab Credentials Page (Course-Specific)
**Purpose:** Provide personalized access credentials for lab environments (specific to instance)

**Components:**
- Course name and description
- Lab environment information:
  - Lab URL (clickable link)
  - Username
  - Password (show/hide toggle)
  - Connection instructions
- "Copy Credentials" button
- Lab status indicator (Active / Expired)
- Support contact info

**Actions:**
- Copy credentials
- Open lab environment link
- Contact support if issues

**Data Displayed:**
- Персональные креды (stored in Запись на курс or related entity)

**Navigation:**
- **Arrives from:** Course Page (resources tab)
- **Can go to:** External lab environment (new tab), Course Page

---

## Methodist Screens

### 1. Methodist Dashboard
**Purpose:** Central hub for course designers; manage course templates and content library

**Components:**
- Welcome message
- **"My Course Templates" Section:**
  - List/grid of course templates created by Methodist
  - Each card: Template name, version, status (Draft / Published), last edited date
  - "Create New Template" button (primary CTA)
- **"Recent Activity" Widget:**
  - Recent edits, publications, feedback from teachers
- **"Content Library" Widget:**
  - Quick access to materials library
  - Upload new materials button
- **Statistics Summary:**
  - Total templates created
  - Active course instances using templates
  - Materials uploaded
- Top navigation: Dashboard, Templates, Materials Library, Certificates, Profile

**Actions:**
- Create new course template
- Edit existing template
- View template details
- Access materials library

**Data Displayed:**
- List of Шаблон курса created by Methodist
- Activity log
- Stats

**Navigation:**
- **Arrives from:** Login, any Methodist page
- **Can go to:** Template Editor, Materials Library, Certificate Designer

---

### 2. Course Template List Page
**Purpose:** Browse and manage all course templates (comprehensive view)

**Components:**
- Table or grid view toggle
- Course template list:
  - Columns (table view): Name, Type, Version, Status, Created Date, Last Modified, Actions
  - Actions: Edit, Duplicate, Preview, Publish, Archive
- Search and filter:
  - By status (Draft / Published / Archived)
  - By type (Базовый / Продвинутый)
  - By keyword
- "Create New Template" button
- Sort options

**Actions:**
- Create, edit, duplicate, delete templates
- Publish or archive
- Preview as student

**Data Displayed:**
- All Шаблон курса in system (Methodist-created or all, depending on permissions)

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** Template Editor, Template Preview

---

### 3. Course Template Editor
**Purpose:** Design and configure a course template (structure, modules, assignments, settings)

**Components:**
- **Header:**
  - Template title (editable)
  - Status badge (Draft / Published)
  - "Save Draft" / "Publish" / "Preview" buttons
  - Back to templates list
- **Left Sidebar (Sections/Tabs):**
  - Basic Info
  - Modules & Content
  - Assignments
  - Settings
  - Certificate Configuration
- **Main Content Area (changes per sidebar selection):**

#### Basic Info Tab:
- Course name
- Short description, full description (rich text editor)
- Course type (dropdown: Базовый / Продвинутый)
- Target audience, prerequisites (text fields)
- Cover image upload
- Estimated duration
- Learning objectives (list)

#### Modules & Content Tab:
- Module builder (drag-and-drop interface):
  - Add Module button
  - Each module: Title, description, order
  - Nested content items:
    - Add Lecture (video, document, link)
    - Add Resource (file download)
    - Each item: Title, description, type, file upload
  - Reorder modules/items (drag handles)
- Collapsible tree view
- "Import from Library" button (add materials from library)

#### Assignments Tab:
- List of assignment templates in course
- "Add Assignment" button
- Each assignment row:
  - Assignment name, type, module, order
  - Edit / Delete actions
- Click assignment → Assignment Template Editor (sub-screen or modal):
  - Assignment name, type (Lab, Quiz, Project, Essay)
  - Instructions (rich text)
  - Attached files (upload)
  - Max points
  - Due date offset (e.g., "7 days after module start")
  - Grading rubric editor (criteria, point distribution)
  - Submission type (file upload, text, link, or multiple)
  - Prerequisite assignments (unlock logic)

#### Settings Tab:
- Certification requirements:
  - Minimum passing grade
  - Required assignments (checklist)
  - Certificate template selection (dropdown)
- Enrollment settings:
  - Self-enroll allowed (checkbox)
  - Requires approval (checkbox)
  - Max students per instance
- Visibility:
  - Public in catalog (checkbox)
  - Featured course (checkbox)

**Actions:**
- Edit all template fields
- Add/remove/reorder modules and assignments
- Upload content
- Save draft or publish
- Preview template

**Data Displayed:**
- Шаблон курса entity fields
- Related Шаблон задания entities

**Navigation:**
- **Arrives from:** Template List, Dashboard
- **Can go to:** Template List (save & exit), Preview Mode

---

### 4. Assignment Template Editor (Detail)
**Purpose:** Define assignment requirements, grading criteria, and settings (can be modal or separate page)

**Components:**
- Assignment name, type
- Instructions (rich text editor)
- File attachments (instructional materials, templates)
- Grading section:
  - Max points
  - Grading rubric builder (add criteria, assign points)
- Submission settings:
  - Allowed submission types (checkboxes: File upload, Text entry, URL)
  - File types accepted (if file upload)
  - Max file size
  - Multiple attempts allowed (checkbox)
- Timing:
  - Due date (relative: X days after course start, or absolute)
  - Late submission policy (dropdown: Not allowed / Penalty / Allowed)
- Prerequisites:
  - Select previous assignments that must be completed first
- "Save Assignment Template" button

**Actions:**
- Configure all assignment properties
- Define rubric
- Set prerequisites
- Save template

**Data Displayed:**
- Шаблон задания entity

**Navigation:**
- **Arrives from:** Template Editor (Assignments tab)
- **Can go to:** Template Editor (back)

---

### 5. Course Template Preview
**Purpose:** View course template as a student would see it (QA before publishing)

**Components:**
- Full course structure rendered in student view
- Simulated progress tracking (Methodist can "complete" items to test flow)
- Banner: "PREVIEW MODE - You are viewing as student" (with "Exit Preview" button)
- All modules, lectures, assignments visible

**Actions:**
- Navigate course structure
- Test assignment pages
- Exit preview

**Data Displayed:**
- Rendered Шаблон курса with all Шаблон задания

**Navigation:**
- **Arrives from:** Template Editor ("Preview" button)
- **Can go to:** Template Editor ("Exit Preview")

---

### 6. Materials Library Page
**Purpose:** Centralized repository for reusable learning materials

**Components:**
- Search bar (keyword search)
- Filter sidebar:
  - Type (Video, Document, Slide, Link, Image)
  - Topic/category (custom tags)
  - Uploaded by (Methodist, Teacher)
  - Date uploaded
- Materials grid/list:
  - Each item: Thumbnail, title, type, size, uploader, date
  - Actions: Preview, Download, Edit Metadata, Delete, "Add to Course"
- "Upload New Material" button (opens upload modal)
- Bulk actions: Select multiple, delete, tag

**Actions:**
- Upload materials
- Search and filter
- Preview materials
- Download or add to course template
- Organize with tags/categories

**Data Displayed:**
- All Материал курса or shared resources

**Navigation:**
- **Arrives from:** Dashboard, Template Editor (import from library)
- **Can go to:** Template Editor (when adding to course)

---

### 7. Material Upload / Edit Modal
**Purpose:** Upload new learning material or edit existing metadata

**Components:**
- File upload area (drag-and-drop)
- Material metadata form:
  - Title
  - Description
  - Type (auto-detected or manual select)
  - Tags/categories (multi-select)
  - Visibility (Private / Shared with all)
- Preview (if image/video)
- "Upload" or "Save Changes" button

**Actions:**
- Upload file
- Enter metadata
- Save to library

**Data Displayed:**
- Material metadata

**Navigation:**
- **Arrives from:** Materials Library
- **Can go to:** Materials Library (close modal)

---

### 8. Certificate Template Designer
**Purpose:** Design certificate layout using B3 print form constructor

**Components:**
- Certificate canvas (visual editor):
  - Drag-and-drop elements:
    - Text boxes (static and variable: student name, course name, date, serial number)
    - Images (logo, signatures, background)
    - Shapes and borders
  - Formatting toolbar (font, size, color, alignment)
- Template settings:
  - Certificate name
  - Associated course types
  - Serial number format
- Preview button (generate sample PDF)
- Save template button

**Actions:**
- Design certificate layout
- Add dynamic fields (merge tags)
- Preview PDF
- Save template

**Data Displayed:**
- Шаблон сертификата entity

**Navigation:**
- **Arrives from:** Dashboard, Template Editor (certificate config)
- **Can go to:** Certificate template list

---

### 9. Certificate Template List
**Purpose:** Manage all certificate templates

**Components:**
- List of certificate templates:
  - Template name, associated course(s), created date
  - Actions: Edit, Duplicate, Delete, Preview
- "Create New Certificate" button

**Actions:**
- Create, edit, delete templates
- Preview sample certificates

**Data Displayed:**
- All Шаблон сертификата

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** Certificate Designer

---

### 10. Methodist Profile / Settings
**Purpose:** Manage Methodist account settings

**Components:**
- Same as Student profile page (avatar, name, email, password change, notifications)
- Additional: Work preferences, default templates

**Actions:**
- Update profile
- Configure preferences

**Data Displayed:**
- User account data

**Navigation:**
- **Arrives from:** Top nav (user menu)
- **Can go to:** Dashboard

---

## Teacher Screens

### 1. Teacher Dashboard
**Purpose:** Central hub for teachers; manage active course instances and monitor student progress

**Components:**
- Welcome message with teacher name
- **"My Course Instances" Section:**
  - List/cards of active course instances taught by teacher
  - Each card: Course name, instance ID/group, start/end dates, enrolled students count, "Manage Course" button
- **"Pending Tasks" Widget:**
  - Assignments awaiting grading (count)
  - Unread student messages (count)
  - Recent student submissions (list)
  - "Go to Gradebook" link
- **"Recent Activity" Widget:**
  - Latest student submissions, completions, messages
- **Quick Actions:**
  - "Create New Course Instance" button
  - "View All Instances" button
  - "Messages" link
- Top navigation: Dashboard, My Courses, Gradebook, Messages, Reports, Profile

**Actions:**
- Access course instance management
- Navigate to gradebook
- View pending tasks
- Create new instance

**Data Displayed:**
- All Экземпляр курса where teacher is assigned
- Aggregated stats (pending grades, messages)

**Navigation:**
- **Arrives from:** Login, any teacher page
- **Can go to:** Course Instance Management, Gradebook, Messages

---

### 2. My Course Instances Page
**Purpose:** Comprehensive list of all course instances (active, upcoming, completed)

**Components:**
- Tabs: "Active" / "Upcoming" / "Completed"
- Table view:
  - Columns: Course Name, Instance ID, Start Date, End Date, Students Enrolled, Status, Actions
  - Actions per row: Manage, View Gradebook, View Enrollments, Close Instance
- "Create New Instance" button
- Filter/search by course name or date

**Actions:**
- View and manage instances
- Create new instance
- Filter and search
- Access gradebook per instance

**Data Displayed:**
- All Экземпляр курса for teacher
- Enrollment counts, dates, status

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** Course Instance Management Page, Gradebook, Instance Creation Wizard

---

### 3. Course Instance Creation Wizard
**Purpose:** Launch a new course instance from a template

**Components:**
- Step-by-step wizard (3-4 steps):

#### Step 1: Select Template
- Dropdown or searchable list of published course templates (Шаблон курса)
- Preview template button

#### Step 2: Configure Instance
- Instance name (auto-generated or custom)
- Start date, end date
- Group/cohort identifier
- Max students
- Assign co-teachers (optional)

#### Step 3: Customize Content (optional)
- Option to override template content for this instance
- Adjust assignment deadlines (absolute dates vs. relative)
- Personalize welcome message

#### Step 4: Enroll Students
- Bulk upload (CSV)
- Manual selection from user list
- Or skip (enroll later)

- "Create Instance" button (final step)

**Actions:**
- Select template
- Configure settings
- Customize if needed
- Enroll initial students
- Launch instance

**Data Displayed:**
- Available Шаблон курса
- New Экземпляр курса being created

**Navigation:**
- **Arrives from:** My Course Instances page ("Create New")
- **Can go to:** Course Instance Management (after creation), My Course Instances

---

### 4. Course Instance Management Page
**Purpose:** Manage a specific course instance (content, enrollments, settings, communication)

**Components:**
- **Header:**
  - Course instance name, dates, status
  - "Launch Course" / "Close Course" / "Archive" buttons
  - Back to My Courses
- **Tabs:**
  - Overview
  - Content & Modules
  - Enrollments
  - Assignments & Grading
  - Communication
  - Settings

#### Overview Tab:
- Summary stats: Total students, completion rate, average grade
- Recent student activity feed
- Upcoming assignment deadlines
- Quick links: Gradebook, Messages

#### Content & Modules Tab:
- Same structure as Methodist's module view, but with instance-specific customizations
- Edit module/lecture details (instance override)
- Upload additional resources
- Reorder if needed

#### Enrollments Tab:
- Table of enrolled students:
  - Name, email, enrollment date, status (Active / Completed / Dropped)
  - Actions: View Profile, Unenroll, Send Message
- "Enroll New Student" button (search/add individual or bulk upload)
- Filter: Active / Completed

#### Assignments & Grading Tab:
- List of all assignments in instance
- Each assignment: Name, due date, submissions count (X/Y), graded count
- "View Gradebook" button (navigates to Gradebook page)
- Click assignment → Assignment Grading Page

#### Communication Tab:
- Post course announcement (broadcast to all students)
- View sent announcements
- "New Message" button (to individual student or group)
- Link to Messages inbox

#### Settings Tab:
- Edit instance dates, max students
- Enable/disable self-enrollment
- Configure notifications for this instance

**Actions:**
- Manage all aspects of course instance
- Enroll/unenroll students
- Post announcements
- Navigate to grading

**Data Displayed:**
- Экземпляр курса details
- Related Запись на курс (enrollments)
- Экземпляр задания (assignments)

**Navigation:**
- **Arrives from:** Dashboard, My Course Instances
- **Can go to:** Gradebook, Assignment Grading, Enrollment Management, Messages

---

### 5. Gradebook Page (Teacher View)
**Purpose:** View and manage grades for all students in a course instance (matrix view)

**Components:**
- Course instance selector (dropdown if teacher has multiple)
- **Gradebook Table (Student × Assignment matrix):**
  - Rows: Students (names)
  - Columns: Assignments (names, due dates)
  - Cells: Grade/score (numeric or status icon)
    - Color-coded: Graded (green), Pending (yellow), Not Submitted (gray), Late (red)
    - Click cell → Assignment Grading Page for that student
  - Final column: Total score, final grade
- Filter options:
  - Show all / Pending only / Graded only
  - By assignment
  - By student
- Export button (CSV / Excel)
- "Email All Students" button (bulk communication)

**Actions:**
- View all grades at a glance
- Click individual cell to grade
- Export data
- Filter view

**Data Displayed:**
- All Запись на курс for instance
- All Экземпляр задания per student
- Grades matrix

**Navigation:**
- **Arrives from:** Dashboard, Course Instance Management, top nav
- **Can go to:** Assignment Grading Page (by clicking cell), Student Profile

---

### 6. Assignment Grading Page (Teacher View)
**Purpose:** Grade a specific assignment submission from a student

**Components:**
- **Header:**
  - Student name, assignment name, course
  - Submission date, due date (late indicator if applicable)
  - Navigation: Previous Student / Next Student (in grading queue)
  - Back to Gradebook
- **Submission Section:**
  - Submitted text (if text submission)
  - Attached files (download links, inline preview if possible)
  - Submission URL (if link submission)
  - Submission history (if multiple attempts)
- **Grading Section:**
  - Grading rubric (if defined in template):
    - Criteria list with point allocations
    - Checkboxes or sliders to assign points per criterion
  - Total score input (auto-calculated from rubric or manual entry)
  - Grade status dropdown: Graded / Needs Revision / Accepted
  - Feedback text area (comments to student)
  - Attach files (feedback documents, annotated work)
- **Actions:**
  - "Save Grade" button
  - "Request Resubmission" button (sets status to Needs Revision, notifies student)
  - "Approve Submission" button (if pass/fail)
- **Discussion Section:**
  - Assignment-specific message thread with student (same as student view)
  - Quick reply form

**Actions:**
- Review submission
- Assign grade and feedback
- Request resubmission
- Communicate with student

**Data Displayed:**
- Экземпляр задания for specific student
- Submission files and metadata
- Диалог по заданию

**Navigation:**
- **Arrives from:** Gradebook (click cell), Course Instance Management (assignments tab), Dashboard (pending tasks)
- **Can go to:** Next/previous student submission, Gradebook, Student Profile

---

### 7. Student Profile / Progress Page (Teacher View)
**Purpose:** View detailed information and progress for an individual student

**Components:**
- Student info: Name, email, enrollment date, current status
- **Progress Summary:**
  - Overall course completion percentage
  - Assignments completed vs. total
  - Average grade
  - Attendance/activity log (when last active)
- **Assignment History Table:**
  - List of all assignments for this student: Name, Status, Grade, Submission Date, Feedback Link
- **Communication History:**
  - Message thread with student (all course-related messages)
- Actions:
  - "Send Message" button
  - "Unenroll Student" button
  - "View in Gradebook" link

**Actions:**
- Review student's complete progress
- Send direct message
- Manage enrollment status

**Data Displayed:**
- Запись на курс for student
- All related Экземпляр задания
- Диалог history

**Navigation:**
- **Arrives from:** Gradebook (click student name), Enrollments tab, Messages (click student context)
- **Can go to:** Messages, Gradebook, Assignment Grading

---

### 8. Messages / Inbox Page (Teacher View)
**Purpose:** Manage all communications with students

**Components:**
- Similar to Student Messages page, but teacher perspective:
- Left panel: Conversation list
  - Grouped by course instance (collapsible)
  - Each conversation: Student name, course, last message preview
  - Unread badge
  - Filter: All / Unread / By Course / By Student
- Right panel: Message thread
  - Message history
  - Reply form
- "Compose New Message" button (select student or broadcast to course)
- Broadcast message option: Select course instance → compose announcement → send to all enrolled students

**Actions:**
- Read and reply to student messages
- Compose new message (1-on-1 or broadcast)
- Filter conversations

**Data Displayed:**
- All Диалог по курсу and Диалог по заданию where teacher is participant

**Navigation:**
- **Arrives from:** Dashboard, Course Instance Management, top nav
- **Can go to:** Student Profile, Assignment Grading (if message is assignment-related)

---

### 9. Course Announcements Page
**Purpose:** Post and manage course-wide announcements

**Components:**
- List of past announcements (per course instance):
  - Each item: Title, date posted, content preview
- "New Announcement" button
- Announcement composer (modal or form):
  - Title
  - Message body (rich text)
  - Target: All students / Specific group
  - Send email notification (checkbox)
  - "Post Announcement" button

**Actions:**
- Create announcement
- View past announcements
- Edit or delete (if needed)

**Data Displayed:**
- Announcements stored per Экземпляр курса

**Navigation:**
- **Arrives from:** Course Instance Management (Communication tab)
- **Can go to:** Back to Course Management

---

### 10. Reports Page (Teacher View)
**Purpose:** Generate and view reports on student performance and course analytics

**Components:**
- Report type selector (dropdown or tabs):
  - Class Progress Report
  - Grade Distribution
  - Assignment Completion Stats
  - Student Activity Report
- Filters:
  - Select course instance
  - Date range
  - Student group
- Report display area:
  - Charts/graphs (completion rate, average grades, etc.)
  - Data tables
- Export options: PDF, CSV, Excel
- "Generate Report" button

**Actions:**
- Select report type and filters
- Generate report
- Export data

**Data Displayed:**
- Aggregated data from Запись на курс, Экземпляр задания

**Navigation:**
- **Arrives from:** Dashboard, Course Instance Management, top nav
- **Can go to:** Dashboard

---

### 11. Certificate Issuance Page
**Purpose:** Issue certificates to students who completed course

**Components:**
- Course instance selector
- List of students eligible for certificate:
  - Name, completion status, final grade, certificate status (Issued / Pending / Not Eligible)
  - Filter: Show eligible only
- Bulk actions: Select all eligible, "Issue Certificates" button
- Individual actions per student: "Issue Certificate" button
- Certificate preview modal (before issuing)

**Actions:**
- Review eligibility (based on rules from template)
- Issue certificates individually or in bulk
- Preview certificate

**Data Displayed:**
- Запись на курс with completion status
- Шаблон сертификата rules
- Экземпляр сертификата (if already issued)

**Navigation:**
- **Arrives from:** Course Instance Management, Dashboard
- **Can go to:** Certificate preview, Gradebook

---

### 12. Teacher Profile / Settings
**Purpose:** Manage teacher account settings

**Components:**
- Same as Student/Methodist: avatar, name, email, password, notifications
- Additional: Teaching preferences, default course settings

**Actions:**
- Update profile
- Configure preferences

**Data Displayed:**
- User account data

**Navigation:**
- **Arrives from:** Top nav (user menu)
- **Can go to:** Dashboard

---

## Admin Screens

### 1. Admin Dashboard
**Purpose:** System overview and access to all administrative functions

**Components:**
- Welcome message
- **System Statistics Widgets:**
  - Total users (by role: Students, Teachers, Methodists, Admins)
  - Total courses (templates and instances)
  - Active enrollments
  - Pending applications (requiring approval)
  - Certificates issued this month
- **Quick Actions:**
  - "Manage Users" button
  - "Approve Applications" button (with badge if pending)
  - "Manage Courses" button
  - "System Settings" button
  - "View Reports" button
- **Recent Activity Feed:**
  - New user registrations
  - Course applications
  - New course instances created
  - Certificates issued
- Top navigation: Dashboard, Users, Courses, Applications, Reports, Settings, Profile

**Actions:**
- Navigate to all admin functions
- View system health at a glance

**Data Displayed:**
- Aggregated stats from all entities

**Navigation:**
- **Arrives from:** Login, any admin page
- **Can go to:** All admin modules

---

### 2. User Management Page
**Purpose:** Manage all user accounts and roles

**Components:**
- User list table:
  - Columns: Name, Email, Role(s), Organization, Status (Active/Inactive), Registration Date, Actions
  - Actions per row: Edit, Change Role, Deactivate, Delete, Reset Password
- Search bar (by name, email)
- Filter sidebar:
  - By role
  - By status (active/inactive)
  - By organization
- "Create New User" button
- Bulk actions: Select multiple users, assign role, deactivate

**Actions:**
- Create, edit, delete users
- Assign/change roles
- Activate/deactivate accounts
- Reset passwords
- Bulk operations

**Data Displayed:**
- All Пользователь entities

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** User Edit Form, User Profile (detail view)

---

### 3. User Edit / Create Form
**Purpose:** Create new user or edit existing user account

**Components:**
- User information form:
  - Name, email, phone
  - Password (for new user, or "Send password reset link")
  - Organization, department
  - Role assignment (checkboxes: Student, Teacher, Methodist, Admin)
  - Status (Active / Inactive)
- "Save User" button
- "Cancel" button

**Actions:**
- Fill form
- Assign roles
- Save user

**Data Displayed:**
- Пользователь entity (new or existing)

**Navigation:**
- **Arrives from:** User Management page
- **Can go to:** User Management (after save)

---

### 4. Course Application Management Page
**Purpose:** Review and approve/reject course applications (Заявка на регистрацию)

**Components:**
- Application queue table:
  - Columns: Applicant Name, Course Requested, Application Date, Status (Pending/Approved/Rejected), Actions
  - Actions per row: View Details, Approve, Reject
- Filter: Status (All / Pending / Approved / Rejected)
- Bulk actions: Select multiple, Approve All, Reject All

**Actions:**
- View application details (modal or side panel):
  - Applicant info
  - Course
  - Motivation statement
  - Attached documents (download)
- Approve (creates Запись на курс)
- Reject (with optional rejection reason)
- Send notification email to applicant

**Data Displayed:**
- All Заявка на регистрацию entities

**Navigation:**
- **Arrives from:** Dashboard (quick action), top nav
- **Can go to:** Application Detail Modal, User Management (to view applicant profile)

---

### 5. Application Detail Modal / Page
**Purpose:** View full details of a course application

**Components:**
- Applicant information (name, email, organization)
- Course requested
- Application date
- Motivation statement (full text)
- Attached documents (links to download)
- Current status
- Admin notes (internal, editable)
- Actions:
  - "Approve Application" button (confirm dialog → creates enrollment)
  - "Reject Application" button (prompt for reason → email sent)
  - "Request More Info" button (email applicant)

**Actions:**
- Review application
- Approve or reject
- Add internal notes
- Contact applicant

**Data Displayed:**
- Заявка на регистрацию detail

**Navigation:**
- **Arrives from:** Application Management page
- **Can go to:** Back to Application Management

---

### 6. Course Management Page (Admin View)
**Purpose:** Oversee all course templates and instances (higher-level control)

**Components:**
- Tabs: "Templates" / "Instances"

#### Templates Tab:
- List of all course templates (similar to Methodist view, but admin sees all):
  - Columns: Name, Created By (Methodist), Status, Created Date, Actions
  - Actions: View, Edit (admin override), Publish, Archive, Delete
- Search and filter

#### Instances Tab:
- List of all course instances across all teachers:
  - Columns: Course Name, Teacher, Start Date, End Date, Enrolled Students, Status, Actions
  - Actions: View, Edit, Close, Delete
- Search and filter by course, teacher, date

**Actions:**
- View all courses
- Edit or delete (admin privileges)
- Manage visibility and publication status

**Data Displayed:**
- All Шаблон курса and Экземпляр курса

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** Template Editor (admin mode), Course Instance Management (admin mode)

---

### 7. Course Catalog Visibility Settings
**Purpose:** Control which courses appear in public catalog and to whom

**Components:**
- List of courses (templates):
  - Each row: Course name, visibility settings
  - Toggle: Public / Private
  - Toggle: Featured (appears on homepage)
  - Target audience selector (All / Specific roles / Specific organizations)
- Save changes button

**Actions:**
- Set course visibility
- Mark courses as featured
- Configure access rules

**Data Displayed:**
- Шаблон курса visibility metadata

**Navigation:**
- **Arrives from:** Course Management page, Settings
- **Can go to:** Course Management

---

### 8. Enrollment Management Page (Admin View)
**Purpose:** View and manage all enrollments across the system

**Components:**
- Enrollment table:
  - Columns: Student Name, Course Name, Instance, Enrollment Date, Status, Progress, Actions
  - Actions: View, Unenroll, Change Status, View Gradebook
- Search by student or course
- Filter by status (Active / Completed / Dropped)
- Bulk actions: Unenroll selected, export list

**Actions:**
- Search enrollments
- Unenroll students (administrative override)
- View progress

**Data Displayed:**
- All Запись на курс entities

**Navigation:**
- **Arrives from:** Course Management, Dashboard, Reports
- **Can go to:** Student Profile, Course Instance Management

---

### 9. Reports & Analytics Page (Admin View)
**Purpose:** Generate system-wide reports and view analytics dashboards

**Components:**
- Report categories (sidebar or tabs):
  - User Statistics
  - Course Enrollment Reports
  - Completion & Certification Reports
  - Performance Analytics
  - Application & Approval Reports
- Dashboard view (for each category):
  - Charts: enrollment trends over time, completion rates, popular courses, etc.
  - Data tables: top-performing students, most popular courses, etc.
- Custom report builder:
  - Select metrics, filters, date range
  - "Generate Report" button
  - Export options (PDF, Excel, CSV)

**Actions:**
- View pre-built dashboard
- Generate custom reports
- Export data
- Schedule automated reports (future feature)

**Data Displayed:**
- Aggregated data from all entities

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** Dashboard

---

### 10. Certificate Management Page (Admin View)
**Purpose:** Oversee all issued certificates and templates

**Components:**
- Tabs: "Issued Certificates" / "Certificate Templates"

#### Issued Certificates Tab:
- List of all issued certificates:
  - Columns: Student Name, Course, Issue Date, Serial Number, Status (Valid/Revoked), Actions
  - Actions: View Certificate, Download PDF, Revoke (with reason)
- Search by student, course, serial number
- Filter by date, status

#### Certificate Templates Tab:
- Same as Methodist certificate list, but admin can manage all templates

**Actions:**
- View and download certificates
- Revoke if necessary (fraud, error)
- Manage templates

**Data Displayed:**
- All Экземпляр сертификата
- All Шаблон сертификата

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** Certificate Designer (admin edit)

---

### 11. System Settings Page
**Purpose:** Configure platform-wide settings and integrations

**Components:**
- Settings organized by category (tabs or accordion):

#### General Settings:
- Platform name, logo, branding
- Default language
- Time zone
- Support contact info

#### Enrollment Settings:
- Default enrollment workflow (auto-approve, manual approval, BPMN process)
- Notification templates (email content for application approval, enrollment confirmation, etc.)

#### Grading Settings:
- Grading scale configuration (points, percentages, letter grades)
- Passing grade threshold

#### Email / Notification Settings:
- SMTP configuration (mail server)
- Default sender email
- Email templates for system notifications

#### Integration Settings:
- SSO configuration (LDAP, OAuth)
- API access (REST API keys, documentation link)
- External integrations (payment gateway, HR systems)

#### Security Settings:
- Password policy (min length, complexity)
- Session timeout
- Two-factor authentication (enable/disable)

#### BPMN Workflow Configuration:
- Link to workflow designer (B3 native)
- Assign processes to events (application approval, assignment submission, certificate generation)

- "Save Settings" button per section

**Actions:**
- Configure all system-level settings
- Test integrations (send test email, test SSO)
- Save changes

**Data Displayed:**
- System configuration entities (platform settings)

**Navigation:**
- **Arrives from:** Dashboard, top nav
- **Can go to:** Workflow Designer (B3 tool), Dashboard

---

### 12. Audit Log / Activity Monitoring Page
**Purpose:** View system activity log for security and compliance

**Components:**
- Activity log table:
  - Columns: Timestamp, User, Action (login, create user, approve application, issue certificate, etc.), IP Address, Details
  - Filter by:
    - User
    - Action type
    - Date range
- Search bar
- Export log (CSV)

**Actions:**
- Review system activity
- Investigate security events
- Export logs for compliance

**Data Displayed:**
- System audit trail (logging mechanism in B3)

**Navigation:**
- **Arrives from:** Settings, Dashboard (admin security)
- **Can go to:** User Management (if investigating specific user)

---

### 13. Admin Profile / Settings
**Purpose:** Manage admin account settings

**Components:**
- Same as other roles: avatar, name, email, password, notifications
- Additional: Admin preferences, dashboard customization

**Actions:**
- Update profile
- Configure preferences

**Data Displayed:**
- User account data

**Navigation:**
- **Arrives from:** Top nav (user menu)
- **Can go to:** Dashboard

---

### 14. Organizational Structure Management Page
**Purpose:** Define and manage organizational hierarchy (departments, groups)

**Components:**
- Tree view of organization structure:
  - Root: Organization name
  - Branches: Departments, sub-departments
  - Leaves: Groups, teams
- Add/edit/delete nodes
- Assign users to departments/groups
- Used for:
  - Filtering reports
  - Access control (future: department-specific courses)
  - User management

**Actions:**
- Create org hierarchy
- Assign users to departments
- Edit structure

**Data Displayed:**
- Organizational structure entities (custom B3 entities)

**Navigation:**
- **Arrives from:** User Management, Settings
- **Can go to:** User Management

---

## Navigation Summary

### Global Navigation Elements (All Roles)

**Top Navigation Bar (Present on all screens after login):**
- Logo / Platform name (links to role-specific dashboard)
- Role-specific menu items (as listed in screen maps above)
- Global search bar (searches courses, users depending on role)
- Notifications icon (bell) with unread count
  - Dropdown: Recent notifications (new messages, grades, approvals, etc.)
  - "View All Notifications" link
- User menu (avatar/name dropdown):
  - Profile
  - Settings
  - Help / Documentation
  - Logout

**Breadcrumb Navigation:**
- Present on detail/sub-pages to show hierarchy
- Example: Dashboard > My Courses > Course Name > Assignment Name

**Footer (All pages):**
- Links: About, Contact Support, Privacy Policy, Terms of Use
- Copyright info

---

## UX Principles Applied (From References)

This design incorporates best practices from leading LMS platforms:

1. **Dashboard-First Approach** (Canvas, Coursera)
   - All roles start at a personalized dashboard with quick actions and key metrics
   - "Continue" buttons lead directly to next action (not just course root)

2. **Progress Transparency** (Coursera, Litmos)
   - Progress bars on all course cards
   - Clear status indicators (Not Started / X% / Completed)
   - To-do lists with upcoming deadlines

3. **Simplified Navigation** (Canvas, Brightspace)
   - Left sidebar or tab-based navigation within courses
   - Collapsible module trees
   - Sequential next/previous navigation within content

4. **Clear Assignment Workflow** (Canvas, Docebo)
   - Assignment page combines: instructions, submission, feedback, discussion
   - Status-driven interface (what can I do now?)
   - Inline grading with rubrics

5. **Integrated Communication** (All platforms)
   - Course-level and assignment-level messaging
   - Aggregated inbox for all conversations
   - Notification system (email + in-app)

6. **Gradebook Matrix** (Canvas, Brightspace, Absorb)
   - Student × Assignment table view for teachers
   - Color-coded statuses
   - Click-through to detailed grading

7. **Certificate Visibility** (Coursera, Udemy)
   - Dedicated certificate page for students
   - Easy download and sharing
   - Automated issuance based on rules

8. **Admin Control Center** (Litmos, Docebo, Absorb)
   - Centralized user, course, and system management
   - Approval workflows for applications
   - System-wide reporting and analytics

9. **Methodist/Designer Separation** (Moodle/Totara pattern)
   - Template vs. Instance model (design once, run many times)
   - Clear separation between course design (Methodist) and course delivery (Teacher)
   - Version control and template reusability

10. **Materials Library** (Brightspace, Docebo)
    - Centralized repository for reusable content
    - Tagging and search for easy discovery
    - Drag-and-drop into courses

---

## Technical Implementation Notes (B3 Platform Alignment)

### Data Model Mapping (from gpt_design.md)

This screen design maps directly to B3 entities:

- **Шаблон курса** → Course Template Editor (Methodist)
- **Экземпляр курса** → Course Instance Management (Teacher)
- **Заявка на регистрацию** → Application Management (Admin approval)
- **Запись на курс** → Enrollment records (Student dashboard, Teacher gradebook)
- **Шаблон задания** → Assignment Template Editor (Methodist)
- **Экземпляр задания** → Assignment Page (Student), Grading Page (Teacher)
- **Диалог по курсу / Диалог по заданию** → Messages/Communication screens
- **Шаблон сертификата** → Certificate Designer (Methodist)
- **Экземпляр сертификата** → Certificates Page (Student), Certificate Management (Admin)

### B3 UI Components to Use

- **Dashboard widgets** → Student/Teacher/Admin dashboards (B3 dashboard builder)
- **Forms and lists** → All CRUD screens (B3 form constructor, live lists)
- **BPMN integration** → Approval workflows (application, grading, certification)
- **Print forms** → Certificate generation (B3 print form constructor)
- **File upload** → Assignment submissions, material library (B3 file handling)
- **Role-based access** → B3 native roles and permissions

### Navigation Pattern

All screens follow B3's standard navigation paradigm:
- Top menu bar (configurable per role)
- Sidebar for detailed navigation (collapsible)
- Breadcrumbs for context
- Modal dialogs for quick actions (create, edit)

---

## Appendix: Screen Count Summary

| Role | Number of Primary Screens |
|------|---------------------------|
| Guest | 7 screens |
| Student | 10 screens |
| Methodist | 10 screens |
| Teacher | 12 screens |
| Admin | 14 screens |
| **Total Unique Screens** | **53 screens** |

(Note: Some screens are shared or similar across roles but with different permissions/data scope)

---

**Document End**

---

## Next Steps

1. **Validate with stakeholders:** Review this role matrix and screen map with B3 team and target users
2. **Prioritize MVP screens:** Not all 53 screens needed for launch; identify Phase 1 vs. Phase 2
3. **Create wireframes:** Visual mockups for key screens (Student Dashboard, Course Page, Assignment Page, Gradebook)
4. **Map BPMN workflows:** Detail process flows for application approval, assignment submission, certificate generation
5. **Refine data model:** Ensure B3 entities support all screen requirements
6. **UI/UX review:** Test navigation and information architecture with users

---

**Version History:**
- v1.0 (2024-12-09): Initial comprehensive design document
