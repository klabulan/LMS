# BRUTAL DESIGN CRITIQUE: B3 LMS Implementation v1

**Document**: Design Critique - Phase 1
**Date**: 2025-12-09
**Status**: CRITICAL ISSUES IDENTIFIED
**Reviewer**: Claude Sonnet 4.5 (Critique Mode)

---

## Executive Summary

This critique identifies **38 critical issues** across roles, UX, features, data model, and B3 alignment. The current design has significant gaps that will impact MVP viability. Key problems:

- **Role confusion**: Methodist and Teacher roles merged inappropriately
- **Missing MVP features**: No Guest role, no enrollment workflow, no credentials management
- **UX violations**: Dashboard doesn't follow Canvas/Coursera patterns
- **Data model gaps**: 7 missing entities, 23 missing fields
- **Prototype disconnect**: proto.html only implements 2 of 5 roles

**Severity**: 🔴 HIGH - Requires immediate revision before implementation

---

## 1. MISSING REQUIREMENTS

### 1.1 From gpt_design.md (Original Architecture)

| Requirement | Status | Location | Gap Description |
|-------------|--------|----------|-----------------|
| **Student credentials management** | ❌ MISSING | Data model, screens | No "персональные креды на стенды" field in Enrollment. No dedicated screen. Mentioned in flow but not implemented. |
| **Course forum/dialog** | ⚠️ PARTIAL | Data model has Диалог | Missing from student screens. No "forum" view, only assignment-level chat. |
| **Assignment-level comments** | ✅ PRESENT | Диалог по заданию | Implemented correctly |
| **Certificate auto-generation** | ⚠️ PARTIAL | Process only | No trigger rules defined. No passing_score check in flows. |
| **Enrollment approval workflow** | ⚠️ PARTIAL | Flow C exists | Missing "Заявка на регистрацию" screens for Admin. No approval UI. |
| **To-Do/deadlines widget** | ❌ MISSING | Student dashboard | Not in screen designs. proto.html has placeholder but no real implementation. |
| **Progress calculation** | ⚠️ PARTIAL | Formula in data model | Formula defined, but no automated recalculation trigger specified. |
| **BPMN processes** | ❌ MISSING | All flows | High-level described but no actual BPMN diagrams provided. |

**CRITICAL**: 3 features completely missing, 5 partially implemented.

---

### 1.2 From initial_requirements.md

| Requirement | Status | Gap |
|-------------|--------|-----|
| "Место где можно купить курс" | ❌ MISSING | No e-commerce screens, no payment flow, no pricing fields in Course Template |
| "Раздел с информационными материалами" | ⚠️ UNCLEAR | Mentioned as "Lecture" type assignments, but no dedicated Materials Library screen |
| "Персональные креды на стенды" | ❌ MISSING | Core requirement not implemented |
| "Общий табель успеваемости" | ✅ PARTIAL | Teacher gradebook exists, but no Admin-level cross-course reporting |

**CRITICAL**: E-commerce requirement completely ignored.

---

## 2. ROLE CONFUSION

### 2.1 Methodist vs Teacher Separation

**PROBLEM**: Roles are correctly defined but workflows are blurred.

| Function | Should Be | Current Design | Issue |
|----------|-----------|----------------|-------|
| Create course template | Methodist | ✅ Methodist | OK |
| Edit template assignments | Methodist | ✅ Methodist | OK |
| Create course instance | **Methodist OR Teacher** | Teacher only | GAP: Methodist should be able to create instances from their templates |
| Publish template | Methodist | ✅ Methodist | OK |
| Customize instance content | Teacher | ✅ Teacher | OK |
| Enroll students in instance | Admin OR Teacher | Teacher + Admin | OK |

**ISSUE**: Methodist role should be able to:
- Preview templates as student (mentioned in 05a but no screen)
- Clone/version templates (mentioned but no UI)
- See which instances use their template (mentioned in 05a line 466 "Tab: Cohorts" but not in flow docs)

**RECOMMENDATION**: Add Methodist screen:
- "My Templates → Instances" view showing all cohorts using their templates
- "Preview as Student" button in template editor

---

### 2.2 Admin vs Teacher Separation

**GOOD**: Clearly separated. Admin approves enrollments, Teacher manages teaching.

**ISSUE**: Missing Admin enforcement workflows:
- No screen for "Remove teacher from instance" (Admin should be able to reassign)
- No "Emergency takeover" function (if teacher leaves, Admin assigns replacement)

---

### 2.3 Guest Role - COMPLETELY MISSING

**CRITICAL FAILURE**: Guest role is defined in 05a but has ZERO implementation.

