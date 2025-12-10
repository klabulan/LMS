# Research Summary: B3 Learning Portal Implementation

## Executive Summary

This document synthesizes research on B3 platform capabilities, LMS requirements, and industry best practices to inform the design of a learning portal built entirely on the B3 platform. The analysis shows strong alignment between B3's native capabilities and modern LMS requirements, with key reference platforms (Canvas, Coursera, Litmos, Docebo) providing proven UX patterns to adopt.

---

## 1. B3 Platform Capabilities Summary

### 1.1 Core Platform Architecture

The B3 platform provides a comprehensive low-code/no-code environment for building enterprise applications with the following key capabilities:

#### Data Model Construction (Типы представления)
- **Interactive data model constructor**: Visual design of entities (справочники and документы)
- **Entity types map to database tables**: Django models, ClickHouse, views
- **Rich field types**:
  - Text, numbers, dates, dropdowns
  - External table references (foreign keys)
  - File attachments
  - Formulas and computed fields
  - Validators and conditional logic
- **Relationships**: One-to-many, many-to-many between entities
- **Lifecycle management**: Status-based workflows per entity

#### Interface Construction

**Form Types (Типы форм)**:
1. **Форма списка (List View)**: Searchable, filterable tables with bulk actions
2. **Форма элемента (Detail View)**: Rich card/form for single entity instance
3. **Аналитическая панель (Dashboard)**: Aggregations, charts, KPIs with filters
4. **Лендинг (Landing Page)**: Public-facing pages with custom layouts

**Interface Features**:
- Drag-and-drop form designer
- Conditional field visibility
- Tabbed layouts and sections
- Embedded lists and relationships
- Mobile-responsive by default
- Real-time field validation

#### Business Process Engine (BPMN)

- **Visual BPMN 2.0 designer**: Flowchart-based process modeling
- **Status-based workflows**: Entity states with defined transitions
- **Role-based permissions per status**: Read/write/update rights depend on current state
- **Automated actions**:
  - Field calculations and updates
  - Notifications and emails
  - Task creation and assignment
  - External API calls via integrations
- **Process monitoring**: Real-time tracking of process instances
- **Conditional branching**: Decision gateways based on data or rules

#### Print Forms & Document Generation

- **Template designer**: DOCX-based templates with variable placeholders
- **PDF generation**: Automatic conversion with layout preservation
- **Digital signatures**: Integration with signature services
- **Batch generation**: Generate certificates/reports for multiple records
- **Version control**: Template versioning and approval workflows

#### Dashboards & Analytics

- **Universal constructor**: No-code dashboard builder
- **Visualization library**:
  - Bar, line, pie charts
  - Tables with conditional formatting
  - KPI cards with trend indicators
  - Heatmaps and gauges
- **Data aggregation**: COUNT, SUM, AVG, MIN, MAX across entities
- **Drill-down**: Click charts to see underlying records
- **Filters and parameters**: User-controllable data slicing
- **Scheduled refresh**: Auto-update dashboards on schedule

#### Onboarding Module

- **Built-in learning system**: Create step-by-step guides for platform users
- **Contextual hints**: Tooltips and popups tied to UI elements
- **Progress tracking**: Mark lessons as completed
- **Use case**: Ideal for basic B3 platform training courses

#### Role & Permission Model

- **Three-tier structure**:
  1. **Кабинеты (Cabinets)**: Top-level workspaces (e.g., "Learning Portal")
  2. **Роли (Roles)**: User roles within cabinets (Student, Teacher, Admin)
  3. **Права доступа (Permissions)**: Granular CRUD rights per entity and status
- **Permission types**:
  - Read: View entity records
  - Write: Edit existing records
  - Create: Add new records
  - Update: Change status/trigger workflows
- **Row-level security**: Filter records by ownership or attributes
- **Dynamic permissions**: Rules based on user profile or context

#### Communication & Notifications

- **Notification system**:
  - In-app notifications
  - Email delivery
  - Push to mobile app
  - Trigger from processes or manual actions
- **Mass mailings**: Bulk emails to user segments with templates
- **Message templates**: Reusable content with variable substitution
- **Delivery tracking**: Read receipts and click tracking

#### Integration & APIs

