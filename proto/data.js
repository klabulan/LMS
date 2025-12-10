// B3 Learning Portal - Mock Data (v2 - Improved)
// Aligned with critique feedback and complete data model

window.LMSData = {};

// ============================================================================
// 1. USERS (All 5 Roles)
// ============================================================================

LMSData.mockUsers = {
  guest: {
    id: "guest",
    name: "Гость",
    email: null,
    role: "guest",
    organization: null,
    department: null,
    position: null,
    isActive: false
  },
  student: {
    id: "student-1",
    name: "Иван Студентов",
    email: "ivan.studentov@example.com",
    role: "student",
    organization: "ООО «Ромашка»",
    department: "ИТ-отдел",
    position: "Младший разработчик",
    isActive: true
  },
  methodist: {
    id: "methodist-1",
    name: "Мария Методист",
    email: "maria.metodist@example.com",
    role: "methodist",
    organization: "B3 Training Center",
    department: "Методический отдел",
    position: "Старший методист",
    isActive: true
  },
  teacher: {
    id: "teacher-1",
    name: "Анна Преподаватель",
    email: "anna.teacher@example.com",
    role: "teacher",
    organization: "B3 Training Center",
    department: "Учебный отдел",
    position: "Преподаватель-эксперт",
    isActive: true
  },
  admin: {
    id: "admin-1",
    name: "Сергей Администратор",
    email: "sergey.admin@example.com",
    role: "admin",
    organization: "B3 Training Center",
    department: "Администрирование",
    position: "Системный администратор",
    isActive: true
  },
  // Additional students for gradebook demo
  student2: {
    id: "student-2",
    name: "Мария Новичкова",
    email: "maria.novichkova@example.com",
    role: "student",
    organization: "ООО «Василёк»",
    department: "Бухгалтерия",
    position: "Бухгалтер",
    isActive: true
  },
  student3: {
    id: "student-3",
    name: "Петр Желающий",
    email: "petr.zhelayushchy@example.com",
    role: "student",
    organization: "ИП Иванов",
    department: null,
    position: "Предприниматель",
    isActive: true
  }
};

// ============================================================================
// 2. COURSE TEMPLATES
// ============================================================================

LMSData.courseTemplates = [
  {
    id: "tpl-basic",
    title: "Основы платформы B3",
    code: "B3-BASIC-101",
    level: "basic",
    description: "Пошаговый курс по основным понятиям платформы B3: объекты данных, интерфейсы, процессы. Подходит для начинающих пользователей без опыта работы с low-code платформами.",
    targetAudience: "Разработчики, аналитики, методисты без опыта работы с B3",
    prerequisites: "Базовые знания реляционных БД и HTML",
    status: "published",
    accessibility: "public",
    certificateThreshold: 70,
    estimatedHours: 40,
    requiresSandbox: true,
    category: "Разработка",
    certificateTemplateId: "cert-tpl-basic",
    createdBy: "methodist-1",
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2025-12-05T14:30:00Z"
  },
  {
    id: "tpl-advanced",
    title: "Продвинутые сценарии на B3",
    code: "B3-ADV-201",
    level: "advanced",
    description: "Работа с интеграциями, RESTQL, подготовка витрин и сложных интерфейсов. Курс для опытных пользователей B3.",
    targetAudience: "Разработчики B3 с опытом работы 3+ месяца",
    prerequisites: "Прохождение курса B3-BASIC-101 или эквивалентный опыт",
    status: "published",
    accessibility: "public",
    certificateThreshold: 80,
    estimatedHours: 60,
    requiresSandbox: true,
    category: "Разработка",
    certificateTemplateId: "cert-tpl-advanced",
    createdBy: "methodist-1",
    createdAt: "2025-11-15T09:00:00Z",
    updatedAt: "2025-12-01T11:20:00Z"
  }
];

// ============================================================================
// 3. ASSIGNMENT TEMPLATES
// ============================================================================

