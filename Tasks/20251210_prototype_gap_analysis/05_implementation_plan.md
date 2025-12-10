# B3 LMS Prototype Implementation Plan

**Date:** 2025-12-10
**Version:** 1.0
**Status:** Ready for Execution
**Based on:** 04_gap_analysis_v2.md, 00_best_practices_summary.md

---

## Executive Summary

**Goal:** Bring B3 LMS prototype from 37.9% UX compliance to 90%+ in 29.5 days (6 weeks), making it ready for stakeholder validation.

**Approach:** 4 phased sprints focusing on quick wins first, then critical UX gaps, high-priority features, and final polish.

**Timeline:** 29.5 days with 2 developers working in parallel where possible

**Expected Outcome:** Production-ready UX prototype demonstrating all core user journeys with reference-platform quality (Canvas/Coursera/Brightspace patterns)

---

## Sprint Summary Table

| Sprint | Focus | Days | Tasks | Developers | Cumulative UX% |
|--------|-------|------|-------|------------|----------------|
| 0 | Quick Wins | 4.5 | 8 | 1 | 62% (18/29) |
| 1 | Critical Gaps | 10 | 8 | 2 parallel | 80% (23/29) |
| 2 | High Priority | 10 | 6 | 2 parallel | 90% (26/29) |
| 3 | Polish & Validation | 5 | 3 | 2 | 95% (28/29) |
| **Total** | **Full UX Prototype** | **29.5 days** | **25** | **~6 weeks** | **95%** |

---

## Sprint 0: Quick Wins (4.5 days, 1 developer)

**Goal:** Low-hanging fruit improvements that provide immediate visual polish and boost compliance from 37.9% to 62%

**Why Quick Wins First:**
- Builds momentum and demonstrates progress
- Low-risk changes (mostly CSS and text additions)
- Improves prototype appearance for stakeholder demos
- No complex dependencies

---

### TASK 0.1: Course Completion Text Details
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 0.5 days (4 hours)
**Dependencies:** None

#### Description
Add detailed completion statistics below progress bars on course cards. Currently shows only percentage bar, but best practice (Coursera/Litmos) shows "3/10 lessons completed" text for clarity.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (lines 85-120, renderCourseCard function)
- `D:\B3\LMS\proto\styles.css` (add .progress-details class)

#### Implementation Steps
1. Add `completedItems` and `totalItems` fields to mock course data
2. Calculate these values from assignment statuses
3. Add HTML element for progress details text below progress bar
4. Style text (small, gray, centered below bar)
5. Test with various completion states (0%, 50%, 100%)

#### Acceptance Criteria
- [ ] All course cards show "X/Y items completed" text
- [ ] Text updates dynamically when mock data changes
- [ ] Styling matches reference platforms (small, secondary color)
- [ ] Mobile view: text remains readable, doesn't overflow

#### Testing
- [ ] Manual test: Check all course cards on student dashboard
- [ ] Visual check: Verify alignment with progress bar
- [ ] Edge cases: 0/0 items, 10/10 items, 3/100 items

---

### TASK 0.2: Deadline Color Threshold Verification
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 0.5 days (4 hours)
**Dependencies:** None

#### Description
Verify and fix deadline color coding thresholds. Best practice (Canvas/Moodle): Green >7 days, Orange 1-7 days, Red <1 day or overdue. Current implementation needs threshold verification.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (lines 180-210, renderDeadlines function)
- `D:\B3\LMS\proto\styles.css` (verify .deadline-urgent, .deadline-warning, .deadline-ok classes)

#### Implementation Steps
1. Review current deadline color logic in renderDeadlines
2. Calculate days until deadline: `Math.ceil((deadline - now) / (1000*60*60*24))`
3. Apply color classes:
   - Red: daysUntil < 1 OR deadline < now (overdue)
   - Orange: daysUntil >= 1 AND daysUntil <= 7
   - Green: daysUntil > 7