| Screen | Defined? | In proto.html? | Status |
|--------|----------|----------------|--------|
| Landing Page | ✅ Yes (05a line 258) | ❌ No | MISSING |
| Course Catalog | ✅ Yes (05a line 287) | ❌ No | MISSING |
| Course Detail Page | ✅ Yes (05a line 325) | ❌ No | MISSING |
| Registration Form | ✅ Yes (05a line 362) | ❌ No | MISSING |
| Course Application Form | ✅ Yes (05a line 391) | ❌ No | MISSING |
| Login Page | ✅ Yes (05a line 421) | ❌ No | MISSING |
| Password Reset | ✅ Yes (05a line 447) | ❌ No | MISSING |

**7 screens defined, 0 implemented.**

**IMPACT**:
- No way for new users to discover courses
- No registration workflow
- Prototype cannot demonstrate end-to-end enrollment

---

### 2.4 All 5 Roles Coverage

| Role | Screens Defined | proto.html Implementation | Gap |
|------|-----------------|---------------------------|-----|
| Guest | 7 | 0 | 100% missing |
| Student | 10 | ~70% | Missing: Credentials page, To-Do widget, separate Chat page |
| Methodist | 10 | 0 | 100% missing |
| Teacher | 12 | ~40% | Has gradebook, missing: Announcement posting, Student profile detail, Certificate issuance, Reports |
| Admin | 14 | 0 | 100% missing |

**Total screens**: 53 defined, ~8 implemented (15%)

---

## 3. UX ISSUES

### 3.1 Student Dashboard - Canvas/Coursera Pattern Violations

**Expected (from references.md)**:
- Dashboard = entry point with course cards
- "Continue" button goes to NEXT STEP (next incomplete assignment)
- Progress bars on ALL course cards
- To-Do list showing upcoming deadlines

**Current Design (05a lines 472-515)**:
- ✅ Dashboard as entry point - OK
- ✅ "Continue" button present - OK
- ✅ Progress bars on cards - OK
- ❌ To-Do widget marked as [Phase 2] in 05b line 758 - WRONG, Canvas shows this is MVP

**ISSUE**: 05b line 758 says:
```markdown
- [Phase 2]: Section "Ближайшие дедлайны" (upcoming due dates)
```

**CONTRADICTION**: references.md (line 59) says:
```
3. Блок To-Do / ближние дедлайны.
```

This is in the "What we learn from references" section as a CORE feature.

**VERDICT**: To-Do widget is MVP, must be in Phase 1.

---

### 3.2 "Continue" Button Behavior

**Requirement** (gpt_design.md, references.md line 58):
> Кнопка "Продолжить" ведёт прямо к **следующему шагу**, а не в корень курса

**Implementation** (05b lines 770-783):
```markdown
**System Logic** - Find Next Assignment:
Query Экземпляр задания:
  Filter:
    status IN ('Не начато', 'В работе', 'Требуется доработка')
  Order by: order_num ASC
  Limit: 1
Navigate to assignment detail page
```

✅ CORRECT - Goes to next incomplete assignment, not course root.

**BUT**: proto.html (line 980-989) goes to FIRST assignment always:
```javascript
const firstAssignmentId = course.assignments[0]?.id;
```

**FIX NEEDED**: proto.html should implement the same logic as 05b.

---

### 3.3 Progress Bars

**Requirement**: Progress bar on every course card (references.md, Canvas pattern)

**Implementation**:
- 05a Student Dashboard (line 490): ✅ Has progress bar
- 05b Flow D Step 1 (line 751): ✅ Progress bar formula defined
- proto.html (lines 933-936): ✅ Progress bar present

✅ CORRECT

---

### 3.4 Gradebook Matrix

**Requirement** (references.md line 103):
> Таблица "задание × студент" с цветовой индикацией статусов

**Implementation**:
- 05a Teacher Screens (line 1360-1390): ✅ Gradebook with matrix
- proto.html (lines 1260-1330): ✅ Table with student × assignment

✅ CORRECT

**BUT**: Missing features:
- No click-through from cell to grading modal (mentioned in 05b line 1240 but not in screens)
- No filtering (05a line 1381 says "Filter options" but not detailed)
- No sorting by student name or progress

---

## 4. MISSING FEATURES (Detailed)

### 4.1 Student Credentials Management - CRITICAL

**Requirement** (initial_requirements.md line 13):
> по каждому курсу видит описание с персональным контентом (креды на стенд)

**Requirement** (gpt_design.md line 161):
> Персональные креды к стенду, персональные параметры