LMSData.assignmentTemplates = [
  // Basic course assignments
  {
    id: "a-intro",
    courseTemplateId: "tpl-basic",
    title: "Знакомство с порталом",
    type: "lecture",
    deliveryMode: "in_person",  // Очное занятие
    module: "Введение",
    order: 1,
    description: "Ознакомьтесь с учебным порталом, заполните свой профиль и получите доступ к лабораторному стенду.",
    materials: [
      { type: "video", title: "Обзор портала", url: "#video-intro" },
      { type: "pdf", title: "Руководство пользователя", url: "#guide.pdf" }
    ],
    maxScore: 100,
    durationDays: 1,
    isMandatory: true,
    submissionType: ["text"],
    autoGrade: false,
    startCondition: "course_start",
    startOffset: 0
  },
  {
    id: "a-objects",
    courseTemplateId: "tpl-basic",
    title: "Создание первого справочника",
    type: "lab",
    deliveryMode: "self_study",  // Самостоятельное
    module: "Основы объектной модели",
    order: 2,
    description: "Создайте в B3 справочник «Курс» с полями: Код, Название, Тип, Преподаватель. Настройте форму просмотра и списка.",
    materials: [
      { type: "doc", title: "Методичка по справочникам", url: "#doc-objects" },
      { type: "video", title: "Видео: Создание справочника", url: "#video-objects" }
    ],
    maxScore: 100,
    durationDays: 3,
    isMandatory: true,
    submissionType: ["text", "file", "link"],
    autoGrade: false,
    startCondition: "prev_complete",
    startOffset: 0
  },
  {
    id: "a-process",
    courseTemplateId: "tpl-basic",
    title: "Простой бизнес-процесс BPMN",
    type: "lab",
    deliveryMode: "in_person",  // Очное занятие с преподавателем
    module: "Процессы и автоматизация",
    order: 3,
    description: "Постройте BPMN-процесс обработки заявок на курс: старт → проверка админом → одобрение/отклонение → уведомление.",
    materials: [
      { type: "doc", title: "Основы BPMN в B3", url: "#doc-bpmn" }
    ],
    maxScore: 100,
    durationDays: 7,
    isMandatory: true,
    submissionType: ["text", "file"],
    autoGrade: false,
    startCondition: "prev_complete",
    startOffset: 0
  },
  {
    id: "a-interfaces",
    courseTemplateId: "tpl-basic",
    title: "Построение интерфейса формы",
    type: "lab",
    deliveryMode: "self_study",
    module: "Пользовательские интерфейсы",
    order: 4,
    description: "Создайте форму редактирования справочника с валидацией полей и вычисляемыми значениями.",
    materials: [],
    maxScore: 100,
    durationDays: 10,
    isMandatory: false,
    submissionType: ["file", "link"],
    autoGrade: false,
    startCondition: "prev_complete",
    startOffset: 0
  },
  // Advanced course assignments
  {
    id: "a-rest",
    courseTemplateId: "tpl-advanced",
    title: "RESTQL-запросы к внешним системам",
    type: "lab",
    deliveryMode: "self_study",
    module: "Интеграции",
    order: 1,
    description: "Настройте интеграцию с внешней системой через RESTQL. Реализуйте получение данных и обработку ошибок.",
    materials: [
      { type: "doc", title: "RESTQL API Reference", url: "#restql-docs" }
    ],
    maxScore: 100,
    durationDays: 5,
    isMandatory: true,
    submissionType: ["text", "file"],
    autoGrade: false,
    startCondition: "course_start",
    startOffset: 0
  },
  {
    id: "a-dashboard",
    courseTemplateId: "tpl-advanced",
    title: "Создание дашборда успеваемости",
    type: "project",
    deliveryMode: "self_study",
    module: "Аналитика и отчёты",
    order: 2,
    description: "Создайте аналитическую панель для отображения прогресса студентов с графиками и фильтрами.",
    materials: [],
    maxScore: 100,
    durationDays: 10,
    isMandatory: true,
    submissionType: ["link", "file"],
    autoGrade: false,
    startCondition: "prev_complete",
    startOffset: 0
  }
];

// ============================================================================
// 4. COURSE INSTANCES
// ============================================================================

LMSData.courseInstances = [
  {
    id: "ci-basic-2025",
    courseTemplateId: "tpl-basic",
    teacherId: "teacher-1",
    cohort: "2025-Q4-CORP",
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    status: "active",
    createdAt: "2025-11-25T10:00:00Z"
  },
  {
    id: "ci-advanced-2025",
    courseTemplateId: "tpl-advanced",
    teacherId: "teacher-1",
    cohort: "2026-Q1-CORP",
    startDate: "2026-01-15",
    endDate: "2026-04-15",
    status: "planned",
    createdAt: "2025-11-30T14:00:00Z"
  },
  {
    id: "ci-advanced-future",
    courseTemplateId: "tpl-advanced",
    teacherId: "teacher-1",
    cohort: "Группа февраль 2026",
    startDate: "2026-02-01",
    endDate: "2026-04-30",
    status: "planned",
    createdAt: "2025-12-05T10:00:00Z"
  }
];

// ============================================================================
// 5. ENROLLMENTS (with allocated resources!)
// ============================================================================

