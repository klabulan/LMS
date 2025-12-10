# User Flows v1 - Critical Critique

## Document Information
- **Version**: Critique of v1
- **Date**: 2025-12-09
- **Critic**: Orchestrator (following b3-architect principles)
- **Purpose**: Brutal self-roast to identify weaknesses before presenting to user

---

## Overall Assessment

**Strengths**:
- ✅ Comprehensive coverage of all 5 required flows
- ✅ Detailed step-by-step breakdowns with UI states, data changes, and system actions
- ✅ Good alignment with reference patterns (Canvas, Coursera, etc.)
- ✅ Clear status transitions and state diagrams
- ✅ Covers edge cases and alternative paths

**Weaknesses** (Critical Issues):
- ⚠️ **OVER-ENGINEERED**: Too much detail for initial design document
- ⚠️ **B3 ASSUMPTIONS**: Makes assumptions about platform capabilities not verified
- ⚠️ **MISSING SIMPLIFICATIONS**: Some flows could be 50% simpler
- ⚠️ **NOTIFICATION OVERLOAD**: Too many emails will annoy users
- ⚠️ **REAL-TIME FEATURES**: Proposes features B3 may not support out-of-box

---

## Detailed Critique by Flow

### 1. Guest to Student Registration Flow

#### ❌ OVER-COMPLEXITY
**Issue**: 11 steps for what should be 5-6 steps maximum

**Problem Areas**:
- Step 2 (Browse Catalog): Too detailed filter specifications
  - Reality: MVP should have simple search + level filter only
  - 3-column grid, sort options = nice-to-have, not MVP
- Step 3 (Course Details): Tab interface (Описание | Программа | Преподаватель)
  - Reality: Single scrollable page sufficient for 1-6 courses
  - Tabs add complexity for minimal benefit

**Recommendation**:
- Merge Steps 1-3 into "Browse and Select Course" (single step)
- Registration form (Step 5) is fine but could reduce optional fields

---

#### ⚠️ B3 CAPABILITY ASSUMPTIONS

**Issue**: Assumes B3 has out-of-box features without verification

**Specific Cases**:
1. **Real-time email uniqueness check** (Step 5):
   - "Email: format + uniqueness check (real-time)"
   - **Question**: Does B3 validator support async API calls for uniqueness?
   - **Fallback**: Server-side validation on submit (slower but guaranteed)

2. **Inline validation "on blur"** (Step 5):
   - May require custom JavaScript
   - **Alternative**: Validate on form submit only

3. **Drag-and-drop file upload with progress bars** (mentioned in student flow):
   - B3 forms may have basic file upload, but DnD + progress = custom code
   - **Alternative**: Standard file input field

4. **Auto-save every 30 seconds** (Student Flow Step 4):
   - Requires background JavaScript timers
   - **Question**: Does B3 support this or need custom code?
   - **Alternative**: Manual "Save Draft" button only

**Action Needed**: Verify each UI pattern against actual B3 form capabilities

---

#### 🔴 NOTIFICATION SPAM

**Issue**: Too many emails will desensitize users

**Email Count in Single Flow**:
- Step 6: Email to user (registration received)
- Step 6: Email to admin (new application)
- Step 9: Email to user (approved)
- Step 10: Separate notification email (redundant with Step 9)

**Problem**: Steps 9 and 10 send duplicate notifications

**Recommendation**:
- **Combine**: Send single "approval" email in Step 9
- **Remove**: Separate notification in Step 10 (redundant)
- **Add**: In-app notification as primary, email as fallback (for urgent only)

**Better Pattern**:
- Critical: Email immediately (approval, rejection, grade)
- Informational: In-app only (drafts saved, progress updates)
- Digest: Daily summary email (all pending notifications)

---

#### 🤔 MISSING: GUEST TRIAL ACCESS

**Gap**: User must register before seeing ANY course content

**Reference Platforms**:
- Coursera: Preview lessons available
- Udemy: First 2 videos often free
- Canvas: Public course catalog with sample materials

**Suggestion**:
- Add "Предпросмотр" (Preview) option in Step 3
- Show first lecture or demo video without login
- Increases conversion (user sees value before committing)

**Implementation**:
- `Шаблон задания`: Add field `is_preview=true`
- Public access to preview assignments
- Minimal change, high ROI

---

### 2. Methodist Course Design Flow