- **RESTQL API**: Query and manipulate entities via HTTP
- **Scheduled integrations**: Periodic data sync with external systems
- **Webhooks**: Real-time event notifications to external URLs
- **SSO/LDAP**: Enterprise authentication integration
- **Custom extensions**: Python/Django backend extensions if needed

#### Technology Stack

- **Frontend**: Angular-based responsive web client
- **Backend**: Python (Django) + PostgreSQL
- **Analytics**: ClickHouse for OLAP queries
- **Deployment**: Cloud or on-premise
- **Mobile**: Native iOS/Android apps with offline support

---

## 2. LMS Requirements Summary

### 2.1 User Roles & Scenarios

#### Public Guest (Pre-enrollment)
- **Browse course catalog**: View available courses with descriptions, prerequisites, instructors
- **Register/Apply**: Submit enrollment request (potentially with payment)
- **View landing pages**: Marketing-style course pages with testimonials, outcomes

#### Student (Enrolled Learner)
**Core workflows**:
1. **Enrollment**: Register for course (manual or self-service)
2. **Dashboard view**: See all courses with status (not started / N% complete / finished)
3. **Course detail page**:
   - Course description and objectives
   - Personal credentials (e.g., sandbox access)
   - Assignment list with status
   - Communication with instructor
4. **Assignment detail page**:
   - Description, materials, due date
   - Submit solution (text, file, link)
   - View status (draft / submitted / accepted / needs revision)
   - See grade and feedback comments
5. **Instructor communication**: Ask questions, discuss assignments
6. **Certificate access**: Download PDF certificates for completed courses

**UX expectations** (from references):
- **Progress transparency**: Always show completion % and next step
- **"Continue" button**: Goes directly to next incomplete assignment, not course root
- **Minimal clicks**: Fast path to most common actions
- **Mobile access**: Study anytime, anywhere

#### Teacher / Instructor
**Core workflows**:
1. **Course design**: Create course template with assignment templates
2. **Course instantiation**: Launch course cohort/stream, assign students
3. **Teaching**:
   - Review submitted assignments
   - Provide feedback comments
   - Assign grades
   - Update assignment status
   - Communicate with students (questions, announcements)
4. **Reporting**: View gradebook (student × assignment matrix)
5. **Certificate issuance**: Trigger certificate generation for qualified students

#### Methodologist / Content Creator
- Design course templates: structure, materials, assessments
- Define grading criteria and rubrics
- Prepare instructional materials (videos, documents, exercises)
- Create assignment descriptions and resources

#### Administrator
**Core workflows**:
1. **System configuration**: Set up courses, access rules, roles
2. **Enrollment management**:
   - Approve/reject enrollment requests
   - Manually enroll students
   - Manage waitlists
3. **Certificate management**:
   - Configure certificate templates
   - Issue/revoke certificates
   - Track certificate serial numbers
4. **Sales/payment management** (if e-commerce enabled):
   - Set course pricing
   - Process orders
   - Issue invoices
5. **Reporting & analytics**:
   - Platform-wide dashboards
   - Course completion rates
   - Instructor performance
   - Financial reports

### 2.2 Core Data Model (from gpt_design.md)

**Entity hierarchy**:

```
Шаблон курса (Course Template)
  ↓ spawns
Экземпляр курса (Course Instance / Cohort)
  ↓ enrollment
Запись на курс (Enrollment)
  ↓ instantiates
Экземпляр задания (Assignment Instance)
  ↓ communication
Диалог (Dialog / Message Thread)

Заявка на регистрацию (Enrollment Request)
  ↓ approval
Запись на курс (Enrollment)

Шаблон сертификата (Certificate Template)
  ↓ generates
Экземпляр сертификата (Certificate Instance)
```

**Entity details**:

**Шаблон курса (Course Template)**:
- Название, описание, тип (базовый/продвинутый)
- Целевая аудитория, prerequisites
- Список модулей/тем
- Связь с шаблонами заданий
- Настройки сертификации (criteria, template)

**Экземпляр курса (Course Instance)**:
- Ссылка на template
- Поток/группа, даты начала/окончания
- Преподаватель(и)
- Статус (планируется / идёт / завершён)
- Enrollment capacity limits

**Заявка на регистрацию (Enrollment Request)**:
- Пользователь, желаемый курс
- Статус (новая / на согласовании / одобрена / отклонена)
- Linked payment record (if applicable)
- Comments/justification