LMSData.enrollments = [
  {
    id: "enr-1",
    studentId: "student-1",
    courseInstanceId: "ci-basic-2025",
    status: "in_progress",
    progress: 66,
    totalScore: 200,
    allocatedResources: "Учебный стенд B3\nURL: https://sandbox.b3.example.com/instance-001\nЛогин: student001\nПароль: TempPass_2025_Abc!\nДействует до: 01.03.2026",
    enrolledAt: "2025-12-01T10:00:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-09T16:45:00Z"
  },
  {
    id: "enr-2",
    studentId: "student-1",
    courseInstanceId: "ci-advanced-2025",
    status: "not_started",
    progress: 0,
    totalScore: 0,
    allocatedResources: "Учебный стенд B3\nURL: https://sandbox.b3.example.com/instance-002\nЛогин: student001_adv\nПароль: AdvPass_2026_Xyz#\nДействует до: 01.05.2026",
    enrolledAt: "2025-12-05T11:00:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-05T11:00:00Z"
  },
  {
    id: "enr-3",
    studentId: "student-3",
    courseInstanceId: "ci-advanced-2025",
    status: "not_started",
    progress: 0,
    totalScore: 0,
    allocatedResources: "Учебный стенд B3\nURL: https://sandbox.b3.example.com/instance-003\nЛогин: student003\nПароль: Pass_Petr_2026!\nДействует до: 01.05.2026",
    enrolledAt: "2025-12-06T12:00:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-06T12:00:00Z"
  },
  {
    id: "enr-pending-1",
    studentId: "student-1",
    courseInstanceId: "ci-advanced-future",
    status: "pending_approval",
    requestComment: "Хочу повысить квалификацию по платформе B3. Прошел базовый курс с оценкой 95%.",
    progress: 0,
    totalScore: 0,
    allocatedResources: null,
    enrolledAt: "2025-12-10T09:30:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-10T09:30:00Z"
  },
  {
    id: "enr-pending-2",
    studentId: "student-2",
    courseInstanceId: "ci-advanced-future",
    status: "pending_approval",
    requestComment: "Хочу изучить продвинутые возможности B3 для корпоративного проекта.",
    progress: 0,
    totalScore: 0,
    allocatedResources: null,
    enrolledAt: "2025-12-09T14:20:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-09T14:20:00Z"
  },
  {
    id: "enr-approved-1",
    studentId: "student-3",
    courseInstanceId: "ci-advanced-future",
    status: "approved",
    requestComment: "Готов к обучению, опыт работы с B3 6 месяцев.",
    approvedBy: "admin-1",
    approvedAt: "2025-12-08T11:00:00Z",
    approvalComment: "Одобрено. Опыт работы подтвержден.",
    progress: 0,
    totalScore: 0,
    allocatedResources: "Учебный стенд B3\nURL: https://sandbox.b3.example.com/instance-future-003\nЛогин: student003_adv\nПароль: FutPass_2026_Xyz#\nДействует до: 01.05.2026",
    enrolledAt: "2025-12-07T10:00:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-08T11:00:00Z"
  },
  {
    id: "enr-rejected-1",
    studentId: "student-2",
    courseInstanceId: "ci-advanced-2025",
    status: "rejected",
    requestComment: "Хочу пройти продвинутый курс для повышения квалификации.",
    approvedBy: "admin-1",
    approvedAt: "2025-12-06T15:30:00Z",
    approvalComment: "Отклонено. Необходимо сначала завершить базовый курс.",
    progress: 0,
    totalScore: 0,
    allocatedResources: null,
    enrolledAt: "2025-12-06T09:15:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-06T15:30:00Z"
  },
  // Additional enrollment for ci-advanced-future to demonstrate rejected status
  {
    id: "enr-rejected-future-1",
    studentId: "student-2",
    courseInstanceId: "ci-advanced-future",
    status: "rejected",
    requestComment: "Планирую пройти курс в феврале 2026.",
    approvedBy: "teacher-1",
    approvedAt: "2025-12-09T16:45:00Z",
    approvalComment: "Отклонено. Недостаточный опыт работы с платформой B3. Рекомендуется сначала пройти базовый курс.",
    progress: 0,
    totalScore: 0,
    allocatedResources: null,
    enrolledAt: "2025-12-09T10:20:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-09T16:45:00Z"
  },
  // Draft enrollment (created status) - student saved but not submitted
  {
    id: "enr-created-1",
    studentId: "student-2",
    courseInstanceId: "ci-basic-2025",
    status: "created",
    requestComment: "Хочу начать изучение платформы B3",
    progress: 0,
    totalScore: 0,
    allocatedResources: null,
    enrolledAt: "2025-12-10T08:00:00Z",
    completedAt: null,
    lastActivityAt: "2025-12-10T08:00:00Z"
  }
];

// ============================================================================
// 7. ASSIGNMENT INSTANCES (various statuses)
// ============================================================================