#### ✅ GOOD STRUCTURE
- Wizard approach (4 steps) is appropriate
- Clear separation: Info → Assignments → Grading → Publish

#### ⚠️ ASSIGNMENT TEMPLATE OVER-ENGINEERING

**Issue**: Step 3 assignment creation modal is TOO complex

**Current Fields**:
- Name, type, order, required (OK)
- Description, materials, links (OK)
- Max score, criteria, attempts (OK)
- **Auto-grading checkbox** ← FUTURE FEATURE, remove from MVP

**Simplification**:
- Remove "auto-grading" (not MVP)
- Remove "количество попыток" (add later, default=unlimited for MVP)
- Grading criteria can be simple textarea (not rich text initially)

**Why**: Simpler form = faster course creation = methodist gets value sooner

---

#### 🔴 DRAG-TO-REORDER ASSUMPTION

**Issue**: "Can drag to reorder (updates `order_num`)" (Step 3)

**Question**: Does B3 list forms support drag-and-drop reordering?
**Likely Answer**: No, requires custom JavaScript library

**Alternative**:
- Manual `order_num` input field (up/down arrows)
- Or: [Move Up] [Move Down] buttons per row
- Less elegant but 100% B3-native

**Action**: Verify B3 list capabilities, plan fallback

---

#### 🤔 MISSING: BULK ASSIGNMENT IMPORT

**Gap**: Methodist creates 10-15 assignments one-by-one = tedious

**Suggestion**:
- Add Step 2.5: "Импорт заданий из Excel/CSV"
- Columns: Title, Type, Description, Max Score, Order
- Methodist exports template, fills Excel, uploads
- System bulk creates `Шаблон задания` records

**Benefit**: Scales better for large courses (20+ assignments)
**Complexity**: Medium (CSV parsing + validation)
**Decision**: Nice-to-have, document as "Phase 2 feature"

---

### 3. Admin Course Launch Flow

#### ✅ SOLID FLOW
- Clear steps: Select template → Configure instance → Manage enrollments
- Approval workflow well-defined

#### 🔴 CREDENTIAL PROVISIONING OVER-SPECIFIED

**Issue**: Step 9 "Generate Student Credentials" assumes external sandbox API

**Current Design**:
```
POST /api/sandbox/provision
Response: { url, login, password }
```

**Problems**:
1. External API = integration complexity
2. What if sandbox not ready? Flow blocks
3. Credential encryption/storage = security burden

**Simplification for MVP**:
- **Option 1**: Manual credentials
  - Admin enters sandbox URL, login, pass in form
  - Store in `Запись на курс.credentials` JSON field
  - No API calls, no automation
  - Works for 1-10 students

- **Option 2**: Defer to course materials
  - Include credentials in course description or first assignment
  - All students use shared sandbox initially
  - Upgrade to per-student sandboxes in Phase 2

**Recommendation**: Start with Option 1 (manual), automate later

---

#### ⚠️ BULK OPERATIONS COMPLEXITY

**Issue**: Step 6 mentions "Bulk actions: Checkboxes, [Одобрить выбранные]"

**Question**: Does B3 list forms support:
- Row checkboxes (multi-select)?
- Bulk action buttons?

**Likely**: Requires custom code or B3 plugins

**Alternative**:
- Process one-by-one (sufficient for MVP with <50 applications)
- Admin can rapid-click [Одобрить] on each row
- Add bulk later when volume increases

**Decision**: Document as Phase 2, keep v1 simple

---

#### 🤔 MISSING: ENROLLMENT CAPACITY PLANNING

**Gap**: No discussion of "wait list" if course full

**Current**: Step 8 mentions `max_students` check, but only shows error

**Enhancement**:
- If course full → Automatically create "Лист ожидания" (Wait List)
- When spot opens (withdrawal) → Notify next person on list
- Student can join multiple wait lists

**Complexity**: Medium (queue management)
**Decision**: Document as future feature, v1 = simple reject if full

---

### 4. Student Learning Flow

#### ❌ MOST OVER-ENGINEERED FLOW

**Issue**: 12 steps with excessive UI detail

**Specific Problems**:

1. **Step 1 (Dashboard) - Too Many Sections**:
   - "Мои курсы" (OK)
   - "Ближайшие задания" (Nice-to-have)
   - "Сообщения" (Nice-to-have)
   - "Мои сертификаты" (OK)
   - **Reality**: MVP needs only "Мои курсы" + simple nav bar
   - **Cut**: Ближайшие задания → show inside course page instead

