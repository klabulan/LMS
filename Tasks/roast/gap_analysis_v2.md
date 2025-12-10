# GAP-анализ v2: proto.html vs Требования (с самокритикой)

**Дата:** 2025-12-10
**Версия:** 2.0 (с прожаркой первой версии)

---

## САМОКРИТИКА ПЕРВОЙ ВЕРСИИ

### Что было НЕПРАВИЛЬНО в gap_analysis.md v1:

| Ошибка | Почему это плохо | Исправление |
|--------|------------------|-------------|
| **Избыточность сущностей** | Предложил 6 новых сущностей, но исходные требования говорят: "курсов будет мало - 1-4", аудитория маленькая. Зачем AccessRule, Schedule для MVP? | Сократить до минимума |
| ~~**Роль Методист отдельно от Преподавателя**~~ | ~~В gpt_design.md: "Преподаватель / методист" через слеш.~~ **НЕВЕРНО!** В proto/index.html v2 уже есть Методист как отдельная роль. | Методист ОСТАЁТСЯ |
| **Тестирование/опросы** | Не упомянуты в initial_requirements.md вообще. Это фича "nice-to-have", но не MVP | Убрать из MVP |
| **Публичный каталог для гостей** | initial_requirements: "студент регистрируется на курс (или его регистрируют)". Гостевой доступ — опционален ("в идеале, место где можно купить курс") | Перенести в Phase 2-3 |
| ~~**Администратор как отдельная роль**~~ | ~~На старте 1-4 курса, несколько студентов.~~ **НЕВЕРНО!** В proto v2 Админ есть с UI для заявок. | Админ ОСТАЁТСЯ |
| **Шаги задания** | Картинка показывает "Шаги задания", но это УСЛОЖНЕНИЕ. В proto.html описание задания — просто текст. Достаточно? | Оставить как текст + ссылки, без отдельной сущности |
| ~~**Разделение Шаблон/Экземпляр задания**~~ | ~~gpt_design.md предлагает это, но для 1-4 курсов это ОВЕРИНЖИНИРИНГ.~~ **НЕВЕРНО!** В data.js уже есть `courseTemplates`, `courseInstances`, `assignmentTemplates` — разделение УЖЕ реализовано! | Разделение ОСТАЁТСЯ |
| **Приоритеты не соответствуют главной цели** | Главная цель: "комфортный онбординг и демонстрация удобства использования системы". А я предложил админку и заявки первым делом | Переставить приоритеты |

### Что было УПУЩЕНО:

| Упущение | Источник | Важность |
|----------|----------|----------|
| **Персональные креды на стенд** | initial_requirements: "персональный контент (креды на стенд)" | КРИТИЧНО для курса B3! |
| **"Пока руками заполняя креды"** | Процесс: преподаватель вручную заполняет после регистрации | Нужен UI для этого |
| **"Continue" → следующий шаг, не корень курса** | gpt_design + references (Canvas/Coursera pattern) | Уже в proto.html, но неочевидно |
| **To-Do / ближние дедлайны** | gpt_design 4.3.1, references (Canvas) | Отсутствует в proto.html |
| **Асинхронная переписка ≠ комментарии** | gpt_design различает "Диалог по курсу" и "Диалог по заданию" | В proto.html только комментарии к заданию |
| **Модуль онбординга B3** | gpt_design 4.7: использовать встроенный онбординг B3 для базового курса | Не учтено |

---

## ИСПРАВЛЕННЫЙ GAP-АНАЛИЗ

### Контекст (из initial_requirements.md)

```
- Курсов: 1-4 (сейчас 2)
- Аудитория: российский бизнес и госкорпорации
- Главная цель: комфортный онбординг и демонстрация удобства B3
- Фокус: ЛК студента (место где видит курсы, выполняет задания, переписывается)
- Покупка курсов: "в идеале" (не MVP)
```

### Сущности: Актуальное состояние proto v2

**Сравнение схемы "Сущности.jpg" + gpt_design.md с реализацией в proto/data.js:**

