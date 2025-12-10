# B3 Platform Setup Guide: LMS Implementation

**Document Version**: 1.0
**Date**: 2025-12-09
**Purpose**: Step-by-step instructions for implementing B3 Learning Portal on B3 platform

---

## Шаг 1: Создание Типов представления (Entity Types)

### 1.1 Справочники (Reference Entities)

#### Пользователь (User)
**Тип**: Справочник (расширение стандартного User B3)
**Код**: `lms_user`
**Django Model**: Reference

**Поля**:
- `patronymic` (String): Отчество
- `phone` (String): Телефон
- `organization` (String): Организация
- `position` (String): Должность
- `department` (String): Подразделение
- `avatar` (File): Фото профиля
- `bio` (Text): Краткая биография

**Валидаторы**:
- Email format (встроенный)
- Phone format: `^(\+7|8)?[\s\-]?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$`

---

#### Шаблон курса (Course Template)
**Тип**: Справочник
**Код**: `course_template`
**Django Model**: Reference

**Поля**:
- `code` (String, unique): Код курса (B3-101)
- `title` (String, required): Название
- `short_description` (String, 200): Краткое описание
- `full_description` (RichText): Полное описание
- `level` (Choice): Базовый | Продвинутый | Экспертный
- `category` (Choice): Разработка | Администрирование | Интеграция | Аналитика
- `duration_hours` (Integer): Длительность в часах
- `language` (Choice, default='ru'): Язык курса
- `cover_image` (File): Изображение обложки
- `prerequisites_text` (Text): Требуемые навыки
- `learning_objectives` (RichText): Цели обучения
- `target_audience` (Text): Целевая аудитория
- `status` (Choice): Черновик | Активен | Архивирован
- `created_by` (FK → User): Автор курса
- `passing_score_percent` (Integer, default=70): Проходной балл %
- `certificate_template` (FK → Certificate Template): Шаблон сертификата

**Связи**:
- One-to-Many с Assignment Template
- One-to-Many с Course Instance
- Many-to-One с Certificate Template

---

#### Шаблон задания (Assignment Template)
**Тип**: Справочник
**Код**: `assignment_template`
**Django Model**: Reference

**Поля**:
- `course_template` (FK → Course Template, required): Родительский курс
- `order` (Integer): Порядковый номер
- `module_name` (String): Название модуля
- `title` (String): Название задания
- `type` (Choice): Лекция | Практика | Тест | Проект | Чтение
- `description` (RichText): Описание и инструкции
- `materials` (Files, multiple): Прикрепленные файлы
- `max_score` (Integer): Максимальный балл
- `is_required` (Boolean, default=true): Обязательное для завершения
- `estimated_hours` (Decimal): Примерное время
- `due_days_after_start` (Integer, nullable): Дней от начала курса до дедлайна
- `submission_type` (Choice): Текст | Файл | Ссылка | Без сдачи
- `rubric` (RichText): Критерии оценки

**Связи**:
- Many-to-One с Course Template
- One-to-Many с Assignment Instance

---

#### Шаблон сертификата (Certificate Template)
**Тип**: Справочник
**Код**: `certificate_template`
**Django Model**: Reference

**Поля**:
- `name` (String): Название шаблона
- `description` (Text): Описание назначения
- `template_file` (File, DOCX): Файл шаблона с плейсхолдерами
- `status` (Choice): Черновик | Активен | Архивирован
- `created_by` (FK → User): Создатель

**Плейсхолдеры в DOCX**:
```
{{student_name}} - ФИО студента
{{course_title}} - Название курса
{{completion_date}} - Дата завершения
{{serial_number}} - Серийный номер
{{final_grade}} - Итоговая оценка
{{instructor_name}} - ФИО преподавателя
{{issue_date}} - Дата выдачи
```

---

### 1.2 Документы (Transactional Entities)

#### Экземпляр курса (Course Instance)
**Тип**: Документ
**Код**: `course_instance`
**Django Model**: Document

**Поля**:
- `course_template` (FK → Course Template): Базовый шаблон
- `cohort_name` (String): Название потока (Поток осень 2025)
- `start_date` (Date): Дата начала
- `end_date` (Date, nullable): Дата окончания
- `instructors` (M2M → User): Преподаватели
- `status` (Choice): Планируется | Идёт набор | Идёт обучение | Завершён | Отменён
- `max_students` (Integer, nullable): Макс. студентов
- `current_students` (Computed): Текущее кол-во студентов
- `location` (String): Очно / Онлайн / Гибрид
- `notes` (Text): Внутренние заметки