2. **Step 3 (Assignment Page) - Feature Bloat**:
   - Left sidebar with assignment tree (OK)
   - Main content (OK)
   - Submission history (Phase 2)
   - **Communication section at bottom** ← SHOULD BE SEPARATE TAB
   - Grading criteria collapsible (Keep)
   - **Cut**: Move communication to separate "Вопросы" tab

3. **Step 4 (Auto-Save)**:
   - "Auto-saves to local storage every 30 sec"
   - "Background save every 2 minutes if content changed"
   - **Problem**: Assumes localStorage + timers work in B3 forms
   - **Alternative**: Single [Сохранить черновик] button
   - **Keep it simple**

4. **Step 8 (Feedback View) - Status Banners**:
   - Emoji + colored backgrounds (🎉, ⚠️)
   - **Reality**: B3 may not support emoji in status badges
   - **Alternative**: Text-only: "Принято" (green), "Доработка" (yellow)

---

#### 🔴 QUIZ/TEST INTERFACE NOT DEFINED

**Issue**: Step 3 mentions "For Тест: [Начать тест] button"

**Gap**: No detail on:
- Quiz question types (multiple choice, true/false, essay?)
- Timer implementation
- Auto-grading logic
- Question randomization

**Problem**: Quiz is complex feature, can't assume B3 has it

**Options**:
1. **Use B3 Onboarding Module**: May have built-in quiz capability
2. **Manual quiz**: PDF with questions, student submits answers as text
3. **External tool**: Integrate Google Forms / Typeform (iframe)

**Recommendation**:
- MVP: Manual quiz (assignments type="Тест", student submits text answers)
- Phase 2: Build proper quiz engine or integrate external tool

**Action**: Document quiz as "manual" in v2, defer automation

---

#### 🤔 MISSING: PROGRESS PERSISTENCE ACROSS DEVICES

**Gap**: No mention of syncing draft between desktop/mobile

**Question**: If student starts assignment on desktop, switches to mobile, does draft carry over?

**Answer Depends On**:
- If using B3 form auto-save → Yes, server-side
- If using localStorage → No, device-specific

**Recommendation**: Ensure draft stored in `Экземпляр задания.draft_content` (server-side), not localStorage

---

### 5. Teacher Teaching Flow

#### ✅ STRONG FLOW
- Gradebook matrix view = excellent (matches Canvas/Brightspace)
- Grading modal = well-designed

#### ⚠️ SPEEDGRADER AUTO-ADVANCE

**Issue**: Step 6 mentions "Auto-advance to next pending assignment"

**Question**: Does B3 modal support dynamic content reload without page refresh?

**Likely**: No, would need custom AJAX/JavaScript

**Alternative**:
- After publishing grade, modal closes
- Teacher clicks next cell in gradebook
- Slightly more clicks, but B3-native

**Decision**: Keep auto-advance as "nice-to-have", not MVP requirement

---

#### 🔴 BATCH GRADING COMPLEXITY

**Issue**: Alternative path "Batch Grading" with checkboxes and common feedback

**Problem**: Requires multi-select UI + complex form logic

**Reality Check**:
- For 5-10 students/assignment: One-by-one grading is fine
- Batch grading ROI is low for small cohorts

**Recommendation**:
- **Remove** from v1 flows
- **Document** as Phase 2 feature for scaling

---

#### 🤔 MISSING: PLAGIARISM CHECK

**Gap**: No mention of plagiarism detection

**Reference Platforms**:
- Canvas integrates Turnitin
- Moodle has plagiarism plugins

**Suggestion**:
- Add field in grading modal: "Проверка на плагиат: [Run Check]"
- Integrates with external API (Antiplagiat.ru for RU market)
- Shows similarity score
- Teacher decides whether to reject

**Complexity**: High (external integration)
**Decision**: Document as Phase 3 feature, manual review for MVP

---

## Cross-Cutting Concerns

### 1. ⚠️ MOBILE RESPONSIVENESS

**Issue**: Document mentions "responsive design" but no mobile-specific flows

**Questions**:
- Does B3 auto-generate mobile views?
- Or need separate mobile UI design?
- Touch interactions (drag, swipe) different from desktop

**Action Needed**:
- Test B3 forms on mobile devices
- Document mobile-specific adaptations (collapsible sidebars, bottom sheets)

---