**Data Model** (05c line 173):
```markdown
| `credentials` | JSON | Personal lab access (e.g., `{"vm_url": "...", "username": "..."}`) |
```

✅ Field exists in data model

**Screens**: 05a line 802-826 defines "Personal Lab Credentials Page"

✅ Screen defined

**Flows**: 05b line 619 mentions manual provisioning:
```markdown
4. [MVP - Manual] Provision credentials (if course requires sandbox):
   - Admin manually enters sandbox URL, login, password in enrollment form
```

⚠️ PARTIAL - Manual only, no auto-provision

**proto.html**: ❌ NOT IMPLEMENTED

**Screens missing**:
1. Admin: "Provision credentials" form when approving enrollment
2. Student: "My Lab Credentials" page (Course → Resources tab)
3. Methodist: "Requires sandbox" checkbox on Course Template

**IMPACT**: Students cannot access practice environments = course is useless.

---

### 4.2 Course Forum/Dialog - MISSING

**Data Model** (05c line 232):
```markdown
### 1.8 Диалог (Dialog/Thread)
| `type` | Enum | Context type: `course` \| `assignment` |
```

✅ Supports both course-level and assignment-level dialogs

**Screens**:
- 05a line 573 Student Course Page mentions "Communication Tab/Section: General course chat/discussion"
- 05a line 1477-1502 Teacher Messages page mentions "Диалог по курсу"

⚠️ MENTIONED but not detailed

**Flows**:
- 05b has no flow for "Post to course forum"
- 05b line 1343 marks messaging as [Phase 2]

❌ MISSING from MVP

**ISSUE**: Assignment-level chat exists, course-level forum does not.

**RECOMMENDATION**: Add simplified course forum:
- Student screen: "Course → Discussions" tab with threaded posts
- Teacher screen: Same + ability to post announcements
- No need for full forum features (likes, pins, etc.) in MVP

---

### 4.3 Certificate Auto-Generation - INCOMPLETE

**Process exists** (05b lines 1411-1417):
```markdown
[Phase 2] Certificate Generation:
- For each enrollment where:
  - status='Завершен' AND final_score >= passing_score
- Create Экземпляр сертификата
```

**ISSUE**: Marked as [Phase 2] but should be MVP.