**Вычисляемые поля**:
```python
current_students = COUNT(Enrollment WHERE status='Активна')
is_full = current_students >= max_students
days_until_start = start_date - today
```

---

#### Заявка на регистрацию (Enrollment Request)
**Тип**: Документ
**Код**: `enrollment_request`
**Django Model**: Document

**Поля**:
- `student` (FK → User): Заявитель
- `course_instance` (FK → Course Instance): Желаемый курс
- `request_date` (DateTime, auto): Дата заявки
- `status` (Choice): Новая | На рассмотрении | Одобрена | Отклонена | Отозвана
- `motivation` (Text, nullable): Мотивация
- `reviewed_by` (FK → User, nullable): Кто рассмотрел
- `reviewed_at` (DateTime, nullable): Когда рассмотрено
- `rejection_reason` (Text, nullable): Причина отказа
- `payment_status` (Choice, nullable): Не требуется | Ожидает оплаты | Оплачено
- `payment_amount` (Decimal, nullable): Стоимость

---

#### Запись на курс (Enrollment)
**Тип**: Документ
**Код**: `enrollment`
**Django Model**: Document

**Поля**:
- `student` (FK → User): Студент
- `course_instance` (FK → Course Instance): Экземпляр курса
- `enrollment_date` (DateTime, auto): Дата записи
- `status` (Choice): Ожидает начала | Активна | Завершена | Отчислен
- `progress_percent` (Computed): % завершения
- `total_score` (Computed): Сумма баллов
- `max_possible_score` (Computed): Макс. возможных баллов
- `final_grade` (Decimal, nullable): Итоговая оценка 0-100
- `completion_date` (DateTime, nullable): Дата завершения
- `certificate` (FK → Certificate Instance, nullable): Сертификат
- `personal_sandbox_url` (String, nullable): Креды на стенд
- `personal_notes` (Text): Заметки студента
- `instructor_notes` (Text): Заметки преподавателя

**Вычисляемые поля**:
```python
progress_percent = (COUNT(AssignmentInstance WHERE status='Принято') /
                   COUNT(AssignmentTemplate WHERE is_required=True)) * 100
total_score = SUM(AssignmentInstance.score)
max_possible_score = SUM(AssignmentTemplate.max_score WHERE is_required=True)
final_grade = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0
is_passed = final_grade >= course_template.passing_score_percent
```

---

#### Экземпляр задания (Assignment Instance)
**Тип**: Документ
**Код**: `assignment_instance`
**Django Model**: Document

**Поля**:
- `enrollment` (FK → Enrollment): Запись на курс студента
- `assignment_template` (FK → Assignment Template): Шаблон задания
- `status` (Choice): Не начато | В работе | Отправлено на проверку | Принято | Требует доработки
- `created_at` (DateTime, auto): Создано
- `started_at` (DateTime, nullable): Начато
- `submitted_at` (DateTime, nullable): Отправлено
- `graded_at` (DateTime, nullable): Проверено
- `due_date` (Date, computed): Дедлайн
- `submission_text` (RichText, nullable): Текст ответа
- `submission_files` (Files, multiple, nullable): Файлы
- `submission_url` (String, nullable): Внешняя ссылка
- `score` (Integer, nullable): Полученные баллы
- `feedback_text` (RichText, nullable): Комментарий преподавателя
- `graded_by` (FK → User, nullable): Кто проверил
- `attempt_number` (Integer, default=1): Номер попытки

**Вычисляемые поля**:
```python
due_date = enrollment.course_instance.start_date + assignment_template.due_days_after_start
is_overdue = (status != 'Принято') AND (today > due_date)
is_pending_review = status == 'Отправлено на проверку'
```

---

#### Сообщение (Message)
**Тип**: Документ
**Код**: `message`
**Django Model**: Document

**Поля**:
- `thread_type` (Choice): По курсу | По заданию
- `course_instance` (FK → Course Instance, nullable): Если тип = По курсу
- `assignment_instance` (FK → Assignment Instance, nullable): Если тип = По заданию
- `author` (FK → User): Автор
- `author_role` (Choice): Студент | Преподаватель | Администратор
- `content` (RichText, max=5000): Текст сообщения
- `attachments` (Files, multiple, nullable): Вложения
- `created_at` (DateTime, auto): Время отправки
- `is_read` (Boolean, default=False): Прочитано
- `read_at` (DateTime, nullable): Когда прочитано
- `parent_message` (FK → Message, nullable): Родительское сообщение (для тредов)