### 2. 🔴 PERFORMANCE AT SCALE

**Issue**: Gradebook matrix with 50 students × 15 assignments = 750 cells

**Potential Problem**:
- Loading all `Экземпляр задания` records at once = slow
- Browser rendering large tables = laggy

**Mitigation**:
- Pagination: 20 students per page
- Lazy loading: Load cell data on hover/click
- Indexes: On `enrollment_id`, `status`, `submitted_at`

**Action**: Document performance considerations in technical specs

---

### 3. 🤔 ACCESSIBILITY (WCAG)

**Gap**: Document mentions "WCAG compliance" in task spec, but flows don't address:
- Screen reader support (ARIA labels)
- Keyboard navigation (tab order, shortcuts)
- Color contrast (status badges readable for color-blind)
- Alt text for images

**Action**: Add accessibility checklist to wireframe stage

---

### 4. ⚠️ LOCALIZATION

**Issue**: All UI text in Russian, but `Шаблон курса` has `language` field (ru | en)

**Questions**:
- If course language=en, should UI switch to English?
- Or UI language separate from content language?
- Multi-language support in B3 forms?

**Recommendation**:
- MVP: Russian UI only (target audience = Russian users)
- Phase 2: i18n for UI if international expansion planned

---

## Simplification Opportunities

### 🔥 What Could Be 50% Simpler?

#### 1. Registration Flow
**Current**: 11 steps with catalog browsing, detailed forms
**Simplified**:
- Direct URL to course page (marketing sends link)
- Single registration form (email, name, password)
- Auto-approve (no admin review) for public courses
- **Result**: 4 steps instead of 11

**Trade-off**: Less control, but faster onboarding

---

#### 2. Assignment Submission
**Current**: Rich text editor, file upload, URL field, auto-save
**Simplified**:
- Single textarea (plain text)
- File upload (basic, no drag-drop)
- Manual [Save Draft] button
- **Result**: 80% functionality, 50% complexity

**Trade-off**: Less polish, but B3-native

---

#### 3. Gradebook
**Current**: Full matrix with sorting, filtering, color coding
**Simplified**:
- List view (not matrix): One row per pending assignment
- Columns: Student, Assignment, Date Submitted, [Grade] button
- No filters (or simple dropdown: Course, Status)
- **Result**: Easier to build, sufficient for <50 students

**Trade-off**: Less visual overview, but functional

---

## ROAST: What's Actually Wrong?

### 1. Document is a SPEC, not a FLOW

**Problem**: Reads like detailed technical specification, not user flow

**User Flow Should Be**:
- Narrative: "Student does X, sees Y, system responds Z"
- Visual: Include mockups or ASCII diagrams
- Concise: 1-2 pages per flow max

**This Document Is**:
- 9000+ words (way too long)
- Every field, button, validation documented (over-kill)
- No visuals (wall of text)

**Consequence**: User will skim, miss key points

**Fix for v2**:
- Cut 50% of detail (move to separate UI specs)
- Add diagrams (state machines, sequence diagrams)
- Focus on user GOALS and PAIN POINTS, not implementation

---

### 2. Assumes B3 is Magic

**Problem**: Proposes features without verifying B3 can do them

**Examples**:
- Drag-drop reordering
- Real-time validation
- Auto-save
- Batch operations
- Rich text editors
- File preview
- Chart widgets

**Reality**: B3 is low-code platform, not full-stack framework

**Correct Approach**:
1. List desired features
2. Check B3 docs / ask support: "Does B3 have X?"
3. If yes: Use native. If no: Document as custom code.
4. Provide fallback (simpler B3-native alternative)

**Fix for v2**: Add "B3 Capability Verification" section per flow

---

### 3. Ignores KISS Principle

**Problem**: "Feature creep" in every flow

**Examples**:
- Dashboard has 4 sections (2 sufficient)
- Assignment page has 5 sub-sections (3 sufficient)
- Notifications sent at 4 points (2 sufficient)

**KISS Would Say**:
- Start with minimal happy path
- Add features based on user feedback (not speculation)
- Every feature = maintenance burden

**Fix for v2**: Mark features as "MVP" vs "Phase 2" vs "Nice-to-have"

---

### 4. Missing User Validation

**Problem**: Flows based on reference platforms (Canvas, Coursera), but no validation with actual target users

**Questions Not Answered**:
- Will Russian corporate users expect same UX as US students?
- Is approval workflow necessary? (Many LMSs allow auto-enroll)
- Do teachers want matrix gradebook or prefer list?