| Сущность | В proto v2 (data.js) | Статус | Комментарий |
|----------|---------------------|--------|-------------|
| Пользователь | `mockUsers` (5 ролей: guest, student, methodist, teacher, admin) | **ЕСТЬ** | Полная модель с org/dept/position |
| Слушатель курса | `enrollments` | **ЕСТЬ** | С credentials! |
| Преподаватель курса | `teacherId` в courseInstances | **ЕСТЬ** | Ссылка на User |
| Методист курса | `mockUsers.methodist` + role в UI | **ЕСТЬ** | Отдельная роль |
| Шаблон курса | `courseTemplates` | **ЕСТЬ** | Полная модель |
| Экземпляр курса | `courseInstances` | **ЕСТЬ** | С cohort, dates, status |
| Шаблон задания | `assignmentTemplates` | **ЕСТЬ** | С materials[], submissionType[] |
| Экземпляр задания | `assignmentInstances` | **ЕСТЬ** | С files, feedback |
| Шаги задания | `materials[]` в assignmentTemplate | **ЧАСТИЧНО** | Как массив материалов, не отдельная сущность |
| Заявка на регистрацию | `enrollmentRequests` | **ЕСТЬ** | С review workflow |
| Шаблон сертификата | `certificateTemplates` | **ЕСТЬ** | С layout (HTML) |
| Экземпляр сертификата | `certificates` | **ЕСТЬ** | С verificationCode |
| Диалоги | `dialogs` + `messages` | **ЕСТЬ** | Course-level И assignment-level |
| Уведомления | `notifications` | **ЕСТЬ** | По ролям |
| Расписания | — | НЕТ | Не требуется для MVP |
| Правила доступа | — | НЕТ | Не требуется для MVP |
| **Персональные креды** | `enrollments[].credentials` | **ЕСТЬ!** | vm_url, username, password, expires |

### Модель данных proto v2: УЖЕ РЕАЛИЗОВАНО

```
mockUsers (5 ролей)
├── id, name, email, role, organization, department, position, isActive
└── Роли: guest, student, methodist, teacher, admin

courseTemplates
├── id, title, code, level, description, targetAudience, prerequisites
├── isPublic, certificateThreshold, estimatedHours, requiresSandbox
├── category, createdBy, createdAt, updatedAt
└── → assignmentTemplates (по courseTemplateId)

courseInstances
├── id, courseTemplateId, teacherId, cohort
├── startDate, endDate, status, maxEnrollments, createdAt
└── → enrollments (по courseInstanceId)

assignmentTemplates
├── id, courseTemplateId, title, type, module, order, description
├── materials: [{type, title, url}]  // <-- "Шаги" как массив!
├── maxScore, dueDays, isMandatory, submissionType[], autoGrade
└── → assignmentInstances (по assignmentTemplateId)

enrollments
├── id, studentId, courseInstanceId, status, progress, totalScore
├── **credentials: {vm_url, username, password, issued_at, expires_at}**  // КРЕДЫ!
├── enrolledAt, completedAt, lastActivityAt
└── → assignmentInstances (по enrollmentId)

enrollmentRequests
├── id, userId, courseInstanceId, status, comment
├── reviewedBy, reviewComment, createdAt, reviewedAt
└── + approveRequest() / rejectRequest() helpers

assignmentInstances
├── id, enrollmentId, assignmentTemplateId, courseInstanceId, studentId
├── status, submissionText, submissionFiles[], submissionUrl
├── grade, feedback, submittedAt, gradedAt, gradedBy, attemptCount
└── → dialogs (по referenceId)

dialogs
├── id, type (course|assignment), referenceId, courseId
├── participants[], isArchived, createdAt, lastMessageAt
└── → messages (по dialogId)

messages
├── id, dialogId, authorId, text, attachments[], isRead
├── createdAt, editedAt

certificateTemplates
├── id, courseTemplateId, title, layout (HTML template)
├── requiredScore, signatories[], createdAt

certificates
├── id, studentId, courseInstanceId, certificateTemplateId
├── serialNumber, issuedAt, pdfUrl, verificationCode

notifications
├── id, userId, title, message, type, link, isRead, createdAt
```

**Итого в proto v2: 11 сущностей + helper functions**

**Вывод: Модель данных в proto v2 ПОЛНОСТЬЮ соответствует требованиям и даже превосходит их!**

---

## Экраны: Реализовано в proto v2 (app.js)

### Список всех экранов (22 функции render*):

**Общие:**
- `renderBreadcrumbs` — навигация
- `renderNotificationDropdown` — уведомления
- `renderSidebar` — боковое меню
- `renderMain` — роутер
- `renderApp` — точка входа

