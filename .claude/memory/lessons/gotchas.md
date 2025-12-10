# Gotchas

Pitfalls that look safe but bite you. Agents MUST check here.

---

## Orchestration Gotchas

### ⚠️ "It's Just a Small Task"
**Trap**: Thinking a task is too small to delegate to an agent.
**Consequence**: Main Claude does work directly, violating orchestrator pattern.
**Reality**: Even small tasks benefit from agent execution (cleaner context, parallel potential).
**Rule**: If it involves code, files, or research → spawn agent.

### ⚠️ Forgetting to Roast Agent Output
**Trap**: Accepting agent output without critique.
**Consequence**: Flaws propagate to user, lower quality work.
**Rule**: ALWAYS critique agent output before using it.

---

## B3 Platform Gotchas

### ⚠️ B3 Capability Assumptions
**Trap**: Designing based on assumed B3 features without verification.
**Consequence**: Design requires non-existent feature, needs redesign.
**Rule**: Verify B3 capability in docs BEFORE designing around it.

### ⚠️ BPMN Complexity Creep
**Trap**: Adding conditions, branches, parallel paths to BPMN process.
**Consequence**: Hard to debug, hard to maintain, unexpected behavior.
**Rule**: Start with simplest linear process. Add complexity only when proven necessary.

### ⚠️ Dashboard Widget Limits
**Trap**: Assuming B3 dashboard can show any custom visualization.
**Consequence**: Some designs may not be implementable with B3 widgets.
**Rule**: Design dashboards using B3's built-in widget types.

---

## UX Gotchas

### ⚠️ Russian Typography
**Trap**: Assuming Latin typography rules work for Cyrillic.
**Consequence**: Poor readability, awkward line breaks, weird spacing.
**Rule**: Test all UI with actual Russian content.

### ⚠️ Progress Calculation Mismatch
**Trap**: Calculating progress differently than user expects.
**Consequence**: "75%" but user sees 2/3 done → confusion, distrust.
**Rule**: Be explicit: "3 of 4 assignments completed" not just percentage.

### ⚠️ Mobile Responsiveness
**Trap**: Designing only for desktop B3 interface.
**Consequence**: Students on mobile can't use system effectively.
**Rule**: Consider B3 mobile capabilities from start.

---

## Data Model Gotchas

### ⚠️ Prototype Data ≠ B3 Data
**Trap**: Mock data in proto.html doesn't match planned B3 entities.
**Consequence**: Prototype validates wrong structure, surprises in implementation.
**Rule**: Keep mock data structure aligned with gpt_design.md entity definitions.

### ⚠️ Missing Enrollment Link
**Trap**: Connecting assignment instances directly to students.
**Consequence**: Loses course context, can't track per-course progress.
**Rule**: Assignment Instance → Enrollment → Student (not direct link).

### ⚠️ Template vs Instance Confusion
**Trap**: Mixing template-level and instance-level data.
**Consequence**: Changes to template affect existing student work unexpectedly.
**Rule**: Clear separation: Template = definition, Instance = per-student copy.

---

## Process Gotchas

### ⚠️ No Reflection After Task
**Trap**: Finishing task without writing reflection.md.
**Consequence**: Lessons not captured, same mistakes repeated.
**Rule**: ALWAYS create reflection.md after completing medium/large tasks.

### ⚠️ Stale Memory Bank
**Trap**: Not updating memory bank after learning something new.
**Consequence**: Next agent doesn't benefit from lessons learned.
**Rule**: Update what_works/what_doesnt/gotchas immediately after discovery.