**Запись на курс (Enrollment)**:
- Слушатель + Course Instance
- Статус (ожидает начала / в процессе / завершён / отчислен)
- Персональные параметры (sandbox credentials, etc.)
- Итоговый балл, дата завершения
- Progress tracking (% complete)

**Шаблон задания (Assignment Template)**:
- Курс, модуль, порядковый номер
- Тип (лекция / лаб / тест / проект)
- Описание, прикреплённые файлы
- Максимальный балл, критерии оценки
- Обязательность (required vs optional)

**Экземпляр задания (Assignment Instance)**:
- Ссылка на template
- Ссылка на Enrollment
- Статус (не начато / в работе / отправлено / на проверке / принято / доработка)
- Балл, дата сдачи, дата проверки
- Проверяющий преподаватель
- Submitted files/text

**Диалог по курсу / заданию (Dialog)**:
- Linked to Course/Assignment
- Participants (student + teacher)
- Message thread (child records or separate Message entity)
- Attachments

**Шаблон сертификата (Certificate Template)**:
- Тип курса
- DOCX template file
- Variable placeholders (student name, course, date, serial)
- Approval workflow for template changes

**Экземпляр сертификата (Certificate Instance)**:
- Слушатель, Course Instance
- Серийный номер (auto-generated)
- Дата выдачи
- PDF file (generated from template)
- Verification URL/QR code

**Additional entities**:
- **Пользователь (User)**: Extended from B3 platform user model with LMS-specific fields
- **Материал курса (Course Material)**: Optional separate entity for lectures/readings not tied to assignments
- **Сообщение (Message)**: Individual messages within Dialogs

### 2.3 Business Process Requirements

#### Process 1: Enrollment Request → Approval → Enrollment

**Trigger**: User submits enrollment request

**Steps**:
1. Create Заявка на регистрацию (status: Новая)
2. Optional: Payment verification (if paid course)
3. Approval step (auto or manual by admin)
4. If approved:
   - Create Запись на курс (Enrollment)
   - For each Assignment Template in course:
     - Create Экземпляр задания (status: Не начато)
   - Send welcome notification to student
5. If rejected: Send rejection notification with reason

**Statuses**: Новая → На согласовании → [Одобрена | Отклонена]

#### Process 2: Assignment Submission → Review → Grading

**Trigger**: Student clicks "Submit for Review"

**Steps**:
1. Update Assignment Instance status: В работе → Отправлено на проверку
2. Create task for teacher: "Проверить задание"
3. Send notification to teacher
4. Teacher reviews:
   - Adds comments
   - Assigns grade
   - Sets status: Принято | Требует доработки
5. Update Enrollment progress percentage
6. Send notification to student with grade/comments
7. If all required assignments accepted: Trigger certificate process

**Statuses**: Не начато → В работе → Отправлено → На проверке → [Принято | Доработка]

#### Process 3: Course Completion → Certificate Generation

**Trigger**: Enrollment completion condition met

**Condition**: All required assignments have status "Принято" AND total score ≥ passing threshold

**Steps**:
1. Update Enrollment status: В процессе → Завершён
2. Generate serial number (format: COURSE-YEAR-NNNN)
3. Create Certificate Instance record
4. Generate PDF from template with student data
5. Attach PDF to certificate record
6. Send notification to student: "Сертификат готов к скачиванию"
7. Optional: Email PDF directly to student

**Statuses**: Auto-triggered, no manual approval

#### Process 4: Course Launch (Teacher-initiated)

**Trigger**: Teacher/admin starts course instance

**Steps**:
1. Verify course instance setup (dates, students, materials)
2. Update Course Instance status: Планируется → В работе
3. For all enrolled students:
   - Instantiate all assignment templates
   - Generate personal credentials (if needed)
   - Send course start notification
4. Create course announcement: "Курс начался"

### 2.4 Functional Blocks

1. **Student Dashboard (LK)**: Primary UX focus - course cards, progress, To-Do list, messages
2. **Course Material Library**: Lectures, docs, videos with search and filtering
3. **Gradebook/Табель**: Matrix view of students × assignments with color-coded status
4. **Certificate Module**: Template management, generation, verification
5. **Course Catalog**: Public/internal course listing with enrollment CTA
6. **Communication Hub**: Centralized view of all dialogs and notifications

