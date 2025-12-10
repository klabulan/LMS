# Memory Bank Index

Welcome to the B3 LMS memory bank. This is a living knowledge repository that grows with the project.

## Purpose

This memory bank serves as institutional memory for the project, capturing:
- Architecture patterns and decisions for B3-based development
- Lessons learned from implementation
- Current project state and active work
- Common pitfalls and gotchas specific to B3 platform

## Structure

### 📐 Architecture (`architecture/`)

**Patterns** (`patterns/`)
- Proven implementation patterns for B3 data models, BPMN processes, and UI construction
- Each pattern documents: context, problem, solution, consequences, examples

**Decisions** (`decisions/`)
- Architecture Decision Records (ADRs) documenting significant technical decisions
- Use TEMPLATE.md when creating new ADRs
- Never delete ADRs - they provide historical context

### 📋 Context (`context/`)

**project_state.md**
- Current project phase and status
- Completed milestones
- Technical capabilities
- Known technical debt

**active_work.md**
- Current tasks
- Prioritized backlog
- Recent completions
- Blockers and risks

**known_issues.md**
- Documented bugs and issues
- Workarounds
- Priority and severity

### 📚 Lessons (`lessons/`)

**what_works.md**
- Successful patterns and practices
- Battle-tested solutions

**what_doesnt.md**
- Anti-patterns to avoid
- Failed approaches with explanations

**gotchas.md**
- Common pitfalls and traps
- B3-specific issues
- Non-obvious behaviors

## Usage Guidelines

### For AI Assistants
1. **Always consult memory bank** before proposing solutions
2. **Update memory bank immediately** when discovering new patterns or gotchas
3. **Reference existing ADRs** when making related decisions
4. **Create new ADRs** for significant architectural decisions

### Maintenance
- **After features:** Add lessons learned, update patterns
- **Before major work:** Review project_state.md
- **When encountering issues:** Document in known_issues.md and gotchas.md

## Memory Bank Philosophy

> "Those who cannot remember the past are condemned to repeat it."

This memory bank ensures:
- ✅ Mistakes are made only once
- ✅ B3-specific knowledge is preserved
- ✅ Context is preserved for future maintainers
- ✅ Quality improves continuously