**Risk**: Build what we THINK users want, not what they ACTUALLY need

**Fix**: Document assumptions, plan user testing before build

---

## What Would BREAK This?

### Scenario 1: B3 Forms Can't Handle File Uploads >10MB
**Impact**: Students can't submit large lab reports, videos
**Flow Affected**: Student Learning Flow Step 4
**Mitigation**: Use external file hosting (Google Drive, Yandex.Disk), student pastes link

---

### Scenario 2: B3 BPMN Can't Send Emails (Only In-App Notifications)
**Impact**: Students miss critical updates (grade published, course starts)
**Flow Affected**: ALL flows with email notifications
**Mitigation**: Require students to check dashboard daily, add mobile push notifications

---

### Scenario 3: Admin Approves 50 Enrollments, System Times Out
**Impact**: Some students not enrolled, credentials not generated
**Flow Affected**: Admin Course Launch Flow Step 6
**Mitigation**: Async job queue for bulk enrollment, progress indicator for admin

---

### Scenario 4: Methodist Accidentally Deletes Assignment Template
**Impact**: All student assignment instances lose reference, data orphaned
**Flow Affected**: Methodist Course Design Flow Step 7
**Mitigation**: Soft delete (archive) instead of hard delete, require confirmation + reason

---

### Scenario 5: Two Teachers Grade Same Assignment Simultaneously
**Impact**: Second teacher's grade overwrites first, confusion
**Flow Affected**: Teacher Teaching Flow Step 5
**Mitigation**: Optimistic locking (check `updated_at` timestamp before save), show warning if conflict

---

## Final Verdict

### Should This Be Presented to User?

**NO - Not in current form.**

**Reasons**:
1. Too long (needs 50% cut)
2. Too detailed (implementation details should be separate docs)
3. Unverified assumptions (B3 capabilities not confirmed)
4. Missing visuals (diagrams, mockups)
5. Feature scope too large (MVP vs Phase 2 not clear)

**What User Needs**:
- **Summary document**: 2-3 pages, high-level flow overview
- **Key decisions**: What's included in MVP, what's deferred
- **Open questions**: What needs verification before build
- **Visual aids**: State diagrams, example screens

---

## Recommended Revisions for v2

### 1. Structure Changes
- **Split document**:
  - `05b_user_flows_summary.md` (3 pages, narrative)
  - `05c_user_flows_detailed.md` (current doc, reference only)
- **Add diagrams**: Mermaid state machines for each status lifecycle
- **Add mockups**: ASCII wireframes or links to Figma/Sketch

### 2. Content Changes
- **Mark scope**: [MVP], [Phase 2], [Nice-to-have] tags on every feature
- **Add verification**: "✓ Verified B3 can do this" or "? Needs checking"
- **Simplify**: Remove 50% of UI field descriptions (link to UI spec instead)

### 3. New Sections
- **Assumptions & Risks**: List what could go wrong
- **Open Questions**: What needs answering before build
- **Success Metrics**: How to measure if flows work (completion rate, time-to-complete)

### 4. Tone Changes
- **Less prescriptive**: "Proposed flow" vs "The flow must be"
- **More questioning**: "Should we...?" vs "We will..."
- **User-centric**: Focus on goals ("Student wants to learn") vs features ("System has auto-save")

---

## Self-Roast Score: 6/10

**Good**:
- Comprehensive coverage ✓
- Clear step-by-step structure ✓
- Considers edge cases ✓

**Bad**:
- Over-engineered for MVP ✗
- Makes unverified B3 assumptions ✗
- Too long, lacks visuals ✗
- Doesn't clearly separate MVP from future ✗

**Needs Major Revision Before User Presentation**

---

## Next Steps

1. Create `05c_user_flows_v2.md` with:
   - 50% shorter
   - MVP scope only
   - Verified B3 capabilities
   - Diagrams included
   - Clear assumptions documented

2. Prepare questions for B3 platform validation:
   - File upload limits?
   - Form field types (rich text editor available?)
   - List view features (sorting, filtering, bulk actions)?
   - BPMN email sending?
   - Dashboard widget types?

3. Plan user validation:
   - Show flows to 2-3 potential students/teachers
   - Ask: "Does this match your expectations?"
   - Adjust based on feedback

---

**Critique Complete. Ready to revise.**
