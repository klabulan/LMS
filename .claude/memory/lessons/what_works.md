# What Works

Battle-tested patterns. Agents MUST check here before proposing new solutions.

---

## Orchestrator Pattern

### ✅ Main Claude as Pure Orchestrator
**Context**: All Claude Code sessions
**Pattern**: Main Claude ONLY orchestrates. All real work goes to agents via Task tool.
**Why it works**:
- Prevents context bloat in main conversation
- Enables parallel execution
- Forces task decomposition
- Allows specialized agent expertise
**Rule**: If you're about to write code or do research directly, STOP and spawn an agent.

### ✅ Parallel Agent Execution
**Context**: Independent subtasks
**Pattern**: Spawn multiple agents in ONE message when tasks don't depend on each other.
**Why it works**: Faster execution, no sequential bottleneck.
**Example**: Research + architecture design can run in parallel.

---

## Design Patterns

### ✅ HTML Prototype First
**Context**: UX validation before B3 implementation
**Pattern**: Single-file HTML/CSS/JS with mock data, role switching, all key screens.
**Why it works**: Fast iteration, stakeholder-friendly, no deployment needed.
**File**: `proto.html`

### ✅ Reference-Driven Design
**Context**: LMS feature design
**Pattern**: Study 7+ existing platforms before designing. Copy proven UX patterns.
**Why it works**: Don't reinvent solved problems. Canvas/Coursera/Litmos have tested these patterns.
**File**: `Tasks/init/references.md`

### ✅ Template → Instance Pattern
**Context**: B3 data model
**Pattern**: Separate templates (reusable definitions) from instances (per-student records).
**Example**:
- Шаблон курса (course template) → Экземпляр курса (course instance)
- Шаблон задания (assignment template) → Экземпляр задания (assignment instance per student)
**Why it works**: Clean separation, supports multiple course runs, easy to copy.

---

## Process Patterns

### ✅ Roast-and-Revise
**Context**: All plans and architecture
**Pattern**: Create v1 → Brutally critique → Create v2 → Show user v2 only.
**Why it works**: Catches flaws before user sees them. v2 is always better.
**Files**: plan_v1.md → plan_critique.md → plan_v2.md

### ✅ Memory Bank Consultation
**Context**: Before proposing any solution
**Pattern**: Read what_works.md, what_doesnt.md, gotchas.md FIRST.
**Why it works**: Don't repeat mistakes. Use proven patterns.

---

## UX Patterns (from Reference Research)

### ✅ Dashboard as Entry Point
**Context**: Student landing page
**Pattern**: Show course cards with progress, "Continue" to next step (not course root).
**Source**: Canvas, Coursera
**Why it works**: Reduces friction, answers "what should I do next?"

### ✅ Progress Bars Everywhere
**Context**: Course cards, course page, assignment list
**Pattern**: Visual progress indicator on every course-related element.
**Source**: All reference platforms
**Why it works**: Motivates completion, shows progress at a glance.

### ✅ Gradebook Matrix
**Context**: Teacher view
**Pattern**: Students as rows, assignments as columns, color-coded status cells.
**Source**: Canvas SpeedGrader, Brightspace
**Why it works**: Quick overview of entire class progress.
