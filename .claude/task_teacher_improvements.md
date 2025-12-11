# Teacher Interface Improvements

## Context
File: proto/modules/teacher.js (2074 lines)
Need to implement 7 UI/UX improvements for teacher workspace.

## Tasks

### 1. Terminology: "курсы" → "группы"
- Replace all mentions of "курс"/"курсы" referring to course INSTANCES
- Keep: "Шаблон курса", "содержание курса" (template context)
- Change: "Мои курсы" → "Мои группы", "курс началась" → "группа началась"

### 2. Default tab to "Прогресс группы"
- Variable `teacherCourseTab` already defaults to 'progress' (line 5)
- Verify it works correctly in renderTeacherCourseDetail()

### 3. Remove assignment counter badge
- Find navigation item "📝 Задания" (around line 325-329)
- Remove any badge showing pending count

### 4. Student detail modal from progress matrix
- In renderClassProgressTab() - make student name clickable
- On click → open modal with ALL assignments for that student
- Columns: Задание | Статус | Оценка | Посещение
- Reuse existing student modal structure

### 5. Replace "Оценить" → "Перейти"
- Find all buttons with text "Оценить"
- Replace with "Перейти"

### 6. Assignment grading form
- Create new function renderAssignmentGradingView(assignmentInstanceId)
- Show:
  - Assignment info (as student sees it)
  - Student submission (read-only)
  - Grading fields (if status = 'under_review'):
    - Оценка (input, 0 to max_score)
    - Отзыв преподавателя (textarea)
    - Buttons: "Принять работу" / "Вернуть на доработку"
  - Navigation: "← Назад" button + breadcrumbs

### 7. Return navigation
- Use variable `returnToView` (line 8) or create `teacherReturnContext`
- Store context when navigating to grading form
- "← Назад" button returns to previous view

## Implementation Strategy
1. Search for all "курс" mentions - replace carefully
2. Check default tab (already set)
3. Find and remove badge from assignments nav
4. Add click handler to student names in progress matrix
5. Global search/replace "Оценить" → "Перейти"
6. Create renderAssignmentGradingView() function
7. Implement navigation context tracking
8. Add gradeAssignment() function to handle form submission

## Expected Output
- List of all changes made
- Confirmation of terminology updates
- Confirmation of default tab
- Confirmation of grading form with navigation