LMSData.assignmentInstances = [
  // Student 1 - Basic course
  {
    id: "ai-1-intro",
    enrollmentId: "enr-1",
    assignmentTemplateId: "a-intro",
    courseInstanceId: "ci-basic-2025",
    studentId: "student-1",
    status: "accepted",
    submissionText: "Ознакомился с порталом, заполнил профиль. Доступ к стенду получен и протестирован.",
    submissionFiles: [],
    submissionUrl: null,
    grade: 100,
    feedback: "Отличное начало! Спасибо за обратную связь.",
    submittedAt: "2025-12-01T15:30:00Z",
    gradedAt: "2025-12-01T16:00:00Z",
    gradedBy: "teacher-1",
    attemptCount: 1
  },
  {
    id: "ai-1-objects",
    enrollmentId: "enr-1",
    assignmentTemplateId: "a-objects",
    courseInstanceId: "ci-basic-2025",
    studentId: "student-1",
    status: "accepted",
    submissionText: "Создан справочник 'Курс', настроены поля и базовая форма просмотра. Добавлена валидация обязательных полей.",
    submissionFiles: [
      { id: "f1", name: "screenshot_справочник.png", size: "245 KB", url: "#file-1" },
      { id: "f2", name: "описание_модели.docx", size: "32 KB", url: "#file-2" }
    ],
    submissionUrl: "https://sandbox.b3.example.com/instance-001/course-dict",
    grade: 100,
    feedback: "Отлично! Структура данных корректна, форма настроена правильно.",
    submittedAt: "2025-12-02T18:42:00Z",
    gradedAt: "2025-12-03T10:15:00Z",
    gradedBy: "teacher-1",
    attemptCount: 1
  },
  {
    id: "ai-1-process",
    enrollmentId: "enr-1",
    assignmentTemplateId: "a-process",
    courseInstanceId: "ci-basic-2025",
    studentId: "student-1",
    status: "submitted",
    submissionText: "Построен BPMN-процесс с 3 этапами: подача заявки, проверка, отправка уведомления. Процесс протестирован на тестовых данных.",
    submissionFiles: [
      { id: "f3", name: "bpmn_diagram.png", size: "180 KB", url: "#file-3" }
    ],
    submissionUrl: null,
    grade: null,
    feedback: null,
    submittedAt: "2025-12-08T20:15:00Z",
    gradedAt: null,
    gradedBy: null,
    attemptCount: 1
  },
  {
    id: "ai-1-interfaces",
    enrollmentId: "enr-1",
    assignmentTemplateId: "a-interfaces",
    courseInstanceId: "ci-basic-2025",
    studentId: "student-1",
    status: "draft",
    submissionText: "",
    submissionFiles: [],
    submissionUrl: null,
    grade: null,
    feedback: null,
    submittedAt: null,
    gradedAt: null,
    gradedBy: null,
    attemptCount: 0
  },
  // Student 1 - Advanced course
  {
    id: "ai-2-rest",
    enrollmentId: "enr-2",
    assignmentTemplateId: "a-rest",
    courseInstanceId: "ci-advanced-2025",
    studentId: "student-1",
    status: "draft",
    submissionText: "",
    submissionFiles: [],
    submissionUrl: null,
    grade: null,
    feedback: null,
    submittedAt: null,
    gradedAt: null,
    gradedBy: null,
    attemptCount: 0
  },
  {
    id: "ai-2-dashboard",
    enrollmentId: "enr-2",
    assignmentTemplateId: "a-dashboard",
    courseInstanceId: "ci-advanced-2025",
    studentId: "student-1",
    status: "draft",
    submissionText: "",
    submissionFiles: [],
    submissionUrl: null,
    grade: null,
    feedback: null,
    submittedAt: null,
    gradedAt: null,
    gradedBy: null,
    attemptCount: 0
  },
  // Student 3 - Advanced course
  {
    id: "ai-3-rest",
    enrollmentId: "enr-3",
    assignmentTemplateId: "a-rest",
    courseInstanceId: "ci-advanced-2025",
    studentId: "student-3",
    status: "needs_revision",
    submissionText: "Настроил RESTQL запрос к API, но возникают ошибки при обработке пустых ответов.",
    submissionFiles: [],
    submissionUrl: null,
    grade: 65,
    feedback: "Базовая логика есть, но нужно добавить обработку ошибок и проверку на null. Посмотрите пример в методичке раздел 3.2.",
    submittedAt: "2025-12-07T14:20:00Z",
    gradedAt: "2025-12-08T09:30:00Z",
    gradedBy: "teacher-1",
    attemptCount: 1
  }
];

// ============================================================================
// 8. DIALOGS (course-level AND assignment-level)
// ============================================================================

LMSData.dialogs = [
  {
    id: "dlg-course-basic",
    type: "course",
    referenceId: "ci-basic-2025",
    courseId: "ci-basic-2025",
    participants: ["student-1", "student-2", "teacher-1"],
    isArchived: false,
    createdAt: "2025-12-01T10:00:00Z",
    lastMessageAt: "2025-12-08T18:30:00Z"
  },
  {
    id: "dlg-assign-objects",
    type: "assignment",
    referenceId: "ai-1-objects",
    courseId: "ci-basic-2025",
    participants: ["student-1", "teacher-1"],
    isArchived: false,
    createdAt: "2025-12-02T18:42:00Z",
    lastMessageAt: "2025-12-03T10:20:00Z"
  },
  {
    id: "dlg-assign-process",
    type: "assignment",
    referenceId: "ai-1-process",
    courseId: "ci-basic-2025",
    participants: ["student-1", "teacher-1"],
    isArchived: false,
    createdAt: "2025-12-08T20:15:00Z",
    lastMessageAt: "2025-12-08T20:15:00Z"
  }
];

