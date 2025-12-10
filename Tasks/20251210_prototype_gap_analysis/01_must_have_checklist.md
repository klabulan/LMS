# Critical Must-Have Checklist for B3 LMS

**Version:** 1.0
**Date:** 2025-12-10
**Purpose:** Validate ANY LMS prototype/implementation against reference platform best practices
**Source:** Analysis of 8 reference platforms (Canvas, Coursera, SAP Litmos, Docebo, D2L Brightspace, Absorb, Moodle/Totara, Udemy)

---

## How to Use This Checklist

- **Priority Levels**:
  - **MUST HAVE** = Required for v1.0 MVP (6+ platforms implement, critical for corporate LMS)
  - **NICE TO HAVE** = v2.0+ features
  - **AVOID** = Anti-pattern detected in reference research

- **Validation**: Check each item against prototype/implementation
- **Status**: ✅ Present | ⚠️ Partial | ❌ Missing | 🚫 Anti-pattern detected

---

## Section 1: UX/UI Must-Haves (from Section 3)

### 1.1 Dashboard (Student Entry Point)

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| U1 | **Progress bars on course cards** | MUST HAVE | Horizontal bar showing % completion on every course card | | Referenced by 6/8 platforms |
| U2 | **Course card thumbnails** | MUST HAVE | Visual image for each course on dashboard | | All platforms |
| U3 | **Course completion statistics** | MUST HAVE | Text like "3/10 lessons completed" alongside progress bar | | Coursera, Litmos, Absorb |
| U4 | **"Continue" button on course cards** | MUST HAVE | Button redirects to NEXT incomplete item, not course root | | 7/8 platforms (critical) |
| U5 | **Timeline/To-Do list widget** | MUST HAVE | Dedicated section showing upcoming deadlines from all courses | | 7/8 platforms |
| U6 | **Deadline color coding** | MUST HAVE | Green: >7 days, Orange: 1-7 days, Red: <1 day/overdue | | Canvas, Moodle, Brightspace |
| U7 | **Deadline sorting** | MUST HAVE | Ascending by date (nearest deadlines at top) | | All platforms with timeline |
| U8 | **Actionable deadline items** | MUST HAVE | Each deadline has "Go to assignment" button/link | | Moodle 4.0 best practice |
| U9 | **Dashboard personalization** | MUST HAVE | Content specific to current user role (student/teacher) | | 6/8 platforms |
| U10 | **Minimal visual noise** | MUST HAVE | Clean layout, max 3-4 widgets on default view | | Canvas vs Moodle 3.x lesson |

### 1.2 Course Navigation

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| U11 | **Course Index (left panel)** | MUST HAVE | Persistent navigation tree visible while viewing course content | | Moodle 4.0 revolution, Coursera |
| U12 | **Hierarchical course structure** | MUST HAVE | Modules → Sub-modules → Elements (lessons/assignments) | | All platforms |
| U13 | **Completion indicators in Course Index** | MUST HAVE | Visual markers (✓ / ⏸ / ○) next to each element showing completion status | | Moodle 4.0, Coursera, Brightspace |
| U14 | **Current position highlighting** | MUST HAVE | Active element highlighted in Course Index | | Moodle 4.0, Coursera |
| U15 | **Collapse/Expand functionality** | MUST HAVE | Ability to collapse completed modules to reduce clutter | | Moodle 4.0 best practice |

### 1.3 Progress Tracking

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| U16 | **Overall course progress indicator** | MUST HAVE | Percentage or donut chart showing total course completion | | Brightspace best practice |
| U17 | **Progress by module** | MUST HAVE | Breakdown showing completion % for each module | | Brightspace Class Progress Tool |
| U18 | **Progress by activity type** | MUST HAVE | Separate tracking: Content (75%), Assignments (60%), Quizzes (67%) | | Brightspace Class Progress Tool |
| U19 | **"What's Next" indicator** | MUST HAVE | Clear recommendation of next step ("Complete Quiz 3 by Friday") | | Brightspace, Coursera |
| U20 | **Teacher class progress dashboard** | MUST HAVE | Matrix view: Students × Progress with color indicators | | Brightspace, Canvas |
| U21 | **Risk-level color coding (teacher view)** | MUST HAVE | Green ≥80%, Yellow 50-79%, Red <50% | | Brightspace Class Progress Tool |

### 1.4 Visual Design

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| U22 | **Consistent color system** | MUST HAVE | Blue (actions), Green (success/progress), Orange (warning), Red (danger/overdue), Gray (neutral) | | Platform consensus |
| U23 | **Sufficient color contrast** | MUST HAVE | WCAG 2.1 AA minimum (4.5:1 for text) | | Legal requirement |
| U24 | **Status indication beyond color** | MUST HAVE | Icons (✓) + color for completion, not color alone | | WCAG requirement |