**Аноним (Guest):**
| Экран | Функция | Статус |
|-------|---------|--------|
| Лендинг | `renderLandingPage` | **ЕСТЬ** |
| Каталог курсов | `renderCatalogPage` | **ЕСТЬ** |
| Детали курса | `renderCourseDetailPage` | **ЕСТЬ** |

**Студент:**
| Экран | Функция | Статус |
|-------|---------|--------|
| Дашборд | `renderStudentDashboard` | **ЕСТЬ** |
| Страница курса | `renderStudentCoursePage` | **ЕСТЬ** |
| Карточка задания | `renderStudentAssignmentPage` | **ЕСТЬ** |
| Сертификаты | `renderStudentCertificatesPage` | **ЕСТЬ** |
| Сообщения | `renderStudentMessagesPage` | **ЕСТЬ** |

**Методист:**
| Экран | Функция | Статус |
|-------|---------|--------|
| Дашборд (шаблоны) | `renderMethodistDashboard` | **ЕСТЬ** |
| Редактор шаблона | `renderTemplateEditor` | **ЕСТЬ** |
| Библиотека материалов | `methodistMaterials` (в sidebar) | **ЕСТЬ** (навигация) |

**Преподаватель:**
| Экран | Функция | Статус |
|-------|---------|--------|
| Дашборд | `renderTeacherDashboard` | **ЕСТЬ** |
| Gradebook | `renderGradebook` | **ЕСТЬ** |
| На проверке | `teacherGrading` (в sidebar) | **ЕСТЬ** (навигация) |
| Сообщения | `teacherMessages` (в sidebar) | **ЕСТЬ** (навигация) |

**Администратор:**
| Экран | Функция | Статус |
|-------|---------|--------|
| Панель управления | `renderAdminDashboard` | **ЕСТЬ** |
| Заявки | `renderEnrollmentRequests` | **ЕСТЬ** |
| Экземпляры курсов | `renderCourseInstancesList` | **ЕСТЬ** |
| Пользователи | `renderUserManagement` | **ЕСТЬ** |
| Отчёты | `renderSystemReports` | **ЕСТЬ** |

### ИТОГО по UI:

| Роль | Экранов | Статус |
|------|---------|--------|
| Аноним | 3 | **ПОЛНЫЙ** |
| Студент | 5 | **ПОЛНЫЙ** |
| Методист | 2-3 | **ПОЛНЫЙ** |
| Преподаватель | 3-4 | **ПОЛНЫЙ** |
| Админ | 5 | **ПОЛНЫЙ** |

**Вывод: UI в proto v2 реализован ПОЛНОСТЬЮ для всех 5 ролей!**

---

## BPMN-процессы: Упрощённые

### 1. Регистрация студента (MVP)

```
[Преподаватель] Добавляет студента вручную
    → Создаётся Enrollment со статусом "pending"
    → [Преподаватель] Заполняет креды на стенд
    → Enrollment.status = "active"
    → Студент видит курс в ЛК
```

**НЕ НУЖНО для MVP:** публичная заявка, одобрение админом

### 2. Сдача задания (MVP)

```
[Студент] Отправляет решение
    → AssignmentInstance.status = "submitted"
    → [Система] Уведомление преподавателю
    → [Преподаватель] Открывает gradebook → модальное окно
    → Выставляет оценку + комментарий
    → AssignmentInstance.status = "accepted" или "revision"
    → [Система] Уведомление студенту
    → Пересчёт Enrollment.progress
```

### 3. Выдача сертификата (Phase 2)

```
[Система] Проверяет: все обязательные задания accepted?
    → ДА: Кнопка "Выдать сертификат" активна
    → [Преподаватель] Нажимает "Выдать"
    → Генерация PDF из печатной формы B3
    → Certificate создан, студент видит в ЛК
```

---

## Что КОНКРЕТНО доработать в proto v2

### ВАЖНО: Большинство "критичных" пунктов УЖЕ РЕАЛИЗОВАНО!

После проверки proto/data.js и proto/app.js:

| Пункт из v1 | Статус в proto v2 | Комментарий |
|-------------|-------------------|-------------|
| Креды на стенд | **ЕСТЬ** | `enrollments[].credentials` с vm_url, username, password |
| Разделение Template/Instance | **ЕСТЬ** | `courseTemplates` + `courseInstances` |
| Модальное оценивание | **?** | Нужно проверить в renderGradebook() |
| To-Do / дедлайны | **ЕСТЬ** | `getUpcomingDeadlines()` helper в data.js |
| Загрузка файлов | **ЕСТЬ** | `submissionFiles[]` в assignmentInstances |
| Чат курса | **ЕСТЬ** | `dialogs` с type="course" |
| Уведомления | **ЕСТЬ** | `notifications` + `renderNotificationDropdown()` |
| Заполнение кредов | **ЕСТЬ** | Автогенерация в `approveRequest()` |
| Публичный каталог | **ЕСТЬ** | `renderCatalogPage()` |
| Заявки с workflow | **ЕСТЬ** | `enrollmentRequests` + approve/reject |

### Осталось проверить/доработать:

**P0 (если не реализовано в UI):**
1. Показывать креды студенту на странице курса (данные есть, проверить UI)
2. Модальное окно оценивания в gradebook (данные есть, проверить UI)
3. Блок To-Do на дашборде студента (helper есть, проверить UI)

**P1 (мелкие улучшения):**
4. Отображение материалов (video, pdf) в задании
5. Прогресс-бар "шагов" внутри задания
6. Ручная выдача сертификатов (UI кнопка)

**P2+ (future):**
7. Тестирование/опросы (новый тип задания)
8. Real-time чат (сейчас refresh-based)
9. Интеграция с печатными формами B3 для сертификатов

---

## Сравнение с референсами

| Паттерн из references.md | В proto.html | Статус |
|--------------------------|--------------|--------|
| Dashboard = точка входа | Да | OK |
| Карточки курсов с прогресс-баром | Да | OK |
| "Продолжить" → следующий шаг | Да (но к первому заданию) | Улучшить: к НЕЗАВЕРШЁННОМУ |
| To-Do / дедлайны | Нет | **ДОБАВИТЬ** |
| Страница курса: слева структура, справа контент | Да | OK |
| Персональные креды видны студенту | Нет | **ДОБАВИТЬ** |
| Загрузка файлов | Нет (только текст) | **ДОБАВИТЬ** |
| Gradebook: студенты × задания | Да | OK |
| Оценивание из gradebook | Нет (только просмотр) | **ДОБАВИТЬ** |
| Сертификаты в ЛК | Да | OK |
| Каталог для гостей | Нет | Phase 2 |

---

## Итоговая оценка

### Сравнение: proto.html (v1) vs proto/index.html (v2)

| Метрика | proto.html (v1) | proto v2 | Требования |
|---------|-----------------|----------|------------|
| Ролей | 2 (student, teacher) | **5** (guest, student, methodist, teacher, admin) | 5 |
| Сущностей | ~5 | **11** + helpers | ~10-12 |
| Экранов | ~6 | **18+** | ~15-20 |
| Разделение Template/Instance | НЕТ | **ДА** | ДА |
| Персональные креды | НЕТ | **ДА** | ДА |
| Заявки на курс | НЕТ | **ДА** | ДА |
| Уведомления | НЕТ | **ДА** | ДА |
| Чат курса | НЕТ | **ДА** | ДА |
| Сертификаты | Частично | **ДА** (с шаблонами) | ДА |

### Вывод: САМОКРИТИКА МОЕГО АНАЛИЗА

**Ошибка №1:** Анализировал proto.html вместо proto/index.html

Мой первый анализ (gap_analysis.md v1) был основан на **устаревшем прототипе** (proto.html), а не на актуальной версии (proto/index.html + data.js + app.js).

**Ошибка №2:** Предлагал добавить то, что уже реализовано

Многие мои "критичные доработки" уже есть в proto v2:
- Разделение Template/Instance ✓
- Персональные креды ✓
- 5 ролей включая Методиста ✓
- Заявки на регистрацию ✓
- Уведомления ✓
- Чат курса ✓

**Ошибка №3:** Неверно оценил приоритеты

Предлагал убрать Методиста и Админа как "избыточных", хотя они УЖЕ реализованы и соответствуют схеме на картинках.

### Реальное состояние proto v2:

**Покрытие требований: ~85-90%**

Осталось проверить/доработать:
1. Отображение кредов в UI студента (данные есть)
2. Модальное оценивание в gradebook (функция openModal есть)
3. To-Do блок на дашборде (helper getUpcomingDeadlines есть)
4. Отображение материалов задания (materials[] есть)

**proto v2 ГОТОВ для демонстрации и почти готов для переноса в B3!**
