# Необходимые изменения в прототипе

Данный документ содержит полный список изменений, которые необходимо внести в прототип в соответствии с обновленной моделью данных (см. `requirements.md`).

---

## 1. VM Credentials → allocated_resources

### Текущее состояние

В прототипе используется структурированный объект `credentials` с полями для доступа к виртуальной машине:

**D:\B3\LMS\proto\data.js**
- **Строки 322-328, 340-346, 358-364**: Определение объекта `credentials` в массиве `enrollments` с полями:
  - `vm_url` - URL доступа к стенду
  - `username` - логин
  - `password` - пароль
  - `issued_at` - дата выдачи
  - `expires_at` - срок действия
- **Строка 872**: Функция `approveRequest()` создает структурированный объект `credentials` при одобрении заявки

**D:\B3\LMS\proto\modules\student.js**
- **Строки 265-294**: Отображение блока "Учебный стенд B3" на странице курса с форматированным выводом всех полей credentials
- **Строки 508-538**: Дублирование блока credentials на странице задания (для первого задания)

### Требуемые изменения

1. Заменить структурированный объект `credentials` на текстовое поле `allocated_resources`
2. Упростить отображение ресурсов с структурированного на произвольный текст
3. Обновить логику создания ресурсов при одобрении заявки

### Затронутые файлы

**D:\B3\LMS\proto\data.js:**
- Строки 322-328, 340-346, 358-364: Заменить объект `credentials` на поле `allocated_resources: "текст"`
- Строки 872-878: Обновить функцию `approveRequest()` - создавать простое текстовое поле вместо структурированного объекта

**D:\B3\LMS\proto\modules\student.js:**
- Строки 265-294: Упростить отображение - вместо структурированного блока вывести текстовое поле с возможностью многострочного отображения
- Строки 508-538: Аналогично упростить отображение для страницы задания

**Также требуется поиск и обновление в монолитных файлах:**
- `D:\B3\LMS\proto\app.js` (если используется)
- `D:\B3\LMS\proto\app_part1.js`, `app_part2.js`, `app_part3.js` (если используются)

---

## 2. Enrollment Request → Enrollment (объединение сущностей)

### Текущее состояние

В прототипе используется отдельный массив `enrollmentRequests` для заявок на запись:

**D:\B3\LMS\proto\data.js**
- **Строки 285-308**: Массив `LMSData.enrollmentRequests` с объектами заявок
- **Строки 844-897**: Функции для работы с заявками:
  - `getPendingRequests()` - получение заявок со статусом "pending"
  - `getAllRequests()` - все заявки
  - `approveRequest()` - одобрение с созданием Enrollment
  - `rejectRequest()` - отклонение заявки
- **Строка 1156**: Логирование количества enrollmentRequests

**D:\B3\LMS\proto\modules\admin.js**
- **Строки 94-173**: Функция `renderEnrollmentRequests()` - отображение списка заявок
- **Строки 5, 31**: Подсчет pending requests для отображения в статистике

**D:\B3\LMS\proto\modules\main.js**
- **Строка 79**: Маршрутизация на `renderEnrollmentRequests()`

### Требуемые изменения

1. Убрать отдельный массив `enrollmentRequests` из data.js
2. Добавить статус `pending_approval` в список статусов Enrollment (кроме существующих: `not_started`, `in_progress`, `completed`, `dropped`)
3. Обновить функции для работы с заявками - они должны работать с Enrollment напрямую
4. Обновить UI для отображения Enrollment в статусе `pending_approval` как заявки на согласование

### Затронутые файлы

**D:\B3\LMS\proto\data.js:**
- Строки 285-308: Удалить массив `enrollmentRequests`, перенести данные в `enrollments` со статусом `pending_approval`
- Строки 844-897: Обновить функции - работать с `enrollments` вместо `enrollmentRequests`
- Строка 1156: Удалить логирование `enrollmentRequests`
- Строки 944-955: Обновить `formatStatusLabel()` - добавить `pending_approval: "Ожидает одобрения"`
- Строки 968-975: Можно удалить `formatRequestStatusLabel()` (статусы теперь в Enrollment)

**D:\B3\LMS\proto\modules\admin.js:**
- Строки 94-173: Обновить `renderEnrollmentRequests()` - фильтровать enrollments по статусу `pending_approval`
- Строка 5: Изменить `Data.getPendingRequests()` на фильтрацию enrollments
- Строка 31: Аналогично

**D:\B3\LMS\proto\modules\main.js:**
- Без изменений (маршрутизация остается)

---

## 3. isPublic → status + accessibility

### Текущее состояние

В шаблонах курсов используется булево поле `isPublic` для определения видимости:

**D:\B3\LMS\proto\data.js**
- **Строки 97, 114**: Поле `isPublic: true` в объектах `courseTemplates`

