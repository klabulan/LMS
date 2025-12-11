// B3 LMS Data Model - Entities, Attributes, Relations, Statuses
// Source: doc/03_entities.md

const entities = [
    // === USERS ===
    {
        id: "user",
        label: "Пользователь\nUser",
        group: "user",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "username", type: "String(100)", required: true, desc: "Логин пользователя" },
            { name: "email", type: "Email", required: true, desc: "Email (уникальный)" },
            { name: "full_name", type: "String(255)", required: true, desc: "ФИО" },
            { name: "phone", type: "String(20)", required: false, desc: "Телефон" },
            { name: "is_active", type: "Boolean", required: true, desc: "Активен ли аккаунт" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" },
            { name: "last_login", type: "DateTime", required: false, desc: "Последний вход" }
        ],
        statuses: [],
        transitions: []
    },
    {
        id: "student",
        label: "Слушатель\nStudent",
        group: "user",
        attributes: [
            { name: "user_id", type: "UUID (FK)", required: true, desc: "Ссылка на Пользователь" },
            { name: "organization", type: "String(255)", required: false, desc: "Организация" },
            { name: "department", type: "String(255)", required: false, desc: "Подразделение" },
            { name: "position", type: "String(255)", required: false, desc: "Должность" },
            { name: "employee_id", type: "String(50)", required: false, desc: "Табельный номер" },
            { name: "learning_goals", type: "Text", required: false, desc: "Цели обучения" },
            { name: "bio", type: "Text", required: false, desc: "О себе" }
        ],
        statuses: [],
        transitions: []
    },

    // === COURSES ===
    {
        id: "course_template",
        label: "Шаблон курса\nCourse Template",
        group: "template",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "code", type: "String(50)", required: true, desc: "Код курса (уникальный)" },
            { name: "title", type: "String(255)", required: true, desc: "Название курса" },
            { name: "description", type: "Text", required: true, desc: "Полное описание" },
            { name: "short_description", type: "Text", required: false, desc: "Краткое описание" },
            { name: "level", type: "Enum", required: true, desc: "basic / intermediate / advanced" },
            { name: "category", type: "String(100)", required: false, desc: "Категория" },
            { name: "target_audience", type: "Text", required: false, desc: "Целевая аудитория" },
            { name: "prerequisites", type: "Text", required: false, desc: "Требуемые навыки" },
            { name: "duration_hours", type: "Integer", required: false, desc: "Продолжительность (часы)" },
            { name: "certification_threshold", type: "Decimal(5,2)", required: true, desc: "Мин. балл для сертификации" },
            { name: "requires_lab_environment", type: "Boolean", required: true, desc: "Требуется стенд" },
            { name: "cover_image", type: "File", required: false, desc: "Обложка курса" },
            { name: "accessibility", type: "Enum", required: true, desc: "public / registered" },
            { name: "status", type: "Enum", required: true, desc: "draft / published / archived" },
            { name: "created_by", type: "UUID (FK)", required: true, desc: "Автор (методист)" },
            { name: "certificate_template_id", type: "UUID (FK)", required: false, desc: "Шаблон сертификата для курса" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" },
            { name: "updated_at", type: "DateTime", required: true, desc: "Последнее обновление" }
        ],
        statuses: [
            { id: "draft", label: "Черновик", color: "#9E9E9E", desc: "Курс в разработке, виден только методисту-автору и администраторам" },
            { id: "published", label: "Опубликован", color: "#4CAF50", desc: "Курс доступен в каталоге согласно accessibility" },
            { id: "archived", label: "Архивирован", color: "#607D8B", desc: "Скрыт из каталога, виден только администраторам в архиве" }
        ],
        transitions: [
            {
                from: "draft", to: "published", label: "Публикация", initiator: "Методист",
                trigger: "Методист вручную публикует курс через кнопку «Опубликовать»",
                visibility: "Курс появляется в каталоге согласно настройке accessibility (public - для всех, registered - для авторизованных)",
                access: "Шаблон становится read-only для методиста. Студенты и преподаватели могут просматривать описание",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = published, updated_at = текущее время",
                validation: "Обязательные поля title, description, level, certification_threshold заполнены. Минимум 1 задание в курсе",
                parentUpdates: "—"
            },
            {
                from: "published", to: "draft", label: "Снять с публикации", initiator: "Методист/Админ",
                trigger: "Методист/Администратор вручную снимает курс с публикации",
                visibility: "Курс скрывается из каталога, остается видимым только методисту и администраторам",
                access: "Шаблон становится редактируемым для методиста",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = draft, updated_at = текущее время",
                validation: "Не должно быть активных учебных групп (course_instance.status != active или planned). Если есть — переход блокируется",
                parentUpdates: "—"
            },
            {
                from: "published", to: "archived", label: "Архивировать", initiator: "Методист/Админ",
                trigger: "Методист/Администратор вручную архивирует курс",
                visibility: "Курс полностью скрывается из каталога и всех списков, доступен только администраторам в архиве",
                access: "Только просмотр для администраторов",
                childObjects: "Все связанные assignment_template переходят в статус archived",
                notifications: "—",
                updatedFields: "status = archived, updated_at = текущее время",
                validation: "Не должно быть активных учебных групп (course_instance.status != active или planned)",
                parentUpdates: "—"
            },
            {
                from: "draft", to: "archived", label: "Удалить черновик", initiator: "Методист",
                trigger: "Методист/Администратор удаляет черновик курса",
                visibility: "Курс скрывается из рабочих списков",
                access: "Только просмотр для администраторов в архиве",
                childObjects: "Все связанные assignment_template переходят в статус archived",
                notifications: "—",
                updatedFields: "status = archived, updated_at = текущее время",
                validation: "—",
                parentUpdates: "—"
            }
        ]
    },
    {
        id: "course_instance",
        label: "Учебная группа\nCourse Instance",
        group: "instance",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "course_template_id", type: "UUID (FK)", required: true, desc: "Ссылка на Шаблон курса" },
            { name: "group_name", type: "String(100)", required: false, desc: "Название группы" },
            { name: "instructor_id", type: "UUID (FK)", required: true, desc: "Преподаватель" },
            { name: "start_date", type: "Date", required: true, desc: "Дата начала" },
            { name: "end_date", type: "Date", required: true, desc: "Дата окончания" },
            { name: "status", type: "Enum", required: true, desc: "planned / active / completed / archived" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" }
        ],
        statuses: [
            { id: "planned", label: "Запланирован", color: "#FF9800", desc: "Группа создана, обучение не началось. Видно преподавателю, записанным студентам, админам" },
            { id: "active", label: "Активен", color: "#4CAF50", desc: "Идет обучение. Студенты выполняют задания, преподаватель проверяет работы" },
            { id: "completed", label: "Завершен", color: "#2196F3", desc: "Обучение окончено. Только просмотр результатов, выгрузка отчетов" },
            { id: "archived", label: "Архивирован", color: "#607D8B", desc: "Скрыт из активных списков, только просмотр для всех ролей" }
        ],
        transitions: [
            {
                from: "planned", to: "active", label: "Старт курса", initiator: "Авто / Преподаватель",
                trigger: "Автоматически по расписанию при наступлении start_date (BPMN-процесс ежедневно) ИЛИ вручную преподавателем через кнопку «Начать курс»",
                visibility: "Студенты получают полный доступ к контенту курса, заданиям и материалам",
                access: "Студенты могут начинать выполнение заданий. Преподаватель может проверять работы",
                childObjects: "Для каждой enrollment в статусе approved автоматически создаются все assignment_instance на основе шаблонов заданий",
                notifications: "Всем студентам с enrollment.status = approved отправляется уведомление (type: course_started) «Курс начался. Приступайте к выполнению заданий»",
                updatedFields: "status = active, actual_start_date = текущая дата",
                validation: "—",
                parentUpdates: "Все enrollment со статусом approved автоматически переходят в статус active (каскадный переход)"
            },
            {
                from: "active", to: "completed", label: "Завершение", initiator: "Авто / Преподаватель",
                trigger: "Автоматически при наступлении end_date (BPMN-процесс) ИЛИ вручную преподавателем через кнопку «Завершить курс»",
                visibility: "Контент курса остается видимым студентам, но помечен как завершенный. Курс перемещается в раздел «Завершенные курсы»",
                access: "Студенты больше не могут сдавать работы. Все assignment_instance в статусах in_progress/under_review остаются (преподаватель может доработать)",
                childObjects: "—",
                notifications: "Всем студентам отправляется уведомление (type: course_completed) «Курс завершен»",
                updatedFields: "status = completed, actual_end_date = текущая дата",
                validation: "—",
                parentUpdates: "Запускается BPMN-процесс проверки условий завершения для всех enrollment: если total_score >= certification_threshold И все обязательные задания в статусе completed → enrollment.status = completed + создается certificate_instance. Иначе enrollment.status = failed"
            },
            {
                from: "completed", to: "archived", label: "Архивировать", initiator: "Администратор",
                trigger: "Администратор вручную архивирует группу (обычно через несколько месяцев после завершения)",
                visibility: "Группа скрывается из активных списков преподавателя и студентов, доступна только в разделе архива",
                access: "Только просмотр для всех ролей (студент видит свои результаты, преподаватель — итоговую статистику)",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = archived",
                validation: "—",
                parentUpdates: "—"
            }
        ]
    },

    // === ENROLLMENT ===
    {
        id: "enrollment",
        label: "Запись на курс\nEnrollment",
        group: "process",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "student_id", type: "UUID (FK)", required: true, desc: "Слушатель" },
            { name: "course_instance_id", type: "UUID (FK)", required: true, desc: "Экземпляр курса" },
            { name: "status", type: "Enum", required: true, desc: "created / pending_approval / approved / rejected / active / completed / withdrawn / failed" },
            { name: "enrolled_at", type: "DateTime", required: true, desc: "Дата записи" },
            { name: "last_activity_at", type: "DateTime", required: false, desc: "Последняя активность" },
            { name: "completion_date", type: "DateTime", required: false, desc: "Дата завершения" },
            { name: "total_score", type: "Decimal(5,2)", required: false, desc: "Итоговый балл (0-100)" },
            { name: "progress_percentage", type: "Decimal(5,2)", required: false, desc: "Процент завершения" },
            { name: "allocated_resources", type: "Text", required: false, desc: "Выделенные ресурсы (стенд)" },
            { name: "request_comment", type: "Text", required: false, desc: "Комментарий заявки" },
            { name: "approval_comment", type: "Text", required: false, desc: "Комментарий администратора" },
            { name: "approved_by", type: "UUID (FK)", required: false, desc: "Кто согласовал" },
            { name: "approved_at", type: "DateTime", required: false, desc: "Когда согласована" }
        ],
        statuses: [
            { id: "created", label: "Создана", color: "#BDBDBD", desc: "Черновик заявки. Студент отложил курс, но не отправил на согласование" },
            { id: "pending_approval", label: "Ожидает согласования", color: "#FF9800", desc: "Студент подал заявку. Видна студенту, админам, преподавателю курса" },
            { id: "approved", label: "Согласована", color: "#8BC34A", desc: "Заявка одобрена, ожидает старта курса" },
            { id: "rejected", label: "Отклонена", color: "#795548", desc: "Заявка отклонена. Студент может редактировать и повторно отправить" },
            { id: "active", label: "Активная", color: "#4CAF50", desc: "Студент проходит курс, выполняет задания" },
            { id: "completed", label: "Завершена", color: "#2196F3", desc: "Курс успешно пройден, сертификат выдан" },
            { id: "withdrawn", label: "Отчислен", color: "#F44336", desc: "Студент отчислен с курса" },
            { id: "failed", label: "Не пройден", color: "#9E9E9E", desc: "Курс не завершен успешно (условия сертификации не выполнены)" }
        ],
        transitions: [
            {
                from: "created", to: "pending_approval", label: "Отправить на согласование", initiator: "Студент",
                trigger: "Студент нажимает кнопку «Отправить на согласование»",
                visibility: "Заявка становится видна администраторам и преподавателю курса",
                access: "Студент может отменить. Администратор может одобрить/отклонить",
                childObjects: "—",
                notifications: "Администраторам и преподавателю отправляется уведомление «Новая заявка на курс от [Имя студента]»",
                updatedFields: "status = pending_approval, submitted_at = текущее время",
                validation: "—",
                parentUpdates: "—"
            },
            {
                from: "pending_approval", to: "approved", label: "Одобрить", initiator: "Администратор",
                trigger: "Администратор нажимает кнопку «Одобрить заявку»",
                visibility: "Запись появляется в списке студентов курса у преподавателя. Студент видит одобренную запись в «Мои курсы» (с пометкой «Ожидает начала»)",
                access: "Студент может просматривать описание курса, но задания еще недоступны",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: enrollment_approved) «Ваша заявка на курс одобрена. Курс начнется [дата start_date]»",
                updatedFields: "status = approved, approved_by = user_id администратора, approved_at = текущее время, approval_comment (если указан)",
                validation: "—",
                parentUpdates: "—"
            },
            {
                from: "pending_approval", to: "rejected", label: "Отклонить", initiator: "Администратор",
                trigger: "Администратор нажимает кнопку «Отклонить заявку» и указывает причину",
                visibility: "Запись помечается как отклоненная, видна студенту с причиной отклонения",
                access: "Студент может редактировать и повторно отправить",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: enrollment_rejected) «Ваша заявка на курс отклонена. Причина: [текст из approval_comment]»",
                updatedFields: "status = rejected, approved_by = user_id администратора, approved_at = текущее время, approval_comment (обязательно — причина)",
                validation: "—",
                parentUpdates: "—"
            },
            {
                from: "rejected", to: "created", label: "Редактировать заявку", initiator: "Студент",
                trigger: "Студент нажимает кнопку «Редактировать заявку» на отклоненной заявке",
                visibility: "Запись возвращается в черновики студента",
                access: "Студент может редактировать комментарий и повторно отправить на согласование",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = created, очищаются approved_by, approved_at",
                validation: "—",
                parentUpdates: "—",
                notes: "Сохраняется approval_comment с предыдущим отклонением для справки"
            },
            {
                from: "approved", to: "rejected", label: "Отозвать согласование", initiator: "Администратор",
                trigger: "Администратор отзывает согласование до старта курса",
                visibility: "Запись помечается как отклоненная, видна студенту с причиной отзыва",
                access: "Студент может редактировать и повторно отправить",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: enrollment_revoked) «Согласование вашей заявки на курс отозвано. Причина: [текст]»",
                updatedFields: "status = rejected, approved_by = user_id администратора, approved_at = текущее время, approval_comment (причина отзыва)",
                validation: "course_instance.status должен быть planned (курс еще не начался)",
                parentUpdates: "—"
            },
            {
                from: "approved", to: "active", label: "Старт курса", initiator: "Авто",
                trigger: "Автоматически при переходе course_instance.status → active (BPMN-процесс обрабатывает все одобренные записи)",
                visibility: "Студент получает полный доступ к контенту курса и видит все задания",
                access: "Студент может выполнять задания, отправлять работы на проверку, общаться с преподавателем",
                childObjects: "Автоматически создаются все assignment_instance для этого студента на основе assignment_template курса. Каждый экземпляр создается в статусе not_started",
                notifications: "Студенту отправляется уведомление (type: course_started) «Курс [название] начался. Приступайте к выполнению заданий»",
                updatedFields: "status = active, started_at = текущее время, progress_percentage = 0, total_score = 0",
                validation: "—",
                parentUpdates: "—"
            },
            {
                from: "active", to: "completed", label: "Успешное завершение", initiator: "Авто",
                trigger: "Автоматически при выполнении условий завершения (BPMN-процесс проверяет при каждом обновлении assignment_instance.status → completed)",
                visibility: "Запись помечается как завершенная, курс перемещается в раздел «Завершенные курсы» у студента",
                access: "Только просмотр своих работ и результатов, доступ к сертификату",
                childObjects: "Создается certificate_instance: генерируется уникальный certificate_number, создается PDF через конструктор печатных форм B3",
                notifications: "Студенту отправляется уведомление (type: course_completed_success) «Поздравляем! Вы успешно завершили курс. Ваш итоговый балл: [total_score]. Сертификат доступен для скачивания»",
                updatedFields: "status = completed, completion_date = текущая дата, total_score (финальное значение), progress_percentage = 100",
                validation: "Все обязательные задания (assignment_template.is_mandatory = true) должны быть в статусе completed И total_score >= course_template.certification_threshold",
                parentUpdates: "—"
            },
            {
                from: "active", to: "withdrawn", label: "Отчисление", initiator: "Админ / Студент",
                trigger: "Студент нажимает «Отчислиться с курса» (с подтверждением) ИЛИ Администратор/Преподаватель отчисляет студента вручную",
                visibility: "Запись помечается как отчисленная, курс перемещается в раздел «Отчисленные» у студента",
                access: "Только просмотр своих работ на момент отчисления",
                childObjects: "—",
                notifications: "Преподавателю отправляется уведомление (type: student_withdrawn) «Студент [имя] отчислился с курса [название]»",
                updatedFields: "status = withdrawn, completion_date = текущая дата (дата отчисления)",
                validation: "—",
                parentUpdates: "—"
            },
            {
                from: "active", to: "failed", label: "Не выполнены требования", initiator: "Авто",
                trigger: "Автоматически при переходе course_instance.status → completed, если условия сертификации НЕ выполнены (BPMN-процесс проверяет все активные записи)",
                visibility: "Запись помечается как проваленная, курс перемещается в раздел «Не завершенные курсы» у студента",
                access: "Только просмотр своих работ",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: course_failed) «Курс завершен. К сожалению, условия для получения сертификата не выполнены. Ваш балл: [total_score], требуется: [certification_threshold]»",
                updatedFields: "status = failed, completion_date = текущая дата",
                validation: "—",
                parentUpdates: "—"
            }
        ]
    },

    // === ASSIGNMENTS ===
    {
        id: "assignment_template",
        label: "Шаблон задания\nAssignment Template",
        group: "template",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "course_template_id", type: "UUID (FK)", required: true, desc: "Курс" },
            { name: "module_number", type: "Integer", required: true, desc: "Номер модуля" },
            { name: "order_number", type: "Integer", required: true, desc: "Порядковый номер" },
            { name: "title", type: "String(255)", required: true, desc: "Название задания" },
            { name: "short_description", type: "Text", required: true, desc: "Краткое описание (для предпросмотра)" },
            { name: "detailed_instruction", type: "Text", required: true, desc: "Подробная инструкция (HTML)" },
            { name: "instruction_videos", type: "JSON", required: false, desc: "Массив ссылок на видео" },
            { name: "instruction_files", type: "JSON", required: false, desc: "Массив файлов инструкции" },
            { name: "type", type: "Enum", required: true, desc: "lecture / lab / quiz / project / peer_review" },
            { name: "delivery_mode", type: "Enum", required: true, desc: "in_person / self_study" },
            { name: "submission_type", type: "Array/JSON", required: false, desc: "text / file / url / none (скрыто из UI)" },
            { name: "max_score", type: "Decimal(5,2)", required: true, desc: "Максимальный балл" },
            { name: "is_mandatory", type: "Boolean", required: true, desc: "Обязательное для сертификации" },
            { name: "materials", type: "JSON", required: false, desc: "Массив ссылок/файлов" },
            { name: "grading_criteria", type: "Text", required: false, desc: "Критерии оценивания" },
            { name: "status", type: "Enum", required: true, desc: "draft / active / archived" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" },
            { name: "updated_at", type: "DateTime", required: true, desc: "Последнее обновление" }
        ],
        statuses: [
            { id: "draft", label: "Черновик", color: "#9E9E9E", desc: "Задание в разработке, видно только методисту-автору и администраторам" },
            { id: "active", label: "Активен", color: "#4CAF50", desc: "Задание используется в курсе, read-only" },
            { id: "archived", label: "Архивирован", color: "#607D8B", desc: "Задание более не используется, только просмотр" }
        ],
        transitions: [
            {
                from: "draft", to: "active", label: "Активировать", initiator: "Методист",
                trigger: "Автоматически при публикации родительского course_template (draft → published) ИЛИ вручную методистом при активации задания",
                visibility: "Задание становится видимым в структуре курса для всех ролей",
                access: "Шаблон задания становится read-only (редактирование только через снятие курса с публикации)",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = active, updated_at = текущее время",
                validation: "—",
                parentUpdates: "—"
            },
            {
                from: "active", to: "archived", label: "Архивировать", initiator: "Методист",
                trigger: "Методист удаляет задание из курса ИЛИ архивирует курс (course_template переходит в archived)",
                visibility: "Задание скрывается из списка активных заданий курса",
                access: "Только просмотр для истории",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = archived, updated_at = текущее время",
                validation: "Родительский course_template.status должен быть draft (курс снят с публикации) ИЛИ archived",
                parentUpdates: "—",
                notes: "Уже созданные assignment_instance на основе этого шаблона продолжают существовать и работать"
            }
        ]
    },
    {
        id: "assignment_instance",
        label: "Экземпляр задания\nAssignment Instance",
        group: "instance",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "assignment_template_id", type: "UUID (FK)", required: true, desc: "Шаблон задания" },
            { name: "enrollment_id", type: "UUID (FK)", required: true, desc: "Запись на курс" },
            { name: "status", type: "Enum", required: true, desc: "not_started / in_progress / under_review / completed / needs_revision" },
            { name: "submission_text", type: "Text", required: false, desc: "Текстовое решение" },
            { name: "submission_files", type: "JSON", required: false, desc: "Загруженные файлы" },
            { name: "submission_url", type: "String(255)", required: false, desc: "Ссылка на решение" },
            { name: "submitted_at", type: "DateTime", required: false, desc: "Дата сдачи" },
            { name: "grade", type: "Decimal(5,2)", required: false, desc: "Оценка" },
            { name: "feedback", type: "Text", required: false, desc: "Комментарий преподавателя" },
            { name: "graded_at", type: "DateTime", required: false, desc: "Дата проверки" },
            { name: "graded_by", type: "UUID (FK)", required: false, desc: "Преподаватель" },
            { name: "attempt_count", type: "Integer", required: true, desc: "Количество попыток" }
        ],
        statuses: [
            { id: "not_started", label: "Не начато", color: "#9E9E9E", desc: "Студент еще не открыл задание. Видит название, описание, дедлайн" },
            { id: "in_progress", label: "В работе", color: "#FF9800", desc: "Студент работает над заданием, может редактировать submission" },
            { id: "under_review", label: "На проверке", color: "#9C27B0", desc: "Преподаватель проверяет работу, может выставить оценку или вернуть" },
            { id: "completed", label: "Завершено", color: "#4CAF50", desc: "Работа проверена и оценена, или автозачтена. Только просмотр" },
            { id: "needs_revision", label: "Доработка", color: "#F44336", desc: "Работа возвращена на исправление, студент может редактировать" }
        ],
        transitions: [
            {
                from: "not_started", to: "in_progress", label: "Открыть задание", initiator: "Студент",
                trigger: "Студент открывает задание для выполнения (нажимает «Начать работу» или начинает вводить текст решения)",
                visibility: "Без изменений",
                access: "Студент получает возможность редактировать поля submission_text, submission_files, submission_url",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = in_progress, started_at = текущее время",
                validation: "—",
                parentUpdates: "Обновляется enrollment.last_activity_at = текущее время"
            },
            {
                from: "in_progress", to: "under_review", label: "Отправить на проверку", initiator: "Студент",
                trigger: "Студент нажимает кнопку «Отправить на проверку»",
                visibility: "Задание помечается как «На проверке» в интерфейсе студента",
                access: "Студент больше не может редактировать submission (поля блокируются). Преподаватель получает доступ к выставлению оценки",
                childObjects: "Создается BPMN-задача для преподавателя «Проверить задание [название] студента [имя]»",
                notifications: "Преподавателю курса отправляется уведомление (type: assignment_submitted) «Студент [имя] сдал задание [название]. Требуется проверка»",
                updatedFields: "status = under_review, submitted_at = текущее время, attempt_count = attempt_count + 1",
                validation: "Хотя бы одно из полей submission_text, submission_files, submission_url должно быть заполнено (согласно assignment_template.submission_type)",
                parentUpdates: "Обновляется enrollment.last_activity_at = текущее время"
            },
            {
                from: "in_progress", to: "completed", label: "Автозачёт", initiator: "Авто",
                trigger: "Автоматически при выполнении условий автозачёта (для заданий типа lecture или с флагом autoGrade=true)",
                visibility: "Задание помечается как «Завершено» в интерфейсе студента, отображается оценка",
                access: "Только просмотр для обеих ролей (работа закрыта)",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: assignment_completed) «Задание [название] зачтено автоматически»",
                updatedFields: "status = completed, grade = max_score, graded_at = текущее время, graded_by = null (система)",
                validation: "assignment_template.type = lecture ИЛИ assignment_template.autoGrade = true",
                parentUpdates: "Пересчитываются поля в enrollment: progress_percentage, total_score. Если все обязательные завершены И total_score >= threshold → проверка условий для enrollment → completed"
            },
            {
                from: "under_review", to: "completed", label: "Оценить и принять", initiator: "Преподаватель",
                trigger: "Преподаватель выставляет оценку и нажимает кнопку «Принять работу» / «Поставить оценку»",
                visibility: "Задание помечается как «Завершено» в интерфейсе студента, отображается оценка",
                access: "Только просмотр для обеих ролей (работа закрыта)",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: assignment_graded) «Ваша работа по заданию [название] проверена. Оценка: [grade] из [max_score]»",
                updatedFields: "status = completed, grade = [значение], feedback = [комментарий], graded_at = текущее время, graded_by = user_id преподавателя",
                validation: "Поле grade должно быть в диапазоне от 0 до assignment_template.max_score",
                parentUpdates: "Пересчитываются поля в enrollment: progress_percentage = (completed заданий) / (всего заданий) × 100, total_score = среднее grade/max_score по обязательным заданиям. Если все обязательные completed И total_score >= threshold → проверка условий для enrollment → completed"
            },
            {
                from: "under_review", to: "needs_revision", label: "Вернуть на доработку", initiator: "Преподаватель",
                trigger: "Преподаватель нажимает кнопку «Вернуть на доработку» и оставляет комментарий с замечаниями",
                visibility: "Задание помечается как «Требует доработки» в интерфейсе студента",
                access: "Студент снова получает возможность редактировать submission",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: assignment_needs_revision) «Ваша работа по заданию [название] требует доработки. Комментарий преподавателя: [feedback]»",
                updatedFields: "status = needs_revision, feedback = [комментарий преподавателя], graded_at = текущее время, graded_by = user_id преподавателя",
                validation: "Поле feedback обязательно должно быть заполнено (объяснение причины возврата)",
                parentUpdates: "Обновляется enrollment.last_activity_at = текущее время"
            },
            {
                from: "needs_revision", to: "in_progress", label: "Доработать", initiator: "Студент",
                trigger: "Студент нажимает кнопку «Приступить к исправлениям» или начинает редактировать submission",
                visibility: "Задание помечается как «В работе (доработка)» в интерфейсе студента",
                access: "Студент может редактировать submission, видит предыдущий комментарий преподавателя",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = in_progress (счетчик attempt_count НЕ инкрементируется — инкремент будет при повторной отправке)",
                validation: "—",
                parentUpdates: "Обновляется enrollment.last_activity_at = текущее время"
            }
        ]
    },

    // === COMMUNICATIONS ===
    {
        id: "dialog",
        label: "Диалог\nDialog",
        group: "process",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "type", type: "Enum", required: true, desc: "course / assignment" },
            { name: "reference_id", type: "UUID", required: true, desc: "ID Enrollment или Assignment Instance" },
            { name: "participants", type: "JSON", required: false, desc: "Массив user_id участников" },
            { name: "status", type: "Enum", required: true, desc: "active / archived" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" },
            { name: "last_message_at", type: "DateTime", required: false, desc: "Последнее сообщение" }
        ],
        statuses: [
            { id: "active", label: "Активен", color: "#4CAF50", desc: "Диалог открыт для общения, все участники могут отправлять сообщения" },
            { id: "archived", label: "Архивирован", color: "#607D8B", desc: "Диалог закрыт, доступен только для чтения истории" }
        ],
        transitions: [
            {
                from: "active", to: "archived", label: "Архивировать", initiator: "Преподаватель/Админ",
                trigger: "Преподаватель или администратор вручную архивирует диалог (обычно при завершении или архивации курса)",
                visibility: "Диалог перемещается в раздел «Архив сообщений»",
                access: "Только просмотр истории сообщений, отправка новых сообщений заблокирована",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = archived",
                validation: "—",
                parentUpdates: "—"
            }
        ]
    },
    {
        id: "message",
        label: "Сообщение\nMessage",
        group: "support",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "dialog_id", type: "UUID (FK)", required: true, desc: "Диалог" },
            { name: "author_id", type: "UUID (FK)", required: true, desc: "Автор сообщения" },
            { name: "text", type: "Text", required: true, desc: "Текст сообщения" },
            { name: "attachments", type: "JSON", required: false, desc: "Прикрепленные файлы" },
            { name: "is_read", type: "Boolean", required: true, desc: "Прочитано ли" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" }
        ],
        statuses: [],
        transitions: []
    },

    // === CERTIFICATES ===
    {
        id: "certificate_template",
        label: "Шаблон сертификата\nCertificate Template",
        group: "template",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "name", type: "String(255)", required: true, desc: "Название шаблона" },
            { name: "course_type", type: "Enum", required: false, desc: "basic / intermediate / advanced / all" },
            { name: "print_form_id", type: "UUID (FK)", required: true, desc: "Ссылка на печатную форму B3" },
            { name: "description", type: "Text", required: false, desc: "Описание" },
            { name: "status", type: "Enum", required: true, desc: "draft / active / archived" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" }
        ],
        statuses: [
            { id: "draft", label: "Черновик", color: "#9E9E9E", desc: "Шаблон в разработке, виден только администраторам" },
            { id: "active", label: "Активен", color: "#4CAF50", desc: "Используется для выдачи сертификатов, read-only" },
            { id: "archived", label: "Архивирован", color: "#607D8B", desc: "Больше не используется, виден только в архиве" }
        ],
        transitions: [
            {
                from: "draft", to: "active", label: "Активировать", initiator: "Администратор",
                trigger: "Администратор нажимает кнопку «Активировать шаблон» после настройки печатной формы",
                visibility: "Шаблон появляется в списке доступных шаблонов сертификатов при настройке курсов",
                access: "Шаблон становится read-only (редактирование только через архивацию и создание новой версии)",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = active",
                validation: "Поле print_form_id должно быть заполнено (ссылка на печатную форму B3 должна существовать)",
                parentUpdates: "—"
            },
            {
                from: "active", to: "archived", label: "Архивировать", initiator: "Администратор",
                trigger: "Администратор архивирует устаревший шаблон (например, при смене дизайна сертификатов)",
                visibility: "Шаблон скрывается из списка доступных при настройке новых курсов",
                access: "Только просмотр",
                childObjects: "—",
                notifications: "—",
                updatedFields: "status = archived",
                validation: "—",
                parentUpdates: "—",
                notes: "Уже выданные сертификаты (certificate_instance) на основе этого шаблона продолжают быть действительными"
            }
        ]
    },
    {
        id: "certificate_instance",
        label: "Сертификат\nCertificate Instance",
        group: "instance",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "certificate_template_id", type: "UUID (FK)", required: true, desc: "Шаблон сертификата" },
            { name: "enrollment_id", type: "UUID (FK)", required: true, desc: "Запись на курс" },
            { name: "student_id", type: "UUID (FK)", required: true, desc: "Слушатель" },
            { name: "certificate_number", type: "String(50)", required: true, desc: "Серийный номер" },
            { name: "issue_date", type: "Date", required: true, desc: "Дата выдачи" },
            { name: "pdf_file", type: "File", required: true, desc: "PDF-файл сертификата" },
            { name: "verification_url", type: "String(255)", required: false, desc: "Ссылка для проверки" },
            { name: "status", type: "Enum", required: true, desc: "issued / revoked" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" }
        ],
        statuses: [
            { id: "issued", label: "Выдан", color: "#4CAF50", desc: "Сертификат действителен, доступен для скачивания и проверки" },
            { id: "revoked", label: "Отозван", color: "#F44336", desc: "Сертификат аннулирован, помечен как недействительный" }
        ],
        transitions: [
            {
                from: "issued", to: "revoked", label: "Отозвать", initiator: "Администратор",
                trigger: "Администратор вручную отзывает сертификат (редкий случай: нарушение академической честности, ошибка в выдаче)",
                visibility: "Сертификат помечается как «Отозван» в интерфейсе студента. На verification_url отображается статус «Сертификат отозван»",
                access: "Только просмотр, PDF остается доступным для скачивания, но помечен как недействительный",
                childObjects: "—",
                notifications: "Студенту отправляется уведомление (type: certificate_revoked) «Ваш сертификат [certificate_number] за курс [название] отозван. Причина: [revocation_reason]». Копия — администраторам и преподавателю",
                updatedFields: "status = revoked, revoked_at = текущее время, revoked_by = user_id администратора, revocation_reason = [текст причины]",
                validation: "Поле revocation_reason обязательно должно быть заполнено",
                parentUpdates: "—"
            }
        ]
    },

    // === NOTIFICATIONS ===
    {
        id: "notification",
        label: "Уведомление\nNotification",
        group: "support",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "user_id", type: "UUID (FK)", required: true, desc: "Получатель" },
            { name: "type", type: "Enum", required: true, desc: "assignment_graded / new_message / deadline_soon / certificate_issued / enrollment_approved" },
            { name: "title", type: "String(255)", required: true, desc: "Заголовок" },
            { name: "message", type: "Text", required: true, desc: "Текст уведомления" },
            { name: "link", type: "String(255)", required: false, desc: "Ссылка на объект" },
            { name: "is_read", type: "Boolean", required: true, desc: "Прочитано ли" },
            { name: "created_at", type: "DateTime", required: true, desc: "Дата создания" }
        ],
        statuses: [],
        transitions: []
    },

    // === SCHEDULES ===
    {
        id: "assignment_schedule",
        label: "График заданий\nAssignment Schedule",
        group: "support",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "assignment_template_id", type: "UUID (FK)", required: true, desc: "Шаблон задания" },
            { name: "duration_days", type: "Integer", required: true, desc: "Дней на выполнение" },
            { name: "start_condition", type: "Enum", required: true, desc: "course_start / prev_complete / prev_assignment_submitted / manual" },
            { name: "start_offset_days", type: "Integer", required: false, desc: "Дней отсрочки" }
        ],
        statuses: [],
        transitions: []
    },
    {
        id: "launch_schedule",
        label: "График запуска\nLaunch Schedule",
        group: "support",
        attributes: [
            { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
            { name: "course_template_id", type: "UUID (FK)", required: true, desc: "Шаблон курса" },
            { name: "launch_mode", type: "Enum", required: true, desc: "manual / periodic / dates" },
            { name: "period", type: "Enum", required: false, desc: "weekly / biweekly / monthly / quarterly" },
            { name: "launch_day", type: "Integer", required: false, desc: "День запуска" },
            { name: "min_students", type: "Integer", required: false, desc: "Минимум студентов" },
            { name: "planned_dates", type: "JSON", required: false, desc: "Массив дат запуска" },
            { name: "is_active", type: "Boolean", required: true, desc: "Активен ли график" }
        ],
        statuses: [],
        transitions: []
    }
];

