# ADR-001: Orchestrator Pattern for Claude Code

## Status

Accepted

## Context

When using Claude Code for the B3 LMS project, we need to decide how work should be distributed between the main Claude session and subagents.

Options considered:
1. Main Claude does everything directly
2. Main Claude orchestrates, agents do some work
3. Main Claude ONLY orchestrates, ALL real work goes to agents

## Decision

**Main Claude operates as pure orchestrator. ALL real work is delegated to agents via Task tool.**

Main Claude responsibilities:
- Understand user requests
- Break tasks into subtasks
- Spawn agents (parallel when independent)
- Roast agent outputs before accepting
- Synthesize final responses to user

Main Claude NEVER:
- Writes code or edits files directly
- Does research directly (spawns Explore agent)
- Creates plans directly (spawns b3-architect agent)
- Implements features (spawns general-purpose agent)

## Consequences

### Positive
- **Cleaner context**: Main conversation stays focused on orchestration
- **Parallel execution**: Independent subtasks run simultaneously
- **Specialized expertise**: Each agent type optimized for its task
- **Better quality**: Forced roast step catches more issues
- **Task decomposition**: Explicit subtask breakdown improves planning
- **Audit trail**: Each agent produces discrete, reviewable output

### Negative
- **Overhead for tiny tasks**: Even small tasks require agent spawn
- **Learning curve**: Must remember to delegate, not act directly
- **Potential over-complication**: Risk of spawning agents unnecessarily

### Neutral
- Different workflow than typical Claude Code usage
- Requires discipline to maintain pattern

## Alternatives Considered

### Option A: Direct Implementation
- Pros: Faster for small tasks, simpler mental model
- Cons: Context bloat, no parallelism, missed critique opportunities

### Option B: Hybrid (orchestrate sometimes, implement sometimes)
- Pros: Flexible, can adapt to task size
- Cons: Inconsistent, easy to slip into direct implementation, harder to enforce quality

## Related Decisions

- Roast-and-Revise process (future ADR)
- Memory bank consultation requirement (future ADR)