**D:\B3\LMS\proto\modules\methodist.js**
- **Строки 27**: Отображение бейджа "Опубликован" / "Черновик" на основе `isPublic`
- **Строки 88-104**: Логика `getStatusActions()` - кнопки управления статусом на основе `isPublic`
- **Строки 140-141**: Отображение pill со статусом на основе `isPublic`
- **Строки 413, 416**: Функция `changeTemplateStatus()` изменяет `isPublic`

**D:\B3\LMS\proto\modules\student.js**
- **Строка 17**: Фильтрация рекомендованных курсов по `isPublic`

**D:\B3\LMS\proto\modules\guest.js**
- **Строки 5, 6, 168, 185, 409**: Фильтрация курсов в каталоге по `isPublic`

### Требуемые изменения

1. Заменить `isPublic` на два поля:
   - `status`: enum('draft', 'published', 'archived')
   - `accessibility`: enum('public', 'registered')
2. Обновить логику фильтрации и отображения:
   - Опубликованные курсы = `status === 'published'`
   - Публичные курсы = `status === 'published' && accessibility === 'public'`
   - Курсы для зарегистрированных = `status === 'published' && accessibility === 'registered'`

### Затронутые файлы

**D:\B3\LMS\proto\data.js:**
- Строки 97, 114: Заменить `isPublic: true` на `status: 'published', accessibility: 'public'`

**D:\B3\LMS\proto\modules\methodist.js:**
- Строка 27: Изменить логику бейджа - проверять `status`
- Строки 88-104: Обновить `getStatusActions()` - работать со статусами draft/published/archived
- Строки 140-141: Обновить отображение pill - показывать реальный статус
- Строки 413, 416: Обновить `changeTemplateStatus()` - изменять `status` вместо `isPublic`
- Добавить новый раздел в форму редактирования для управления `accessibility`

**D:\B3\LMS\proto\modules\student.js:**
- Строка 17: Изменить фильтр на `c.status === 'published'` (или добавить проверку accessibility)

**D:\B3\LMS\proto\modules\guest.js:**
- Строки 5, 6, 168, 185, 409: Изменить все фильтры `c.isPublic` на `c.status === 'published' && c.accessibility === 'public'`

**Также требуется обновление в других файлах:**
- `D:\B3\LMS\proto\app.js`: строки 298, 332-333, 483, 500, 733, 873, 1626, 1690, 1744-1745, 2017, 2020, 3074
- `D:\B3\LMS\proto\app_part1.js`: строки 298, 360
- `D:\B3\LMS\proto\app_part2.js`: строки 39, 164, 265, 305

---

## 4. stream_name → group_name (переименование "Поток")

### Текущее состояние

В прототипе используется термин "поток" (cohort в коде) для обозначения учебной группы:

**D:\B3\LMS\proto\data.js**
- **Строки 261, 272**: Поле `cohort` в объектах `courseInstances` (например, "2025-Q4-CORP")

**Отображение термина "Поток" в UI:**

**D:\B3\LMS\proto\modules\admin.js:**
- **Строка 125**: "**Поток:**" в карточке заявки
- **Строка 221**: "Управление потоками обучения" в заголовке

**D:\B3\LMS\proto\modules\student.js:**
- **Строки 48, 178**: Отображение `${course.cohort}` в карточках курсов

**D:\B3\LMS\proto\modules\teacher.js:**
- **Строки 90, 186, 243, 714, 1001**: Отображение cohort в различных местах интерфейса преподавателя

### Требуемые изменения

1. Переименовать концептуально "Поток" → "Учебная группа" во всех текстах UI
2. Рассмотреть переименование поля `cohort` → `group_name` в коде (опционально, для семантической ясности)
3. Обновить описание сущности "Экземпляр курса" в документации

### Затронутые файлы

**D:\B3\LMS\proto\modules\admin.js:**
- Строка 125: Заменить "**Поток:**" на "**Учебная группа:**"
- Строка 221: Заменить "Управление потоками обучения" на "Управление учебными группами"

**D:\B3\LMS\proto\modules\student.js:**
- Строки 48, 178: Без изменений в коде (отображается значение поля)

**D:\B3\LMS\proto\modules\teacher.js:**
- Строки 90, 186, 243, 714, 1001: Без изменений в коде (отображается значение)

**D:\B3\LMS\proto\data.js:**
- Строки 261, 272: Опционально - переименовать `cohort` → `group_name` для семантической ясности

**Также в других файлах:**
- `D:\B3\LMS\proto\app_part1.js`: строки 642, 789
- `D:\B3\LMS\proto\app_part2.js`: строки 647, 797, 826, 914-915, 947, 954, 963
- `D:\B3\LMS\proto\app_part3.js`: строки 81, 210, 658, 858
- `D:\B3\LMS\proto\app.js`: строки 904, 1028, 2405, 2472, 2501, 2714, 2758

**Примечание:** Если будет принято решение переименовать `cohort` в `group_name` в коде, потребуется массовая замена во всех местах использования.