4. Verify CSS classes exist with correct colors (Red #EE0612, Orange #FC5E13, Green #00AC18)
5. Test with mock data spanning all ranges

#### Acceptance Criteria
- [ ] Deadlines >7 days: green indicator
- [ ] Deadlines 1-7 days: orange indicator
- [ ] Deadlines <1 day OR overdue: red indicator
- [ ] Color coding updates dynamically with time

#### Testing
- [ ] Manual test: Create deadlines at 14 days, 5 days, 12 hours, -2 days (overdue)
- [ ] Visual check: Verify colors match Canvas/Moodle standards
- [ ] Browser compatibility: Test color contrast in Chrome/Firefox/Edge

---

### TASK 0.3: Actionable Deadline Items
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 0.5 days (4 hours)
**Dependencies:** None

#### Description
Add explicit "Go to assignment" button on each deadline item. Best practice (Moodle 4.0 Timeline): Not just text, but clickable button that directly opens the assignment.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (lines 180-210, renderDeadlines function)
- `D:\B3\LMS\proto\styles.css` (add .deadline-action-btn class)

#### Implementation Steps
1. Add button HTML to each deadline item: `<button class="deadline-action-btn">Go to assignment</button>`
2. Wire onclick handler to navigate to assignment detail page
3. Style button: small, secondary style, aligned right
4. Ensure button is touch-friendly (44x44px minimum)
5. Add hover/focus states for accessibility

#### Acceptance Criteria
- [ ] Each deadline item has "Go to assignment" button
- [ ] Button click navigates to correct assignment
- [ ] Button styling matches prototype design system
- [ ] Touch target ≥44x44px (WCAG compliance)

#### Testing
- [ ] Manual test: Click button on 5 different deadline items
- [ ] Navigation test: Verify correct assignment opens
- [ ] Mobile test: Tap button on mobile viewport (375px width)
- [ ] Accessibility test: Keyboard Tab+Enter to activate button

---

### TASK 0.4: Current Position Highlighting
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 0.5 days (4 hours)
**Dependencies:** None

#### Description
Add CSS active highlight to current navigation item in course navigation tree. Brightspace/Canvas pattern: Current item has background color + bold text.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (lines 240-280, renderCourseNav function)
- `D:\B3\LMS\proto\styles.css` (add .nav-item.active class)

#### Implementation Steps
1. Track current module/lesson in state: `currentNavItem` variable
2. Add `.active` class to current nav item in renderCourseNav
3. Style `.nav-item.active`:
   - Background: light blue (#E3F2FD)
   - Border-left: 4px solid primary blue (#0374B5)
   - Font-weight: 600 (semi-bold)
4. Update active item when user navigates
5. Ensure contrast ratio ≥4.5:1 (WCAG AA)

#### Acceptance Criteria
- [ ] Current nav item visually highlighted
- [ ] Highlight updates when user navigates between items
- [ ] Styling matches Canvas/Brightspace patterns
- [ ] WCAG AA contrast compliance verified

#### Testing
- [ ] Manual test: Navigate through 5 course items, verify highlight follows
- [ ] Visual check: Compare with Canvas screenshot (reference)
- [ ] Accessibility test: Use contrast checker tool (WebAIM)
- [ ] Edge case: First item, last item, nested item highlighting

---

### TASK 0.5: "What's Next" Indicator
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 0.5 days (4 hours)
**Dependencies:** None

#### Description
Add explicit text prompt near "Continue" button: "Complete Quiz 3 by Friday". Brightspace pattern: Not just button, but context for next action.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (lines 85-120, renderCourseCard function)
- `D:\B3\LMS\proto\styles.css` (add .next-step-hint class)

#### Implementation Steps
1. Calculate next incomplete item for each enrollment
2. Add text element above/beside "Continue" button:
   - Format: "Next: [Assignment Name] (due [Date])"
   - Example: "Next: Complete Lab 2 (due Friday, Dec 15)"
3. Style as small hint text (italic, secondary color)
4. Show only if next item exists (hide for 100% complete courses)
5. Update dynamically when assignments completed

#### Acceptance Criteria
- [ ] "Next: ..." text visible on in-progress course cards
- [ ] Text shows correct next assignment name + deadline
- [ ] Hidden for 100% completed courses
- [ ] Styling is subtle but readable

#### Testing
- [ ] Manual test: Verify next step text on 3 different courses
- [ ] Edge case: Course with no next item (100% complete)
- [ ] Edge case: Course with next item but no deadline
- [ ] Mobile test: Text doesn't overflow on narrow screens

---

### TASK 0.6: Touch-Friendly Element Audit
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 0.5 days (4 hours)
**Dependencies:** None

#### Description
Audit all buttons and interactive icons, increase small touch targets to 44x44px minimum (WCAG 2.1 AA guideline). Best practice: All tap targets ≥44px for mobile UX.

#### Files to Modify
- `D:\B3\LMS\proto\styles.css` (update button/icon styles)
- `D:\B3\LMS\proto\modules\navigation.js` (hamburger menu button)
- Multiple module files (any custom buttons)

#### Implementation Steps
1. Create audit spreadsheet: List all interactive elements
2. Measure current dimensions (use browser DevTools)
3. Identify elements <44x44px:
   - Icon-only buttons (edit, delete, expand/collapse)
   - Small link buttons
   - Navigation toggle
4. Update CSS:
   - Add padding to reach 44x44px
   - OR increase icon size
   - Maintain visual balance
5. Test on mobile device (not just browser emulation)

#### Acceptance Criteria
- [ ] All buttons ≥44x44px touch target
- [ ] All clickable icons ≥44x44px touch target
- [ ] Visual design remains balanced (not oversized)
- [ ] Verified on real mobile device (iPhone/Android)

#### Testing
- [ ] Manual test: Use ruler overlay in DevTools (iOS Safari, Android Chrome)
- [ ] Touch test: Tap each button on real mobile device
- [ ] Edge case: Very small icons (10-15px) - add padding, not just scale
- [ ] Regression test: Desktop layout not negatively affected

---

### TASK 0.7: Template-Instance Mock Data
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 1.0 day (8 hours)
**Dependencies:** None

#### Description
Add `templateId` and `instanceId` fields to JS mock data to align prototype with architecture (gpt_design.md pattern: Шаблон курса → Экземпляр курса). Currently mock data has flat courses without template/instance separation.

#### Files to Modify
- `D:\B3\LMS\proto\modules\state.js` (mock data structure)
- All module files that reference course data (student.js, teacher.js, admin.js)

#### Implementation Steps
1. Refactor mock data structure:
   ```javascript
   // OLD: courses: [{ id: 1, name: "B3 Basics", ... }]
   // NEW:
   courseTemplates: [{ templateId: "T1", name: "B3 Basics Template", ... }]
   courseInstances: [{ instanceId: "I1", templateId: "T1", startDate: "2025-01-10", ... }]
   ```
2. Update enrollments to reference `instanceId` instead of `courseId`
3. Update assignment templates/instances similarly
4. Modify rendering code to join template + instance data
5. Add comments explaining template-instance pattern

#### Acceptance Criteria
- [ ] Mock data has separate courseTemplates and courseInstances arrays
- [ ] Enrollments link to instanceId
- [ ] Prototype renders correctly with new structure
- [ ] Comments document template→instance relationship

#### Testing
- [ ] Manual test: All views still render with refactored data
- [ ] Verify: Student sees instance-specific data (dates, instructor)
- [ ] Verify: Template data (name, description) inherited by instances
- [ ] Documentation: Add diagram to code comments

---

### TASK 0.8: Dashboard Widget Reduction
**Priority:** QUICK WIN
**Status:** TODO
**Sprint:** 0
**Effort:** 0.5 days (4 hours)
**Dependencies:** None

#### Description
Reduce dashboard cognitive load by hiding/collapsing 2 secondary widgets (credentials panel, messages preview). Best practice (Canvas/Coursera): 2-3 primary widgets, not 5. Fix anti-pattern A2 from gap analysis.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (renderDashboard function)
- `D:\B3\LMS\proto\styles.css` (add collapsible widget styles)

#### Implementation Steps
1. Identify primary widgets (keep visible):
   - Course cards
   - Timeline/Deadlines
   - "What's Next" prompt
2. Identify secondary widgets (collapse by default):
   - Credentials/VM access panel
   - Messages/discussion preview
3. Add collapse/expand toggle for secondary widgets
4. Save collapse state in localStorage
5. Mobile: Hide secondary widgets entirely (or move to separate tab)

#### Acceptance Criteria
- [ ] Desktop: 3 primary widgets visible, 2 secondary collapsed by default
- [ ] User can expand/collapse secondary widgets
- [ ] Collapse state persists on page reload (localStorage)
- [ ] Mobile: Only primary widgets shown

#### Testing
- [ ] Manual test: Toggle collapse/expand, verify state saved
- [ ] Visual check: Dashboard feels cleaner (compare before/after screenshots)
- [ ] Mobile test: Verify secondary widgets hidden on <768px viewport
- [ ] User feedback: Show to 2-3 users, ask "Is this cluttered?" (informal)

---

## Sprint 1: Critical Gaps (10 days, 2 developers parallel)

**Goal:** Address 8 blocking UX gaps preventing stakeholder validation. These are CRITICAL items where prototype is unusable without fixes.

**Why Critical First:**
- Unblocks core user journeys (navigation, progress tracking, teacher monitoring)
- Highest impact on UX compliance (from 62% to 80%)
- Some items can be parallelized across 2 developers

**Team Split:**
- **Developer 1:** Progress & Teacher Views (U17, U18, U20, U21)
- **Developer 2:** Navigation & Accessibility (U13, U11, U25, U26 partial)

---

### TASK 1.1: Completion Indicators in Navigation
**Priority:** CRITICAL (P0)
**Status:** TODO
**Sprint:** 1
**Effort:** 3 days
**Dependencies:** None
**Assigned:** Developer 2

#### Description
Add visual completion indicators (✓/⏸/○) in course navigation tree. Best practice (Moodle 4.0 Course Index): Student sees at a glance which lessons are done. Currently navigation shows structure but no status - unusable for wayfinding.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (lines 240-280, renderCourseNav function)
- `D:\B3\LMS\proto\modules\state.js` (add completion status to mock data)
- `D:\B3\LMS\proto\styles.css` (add completion icon styles)

#### Implementation Steps
1. Add completion field to each course item in mock data:
   ```javascript
   modules: [
     { id: 1, name: "Module 1", completion: "completed" },
     { id: 2, name: "Module 2", completion: "in_progress" },
     { id: 3, name: "Module 3", completion: "not_started" }
   ]
   ```
2. Define icon mapping:
   - Completed: ✓ (green checkmark, #00AC18)
   - In progress: ⏸ (orange pause icon, #FC5E13)
   - Not started: ○ (gray circle, #9E9E9E)
3. Render icons in navigation tree (before item name)
4. Add CSS for icon positioning and colors
5. Ensure icons don't break layout on mobile
6. Add ARIA labels for screen readers ("Completed", "In progress", "Not started")

#### Acceptance Criteria
- [ ] All navigation items show completion icon
- [ ] Icons update when mock data changes (simulate completion)
- [ ] Icon colors match Canvas/Moodle standards
- [ ] Screen reader announces status ("Module 1, Completed")
- [ ] Icons aligned properly in tree hierarchy (indented items)

#### Testing
- [ ] Manual test: Navigate through course, verify all items have icons
- [ ] Status change test: Simulate marking item complete, icon updates
- [ ] Accessibility test: Screen reader announces status correctly (NVDA/JAWS)
- [ ] Visual regression: Compare with Moodle 4.0 Course Index screenshot
- [ ] Mobile test: Icons don't cause text overflow on narrow screens

---

### TASK 1.2: Course Index Persistence
**Priority:** HIGH (P2)
**Status:** TODO
**Sprint:** 1
**Effort:** 2 days
**Dependencies:** TASK 1.1 (completion indicators)
**Assigned:** Developer 2

#### Description
Make course navigation tree persistently visible as sticky left panel. Best practice (Moodle 4.0, Coursera): Navigation always visible, doesn't disappear when viewing content. Current prototype: Navigation hidden when viewing assignment details.

#### Files to Modify
- `D:\B3\LMS\proto\index-modular.html` (add left sidebar layout)
- `D:\B3\LMS\proto\modules/student.js` (refactor layout to 2-column)
- `D:\B3\LMS\proto\styles.css` (add sticky sidebar styles)

#### Implementation Steps
1. Refactor course view layout:
   - Left column (250px width): Navigation tree (sticky position)
   - Right column (flex-grow): Content area (scrollable)
2. CSS sticky positioning:
   ```css
   .course-nav-sidebar {
     position: sticky;
     top: 60px; /* below header */
     max-height: calc(100vh - 60px);
     overflow-y: auto;
   }
   ```
3. Add collapse button for narrow screens (768-1024px)
4. Mobile (<768px): Hamburger menu overlay (existing pattern)
5. Save collapse state in localStorage
6. Ensure content area doesn't scroll with nav (independent scrolling)

#### Acceptance Criteria
- [ ] Desktop (>1024px): Nav always visible on left
- [ ] Nav remains in place when scrolling content area
- [ ] Tablet (768-1024px): Nav collapsible with toggle button
- [ ] Mobile (<768px): Nav accessible via hamburger menu
- [ ] Collapse state persists on page reload

#### Testing
- [ ] Manual test: Scroll content area, verify nav stays fixed
- [ ] Edge case: Very long course (50+ items), nav scrolls independently
- [ ] Responsive test: Resize browser 1920px → 768px → 375px
- [ ] State persistence: Collapse nav, refresh page, verify state saved
- [ ] Performance: No layout thrashing on scroll (check DevTools Performance)

---

### TASK 1.3: Progress by Module
**Priority:** CRITICAL (P0)
**Status:** TODO
**Sprint:** 1
**Effort:** 2 days
**Dependencies:** None
**Assigned:** Developer 1

#### Description
Add module-level progress breakdown on course page. Best practice (Brightspace Class Progress): Student sees "Module 1: 8/10 items (80%)" for each module. Current prototype: Only overall course progress, can't identify which module is incomplete.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (add renderModuleProgress function)
- `D:\B3\LMS\proto\modules/state.js` (calculate module completion)
- `D:\B3\LMS\proto\styles.css` (add module progress styles)

#### Implementation Steps
1. Calculate completion per module:
   ```javascript
   function calculateModuleProgress(moduleId) {
     const items = getModuleItems(moduleId);
     const completed = items.filter(i => i.completion === 'completed').length;
     return { completed, total: items.length, percentage: (completed/items.length)*100 };
   }
   ```
2. Add module progress section to course page (below course header)
3. Render each module as expandable card:
   - Module name
   - Progress bar (horizontal)
   - Text: "8/10 items (80%)"
   - Expand/collapse to show item list
4. Color code progress:
   - Green: ≥80% complete
   - Orange: 50-79% complete
   - Red: <50% complete
5. Sort modules by order (not by completion)

#### Acceptance Criteria
- [ ] Course page shows progress for each module
- [ ] Progress bars update when mock data changes
- [ ] Color coding matches Brightspace patterns (green/orange/red)
- [ ] Modules expandable to show item details
- [ ] Mobile-friendly (cards stack vertically)

#### Testing
- [ ] Manual test: View course with 5 modules at different completion levels
- [ ] Calculation test: Verify math (8/10 = 80%, not 8%)
- [ ] Visual test: Progress bars fill correctly (CSS width percentage)
- [ ] Edge case: Module with 0 items (show "No items")
- [ ] Edge case: Module with 100% completion (green indicator)

---

### TASK 1.4: Progress by Activity Type
**Priority:** CRITICAL (P0)
**Status:** TODO
**Sprint:** 1
**Effort:** 2 days
**Dependencies:** TASK 1.3 (module progress structure)
**Assigned:** Developer 1

#### Description
Add activity type breakdown: Content (viewed) vs Assignments (graded) vs Quizzes (completed). Best practice (Brightspace): "Content Topics: 15/20 viewed (75%), Assignments: 3/5 submitted (60%)". Current prototype: No distinction between reading content and submitting assignments.

#### Files to Modify
- `D:\B3\LMS\proto\modules\student.js` (renderActivityTypeProgress function)
- `D:\B3\LMS\proto\modules/state.js` (add activity type field to items)
- `D:\B3\LMS\proto\styles.css` (activity type progress cards)

#### Implementation Steps
1. Add `activityType` field to course items in mock data:
   - "content" (lectures, readings, videos)
   - "assignment" (submitted work)
   - "quiz" (tests, assessments)
2. Calculate completion by type:
   ```javascript
   const contentProgress = items.filter(i => i.type === 'content').completionRate;
   const assignmentProgress = items.filter(i => i.type === 'assignment').completionRate;
   const quizProgress = items.filter(i => i.type === 'quiz').completionRate;
   ```
3. Add activity type breakdown section (above module progress)
4. Render 3 cards (or progress bars):
   - Content: X/Y viewed
   - Assignments: X/Y submitted
   - Quizzes: X/Y completed
5. Use icons for each type (book, pencil, checkmark)
6. Color code same as module progress

#### Acceptance Criteria
- [ ] Course page shows 3 activity type progress indicators
- [ ] Each type shows correct count (X/Y format)
- [ ] Progress updates when items completed
- [ ] Icons visually distinguish activity types
- [ ] Works with courses that have 0 of a type (e.g., no quizzes)

#### Testing
- [ ] Manual test: Course with all 3 types, verify counts
- [ ] Edge case: Course with only content (no assignments/quizzes)
- [ ] Edge case: Course with 0/0 items in a type (hide section)
- [ ] Calculation test: Verify completion rates match expectations
- [ ] Visual test: Icons and colors match design system

---

### TASK 1.5: Teacher Class Progress Dashboard
**Priority:** CRITICAL (P0)
**Status:** TODO
**Sprint:** 1
**Effort:** 5 days
**Dependencies:** TASK 1.3, TASK 1.4 (progress calculation logic)
**Assigned:** Developer 1

#### Description
Create teacher-facing progress dashboard with Students × Progress matrix. Best practice (Brightspace Class Progress Tool): Teacher sees all students in table, with progress % and risk indicators. Current prototype: Teachers have no way to monitor student progress - blocking teacher validation.

#### Files to Modify
- `D:\B3\LMS\proto\modules/teacher.js` (add renderClassProgress function)
- `D:\B3\LMS\proto\modules/state.js` (add student enrollment data)
- `D:\B3\LMS\proto\styles.css` (progress table styles)
- `D:\B3\LMS\proto/index-modular.html` (add teacher dashboard page)

#### Implementation Steps
1. Create teacher dashboard page (teacher.html or section in index)
2. Add mock data: Student enrollments with progress
   ```javascript
   enrollments: [
     { studentId: 1, courseId: 1, progress: 85, lastActivity: "2025-12-08" },
     { studentId: 2, courseId: 1, progress: 45, lastActivity: "2025-11-30" },
     // ...
   ]
   ```
3. Render Students × Assignments matrix table:
   - Rows: Students (name, email)
   - Columns: Overall progress, Last activity, Risk level
   - Optional: Expandable row showing per-assignment status
4. Add filters:
   - Course dropdown
   - Risk level filter (all/green/yellow/red)
   - Sort by progress (ascending/descending)
5. Responsive: Mobile shows cards instead of table
6. Export to CSV button (bonus)

#### Acceptance Criteria
- [ ] Teacher dashboard shows all enrolled students
- [ ] Table displays progress % for each student
- [ ] Filters work correctly (course, risk level)
- [ ] Sort functionality works (by progress, by name)
- [ ] Mobile view: Cards instead of table
- [ ] At least 10 test students in mock data

#### Testing
- [ ] Manual test: View dashboard with 20 students
- [ ] Filter test: Filter by risk level, verify correct students shown
- [ ] Sort test: Sort by progress descending, verify order
- [ ] Edge case: Course with 0 enrollments (show "No students")
- [ ] Edge case: Student with 0% progress (red indicator)
- [ ] Performance: Table renders quickly with 50 students (mock data)

---

### TASK 1.6: Risk-Level Color Coding (Teacher View)
**Priority:** CRITICAL (P0)
**Status:** TODO
**Sprint:** 1
**Effort:** 2 days (parallel with TASK 1.5)
**Dependencies:** TASK 1.5 (teacher dashboard structure)
**Assigned:** Developer 1

#### Description
Add color-coded risk indicators for struggling students. Best practice (Brightspace): Green ≥80%, Yellow 50-79%, Red <50% or inactive >7 days. Teachers need at-a-glance view of who needs help.

#### Files to Modify
- `D:\B3\LMS\proto\modules/teacher.js` (add risk calculation logic)
- `D:\B3\LMS\proto\styles.css` (risk indicator styles)

#### Implementation Steps
1. Define risk calculation logic:
   ```javascript
   function calculateRisk(enrollment) {
     if (enrollment.progress < 50 || daysSinceActivity(enrollment) > 7) return 'red';
     if (enrollment.progress < 80) return 'yellow';
     return 'green';
   }
   ```
2. Add risk indicator column in teacher table
3. Render as colored badge or status dot:
   - Green: ● (On track)
   - Yellow: ● (At risk)
   - Red: ● (Critical)
4. Add tooltip on hover: "45% complete, last activity 12 days ago"
5. Ensure not color-only (WCAG): Add text label or icon
6. Add summary stats at top: "3 critical, 5 at risk, 12 on track"

#### Acceptance Criteria
- [ ] Each student has visible risk indicator (color + text/icon)
- [ ] Risk calculation matches definition (test with edge cases)
- [ ] Tooltip shows helpful details on hover
- [ ] Summary stats update dynamically with filters
- [ ] WCAG compliant (not color-only, contrast ≥4.5:1)

#### Testing
- [ ] Manual test: Create students with progress at 90%, 60%, 30%
- [ ] Edge case: Student with 80% but inactive 14 days (should be red)
- [ ] Accessibility test: Verify not color-only (text labels present)
- [ ] Tooltip test: Hover over each risk level, verify correct info
- [ ] Summary stats test: Filter by course, verify stats recalculate

---

### TASK 1.7: Keyboard Navigation
**Priority:** HIGH (P1) - CRITICAL if gov sector
**Status:** TODO
**Sprint:** 1
**Effort:** 3 days
**Dependencies:** None
**Assigned:** Developer 2

#### Description
Add full keyboard navigation support (Tab, Enter, Esc, Arrow keys). WCAG 2.1 AA requirement: All functionality available via keyboard. Current prototype: Mouse-only, not accessible.

#### Files to Modify
- All module files (add keyboard event listeners)
- `D:\B3\LMS\proto\styles.css` (add focus indicator styles)
- `D:\B3\LMS\proto\modules/helpers.js` (create keyboard nav utility functions)

#### Implementation Steps
1. Audit all interactive elements (buttons, links, form inputs, cards)
2. Ensure all have `tabindex` and are in logical tab order
3. Add keyboard event handlers:
   - Tab: Navigate between elements
   - Enter/Space: Activate buttons/links
   - Esc: Close modals/dropdowns
   - Arrow keys: Navigate within lists (course cards, navigation tree)
4. Add visible focus indicators (CSS :focus):
   - 2px solid outline, primary color
   - Ensure contrast ≥3:1 (WCAG AA)
5. Test with keyboard only (no mouse)
6. Add "Skip to content" link for screen readers

#### Acceptance Criteria
- [ ] All interactive elements reachable via Tab
- [ ] Enter/Space activates all buttons and links
- [ ] Esc closes all modals and dropdowns
- [ ] Focus indicators clearly visible (not default browser outline)
- [ ] Logical tab order (top-to-bottom, left-to-right)
- [ ] "Skip to content" link functional

#### Testing
- [ ] Manual test: Navigate entire prototype using only keyboard
- [ ] User test: Give prototype to keyboard-only user, observe pain points
- [ ] Accessibility audit: Use Lighthouse/axe DevTools for issues
- [ ] Edge case: Modal open, Tab cycles only within modal (focus trap)
- [ ] Edge case: Navigate 100-item list with arrow keys (performance)

---

### TASK 1.8: Screen Reader Support (Partial)
**Priority:** HIGH (P1) - CRITICAL if gov sector
**Status:** TODO
**Sprint:** 1
**Effort:** 5 days (start in Sprint 1, continue in Sprint 2)
**Dependencies:** TASK 1.7 (keyboard navigation)
**Assigned:** Developer 2

#### Description
Add ARIA attributes for screen reader support. WCAG 2.1 AA requirement: Screen readers (NVDA, JAWS, VoiceOver) can navigate and understand content. Current prototype: No ARIA labels, unusable for blind users.

**Note:** This is large task. Sprint 1 focus: Critical elements. Sprint 2: Complete remaining.

#### Files to Modify
- All module files (add ARIA attributes to HTML)
- `D:\B3\LMS\proto/modules/navigation.js` (nav ARIA roles)
- `D:\B3\LMS\proto/modules/student.js` (dashboard ARIA labels)

#### Implementation Steps (Sprint 1 - Critical Elements)
1. Add semantic HTML5 elements:
   - `<nav>` for navigation
   - `<main>` for content area
   - `<aside>` for sidebars
   - `<article>` for course cards
2. Add ARIA roles where semantic HTML insufficient:
   - `role="navigation"` on nav tree
   - `role="button"` on clickable divs (prefer `<button>`)
   - `role="progressbar"` on progress bars
3. Add ARIA labels for context:
   - `aria-label="Course progress: 65%"` on progress bar
   - `aria-label="Course: B3 Basics, 65% complete"` on course card
   - `aria-label="Deadline: Assignment due in 3 days"` on deadline item
4. Add ARIA live regions for dynamic updates:
   - `aria-live="polite"` on status messages
5. Test with screen reader (NVDA on Windows, VoiceOver on Mac)

#### Acceptance Criteria (Sprint 1 - Partial)
- [ ] All navigation elements have ARIA labels
- [ ] All buttons have descriptive labels (not just "Click here")
- [ ] Progress bars announce percentage to screen reader
- [ ] Course cards announce name and progress
- [ ] Tested with NVDA and passes basic navigation

#### Testing
- [ ] Manual test: Use NVDA, navigate dashboard with eyes closed
- [ ] User test: Recruit 1 blind user for 30-min usability test (Sprint 2)
- [ ] Accessibility audit: Lighthouse accessibility score ≥85
- [ ] Edge case: Dynamic content updates (assignments completed) announced
- [ ] Documentation: Create ARIA usage guide for developers

**Sprint 2 continuation:** Remaining ARIA attributes (form labels, error messages, modals)

---

## Sprint 2: High Priority (10 days, 2 developers parallel)

**Goal:** Address remaining UX items, complete accessibility work, improve teacher dashboard

**Why High Priority:**
- Brings compliance from 80% to 90% (near-complete)
- Completes accessibility for government sector readiness
- Polishes teacher experience

**Team Split:**
- **Developer 1:** Teacher features and advanced UX
- **Developer 2:** Accessibility completion and visual polish

---

### TASK 2.1: Overall Course Progress Donut Chart
**Priority:** HIGH
**Status:** TODO
**Sprint:** 2
**Effort:** 1.5 days
**Dependencies:** None
**Assigned:** Developer 1

#### Description
Replace linear progress bar with donut/circular chart on course detail page. Best practice (Brightspace, Coursera): Donut chart more visually engaging than simple bar. Gap analysis notes linear bar is "sufficient" but donut is spec.

#### Files to Modify
- `D:\B3\LMS\proto/modules/student.js` (renderCourseProgress function)
- `D:\B3\LMS\proto/styles.css` (donut chart CSS)
- Add lightweight chart library: chart.js or pure CSS donut

#### Implementation Steps
1. Choose implementation:
   - **Option A:** chart.js library (easier, 30KB gzipped)
   - **Option B:** CSS-only SVG donut (no dependencies, lighter)
2. Create donut chart component:
   - Center: Percentage text (large, bold)
   - Ring: Progress fill (green portion)
   - Radius: ~80-100px
3. Add to course page header (right side or center)
4. Animation: Progress fills on page load (0% → target%)
5. Responsive: Smaller size on mobile

#### Acceptance Criteria
- [ ] Course page shows donut chart with progress percentage
- [ ] Chart animates on page load (smooth fill)
- [ ] Center text shows percentage (e.g., "65%")
- [ ] Color matches design system (green for completed portion)
- [ ] Mobile: Chart scales down proportionally

#### Testing
- [ ] Visual test: Compare with Brightspace/Coursera donut charts
- [ ] Animation test: Verify smooth fill (not janky)
- [ ] Edge case: 0% progress (empty ring with 0%)
- [ ] Edge case: 100% progress (full green ring)
- [ ] Performance: Chart.js bundle size acceptable (<50KB)

---

### TASK 2.2: Collapse/Expand Course Navigation
**Priority:** MEDIUM
**Status:** TODO
**Sprint:** 2
**Effort:** 1 day
**Dependencies:** TASK 1.1 (navigation structure)
**Assigned:** Developer 2

#### Description
Add collapse/expand functionality to modules in navigation tree. Best practice (Moodle 4.0, Canvas): Student can collapse completed modules to focus on current work. Currently navigation is flat/static.

#### Files to Modify
- `D:\B3\LMS\proto/modules/student.js` (add expand/collapse logic)
- `D:\B3\LMS\proto/styles.css` (collapsed state styles)

#### Implementation Steps
1. Add expand/collapse icon next to module names (▼/▶)
2. Track expand state per module (localStorage)
3. CSS transition for smooth expand/collapse (max-height animation)
4. Default state: Current module expanded, others collapsed
5. Keyboard support: Arrow keys or Enter to toggle
6. ARIA: `aria-expanded="true/false"` on expandable items

#### Acceptance Criteria
- [ ] Each module has expand/collapse icon
- [ ] Click icon toggles module visibility
- [ ] State persists on page reload
- [ ] Smooth animation (not instant show/hide)
- [ ] Keyboard accessible (Enter to toggle)

#### Testing
- [ ] Manual test: Collapse/expand 5 modules, verify state
- [ ] State persistence: Refresh page, verify state restored
- [ ] Animation test: Verify smooth transition (no janky layout shift)
- [ ] Keyboard test: Tab to icon, press Enter, verify toggle
- [ ] Mobile test: Icon touch target ≥44x44px

---

### TASK 2.3: Font Size Adjustability (Zoom Support)
**Priority:** MEDIUM
**Status:** TODO
**Sprint:** 2
**Effort:** 2 days
**Dependencies:** None
**Assigned:** Developer 2

#### Description
Fix layout overflow issues at 200% zoom. WCAG 2.1 AA requirement: Layout works at 200% browser zoom without horizontal scrolling. Gap analysis notes "minor overflow issues" exist.

#### Files to Modify
- `D:\B3\LMS\proto/styles.css` (fix hardcoded widths, add responsive units)
- All module files (audit for fixed-width elements)

#### Implementation Steps
1. Use relative units everywhere:
   - Replace `px` with `rem` for font sizes
   - Replace fixed widths with `max-width` or `%`
2. Test at 200% zoom (Ctrl/Cmd + +):
   - Identify horizontal scroll
   - Identify overlapping text
   - Identify cut-off buttons
3. Fix overflow issues:
   - Use `overflow-wrap: break-word` for long text
   - Use `flex-wrap: wrap` for button groups
   - Use media queries for <600px effective width
4. Test at 300% zoom (WCAG AAA, bonus)
5. Verify no functionality lost at high zoom

#### Acceptance Criteria
- [ ] Layout works at 200% zoom without horizontal scroll
- [ ] All text readable (not cut off)
- [ ] All buttons/links clickable (not overlapping)
- [ ] No broken layouts (cards stack properly)
- [ ] Tested in Chrome, Firefox, Edge

#### Testing
- [ ] Manual test: Set browser zoom to 200%, navigate prototype
- [ ] Edge case: Zoom to 300%, verify graceful degradation
- [ ] Viewport test: 1920px at 200% = 960px effective width
- [ ] Mobile test: Combine 200% zoom + mobile viewport (chaos test)
- [ ] Accessibility audit: Lighthouse reflow check

---

### TASK 2.4: Screen Reader Support (Completion)
**Priority:** HIGH
**Status:** TODO
**Sprint:** 2
**Effort:** 3 days (continuation from Sprint 1)
**Dependencies:** TASK 1.8 (Sprint 1 ARIA work)
**Assigned:** Developer 2

#### Description
Complete remaining ARIA attributes and screen reader support. Focus areas: forms, error messages, modals, dynamic updates.

#### Files to Modify
- `D:\B3\LMS\proto/modules/student.js` (form ARIA)
- `D:\B3\LMS\proto/modules/teacher.js` (table ARIA)
- All forms (add labels and error handling)

#### Implementation Steps
1. Form accessibility:
   - All inputs have `<label>` or `aria-label`
   - Error messages: `aria-invalid="true"` + `aria-describedby="error-id"`
   - Required fields: `aria-required="true"`
2. Modal accessibility:
   - Focus trap (Tab cycles within modal)
   - Esc closes modal
   - `role="dialog"` + `aria-modal="true"`
   - Focus returns to trigger button on close
3. Table accessibility (teacher dashboard):
   - `<th scope="col">` for column headers
   - `<caption>` for table description
4. Dynamic updates:
   - `aria-live="polite"` for status messages
   - Announce when assignments submitted/graded
5. Image alt text (any images in prototype)

#### Acceptance Criteria
- [ ] All forms fully accessible (labels, errors, required)
- [ ] Modals fully accessible (focus trap, Esc close)
- [ ] Tables announce headers correctly
- [ ] Dynamic updates announced to screen reader
- [ ] Lighthouse accessibility score ≥90

#### Testing
- [ ] Manual test: Navigate all forms with NVDA, verify error handling
- [ ] Modal test: Open modal, Tab cycles only within modal
- [ ] User test: 30-min session with blind user (if possible)
- [ ] Accessibility audit: Lighthouse + axe DevTools report
- [ ] Documentation: Final accessibility checklist for developers

---

### TASK 2.5: Teacher Assignment Review Workflow
**Priority:** HIGH
**Status:** TODO
**Sprint:** 2
**Effort:** 3 days
**Dependencies:** TASK 1.5 (teacher dashboard)
**Assigned:** Developer 1

#### Description
Create assignment review interface for teachers: view submissions, add comments, assign grades. Best practice (Canvas SpeedGrader): Efficient inline grading workflow. Current prototype: No grading interface for teachers.

#### Files to Modify
- `D:\B3\LMS\proto/modules/teacher.js` (add renderAssignmentReview function)
- `D:\B3\LMS\proto/modules/state.js` (add submission mock data)
- `D:\B3\LMS\proto/styles.css` (grading interface styles)

#### Implementation Steps
1. Add teacher view: "Assignments to grade" list
2. Click assignment → Review page:
   - Student name, submission date
   - Submitted content (text/file link)
   - Previous attempts (if multiple)
3. Grading form:
   - Points input (max points shown)
   - Feedback textarea
   - Status dropdown (Accepted/Needs revision/Resubmit)
   - Save button
4. Navigation: Prev/Next student buttons (like SpeedGrader)
5. Update mock data when grade saved (simulate backend)

#### Acceptance Criteria
- [ ] Teacher can view list of ungraded submissions
- [ ] Click submission opens review page
- [ ] Grading form has all required fields (points, feedback, status)
- [ ] Save updates submission status in mock data
- [ ] Prev/Next navigation works correctly

#### Testing
- [ ] Manual test: Grade 5 different submissions, verify data updates
- [ ] Edge case: Assignment with 0 submissions (show "No submissions")
- [ ] Edge case: Multiple attempts from same student (show history)
- [ ] UX test: Time how long it takes to grade 10 assignments (should be fast)
- [ ] Visual test: Compare with Canvas SpeedGrader for UX inspiration

---

### TASK 2.6: Notification System (Basic)
**Priority:** MEDIUM
**Status:** TODO
**Sprint:** 2
**Effort:** 2.5 days
**Dependencies:** None
**Assigned:** Developer 1

#### Description
Add in-app notification system for key events (assignment graded, new message, deadline reminder). Best practice (all platforms): Users notified of important updates without email spam.

#### Files to Modify
- `D:\B3\LMS\proto/modules/navigation.js` (notification bell icon)
- `D:\B3\LMS\proto/modules/state.js` (notification mock data)
- `D:\B3\LMS\proto/modules/helpers.js` (notification utility functions)
- `D:\B3\LMS\proto/styles.css` (notification dropdown styles)

#### Implementation Steps
1. Add notification bell icon to header (top-right)
2. Add unread count badge on icon
3. Click bell → Dropdown with notification list:
   - Icon (type indicator)
   - Title (e.g., "Assignment graded")
   - Timestamp (e.g., "2 hours ago")
   - Link to relevant page
4. Mark as read on click
5. Mock data: Create 10 sample notifications
6. Types: grade_received, message_received, deadline_reminder, course_started

#### Acceptance Criteria
- [ ] Notification bell visible in header
- [ ] Unread count badge shows correct number
- [ ] Dropdown shows list of notifications (newest first)
- [ ] Click notification navigates to relevant page
- [ ] Notifications marked read on click
- [ ] Mobile-friendly dropdown (doesn't overflow)

#### Testing
- [ ] Manual test: Click bell, verify dropdown opens
- [ ] Navigation test: Click 5 different notification types, verify correct pages
- [ ] Mark read test: Click notification, verify badge count decreases
- [ ] Edge case: 0 notifications (show "No new notifications")
- [ ] Mobile test: Dropdown positioned correctly on narrow screen

---

## Sprint 3: Polish & Validation (5 days, 2 developers)

**Goal:** Final polish, user testing, documentation, bug fixes

**Why Polish Last:**
- Core functionality complete (90% compliance)
- User feedback informs final adjustments
- Buffer for unexpected issues

---

### TASK 3.1: User Testing & Feedback Incorporation
**Priority:** HIGH
**Status:** TODO
**Sprint:** 3
**Effort:** 3 days
**Dependencies:** All Sprint 0-2 tasks
**Assigned:** Both developers + UX lead

#### Description
Conduct user testing sessions with 5 representative users (2 students, 2 teachers, 1 admin). Identify pain points, collect feedback, prioritize and fix top 5 issues.

#### Implementation Steps
1. Recruit 5 testers (internal team or friendly users)
2. Prepare test script:
   - Scenario 1: Student enrolls in course, completes assignment
   - Scenario 2: Teacher reviews submissions, grades assignment
   - Scenario 3: Admin views progress reports
3. Conduct 30-min sessions (record screen + audio if possible)
4. Analyze feedback:
   - Common pain points (mentioned by 3+ users)
   - Usability issues (task failures)
   - Visual design feedback
5. Prioritize top 5 issues (quick wins + high impact)
6. Fix issues (1-2 days implementation)

#### Acceptance Criteria
- [ ] 5 user testing sessions completed
- [ ] Feedback documented in structured format
- [ ] Top 5 issues identified and prioritized
- [ ] Top 5 issues fixed and verified
- [ ] Test report created (findings + fixes)

#### Testing
- [ ] Post-fix validation: Retest critical scenarios
- [ ] User satisfaction: Ask testers "Would you use this?" (yes/no)
- [ ] Regression: Verify fixes didn't break existing features
- [ ] Documentation: Update implementation plan with lessons learned

---

### TASK 3.2: Visual Design Polish
**Priority:** MEDIUM
**Status:** TODO
**Sprint:** 3
**Effort:** 1.5 days
**Dependencies:** TASK 3.1 (user feedback)
**Assigned:** Developer 2

#### Description
Final visual polish pass based on user feedback and design system audit. Fix inconsistencies, improve spacing, ensure professional appearance.

#### Files to Modify
- `D:\B3\LMS\proto/styles.css` (refinements)
- All module files (minor HTML adjustments)

#### Implementation Steps
1. Design system audit:
   - Color consistency (all blues same shade)
   - Spacing consistency (8px grid system)
   - Typography consistency (font sizes, weights)
   - Button styles consistent
2. Spacing improvements:
   - Add whitespace between dense sections
   - Consistent padding (cards, forms)
   - Alignment fixes (center vs left)
3. Microinteractions:
   - Hover states (buttons, links)
   - Transition animations (smooth, not instant)
   - Loading states (spinners for async actions)
4. Mobile polish:
   - Touch targets verified
   - Text readability on small screens
   - Navigation smooth on mobile

#### Acceptance Criteria
- [ ] All colors match design system palette
- [ ] Spacing follows 8px grid system
- [ ] All interactive elements have hover/focus states
- [ ] Smooth animations (no janky transitions)
- [ ] Mobile experience polished (tested on real device)

#### Testing
- [ ] Visual regression: Compare before/after screenshots
- [ ] Design review: Show to designer/stakeholder for approval
- [ ] Cross-browser: Test in Chrome, Firefox, Safari, Edge
- [ ] Mobile device: Test on iPhone and Android phone
- [ ] Performance: No animation jank (60fps maintained)

---

### TASK 3.3: Documentation & Handoff
**Priority:** MEDIUM
**Status:** TODO
**Sprint:** 3
**Effort:** 1.5 days
**Dependencies:** All Sprint 0-2 tasks
**Assigned:** Developer 1

#### Description
Create documentation for stakeholders and B3 implementation team. Includes UX patterns, component guide, accessibility checklist, and migration notes.

#### Deliverables
1. **Stakeholder Demo Guide** (15 min presentation)
   - Key features demonstrated
   - User journeys walkthrough
   - What's NOT in prototype (backend, real data)
2. **UX Pattern Library** (Markdown doc)
   - Dashboard pattern (reference: Coursera)
   - Course navigation pattern (reference: Moodle 4.0)
   - Progress tracking pattern (reference: Brightspace)
   - Screenshots with annotations
3. **Accessibility Checklist** (PDF/Markdown)
   - WCAG 2.1 AA compliance status (checklist)
   - Keyboard navigation guide
   - Screen reader testing notes
4. **B3 Implementation Notes** (Markdown doc)
   - Prototype → B3 mapping (HTML → Dashboard Builder)
   - Mock data → B3 Data Model (entities, fields)
   - BPMN process sketches (workflows to implement)

#### Acceptance Criteria
- [ ] Stakeholder demo guide created (PowerPoint or Markdown)
- [ ] UX pattern library documented with screenshots
- [ ] Accessibility checklist complete
- [ ] B3 implementation notes ready for dev team
- [ ] All docs reviewed by tech lead

#### Testing
- [ ] Dry run: Present demo guide to team, collect feedback
- [ ] Documentation review: Tech lead approves content
- [ ] Handoff meeting: Present to B3 implementation team
- [ ] Archive: Save final prototype + docs to repository

---

## Detailed Task Breakdown Summary

### Sprint 0 Tasks (Quick Wins)
1. **0.1 Course Completion Text** - 0.5d - Add "X/Y items completed" text
2. **0.2 Deadline Color Thresholds** - 0.5d - Fix green/orange/red thresholds
3. **0.3 Actionable Deadlines** - 0.5d - Add "Go to assignment" buttons
4. **0.4 Current Position Highlight** - 0.5d - CSS active state in navigation
5. **0.5 What's Next Indicator** - 0.5d - Add next action text prompt
6. **0.6 Touch Target Audit** - 0.5d - Ensure all buttons ≥44x44px
7. **0.7 Template-Instance Mock Data** - 1.0d - Refactor to align with architecture
8. **0.8 Dashboard Widget Reduction** - 0.5d - Collapse secondary widgets

**Total Sprint 0:** 4.5 days → **62% UX Compliance**

---

### Sprint 1 Tasks (Critical Gaps)
1. **1.1 Completion Indicators** - 3d - Add ✓/⏸/○ icons to navigation (Dev 2)
2. **1.2 Course Index Persistence** - 2d - Sticky left panel navigation (Dev 2)
3. **1.3 Progress by Module** - 2d - Module-level breakdown (Dev 1)
4. **1.4 Progress by Activity Type** - 2d - Content/Assignments/Quizzes (Dev 1)
5. **1.5 Teacher Progress Dashboard** - 5d - Students × Progress matrix (Dev 1)
6. **1.6 Risk-Level Color Coding** - 2d - Green/Yellow/Red indicators (Dev 1)
7. **1.7 Keyboard Navigation** - 3d - Full Tab/Enter/Esc support (Dev 2)
8. **1.8 Screen Reader (Partial)** - 5d - Critical ARIA attributes (Dev 2)

**Total Sprint 1:** 10 days (with parallelization) → **80% UX Compliance**

---

### Sprint 2 Tasks (High Priority)
1. **2.1 Donut Chart** - 1.5d - Replace linear bar with donut (Dev 1)
2. **2.2 Collapse/Expand Nav** - 1d - Collapsible modules (Dev 2)
3. **2.3 Font Size Adjustability** - 2d - Fix 200% zoom issues (Dev 2)
4. **2.4 Screen Reader (Complete)** - 3d - Remaining ARIA + forms (Dev 2)
5. **2.5 Teacher Grading UI** - 3d - Assignment review workflow (Dev 1)
6. **2.6 Notification System** - 2.5d - In-app notifications (Dev 1)

**Total Sprint 2:** 10 days (with parallelization) → **90% UX Compliance**

---

### Sprint 3 Tasks (Polish)
1. **3.1 User Testing** - 3d - 5 sessions + top 5 fixes (Both devs)
2. **3.2 Visual Polish** - 1.5d - Final design refinements (Dev 2)
3. **3.3 Documentation** - 1.5d - Stakeholder guides + B3 notes (Dev 1)

**Total Sprint 3:** 5 days → **95% UX Compliance**

---

## Risk Management

### High-Risk Items

**Risk 1: User Testing Reveals Major Usability Issues**
- **Likelihood:** Medium
- **Impact:** High (could require significant rework)
- **Mitigation:** Conduct informal testing throughout Sprints 0-2, not just Sprint 3
- **Buffer:** Sprint 3 has 2 days buffer for fixes

**Risk 2: Screen Reader Implementation More Complex Than Expected**
- **Likelihood:** Medium
- **Impact:** Medium (TASK 1.8 + 2.4 might overflow)
- **Mitigation:** Split ARIA work into critical (Sprint 1) and nice-to-have (Sprint 2)
- **Fallback:** Deprioritize advanced ARIA (modals, live regions) to v2.0 if time-constrained

**Risk 3: Developer Availability (Illness, Other Priorities)**
- **Likelihood:** Low
- **Impact:** High (delays entire plan)
- **Mitigation:** Cross-train developers on both tracks (Progress/Teacher vs Nav/A11y)
- **Buffer:** 4.5-day Sprint 0 can absorb 1-day delay without affecting timeline

**Risk 4: Stakeholder Requests Scope Changes During Sprints**
- **Likelihood:** Medium
- **Impact:** Medium (could derail priorities)
- **Mitigation:** Lock scope after Sprint 0 demo. Collect feedback but defer to v2.0
- **Process:** Weekly stakeholder sync (15 min) to show progress, not collect new requirements

---

## Success Metrics

### Quantitative Metrics

**UX Compliance:**
- Target: 90%+ (26/29 items) by end of Sprint 2
- Stretch: 95%+ (28/29 items) by end of Sprint 3

**Accessibility:**
- Lighthouse Accessibility Score: ≥90
- WCAG 2.1 AA Critical Violations: 0
- Keyboard Navigation: 100% of features accessible

**Performance:**
- Page Load Time: <2s on 3G connection
- Time to Interactive: <3s
- No layout thrashing on scroll (60fps maintained)

**Code Quality:**
- No console errors in production build
- No broken links (all navigation functional)
- Cross-browser compatibility: Chrome, Firefox, Safari, Edge

### Qualitative Metrics

**User Satisfaction (from TASK 3.1 testing):**
- "Would you use this system?" → Target: 5/5 say yes
- "Did you complete the task easily?" → Target: 4/5 complete without help
- "Does this look professional?" → Target: 5/5 say yes

**Stakeholder Readiness:**
- Stakeholder can demo prototype to customers (confidence level)
- B3 implementation team understands architecture (handoff successful)
- No major UX concerns raised in validation meeting

---

## Dependencies & Prerequisites

### External Dependencies

**Design Assets:**
- Logo files (SVG preferred)
- Brand color palette (hex codes)
- Font files (if custom fonts, otherwise use system fonts)

**Reference Access:**
- Canvas LMS demo account (for UX comparison)
- Coursera course (for progress tracking patterns)
- Moodle 4.0 demo (for Course Index reference)

**Testing Resources:**
- Screen reader software (NVDA for Windows, VoiceOver for Mac)
- Mobile devices for testing (1 iOS, 1 Android)
- Lighthouse/axe DevTools browser extensions

### Technical Prerequisites

**Development Environment:**
- Node.js (if using build tools)
- Git (version control)
- Modern browser with DevTools (Chrome/Firefox)
- Code editor (VS Code recommended)

**Prototype Infrastructure:**
- GitHub Pages or local web server
- Mock data in `state.js` (already exists)
- No backend required (static prototype)

---

## Handoff Checklist (End of Sprint 3)

**Deliverables:**
- [ ] Prototype live URL (GitHub Pages: `https://[org].github.io/lms/proto/`)
- [ ] Source code repository (with README.md)
- [ ] Stakeholder demo guide (PowerPoint or Markdown)
- [ ] UX pattern library (documented patterns with screenshots)
- [ ] Accessibility checklist (WCAG 2.1 AA compliance status)
- [ ] B3 implementation notes (prototype → B3 mapping)
- [ ] Known issues log (minor bugs to fix in B3 implementation)
- [ ] User testing report (findings + fixes from TASK 3.1)

**Sign-off Requirements:**
- [ ] Tech lead approval (code quality, architecture)
- [ ] UX designer approval (visual design, patterns)
- [ ] Product owner approval (feature completeness)
- [ ] Stakeholder demo successful (no blockers)

**Next Steps:**
- [ ] Schedule B3 implementation kickoff (Phase 1: Data Model)
- [ ] Archive prototype (tag release v1.0 in Git)
- [ ] Celebrate! 🎉

---

## Appendix A: File Structure Reference

```
D:\B3\LMS\proto\
├── index-modular.html          # Main prototype page
├── styles.css                  # Global styles
├── modules/
│   ├── state.js               # Mock data (courses, assignments, users)
│   ├── navigation.js          # Header, menu, user dropdown
│   ├── student.js             # Student dashboard, course view
│   ├── teacher.js             # Teacher dashboard, grading
│   ├── admin.js               # Admin views (future)
│   ├── guest.js               # Public catalog (future)
│   ├── methodist.js           # Course authoring (future)
│   └── helpers.js             # Utility functions
└── assets/                     # Images, fonts, icons
```

**Key Files for Implementation:**
- **TASK 0.1-0.5, 1.3-1.4:** `modules/student.js` (main work area)
- **TASK 1.1-1.2, 1.7-1.8:** `modules/student.js` + navigation
- **TASK 1.5-1.6, 2.5:** `modules/teacher.js` (teacher dashboard)
- **TASK 0.7:** `modules/state.js` (mock data refactor)
- **All tasks:** `styles.css` (styling updates)

---

## Appendix B: Best Practice References

**UX Patterns:**
- **Coursera Progress Tracking:** https://www.coursera.org (after login, "My Courses")
- **Canvas Dashboard:** https://canvas.instructure.com/courses (after login)
- **Moodle 4.0 Course Index:** https://moodle.org/demo (Moodle 4.0+ courses)
- **Brightspace Class Progress:** https://www.d2l.com (demo videos on YouTube)

**Accessibility:**
- **WCAG 2.1 Quick Reference:** https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker:** https://webaim.org/resources/contrastchecker/
- **Lighthouse Accessibility Audit:** Chrome DevTools > Lighthouse > Accessibility

**Color Palette (from gap analysis):**
- Primary Blue: #0374B5 (Canvas-inspired)
- Success Green: #00AC18
- Warning Orange: #FC5E13
- Danger Red: #EE0612
- Neutral Gray: #2D3B45 (text), #F5F5F5 (background)

---

## Appendix C: Glossary

**Terms used in this plan:**

- **UX Compliance:** Percentage of 29 Must-Have UX items (from gap analysis) implemented
- **Critical Gap:** Blocking issue preventing stakeholder validation (P0 priority)
- **Quick Win:** Low-effort (<1 day), high-visibility improvement
- **WCAG 2.1 AA:** Web Content Accessibility Guidelines, Level AA (legal standard)
- **ARIA:** Accessible Rich Internet Applications (attributes for screen readers)
- **Template-Instance Pattern:** Architecture where course template (master) spawns course instances (with dates/students)
- **Donut Chart:** Circular progress chart (vs linear bar)
- **Focus Indicator:** Visual highlight showing which element has keyboard focus
- **Touch Target:** Minimum size for tap-friendly buttons (44x44px WCAG guideline)

---

**END OF IMPLEMENTATION PLAN**

**Next Action:** Review with team, assign developers, begin Sprint 0 TASK 0.1

**Questions?** Contact architect or refer to:
- Gap Analysis: `04_gap_analysis_v2.md`
- Best Practices: `00_best_practices_summary.md`
- Architecture: `Tasks/init/gpt_design.md`