---

## 3. UX/UI Best Practices from Reference Platforms

### 3.1 Key Insights from 7+ LMS Platforms

The research analyzed Canvas, Coursera, Litmos, Docebo, Brightspace, Absorb, Moodle/Totara, and Udemy. Common UX patterns:

#### Student Dashboard = Entry Point
- **Course cards with visual hierarchy**: Title, instructor, progress bar, status badge
- **"Continue" button**: Goes to next incomplete step, not course home (Coursera pattern)
- **To-Do list / Timeline**: Upcoming assignments and deadlines in chronological order
- **Recent messages**: Last 3-5 teacher replies or announcements
- **Minimal cognitive load**: Show only actionable information, hide completed items by default

#### Course Page Layout
- **Left sidebar**: Course structure (modules, topics, assignments) - always visible for navigation
- **Center panel**: Active content (lecture video, assignment description, quiz)
- **Top banner**: Course progress bar, instructor info, course description link
- **Bottom section**: Discussion forum or comments for the current item

#### Assignment Page
- **Clear structure**:
  - Title, type (lab/project/quiz), due date prominently displayed
  - Description with rich formatting (images, code blocks, videos)
  - Attached resources (downloadable files, links)
- **Submission area**:
  - File upload OR text editor OR URL input (depending on assignment type)
  - "Save Draft" vs "Submit for Review" buttons clearly differentiated
  - Submission history (past attempts, timestamps)
- **Feedback area**:
  - Grade display (points or percentage)
  - Instructor comments (threaded conversation)
  - Rubric breakdown (if applicable)
- **Status indicator**: Always visible (Not started / In progress / Submitted / Graded)

#### Progress Tracking
- **Visual progress bars**: On course cards, course pages, and assignment lists
- **Percentage complete**: Numeric display alongside bar
- **Completion indicators**: Checkmarks, badges, or color-coding for completed items
- **Streak/momentum tracking**: "You've completed 5 assignments this week!" (motivational)

#### Communication
- **Asynchronous by default**: Forums, Q&A threads, assignment comments
- **Contextual threads**: Discussion tied to specific assignment or course section
- **Notification preferences**: User controls email vs in-app notifications
- **Simple UI**: Text input, file attach, emoji reactions - no overwhelming features

#### Gradebook (Teacher View)
- **Matrix table**: Students (rows) × Assignments (columns)
- **Color coding**:
  - Green: Accepted/high grade
  - Yellow: Submitted/pending review
  - Red: Late/missing
  - Gray: Not started
- **Filters**: By student group, assignment type, date range
- **Drill-down**: Click cell to open assignment detail for grading

#### Certificate Display
- **Visual card**: Mini-preview of certificate design
- **Metadata**: Course name, completion date, serial number
- **Download button**: PDF download with single click
- **Share options**: LinkedIn, social media integration (future)
- **Verification link**: Public URL to verify certificate authenticity

#### Course Catalog (Enrollment)
- **Card-based grid**: Image thumbnail, title, short description, instructor
- **Filters**: By level, topic, duration, price
- **Course detail page (landing)**:
  - Hero section with title and enrollment CTA
  - "What you'll learn" bullet points
  - Curriculum outline (modules/assignments)
  - Instructor bio
  - Reviews/testimonials (future)
  - FAQ section
- **Single-click enrollment**: Minimal friction, instant access

### 3.2 Mobile & Accessibility
- **Responsive design**: All platforms support mobile-first layouts
- **Touch-friendly**: Large buttons, swipe gestures, no hover-dependent interactions
- **Offline support**: Download course materials for offline viewing (Coursera, Udemy apps)
- **WCAG 2.1 AA compliance**: Keyboard navigation, screen reader support, color contrast
- **Multi-language**: Localization for UI and content

### 3.3 Gamification & Engagement
- **Badges & achievements**: Milestones for completing modules (Canvas, Docebo)
- **Leaderboards**: Optional competitive element (Litmos)
- **Streaks & reminders**: Email nudges for inactive students
- **Personalized recommendations**: "Based on your progress, try this next..." (Coursera)

---

## 4. Gap Analysis: proto.html vs Required Features

### 4.1 What proto.html Currently Has ✓

