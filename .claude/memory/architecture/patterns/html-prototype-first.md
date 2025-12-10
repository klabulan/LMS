# Pattern: HTML Prototype First

## Context

Early project phase where UX/UI validation is needed before committing to B3 implementation.

## Problem

How to validate complex LMS user experiences quickly without the overhead of full B3 configuration?

## Solution

Create a single-file HTML/CSS/JS prototype that:
1. Implements the complete UI with mock data
2. Supports role switching (student/teacher/admin)
3. Uses realistic sample data structures matching planned B3 entities
4. Demonstrates all key user flows

### Structure

```html
<!DOCTYPE html>
<html>
<head>
  <style>/* All CSS inline */</style>
</head>
<body>
  <div id="app"><!-- Layout structure --></div>
  <script type="module">
    // Mock data matching B3 entity design
    const courses = [...]
    const enrollments = [...]
    const assignmentInstances = [...]

    // State management
    const state = { role: 'student', currentCourseId: null, ... }

    // Render functions for each view
    function renderStudentDashboard() { ... }
    function renderCourseView(courseId) { ... }
    function renderTeacherGradebook(courseId) { ... }

    // Event wiring
    // Initial render
  </script>
</body>
</html>
```

## Consequences

### Positive
- **Fast iteration**: Changes visible immediately in browser
- **No deployment needed**: Just open the file
- **Stakeholder-friendly**: Non-technical people can see and interact
- **Design validation**: Test UX before B3 investment
- **Documentation**: Prototype serves as visual spec

### Negative
- **Duplicate effort**: Some work redone in B3
- **Mock data divergence**: Need to keep mock data aligned with B3 model
- **No real persistence**: Can't test actual workflows

### Neutral
- Requires discipline to keep prototype aligned with B3 design

## Example

See `proto.html` in the repository root - demonstrates student dashboard, course view, assignment detail, teacher gradebook, and role switching.

## Related Patterns

- Reference-Driven Design (use LMS platform research to guide UX)
- BPMN Process Design (map state changes from prototype to processes)
