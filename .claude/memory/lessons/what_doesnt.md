# What Doesn't Work

Anti-patterns to AVOID. Agents MUST check here before proposing solutions.

---

## Orchestration Anti-Patterns

### ❌ Main Claude Implementing Directly
**What failed**: Main Claude writing code, editing files, doing research without agents.
**Why it fails**:
- Context bloat in main conversation
- No parallel execution
- No specialized expertise
- Harder to track/critique work
**Do instead**: ALWAYS spawn agents for real work. Main Claude only orchestrates.

### ❌ Sequential Agent Calls for Independent Tasks
**What failed**: Waiting for agent A to finish before spawning agent B when they're independent.
**Why it fails**: Wastes time, artificial bottleneck.
**Do instead**: Multiple Task calls in ONE message for independent subtasks.

---

## Design Anti-Patterns

### ❌ Designing Without Reading References
**What failed**: Creating UX from scratch without checking Canvas/Coursera patterns.
**Why it fails**: Reinventing solved problems. Missing proven patterns.
**Do instead**: ALWAYS read `Tasks/init/references.md` and `gpt_design.md` first.

### ❌ Assuming B3 Can Do Everything
**What failed**: Designing features assuming B3 supports them, then discovering it doesn't.
**Why it fails**: Redesign needed, wasted effort.
**Do instead**: Validate B3 capabilities BEFORE designing. Check B3 docs.

### ❌ Over-Engineering MVP
**What failed**: Adding features beyond minimum viable (e-commerce, advanced analytics, etc.) in first iteration.
**Why it fails**: Delays launch, increases complexity, may not be needed.
**Do instead**: Start minimal. 2 courses, basic enrollment, simple grading. Iterate.

---

## Process Anti-Patterns

### ❌ Showing v1 to User
**What failed**: Presenting first draft without self-critique.
**Why it fails**: v1 always has flaws. User sees lower quality work.
**Do instead**: Roast-and-Revise. Only show v2.

### ❌ Ignoring Memory Bank
**What failed**: Proposing solutions without checking lessons learned.
**Why it fails**: Repeating mistakes. Missing proven patterns.
**Do instead**: Read what_works.md, what_doesnt.md, gotchas.md FIRST.

### ❌ No Task Documentation
**What failed**: Implementing without creating task artifacts (plan, critique, reflection).
**Why it fails**: No audit trail, lessons not captured, hard to review.
**Do instead**: Create `Tasks/YYYYMMDD_task_name/` directory with all artifacts.

---

## Technical Anti-Patterns

### ❌ Custom Code Over B3 Native
**What failed**: Writing custom frontend/backend when B3 has built-in feature.
**Why it fails**: Harder to maintain, loses B3 benefits, more work.
**Do instead**: Use B3 data model, BPMN, dashboards, print forms. Custom only when necessary.

### ❌ Hardcoding Data in Prototype
**What failed**: Mock data structures that don't match B3 entity design.
**Why it fails**: Prototype diverges from real implementation, false confidence.
**Do instead**: Mock data should mirror B3 entity structure exactly.