**Student side**:
- Dashboard with course cards showing progress bars and status
- Course view with assignment sidebar (left nav)
- Assignment detail page with:
  - Description
  - Text submission area
  - Status display (draft/submitted/accepted)
  - Comments thread (student + teacher)
  - Grade display
- Certificate view page (basic list)

**Teacher side**:
- Teacher dashboard with course list
- Gradebook table (students × assignments with color-coded status)

**General**:
- Role switcher (student/teacher toggle)
- Responsive layout (grid-based)
- Modern, clean styling (dark sidebar, card-based UI)
- Mock data in JavaScript (no backend)

### 4.2 Missing Features (Gaps to Fill)

#### Critical Missing Features

1. **File Upload for Assignments**
   - Current: Text-only submission
   - Needed: File attachment widget (drag-drop, multiple files, preview)
   - B3 capability: Native file field type with storage

2. **Notifications Indicator**
   - Current: No notification system
   - Needed: Bell icon in topbar with unread count, dropdown list
   - B3 capability: Built-in notification engine

3. **Admin Dashboard/View**
   - Current: Only student and teacher roles
   - Needed: Separate admin role with:
     - System overview (enrollment requests, course stats)
     - User management
     - Certificate template management
     - Course catalog management

4. **Course Catalog / Enrollment Request Flow**
   - Current: Students are pre-enrolled in courses
   - Needed:
     - Public/internal catalog page
     - Course detail landing page
     - "Apply for Course" button
     - Enrollment request approval workflow

5. **Course Materials / Lecture Section**
   - Current: Only assignments exist
   - Needed: Separate section for non-assessed materials (readings, videos)

6. **Advanced Communication Features**
   - Current: Basic comment thread per assignment
   - Needed:
     - Course-level discussion forum
     - Announcements (teacher → all students)
     - Private messaging (student ↔ teacher)
     - Notification for new messages

7. **Certificate Generation UI**
   - Current: Static list of certificates
   - Needed: Admin interface to:
     - Upload/edit certificate templates
     - Trigger batch generation
     - Preview certificate before generation
     - Track serial numbers

8. **Progress Tracking Enhancements**
   - Current: Basic percentage on course cards
   - Needed:
     - Detailed progress breakdown (by module/week)
     - Time tracking (hours spent)
     - Estimated time to complete
     - "Next step" smart recommendation

9. **Assignment Types Beyond Text**
   - Current: Only text submission
   - Needed:
     - File upload assignments
     - Quiz/test assignments (multiple choice, etc.)
     - External tool integration (e.g., link to project repo)
     - Peer review assignments

10. **Role-Based Field Visibility**
    - Current: Same fields shown to all users
    - Needed: Different fields/actions based on role and status

11. **Search & Filtering**
    - Current: No search
    - Needed:
      - Search courses, assignments, materials
      - Filter assignments by status, due date
      - Filter courses by level, instructor

12. **Calendar View**
    - Current: No calendar
    - Needed: Calendar showing assignment due dates, course start/end dates

#### Nice-to-Have Features (Future)

- **Social learning**: Student profiles, peer-to-peer forums
- **Video hosting**: Integrated video player with tracking
- **Mobile app**: Native iOS/Android (B3 has mobile client)
- **E-commerce**: Payment processing for paid courses
- **Reporting**: Advanced analytics and custom reports
- **API access**: For third-party integrations
- **Multilingual support**: UI translation
- **Dark mode toggle**: Theme switcher

### 4.3 B3 Platform Mapping to LMS Requirements

