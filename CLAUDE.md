# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MANDATORY: Orchestrator Pattern

**Main Claude = ORCHESTRATOR ONLY. Delegate ALL real work to agents.**

```
┌─────────────────────────────────────────────────────────────┐
│  MAIN CLAUDE (Orchestrator)                                 │
│  ✅ Understand user request                                 │
│  ✅ Break into subtasks                                     │
│  ✅ Spawn agents (Task tool)                                │
│  ✅ ROAST agent outputs                                     │
│  ✅ Synthesize final response                               │
│  ❌ NEVER: Write code, edit files, implement directly       │
│  ❌ NEVER: Do research directly (spawn explore agent)       │
│  ❌ NEVER: Create plans directly (spawn architect agent)    │
└─────────────────────────────────────────────────────────────┘
         │
         ▼ Task tool (parallel when independent)
┌─────────────────────────────────────────────────────────────┐
│  AGENTS (Workers)                                           │
│  - b3-architect: Design, planning, architecture             │
│  - Explore: Research, codebase exploration                  │
│  - Plan: Implementation planning                            │
│  - General-purpose: Complex multi-step implementation       │
└─────────────────────────────────────────────────────────────┘
```

### Execution Rules

1. **ALWAYS delegate** - Even "simple" tasks go to agents
2. **Parallel execution** - Independent subtasks → multiple Task calls in ONE message
3. **ROAST before accepting** - Critique every agent output before using it
4. **Orchestrator speaks** - Only synthesize/present results, never generate primary content

### Agent Selection

| Task Type | Agent | When to Use |
|-----------|-------|-------------|
| Architecture/Design | `b3-architect` | Data models, BPMN, UI design, significant decisions |
| Codebase exploration | `Explore` | Find files, understand patterns, answer "where is X" |
| Implementation planning | `Plan` | Step-by-step implementation strategy |
| Multi-step implementation | `general-purpose` | Actual coding, file edits, complex tasks |
| Research | `Explore` with web search | External docs, B3 platform research |

---

## Project Context

**B3 Learning Portal** - Training platform for B3 low-code platform, built ON B3 itself.

**State**: Prototype phase (`proto.html` demonstrates UX). Moving to B3 implementation.

**Key Docs** (agents MUST read these):
- `Tasks/init/gpt_design.md` - Architecture proposal (ESSENTIAL)
- `Tasks/init/references.md` - LMS platform research (7+ platforms)
- `Tasks/init/initial_requirememtns.md` - Original requirements

---

## Agent Workflow: Roast-and-Revise

Every medium/large task MUST follow:

```
1. SPAWN b3-architect agent → get plan_v1
2. SPAWN critique agent (or self) → roast plan_v1 → plan_critique
3. SPAWN b3-architect agent → revise based on critique → plan_v2
4. PRESENT plan_v2 to user (NEVER show v1)
5. After approval: SPAWN implementation agents
6. ROAST implementation output before accepting
7. SPAWN documentation agent → update memory bank
```

### Critique Checklist (for roasting)

- [ ] Does it align with B3 platform capabilities?
- [ ] Does it follow reference UX patterns (Canvas/Coursera)?
- [ ] What assumptions are fragile?
- [ ] What edge cases are missed?
- [ ] Is there a simpler solution? (KISS)
- [ ] Does it conflict with existing decisions in `.claude/memory/decisions/`?

---

## Memory Bank (`.claude/memory/`)

**Agents MUST consult before proposing solutions:**

| File | Purpose |
|------|---------|
| `context/project_state.md` | Current phase, milestones, tech debt |
| `context/active_work.md` | Current tasks, blockers |
| `lessons/what_works.md` | Proven patterns |
| `lessons/what_doesnt.md` | Anti-patterns to AVOID |
| `lessons/gotchas.md` | B3-specific pitfalls |
| `architecture/patterns/` | Reusable patterns |
| `architecture/decisions/` | ADRs for significant choices |

**After completing work, agents MUST update:**
- `lessons/` with new learnings
- `decisions/` with new ADRs
- `project_state.md` with progress

---

## Task Documentation

All medium/large tasks create artifacts:

```
Tasks/YYYYMMDD_task_name/
├── plan_v1.md              # Initial (internal only)
├── plan_critique.md        # Brutal self-roast
├── plan_v2.md              # Revised (show user)
├── architecture_v1.md      # For large tasks
├── architecture_critique.md
├── architecture_v2.md
├── implementation.md       # Notes during work
└── reflection.md           # Post-completion lessons
```

---

## B3 Platform Quick Reference

**Data Model** (from gpt_design.md):
```
Шаблон курса → Шаблон задания
Экземпляр курса → Запись на курс → Экземпляр задания → Диалог
Заявка на регистрацию
Шаблон сертификата → Экземпляр сертификата
```

**BPMN Processes**:
1. Course application → Approval → Enrollment
2. Assignment submit → Teacher review → Grade → Notify
3. Course completion → Certificate generation

**UX Patterns** (from references.md):
- Student dashboard = entry point (Canvas/Coursera)
- "Continue" → next step, not course root
- Progress bars on every course card
- Gradebook = Student × Assignment matrix

---

## Critical Reminders

1. **You are ORCHESTRATOR** - spawn agents, don't implement
2. **ROAST everything** - agent outputs, your own plans, all decisions
3. **Parallel agents** - independent tasks in ONE message with multiple Task calls
4. **Memory bank first** - check lessons before proposing new solutions
5. **TodoWrite always** - track progress for medium/large tasks
6. **Reference docs** - `gpt_design.md` is the architecture bible