**Валидаторы**:
- Либо course_instance, либо assignment_instance должно быть заполнено, не оба

---

#### Экземпляр сертификата (Certificate Instance)
**Тип**: Документ
**Код**: `certificate_instance`
**Django Model**: Document

**Поля**:
- `enrollment` (FK → Enrollment): Запись на курс
- `certificate_template` (FK → Certificate Template): Использованный шаблон
- `serial_number` (String, auto, unique): Серийный номер (формат: COURSE-YEAR-####)
- `issue_date` (Date, auto): Дата выдачи
- `final_score` (Decimal): Оценка на момент выдачи
- `pdf_file` (File, auto): Сгенерированный PDF
- `verification_url` (String, computed): Ссылка на проверку
- `qr_code` (File, auto): QR-код для проверки
- `status` (Choice): Выдан | Отозван
- `revoked_at` (DateTime, nullable): Дата отзыва
- `revoked_reason` (Text, nullable): Причина отзыва
- `issued_by` (FK → User, nullable): Кто выдал вручную

**Вычисляемые поля**:
```python
serial_number = f"{course_template.code}-{issue_date.year}-{seq:04d}"
verification_url = f"https://lms.b3.ru/certificates/verify/{id}"
```

---

## Шаг 2: Настройка форм

### 2.1 Форма списка курсов (Student Dashboard)

**Тип формы**: Список + Дашборд
**Сущность**: Enrollment
**Код формы**: `student_dashboard`

**Виджеты**:
1. **Карточки курсов** (Grid, 3 колонки):
   - Поля: course_instance.course_template.title, course_instance.course_template.cover_image
   - Прогресс-бар: progress_percent
   - Статус-бейдж: status (цветовая индикация)
   - Кнопка "Продолжить" → переход к следующему незавершенному заданию

2. **Виджет прогресса** (Summary):
   - Завершено курсов: COUNT(Enrollment WHERE status='Завершена')
   - Активных курсов: COUNT(Enrollment WHERE status='Активна')
   - Всего баллов: SUM(total_score)

3. **Виджет дедлайнов** (List):
   - Источник: Assignment Instance WHERE status != 'Принято' ORDER BY due_date ASC LIMIT 5
   - Поля: assignment_template.title, due_date, course_instance.course_template.title

**Фильтры**:
- По статусу курса (Активна / Завершена)
- По категории курса

---

### 2.2 Детальная форма курса (Course View)

**Тип формы**: Элемент + Список заданий
**Сущность**: Enrollment
**Код формы**: `course_detail_view`

**Структура** (вкладки):

#### Вкладка 1: Задания
**Компоненты**:
- **Левый сайдбар** (Tree view):
  - Список Assignment Instance, группировка по module_name
  - Иконки статусов: Принято (зеленый чек), На проверке (желтый круг), Не начато (серый круг)
  - Клик → открыть задание в правой панели

- **Правая панель** (Assignment detail):
  - Название, тип, дедлайн, макс. балл
  - Описание (RichText)
  - Материалы (файлы для скачивания)
  - Форма сдачи:
    - RichText редактор (если submission_type = Текст)
    - File upload (drag-and-drop) (если submission_type = Файл)
    - URL input (если submission_type = Ссылка)
  - Кнопки: [Сохранить черновик] [Отправить на проверку]
  - Блок обратной связи (если graded):
    - Балл, комментарий преподавателя
  - Блок комментариев (Message WHERE assignment_instance = current)

#### Вкладка 2: Обсуждения
**Компонент**: Список сообщений по курсу
- Источник: Message WHERE course_instance = current.course_instance AND thread_type = 'По курсу'
- Форма создания нового сообщения (RichText + файлы)

#### Вкладка 3: Материалы
**Компонент**: Список Course Material
- Группировка по module_name
- Поля: title, type (иконка), files (ссылки на скачивание)

#### Вкладка 4: Оценки
**Компонент**: Таблица оценок студента
- Строки: Assignment Instance
- Колонки: Задание, Дедлайн, Статус, Балл, Макс. балл
- Итого: total_score / max_possible_score (final_grade %)

---

### 2.3 Форма задания с полями сдачи

**Тип формы**: Элемент
**Сущность**: Assignment Instance
**Код формы**: `assignment_submission_form`

**Поля формы**:
1. **Заголовок** (read-only):
   - assignment_template.title
   - assignment_template.type (бейдж)
   - due_date (с подсветкой если просрочено)

2. **Описание** (read-only):
   - assignment_template.description (RichText, расширяемый)
   - assignment_template.materials (список файлов с кнопками скачивания)

3. **Блок сдачи** (editable, условная видимость):
   - `submission_text` (RichText editor) - если submission_type = "Текст" или "Файл" (дополнительно)
   - `submission_files` (File upload, multiple) - если submission_type = "Файл"
     - Drag-and-drop зона
     - Список загруженных файлов с кнопками удаления
     - Макс. размер: 50MB/файл, 200MB общий
   - `submission_url` (String input, URL validator) - если submission_type = "Ссылка"

4. **Блок обратной связи** (read-only, видим если status = Принято или Требует доработки):
   - `score` / assignment_template.max_score
   - `feedback_text` (RichText)
   - `graded_by` (ФИО преподавателя)
   - `graded_at` (дата и время)

5. **Блок комментариев** (внизу):
   - Список Message WHERE assignment_instance = current
   - Форма нового сообщения (RichText, attachments)

**Кнопки действий** (условная видимость):
- [Сохранить черновик] - видима если status = "В работе" или "Требует доработки"
  - Действие: обновить поля submission_*, не менять status
- [Отправить на проверку] - видима если status = "В работе" или "Требует доработки"
  - Действие: валидация полей → status = "Отправлено на проверку", submitted_at = now
  - Валидация: проверка заполненности submission_* согласно submission_type

---

### 2.4 Аналитическая панель (Gradebook Dashboard)

**Тип формы**: Дашборд
**Сущность**: Assignment Instance (агрегация)
**Код формы**: `teacher_gradebook`
**Роль**: Преподаватель, Администратор

**Фильтры** (верхняя панель):
- Выбор курса (Course Instance WHERE instructors CONTAINS current_user)
- Выбор студента (опционально)
- Выбор задания (опционально)
- Статус задания (Все / На проверке / Принято / Требует доработки)

**Виджет 1: Матрица успеваемости** (Table):
**SQL-логика**:
```sql
SELECT
  student.full_name,
  assignment_template.title,
  assignment_instance.status,
  assignment_instance.score,
  assignment_template.max_score
FROM assignment_instance
JOIN enrollment ON assignment_instance.enrollment_id = enrollment.id
JOIN user AS student ON enrollment.student_id = student.id
JOIN assignment_template ON assignment_instance.assignment_template_id = assignment_template.id
WHERE enrollment.course_instance_id = :selected_course_instance
ORDER BY student.full_name, assignment_template.order
```

**Отображение**:
- Строки: Студенты (student.full_name)
- Колонки: Задания (assignment_template.title)
- Ячейки:
  - Цвет фона:
    - Зеленый (#ecfdf5): status = "Принято"
    - Желтый (#fffbeb): status = "Отправлено на проверку"
    - Красный (#fee2e2): is_overdue = True
    - Серый (#f3f4f6): status = "Не начато"
  - Содержимое: score / max_score или иконка статуса
  - Клик по ячейке → открыть Assignment Instance в модальном окне для проверки

- Последняя колонка: Итого (total_score / max_possible_score, final_grade %)

**Виджет 2: Статистика** (Cards):
- Всего студентов в курсе: COUNT(Enrollment)
- Заданий на проверке: COUNT(Assignment Instance WHERE status = "Отправлено на проверку")
- Средний балл по курсу: AVG(final_grade)

**Действия**:
- Кнопка [Экспорт в Excel] - скачать таблицу в XLSX

---

## Шаг 3: Бизнес-процессы (BPMN)

### 3.1 Процесс: Заявка на регистрацию → Запись на курс

**Название процесса**: `enrollment_request_approval`
**Триггер**: Создание Enrollment Request

**Шаги**:
1. **Start Event**: Создана заявка (status = "Новая")

2. **Task: Уведомить администратора**
   - Действие: Создать уведомление для роли "Администратор"
   - Текст: "Новая заявка на курс {course_instance.course_template.title} от {student.full_name}"

3. **User Task: Рассмотрение заявки**
   - Исполнитель: Администратор
   - Форма: Просмотр данных заявки (student, course_instance, motivation, payment_status)
   - Действия: [Одобрить] [Отклонить]

4. **Gateway (Exclusive): Решение**
   - Условие 1 (Одобрить): status = "Одобрена"
     - Проверка: course_instance.current_students < course_instance.max_students OR max_students IS NULL
     - Если превышен лимит → показать предупреждение, требовать подтверждения
   - Условие 2 (Отклонить): status = "Отклонена"
     - Требуется заполнить rejection_reason

5. **Task (если Одобрена): Создать Enrollment**
   - Создать запись Enrollment:
     - student = enrollment_request.student
     - course_instance = enrollment_request.course_instance
     - enrollment_date = now
     - status = "Ожидает начала" (если course_instance.status != "Идёт обучение") ИЛИ "Активна"

6. **Task (если Одобрена): Создать Assignment Instances**
   - Для каждого Assignment Template в course_template:
     - Создать Assignment Instance:
       - enrollment = новая_запись
       - assignment_template = current_template
       - status = "Не начато"
       - due_date = course_instance.start_date + assignment_template.due_days_after_start

7. **Task (если Одобрена): Уведомить студента (Одобрение)**
   - Email + In-app уведомление
   - Тема: "Добро пожаловать на курс {course_title}!"
   - Текст: Приветствие, ссылка на курс, дата начала

8. **Task (если Отклонена): Уведомить студента (Отказ)**
   - Email + In-app уведомление
   - Тема: "Заявка на курс отклонена"
   - Текст: rejection_reason, возможность подать заявку снова

9. **End Event**

**Диаграмма**:
```
[Создана заявка] → [Уведомить админа] → [Рассмотрение (User Task)]
    → {Решение?}
        ├─ [Одобрена] → [Создать Enrollment] → [Создать Assignment Instances]
        │               → [Уведомить студента (Welcome)] → [End]
        └─ [Отклонена] → [Уведомить студента (Rejection)] → [End]
```

---

### 3.2 Процесс: Отправка задания → Проверка → Оценка

**Название процесса**: `assignment_submission_grading`
**Триггер**: Изменение статуса Assignment Instance на "Отправлено на проверку"

**Шаги**:
1. **Start Event**: status изменён на "Отправлено на проверку"
   - submitted_at = now

2. **Task: Уведомить преподавателя**
   - Получить instructors из course_instance
   - Создать уведомление для каждого instructor
   - Текст: "{student.full_name} отправил задание '{assignment_template.title}' на проверку"
   - Ссылка: прямая ссылка на Assignment Instance

3. **User Task: Проверка задания**
   - Исполнитель: Instructor (из course_instance.instructors)
   - Форма:
     - Просмотр submission_text, submission_files, submission_url
     - Поле ввода score (0 - max_score)
     - Поле ввода feedback_text (RichText)
     - Выбор статуса: [Принято] [Требует доработки]

4. **Gateway (Exclusive): Результат проверки**
   - Условие 1 (Принято): status = "Принято"
   - Условие 2 (Требует доработки): status = "Требует доработки"

5. **Task (общая): Обновить Assignment Instance**
   - graded_at = now
   - graded_by = current_user
   - status = выбранный статус
   - score = введенный балл (только если "Принято")
   - feedback_text = введенный комментарий

6. **Task (если Принято): Пересчитать прогресс Enrollment**
   - Обновить enrollment.progress_percent
   - Обновить enrollment.total_score
   - Обновить enrollment.final_grade

7. **Gateway (если Принято): Проверка завершения курса**
   - Условие: ВСЕ обязательные Assignment Instance имеют status = "Принято"
     AND final_grade >= course_template.passing_score_percent
   - Если Да → Перейти к шагу 8
   - Если Нет → Перейти к шагу 9

8. **Task (если курс завершен): Обновить статус Enrollment**
   - enrollment.status = "Завершена"
   - enrollment.completion_date = now
   - **Вызвать процесс**: `certificate_generation` (см. 3.3)

9. **Task: Уведомить студента**
   - Если Принято:
     - Тема: "Задание '{assignment_template.title}' принято"
     - Текст: "Вы получили {score}/{max_score} баллов. {feedback_text}"
   - Если Требует доработки:
     - Тема: "Задание '{assignment_template.title}' требует доработки"
     - Текст: "Пожалуйста, внесите изменения. {feedback_text}"

10. **End Event**

**Диаграмма**:
```
[Отправлено] → [Уведомить преподавателя] → [Проверка (User Task)]
    → {Результат?}
        ├─ [Принято] → [Пересчитать прогресс]
        │               → {Курс завершен?}
        │                   ├─ Да → [Enrollment = Завершена] → [Генерация сертификата]
        │                   └─ Нет → [Уведомить студента] → [End]
        └─ [Требует доработки] → [Уведомить студента] → [End]
```

---

### 3.3 Процесс: Генерация сертификата

**Название процесса**: `certificate_generation`
**Триггер**: Enrollment.status изменён на "Завершена" И соблюдены условия

**Условия запуска**:
- ВСЕ обязательные Assignment Instance имеют status = "Принято"
- enrollment.final_grade >= course_template.passing_score_percent

**Шаги**:
1. **Start Event**: Триггер

2. **Service Task: Сгенерировать серийный номер**
   - Формат: `{course_template.code}-{current_year}-{sequential_number:04d}`
   - Пример: `B3-101-2025-0042`
   - sequential_number = MAX(serial_number для данного курса и года) + 1

3. **Service Task: Создать Certificate Instance**
   - enrollment = current_enrollment
   - certificate_template = course_template.certificate_template
   - serial_number = сгенерированный
   - issue_date = today
   - final_score = enrollment.final_grade
   - status = "Выдан"

4. **Service Task: Сгенерировать PDF**
   - Загрузить certificate_template.template_file (DOCX)
   - Заменить плейсхолдеры:
     - `{{student_name}}` → enrollment.student.full_name
     - `{{course_title}}` → course_template.title
     - `{{completion_date}}` → enrollment.completion_date (формат: "15 декабря 2025 г.")
     - `{{serial_number}}` → certificate.serial_number
     - `{{final_grade}}` → enrollment.final_grade + "%"
     - `{{instructor_name}}` → course_instance.instructors[0].full_name
     - `{{issue_date}}` → certificate.issue_date (формат: "20 декабря 2025 г.")
   - Конвертировать DOCX → PDF через B3 Print Form Engine
   - Сохранить PDF в certificate.pdf_file

5. **Service Task: Сгенерировать QR-код**
   - URL для проверки: `https://lms.b3.ru/certificates/verify/{certificate.id}`
   - Создать QR-код изображение
   - Сохранить в certificate.qr_code

6. **Task: Обновить Enrollment**
   - enrollment.certificate = certificate

7. **Task: Уведомить студента**
   - Email + In-app уведомление
   - Тема: "Ваш сертификат готов!"
   - Текст: "Поздравляем с завершением курса '{course_title}'! Ваш сертификат прикреплен к письму."
   - Вложение: certificate.pdf_file
   - Ссылка: прямая ссылка на страницу сертификата в портале

8. **End Event**

**Диаграмма**:
```
[Триггер] → [Сгенерировать серийный номер] → [Создать Certificate Instance]
    → [Сгенерировать PDF] → [Сгенерировать QR-код]
    → [Обновить Enrollment] → [Уведомить студента] → [End]
```

---

## Шаг 4: Роли и права

### 4.1 Настройка ролей

**Кабинет**: `learning_portal` (Портал обучения)

#### Роль: Студент
**Код**: `student`
**Описание**: Может записываться на курсы, выполнять задания, просматривать свои результаты

**Права**:

**Enrollment Request**:
- CREATE: Да (только свои заявки)
- READ: Да (только свои заявки)
- UPDATE: Да (только если status = "Новая", может отозвать)
- DELETE: Нет

**Enrollment**:
- CREATE: Нет (создается автоматически процессом)
- READ: Да (только свои записи WHERE student = current_user)
- UPDATE: Да (только поле personal_notes)
- DELETE: Нет

**Assignment Instance**:
- CREATE: Нет (создается автоматически)
- READ: Да (только свои WHERE enrollment.student = current_user)
- UPDATE: Да (только поля submission_*, и только если status IN ["Не начато", "В работе", "Требует доработки"])
- DELETE: Нет

**Message**:
- CREATE: Да (только в своих курсах/заданиях)
- READ: Да (только в своих курсах/заданиях)
- UPDATE: Нет (нельзя редактировать отправленные сообщения)
- DELETE: Да (только свои сообщения, в течение 5 минут после отправки)

**Certificate Instance**:
- CREATE: Нет
- READ: Да (только свои WHERE enrollment.student = current_user)
- UPDATE: Нет
- DELETE: Нет

**Course Template, Assignment Template, Certificate Template**:
- CREATE/UPDATE/DELETE: Нет
- READ: Да (только со status = "Активен")

**Course Instance**:
- CREATE/UPDATE/DELETE: Нет
- READ: Да (только если status = "Идёт набор" ИЛИ есть enrollment для текущего пользователя)

---

#### Роль: Преподаватель
**Код**: `teacher`
**Описание**: Может создавать курсы, проверять задания, выставлять оценки, управлять студентами своих курсов

**Права** (в дополнение к правам Студента):

**Course Template**:
- CREATE: Да
- READ: Да (все)
- UPDATE: Да (только свои WHERE created_by = current_user)
- DELETE: Да (только свои, только если нет активных Course Instance)

**Assignment Template**:
- CREATE: Да (только в своих Course Template)
- READ: Да (все)
- UPDATE: Да (только в своих Course Template)
- DELETE: Да (только в своих Course Template)

**Course Instance**:
- CREATE: Да (только для своих Course Template)
- READ: Да (все ИЛИ WHERE instructors CONTAINS current_user)
- UPDATE: Да (только где instructors CONTAINS current_user)
- DELETE: Да (только свои, только если status = "Планируется" и нет enrollments)

**Enrollment**:
- READ: Да (для курсов где instructors CONTAINS current_user)
- UPDATE: Да (только поле instructor_notes, для своих курсов)

**Assignment Instance**:
- READ: Да (для своих курсов)
- UPDATE: Да (поля: status, score, feedback_text, graded_by, graded_at - для своих курсов)

**Message**:
- CREATE: Да (в своих курсах)
- READ: Да (в своих курсах)

**Enrollment Request**:
- READ: Да (для своих Course Instance)
- UPDATE: Нет (одобрение - только у админа)

**Certificate Template**:
- CREATE: Нет (только админ)
- READ: Да (все)
- UPDATE: Нет
- DELETE: Нет

**Certificate Instance**:
- READ: Да (для своих курсов)
- UPDATE: Нет
- DELETE: Нет

---

#### Роль: Администратор
**Код**: `admin`
**Описание**: Полный доступ ко всем данным, управление пользователями, одобрение заявок, управление сертификатами

**Права**:
- **ВСЕ сущности**: CRUD (полный доступ)

**Специальные действия**:
- Одобрение/отклонение Enrollment Request
- Создание/редактирование Certificate Template
- Ручная выдача/отзыв Certificate Instance
- Управление пользователями (добавление, назначение ролей, деактивация)
- Изменение статусов Course Instance, Enrollment вручную (override)
- Просмотр системных логов и аналитики

---

### 4.2 Row-Level Security (RLS) Правила

**Для сущности Enrollment**:
```python
# Студент видит только свои записи
if user.role == 'student':
    filter: student_id = current_user.id

# Преподаватель видит записи студентов своих курсов
if user.role == 'teacher':
    filter: course_instance.instructors CONTAINS current_user.id

# Администратор видит все
if user.role == 'admin':
    filter: None (all records)
```

**Для сущности Assignment Instance**:
```python
# Студент видит только свои задания
if user.role == 'student':
    filter: enrollment.student_id = current_user.id

# Преподаватель видит задания студентов своих курсов
if user.role == 'teacher':
    filter: enrollment.course_instance.instructors CONTAINS current_user.id

# Администратор видит все
if user.role == 'admin':
    filter: None
```

**Для сущности Message**:
```python
# Студент видит сообщения в своих курсах/заданиях
if user.role == 'student':
    filter: (course_instance.enrollments.student_id = current_user.id) OR
            (assignment_instance.enrollment.student_id = current_user.id)

# Преподаватель видит сообщения в своих курсах
if user.role == 'teacher':
    filter: (course_instance.instructors CONTAINS current_user.id) OR
            (assignment_instance.enrollment.course_instance.instructors CONTAINS current_user.id)

# Администратор видит все
if user.role == 'admin':
    filter: None
```

---

## Шаг 5: Печатные формы (Certificate Templates)

### 5.1 Создание шаблона сертификата DOCX

**Инструмент**: MS Word или LibreOffice Writer

**Рекомендуемая структура**:

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                     [Логотип B3]                           │
│                                                            │
│                     СЕРТИФИКАТ                             │
│                                                            │
│   Настоящим подтверждается, что                            │
│                                                            │
│              {{student_name}}                              │
│                                                            │
│   успешно завершил(а) курс                                 │
│                                                            │
│              {{course_title}}                              │
│                                                            │
│   Дата завершения: {{completion_date}}                     │
│   Итоговая оценка: {{final_grade}}                         │
│                                                            │
│   Серийный номер: {{serial_number}}                        │
│                                                            │
│                                                            │
│   _____________________          _____________________     │
│   {{instructor_name}}            Дата: {{issue_date}}      │
│   Преподаватель                                            │
│                                                            │
│                         [QR-код для проверки]              │
└────────────────────────────────────────────────────────────┘
```

**Форматирование**:
- Размер страницы: A4 (альбомная ориентация рекомендуется)
- Шрифт: Arial или Times New Roman, 14-18pt для основного текста
- Плейсхолдеры: выделить жирным {{placeholder_name}}
- Поля: 2 см со всех сторон
- Логотип: вставить как изображение (будет включен в PDF)

**Сохранение**:
- Формат: .docx (не .doc!)
- Имя файла: `certificate_template_b3_basic.docx`

---

### 5.2 Загрузка шаблона в B3

1. Перейти в раздел "Управление сертификатами" (Администратор)
2. Нажать [+ Загрузить новый шаблон]
3. Заполнить форму:
   - **Название**: "Сертификат базового курса Б3"
   - **Описание**: "Для курсов уровня 'Базовый'"
   - **Файл шаблона**: загрузить .docx файл
   - **Статус**: "Активен"
4. Сохранить

---

### 5.3 Привязка шаблона к курсу

1. Открыть Course Template (например, "B3-101: Основы платформы Б3")
2. В поле `certificate_template` выбрать созданный шаблон
3. Сохранить

**Теперь**: при завершении курса студентом процесс автоматически использует этот шаблон для генерации PDF.

---

### 5.4 Настройка публичной страницы проверки сертификата

**URL**: `https://lms.b3.ru/certificates/verify/{certificate_id}`

**Логика**:
1. Принять certificate_id из URL
2. Найти Certificate Instance WHERE id = certificate_id
3. Если найдено и status = "Выдан":
   - Показать:
     - Серийный номер
     - ФИО студента
     - Название курса
     - Дата выдачи
     - Итоговая оценка
     - Статус: "Действителен" (зеленый)
     - Кнопка "Скачать PDF" (если разрешено публично)
4. Если не найдено или status = "Отозван":
   - Показать: "Сертификат не найден или отозван" (красный)

**Безопасность**:
- Страница доступна без авторизации (публичная)
- UUID certificate_id достаточно сложен для перебора
- Не показывать личные данные кроме ФИО, названия курса, даты

---

## Итоговая проверка настройки

### Чеклист перед запуском:

- [ ] Все 10 сущностей созданы в Типах представления
- [ ] Все связи (FK, M2M) настроены корректно
- [ ] Вычисляемые поля (progress_percent, final_grade) работают
- [ ] Создана минимум 1 форма для каждой роли:
  - [ ] Student Dashboard (список курсов)
  - [ ] Course Detail View (задания, оценки)
  - [ ] Assignment Submission Form (сдача задания)
  - [ ] Teacher Gradebook (табель успеваемости)
  - [ ] Admin Dashboard (заявки, статистика)
- [ ] Настроены 3 BPMN-процесса:
  - [ ] Enrollment Request Approval
  - [ ] Assignment Grading
  - [ ] Certificate Generation
- [ ] Созданы 3 роли с правами:
  - [ ] Студент
  - [ ] Преподаватель
  - [ ] Администратор
- [ ] Загружен минимум 1 шаблон сертификата (DOCX)
- [ ] Создан тестовый Course Template с 2-3 заданиями
- [ ] Создан тестовый Course Instance со статусом "Идёт набор"
- [ ] Протестирована заявка студента → одобрение админом → создание Enrollment
- [ ] Протестирована сдача задания → проверка преподавателем → получение оценки
- [ ] Протестирована генерация сертификата после завершения курса

---

**Готово!** Базовая инфраструктура LMS на платформе Б3 настроена и готова к использованию.