---

## 5. Удаление max_enrollments из Course Instance

### Текущее состояние

В экземплярах курсов используется поле `maxEnrollments` для ограничения количества студентов:

**D:\B3\LMS\proto\data.js**
- **Строки 265, 276**: Поле `maxEnrollments` в объектах `courseInstances`

**D:\B3\LMS\proto\modules\admin.js:**
- **Строка 200**: Отображение "Записано студентов: X / Y" где Y = `instance.maxEnrollments`

**Формы создания/редактирования экземпляра:**
- `D:\B3\LMS\proto\app_part2.js`: строки 951, 967 (создание), строка 805 (отображение)
- `D:\B3\LMS\proto\app_part3.js`: строка 954 (отображение в форме)

### Требуемые изменения

1. Удалить поле `maxEnrollments` из всех объектов `courseInstances`
2. Убрать отображение "X / Y" и заменить на просто "X студентов"
3. Удалить поле из форм создания/редактирования экземпляров

### Затронутые файлы

**D:\B3\LMS\proto\data.js:**
- Строки 265, 276: Удалить строку `maxEnrollments: ...`

**D:\B3\LMS\proto\modules\admin.js:**
- Строка 200: Изменить `${enrollmentCount} / ${instance.maxEnrollments}` на `${enrollmentCount}`

**D:\B3\LMS\proto\app_part2.js:**
- Строка 805: Удалить ` / ${instance.maxEnrollments}` из отображения
- Строка 951: Удалить строку с `maxEnrollments`
- Строка 967: Удалить `maxEnrollments` из создаваемого объекта

**D:\B3\LMS\proto\app_part3.js:**
- Строка 954: Удалить поле из формы редактирования

**Также в:**
- `D:\B3\LMS\proto\app.js`: строка 2480

---

## 6. Удаление settings из Course Instance

### Текущее состояние

В описании требований упоминается удаление поля `settings` из Course Instance.

**D:\B3\LMS\proto\data.js**
- При поиске поля `settings` в объектах courseInstances не обнаружено использования

### Требуемые изменения

Поле `settings` не используется в текущем прототипе - дополнительных изменений не требуется.

### Затронутые файлы

Нет затронутых файлов.

---

## 7. Удаление due_days из Assignment Template и Instance

### Текущее состояние

В прототипе используется поле `dueDays` для определения срока выполнения задания:

**D:\B3\LMS\proto\data.js**
- **Строки 145, 166, 186, 204, 225, 243**: Поле `dueDays` во всех объектах `assignmentTemplates`
- **Строки 1030-1036**: Функция `computeDueDate(enrollmentDate, dueDays)` вычисляет дедлайн
- **Строки 1072-1073**: Использование `dueDays` в функции `getUpcomingDeadlines()`

**D:\B3\LMS\proto\modules\methodist.js:**
- **Строки 218-220**: Поле редактирования "Длительность (дней)" в графике заданий
- **Строка 619**: Поле "Срок (дней)" в модальном окне редактирования задания

**D:\B3\LMS\proto\modules\student.js:**
- **Строка 354**: Вычисление `dueDate` через `Data.computeDueDate(enrollment.enrolledAt, assignment.dueDays)`
- **Строки 388-394**: Отображение срока сдачи на странице задания

**D:\B3\LMS\proto\modules\guest.js:**
- **Строка 370**: Отображение "X дней" для `assignment.dueDays` в предпросмотре курса

### Требуемые изменения

1. Удалить поле `dueDays` из всех Assignment Templates
2. Удалить функцию `computeDueDate()` и связанную логику вычисления дедлайнов
3. Убрать отображение дедлайнов в интерфейсе студента и гостя
4. Удалить поле из форм редактирования заданий в интерфейсе методиста
5. Обновить логику на основе графиков курса (будет реализовано позже)

### Затронутые файлы

**D:\B3\LMS\proto\data.js:**
- Строки 145, 166, 186, 204, 225, 243: Удалить `dueDays: ...` из всех assignmentTemplates
- Строки 1030-1046: Удалить функции `computeDueDate()`, `getDaysUntilDeadline()`, `formatDaysRemaining()`
- Строки 1056-1093: Обновить `getUpcomingDeadlines()` - убрать зависимость от `dueDays` или удалить функцию

**D:\B3\LMS\proto\modules\methodist.js:**
- Строки 218-220: Удалить поле "Длительность (дней)" из графика заданий
- Строка 619: Удалить поле "Срок (дней)" из модального окна

**D:\B3\LMS\proto\modules\student.js:**
- Строка 354: Удалить вычисление `dueDate`
- Строки 388-394: Удалить блок отображения срока сдачи

**D:\B3\LMS\proto\modules\guest.js:**
- Строка 370: Удалить отображение длительности задания

