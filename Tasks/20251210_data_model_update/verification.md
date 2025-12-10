# Verification Checklist

## Requirement 1: STATUS FIELD FOR ALL ENTITIES ✓
- [x] Course Template: draft/published/archived
- [x] Course Instance: planned/active/completed/archived
- [x] Enrollment: pending_approval/approved/active/completed/withdrawn/failed
- [x] Assignment Template: draft/active/archived
- [x] Assignment Instance: not_started/in_progress/submitted/under_review/graded/needs_revision
- [x] Certificate Template: draft/active/archived
- [x] Certificate Instance: issued/revoked
- [x] Dialog: active/archived
- [x] Notification: keeps is_read boolean (no status needed)

## Requirement 2: REPLACE is_published WITH accessibility ✓
- [x] Removed is_published field
- [x] Added accessibility Enum: public/registered
- [x] Updated business rules: visibility = status:published AND accessibility

## Requirement 3: RENAME stream_name → group_name ✓
- [x] Conceptually renamed to "Учебная группа"
- [x] Field name changed to group_name
- [x] All descriptions updated

## Requirement 4: REMOVE FIELDS FROM Course Instance ✓
- [x] Removed max_enrollments
- [x] Removed settings

## Requirement 5: MERGE Enrollment Request INTO Enrollment ✓
- [x] Deleted Enrollment Request section
- [x] Added pending_approval status to Enrollment
- [x] Added request_comment field
- [x] Added approval_comment field
- [x] Added approved_by field
- [x] Added approved_at field

## Requirement 6: REPLACE VM FIELDS WITH allocated_resources ✓
- [x] Removed vm_url
- [x] Removed vm_username
- [x] Removed vm_password
- [x] Removed vm_expires_at
- [x] Added allocated_resources (Text)

## Requirement 7: REMOVE due_days ✓
- [x] Removed due_days from Assignment Template
- [x] Removed due_date from Assignment Instance
- [x] Added note: deadlines determined by Course Schedule

## Requirement 8: ADD SCHEDULE ENTITIES ✓
- [x] Added Course Schedule (3.7.1)
- [x] Added Launch Schedule (3.7.2)
- [x] Full field definitions
- [x] Business rules
- [x] Example data in Appendix A

## Requirement 9: UPDATE STATUS SECTION ✓
- [x] Section 5 completely rewritten
- [x] Status values with Russian descriptions
- [x] Transition diagrams for all entities
- [x] Transition tables with Who/Actions
- [x] Full BPMN integration notes

## Requirement 10: VERIFY ALL PROTOTYPE FIELDS ✓
- [x] Assignment Template: delivery_mode (in_person/self_study)
- [x] Assignment Template: submission_type as array
- [x] Course Template: category field
- [x] Course Template: level (renamed from type)
- [x] Section 10 added with complete prototype mapping

## Additional improvements:
- [x] Updated version to 2.0
- [x] Added Section 9: Changes in version 2.0
- [x] Added Section 10: Prototype correspondence
- [x] Updated ER diagram with schedules
- [x] Updated indices with schedules
- [x] Complete examples in Appendix A
- [x] All Russian descriptions
- [x] No TODO markers
- [x] COMPLETE rewrite with all changes applied