### 1.5 Accessibility

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| U25 | **Keyboard navigation** | MUST HAVE | All interactive elements accessible via Tab, Enter, Esc | | WCAG 2.1 AA |
| U26 | **Screen reader support** | MUST HAVE | ARIA attributes on all interactive elements | | WCAG 2.1 AA |
| U27 | **Adjustable font size** | MUST HAVE | Layout works at 200% zoom, relative units (rem) used | | WCAG 2.1 AA |
| U28 | **Responsive design** | MUST HAVE | Mobile (<768px), Tablet (768-1199px), Desktop (>1200px) breakpoints | | All 8 platforms |
| U29 | **Touch-friendly elements** | MUST HAVE | Minimum 44×44px button/link targets on mobile | | Mobile UX standard |

---

## Section 2: Data Model Must-Haves (from Section 4)

### 2.1 Core Entities

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| D1 | **User entity with roles** | MUST HAVE | Fields: UserId, Email, FirstName, LastName, Role (Student/Instructor/Admin) | | All platforms |
| D2 | **Template → Instance separation (Courses)** | MUST HAVE | Course Template (reusable) → Course Instance (with dates, students) | | Coursera, Litmos, Absorb |
| D3 | **Template → Instance separation (Assignments)** | MUST HAVE | Assignment Template → Assignment Instance (per student) | | All platforms |
| D4 | **Enrollment entity** | MUST HAVE | Links User + Course Instance, has Status, EnrollmentDate, CompletionDate, Progress | | All platforms |
| D5 | **Enrollment types** | MUST HAVE | Mandatory/Optional enrollment (for compliance training) | | All corporate LMS |
| D6 | **Hierarchical course modules** | MUST HAVE | Module with ParentModuleId (self-reference) for nesting | | Moodle, Brightspace |
| D7 | **Module order field** | MUST HAVE | Numeric order field to control sequence | | All platforms |
| D8 | **Assignment → Submission → Grade chain** | MUST HAVE | Assignment Instance (1) → Submission (M) → Grade (1) | | All platforms |
| D9 | **Submission attempt tracking** | MUST HAVE | AttemptNumber field for multiple submission support | | Canvas, Brightspace, Moodle |
| D10 | **Completion tracking entity** | MUST HAVE | User × Module → Completion Record (status: not_started/in_progress/completed/completed_pass/completed_fail) | | All platforms |

### 2.2 Gradebook

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| D11 | **Grade categories** | MUST HAVE | Calculating Categories (with weights) + Organizational Categories (grouping only) | | Canvas, Brightspace, Moodle |
| D12 | **Weighted grade calculation** | MUST HAVE | Formula: SUM(points × category_weight) / SUM(max_points × category_weight) | | Canvas, Brightspace, Moodle |
| D13 | **Gradebook as view (not table)** | MUST HAVE | Computed matrix: Users (rows) × Grade Items (columns) | | Canvas, Brightspace, Moodle |

### 2.3 Certification

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| D14 | **Certificate template** | MUST HAVE | Separate entity: layout/design template for PDF generation | | Litmos, Docebo, Absorb, Totara |
| D15 | **Certificate instance** | MUST HAVE | UserId, CourseInstanceId, IssueDate, PDF file link | | Litmos, Docebo, Absorb, Totara |

### 2.4 Corporate Extensions

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| D16 | **Dynamic Audiences (rule-based enrollment)** | MUST HAVE | Audience entity with Rule formula, auto-enrollment on match | | Totara best practice (critical for automation) |
| D17 | **ExternalId field on User** | MUST HAVE | For HR/ERP system integration | | All corporate platforms |

---

## Section 3: Process Automation Must-Haves (from Section 5)

### 3.1 Enrollment Processes

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| P1 | **CSV bulk enrollment** | MUST HAVE | Process: Upload CSV → Parse → Create User (if new) → Create Enrollment → Send welcome email | | All corporate platforms |
| P2 | **Dynamic Audiences automation** | MUST HAVE | Daily cron: Recalculate audience rules → Enroll new members → Send notifications | | Totara (critical for onboarding automation) |

### 3.2 Course Completion

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| P3 | **Automatic completion detection** | MUST HAVE | Process: Activity completed → Check all requirements met → Update Enrollment status | | All platforms |
| P4 | **Automatic certificate generation** | MUST HAVE | Process: Course completed + Grade ≥ threshold → Create Certificate → Generate PDF → Email link | | Coursera, Litmos, Absorb (6/8 platforms) |