**Также в других файлах:**
- `D:\B3\LMS\proto\app_part1.js`: строки 531, 857
- `D:\B3\LMS\proto\app_part2.js`: строки 209, 394, 434, 454, 471
- `D:\B3\LMS\proto\app.js`: строки 689, 1133, 1822, 1824, 2225

---

## Общие рекомендации по реализации

### Порядок внесения изменений:

1. **Начать с data.js** - обновить модель данных (это затронет все остальное)
2. **Обновить модульные файлы** в `modules/`:
   - `student.js`
   - `methodist.js`
   - `admin.js`
   - `teacher.js`
   - `guest.js`
3. **Обновить монолитные файлы** (если используются):
   - `app.js`
   - `app_part1.js`, `app_part2.js`, `app_part3.js`

### Тестирование после изменений:

- **Студент**: Проверить отображение allocated_resources, работу без дедлайнов
- **Методист**: Проверить управление статусами курсов, редактирование заданий без due_days
- **Администратор**: Проверить работу с заявками через Enrollment (статус pending_approval)
- **Гость**: Проверить фильтрацию курсов по status + accessibility

### Добавить новую функциональность:

После внесения изменений потребуется реализовать:
- **График заданий** (Assignment Schedule) - поля `duration_days`, `start_condition`, `start_offset_days` для каждого задания

---

## Итоговая статистика изменений

| Категория | Файлов затронуто | Сложность |
|-----------|------------------|-----------|
| VM → allocated_resources | 3-5 | Средняя |
| Enrollment Request merge | 3 | Высокая |
| isPublic → status + accessibility | 5-8 | Средняя |
| stream → group_name | 8-10 | Низкая (UI) |
| Удаление max_enrollments | 4 | Низкая |
| Удаление settings | 0 | Нет |
| Удаление due_days | 6-8 | Высокая |

**Общее количество файлов:** ~10-15 (с учетом дублирования в монолитных версиях)

**Оценка трудозатрат:** 4-6 часов (с учетом тестирования)

---

## 8. Демонстрация workflow согласования заявок

### Цель

Показать в прототипе полный цикл согласования заявок на курс:
- **У студента:** заявка на согласовании отображается в списке курсов
- **У преподавателя:** не стартованный курс с разными статусами студентов (согласованные и ожидающие)
- **У администратора:** список заявок для обработки

Это позволит продемонстрировать работу объединенной сущности Enrollment со статусом `pending_approval` (см. Раздел 2).

### Требуемые изменения в data.js

#### 8.1. Создание "будущего" курса

**D:\B3\LMS\proto\data.js - Массив courseInstances (строки 256-279):**

Добавить новый экземпляр курса со статусом `planned`:

```javascript
{
  id: "ci-advanced-future",
  courseTemplateId: "tpl-advanced",
  teacherId: "teacher-1",
  cohort: "Группа февраль 2026",
  startDate: "2026-02-01",
  endDate: "2026-04-30",
  status: "planned",
  maxEnrollments: 20,
  createdAt: "2025-12-05T10:00:00Z"
}
```

**Примечание:** Можно использовать существующий курс `ci-advanced-2025` (строки 269-278), изменив его даты и статус на `planned`.

#### 8.2. Добавление enrollments с разными статусами

**D:\B3\LMS\proto\data.js - Массив enrollments (строки 314-369):**

Добавить демонстрационные записи для будущего курса:

```javascript
// Enrollment 1: Текущий демо-студент - заявка на согласовании
{
  id: "enr-demo-pending",
  studentId: "student-1",
  courseInstanceId: "ci-advanced-future",
  status: "pending_approval",
  requestComment: "Хочу повысить квалификацию по платформе B3. Прошел базовый курс с оценкой 95%.",
  progress: 0,
  totalScore: 0,
  credentials: null,  // Выдаются только после одобрения
  enrolledAt: "2025-12-10T09:30:00Z",  // Дата подачи заявки
  completedAt: null,
  lastActivityAt: "2025-12-10T09:30:00Z"
},
// Enrollment 2: Другой студент - заявка на согласовании
{
  id: "enr-student2-pending",
  studentId: "student-2",
  courseInstanceId: "ci-advanced-future",
  status: "pending_approval",
  requestComment: "Хочу изучить продвинутые возможности B3 для корпоративного проекта.",
  progress: 0,
  totalScore: 0,
  credentials: null,
  enrolledAt: "2025-12-09T14:20:00Z",
  completedAt: null,
  lastActivityAt: "2025-12-09T14:20:00Z"
},
// Enrollment 3: Студент с согласованной заявкой
{
  id: "enr-student3-approved",
  studentId: "student-3",
  courseInstanceId: "ci-advanced-future",
  status: "approved",
  requestComment: "Готов к обучению, опыт работы с B3 6 месяцев.",
  approvedBy: "admin-1",
  approvedAt: "2025-12-08T11:00:00Z",
  approvalComment: "Одобрено. Опыт работы подтвержден.",
  progress: 0,
  totalScore: 0,
  credentials: {
    vm_url: "https://sandbox.b3.example.com/instance-future-003",
    username: "student003_adv",
    password: "FutPass_2026_Xyz#",
    issued_at: "2025-12-08T11:00:00Z",
    expires_at: "2026-05-01T23:59:59Z"
  },
  enrolledAt: "2025-12-07T10:00:00Z",
  completedAt: null,
  lastActivityAt: "2025-12-08T11:00:00Z"
}
```