// ============================================================================
// 9. MESSAGES
// ============================================================================

LMSData.messages = [
  // Course-level dialog
  {
    id: "msg-1",
    dialogId: "dlg-course-basic",
    authorId: "teacher-1",
    text: "Добро пожаловать на курс! Если возникнут вопросы, задавайте их здесь.",
    attachments: [],
    isRead: true,
    createdAt: "2025-12-01T10:00:00Z",
    editedAt: null
  },
  {
    id: "msg-2",
    dialogId: "dlg-course-basic",
    authorId: "student-1",
    text: "Спасибо! Подскажите, сколько времени обычно занимает проверка заданий?",
    attachments: [],
    isRead: true,
    createdAt: "2025-12-02T12:30:00Z",
    editedAt: null
  },
  {
    id: "msg-3",
    dialogId: "dlg-course-basic",
    authorId: "teacher-1",
    text: "Обычно 1-2 рабочих дня. Если задание сложное, могу проверить быстрее по запросу.",
    attachments: [],
    isRead: true,
    createdAt: "2025-12-02T14:15:00Z",
    editedAt: null
  },
  // Assignment-level dialog
  {
    id: "msg-4",
    dialogId: "dlg-assign-objects",
    authorId: "student-1",
    text: "Не уверен, правильно ли сделал связь с пользователем-преподавателем. Можете проверить?",
    attachments: [],
    isRead: true,
    createdAt: "2025-12-02T18:42:00Z",
    editedAt: null
  },
  {
    id: "msg-5",
    dialogId: "dlg-assign-objects",
    authorId: "teacher-1",
    text: "Связь сделана корректно! На следующем шаге добавим роли и права доступа.",
    attachments: [],
    isRead: true,
    createdAt: "2025-12-03T10:15:00Z",
    editedAt: null
  },
  {
    id: "msg-6",
    dialogId: "dlg-assign-objects",
    authorId: "student-1",
    text: "Понял, спасибо!",
    attachments: [],
    isRead: true,
    createdAt: "2025-12-03T10:20:00Z",
    editedAt: null
  }
];

// ============================================================================
// 10. CERTIFICATE TEMPLATES
// ============================================================================

LMSData.certificateTemplates = [
  {
    id: "cert-tpl-basic",
    courseTemplateId: "tpl-basic",
    title: "Сертификат об окончании курса «Основы платформы B3»",
    layout: `
      <div class="certificate">
        <h1>Сертификат</h1>
        <p>Настоящим подтверждается, что</p>
        <h2>{{student_name}}</h2>
        <p>успешно завершил(а) курс</p>
        <h3>{{course_title}}</h3>
        <p>Итоговая оценка: {{final_score}}%</p>
        <p>Дата выдачи: {{issue_date}}</p>
        <p>Серийный номер: {{serial_number}}</p>
        <div class="signatures">
          <div>{{signatory_1_name}}<br>{{signatory_1_title}}</div>
        </div>
      </div>
    `,
    requiredScore: 70,
    signatories: [
      { name: "Анна Преподаватель", title: "Ведущий преподаватель" }
    ],
    createdAt: "2025-11-01T10:00:00Z"
  },
  {
    id: "cert-tpl-advanced",
    courseTemplateId: "tpl-advanced",
    title: "Сертификат эксперта по платформе B3",
    layout: `
      <div class="certificate expert">
        <h1>Сертификат эксперта</h1>
        <p>Настоящим подтверждается, что</p>
        <h2>{{student_name}}</h2>
        <p>успешно завершил(а) продвинутый курс</p>
        <h3>{{course_title}}</h3>
        <p>с итоговой оценкой {{final_score}}% и получает статус <strong>эксперта B3</strong></p>
        <p>Дата выдачи: {{issue_date}}</p>
        <p>Серийный номер: {{serial_number}}</p>
      </div>
    `,
    requiredScore: 80,
    signatories: [
      { name: "Анна Преподаватель", title: "Ведущий преподаватель" },
      { name: "Мария Методист", title: "Методист-эксперт" }
    ],
    createdAt: "2025-11-15T09:00:00Z"
  }
];

// ============================================================================
// 11. CERTIFICATES
// ============================================================================

LMSData.certificates = [
  {
    id: "cert-001",
    studentId: "student-1",
    courseInstanceId: "ci-basic-2025",
    certificateTemplateId: "cert-tpl-basic",
    serialNumber: "B3-BASIC-2025-001",
    issuedAt: "2025-11-28T12:00:00Z",
    pdfUrl: "#mock-certificate-001.pdf",
    verificationCode: "VERIFY-B3-001-ABC123"
  }
];