### 3.3 Communication Automation

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| P5 | **Intelligent Agents (basic templates)** | MUST HAVE | Predefined rules: Deadline reminders (3 days before), Inactivity alerts (no login >7 days) | | Brightspace best practice |

---

## Section 4: Must-Have Functions Table (from Section 6)

| ID | Function | Source Platforms | Validation Criteria | Status | Notes |
|----|----------|------------------|---------------------|--------|-------|
| F1 | **Progress bars on course cards** | 6/8 platforms | Visual % bar on dashboard course cards | | Most common user complaint when missing |
| F2 | **"Continue" button** | 7/8 platforms | Redirects to next incomplete item, not course root | | Reduces friction |
| F3 | **Timeline (To-Do deadlines)** | 7/8 platforms | Widget with upcoming deadlines + color coding + action buttons | | Critical for deadline compliance |
| F4 | **Course Index (left panel)** | Moodle 4.0, Coursera | Persistent tree navigation with completion indicators | | Reduces cognitive load |
| F5 | **Detailed progress tracking** | Brightspace, Coursera | Breakdown by module + activity type, color-coded risk | | Key B3 LMS differentiator |
| F6 | **Completion tracking** | All 8 platforms | Automatic tracking of viewed/completed/graded items | | Foundation of progress system |
| F7 | **Gradebook with categories and weights** | Canvas, Brightspace, Moodle | Support for weighted grade calculation | | Flexible grading |
| F8 | **Template → Instance pattern** | Coursera, Litmos, Absorb | Courses and assignments have templates + instances | | Critical for reuse |
| F9 | **Enrollment types (mandatory/optional)** | All corporate LMS | EnrollmentType field distinguishes compliance vs optional | | Compliance training requirement |
| F10 | **Automatic certificate issuance** | 6/8 platforms | BPMN process: Complete → Check criteria → Generate PDF → Email | | Motivation + compliance |
| F11 | **CSV bulk enrollment** | All corporate LMS | BPMN process parses CSV and creates enrollments | | Onboarding at scale |
| F12 | **Dynamic Audiences** | Totara | Rule-based auto-enrollment (e.g., "Department=IT AND Role=Developer") | | Onboarding automation |
| F13 | **Responsive design** | All 8 platforms | Works on mobile/tablet/desktop | | Access from any device |
| F14 | **WCAG 2.1 AA accessibility** | Canvas, Brightspace, Moodle | Keyboard nav, screen readers, contrast, font scaling | | Legal requirement (RF gov sector) |
| F15 | **SSO integration** | All 8 platforms | SAML/OAuth/ESIA for Russian gov sector | | Corporate integration |

---

## Section 5: Anti-Patterns to Detect (from Section 8)

### 5.1 UX/UI Anti-Patterns

| ID | Anti-Pattern | How to Detect | Impact if Present | Status | Notes |
|----|--------------|---------------|-------------------|--------|-------|
| A1 | **No progress bars on course cards** | Dashboard shows course cards without visual progress indicator | Users can't see progress at a glance, must enter course | | Common Canvas/Moodle complaint |
| A2 | **Overloaded Dashboard with many blocks** | Dashboard has >5 widgets/blocks, information overload | Cognitive load, hard to find key actions | | Moodle 3.x before redesign |
| A3 | **No "Continue" button** | Course cards only have "View Course" link to root page | User must manually navigate to last position, friction | | Moodle, Brightspace critique |
| A4 | **"Turn editing on/off" mode** | Interface has global edit mode toggle instead of inline editing | Outdated UX, confusing for users | | Moodle legacy pattern |
| A5 | **Insufficient color contrast** | Text/background contrast <4.5:1 | WCAG violation, accessibility issues | | Some Moodle themes |
| A6 | **Timeline shows only dates, no actions** | Deadline list has no "Go to assignment" buttons | User must remember and navigate manually | | Canvas before improvements |

### 5.2 Data Model Anti-Patterns

| ID | Anti-Pattern | How to Detect | Impact if Present | Status | Notes |
|----|--------------|---------------|-------------------|--------|-------|
| A7 | **No Template → Instance separation** | Each course run is independent copy with no link to master | Can't update all instances from template, version control nightmare | | Moodle, Canvas architecture |
| A8 | **Gradebook computed on-the-fly every request** | Slow page load for gradebook with >100 students | Performance issue, poor UX | | Moodle issue at scale |
| A9 | **Plugin architecture (bloated core)** | System requires plugins for basic features (certificates, progress bars) | Complexity, plugin conflicts, maintenance burden | | Moodle ~35 plugin types |

### 5.3 Functional Anti-Patterns

