# Task Specification: B3 LMS Implementation Design

## Context

This task is to create comprehensive design documentation for implementing the B3 Learning Portal using B3 platform capabilities.

## Required Deliverables

### 1. Research Summary (`01_research_summary.md`)
Create a comprehensive analysis covering:
- **B3 Platform Capabilities Summary**: Extract and summarize key platform features from `D:\B3\LMS\Tasks\init\gpt_design.md`
  - Data model construction (Entity types)
  - Form/View types (list, detail, dashboard, landing)
  - Business processes (BPMN, status-based workflows)
  - Print forms (DOCX → PDF with signatures)
  - Dashboards and analytics
  - Onboarding module
  - Role model (Cabinets → Roles → Permissions)
  - Field types and validators
  - Communication (notifications, mailings)

- **LMS Requirements Summary**: Extract from `D:\B3\LMS\Tasks\init\initial_requirememtns.md` and `gpt_design.md`
  - Student workflows
  - Teacher workflows
  - Admin workflows
  - Core entities (Course Template, Course Instance, Enrollment, Assignment, Dialog, Certificate)
  - UX requirements from references

- **Gap Analysis**: Identify what proto.html has vs what's needed, and how B3 platform features map to requirements

### 2. Design Document v1 (`02_design_v1.md`)
Create detailed implementation design:

- **Enhanced Data Model**:
  - Map LMS entities to B3 Entity Types (Типы представления)
  - Define all fields, relationships, validators
  - Specify which are справочники vs документы
  - Include all entities from gpt_design.md data model

- **UI/UX Improvements for proto.html**:
  - Analyze current proto.html features
  - Propose enhancements aligned with Canvas/Coursera patterns from references.md
  - Add missing features: file upload, notifications indicator, admin view, enrollment request flow
  - Responsive design considerations

- **New Features to Add**:
  - File upload for assignments (not just text)
  - Notifications/messages indicator in topbar
  - Admin dashboard view (separate from teacher)
  - Course catalog view (for enrollment)
  - Enrollment request workflow
  - Certificate generation UI
  - Progress tracking enhancements
  - Course materials/lectures section

- **Color Scheme and Styling**:
  - Define B3 platform-aligned color palette
  - Component library specifications
  - Ensure consistency with B3 platform aesthetic
  - Accessibility considerations (WCAG compliance)

- **BPMN Process Designs**:
  - Enrollment request → Approval → Course creation
  - Assignment submission → Review → Grading
  - Course completion → Certificate generation

### 3. B3 Setup Guide (`03_b3_setup_guide.md`)
Step-by-step implementation instructions:

- **Prerequisites**: Required B3 platform version, modules, permissions

- **Entity Creation (Типы представления)**:
  - For each entity (Шаблон курса, Экземпляр курса, Запись на курс, Шаблон задания, Экземпляр задания, Диалог, Сертификат, etc.):
    - Entity type (справочник/документ)
    - Field definitions with types
    - Relationships/links to other entities
    - Validators and conditions
    - Initial data/seed values if needed

- **Form Configuration**:
  - List views (форма списка): columns, filters, actions
  - Detail views (форма элемента): layout, sections, tabs
  - Dashboards (аналитическая панель): widgets, charts, KPIs
  - Landing pages: public course catalog

- **Business Process Setup**:
  - BPMN diagrams for each process
  - Status definitions and transitions
  - Role-based permissions per status
  - Automated actions (notifications, field updates)
  - Integration points

- **Role Configuration**:
  - Define Cabinets (e.g., "Портал обучения")
  - Define Roles: Student, Teacher, Methodologist, Admin
  - Permission matrix: read/write/create/update per entity and status
  - Access rules and conditions

- **Dashboard Creation**:
  - Student dashboard: course cards, progress, next steps
  - Teacher dashboard: courses, student progress, pending reviews
  - Admin dashboard: system stats, enrollment requests, certificate generation

- **Print Form Templates**:
  - Certificate template in DOCX format
  - Variable substitution specifications
  - PDF generation settings
  - Digital signature configuration (if applicable)

- **Testing Checklist**:
  - User scenarios to test
  - Expected behaviors
  - Edge cases

## Key Reference Documents

- `D:\B3\LMS\Tasks\init\gpt_design.md` - Architecture proposal (PRIMARY SOURCE)
- `D:\B3\LMS\Tasks\init\references.md` - LMS platform research (Canvas, Coursera, etc.)
- `D:\B3\LMS\Tasks\init\initial_requirememtns.md` - Original requirements
- `D:\B3\LMS\proto.html` - Current prototype implementation
- B3 Platform Docs: https://v21.platform.big3.ru/docs/platform-b3

## Design Principles

1. **Leverage B3 Native Capabilities**: Use platform features instead of custom code wherever possible
2. **Follow Reference UX Patterns**: Canvas/Coursera patterns for student experience
3. **KISS**: Keep it simple, start with MVP features
4. **Scalability**: Design for 1-6 courses initially, but allow growth
5. **Role-Based Experience**: Different dashboards/workflows for Student/Teacher/Admin
6. **Progress Transparency**: Always show progress bars, status, next steps
7. **Mobile-First**: Responsive design, works on tablets/phones
8. **Accessibility**: WCAG 2.1 Level AA compliance

## Deliverable Format

Each document should be:
- Markdown formatted
- Well-structured with clear headings
- Include diagrams (mermaid syntax) where helpful
- Action-oriented (implementable by B3 platform configurator)
- Include rationale for design decisions
- Cross-reference between documents as needed

## Success Criteria

The deliverables should enable a B3 platform administrator to:
1. Understand what needs to be built and why
2. Configure all entities, forms, and processes in B3
3. Set up role-based access correctly
4. Deploy a working LMS portal aligned with prototype
5. Test all user workflows end-to-end