// ============================================================================
// 12. NOTIFICATIONS (for different roles)
// ============================================================================

LMSData.notifications = [
  // Student notifications
  {
    id: "n1",
    userId: "student-1",
    title: "Задание принято",
    message: "Задание «Создание первого справочника» принято с оценкой 100",
    type: "success",
    link: "#assignment-a-objects",
    isRead: true,
    createdAt: "2025-12-03T10:15:00Z"
  },
  {
    id: "n2",
    userId: "student-1",
    title: "Новый комментарий к заданию",
    message: "Преподаватель оставил комментарий к заданию «Создание первого справочника»",
    type: "info",
    link: "#assignment-a-objects",
    isRead: false,
    createdAt: "2025-12-03T10:20:00Z"
  },
  {
    id: "n3",
    userId: "student-1",
    title: "Приближается дедлайн",
    message: "До окончания срока сдачи задания «Простой бизнес-процесс BPMN» осталось 2 дня",
    type: "warning",
    link: "#assignment-a-process",
    isRead: false,
    createdAt: "2025-12-07T09:00:00Z"
  },
  // Teacher notifications
  {
    id: "n4",
    userId: "teacher-1",
    title: "Новая работа на проверку",
    message: "Иван Студентов сдал задание «Простой бизнес-процесс BPMN»",
    type: "info",
    link: "#grade-ai-1-process",
    isRead: false,
    createdAt: "2025-12-08T20:15:00Z"
  },
  {
    id: "n5",
    userId: "teacher-1",
    title: "Вопрос в общем чате курса",
    message: "Иван Студентов задал вопрос в обсуждении курса B3-BASIC-101",
    type: "info",
    link: "#course-chat-ci-basic-2025",
    isRead: false,
    createdAt: "2025-12-02T12:30:00Z"
  },
  // Admin notifications
  {
    id: "n6",
    userId: "admin-1",
    title: "Новая заявка на курс",
    message: "Мария Новичкова подала заявку на курс B3-BASIC-101",
    type: "warning",
    link: "#enrollment-request-er-1",
    isRead: false,
    createdAt: "2025-12-08T14:30:00Z"
  },
  {
    id: "n7",
    userId: "admin-1",
    title: "Заявка одобрена",
    message: "Вы одобрили заявку Петра Желающего на курс B3-ADV-201",
    type: "success",
    link: "#enrollment-request-er-2",
    isRead: true,
    createdAt: "2025-12-06T10:30:00Z"
  },
  // Methodist notifications
  {
    id: "n8",
    userId: "methodist-1",
    title: "Создан новый экземпляр курса",
    message: "Преподаватель Анна создала экземпляр вашего курса B3-BASIC-101",
    type: "info",
    link: "#course-instance-ci-basic-2025",
    isRead: true,
    createdAt: "2025-11-25T10:00:00Z"
  }
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// --- Course & Template Helpers ---

LMSData.getCourseTemplate = function(id) {
  return LMSData.courseTemplates.find(t => t.id === id);
};

LMSData.getCourseInstance = function(id) {
  return LMSData.courseInstances.find(ci => ci.id === id);
};

LMSData.getCourseWithInstance = function(instanceId) {
  const instance = LMSData.getCourseInstance(instanceId);
  if (!instance) return null;
  const template = LMSData.getCourseTemplate(instance.courseTemplateId);
  if (!template) return null;
  return { ...template, ...instance, templateId: instance.courseTemplateId };
};

LMSData.getAssignmentTemplate = function(id) {
  return LMSData.assignmentTemplates.find(at => at.id === id);
};

LMSData.getAssignmentTemplatesForCourse = function(courseTemplateId) {
  return LMSData.assignmentTemplates.filter(at => at.courseTemplateId === courseTemplateId);
};

// --- Enrollment Helpers ---

LMSData.getEnrollment = function(instanceId, studentId) {
  return LMSData.enrollments.find(
    e => e.courseInstanceId === instanceId && e.studentId === studentId
  );
};

LMSData.getEnrollmentsByStudent = function(studentId) {
  return LMSData.enrollments.filter(e => e.studentId === studentId);
};

LMSData.getEnrollmentsByCourse = function(instanceId) {
  return LMSData.enrollments.filter(e => e.courseInstanceId === instanceId);
};

// --- Assignment Instance Helpers ---

LMSData.getAssignmentInstance = function(instanceId, assignmentId, studentId) {
  return LMSData.assignmentInstances.find(
    ai => ai.courseInstanceId === instanceId &&
          ai.assignmentTemplateId === assignmentId &&
          ai.studentId === studentId
  );
};

LMSData.getAssignmentInstanceById = function(id) {
  return LMSData.assignmentInstances.find(ai => ai.id === id);
};

LMSData.getAssignmentInstancesForEnrollment = function(enrollmentId) {
  return LMSData.assignmentInstances.filter(ai => ai.enrollmentId === enrollmentId);
};

LMSData.getAssignmentInstancesForCourse = function(instanceId) {
  return LMSData.assignmentInstances.filter(ai => ai.courseInstanceId === instanceId);
};

// --- Enrollment Request Helpers (Updated for new workflow) ---

LMSData.getPendingApprovalEnrollments = function() {
  return LMSData.enrollments.filter(e => e.status === 'pending_approval');
};

LMSData.approveEnrollment = function(enrollmentId, approvedBy, comment) {
  const enrollment = LMSData.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return false;

  const instance = LMSData.getCourseInstance(enrollment.courseInstanceId);
  const template = LMSData.getCourseTemplate(instance.courseTemplateId);

  enrollment.status = 'approved';
  enrollment.approvedBy = approvedBy;
  enrollment.approvedAt = new Date().toISOString();
  enrollment.approvalComment = comment || 'Заявка одобрена';

  // Allocate resources if sandbox is required
  if (template.requiresSandbox) {
    const expireDate = new Date();
    expireDate.setMonth(expireDate.getMonth() + 3);
    const expireDateStr = expireDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });

    enrollment.allocatedResources = `Учебный стенд B3\nURL: https://sandbox.b3.example.com/instance-${Date.now()}\nЛогин: student${Date.now()}\nПароль: Pass_${Date.now()}_Auto!\nДействует до: ${expireDateStr}`;
  }

  return true;
};