**Дополнительные поля для Enrollment:**
- `requestComment` - комментарий студента при подаче заявки
- `approvedBy` - ID администратора, одобрившего заявку
- `approvedAt` - дата одобрения
- `approvalComment` - комментарий администратора

#### 8.3. Обновление форматтера статусов

**D:\B3\LMS\proto\data.js - Функция formatStatusLabel (строки 944-955):**

Добавить статусы для enrollments:

```javascript
LMSData.formatStatusLabel = function(status) {
  const labels = {
    not_started: "Не начат",
    in_progress: "В процессе",
    completed: "Завершён",
    dropped: "Отчислен",
    pending_approval: "Ожидает согласования",  // НОВЫЙ
    approved: "Согласовано",                    // НОВЫЙ
    planned: "Запланирован",
    active: "Активен",
    archived: "Архивирован"
  };
  return labels[status] || status;
};
```

### Требуемые изменения в UI

#### 8.4. Студент - Отображение заявок на согласовании

**D:\B3\LMS\proto\modules\student.js - Функция renderDashboard() (строки ~10-70):**

Добавить новую секцию для отображения заявок:

```javascript
// После секции "Мои курсы" и до "Рекомендуемые курсы"

// Получить заявки студента (enrollments со статусом pending_approval)
const pendingEnrollments = Data.getEnrollmentsByStudent(currentUser.id)
  .filter(e => e.status === 'pending_approval');

if (pendingEnrollments.length > 0) {
  html += `
    <section class="mb-4">
      <h2 class="h4 mb-3">
        <i class="bi bi-clock-history me-2"></i>
        Заявки на рассмотрении
      </h2>
      <div class="row">
  `;

  pendingEnrollments.forEach(enrollment => {
    const course = Data.getCourseWithInstance(enrollment.courseInstanceId);
    html += `
      <div class="col-md-6 mb-3">
        <div class="card border-warning">
          <div class="card-body">
            <h5 class="card-title">${course.title}</h5>
            <p class="text-muted mb-2">${course.cohort}</p>
            <div class="d-flex align-items-center mb-2">
              <span class="badge bg-warning text-dark me-2">
                <i class="bi bi-hourglass-split me-1"></i>
                ${Data.formatStatusLabel('pending_approval')}
              </span>
              <small class="text-muted">
                Подана: ${Data.formatDate(enrollment.enrolledAt)}
              </small>
            </div>
            ${enrollment.requestComment ? `
              <p class="small mb-2">
                <strong>Комментарий:</strong> ${enrollment.requestComment}
              </p>
            ` : ''}
            <button class="btn btn-sm btn-outline-secondary"
                    onclick="Student.cancelRequest('${enrollment.id}')">
              <i class="bi bi-x-circle me-1"></i>
              Отменить заявку
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </section>
  `;
}
```

**Добавить функцию отмены заявки:**

```javascript
Student.cancelRequest = function(enrollmentId) {
  if (confirm('Вы уверены, что хотите отменить заявку?')) {
    // В реальной системе здесь будет API запрос
    const idx = Data.enrollments.findIndex(e => e.id === enrollmentId);
    if (idx !== -1) {
      Data.enrollments.splice(idx, 1);
      Student.renderDashboard();
      alert('Заявка отменена');
    }
  }
};
```

#### 8.5. Преподаватель - Отображение запланированных курсов

**D:\B3\LMS\proto\modules\teacher.js - Функция renderDashboard() (строки ~5-100):**

Добавить секцию для запланированных курсов:

```javascript
// После секции "Активные курсы"

// Получить запланированные курсы преподавателя
const plannedCourses = Data.courseInstances.filter(
  ci => ci.teacherId === currentUser.id && ci.status === 'planned'
);

if (plannedCourses.length > 0) {
  html += `
    <section class="mb-4">
      <h2 class="h4 mb-3">
        <i class="bi bi-calendar-event me-2"></i>
        Запланированные курсы
      </h2>
      <div class="row">
  `;

  plannedCourses.forEach(instance => {
    const template = Data.getCourseTemplate(instance.courseTemplateId);
    const allEnrollments = Data.getEnrollmentsByCourse(instance.id);
    const approvedCount = allEnrollments.filter(e => e.status === 'approved').length;
    const pendingCount = allEnrollments.filter(e => e.status === 'pending_approval').length;

    html += `
      <div class="col-md-6 mb-3">
        <div class="card border-info">
          <div class="card-body">
            <h5 class="card-title">${template.title}</h5>
            <p class="text-muted mb-2">${instance.cohort}</p>
            <div class="mb-3">
              <span class="badge bg-info text-dark">
                <i class="bi bi-calendar-check me-1"></i>
                ${Data.formatStatusLabel('planned')}
              </span>
            </div>
            <div class="small mb-2">
              <i class="bi bi-calendar3 me-1"></i>
              <strong>Старт:</strong> ${Data.formatDate(instance.startDate)}
            </div>
            <div class="small mb-2">
              <i class="bi bi-people-fill me-1"></i>
              <strong>Согласовано студентов:</strong> ${approvedCount}
            </div>
            ${pendingCount > 0 ? `
              <div class="small mb-3">
                <i class="bi bi-hourglass-split me-1"></i>
                <strong>Заявок на согласовании:</strong>
                <span class="badge bg-warning text-dark">${pendingCount}</span>
              </div>
            ` : ''}
            <button class="btn btn-sm btn-primary"
                    onclick="Teacher.viewPlannedCourseStudents('${instance.id}')">
              <i class="bi bi-list-ul me-1"></i>
              Список студентов
            </button>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </section>
  `;
}
```

#### 8.6. Преподаватель - Список студентов запланированного курса

**D:\B3\LMS\proto\modules\teacher.js - Новая функция:**