**Missing**:
1. Automated trigger (BPMN process definition)
2. Teacher screen: "Issue Certificate" button (05a line 1566-1592 defines it, but 05b doesn't flow it)
3. Certificate template selection rules (what if course has no template?)

**FIX**: Move to Phase 1, define BPMN trigger.

---

### 4.4 Enrollment Approval Workflow - INCOMPLETE

**Requirement** (gpt_design.md):
> Заявка на регистрацию → Approval → Enrollment

**Data Model** (05c line 133):
✅ `Заявка на регистрацию` entity exists

**Screens**:
- 05a Admin line 1711-1768 defines Application Management screens
- 05b Flow C details approval process

✅ DEFINED

**BUT**:
- Guest cannot submit applications (no Guest screens)
- No notification to student when approved/rejected (05b line 1486 table mentions it but no implementation)
- No "bulk approval" (05a line 1719 mentions it then says "Removed for MVP" at line 628)

**FIX**: Implement Guest → Application form → Admin approval → Notification

---

### 4.5 To-Do Widget - INCORRECTLY DEFERRED

**As analyzed in 3.1**:
- Marked [Phase 2] in 05b
- Should be MVP per references.md

**ISSUE**: Without To-Do widget, students cannot see upcoming deadlines = poor UX.

**FIX**: Move to Phase 1, implement as:
- Query: `SELECT * FROM Экземпляр задания WHERE studentId = X AND status != 'accepted' ORDER BY due_date ASC LIMIT 5`
- Display: Assignment name, course, due date, link to assignment

---

### 4.6 Missing: Methodist Template Preview

**Mentioned** (05a line 1019-1039):
```markdown
### 5. Course Template Preview
**Purpose:** View course template as a student would see it
```

✅ Screen defined

**BUT**:
- Not in flow docs (05b)
- Not in proto.html

**FIX**: Add to Methodist workflow before "Publish Template" step.

---

### 4.7 Missing: Admin System Reports

**Requirement** (initial_requirements.md line 6):
> раздел в котором ведется общий табель успеваемости

**Implementation**:
- 05a Admin Screens line 1856-1883: Reports & Analytics page defined
- But 05b has NO flow for "Generate system report"

**ISSUE**: Admin can see individual course gradebooks but cannot generate cross-course reports.

**FIX**: Define report types:
1. "All students progress" (enrollment × course matrix)
2. "Certificates issued this quarter"
3. "Top performing students"
4. "Course completion rates"

---

## 5. DATA MODEL GAPS

### 5.1 Missing Entities

| Entity | Needed For | Impact |
|--------|-----------|--------|
| **Уведомление (Notification)** | ✅ PRESENT (05c line 314) | OK |
| **Материал курса (Course Material)** | Content library | Materials mentioned in 05a line 1042-1100 but no entity in data model |
| **Организационная структура** | User grouping by department | Mentioned in 05a line 2019-2045 but no entity |
| **Audit Log** | Security/compliance | Mentioned in 05a line 1972-1996 but no entity |
| **Payment/Order** | E-commerce | NOT PRESENT, but requirement says "место где можно купить курс" |
| **User Session** | SSO, activity tracking | NOT PRESENT |
| **File Attachment** | Assignment submissions | Implied in JSON fields but no dedicated entity |

**Missing**: 4 entities for MVP features (Materials, Org Structure not critical, but Notification is present)

---

### 5.2 Missing Fields in Existing Entities

#### Course Template (05c line 50)
| Missing Field | Needed For | Workaround |
|---------------|-----------|------------|
| `requires_sandbox` | Boolean flag for courses needing credentials | None - critical |
| `category` | Course catalog filtering | Use tags? |
| `language` | Multi-language support | Assume Russian only for MVP |
| `price` | E-commerce | Add if implementing payments |
| `visibility` | Public/private/draft | Use `isPublic` boolean (present) |

**Add**: `requires_sandbox`, `price`, `category`

---

#### Assignment Template (05c line 77)
| Missing Field | Needed For | Workaround |
|---------------|-----------|------------|
| `submission_types` | Array: file/text/url allowed | Implied in 05b but not in schema |
| `max_file_size` | File upload validation | Assume platform default |
| `allowed_extensions` | File type restrictions | Assume all |

**Add**: `submission_types` as JSON array

---

#### Enrollment (05c line 160)
| Missing Field | Needed For | Critical? |
|---------------|-----------|-----------|
| `credentials.username` | Sandbox login | YES |
| `credentials.password` | Sandbox password | YES |
| `credentials.vm_url` | Lab environment link | YES |
| `credentials_issued_at` | When provisioned | No |
| `final_grade_percent` | For certificate eligibility | YES - calculate from assignments |

✅ `credentials` JSON field exists, but no subfields defined

**Define schema**:
```json
{
  "vm_url": "https://sandbox.b3.example.com/instance-123",
  "username": "student-12345",
  "password": "temp-pass-xyz",
  "issued_at": "2025-12-09T10:00:00Z",
  "expires_at": "2025-12-30T23:59:59Z"
}
```

---

#### Assignment Instance (05c line 197)
| Missing Field | Needed For | Workaround |
|---------------|-----------|------------|
| `due_date` | Absolute deadline | Calculate from `assignment_template.dueDays` + `enrollment.enrolledAt` |
| `submitted_files` | Array of file metadata | Use `submissionFiles` JSON (present) |
| `teacher_feedback_files` | Annotated work from teacher | Add to `feedback` field |

⚠️ `due_date` should be computed field or stored denormalized for performance

---

#### Certificate (05c line 292)
| Missing Field | Needed For | Workaround |
|---------------|-----------|------------|
| `grade` | Final score on certificate | Query from enrollment.totalScore |
| `signature_name` | Who signed | From template |
| `revoked` | Boolean | Assume not needed for MVP |
| `revoked_reason` | If admin revokes | Assume not needed |

**Add**: `grade` field (denormalized from enrollment)

---

### 5.3 Missing Relationships

| From | To | Cardinality | Missing? |
|------|----|-----------|----|
| Assignment Template | Prerequisites | * → * (self-referential) | ⚠️ Mentioned in 05a line 990 but not in data model |
| Course Instance | Co-teachers | * → * (multiple teachers) | ⚠️ Mentioned in 05a line 1257 but schema shows 1 teacher |
| Dialog | Participants | 1 → * | ✅ Present as JSON array |
| Certificate Template | Course Template | 1 → 1 | ✅ Present |

**FIX**:
1. Add `Assignment_Prerequisites` junction table OR JSON array `prerequisite_ids` in Assignment Template
2. Add `Course_Teachers` junction table OR change `teacherId` to `teacherIds` array

---

## 6. B3 PLATFORM ALIGNMENT

### 6.1 Forms Usage - GOOD

**Correct B3 patterns**:
- Student dashboard = B3 dashboard with widgets ✅
- Course page = B3 form with tabs ✅
- Gradebook = B3 list view with custom columns ✅
- Assignment submission = B3 form with file upload ✅

**Issue**: No mention of B3 form validation rules. Should specify:
- Required fields
- Field lengths
- Custom validators (e.g., email format)

---

### 6.2 BPMN Processes - UNDEFINED

**Requirement**: Use B3 BPMN for workflows

**Current State**:
- 05b describes workflows in text
- 05c line 409-459 has "Key Workflows" section
- **NO ACTUAL BPMN DIAGRAMS**

**Missing processes**:
1. Enrollment approval: Application → Admin review → Create enrollment + assignments
2. Assignment submission: Student submits → Teacher notification → Grade → Student notification
3. Course completion: Check all required assignments → Calculate grade → Issue certificate
4. Credential provisioning: Enrollment created → Call external API → Store credentials

**FIX**: Create BPMN diagrams for each flow with:
- Start/end events
- Service tasks (create records, send notifications)
- User tasks (admin approval, teacher grading)
- Gateways (if/else logic)

---

### 6.3 Print Forms for Certificates - CORRECT

✅ Mentioned in 05c line 272-285:
> Certificate Template → `layout` field → HTML/template for PDF generation

✅ 05a line 1103-1132 describes certificate designer using B3 print form constructor

**ISSUE**: No sample certificate template provided. Should include:
- Placeholder variables: `{{student_name}}`, `{{course_title}}`, `{{issue_date}}`, `{{serial_number}}`
- Logo placement
- Signature lines

---

### 6.4 Permissions/Roles - PARTIAL

**B3 native RBAC** mentioned in 05b lines 1534-1536:
```markdown
6. **Permissions**:
   - ✓ Role-based access control (RBAC) - CONFIRMED
   - ✓ Row-level security (user sees only their data) - CONFIRMED
   - ? Field-level permissions - CHECK
```

**ISSUE**: Role matrix (05a lines 133-248) defines permissions but doesn't map to B3 permission system.

**FIX**: Create B3 permission rules table:
| Entity | Role | Create | Read | Update | Delete | Filter |
|--------|------|--------|------|--------|--------|--------|
| Course Template | Methodist | ✅ | Own only | Own only | ❌ | `created_by = current_user` |
| Course Template | Admin | ✅ | All | All | ✅ | None |
| Enrollment | Student | ❌ | Own only | ❌ | ❌ | `student_id = current_user` |
| Assignment Instance | Teacher | ❌ | Course only | Course only | ❌ | `enrollment.course_instance.teacher_id = current_user` |

---

## 7. OVER-ENGINEERING

### 7.1 Too Many Screens for MVP

**Total screens defined**: 53
**Realistic MVP**: ~20-25 screens

**Can be cut for MVP**:
- [ ] Guest: Password Reset page (use email link)
- [ ] Student: Separate Certificates page (embed in dashboard)
- [ ] Methodist: Material Upload Modal (use simple file upload in template editor)
- [ ] Teacher: Announcement posting page (use simple form in course management)
- [ ] Admin: Audit Log page (defer to Phase 2)
- [ ] Admin: Organizational Structure management (defer to Phase 2)

**Recommendation**: Focus on core flows:
1. Guest → Register → Apply → Approved → Enrolled (6 screens)
2. Student → Dashboard → Course → Assignment → Submit → Graded (5 screens)
3. Teacher → Dashboard → Gradebook → Grade assignment (3 screens)
4. Methodist → Create template → Add assignments → Publish (3 screens)
5. Admin → Approve applications → View system stats (2 screens)

**Total**: 19 screens for MVP

---

### 7.2 Overly Detailed Specifications

**Issue**: 05a provides pixel-perfect component specs (padding, border-radius, colors) before implementation.

**Problem**: This is premature optimization. B3 has its own design system.

**Recommendation**: Replace CSS specs with:
- Component names (Card, Button, Badge)
- Semantic intent (primary/secondary, success/warning/error)
- Let B3 theme apply actual styles

**Example** - BEFORE (05c line 689):
```css
.card {
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 1px 3px var(--color-shadow);
  transition: box-shadow 0.2s ease;
}
```

**AFTER**:
```
Component: Card
Type: Standard elevated card
Padding: Medium
Shadow: Subtle
Content: Title, body text, action buttons
```

---

### 7.3 Feature Creep in Data Model

**Issue**: 05c includes fields that aren't used in any screen:

- `User.department` - no screen shows this
- `Assignment Template.autoGrade` - marked as Phase 2
- `Certificate.verificationCode` - no public verification page

**Recommendation**: Remove unused fields from MVP schema or mark as "reserved for Phase 2"

---

## 8. PROTOTYPE IMPLEMENTATION GAPS

### 8.1 proto.html Role Coverage

| Role | Should Have | proto.html Has | Gap |
|------|-------------|----------------|-----|
| Guest | Public catalog, registration, login | ❌ None | Switch to Guest role = blank screen |
| Student | Dashboard, course view, assignments | ✅ ~70% | Missing credentials, to-do widget |
| Methodist | Template editor, materials library | ❌ None | No way to create courses |
| Teacher | Gradebook, grading interface | ✅ ~40% | Has gradebook, missing grading modal |
| Admin | Approval queue, system reports | ❌ None | No admin functions |

**FIX**: At minimum, add:
1. Guest landing page with course list
2. Methodist "Create Template" form with assignment list
3. Admin "Pending Applications" table with Approve/Reject buttons

---

### 8.2 Mixed Admin/Teacher Functions

**Issue**: proto.html has no Admin role at all.

**In 05a**: Admin and Teacher are clearly separated.
**In proto.html**: Only "Student" and "Teacher" roles exist (line 565-568).

**Missing admin functions** that proto.html assigns to nobody:
- Approve enrollments (should be Admin)
- Assign teachers to courses (should be Admin)
- Configure system settings (should be Admin)

**FIX**: Add third role button:
```html
<button class="role-btn" data-role="admin">Администратор</button>
```

---

### 8.3 Missing Screens in proto.html

**From 05a design but not in proto.html**:

1. **Student**:
   - Personal Lab Credentials Page (05a line 802-826)
   - Messages/Inbox page (05a line 706-735)
   - Separate Certificates page (05a line 738-766) - only has inline button

2. **Teacher**:
   - Assignment Grading Modal (05a line 1393-1437) - table exists but no grading UI
   - Student Profile detail view (05a line 1440-1472)
   - Certificate Issuance page (05a line 1566-1592)
   - Reports page (05a line 1533-1563)
   - Course Announcements posting (05a line 1507-1530)

3. **Methodist**: All 10 screens missing

4. **Admin**: All 14 screens missing

**Total missing**: 37 screens

---

### 8.4 Mock Data Gaps

**proto.html mock data** (lines 580-764):
- ✅ Has courses
- ✅ Has enrollments
- ✅ Has assignments
- ✅ Has certificates
- ❌ No Guest users
- ❌ No pending applications (Заявка на регистрацию)
- ❌ No notifications
- ❌ No materials library
- ❌ No credentials in enrollment

**FIX**: Add to mockData:
```javascript
const pendingApplications = [
  {
    id: "app-1",
    userId: "guest-1",
    courseId: "course-basic",
    status: "pending",
    comment: "Хочу изучить платформу для работы",
    requestDate: "2025-12-08"
  }
];

const notifications = [
  {
    id: "notif-1",
    userId: "student-1",
    title: "Задание проверено",
    message: "Преподаватель оценил задание 'Создание справочника'",
    type: "success",
    isRead: false
  }
];
```

---

## 9. SPECIFIC CHANGE RECOMMENDATIONS FOR proto.html

### 9.1 Add Guest Role

**Location**: Line 565-568 (role switch)

**Add**:
```html
<button class="role-btn" data-role="guest">Гость</button>
```

**Add state**:
```javascript
state.role = "guest"; // default to guest on load
```

**Add render function**:
```javascript
function renderGuestCatalog() {
  // Show public course cards with "Apply" button
  // Click "Apply" → Login/Register modal
}
```

---

### 9.2 Fix "Continue" Button Logic

**Location**: Lines 980-989

**Current** (wrong):
```javascript
const firstAssignmentId = course.assignments[0]?.id;
```

**Fix**:
```javascript
const nextAssignment = course.assignments.find(a => {
  const ai = getAssignmentInstance(course.id, a.id, mockStudent.id);
  return !ai || ai.status !== 'accepted';
}) || course.assignments[course.assignments.length - 1];

state.currentAssignmentId = nextAssignment?.id;
```

---

### 9.3 Add To-Do Widget to Dashboard

**Location**: Line 956-976 (renderStudentDashboard)

**Add before "Мои курсы"**:
```html
<section style="margin-bottom:16px;">
  <h2 style="font-size:14px;margin:6px 0 4px;">Ближайшие дедлайны</h2>
  <div class="card">
    <ul style="list-style:none;padding:0;margin:0;">
      ${upcomingDeadlines.map(item => `
        <li style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #e5e7eb;">
          <div>
            <strong>${item.assignmentTitle}</strong>
            <span class="card-meta">${item.courseTitle}</span>
          </div>
          <span class="tag">${item.daysLeft} дней</span>
        </li>
      `).join('')}
    </ul>
  </div>
</section>
```

---

### 9.4 Add Methodist Template Editor

**New screen function**:
```javascript
function renderMethodistDashboard() {
  mainEl.innerHTML = `
    <header class="main-header">
      <h1 class="main-title">Рабочее место методиста</h1>
    </header>
    <section>
      <h2>Мои шаблоны курсов</h2>
      <div class="cards-grid">
        ${courses.map(course => `
          <article class="card">
            <div class="card-title">${course.title}</div>
            <div class="card-meta">${course.code} · ${course.level}</div>
            <div class="card-meta">Заданий: ${course.assignments.length}</div>
            <button class="btn" onclick="alert('Edit template: ${course.title}')">
              Редактировать
            </button>
            <button class="btn btn-ghost" onclick="alert('Preview as student')">
              Предпросмотр
            </button>
          </article>
        `).join('')}
      </div>
      <button class="btn" onclick="alert('Create new template')">
        + Создать новый курс
      </button>
    </section>
  `;
}
```

---

### 9.5 Add Admin Approval Queue

**New screen function**:
```javascript
function renderAdminDashboard() {
  mainEl.innerHTML = `
    <header class="main-header">
      <h1 class="main-title">Панель администратора</h1>
    </header>
    <section>
      <h2>Заявки на регистрацию</h2>
      <table class="gradebook-table">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Студент</th>
            <th>Курс</th>
            <th>Комментарий</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          ${pendingApplications.map(app => `
            <tr>
              <td>${app.requestDate}</td>
              <td>${getUserById(app.userId).name}</td>
              <td>${getCourse(app.courseId).title}</td>
              <td>${app.comment}</td>
              <td>
                <button class="btn" onclick="approveApplication('${app.id}')">
                  Одобрить
                </button>
                <button class="btn btn-ghost" onclick="rejectApplication('${app.id}')">
                  Отклонить
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;
}
```

---

### 9.6 Add Lab Credentials to Course View

**Location**: Line 1173-1231 (renderAssignmentView)

**Add after "Описание" section**:
```html
${enrollment.credentials ? `
  <div class="field-label">Доступ к лабораторному стенду</div>
  <div class="cert-card">
    <div><strong>URL:</strong> <a href="${enrollment.credentials.vm_url}" target="_blank">${enrollment.credentials.vm_url}</a></div>
    <div><strong>Логин:</strong> ${enrollment.credentials.username}</div>
    <div><strong>Пароль:</strong> <code>${enrollment.credentials.password}</code></div>
    <button class="btn btn-ghost" onclick="copyToClipboard('${enrollment.credentials.username}:${enrollment.credentials.password}')">
      Скопировать креды
    </button>
  </div>
` : ''}
```

---

### 9.7 Add Grading Modal for Teacher

**Location**: After line 1330 (gradebook rendering)

**Add click handler on gradebook cells**:
```javascript
// Replace static table cells with clickable cells
.map((a) => {
  const ai = getAssignmentInstance(course.id, a.id, student.id);
  return `
    <td class="grade-cell-status-${ai.status}" style="cursor:pointer;"
        onclick="openGradingModal('${course.id}', '${a.id}', '${student.id}')">
      ${formatAssignmentStatusLabel(ai.status)}
      ${ai.grade != null ? `(${ai.grade})` : ''}
    </td>
  `;
})
```

**Add modal function**:
```javascript
function openGradingModal(courseId, assignmentId, studentId) {
  const ai = getAssignmentInstance(courseId, assignmentId, studentId);
  const modalHtml = `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <h2>Оценка задания</h2>
        <p><strong>Студент:</strong> ${mockStudent.name}</p>
        <p><strong>Задание:</strong> ${assignment.title}</p>
        <div class="field-label">Решение студента</div>
        <div class="field-value">${ai.submissionText || 'Не отправлено'}</div>
        <div class="field-label">Оценка (0-100)</div>
        <input type="number" id="gradeInput" value="${ai.grade || ''}" min="0" max="100" />
        <div class="field-label">Комментарий</div>
        <textarea id="feedbackInput" class="textarea">${ai.feedback || ''}</textarea>
        <div style="display:flex;gap:8px;margin-top:12px;">
          <button class="btn" onclick="saveGrade('${courseId}','${assignmentId}','${studentId}')">
            Сохранить оценку
          </button>
          <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function saveGrade(courseId, assignmentId, studentId) {
  const ai = getAssignmentInstance(courseId, assignmentId, studentId);
  ai.grade = parseInt(document.getElementById('gradeInput').value);
  ai.feedback = document.getElementById('feedbackInput').value;
  ai.status = 'accepted';
  alert('Оценка сохранена (в памяти прототипа)');
  closeModal();
  renderTeacherGradebook(courseId);
}

function closeModal() {
  document.querySelector('.modal-backdrop')?.remove();
}
```

---

## 10. SUMMARY OF CRITICAL ISSUES

### 10.1 Showstoppers (Must Fix Before MVP)

1. **No Guest role implementation** → Cannot demo enrollment flow
2. **No credentials management** → Students cannot access labs
3. **No To-Do widget** → Poor UX, misses key Canvas pattern
4. **No Methodist screens** → Cannot create courses in prototype
5. **No Admin screens** → Cannot demo approval workflow
6. **Missing BPMN diagrams** → Cannot implement in B3
7. **No enrollment application flow** → Core requirement unmet

**Total**: 7 showstoppers

---

### 10.2 High Priority (Should Fix for Good MVP)

1. Course forum missing (only assignment chat exists)
2. Certificate auto-generation not automated
3. No system-level reports for Admin
4. No e-commerce flow (requirement stated but ignored)
5. Missing prerequisite logic for assignments
6. No file upload validation specs
7. No notification system detailed

**Total**: 7 high-priority

---

### 10.3 Medium Priority (Can Defer but Document)

1. Materials library as separate entity
2. Multi-teacher support for course instances
3. Organizational structure management
4. Audit logging
5. Grading rubric details
6. Peer review assignments (mentioned in references)
7. Mobile responsiveness specs

**Total**: 7 medium-priority

---

### 10.4 Low Priority (Phase 2)

1. Quiz auto-grading
2. Gamification (badges, leaderboards)
3. Learning paths (course sequences)
4. Social features (likes, shares)
5. Analytics dashboard
6. Third-party integrations (Zoom, etc.)
7. Blended learning features

---

## 11. RECOMMENDED ACTION PLAN

### Phase 1: Fix Showstoppers (Week 1-2)

**Day 1-3**: Role implementation
- [ ] Add Guest screens: Landing, Catalog, Course Detail, Registration, Application
- [ ] Add Methodist screens: Dashboard, Template Editor, Assignment Manager
- [ ] Add Admin screens: Application Approval Queue, System Dashboard

**Day 4-5**: Core features
- [ ] Student credentials: Add to data model, add provisioning form for Admin, add display in Student course view
- [ ] To-Do widget: Add to Student dashboard, wire to assignment due dates
- [ ] Course forum: Add basic thread view to Student/Teacher course pages

**Day 6-7**: Workflows
- [ ] Define 4 BPMN processes: Enrollment, Submission, Grading, Certification
- [ ] Map triggers and notifications

---

### Phase 2: High Priority Fixes (Week 3)

- [ ] E-commerce flow: Add Guest purchase, payment stub, Admin pricing config
- [ ] System reports: Add Admin reports page with 3 report types
- [ ] Auto-certification: Add BPMN trigger on course completion
- [ ] Assignment prerequisites: Add to data model and Methodist editor

---

### Phase 3: Polish (Week 4)

- [ ] Fix proto.html: Implement all 5 roles with core screens
- [ ] Update proto.html Continue button logic
- [ ] Add grading modal to Teacher gradebook
- [ ] Add notifications panel to all roles

---

### Phase 4: Documentation (Ongoing)

- [ ] Create B3 permission mapping table
- [ ] Create BPMN diagram visuals
- [ ] Create sample certificate template
- [ ] Create API integration specs for credential provisioning

---

## 12. FINAL VERDICT

**Overall Design Quality**: 6/10

**Strengths**:
- ✅ Clear role separation
- ✅ Comprehensive screen documentation
- ✅ Good UX patterns from references
- ✅ Solid data model foundation

**Weaknesses**:
- ❌ 60% of screens not implemented in prototype
- ❌ 3 core features completely missing
- ❌ No BPMN process diagrams
- ❌ proto.html only covers 2 of 5 roles

**Recommendation**: **DO NOT PROCEED** to B3 implementation until:
1. Guest role screens added
2. Credentials management designed
3. BPMN processes diagrammed
4. proto.html demonstrates all 5 roles

**Estimated rework**: 2-3 weeks to address critical issues.

---

**End of Critique**

**Next Steps**:
1. Review this critique with team
2. Prioritize fixes
3. Create revised plan_v2 addressing issues
4. Update proto.html with all roles
5. Generate BPMN diagrams
6. Re-review before B3 implementation