| LMS Feature | B3 Platform Capability | Implementation Strategy |
|-------------|------------------------|-------------------------|
| **Data Model (Courses, Assignments, etc.)** | Entity types (Типы представления) | Create справочники for templates, документы for instances |
| **Student Dashboard** | Dashboard form (Аналитическая панель) | Configure widgets: course cards, progress charts, To-Do list |
| **Course List** | List view (Форма списка) | Standard table with filters, sorting, search |
| **Assignment Detail Page** | Detail view (Форма элемента) | Tabbed layout: Description, Submission, Feedback, Comments |
| **Enrollment Request Workflow** | BPMN process engine | Status-based workflow: New → Approval → Approved/Rejected |
| **Assignment Grading Workflow** | BPMN process engine | Status transitions: Draft → Submitted → Graded |
| **Certificate Generation** | Print forms (DOCX → PDF) | DOCX template with variables, auto-generate on course completion |
| **Gradebook Table** | Dashboard table widget | Student × Assignment matrix with conditional formatting |
| **Role-Based Access** | Role & permission model | Define Student/Teacher/Admin roles with entity-level permissions |
| **File Attachments** | File field type | Native file upload/download with storage |
| **Notifications** | Notification system | Process-triggered notifications + manual announcements |
| **Communication/Messaging** | Custom entity (Message) + forms | Build message thread UI with list + detail views |
| **Progress Tracking** | Calculated fields + formulas | Auto-calculate % complete based on assignment statuses |
| **Search & Filters** | Built-in list view filters | Configure filters on list views (status, date, instructor) |
| **Landing Pages** | Landing form type | Design public course catalog and detail pages |
| **Mobile Access** | Responsive forms + mobile app | Use B3 mobile client (iOS/Android) |
| **API Access** | RESTQL API | Expose entities via API for integrations |

**Key Insight**: B3 platform has native capabilities for ~90% of LMS requirements. Only complex features like video hosting or peer review may require custom extensions.

---

## 5. Recommendations

### 5.1 Phased Implementation Approach

**Phase 1: MVP (Core LMS)** - 4-6 weeks
- Implement core entities (Course, Assignment, Enrollment, Certificate)
- Student dashboard + course view
- Teacher gradebook
- Basic assignment submission (text + file upload)
- Certificate generation (manual trigger)
- Role-based access (Student/Teacher/Admin)

**Phase 2: Workflows & Communication** - 3-4 weeks
- Enrollment request workflow
- Assignment grading workflow
- Notification system
- Message threads (course + assignment level)
- Admin dashboard

**Phase 3: Enhanced UX** - 2-3 weeks
- Course catalog + landing pages
- Progress tracking enhancements
- Search & advanced filtering
- Calendar view
- Mobile optimization

**Phase 4: Advanced Features** - Ongoing
- Quiz/test assignments
- Peer review
- Video integration
- E-commerce
- Analytics & reporting

### 5.2 Design Priorities

1. **Mobile-first**: Design all interfaces for mobile, scale up for desktop
2. **Progress transparency**: Always show status, % complete, next step
3. **Minimize clicks**: "Continue" goes to next action, not intermediate pages
4. **Role-specific views**: Different dashboards for Student/Teacher/Admin
5. **Accessibility**: WCAG 2.1 AA compliance from day 1
6. **B3 native first**: Use platform features before custom code
7. **Consistent styling**: Align with B3 platform aesthetic (color scheme, typography, spacing)

### 5.3 Key Success Metrics

- **Student engagement**: % of enrolled students who complete at least 1 assignment
- **Course completion rate**: % of students who earn certificates
- **Time to proficiency**: Hours from enrollment to first submission
- **Teacher efficiency**: Avg time to grade an assignment
- **System usability**: SUS score > 75 (System Usability Scale survey)
- **Mobile usage**: % of activity from mobile devices

---

## 6. Conclusion

The B3 platform provides an excellent foundation for building a modern learning portal. Its native capabilities (BPMN workflows, role-based permissions, dashboards, print forms) align closely with LMS requirements. By adopting proven UX patterns from Canvas, Coursera, and other leading platforms, we can create a comfortable, intuitive learning experience that showcases B3's capabilities.

The gap analysis shows that proto.html has a solid starting point but needs enhancements in file upload, notifications, admin features, and enrollment workflows. All of these can be implemented using B3's standard features with minimal custom code.

The recommended phased approach prioritizes core student and teacher workflows (MVP), then adds process automation and communication (Phase 2), before polishing UX and adding advanced features (Phases 3-4).

**Next Steps**:
1. Review this research summary with stakeholders
2. Prioritize features for MVP
3. Proceed to detailed design (data model, UI mockups, process diagrams)
4. Create B3 platform setup guide for implementation

---

## References

- B3 Platform Documentation: https://v21.platform.big3.ru/docs/platform-b3
- `Tasks/init/gpt_design.md`: Architecture proposal
- `Tasks/init/references.md`: LMS platform research (Canvas, Coursera, Litmos, Docebo, Brightspace, Absorb, Moodle, Udemy)
- `Tasks/init/initial_requirememtns.md`: Original requirements
- `proto.html`: Current prototype
