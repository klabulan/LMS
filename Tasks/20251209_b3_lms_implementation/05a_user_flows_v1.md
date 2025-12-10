# User Flows v1: B3 Learning Portal

## Document Information

- **Version**: 1.0 (Initial - For Internal Review)
- **Date**: 2025-12-09
- **Status**: Draft for Critique
- **Purpose**: Detailed user flow documentation for B3 Learning Portal
- **References**: gpt_design.md, references.md, 02_design_v1.md

---

## Table of Contents

1. [Guest to Student Registration Flow](#1-guest-to-student-registration-flow)
2. [Methodist Course Design Flow](#2-methodist-course-design-flow)
3. [Admin Course Launch Flow](#3-admin-course-launch-flow)
4. [Student Learning Flow](#4-student-learning-flow)
5. [Teacher Teaching Flow](#5-teacher-teaching-flow)

---

## 1. Guest to Student Registration Flow

### Flow Overview
**Goal**: Convert anonymous visitor into enrolled student
**Duration**: 5-10 minutes for self-service, 1-3 days including approval
**Success Metric**: Enrollment completion rate

### Step-by-Step Flow

#### Step 1: Landing on Portal
**Actor**: Guest (anonymous visitor)
**Entry Point**: Direct URL, search engine, marketing link

**UI State**:
- Public landing page shows:
  - Hero section with B3 platform value proposition
  - Featured courses (3-4 cards with thumbnails)
  - Search bar
  - "Каталог курсов" (Browse Catalog) button
  - Login/Register buttons in header

**Data State**:
- No user session
- Public course catalog loaded from `Шаблон курса` where `status='Активен'`

**System Behavior**:
- Track anonymous visitor analytics (optional)
- Load public catalog data via RESTQL API
- Display only published courses

---

#### Step 2: Browse Catalog
**Actor**: Guest
**Trigger**: Click "Каталог курсов" or search

**UI State**:
- Catalog page with:
  - Left sidebar: Filters (level, category, duration)
  - Main area: Course cards in grid (3 columns)
  - Each card shows: thumbnail, title, level badge, duration, short description
  - Search bar at top
  - Sort options: Popular, Newest, Alphabetical

**Data Query**:
```
Entity: Шаблон курса
Filter: status='Активен'
Sort: По выбору пользователя
Display fields: title, short_description, level, duration_hours, cover_image
```

**Interactions**:
- Filter by level: Updates card list
- Search: Filters by title/description keywords
- Click card: Navigate to course details

**Reference Pattern**: Coursera catalog, Canvas course discovery

---

#### Step 3: View Course Details
**Actor**: Guest
**Trigger**: Click course card

**UI State**:
- Course detail page:
  - Header: Course title, level badge, duration
  - Cover image (hero)
  - Tabs: Описание | Программа | Преподаватель
  - Right sidebar:
    - "Записаться на курс" (Enroll) button (primary CTA)
    - Prerequisites list
    - Target audience
    - Price (if applicable) or "Бесплатно"
  - Description tab content: full_description, learning_objectives
  - Program tab: List of modules/assignments (from Шаблон задания)
  - Teacher tab: Instructor bio and photo

**Data State**:
- Load single `Шаблон курса` by ID
- Load related `Шаблон задания` list (ordered by `order_num`)
- Load instructor `User` profile

**System Behavior**:
- No authentication required to view
- CTA button state depends on:
  - Guest: Show "Записаться" → redirects to login/register
  - Logged in student: Check if already enrolled
    - If enrolled: Show "Перейти к курсу"
    - If not enrolled: Show "Записаться"

**Reference Pattern**: Coursera course page, Udemy course landing

---

#### Step 4: Click Enroll (Not Authenticated)
**Actor**: Guest
**Trigger**: Click "Записаться на курс"

**UI State**:
- Redirect to authentication page with options:
  - "Войти" (Login) tab
  - "Зарегистрироваться" (Register) tab - default selected
  - Message: "Чтобы записаться на курс, создайте учетную запись или войдите"
  - Breadcrumb shows: Course title > Регистрация

**System Behavior**:
- Store `course_id` in session/URL param to redirect after auth
- Show registration form

---

#### Step 5: Fill Registration Form
**Actor**: Guest → Prospective Student
**Trigger**: Select "Зарегистрироваться" tab

**UI State - Registration Form**:
- **Required fields** (marked with *):
  - Email *
  - Пароль * (with strength indicator)
  - Подтвердите пароль *
  - Фамилия *
  - Имя *
  - Отчество
  - Телефон
- **Optional fields**:
  - Организация
  - Должность
  - Подразделение
- Checkbox: "Я согласен с политикой обработки персональных данных" *
- Button: "Создать учетную запись и записаться"

**Validation**:
- Email: format + uniqueness check (real-time)
- Password: min 8 chars, complexity rules
- Phone: format validation (RU pattern)
- Required fields non-empty

**Form UX**:
- Inline validation (on blur)
- Error messages in red below field
- Success indicators (green checkmark)

**Reference Pattern**: Canvas registration, Coursera sign-up

---

#### Step 6: Submit Registration
**Actor**: Prospective Student
**Trigger**: Click "Создать учетную запись и записаться"

**Data Changes**:
1. Create `User` record:
   ```
   username: auto-generate from email or let user choose
   email: from form
   first_name, last_name, patronymic: from form
   phone, organization, position, department: from form
   password: hashed
   is_active: true
   date_joined: now()
   roles: ['Student'] (default cabinet assignment)
   ```

2. Create `Заявка на регистрацию` (Enrollment Request) record:
   ```
   user_id: newly created user ID
   course_template_id: from session
   status: 'Новая'
   request_date: now()
   notes: optional free text from form
   ```

**System Actions**:
- Send email verification (optional, B3 native)
- Log user in (create session)
- Trigger BPMN: "Enrollment Request Process"

**Who Triggers Next Step**: System (auto) or Admin (manual approval)

**Notifications Sent**:
- Email to user: "Ваша заявка на курс [Course Title] отправлена"
- Email to admin: "Новая заявка на регистрацию: [User Name] → [Course]"

---

#### Step 7: Application Status - Pending
**Actor**: Student (now authenticated)
**Trigger**: Registration submission complete

**UI State**:
- Redirect to Student Dashboard
- Show banner: "Ваша заявка на курс '[Course Title]' отправлена на рассмотрение. Мы уведомим вас о результатах."
- Dashboard shows:
  - Section "Мои заявки" with card:
    - Course title
    - Status badge: "На рассмотрении" (yellow)
    - Date submitted
    - Message: "Ожидает одобрения администратора"

**Data State**:
```
Заявка на регистрацию:
  status: 'Новая' or 'На согласовании'
  user_id: current user
  course_template_id: selected course
```

**User Can**:
- Browse other courses
- Edit profile
- Cannot access course content yet

**Reference Pattern**: Litmos enrollment pending, Absorb approval workflow

---

#### Step 8: Admin Reviews Application
**Actor**: Admin
**Trigger**: Manual check or notification

**UI State - Admin Dashboard**:
- Section: "Заявки на регистрацию"
- Table columns:
  - Дата заявки
  - Студент (ФИО)
  - Курс
  - Организация
  - Статус
  - Действия: [Одобрить] [Отклонить]
- Filter by: Status, Course, Date range
- Sortable columns

**Data Query**:
```
Entity: Заявка на регистрацию
Filter: status IN ('Новая', 'На согласовании')
Order by: request_date DESC
```

**Admin Actions Available**:
1. **View Details**: Click row to see full application
2. **Approve**: Click [Одобрить]
3. **Reject**: Click [Отклонить] → opens modal for rejection reason

**Reference Pattern**: Canvas admin enrollment management, Docebo approval queue

---

#### Step 9: Admin Approves
**Actor**: Admin
**Trigger**: Click [Одобрить]

**Data Changes**:
1. Update `Заявка на регистрацию`:
   ```
   status: 'Одобрена'
   approved_by: current admin user ID
   approved_date: now()
   ```

2. System auto-creates:
   - `Экземпляр курса` (if not exists for current cohort):
     ```
     course_template_id: from application
     cohort_name: "Поток [Month Year]" (auto-generate)
     start_date: next_monday() or manual
     status: 'Планируется' or 'Идет'
     ```

   - `Запись на курс` (Enrollment):
     ```
     user_id: student
     course_instance_id: created/existing instance
     status: 'Ожидает начала' or 'В процессе' (depending on course start_date)
     enrollment_date: now()
     progress_percent: 0
     ```

   - `Экземпляр задания` records for each `Шаблон задания` in course:
     ```
     assignment_template_id: each assignment
     enrollment_id: new enrollment
     status: 'Не начато'
     attempts: 0
     score: null
     ```

**BPMN Trigger**: "Course Enrollment Provisioning" process

**Notifications Sent**:
- Email to student: "Ваша заявка одобрена! Вы зачислены на курс [Title]"
  - Contains: Course start date, link to access course, credentials (if needed)
- Admin log: Record approval action

**Who Triggers Next Step**: Student receives notification and can access course

---

#### Step 10: Student Receives Notification
**Actor**: Student
**Trigger**: Email notification received

**Notification Content**:
```
Subject: Вы зачислены на курс "Название курса"

Здравствуйте, [Имя]!

Ваша заявка на курс "Название курса" одобрена.

Вы можете начать обучение прямо сейчас:
[Ссылка на курс]

Доступ к стендам:
- URL: https://student-env-123.b3.ru
- Логин: student_123
- Пароль: [генерируется]

Преподаватель: [ФИО]
Дата начала: [дата]
Ожидаемая продолжительность: [N часов]

Удачи в обучении!
```

**CTA**: Click link in email

---

#### Step 11: Student Accesses Course
**Actor**: Student (enrolled)
**Trigger**: Login after approval

**UI State - Student Dashboard**:
- Section "Мои курсы" now shows enrolled course card:
  - Course title and thumbnail
  - Progress bar: 0% (just enrolled)
  - Status badge: "В процессе" (blue)
  - Button: "Продолжить" (primary) → goes to first assignment
  - Metadata: Start date, instructor name

**Data State**:
```
Запись на курс:
  status: 'В процессе'
  progress_percent: 0
  current_assignment: first Экземпляр задания
```

**Navigation**:
- Click "Продолжить" → Step 1 of Student Learning Flow

**Reference Pattern**: Canvas dashboard, Coursera "My Courses" page

---

### Flow Completion Criteria
✅ Student has active `Запись на курс` record
✅ All `Экземпляр задания` created with status 'Не начато'
✅ Student can access course materials
✅ Credentials provisioned (if needed for sandbox)

---

### Alternative Path: Rejection

#### Step 9-ALT: Admin Rejects
**Actor**: Admin
**Trigger**: Click [Отклонить]

**UI**: Modal dialog
- Field: "Причина отклонения" (required, text area)
- Buttons: [Отклонить заявку] [Отмена]

**Data Changes**:
```
Заявка на регистрацию:
  status: 'Отклонена'
  rejected_by: admin user ID
  rejected_date: now()
  rejection_reason: from modal
```

**Notifications**:
- Email to student: "Ваша заявка на курс отклонена"
  - Reason: [rejection_reason]
  - CTA: "Подать новую заявку" or contact support

**UI State - Student Dashboard**:
- Application card shows:
  - Status: "Отклонена" (red badge)
  - Reason displayed
  - Button: "Подать заявку снова"

---

### Edge Cases & Error Handling

1. **Email Already Exists**:
   - Step 6: Show inline error "Пользователь с таким email уже существует"
   - CTA: "Войти вместо регистрации"

2. **Course Becomes Inactive During Registration**:
   - Step 6: Before creating application, check `Шаблон курса.status`
   - If inactive: Show error "К сожалению, набор на этот курс закрыт"

3. **User Already Has Pending Application**:
   - Step 4: Check for existing `Заявка на регистрацию` with status 'Новая' or 'На согласовании'
   - If exists: Redirect to dashboard, show message "Ваша заявка уже отправлена [date]"

4. **Admin Approves But Course Instance Full**:
   - Step 9: Check `Экземпляр курса.max_students` (if defined)
   - If full: Create new cohort or show admin warning "Поток заполнен"

5. **Credential Provisioning Fails**:
   - Step 9: If external sandbox provisioning fails, mark enrollment as "Ожидает настройки"
   - Admin gets task to manually provision

---

### State Diagram

```
[Guest]
  → Browse Catalog
  → View Course Details
  → Click Enroll
  → Register Account
  → Submit Application

[Application Status: Новая]
  → Admin Review

  → [APPROVE PATH]
      → Create Enrollment
      → Provision Resources
      → Notify Student
      → [Enrolled Student]

  → [REJECT PATH]
      → Update Status
      → Notify Student
      → [Can Reapply]
```

---

## 2. Methodist Course Design Flow

### Flow Overview
**Goal**: Create reusable course template with assignments and grading rules
**Actor**: Methodist (Методист) - role with course design permissions
**Duration**: 2-4 hours for complete course design
**Success Metric**: Course template published and ready for instantiation

---

### Step 1: Methodist Dashboard
**Actor**: Methodist
**Entry Point**: Login → Methodist Cabinet

**UI State**:
- Methodist-specific dashboard with sections:
  - "Мои курсы" (courses I created)
  - "Шаблоны в разработке" (draft templates)
  - "Активные курсы" (published)
  - "Архив"
- Header actions:
  - [+ Создать курс] button (primary)
  - Search bar
- Course cards show:
  - Title, status, last edited, number of assignments
  - Actions: [Редактировать] [Дублировать] [Архивировать]

**Data Query**:
```
Entity: Шаблон курса
Filter: created_by = current_user
Order by: updated_at DESC
```

**Reference Pattern**: Canvas course creation, Moodle course management

---

### Step 2: Create New Course Template
**Actor**: Methodist
**Trigger**: Click [+ Создать курс]

**UI State**:
- Navigate to "Создание курса" wizard (multi-step form)
- Step indicator: 1. Основная информация → 2. Задания → 3. Настройки → 4. Публикация

**Step 1 Form Fields**:
- **Основная информация**:
  - Код курса * (e.g., "B3-101", unique validation)
  - Название курса * (text)
  - Краткое описание (200 chars, textarea)
  - Полное описание * (rich text editor)
  - Обложка курса (image upload, recommended size shown)
- **Характеристики**:
  - Уровень * (dropdown: Базовый | Продвинутый | Экспертный)
  - Категория (dropdown: Разработка | Администрирование | Интеграция | Аналитика)
  - Язык (dropdown: Русский | English, default RU)
  - Ожидаемая продолжительность (hours, number input)
- **Аудитория**:
  - Целевая аудитория (textarea: "Для кого этот курс?")
  - Требуемые навыки (textarea: prerequisites)
  - Цели обучения (rich text: "Что студент узнает?")

**Validation**:
- Real-time uniqueness check for `code`
- Required field indicators
- Character count for short description

**Buttons**: [Сохранить черновик] [Далее →]

**Data Changes** (on save):
```
Create Шаблон курса:
  code: from form
  title: from form
  short_description, full_description: from form
  level, category, language, duration_hours: from form
  cover_image: uploaded file
  prerequisites_text, learning_objectives, target_audience: from form
  status: 'Черновик'
  created_by: current user
  created_at, updated_at: now()
```

**Reference Pattern**: Coursera course builder, Docebo course wizard

---

### Step 3: Add Assignment Templates
**Actor**: Methodist
**Trigger**: Click [Далее →] from Step 1

**UI State**:
- Wizard Step 2: "Задания и материалы"
- Left sidebar: List of added assignments (drag to reorder)
- Main area:
  - Empty state: "Добавьте первое задание"
  - Button: [+ Добавить задание]
- Right sidebar: Tips and examples

**Action**: Click [+ Добавить задание]

**Modal Dialog - Create Assignment**:
- **Основная информация**:
  - Название задания * (text)
  - Тип задания * (dropdown):
    - Лекция (read-only material)
    - Лабораторная работа (hands-on practice)
    - Тест (quiz)
    - Проект (project submission)
  - Порядковый номер * (auto-filled, editable)
  - Обязательное (checkbox, default checked)
- **Содержание**:
  - Описание задания (rich text editor)
  - Материалы (file upload, multiple)
  - Ссылки на ресурсы (URL fields, can add multiple)
- **Оценивание** (if type != Лекция):
  - Максимальный балл * (number, default 100)
  - Критерии оценки (rich text: rubric)
  - Количество попыток (number, default 1, 0 = unlimited)
  - Автопроверка (checkbox, future feature)

**Buttons**: [Сохранить] [Отмена]

**Data Changes**:
```
Create Шаблон задания:
  course_template_id: current course
  title: from form
  type: from dropdown
  order_num: from form (or auto-increment)
  is_required: checkbox
  description: rich text
  materials: file attachments
  external_links: JSON array
  max_score: from form
  grading_criteria: rich text
  max_attempts: number
  auto_grading_enabled: boolean (future)
  created_at: now()
```

**UI After Save**:
- Assignment appears in left sidebar list
- Can click to edit
- Can drag to reorder (updates `order_num`)
- Can delete (confirmation required)

**Repeat**: Methodist adds all assignments (e.g., 5-15 assignments for full course)

**Buttons**: [← Назад] [Сохранить черновик] [Далее →]

**Reference Pattern**: Canvas modules, Moodle activities

---

### Step 4: Configure Grading Rules
**Actor**: Methodist
**Trigger**: Click [Далее →] from Step 2

**UI State**:
- Wizard Step 3: "Настройки оценивания и сертификации"
- Form fields:
  - **Правила завершения**:
    - Проходной балл (%, slider or number, default 70)
    - Обязательные задания (list with checkboxes, auto-checked for is_required=true)
    - Дополнительные требования (textarea: free text)
  - **Сертификация**:
    - Выдавать сертификат (checkbox)
    - Шаблон сертификата (dropdown: select from Шаблон сертификата)
      - Option to [+ Создать новый шаблон] (opens separate flow)
  - **Доступ**:
    - Видимость (radio):
      - Публичный (в каталоге)
      - По заявке (default)
      - Только по приглашению
    - Цена (number, optional, RUB)

**Validation**:
- `passing_score_percent`: 0-100 range
- At least one required assignment must be checked

**Data Changes** (on save):
```
Update Шаблон курса:
  passing_score_percent: from slider
  certificate_template_id: from dropdown
  visibility: from radio
  price: from input
```

**Buttons**: [← Назад] [Сохранить черновик] [Далее →]

---

### Step 5: Review and Publish
**Actor**: Methodist
**Trigger**: Click [Далее →] from Step 3

**UI State**:
- Wizard Step 4: "Предпросмотр и публикация"
- Summary view:
  - Course metadata (all from Step 1)
  - Assignment list (count, types breakdown)
  - Grading rules summary
  - Certificate template preview
- Preview modes:
  - [Предпросмотр как студент] button → opens modal with student view simulation
  - Shows how course card looks in catalog
  - Shows how course page looks

**Status Options**:
- Radio buttons:
  - ☐ Оставить в черновиках (status='Черновик')
  - ☑ Опубликовать в каталоге (status='Активен') - default
- Warning if assignments < 3: "Рекомендуется добавить минимум 3 задания"

**Buttons**: [← Назад] [Сохранить как черновик] [Опубликовать курс]

**Data Changes** (on publish):
```
Update Шаблон курса:
  status: 'Активен'
  published_at: now()
  published_by: current user
```

**System Actions**:
- If visibility='Публичный': Course appears in public catalog
- Notify admins: "Новый курс опубликован: [Title]"
- Log action in audit trail

**Navigation**: Redirect to course template detail view

---

### Step 6: Course Template Detail View
**Actor**: Methodist
**Trigger**: Successful publication

**UI State**:
- Course template detail page with tabs:
  - **Обзор**: All metadata, edit buttons
  - **Задания**: List with [+ Добавить], [Редактировать], [Удалить] for each
  - **Потоки**: List of created `Экземпляр курса` from this template
  - **Статистика**: Enrollment count, completion rate (when instances exist)
- Top actions:
  - [Редактировать курс] → reopens wizard at Step 1
  - [Дублировать] → creates copy with "(копия)" suffix
  - [Создать поток] → goes to Admin Course Launch Flow
  - [Архивировать] (if no active instances)

**Data Query**:
```
Entity: Шаблон курса (single record)
Related:
  - Шаблон задания (list)
  - Экземпляр курса (list)
  - Statistics aggregations
```

**Reference Pattern**: Canvas course settings, Moodle course administration

---

### Step 7: Save Template (Ready for Instances)
**Actor**: Methodist
**State**: Template with status='Активен'

**What Happens Next**:
- Template is now available for:
  - Admin to create `Экземпляр курса` (launch cohorts)
  - Students to view in catalog (if visibility='Публичный')
- Methodist can continue editing:
  - Add/remove assignments
  - Update descriptions
  - Change grading rules
- **Important**: Changes to template do NOT affect existing instances (instances are snapshots)

---

### Alternative Paths

#### Edit Existing Template
**Trigger**: Methodist clicks [Редактировать курс] on published template

**UI**: Reopen wizard with pre-filled data

**Warning Modal** (if active instances exist):
```
"У этого курса есть активные потоки.
Изменения НЕ повлияют на уже созданные потоки.
Новые потоки будут использовать обновленную версию.
Продолжить?"
[Да, редактировать] [Отмена]
```

**Data Changes**: Only `updated_at` timestamp changes

---

#### Duplicate Template
**Trigger**: Click [Дублировать]

**System Actions**:
1. Create new `Шаблон курса` with:
   - All fields copied
   - `code`: append "-copy" or prompt for new code
   - `title`: append "(копия)"
   - `status`: 'Черновик'
   - `created_by`: current user
   - `created_at`: now()

2. Create copies of all `Шаблон задания` records linked to new template

**Navigation**: Open new template in edit mode

---

### Edge Cases

1. **Template Saved as Draft**:
   - Not visible in catalog
   - Can continue editing anytime
   - No approval needed to publish later

2. **Delete Template**:
   - Only allowed if:
     - status='Черновик' OR
     - No related `Экземпляр курса` exist
   - Confirmation modal required
   - Cascade delete all related `Шаблон задания`

3. **Archive Template**:
   - If has instances: status='Архивирован'
   - Removed from catalog
   - Existing instances continue working
   - Can reactivate later

4. **Assignment Reordering**:
   - Drag-and-drop updates `order_num`
   - Affects only template, not instances

---

### State Transitions

```
[New Template] → status='Черновик'
  ↓ (Methodist saves)
[Draft Saved]
  ↓ (Methodist publishes)
[Active Template] → status='Активен'
  ↓ (Methodist archives)
[Archived] → status='Архивирован'
  ↓ (Can reactivate)
[Active Template]
```

---

## 3. Admin Course Launch Flow

### Flow Overview
**Goal**: Create course instance (cohort) from template and manage enrollments
**Actor**: Admin
**Duration**: 15-30 minutes
**Success Metric**: Course instance launched with enrolled students

---

### Step 1: Admin Dashboard
**Actor**: Admin
**Entry Point**: Login → Admin Cabinet

**UI State**:
- Admin dashboard sections:
  - "Активные курсы" (course instances currently running)
  - "Заявки на регистрацию" (pending enrollment requests)
  - "Запланированные курсы" (future cohorts)
  - "Статистика" (KPIs)
- Header actions:
  - [+ Запустить курс] button
  - [Управление пользователями]
  - [Настройки системы]

**KPI Widgets**:
- Total students enrolled (number)
- Pending enrollment requests (number with badge)
- Active course instances (number)
- Certificates issued this month (number)

**Data Query**:
```
Enrollment requests: count WHERE status='Новая'
Active instances: count WHERE status='Идет'
Total enrollments: count WHERE status IN ('В процессе', 'Завершен')
```

---

### Step 2: View Course Templates
**Actor**: Admin
**Trigger**: Click [+ Запустить курс]

**UI State**:
- Page: "Создание потока курса"
- Step 1: "Выберите шаблон курса"
- Table of available templates:
  - Columns: Код | Название | Уровень | Кол-во заданий | Последний поток | Действия
  - Filter by: Level, Category, Status
  - Search bar
- Each row has [Выбрать] button

**Data Query**:
```
Entity: Шаблон курса
Filter: status='Активен'
Order by: title ASC
Display: code, title, level, assignment_count, last_instance_date
```

**Reference Pattern**: Canvas course copy, Docebo session creation

---

### Step 3: Create Course Instance from Template
**Actor**: Admin
**Trigger**: Click [Выбрать] on template

**UI State**:
- Page: "Создание потока: [Template Title]"
- Form fields:
  - **Информация о потоке**:
    - Название потока (text, default: "Поток [Month Year]", editable)
    - Дата начала * (date picker)
    - Дата окончания (date picker, optional)
    - Преподаватель * (user selector, role=Teacher)
      - Dropdown with search
      - Shows: ФИО, email
    - Максимальное количество студентов (number, optional)
  - **Настройки доступа**:
    - Статус потока (dropdown):
      - Планируется (default if start_date > today)
      - Идет (default if start_date <= today)
    - Автоматическое открытие заданий (checkbox):
      - ☑ Открывать задания по расписанию
      - ☐ Все задания доступны сразу
  - **Персонализация** (optional):
    - Описание потока (textarea, can add specific details for this cohort)
    - Примечания (textarea, internal notes)

**Validation**:
- start_date required
- end_date >= start_date (if provided)
- Teacher must have Teacher role

**Buttons**: [Отмена] [Создать поток]

**Data Changes**:
```
Create Экземпляр курса:
  course_template_id: selected template
  cohort_name: from form
  start_date, end_date: from form
  teacher_id: selected user
  max_students: from form
  status: from dropdown
  auto_release_assignments: checkbox
  cohort_description: textarea
  notes: textarea
  created_by: current admin
  created_at: now()
```

**System Actions**:
- Create instance record
- Do NOT yet create enrollments (assignments created per-enrollment)

**Navigation**: Redirect to instance detail page

---

### Step 4: Course Instance Detail Page
**Actor**: Admin
**Trigger**: Instance created successfully

**UI State**:
- Page: "Поток: [Cohort Name]"
- Header:
  - Course title and cohort name
  - Status badge
  - Dates: [Start Date] - [End Date]
  - Teacher: [Name with avatar]
- Tabs:
  - **Обзор**: Instance metadata, edit option
  - **Студенты**: Enrolled students list
  - **Заявки**: Pending enrollment requests for this course
  - **Успеваемость**: Gradebook (matrix view)
  - **Настройки**: Edit instance settings
- Top actions:
  - [+ Добавить студентов] (manual enrollment)
  - [Экспорт списка]
  - [Завершить поток] (if status='Идет')

**Current State**: Zero enrollments

---

### Step 5: View Enrollment Requests
**Actor**: Admin
**Trigger**: Navigate to "Заявки" tab OR from main dashboard

**UI State**:
- Tab: "Заявки на регистрацию"
- Filter options:
  - По курсу (dropdown, can select current instance or all)
  - По статусу (dropdown: Новая | На согласовании | Одобрена | Отклонена)
  - По дате (date range picker)
- Table columns:
  - Дата заявки (date, sortable)
  - Студент (ФИО + email)
  - Организация
  - Курс (for "all courses" view)
  - Статус (badge)
  - Действия: [Одобрить] [Отклонить] [Подробнее]
- Bulk actions:
  - Checkboxes to select multiple
  - [Одобрить выбранные] [Отклонить выбранные]

**Data Query**:
```
Entity: Заявка на регистрацию
Filter:
  course_template_id: (if filtered) OR all
  status: (if filtered) OR default='Новая'
Order by: request_date DESC
Join: User (for student details)
```

**Workflow**: See Step 8-9 of Guest Registration Flow

---

### Step 6: Approve Enrollment Requests
**Actor**: Admin
**Trigger**: Click [Одобрить] on request(s)

**Data Changes** (per approval):
1. Update `Заявка на регистрацию`:
   ```
   status: 'Одобрена'
   approved_by: current admin
   approved_date: now()
   ```

2. Create `Запись на курс`:
   ```
   user_id: from application
   course_instance_id: current or selected instance
   status:
     if instance.start_date > today: 'Ожидает начала'
     else: 'В процессе'
   enrollment_date: now()
   progress_percent: 0
   total_score: 0
   ```

3. **Bulk Create `Экземпляр задания`** for each `Шаблон задания` in template:
   ```
   For each assignment_template in course_template.assignments:
     Create Экземпляр задания:
       assignment_template_id: template ID
       enrollment_id: new enrollment ID
       status: 'Не начато'
       available_from:
         if auto_release_assignments: calculate based on schedule
         else: now()
       due_date: calculate from template (if defined)
       attempts: 0
       score: null
       max_score: from template
   ```

**BPMN Trigger**: "Enrollment Provisioning" process

**System Actions**:
- Generate credentials (if course requires sandbox):
  ```
  Create credentials for student:
    URL: clone template environment
    Login: generate unique username
    Password: generate secure password
  Store in Запись на курс.credentials JSON field
  ```
- Send notification email (see Guest Flow Step 10)

**UI Feedback**:
- Success toast: "Студент [Name] зачислен на курс"
- Request row disappears from "Новая" filter
- Enrollment appears in "Студенты" tab

---

### Step 7: View Enrolled Students
**Actor**: Admin or Teacher
**Trigger**: Navigate to "Студенты" tab

**UI State**:
- Tab: "Студенты" (enrolled users)
- Table columns:
  - ФИО (clickable → student profile)
  - Email
  - Организация
  - Дата зачисления
  - Прогресс (progress bar + %)
  - Статус (badge: Ожидает начала | В процессе | Завершен | Отчислен)
  - Действия: [Профиль] [Отчислить]
- Summary stats:
  - Всего студентов: [N]
  - Активных: [N]
  - Завершили: [N]
- Actions:
  - [+ Добавить студентов] (manual enrollment without application)
  - [Экспорт в Excel]

**Data Query**:
```
Entity: Запись на курс
Filter: course_instance_id = current instance
Join: User (for student details)
Calculate: progress_percent from completed assignments
Order by: enrollment_date DESC
```

---

### Step 8: Manual Student Addition (Optional)
**Actor**: Admin
**Trigger**: Click [+ Добавить студентов]

**UI State**:
- Modal: "Добавить студентов на курс"
- Options:
  1. **Выбрать существующих пользователей**:
     - Multi-select dropdown with search
     - Shows: ФИО, email, организация
     - Filter by role (only show Students)
  2. **Пригласить по email**:
     - Text area: enter email addresses (comma or newline separated)
     - System will send invitation emails
     - If user exists: enroll directly
     - If new: send registration invite with auto-enroll
- Checkbox: "Отправить уведомление о зачислении"
- Button: [Добавить студентов]

**Data Changes**:
- For each selected user: Create `Запись на курс` (same as Step 6)
- Skip `Заявка на регистрацию` (direct enrollment)

**Validation**:
- Check `max_students` limit (if defined)
- Check for duplicate enrollments

**Notifications**:
- Email to each added student (same content as approval email)

---

### Step 9: Generate Student Credentials
**Actor**: Admin (manual) or System (automatic)
**Trigger**: After enrollment creation, if course requires sandbox

**System Process**:
1. **Check** if `Шаблон курса` has `requires_sandbox=true` (future field)
2. **Call** external sandbox provisioning API:
   ```
   POST /api/sandbox/provision
   Body: {
     course_id: template.id,
     student_id: user.id,
     template_env: "b3-basic-v1"
   }
   Response: {
     url: "https://student-123.b3-sandbox.ru",
     login: "student_123",
     password: "generated_secure_pass"
   }
   ```
3. **Store** credentials:
   ```
   Update Запись на курс:
     credentials: {
       sandbox_url: from API,
       login: from API,
       password: encrypted
     }
   ```
4. **Include** in notification email

**Admin UI**:
- In "Студенты" tab, column "Креды"
- Shows: [Созданы ✓] or [Создать] button
- Click [Создать] → triggers manual provisioning

**Error Handling**:
- If API fails: Mark enrollment `needs_provisioning=true`
- Admin gets task notification
- Student cannot start course until resolved

---

### Step 10: Launch Course (Start Teaching)
**Actor**: Admin
**Trigger**: Start date arrives OR manual trigger

**Status Change**:
```
Update Экземпляр курса:
  status: 'Идет' (from 'Планируется')
```

**System Actions**:
- Update all related `Запись на курс`:
  ```
  WHERE course_instance_id = current instance
    AND status = 'Ожидает начала'
  SET status = 'В процессе'
  ```
- Send notification to all enrolled students:
  ```
  Subject: Курс "[Title]" начинается!
  Body:
    Здравствуйте!
    Ваш курс начался. Приступайте к первому заданию.
    [Ссылка: Перейти к курсу]
  ```
- Notify teacher:
  ```
  Subject: Вы назначены преподавателем курса "[Title]"
  Body:
    [N] студентов зачислено.
    [Ссылка: Перейти к табелю]
  ```

**UI Update**:
- Dashboard shows instance with status="Идет"
- Students see "Продолжить" button enabled

---

### Alternative Paths

#### Reject Enrollment Request
See Guest Flow Step 9-ALT

---

#### Remove Student from Course
**Trigger**: Admin clicks [Отчислить] in student list

**UI**: Confirmation modal
- "Отчислить студента [Name] с курса?"
- Checkbox: "Удалить все его данные (задания, прогресс)"
- Field: "Причина отчисления" (optional, textarea)
- Buttons: [Отчислить] [Отмена]

**Data Changes**:
```
Update Запись на курс:
  status: 'Отчислен'
  withdrawal_date: now()
  withdrawal_reason: from form
  withdrawn_by: current admin

If "удалить данные" checked:
  Delete all Экземпляр задания WHERE enrollment_id = this enrollment
  Delete all Диалог records
```

**Notification**:
- Email to student: "Вы отчислены с курса [Title]"
  - Reason: [withdrawal_reason]

---

### Edge Cases

1. **Approve Request for Non-Existent Instance**:
   - Step 6: If no active instance, prompt admin to create one first
   - Auto-suggest creating instance based on template

2. **Course Full (Max Students Reached)**:
   - Step 6: Check `max_students` before creating enrollment
   - If full: Show error "Поток заполнен (max [N] студентов)"
   - Options:
     - Increase limit
     - Create new cohort
     - Reject request

3. **Duplicate Enrollment**:
   - Step 6: Check if user already enrolled in same instance
   - If duplicate: Show warning "Студент уже зачислен"
   - Prevent duplicate creation

4. **End Course Instance**:
   - Action: Admin clicks [Завершить поток]
   - Effect:
     ```
     Update Экземпляр курса:
       status: 'Завершен'
       end_date: now()
     ```
   - Trigger certificate generation for eligible students (see separate flow)

---

## 4. Student Learning Flow

### Flow Overview
**Goal**: Complete all course assignments and earn certificate
**Actor**: Student (enrolled)
**Duration**: Varies (hours to weeks depending on course)
**Success Metric**: Course completion with passing grade

---

### Step 1: Student Dashboard (Starting Point)
**Actor**: Student
**Entry Point**: Login → Student Cabinet

**UI State**:
- **Hero Section**:
  - Welcome message: "Привет, [FirstName]!"
  - Current date and time
- **Section: "Мои курсы"**:
  - Grid of course cards (2-3 columns)
  - Each card shows:
    - Course thumbnail
    - Course title
    - Teacher name (small text)
    - Progress bar with percentage
    - Status badge:
      - "Не начат" (gray, 0%)
      - "В процессе" (blue, 1-99%)
      - "Завершен" (green, 100%)
    - CTA button: **"Продолжить"** → goes to NEXT INCOMPLETE assignment
    - Secondary link: "Обзор курса"
- **Section: "Ближайшие задания"**:
  - List of upcoming deadlines (next 5):
    - Assignment title
    - Course name (if multiple courses)
    - Due date with countdown ("через 2 дня")
    - Status icon
    - Quick action: [Перейти]
- **Section: "Сообщения"**:
  - Last 3 unread messages from teachers
  - Badge count of unread
  - Link: "Все сообщения"
- **Section: "Мои сертификаты"**:
  - Cards of earned certificates
  - Empty state: "Вы пока не завершили ни один курс"

**Data Queries**:
```
Enrollments:
  Entity: Запись на курс
  Filter: user_id = current user, status IN ('В процессе', 'Завершен')
  Join: Экземпляр курса, Шаблон курса

Next assignments:
  Entity: Экземпляр задания
  Filter: enrollment.user_id = current user, status != 'Принято', due_date IS NOT NULL
  Order by: due_date ASC
  Limit: 5

Messages:
  Entity: Сообщение (from Диалог)
  Filter: recipient = current user, read = false
  Order by: sent_at DESC
  Limit: 3
```

**Reference Pattern**: Canvas Dashboard, Coursera Home

---

### Step 2: Click "Продолжить" (Continue)
**Actor**: Student
**Trigger**: Click "Продолжить" button on course card

**System Logic - Calculate Next Assignment**:
```
1. Get enrollment_id for this course + user
2. Query Экземпляр задания:
   Filter:
     enrollment_id = enrollment_id
     status IN ('Не начато', 'В работе', 'Требуется доработка')
     is_available = true (check available_from <= now())
   Order by: order_num ASC
   Limit: 1
3. If found: Navigate to assignment detail page
4. If not found (all complete): Navigate to course completion page
```

**Navigation**: Go to Step 3 (View Assignment)

**UX Benefit**: Student doesn't need to remember where they left off - system tracks progress

**Reference Pattern**: Coursera "Next" button, Udemy continue learning

---

### Step 3: View Assignment Details
**Actor**: Student
**Trigger**: Navigate to specific assignment

**UI State - Assignment Page Layout**:

**Left Sidebar** (collapsible on mobile):
- Course navigation tree:
  - Course title (header)
  - List of all assignments:
    - Assignment title
    - Status icon:
      - ⭕ Не начато (empty circle)
      - 🔵 В работе (blue circle)
      - ⏳ На проверке (clock)
      - ✅ Принято (green check)
      - ⚠️ Требуется доработка (warning)
    - Click to navigate between assignments
  - Progress indicator: "5 из 10 завершено"

**Main Content Area**:
- **Assignment Header**:
  - Assignment title (h1)
  - Type badge (Лекция | Лабораторная | Тест | Проект)
  - Deadline (if applicable): "Срок сдачи: 15 декабря 2025"
    - Color-coded:
      - Green if > 7 days
      - Yellow if 3-7 days
      - Red if < 3 days or overdue
  - Max score: "Максимум баллов: 100"
  - Attempts: "Попытка 1 из 3" (if limited)

- **Assignment Description**:
  - Rich text content (formatted HTML)
  - Embedded images, videos, code blocks
  - External links open in new tab

- **Materials Section**:
  - "Материалы для выполнения:"
  - List of attached files:
    - File icon + name + size
    - [Скачать] button for each
  - Links to external resources (docs, videos)

- **Grading Criteria** (if applicable):
  - Collapsible section: "Критерии оценки"
  - Rubric or checklist
  - Shows what teacher will evaluate

**Submission Section** (if type != Лекция):
- Box with header: "Ваше решение"
- Current status badge
- Input method based on assignment type:

  **For Лабораторная работа**:
  - Textarea: "Описание выполненной работы" (rich text)
  - File upload area:
    - Drag-and-drop zone
    - [Выбрать файлы] button
    - Multiple files allowed
    - Shows uploaded files with [Удалить] option
  - Text input: "Ссылка на стенд или репозиторий" (URL)

  **For Тест**:
  - [Начать тест] button → opens quiz interface
  - Shows: Time limit, question count, attempts remaining

  **For Проект**:
  - Similar to lab, with additional:
    - Project title field
    - Team members (if group project)

- **Action Buttons**:
  - [Сохранить черновик] (saves without submitting)
  - [Отправить на проверку] (primary CTA)
    - Disabled if no content
    - Confirmation modal: "Отправить задание на проверку? После отправки редактирование будет недоступно."

**Submission History** (if previous attempts exist):
- Collapsible section: "История попыток"
- Table of past submissions:
  - Попытка | Дата сдачи | Статус | Балл | Комментарий
- Click row to view details

**Communication Section** (bottom of page):
- Header: "Обсуждение задания"
- Thread of messages between student and teacher:
  - Avatar + name + timestamp
  - Message content
  - Attachments (if any)
- Compose box:
  - Textarea: "Задать вопрос преподавателю"
  - [Прикрепить файл] button
  - [Отправить] button
- Shows unread count badge

**Data Query**:
```
Entity: Экземпляр задания (single record)
Join:
  - Шаблон задания (for description, materials)
  - Запись на курс → Экземпляр курса → Шаблон курса (for context)
  - Диалог по заданию → Сообщение (for discussion thread)
Filter:
  id = assignment_instance_id
  enrollment.user_id = current user
```

**Reference Pattern**: Canvas assignment page, Coursera assignment view

---

### Step 4: Work on Assignment (Draft)
**Actor**: Student
**Trigger**: Start filling out submission form

**Interactions**:
- Type in textarea (auto-saves to local storage every 30 sec)
- Upload files:
  - Validate: File size < 50MB per file, max 10 files
  - File types: PDF, DOCX, ZIP, PNG, JPG, TXT, code files
  - Show upload progress bar
  - Display uploaded files with preview icons
- Paste URL (validates format)

**Data Changes** (on click [Сохранить черновик]):
```
Update Экземпляр задания:
  status: 'В работе' (if was 'Не начато')
  draft_content: {
    text: from textarea,
    files: uploaded file references,
    url: from URL field
  }
  last_saved_at: now()
```

**UI Feedback**:
- Toast: "Черновик сохранен"
- Status badge updates to "В работе"
- Left sidebar assignment icon changes to 🔵

**Auto-Save**: Background save every 2 minutes if content changed

---

### Step 5: Submit Assignment for Review
**Actor**: Student
**Trigger**: Click [Отправить на проверку]

**Validation**:
- Check required fields (at least one of: text, file, URL)
- If empty: Show error "Необходимо заполнить описание или загрузить файлы"

**Confirmation Modal**:
```
"Отправить задание на проверку?"

Вы уверены, что хотите отправить задание?
После отправки редактирование будет недоступно до получения результатов проверки.

[Отмена] [Отправить]
```

**Data Changes** (on confirm):
```
Update Экземпляр задания:
  status: 'На проверке'
  submission_content: {
    text: from form,
    files: file metadata (name, size, URL),
    url: from form
  }
  draft_content: null (clear draft)
  submitted_at: now()
  attempts: attempts + 1
```

**BPMN Trigger**: "Assignment Review" process starts

**System Actions**:
1. Create task for teacher:
   ```
   Create Задача (B3 native task entity):
     title: "Проверить задание: [Assignment Title]"
     assigned_to: teacher_id (from course instance)
     due_date: submitted_at + 3 days (configurable)
     entity_link: this assignment instance
   ```

2. Send notification to teacher:
   ```
   Email subject: "[Курс] Новое задание на проверку"
   Body:
     Студент [ФИО] сдал задание "[Assignment Title]".
     Срок проверки: [due_date]
     [Ссылка: Перейти к проверке]
   ```

3. Send confirmation to student:
   ```
   Email subject: "Ваше задание отправлено на проверку"
   Body:
     Ваше задание "[Assignment Title]" отправлено преподавателю.
     Вы получите уведомление о результатах проверки.
   ```

**UI State After Submit**:
- Assignment page shows:
  - Status badge: "На проверке" (yellow)
  - Submission content (read-only display)
  - Message: "Ваше задание отправлено преподавателю [Teacher Name]. Ожидайте результатов проверки."
  - Button: [Перейти к следующему заданию]
  - Can still send messages in discussion thread

**Navigation**:
- Auto-redirect to next assignment after 3 seconds
- Or student clicks [Перейти к следующему заданию]

---

### Step 6: Wait for Teacher Review
**Actor**: Student (passive)
**State**: Assignment status = 'На проверке'

**What Student Can Do**:
- Continue working on other assignments
- Ask questions in discussion thread (teacher notified)
- View submission history
- Check dashboard for updates

**Expected Wait Time**: 1-3 days (depends on course policy)

---

### Step 7: Receive Notification About Grade
**Actor**: Student
**Trigger**: Teacher completes grading (see Teacher Flow Step 5)

**Notification Sent**:
```
Email subject: "Задание проверено: [Assignment Title]"
Body:
  Ваше задание "[Assignment Title]" проверено.

  Результат: [Accepted/Needs Revision]
  Балл: [score] из [max_score]

  Комментарий преподавателя:
  "[feedback text]"

  [Ссылка: Посмотреть результаты]
```

**In-App Notification**:
- Bell icon in topbar gets badge count +1
- Notification list shows:
  - "Новая оценка по заданию [Title]"
  - Click to navigate to assignment

**Data State**:
```
Экземпляр задания:
  status: 'Принято' OR 'Требуется доработка'
  score: graded value
  feedback: teacher's comments
  graded_at: timestamp
  graded_by: teacher user ID
```

---

### Step 8: View Feedback
**Actor**: Student
**Trigger**: Click notification link or navigate to assignment

**UI State - Assignment Page Updates**:
- **Status Banner** (top of page):

  **If Accepted**:
  ```
  🎉 Задание принято!
  Балл: [score]/[max_score]
  ```
  (Green background)

  **If Needs Revision**:
  ```
  ⚠️ Требуется доработка
  Балл: [score]/[max_score]
  Просмотрите комментарии преподавателя и внесите исправления.
  ```
  (Yellow background)

- **Feedback Section**:
  - Header: "Результаты проверки"
  - Box with:
    - Teacher name and avatar
    - Date graded
    - Score (large font): "[score] из [max_score]"
    - Feedback text (formatted)
    - Attached files from teacher (if any)

- **Actions**:

  **If Accepted** (status='Принято'):
  - [Перейти к следующему заданию] button
  - Can view but not resubmit

  **If Needs Revision** (status='Требуется доработка'):
  - Submission form re-enabled
  - Previous submission shown in "История попыток"
  - Can edit and resubmit (if attempts remaining)
  - [Отправить исправленную версию] button

**Progress Update**:
- If accepted: Enrollment progress_percent recalculated
  ```
  progress = (count of accepted assignments) / (total required assignments) * 100
  ```
- Dashboard card updates progress bar

---

### Step 9: Resubmit (If Revision Required)
**Actor**: Student
**Trigger**: Status = 'Требуется доработка' and attempts remaining

**UI State**:
- Submission form active again
- Shows previous submission content (pre-filled)
- Can edit or replace files
- Shows attempts: "Попытка 2 из 3"

**Workflow**: Same as Step 4-5 (Submit again)

**Data Changes**:
```
Update Экземпляр задания:
  status: 'На проверке' (again)
  submission_content: updated content
  submitted_at: now()
  attempts: attempts + 1
```

**Repeat Cycle**: Goes back to Teacher review

**Max Attempts**:
- If `max_attempts` reached and still not accepted:
  - Show message: "Вы исчерпали все попытки. Свяжитесь с преподавателем."
  - Button: [Написать преподавателю]
  - Teacher can manually override and grant extra attempt

---

### Step 10: Continue to Next Assignment
**Actor**: Student
**Trigger**: Click [Перейти к следующему заданию] or "Продолжить" from dashboard

**System Logic**:
- Calculate next incomplete assignment (same as Step 2)
- If next assignment exists: Navigate to Step 3 (for new assignment)
- If all assignments complete: Navigate to Step 11 (Course Completion)

**Loop**: Student repeats Steps 3-10 for each assignment until course complete

---

### Step 11: Complete All Assignments
**Actor**: Student
**Trigger**: All required assignments have status='Принято'

**System Check**:
```
Query:
  Get all Экземпляр задания WHERE enrollment_id = current enrollment
  Count required assignments: WHERE is_required = true
  Count accepted: WHERE is_required = true AND status = 'Принято'

  If accepted_count == required_count:
    Calculate total_score = SUM(score) from all assignments
    Calculate percent = (total_score / total_possible) * 100

    If percent >= course_template.passing_score_percent:
      → Student PASSED
    Else:
      → Student FAILED (needs to redo some assignments)
```

**Data Changes** (if passed):
```
Update Запись на курс:
  status: 'Завершен'
  completion_date: now()
  final_score: calculated total
  progress_percent: 100
```

**BPMN Trigger**: "Course Completion & Certification" process

---

### Step 12: Course Completion Page
**Actor**: Student
**Trigger**: Navigate after last assignment acceptance

**UI State - Completion Page**:
- **Hero Section**:
  ```
  🎓 Поздравляем! Вы завершили курс!

  [Course Title]
  ```
  (Confetti animation or celebratory graphic)

- **Results Summary**:
  - Общий балл: [total_score] из [max_possible]
  - Процент: [percent]%
  - Дата завершения: [completion_date]
  - Преподаватель: [Teacher Name]

- **Certificate Section**:

  **If eligible** (score >= passing_score):
  ```
  Ваш сертификат готов!

  [Certificate preview image]

  [Скачать сертификат PDF] (primary button)
  [Поделиться в LinkedIn] (secondary button)
  ```

  **If not eligible**:
  ```
  К сожалению, вы не набрали проходной балл.
  Требуется: [passing_score]%, Получено: [percent]%

  Вы можете пересдать задания для улучшения результата.
  [Вернуться к заданиям]
  ```

- **Next Steps**:
  - Recommendations for follow-up courses
  - Link: [Вернуться к дашборду]
  - Link: [Оставить отзыв о курсе] (opens feedback form)

**Certificate Generation** (see separate Certificate Flow):
- System auto-generates PDF certificate
- Stores in `Экземпляр сертификата`
- Student can download anytime from profile

**Social Sharing**:
- LinkedIn integration: Pre-filled post with certificate image
- Copy shareable link to certificate verification page

---

### Alternative Paths

#### Incomplete Course (Student Drops Out)
**Trigger**: Student stops participating, doesn't complete all assignments

**Data State**:
```
Запись на курс:
  status: 'В процессе' (remains)
  progress_percent: < 100
  Some Экземпляр задания: status != 'Принято'
```

**Admin/Teacher Action**:
- Can manually mark as 'Отчислен' (withdrawn)
- Or leave as incomplete indefinitely

**Student Can**:
- Return anytime and continue (no time limit unless specified)

---

#### Failed Course (Score Below Passing)
**Trigger**: All assignments complete but total_score < passing threshold

**UI**: Completion page shows "Не зачтено" (Failed)

**Options for Student**:
1. **Retake assignments** (if allowed):
   - Teacher can reset specific assignments
   - Student re-submits to improve score

2. **Enroll in next cohort**:
   - Start over in new course instance
   - (Previous attempt stored in history)

---

#### Overdue Assignment
**Trigger**: Current date > due_date and status != 'Принято'

**UI Indicators**:
- Dashboard "Ближайшие задания": Due date shown in red with "Просрочено"
- Assignment page: Red banner "Задание просрочено! Обратитесь к преподавателю."

**System Behavior**:
- Student can still submit (soft deadline) unless teacher sets hard block
- Teacher notified of late submission
- May incur score penalty (configurable per assignment)

---

### State Diagram (Single Assignment)

```
[Не начато]
  ↓ (Student opens assignment, starts draft)
[В работе]
  ↓ (Student submits)
[На проверке]
  ↓ (Teacher reviews)

  → [Принято] (score >= threshold)
      → Next assignment or Course complete

  → [Требуется доработка] (needs improvement)
      ↓ (Student resubmits)
      → [На проверке] (loop)
          → Check max_attempts
              If exceeded: Manual teacher intervention
              Else: Re-review
```

---

## 5. Teacher Teaching Flow

### Flow Overview
**Goal**: Review student submissions, provide feedback, grade assignments, communicate with students
**Actor**: Teacher (Преподаватель)
**Duration**: Ongoing throughout course
**Success Metric**: Timely grading, student progress

---

### Step 1: Teacher Dashboard
**Actor**: Teacher
**Entry Point**: Login → Teacher Cabinet

**UI State**:
- **Hero Section**:
  - Welcome: "Привет, [Teacher Name]!"
  - Summary stats:
    - Активных курсов: [N]
    - Заданий на проверку: [N] (badge)
    - Студентов: [total enrolled across all courses]

- **Section: "Мои курсы"**:
  - List or cards of courses where teacher_id = current user
  - Each shows:
    - Course title
    - Cohort name
    - Dates (start - end)
    - Student count
    - Pending work count (assignments to grade)
    - Button: [Открыть курс]

- **Section: "На проверке"**:
  - Table of assignments awaiting review:
    - Columns: Студент | Курс | Задание | Дата сдачи | Дни на проверке | Действия
    - Sortable by date (default: oldest first)
    - Color-coded urgency:
      - Gray: < 1 day
      - Yellow: 1-3 days
      - Red: > 3 days
    - Action: [Проверить] button
  - Filter: By course, by assignment type
  - Pagination

- **Section: "Новые сообщения"**:
  - Unread student questions/messages
  - Badge count
  - Quick reply option

**Data Queries**:
```
Courses:
  Entity: Экземпляр курса
  Filter: teacher_id = current user, status = 'Идет'

Pending assignments:
  Entity: Экземпляр задания
  Join: Запись на курс, Экземпляр курса
  Filter:
    course_instance.teacher_id = current user
    status = 'На проверке'
  Order by: submitted_at ASC

Messages:
  Entity: Сообщение (from Диалог)
  Filter: recipient = current user, read = false
```

**Reference Pattern**: Canvas instructor dashboard, Moodle grading queue

---

### Step 2: Enter Course Gradebook
**Actor**: Teacher
**Trigger**: Click [Открыть курс] from dashboard

**UI State - Course Detail Page (Teacher View)**:
- Header:
  - Course title + cohort
  - Tabs: Табель | Студенты | Задания | Сообщения | Настройки
- Default tab: **Табель** (Gradebook)

**Gradebook Layout**:
- **Matrix view**: Rows = Students, Columns = Assignments
- Table structure:

  ```
  | Студент ↓ | Задание 1 | Задание 2 | ... | Итого |
  |-----------|-----------|-----------|-----|-------|
  | Иванов И. |    85     |     ?     | ... |  85%  |
  | Петров П. |    90     |    На ✓   | ... |  90%  |
  | ...       |   ...     |    ...    | ... |  ...  |
  ```

- **Cell States** (color-coded):
  - Empty (white): Не начато
  - Gray "?": В работе (draft)
  - Yellow "✓": На проверке (click to grade)
  - Green number: Принято (shows score)
  - Red number: Требуется доработка (shows current score)
  - "-": Not applicable (optional assignment, student skipped)

- **Interactive**:
  - Click any cell → opens grading modal for that assignment instance
  - Hover shows tooltip: Status, submission date
  - Sort students by: Name, Progress, Total score
  - Filter: Show only pending, show only specific assignment

- **Summary Column "Итого"**:
  - Shows student's overall progress %
  - Color-coded:
    - Green: >= passing_score
    - Yellow: 50-69%
    - Red: < 50%

**Data Query**:
```
Entity: Запись на курс (enrollments)
Filter: course_instance_id = current course
Join: User (student details)
For each enrollment:
  Get Экземпляр задания (all assignments for this enrollment)
  Display: status, score

Aggregate: Calculate progress and total score per student
```

**Reference Pattern**: Canvas SpeedGrader, Google Classroom gradebook, Brightspace grades

---

### Step 3: Select Assignment to Grade
**Actor**: Teacher
**Trigger**: Click yellow "✓" cell (status='На проверке')

**UI State - Grading Modal**:
- Modal overlay (or side panel, responsive)
- **Header**:
  - Student name + avatar
  - Assignment title
  - Submission date and time
  - Attempts: "Попытка [N] из [max_attempts]"

- **Left Panel: Submission Content**:
  - **Text Submission**:
    - Display formatted text (read-only)
    - Highlight/annotate (optional feature)
  - **Files**:
    - List of uploaded files
    - Preview button (PDF, images inline; others download)
    - [Скачать все] button (ZIP)
  - **URL**:
    - Clickable link (opens in new tab)
    - Shows: "Ссылка на стенд: [URL]"
  - **Previous Attempts** (if any):
    - Collapsible section
    - Shows history: Score, feedback, date

- **Right Panel: Grading Form**:
  - **Score Input**:
    - Number input: "Балл: _____ из [max_score]"
    - Slider (optional, visual)
    - Validation: 0 <= score <= max_score
  - **Status Selection** (radio buttons):
    - ☑ Принято (Accept)
    - ☐ Требуется доработка (Needs Revision)
  - **Feedback** (required if status = revision):
    - Rich text editor
    - Toolbar: Bold, italic, list, link
    - Can attach files (rubric, annotated docs)
    - Placeholder: "Оставьте комментарий для студента..."
  - **Private Notes** (optional):
    - Textarea: "Личные заметки (видны только преподавателям)"
  - **Quick Feedback Templates** (optional):
    - Dropdown: Common phrases
      - "Отличная работа!"
      - "Проверьте раздел X"
      - "Требуется больше деталей"

- **Action Buttons**:
  - [Отмена] (close modal)
  - [Сохранить черновик] (saves but doesn't notify student)
  - [Опубликовать оценку] (primary CTA, sends notification)

**Data Loaded**:
```
Entity: Экземпляр задания (single record)
Join:
  - Шаблон задания (for max_score, criteria)
  - Запись на курс → User (student info)
  - Previous attempts (history)
Display: submission_content, status, score, feedback
```

**Reference Pattern**: Canvas SpeedGrader, Moodle assignment grading

---

### Step 4: Provide Feedback and Score
**Actor**: Teacher
**Trigger**: Filling out grading form

**Interactions**:
- Enter score (keyboard or slider)
- Select status:
  - If "Принято": Feedback optional
  - If "Требуется доработка": Feedback required
- Type feedback in rich text editor
- Attach files if needed (e.g., marked-up PDF)
- Review grading criteria (shown as reference)

**Validation**:
- Score in valid range
- Feedback required if status = revision
- Warning if score < 50%: "Низкий балл. Требуется доработка?"

---

### Step 5: Publish Grade
**Actor**: Teacher
**Trigger**: Click [Опубликовать оценку]

**Confirmation Modal** (optional, for significant actions):
```
"Опубликовать оценку для студента [Name]?"

Балл: [score]
Статус: [status]

Студент получит уведомление по email и в системе.

[Отмена] [Опубликовать]
```

**Data Changes**:
```
Update Экземпляр задания:
  status: 'Принято' OR 'Требуется доработка'
  score: entered value
  feedback: teacher's comments
  feedback_files: attached files (if any)
  graded_at: now()
  graded_by: current teacher user ID

Update Запись на курс:
  total_score: recalculate SUM(score) from all assignments
  progress_percent: recalculate based on accepted assignments
```

**System Actions**:
1. Send notification to student (see Student Flow Step 7):
   ```
   Email subject: "Задание проверено: [Assignment Title]"
   Body: [score, status, feedback]
   ```

2. Mark teacher's task as complete:
   ```
   Update Задача (B3 task):
     status: 'Выполнена'
     completed_at: now()
   ```

3. Create message in assignment dialog:
   ```
   Create Сообщение:
     dialog_id: assignment dialog
     sender: teacher
     content: "Оценка опубликована. [feedback text]"
     sent_at: now()
   ```

**UI Feedback**:
- Modal closes
- Gradebook cell updates:
  - If accepted: Green with score
  - If revision: Red with score
- Next pending assignment auto-loads (optional, for batch grading)
- Toast: "Оценка опубликована. Студент уведомлен."

**Who Triggers Next Step**: Student (receives notification, may resubmit)

---

### Step 6: Navigate to Next Assignment
**Actor**: Teacher
**Trigger**: After publishing grade

**UI Options**:
- **Auto-advance** (optional setting):
  - Modal automatically loads next pending assignment
  - Allows rapid batch grading
  - Toggle: "Автоматически переходить к следующему" (checkbox in settings)

- **Manual navigation**:
  - Return to gradebook
  - Select next "На проверке" cell
  - Or go to dashboard "На проверке" list

**Loop**: Teacher repeats Steps 3-6 for all pending assignments

---

### Step 7: View Communication Threads
**Actor**: Teacher
**Trigger**: Navigate to "Сообщения" tab or click notification

**UI State - Messages Tab**:
- **Left Sidebar**: List of conversations
  - Filter: By course, by student
  - Each conversation shows:
    - Student name + avatar
    - Course + Assignment (context)
    - Last message preview
    - Timestamp
    - Unread badge (if unread)
  - Sort by: Recent, Unread first

- **Main Panel**: Active conversation thread
  - Header: Student name, assignment title
  - Chat-style messages:
    - Student messages: Left-aligned
    - Teacher messages: Right-aligned
    - Timestamp for each
    - Attachments displayed
  - Compose box at bottom:
    - Textarea
    - [Прикрепить файл]
    - [Отправить]

**Data Query**:
```
Entity: Диалог (by assignment or course)
Filter: related to teacher's courses
Join: Сообщение
Order by: last_message_at DESC
```

**Interaction**:
- Select conversation from list
- Read messages (marks as read)
- Type reply and send

**Data Changes** (on send):
```
Create Сообщение:
  dialog_id: current dialog
  sender: teacher user ID
  recipient: student user ID
  content: message text
  attachments: files (if any)
  sent_at: now()
  read: false

Update Диалог:
  last_message_at: now()
```

**Notification to Student**:
- Email: "Новое сообщение от преподавателя"
- In-app: Bell badge +1

**Reference Pattern**: Canvas Inbox, Slack-style messaging

---

### Step 8: Review Student Progress
**Actor**: Teacher
**Trigger**: Navigate to "Студенты" tab

**UI State - Students Tab**:
- Similar to Admin view (see Admin Flow Step 7)
- Table of enrolled students:
  - Columns: ФИО | Email | Прогресс | Последняя активность | Статус | Действия
  - Sort by: Progress (lowest first to identify struggling students)
  - Filter: At risk (progress < 30%), Completed

- **Student Detail View** (click row):
  - Sidebar or modal with:
    - Student profile info
    - Enrollment date
    - Progress breakdown by assignment:
      - List of assignments with status and score
    - Activity log: Last submission, last message
    - Communication history link
    - Action buttons:
      - [Написать сообщение]
      - [Сбросить задание] (allow resubmission)
      - [Продлить дедлайн]

**Teacher Actions**:
- **Send bulk message**: Select multiple students, [Отправить сообщение всем]
- **Grant extra attempt**: Override `max_attempts` for specific assignment
- **Extend deadline**: Update `due_date` for individual student
- **View detailed analytics**: Engagement metrics (time spent, resources accessed)

**Data Query**:
```
Entity: Запись на курс
Filter: course_instance_id = current course
Join: User, Экземпляр задания (aggregated)
Display: progress, last activity timestamp
```

---

### Step 9: Course Completion and Reporting
**Actor**: Teacher
**Trigger**: End of course period or all students complete

**UI State - Course Summary**:
- Navigate to course "Настройки" tab → "Завершение курса"
- Summary statistics:
  - Всего студентов: [N]
  - Завершили курс: [N] ([percent]%)
  - Получили сертификат: [N]
  - Средний балл: [avg]
  - Среднее время завершения: [days]
- Charts:
  - Distribution of final scores (histogram)
  - Assignment completion rates
  - Student engagement over time

- **Actions**:
  - [Экспорт отчета] (Excel or PDF)
  - [Сгенерировать сертификаты] (for eligible students)
  - [Завершить поток] (changes status to 'Завершен')

**Certificate Generation** (if not auto):
- Teacher clicks [Сгенерировать сертификаты]
- System triggers certificate generation for students where:
  - status='Завершен' AND
  - final_score >= passing_score AND
  - certificate not yet issued
- See Certificate Flow (not detailed here)

**Data Changes** (on end course):
```
Update Экземпляр курса:
  status: 'Завершен'
  end_date: now()

Update Запись на курс (for incomplete):
  WHERE course_instance_id = current
    AND status = 'В процессе'
  SET status: 'Не завершен' (or leave as-is)
```

**Notifications**:
- Email to all students: "Курс '[Title]' завершен. Спасибо за участие!"
- Include link to course feedback survey

---

### Alternative Paths

#### Reject Assignment (Extreme Case)
**Trigger**: Teacher determines submission is plagiarized or completely off-topic

**UI**: In grading modal, option "Отклонить задание"

**Effect**:
- Status: 'Отклонено' (custom status)
- Score: 0
- Feedback required: Explanation
- Student must resubmit from scratch (previous content hidden)

---

#### Batch Grading
**Trigger**: Teacher selects multiple assignments (same assignment, multiple students)

**UI**: Checkbox selection in gradebook or pending list

**Modal**: Simplified grading form
- Enter common feedback (applied to all)
- Enter scores individually or use rubric
- [Опубликовать все оценки]

**Benefit**: Faster grading for similar submissions

---

#### Request Admin Intervention
**Trigger**: Teacher encounters issue (e.g., student claims system error)

**UI**: In student detail view, [Сообщить администратору]

**System**: Creates support ticket or task for admin

---

### Edge Cases

1. **Student Submits After Teacher Started Grading**:
   - If teacher has draft grade: Show warning "Студент отправил новую версию"
   - Option to reload latest submission

2. **Multiple Teachers for One Course**:
   - Gradebook shows "Assigned to": Column indicating which teacher grades which student
   - Avoid grading conflicts (lock assignments being graded)

3. **Late Submission**:
   - Gradebook shows overdue indicator (red flag)
   - Teacher can apply late penalty (manual score adjustment)
   - Or configure auto-penalty: "Вычесть [N]% за каждый день просрочки"

4. **Student Requests Regrade**:
   - Student sends message: "Прошу пересмотреть оценку"
   - Teacher can reopen assignment: Change status to 'На проверке', re-evaluate
   - History preserved (audit trail)

---

### State Diagram (Teacher's Perspective)

```
[Assignment Submitted by Student]
  ↓ (Appears in "На проверке" list)
[Teacher Reviews]
  ↓ (Grades and provides feedback)

  → [Publish: Принято]
      → Student receives grade
      → Teacher moves to next assignment

  → [Publish: Требуется доработка]
      → Student receives feedback
      → Student resubmits
      → [Back to Teacher Reviews] (loop)

  → [Save Draft]
      → Resume later (not yet published)
```

---

## Summary of Key Interactions

### Data Flow Across Roles

```
Methodist → Creates Шаблон курса and Шаблон задания

Admin → Creates Экземпляр курса from template
      → Approves Заявка на регистрацию
      → Creates Запись на курс and Экземпляр задания (instances)

Student → Submits Экземпляр задания (changes status to 'На проверке')
        → Sends Сообщение in Диалог

Teacher → Grades Экземпляр задания (updates score, feedback, status)
        → Replies to Сообщение
        → Monitors Запись на курс progress

System → Sends notifications (emails, in-app)
       → Generates Экземпляр сертификата (when eligible)
       → Calculates progress and scores
```

---

## Status Lifecycle

### Заявка на регистрацию
```
Новая → На согласовании → Одобрена / Отклонена
```

### Запись на курс
```
Ожидает начала → В процессе → Завершен / Не завершен / Отчислен
```

### Экземпляр задания
```
Не начато → В работе → На проверке → Принято / Требуется доработка
                                         ↓
                                    (resubmit loop)
```

### Экземпляр курса
```
Планируется → Идет → Завершен
```

---

## Notification Matrix

| Trigger | Recipient | Method | Content |
|---------|-----------|--------|---------|
| Registration submitted | Admin | Email | New enrollment request |
| Application approved | Student | Email + In-app | Enrollment confirmed, credentials |
| Application rejected | Student | Email | Rejection reason |
| Course started | Student | Email | Course is live, start learning |
| Assignment submitted | Teacher | Email + Task | New submission to grade |
| Assignment graded | Student | Email + In-app | Score and feedback |
| Message sent | Recipient | Email + In-app | New message from [sender] |
| Certificate issued | Student | Email | Certificate ready for download |
| Course completed | Teacher + Admin | Email | Summary report |
| Deadline approaching | Student | Email (3 days before) | Reminder |
| Overdue assignment | Student + Teacher | Email | Alert |

---

## Alignment Check

### ✅ Matches gpt_design.md Architecture
- Template → Instance pattern used throughout
- BPMN processes at key transitions (enrollment, grading, certification)
- All entities from design document referenced

### ✅ Follows Reference Platform UX Patterns
- **Canvas**: Dashboard with "Continue" button, SpeedGrader modal
- **Coursera**: Progress tracking, next-step guidance
- **Litmos**: Approval workflows, compliance tracking
- **Absorb**: Clean card-based UI, status badges

### ✅ Uses B3 Native Capabilities
- Data model entities (справочники, документы)
- BPMN for workflows
- Tasks for teacher notifications
- Forms for all CRUD operations
- Dashboards for analytics
- Print forms for certificates

### ✅ KISS - Simplest Possible Solution
- Linear assignment progression (no complex branching initially)
- Single approval layer (no multi-level workflows)
- Essential features only (no gamification, leaderboards in v1)
- Reuse existing patterns (chat = message entity)

---

## Risks & Edge Cases Addressed

### 1. Concurrency
- **Risk**: Two teachers grade same assignment simultaneously
- **Mitigation**: Locking mechanism (B3 record locks) or "Last updated" warning

### 2. Data Integrity
- **Risk**: Enrollment deleted while assignments exist
- **Mitigation**: Cascade rules in data model, soft deletes

### 3. Scalability
- **Risk**: 1000+ students in single course = slow gradebook
- **Mitigation**: Pagination, lazy loading, indexing on key fields

### 4. Security
- **Risk**: Student accesses other student's submissions
- **Mitigation**: Row-level security (B3 permissions), enrollment_id filtering

### 5. Offline Work
- **Risk**: Student drafts lost if browser crashes
- **Mitigation**: Auto-save to local storage, sync on reconnect

### 6. Email Deliverability
- **Risk**: Critical notifications not received
- **Mitigation**: In-app notifications as backup, admin dashboard for failed emails

---

## Next Steps (After Flow Documentation)

1. **Wireframes**: Create detailed UI mockups for each screen
2. **BPMN Diagrams**: Visual process flows for each workflow
3. **API Specs**: Define RESTQL queries for each data operation
4. **Permission Matrix**: Detailed CRUD permissions per role per entity
5. **Test Scenarios**: End-to-end test cases for each flow

---

## End of User Flows v1

**Status**: Ready for critique
**Next**: Review for over-engineering, missing cases, B3 capability mismatches