LMSData.rejectEnrollment = function(enrollmentId, approvedBy, reason) {
  const enrollment = LMSData.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return false;

  enrollment.status = 'rejected';
  enrollment.approvedBy = approvedBy;
  enrollment.approvedAt = new Date().toISOString();
  enrollment.approvalComment = reason;
  return true;
};

// --- Dialog Helpers ---

LMSData.getDialogsByType = function(type, referenceId) {
  return LMSData.dialogs.filter(d => d.type === type && d.referenceId === referenceId);
};

LMSData.getDialogsByCourse = function(courseId) {
  return LMSData.dialogs.filter(d => d.courseId === courseId);
};

LMSData.getMessagesForDialog = function(dialogId) {
  return LMSData.messages.filter(m => m.dialogId === dialogId);
};

// --- Notification Helpers ---

LMSData.getUserNotifications = function(userId) {
  return LMSData.notifications.filter(n => n.userId === userId);
};

LMSData.getUnreadNotificationCount = function(userId) {
  return LMSData.notifications.filter(n => n.userId === userId && !n.isRead).length;
};

LMSData.markNotificationRead = function(notificationId) {
  const n = LMSData.notifications.find(n => n.id === notificationId);
  if (n) n.isRead = true;
};

LMSData.markAllNotificationsRead = function(userId) {
  LMSData.notifications
    .filter(n => n.userId === userId)
    .forEach(n => n.isRead = true);
};

// --- User Helpers ---

LMSData.getUserById = function(userId) {
  return Object.values(LMSData.mockUsers).find(u => u.id === userId);
};

// ============================================================================
// FORMATTERS
// ============================================================================

LMSData.formatStatusLabel = function(status) {
  const labels = {
    not_started: "Не начат",
    in_progress: "В процессе",
    completed: "Завершён",
    dropped: "Отчислен",
    created: "Создана",
    pending_approval: "Ожидает согласования",
    approved: "Одобрено",
    rejected: "Отклонено",
    planned: "Запланирован",
    active: "Активен",
    archived: "Архивирован",
    draft: "Черновик",
    published: "Опубликован",
    submitted: "На проверке",
    under_review: "На проверке",
    accepted: "Принято",
    needs_revision: "Требует доработки"
  };
  return labels[status] || status;
};

LMSData.formatAssignmentStatusLabel = function(status) {
  const labels = {
    not_started: "Не начато",
    draft: "Черновик",
    in_progress: "В работе",
    submitted: "Отправлено",
    under_review: "На проверке",
    accepted: "Принято",
    completed: "Завершено",
    needs_revision: "На доработку"
  };
  return labels[status] || status;
};

LMSData.formatRequestStatusLabel = function(status) {
  const labels = {
    pending: "Ожидает",
    approved: "Одобрено",
    rejected: "Отклонено"
  };
  return labels[status] || status;
};

LMSData.formatAssignmentType = function(type) {
  const types = {
    lecture: "Лекция",
    lab: "Практика",
    project: "Проект",
    test: "Тест",
    quiz: "Квиз"
  };
  return types[type] || type;
};

LMSData.formatLevel = function(level) {
  const levels = {
    basic: "Базовый",
    intermediate: "Средний",
    advanced: "Продвинутый"
  };
  return levels[level] || level;
};