| ID | Anti-Pattern | How to Detect | Impact if Present | Status | Notes |
|----|--------------|---------------|-------------------|--------|-------|
| A10 | **Unlimited quiz attempts without restrictions** | Quiz has no attempt limit or decreasing points | Grades don't reflect knowledge, students brute-force | | Udemy issue |
| A11 | **No formal Gradebook system** | No way to calculate overall course grade from assignments | Can't issue final grade for corporate clients | | Udemy (marketplace model) |
| A12 | **Marketplace mechanics (revenue share)** | System has payment splitting, instructor payouts | Unnecessary complexity for corporate LMS | | Udemy (not applicable to B3 LMS) |
| A13 | **Predictive Analytics (AI) in v1.0** | AI/ML models for student risk prediction in initial version | Insufficient data for training, premature optimization | | Brightspace Performance+ (expensive add-on) |
| A14 | **Complex Intelligent Agents without safeguards** | Visual rule builder for email automation without testing/limits | Risk of spam, misconfiguration, user complaints | | Brightspace (requires expertise) |

### 5.4 Process Anti-Patterns

| ID | Anti-Pattern | How to Detect | Impact if Present | Status | Notes |
|----|--------------|---------------|-------------------|--------|-------|
| A15 | **Manual certificate generation** | Teacher must manually create PDF certificate for each student | Bottleneck, errors, delays | | Legacy systems |
| A16 | **No deadline reminders** | Students receive no automatic notifications before deadlines | Missed deadlines, poor completion rates | | Basic systems |
| A17 | **No enrollment automation** | Admin must manually enroll every new employee | Onboarding bottleneck, delays, errors | | Basic systems |

---

## Section 6: B3 Platform-Specific Validations

### 6.1 B3 Native Capabilities Usage

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| B1 | **Data Model Constructor usage** | MUST HAVE | All entities created via B3 Data Model Constructor, not custom tables | | Leverage B3 native |
| B2 | **BPMN Designer usage** | MUST HAVE | Core processes (enrollment, grading, certification) implemented via BPMN Designer | | Automation without code |
| B3 | **Dashboard Builder usage** | MUST HAVE | Student/Teacher dashboards built with B3 Dashboard Builder widgets | | No-code customization |
| B4 | **Print Form Designer for certificates** | MUST HAVE | Certificate PDFs generated via B3 Print Form Designer, not external library | | B3 advantage over Moodle |
| B5 | **Onboarding Module exploration** | NICE TO HAVE | Evaluate B3 Onboarding Module for basic platform courses | | Reuse existing capability |

### 6.2 Russian Market Requirements

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| R1 | **ESIA integration** | MUST HAVE | SSO via ESIA (Unified Identification and Authentication System) for gov sector | | Legal requirement for gov clients |
| R2 | **Russian language primary** | MUST HAVE | All UI text in Russian, not translated from English | | Terminology must be native |
| R3 | **Self-hosted deployment** | MUST HAVE | Runs on client servers, not SaaS-only | | Import substitution requirement |
| R4 | **WCAG 2.1 AA compliance** | MUST HAVE | Accessibility for government sector compliance | | Legal requirement in RF |

---

## Section 7: Prototype-Specific Checks

### 7.1 HTML Prototype Validation

| ID | Requirement | Priority | Validation Criteria | Status | Notes |
|----|-------------|----------|---------------------|--------|-------|
| PR1 | **Single-file architecture** | MUST HAVE | All HTML/CSS/JS in one file for easy sharing | | Prototype best practice |
| PR2 | **Mock data matches B3 entity structure** | MUST HAVE | JS mock data objects mirror planned B3 entities exactly | | Prevent divergence |
| PR3 | **Role switching** | MUST HAVE | Ability to toggle between Student/Teacher/Admin views | | UX validation for all roles |
| PR4 | **All key screens present** | MUST HAVE | Dashboard, Course Page, Assignment View, Gradebook, Certificate List | | Comprehensive UX coverage |
| PR5 | **No placeholder content** | MUST HAVE | Realistic course names, assignment descriptions, student names (not "Lorem ipsum") | | Stakeholder-friendly |

---

## Summary: Critical MVP Thresholds

**To qualify as viable v1.0, prototype/implementation MUST have:**

- **UX/UI**: 25/29 UX items (86%+)
- **Data Model**: 15/17 data items (88%+)
- **Processes**: 4/5 process automations (80%+)
- **Functions**: 13/15 must-have functions (87%+)
- **Anti-Patterns**: 0/17 detected anti-patterns (0% tolerance)
- **B3 Native**: 4/5 B3 capabilities used (80%+)
- **Russian Market**: 4/4 requirements (100%)

**Overall MVP Grade: PASS if ≥85% Must-Haves implemented AND 0 Anti-Patterns detected**

---

## Changelog

- **2025-12-10**: Initial version 1.0 created from reference platform analysis