```javascript
Teacher.viewPlannedCourseStudents = function(instanceId) {
  const instance = Data.getCourseInstance(instanceId);
  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const enrollments = Data.getEnrollmentsByCourse(instanceId);

  const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
  const pendingEnrollments = enrollments.filter(e => e.status === 'pending_approval');

  let html = `
    <div class="container mt-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <a href="#" onclick="Teacher.renderDashboard(); return false;">Дашборд</a>
          </li>
          <li class="breadcrumb-item active">
            Студенты курса
          </li>
        </ol>
      </nav>

      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h3 class="mb-0">${template.title}</h3>
          <p class="mb-0">${instance.cohort}</p>
        </div>
        <div class="card-body">
          <div class="row mb-3">
            <div class="col-md-4">
              <strong>Дата старта:</strong> ${Data.formatDate(instance.startDate)}
            </div>
            <div class="col-md-4">
              <strong>Дата окончания:</strong> ${Data.formatDate(instance.endDate)}
            </div>
            <div class="col-md-4">
              <strong>Статус:</strong>
              <span class="badge bg-info text-dark">
                ${Data.formatStatusLabel(instance.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Согласованные студенты -->
      <div class="card mb-4">
        <div class="card-header bg-success text-white">
          <h4 class="mb-0">
            <i class="bi bi-check-circle me-2"></i>
            Согласованные студенты (${approvedEnrollments.length})
          </h4>
        </div>
        <div class="card-body">
  `;

  if (approvedEnrollments.length === 0) {
    html += '<p class="text-muted">Нет согласованных студентов</p>';
  } else {
    html += '<div class="list-group">';
    approvedEnrollments.forEach(enrollment => {
      const student = Data.getUserById(enrollment.studentId);
      html += `
        <div class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1">${student.name}</h6>
              <small class="text-muted">${student.organization || ''}</small>
            </div>
            <div class="text-end">
              <span class="badge bg-success">Согласован</span><br>
              <small class="text-muted">
                ${Data.formatDate(enrollment.approvedAt)}
              </small>
            </div>
          </div>
          ${enrollment.approvalComment ? `
            <p class="small mb-0 mt-2">
              <strong>Комментарий:</strong> ${enrollment.approvalComment}
            </p>
          ` : ''}
        </div>
      `;
    });
    html += '</div>';
  }

  html += `
        </div>
      </div>

      <!-- Заявки на согласовании -->
      <div class="card mb-4">
        <div class="card-header bg-warning text-dark">
          <h4 class="mb-0">
            <i class="bi bi-hourglass-split me-2"></i>
            Ожидают согласования (${pendingEnrollments.length})
          </h4>
        </div>
        <div class="card-body">
  `;

  if (pendingEnrollments.length === 0) {
    html += '<p class="text-muted">Нет заявок на согласовании</p>';
  } else {
    html += '<div class="list-group">';
    pendingEnrollments.forEach(enrollment => {
      const student = Data.getUserById(enrollment.studentId);
      html += `
        <div class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-1">${student.name}</h6>
              <small class="text-muted">${student.organization || ''}</small>
            </div>
            <div class="text-end">
              <span class="badge bg-warning text-dark">Ожидает</span><br>
              <small class="text-muted">
                Подана: ${Data.formatDate(enrollment.enrolledAt)}
              </small>
            </div>
          </div>
          ${enrollment.requestComment ? `
            <div class="alert alert-light small mt-2 mb-2">
              <strong>Комментарий студента:</strong><br>
              ${enrollment.requestComment}
            </div>
          ` : ''}
          <div class="mt-2">
            <button class="btn btn-sm btn-outline-primary"
                    onclick="Teacher.viewStudentProfile('${student.id}')">
              <i class="bi bi-person me-1"></i>
              Профиль студента
            </button>
          </div>
        </div>
      `;
    });
    html += '</div>';
  }

  html += `
        </div>
      </div>

      <button class="btn btn-secondary" onclick="Teacher.renderDashboard()">
        <i class="bi bi-arrow-left me-1"></i>
        Назад к дашборду
      </button>
    </div>
  `;

  document.getElementById('app').innerHTML = html;
};

Teacher.viewStudentProfile = function(studentId) {
  const student = Data.getUserById(studentId);
  alert(`Профиль студента: ${student.name}\nEmail: ${student.email}\nОрганизация: ${student.organization || 'Не указана'}`);
};
```

#### 8.7. Администратор - Обновление раздела заявок

**D:\B3\LMS\proto\modules\admin.js - Функция renderEnrollmentRequests() (строки 94-173):**

Обновить функцию для работы с новой структурой Enrollment:

```javascript
Admin.renderEnrollmentRequests = function() {
  // Получить все enrollments со статусом pending_approval
  const pendingEnrollments = Data.enrollments.filter(
    e => e.status === 'pending_approval'
  );

  let html = `
    <div class="container mt-4">
      <h2 class="mb-4">
        <i class="bi bi-clipboard-check me-2"></i>
        Согласование заявок на курсы
      </h2>

      ${pendingEnrollments.length === 0 ? `
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Нет заявок на согласовании
        </div>
      ` : `
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Найдено заявок на согласовании: <strong>${pendingEnrollments.length}</strong>
        </div>
      `}

      <div class="row">
  `;

  pendingEnrollments.forEach(enrollment => {
    const student = Data.getUserById(enrollment.studentId);
    const course = Data.getCourseWithInstance(enrollment.courseInstanceId);

    html += `
      <div class="col-md-6 mb-3">
        <div class="card border-warning">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">
              <i class="bi bi-person me-2"></i>
              ${student.name}
            </h5>
          </div>
          <div class="card-body">
            <p class="mb-2">
              <strong>Курс:</strong> ${course.title}
            </p>
            <p class="mb-2">
              <strong>Учебная группа:</strong> ${course.cohort}
            </p>
            <p class="mb-2">
              <strong>Организация:</strong> ${student.organization || 'Не указана'}
            </p>
            <p class="mb-2">
              <strong>Дата подачи:</strong> ${Data.formatDateTime(enrollment.enrolledAt)}
            </p>
            ${enrollment.requestComment ? `
              <div class="alert alert-light small mb-3">
                <strong>Комментарий студента:</strong><br>
                ${enrollment.requestComment}
              </div>
            ` : ''}
            <div class="btn-group w-100" role="group">
              <button class="btn btn-success"
                      onclick="Admin.approveEnrollment('${enrollment.id}')">
                <i class="bi bi-check-circle me-1"></i>
                Одобрить
              </button>
              <button class="btn btn-danger"
                      onclick="Admin.rejectEnrollment('${enrollment.id}')">
                <i class="bi bi-x-circle me-1"></i>
                Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = html;
};

// Новые функции для работы с enrollments
Admin.approveEnrollment = function(enrollmentId) {
  const comment = prompt('Комментарий к одобрению (опционально):');
  if (comment === null) return; // Отмена

  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return;

  const instance = Data.getCourseInstance(enrollment.courseInstanceId);
  const template = Data.getCourseTemplate(instance.courseTemplateId);

  // Обновить статус и добавить данные одобрения
  enrollment.status = 'approved';
  enrollment.approvedBy = currentUser.id;
  enrollment.approvedAt = new Date().toISOString();
  enrollment.approvalComment = comment || 'Заявка одобрена';

  // Выдать credentials если требуется стенд
  if (template.requiresSandbox) {
    enrollment.credentials = {
      vm_url: `https://sandbox.b3.example.com/instance-${Date.now()}`,
      username: `student${Date.now()}`,
      password: `Pass_${Date.now()}_Auto!`,
      issued_at: new Date().toISOString(),
      expires_at: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
    };
  }

  alert('Заявка одобрена! Студент получит уведомление.');
  Admin.renderEnrollmentRequests();
};

Admin.rejectEnrollment = function(enrollmentId) {
  const reason = prompt('Причина отклонения:');
  if (!reason) {
    alert('Необходимо указать причину отклонения');
    return;
  }

  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return;

  enrollment.status = 'rejected';
  enrollment.approvedBy = currentUser.id;
  enrollment.approvedAt = new Date().toISOString();
  enrollment.approvalComment = reason;

  alert('Заявка отклонена. Студент получит уведомление.');
  Admin.renderEnrollmentRequests();
};
```

**D:\B3\LMS\proto\modules\admin.js - Обновить счетчик заявок в дашборде (строки ~5, ~31):**

Изменить:
```javascript
// Было:
const pendingCount = Data.getPendingRequests().length;

// Стало:
const pendingCount = Data.enrollments.filter(e => e.status === 'pending_approval').length;
```

### Визуальный результат

После внесения изменений:

#### Для студента (демо):
```
Мои курсы
├── Заявки на рассмотрении          ← НОВАЯ СЕКЦИЯ
│   └── [Продвинутые сценарии на B3]
│       Группа февраль 2026
│       [!] Ожидает согласования
│       Подана: 10 дек. 2025
│       Комментарий: "Хочу повысить квалификацию..."
│       [Отменить заявку]
├── Активные курсы
│   └── [Основы платформы B3] (в процессе)
└── Завершенные курсы
    └── [...]
```

#### Для преподавателя:
```
Мои курсы
├── Активные курсы
│   └── [Основы платформы B3] (2025-Q4-CORP)
├── Запланированные курсы           ← НОВАЯ СЕКЦИЯ
│   └── [Продвинутые сценарии на B3]
│       Группа февраль 2026
│       [i] Запланирован
│       Старт: 1 февраля 2026
│       Согласовано студентов: 1
│       Заявок на согласовании: [!] 2
│       [Список студентов]
└── Завершенные курсы
```

#### Список студентов запланированного курса (для преподавателя):
```
Продвинутые сценарии на B3
Группа февраль 2026

┌─────────────────────────────────────────────┐
│ Согласованные студенты (1)                  │
├─────────────────────────────────────────────┤
│ Петр Желающий                    [✓ Согласован] │
│ ИП Иванов                        08 дек. 2025   │
│ Комментарий: Одобрено. Опыт работы подтвержден. │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Ожидают согласования (2)                    │
├─────────────────────────────────────────────┤
│ Иван Студентов                   [⏳ Ожидает]  │
│ ООО «Ромашка»                    10 дек. 2025   │
│ 💬 Хочу повысить квалификацию...              │
│ [Профиль студента]                            │
├─────────────────────────────────────────────┤
│ Мария Новичкова                  [⏳ Ожидает]  │
│ ООО «Василёк»                    09 дек. 2025   │
│ 💬 Хочу изучить продвинутые возможности...    │
│ [Профиль студента]                            │
└─────────────────────────────────────────────┘
```

#### Для администратора:
```
Согласование заявок на курсы
[!] Найдено заявок на согласовании: 2

┌────────────────────────────────────┐
│ [👤] Иван Студентов                │
├────────────────────────────────────┤
│ Курс: Продвинутые сценарии на B3   │
│ Учебная группа: Группа февраль 2026│
│ Организация: ООО «Ромашка»         │
│ Дата подачи: 10 дек. 2025, 09:30   │
│                                     │
│ 💬 Комментарий студента:            │
│ Хочу повысить квалификацию по      │
│ платформе B3. Прошел базовый курс  │
│ с оценкой 95%.                     │
│                                     │
│ [✓ Одобрить] [✗ Отклонить]         │
└────────────────────────────────────┘
```

### Затронутые файлы

| Файл | Строки | Изменения |
|------|--------|-----------|
| **D:\B3\LMS\proto\data.js** | 256-279 | Добавить курс `ci-advanced-future` или обновить `ci-advanced-2025` |
| | 314-369 | Добавить 3 демонстрационных enrollment с разными статусами |
| | 944-955 | Добавить `pending_approval` и `approved` в `formatStatusLabel()` |
| **D:\B3\LMS\proto\modules\student.js** | ~10-70 | Добавить секцию "Заявки на рассмотрении" в дашборд |
| | (новая функция) | Добавить `Student.cancelRequest()` |
| **D:\B3\LMS\proto\modules\teacher.js** | ~5-100 | Добавить секцию "Запланированные курсы" в дашборд |
| | (новая функция) | Добавить `Teacher.viewPlannedCourseStudents()` |
| | (новая функция) | Добавить `Teacher.viewStudentProfile()` |
| **D:\B3\LMS\proto\modules\admin.js** | 94-173 | Полностью переписать `renderEnrollmentRequests()` для работы с Enrollment |
| | (новые функции) | Добавить `Admin.approveEnrollment()` и `Admin.rejectEnrollment()` |
| | 5, 31 | Обновить подсчет pending requests |

### Связь с другими изменениями

Этот раздел зависит от:
- **Раздел 2:** Объединение Enrollment Request → Enrollment
  - Использует статус `pending_approval` вместо отдельной сущности
  - Переиспользует поля `requestComment`, `approvedBy`, `approvalComment`

После реализации этого раздела workflow согласования будет полностью демонстрироваться во всех ролях прототипа.

### Оценка трудозатрат

**2-3 часа** (включая тестирование всех трех ролей)