LMSData.formatDate = function(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

LMSData.formatDateTime = function(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

LMSData.formatDateTimeShort = function(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Compute due date from enrollment date + assignment dueDays
LMSData.computeDueDate = function(enrollmentDate, dueDays) {
  if (!dueDays) return null;
  const start = new Date(enrollmentDate);
  const due = new Date(start);
  due.setDate(due.getDate() + dueDays);
  return due.toISOString();
};

LMSData.getDaysUntilDeadline = function(dueDate) {
  if (!dueDate) return null;
  const now = new Date();
  const deadline = new Date(dueDate);
  const diff = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
  return diff;
};

LMSData.formatDaysRemaining = function(days) {
  if (days === null || days === undefined) return "";
  if (days < 0) return `Просрочено на ${Math.abs(days)} дн.`;
  if (days === 0) return "Сегодня";
  if (days === 1) return "Завтра";
  return `${days} дн.`;
};

// Get upcoming deadlines for a student
LMSData.getUpcomingDeadlines = function(studentId, limit = 5) {
  const enrollments = LMSData.getEnrollmentsByStudent(studentId);
  const deadlines = [];

  enrollments.forEach(enrollment => {
    const instance = LMSData.getCourseInstance(enrollment.courseInstanceId);
    const template = LMSData.getCourseTemplate(instance.courseTemplateId);
    const assignments = LMSData.getAssignmentTemplatesForCourse(template.id);

    assignments.forEach(assignment => {
      const ai = LMSData.getAssignmentInstance(
        enrollment.courseInstanceId,
        assignment.id,
        studentId
      );

      if (ai && ai.status !== 'accepted' && assignment.dueDays) {
        const dueDate = LMSData.computeDueDate(enrollment.enrolledAt, assignment.dueDays);
        const daysLeft = LMSData.getDaysUntilDeadline(dueDate);

        deadlines.push({
          assignmentTitle: assignment.title,
          courseTitle: template.title,
          dueDate: dueDate,
          daysLeft: daysLeft,
          status: ai.status,
          assignmentId: assignment.id,
          courseInstanceId: enrollment.courseInstanceId
        });
      }
    });
  });

  // Sort by due date (earliest first)
  deadlines.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return limit ? deadlines.slice(0, limit) : deadlines;
};

// Calculate course progress
LMSData.calculateProgress = function(enrollmentId) {
  const instances = LMSData.getAssignmentInstancesForEnrollment(enrollmentId);
  if (instances.length === 0) return 0;

  const mandatoryInstances = instances.filter(ai => {
    const template = LMSData.getAssignmentTemplate(ai.assignmentTemplateId);
    return template && template.isMandatory;
  });

  if (mandatoryInstances.length === 0) return 0;

  const completed = mandatoryInstances.filter(ai => ai.status === 'accepted').length;
  return Math.round((completed / mandatoryInstances.length) * 100);
};

// Calculate total score
LMSData.calculateTotalScore = function(enrollmentId) {
  const instances = LMSData.getAssignmentInstancesForEnrollment(enrollmentId);
  return instances.reduce((sum, ai) => sum + (ai.grade || 0), 0);
};

// Get next assignment for "Continue" button
LMSData.getNextAssignment = function(enrollmentId) {
  const enrollment = LMSData.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return null;

  const instance = LMSData.getCourseInstance(enrollment.courseInstanceId);
  const template = LMSData.getCourseTemplate(instance.courseTemplateId);
  const assignments = LMSData.getAssignmentTemplatesForCourse(template.id);

  // Sort by order
  assignments.sort((a, b) => a.order - b.order);

  // Find first non-accepted assignment
  for (let assignment of assignments) {
    const ai = LMSData.getAssignmentInstance(
      enrollment.courseInstanceId,
      assignment.id,
      enrollment.studentId
    );

    if (!ai || ai.status !== 'accepted') {
      return assignment;
    }
  }

  // All done, return last assignment
  return assignments[assignments.length - 1];
};

// ============================================================================
// INITIALIZATION LOG
// ============================================================================

console.log("[LMSData] Mock data loaded successfully");
console.log(`  - Users: ${Object.keys(LMSData.mockUsers).length}`);
console.log(`  - Course Templates: ${LMSData.courseTemplates.length}`);
console.log(`  - Assignment Templates: ${LMSData.assignmentTemplates.length}`);
console.log(`  - Course Instances: ${LMSData.courseInstances.length}`);
console.log(`  - Enrollments: ${LMSData.enrollments.length}`);
console.log(`  - Assignment Instances: ${LMSData.assignmentInstances.length}`);
console.log(`  - Dialogs: ${LMSData.dialogs.length}`);
console.log(`  - Messages: ${LMSData.messages.length}`);
console.log(`  - Certificates: ${LMSData.certificates.length}`);
console.log(`  - Notifications: ${LMSData.notifications.length}`);