// Relations between entities
const relations = [
    // User relations
    { from: "user", to: "student", label: "1:1", type: "extends" },

    // Course Template relations
    { from: "course_template", to: "course_instance", label: "1:N", type: "generates" },
    { from: "course_template", to: "assignment_template", label: "1:N", type: "contains" },
    { from: "course_template", to: "launch_schedule", label: "1:N", type: "has" },
    { from: "course_template", to: "certificate_template", label: "N:1", type: "uses" },
    { from: "user", to: "course_template", label: "1:N", type: "creates", note: "автор (методист)" },

    // Course Instance relations
    { from: "course_instance", to: "enrollment", label: "1:N", type: "has" },
    { from: "user", to: "course_instance", label: "1:N", type: "teaches", note: "преподаватель" },

    // Enrollment relations
    { from: "student", to: "enrollment", label: "1:N", type: "creates" },
    { from: "enrollment", to: "assignment_instance", label: "1:N", type: "generates" },
    { from: "enrollment", to: "certificate_instance", label: "1:1", type: "receives" },
    { from: "enrollment", to: "dialog", label: "1:1", type: "has" },
    { from: "user", to: "enrollment", label: "1:N", type: "approves", note: "approved_by" },

    // Certificate Instance direct user relation (in addition to enrollment)
    { from: "user", to: "certificate_instance", label: "1:N", type: "holds" },

    // Assignment relations
    { from: "assignment_template", to: "assignment_instance", label: "1:N", type: "generates" },
    { from: "assignment_template", to: "assignment_schedule", label: "1:1", type: "has" },
    { from: "assignment_instance", to: "dialog", label: "1:N", type: "has" },
    { from: "user", to: "assignment_instance", label: "1:N", type: "grades", note: "graded_by" },

    // Dialog relations
    { from: "dialog", to: "message", label: "1:N", type: "contains" },
    { from: "user", to: "message", label: "1:N", type: "authors", note: "автор сообщения" },

    // Certificate relations
    { from: "certificate_template", to: "certificate_instance", label: "1:N", type: "generates" },

    // Notification relations
    { from: "user", to: "notification", label: "1:N", type: "receives" }
];

// Group colors for vis.js
const groupColors = {
    template: { background: '#E8F5E9', border: '#4CAF50', highlight: { background: '#C8E6C9', border: '#388E3C' } },
    instance: { background: '#E3F2FD', border: '#2196F3', highlight: { background: '#BBDEFB', border: '#1976D2' } },
    user: { background: '#F3E5F5', border: '#9C27B0', highlight: { background: '#E1BEE7', border: '#7B1FA2' } },
    process: { background: '#FFF3E0', border: '#FF9800', highlight: { background: '#FFE0B2', border: '#F57C00' } },
    support: { background: '#ECEFF1', border: '#607D8B', highlight: { background: '#CFD8DC', border: '#455A64' } }
};
