# Project State

Last updated: 2024-12-09

## Current Phase

**Phase 1: Prototype & Design** (Active)

The project is in early prototype phase with a working HTML mockup demonstrating the target UX/UI.

## Completed Milestones

- [x] Initial requirements gathering
- [x] Reference research (7+ LMS platforms analyzed)
- [x] Architecture design proposal (gpt_design.md)
- [x] HTML/CSS/JS prototype with student and teacher views
- [x] CLAUDE.md and memory bank structure established

## In Progress

- [ ] Review and validate architecture against B3 capabilities
- [ ] Define detailed data model for B3 implementation
- [ ] Create BPMN process diagrams

## Next Steps (Prioritized)

1. Validate B3 data model design from gpt_design.md
2. Create first B3 entities (Шаблон курса, Шаблон задания)
3. Configure basic student dashboard interface
4. Implement first BPMN process (assignment submission)

## Technical Capabilities

### Currently Available
- HTML prototype for UX validation
- Detailed architecture proposal
- LMS reference research

### Planned (B3 Features to Use)
- Interactive data model constructor
- BPMN visual process designer
- Dashboard builder
- Print form constructor (for certificates)
- Onboarding module
- RESTQL-API

## Known Technical Debt

1. **Prototype-only state** - No backend, mock data in JavaScript
2. **No B3 integration yet** - All concepts need B3 validation
3. **Missing mobile considerations** - Responsive design needs work

## Dependencies

- B3 Platform access (https://v21.platform.big3.ru)
- B3 documentation familiarity
- Understanding of BPMN process design

## Risks

1. **B3 capability gaps** - Some UX patterns may not be directly implementable
2. **Learning curve** - Team needs B3 platform expertise
3. **Scope creep** - Need to maintain MVP focus (few courses, simple workflows)
