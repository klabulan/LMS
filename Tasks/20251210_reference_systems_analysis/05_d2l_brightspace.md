# Анализ: D2L Brightspace

**Дата анализа:** 2025-12-10
**Аналитик:** Claude Code Agent
**Источник:** https://www.d2l.com/brightspace/

---

## 1. Краткий обзор

**D2L Brightspace** — облачная платформа для корпоративного и академического обучения от канадской компании D2L Corporation, основанной в 1999 году. Платформа используется более чем 14.5 миллионами пользователей по всему миру в образовательных учреждениях, здравоохранении, государственных структурах, корпорациях и ассоциациях.

### Тип системы

**Гибридная LMS** — одинаково сильна в академическом секторе (K-12, высшее образование) и корпоративном обучении (D2L for Business, D2L for Government). В отличие от Canvas (академический фокус) и Coursera (MOOC-платформа), Brightspace изначально проектировалась как **enterprise-ready система** с акцентом на масштабируемость, аналитику и доступность.

### Целевая аудитория

- **K-12 школы** (начальное и среднее образование)
- **Университеты и колледжи** (высшее образование)
- **Корпорации** — обучение сотрудников, compliance-тренинги, профессиональное развитие
- **Государственные структуры** — обучение госслужащих, сертификационные программы
- **Медицинские организации** — непрерывное медицинское образование (CME)
- **Ассоциации** — обучение членов профессиональных сообществ

### Ключевые отличия от конкурентов

**1. Class Progress Tool — эталонная система прогресс-трекинга**

Class Progress — флагманская функция Brightspace, позволяющая преподавателям и студентам видеть **детализированный прогресс по каждому элементу курса** в режиме реального времени. В отличие от Canvas (где прогресс-бар на карточках курсов отсутствует) и Coursera (где прогресс показывается агрегированно), Brightspace предоставляет:

- **Для преподавателей:** визуализация прогресса всего класса или отдельного студента по любым индикаторам (просмотренные материалы, сданные задания, активность в дискуссиях)
- **Для студентов:** персональный прогресс по модулям, четкие индикаторы "что сделано / что осталось"
- **Отчетность:** экспорт прогресс-отчетов для институциональной аналитики

**2. Daylight User Experience — фокус на доступность и визуальный дизайн**

В 2016 году D2L провела масштабный редизайн платформы под кодовым названием **Daylight**, который стал индустриальным стандартом для LMS:

- **Responsive design из коробки:** адаптация под любые экраны (desktop, tablet, smartphone) с единой кодовой базой
- **WCAG 2.2 Level AAA compliance:** полная доступность для людей с ограниченными возможностями (screen readers, high contrast, keyboard navigation)
- **Новая цветовая палитра и типографика:** повышение читаемости, снижение усталости глаз
- **Консистентность интерфейса:** одинаковый UX в core platform и всех модулях

**3. Predictive Analytics и AI-powered Learning**

Brightspace Performance+ (премиум-модуль) использует **предиктивную аналитику** для раннего выявления студентов в группе риска:

- **AI-модель анализирует:** логины, время в курсе, попытки выполнения заданий, результаты тестов, активность в форумах
- **Выявляет паттерны:** студент, который не заходил в курс 7 дней + провалил первый квиз → высокая вероятность отсева
- **Алерты преподавателю:** визуальные индикаторы (красный/желтый/зеленый) рядом с именем студента + рекомендации по вмешательству
- **Кастомизация модели:** преподаватель может настроить веса факторов риска для конкретного курса

**4. Adaptive Learning Engine (LeaP)**

Модуль **LeaP (Learning Environment and Personalization)** автоматически адаптирует траекторию обучения:

- Студент проходит baseline assessment (начальное тестирование)
- Система выявляет gaps (пробелы в знаниях)
- Формируется персональный learning path (только недостающие темы, без дублирования известного материала)
- Экономия времени студента на 30-50% в сравнении с линейным курсом

**5. D2L for Business и D2L for Government**

Специализированные решения для корпоративного и госсекторов:

- **Compliance tracking:** автоматическое отслеживание обязательных тренингов (например, OSHA safety, GDPR compliance) с уведомлениями об истечении сертификатов
- **Role-based learning paths:** назначение курсов на основе должности/роли (например, "Onboarding для менеджеров продаж")
- **Enterprise integrations:** готовые коннекторы к HRIS (Workday, SAP SuccessFactors), SSO (Active Directory, Okta), BI-системам (Tableau, Power BI)
- **Custom branding:** полная кастомизация внешнего вида (логотип, цвета, домен) для white-label решений

### Почему D2L Brightspace в референсах для B3 LMS

Brightspace выбран для анализа по следующим причинам:

**1. Лучшие практики прогресс-трекинга:** Class Progress Tool — это то, чего не хватает Canvas и что реализовано лучше, чем в Coursera. Для B3 LMS, где ключевая метрика успеха — процент завершения обучения сотрудниками, детальный прогресс-трекинг критичен.

**2. Enterprise-ready архитектура:** В отличие от академических LMS, Brightspace изначально проектировалась для крупных организаций с тысячами пользователей. Это опыт масштабирования, которого не хватает многим конкурентам.

**3. Доступность (accessibility) как конкурентное преимущество:** Для госсектора РФ требования к доступности интерфейсов для людей с ограниченными возможностями растут. Brightspace демонстрирует, как это делать правильно (WCAG 2.2 AAA — высший уровень).

**4. Адаптивное обучение без программирования:** LeaP показывает, как можно реализовать персонализированные траектории обучения, доступные для настройки обычным преподавателям (не разработчикам). B3 Platform с BPMN и конструктором UI может реализовать упрощенную версию.

**5. Predictive Analytics — что упростить:** Brightspace Performance+ — это сложная AI-система, требующая больших данных. Но базовые алерты ("студент не заходил 7 дней" → уведомление менеджеру) можно реализовать на B3 Platform через простые BPMN-правила.

**Критический подход:** Несмотря на сильные стороны, Brightspace имеет недостатки:

- **Сложность настройки:** администраторы жалуются, что первичная конфигурация платформы требует дней обучения (в отличие от Canvas с его out-of-the-box простотой)
- **Цена:** Performance+ и LeaP — дорогостоящие add-ons, недоступные малому и среднему бизнесу
- **UI/UX критика:** несмотря на Daylight, некоторые пользователи считают интерфейс "перегруженным" в сравнении с минималистичным Canvas
- **Vendor lock-in:** миграция данных из Brightspace сложна из-за проприетарных форматов

Для B3 LMS мы возьмем лучшее (Class Progress, accessibility, базовую адаптивность) и избежим худшего (излишней сложности, дорогих AI-модулей для MVP).

## 2. Структура системы

### 2.1. Основные роли

Brightspace использует гибкую систему ролей с детальными разрешениями (permissions). В отличие от Canvas, где роли жестко заданы, Brightspace позволяет создавать кастомные роли и настраивать права доступа для каждого инструмента платформы.

| Роль | Описание | Ключевые права |
|------|----------|----------------|
| **Learner (Учащийся)** | Конечный пользователь курса | Просмотр контента, выполнение заданий, участие в дискуссиях, просмотр своих оценок |
| **Instructor (Преподаватель)** | Основной создатель и ведущий курса | Создание/редактирование контента, проверка заданий, выставление оценок, управление курсом, просмотр аналитики |
| **Course Builder** | Методист/дизайнер курса | Создание структуры курса, загрузка материалов, настройка навигации (без доступа к оценкам студентов) |
| **Teaching Assistant (ТА)** | Ассистент преподавателя | Проверка заданий, модерация форумов, ограниченные права на редактирование курса |
| **Administrator (Администратор)** | Системный администратор LMS | Управление организационной структурой, настройка ролей и разрешений, системная аналитика, интеграции |
| **Auditor (Наблюдатель)** | Роль только для чтения | Просмотр курса без возможности взаимодействия (для внешнего аудита, инспекций) |
| **Program Administrator** | Менеджер учебной программы | Управление группой курсов, назначение студентов, отчетность по программе |

**Ключевое отличие от Canvas:** В Brightspace права доступа настраиваются на **уровне инструмента** (например, "может создавать дискуссии, но не может их удалять"). Это более гранулярная модель разрешений.

### 2.2. Модель данных (сущности)

Brightspace построена на иерархической модели **Organizational Units (Org Units)**, которая более гибкая, чем у конкурентов.

#### Иерархия организационных единиц (Org Units)

**Org Unit** — базовая абстракция для любого объекта в системе (организация, департамент, курс, группа).

Типы Org Units:
- **Organization (Организация)** — корневой узел (например, "Университет", "Корпорация")
- **Department (Департамент)** — подразделение (например, "Факультет информатики", "Отдел продаж")
- **Program (Программа)** — учебная программа (например, "Магистратура Data Science")
- **Semester (Семестр)** — временной период обучения
- **Course Template (Шаблон курса)** — мастер-версия курса
- **Course Offering (Экземпляр курса)** — конкретный запуск курса для группы студентов
- **Section (Секция)** — подгруппа внутри курса (например, "Группа A", "Вечернее отделение")
- **Group (Группа)** — малая группа студентов для групповой работы

**Ключевая особенность:** любая Org Unit может иметь детей (children) и потомков (descendants), формируя древовидную структуру. Это позволяет строить сложные иерархии:

```
Organization (Корпорация)
├── Department (HR)
│   └── Program (Onboarding 2025)
│       └── Course Offering (Leadership Basics - January Cohort)
│           ├── Section (Managers)
│           └── Section (Team Leads)
└── Department (Sales)
    └── Course Offering (Sales Training)
```

#### Основные сущности данных

**1. User (Пользователь)**
- `UserId` — уникальный идентификатор
- Профиль: FirstName, LastName, Email, Username
- `ExternalId` — для интеграции с внешними системами (HR, HRIS)
- Аватар, настройки (timezone, language)
- Связи: Enrollments (записи на курсы), Submissions (сдачи заданий), Grades

**2. Course Offering (Экземпляр курса)**
- Наследует от Org Unit
- Атрибуты: Name, Code, StartDate, EndDate
- `IsActive` — статус курса (активен / завершен / архивирован)
- Связь с Course Template (шаблон, из которого создан)
- Может иметь Sections (секции) как child Org Units
- Связи: Enrollments, Content Topics, Grade Book, Discussions, Assignments

**3. Course Template (Шаблон курса)**
- Мастер-версия курса, содержит контент и структуру
- Используется для создания Course Offerings (клонирование)
- Преподаватель редактирует Template → изменения можно применить ко всем Offerings (опционально)

**4. Enrollment (Запись на курс)**
- Связь User ↔ Course Offering
- `RoleId` — роль в курсе (Learner, Instructor, TA)
- `EnrollmentDate` — дата записи
- `CompletionDate` — дата завершения (если завершен)
- Статус: Active, Inactive, Withdrawn, Completed
- Связи: User, Course Offering, Grade

**5. Content Topic (Модуль / Тема курса)**
- Иерархическая структура: Course → Module → Sub-module → Content Object
- Типы контента: Text, PDF, Video, Audio, SCORM, External URL
- Атрибуты: Title, Description, Order (порядок отображения)
- **Completion Tracking:** каждый Content Topic может быть настроен на отслеживание завершения
  - User views topic → автоматически "completed"
  - User submits assignment linked to topic → "completed"
- Связи: Course Offering, Content Objects

**6. Assignment (Задание)**
- Типы submission: File Upload, Text, URL, On-paper (offline submission)
- Атрибуты: Name, Instructions, DueDate, MaxPoints
- **Categories:** Assignment может принадлежать к Category (для группировки)
- **Rubrics:** связь с Rubric (критерии оценивания)
- **Group Assignments:** поддержка групповых заданий (одна сдача от группы)
- Связи: Grade Item (автоматическое создание при создании Assignment), Submissions

**7. Submission (Сдача задания)**
- User → Assignment
- Содержимое: загруженные файлы / текст / URL
- `SubmittedDate` — дата сдачи
- `Attempts` — номер попытки (если разрешены multiple attempts)
- Статус: Not Submitted, Submitted, Graded
- **Version Control:** Brightspace хранит все версии submissions (history)
- Связи: Assignment, User, Feedback, Grade

**8. Grade Item (Элемент оценивания)**
- Центральная сущность для оценок
- Может быть связана с Assignment, Quiz, Discussion или быть независимой (например, "Attendance")
- Атрибуты: Name, MaxPoints, Weight (вес в итоговой оценке), GradeSchemeId
- **Grade Categories:** Grade Items группируются в Categories для структуры Gradebook
- Типы категорий:
  - **Calculating Category** — вычисляет subtotal (подытог), участвует в итоговом балле
  - **Organizational Category** — только для визуальной группировки, не влияет на вычисления
- Связи: Course Offering, Assignment/Quiz/Discussion (опционально), Grades

**9. Grade (Оценка)**
- User × Grade Item
- `Score` — числовое значение балла
- `LetterGrade` — буквенная оценка (если применяется scheme)
- `Feedback` — комментарий преподавателя (текст, до 4000 символов с 2025 года)
- `GradedDate` — дата выставления оценки
- **Rubric Assessment:** если использовалась рубрика, хранится детализация по критериям
- Связи: User, Grade Item, Graded By (преподаватель)

**10. Gradebook (Журнал оценок)**
- Не отдельная таблица, а **вычисляемая сущность** (как в Canvas)
- Отображает матрицу: Users (строки) × Grade Items (столбцы)
- **Final Grade:** вычисляется на основе весов Categories и политик (drop lowest, bonus points)
- Настройки:
  - Grading Scheme (points, percentage, letter grades, custom)
  - Display options (показывать ли студентам комментарии, оценки, статистику класса)
- Экспорт: CSV для внешней обработки

**11. Quiz (Тест)**
- Типы вопросов: Multiple Choice, True/False, Short Answer, Essay, Matching, Ordering, Fill in the Blanks, Multi-Select, Arithmetic (математические формулы)
- Автоматическая проверка для objective questions
- Настройки: Time Limit, Attempts Allowed, Show Correct Answers (когда показывать)
- **Question Pools:** возможность создать пул вопросов, из которого случайно выбираются N вопросов для каждого студента
- **Special Access:** дифференцированные настройки для студентов (например, дополнительное время для студентов с ограниченными возможностями)
- Связи: Grade Item (автосоздание), Quiz Attempts

**12. Quiz Attempt (Попытка теста)**
- User → Quiz
- Ответы на вопросы (answers)
- `StartTime`, `SubmitTime`
- `Score` — автоматический балл (для objective questions)
- Instructor может вручную оценить essay-вопросы
- Связи: Quiz, User, Grade

**13. Discussion (Дискуссия / Форум)**
- Типы: Course Discussion (для всего курса), Topic Discussion (по конкретной теме)
- Структура: Forum → Topic → Thread → Post → Reply (2 levels)
- **Graded Discussions:** могут быть оценены (оценка за участие)
- Модерация: преподаватель может закреплять (pin) посты, удалять, блокировать threads
- Связи: Course Offering, Users (авторы постов), Grade Item (если graded)

**14. Rubric (Рубрика оценивания)**
- Матрица: Criteria (критерии) × Levels (уровни достижения)
- Каждая ячейка: описание уровня + баллы
- Примеры критериев: "Качество анализа", "Грамотность", "Оформление"
- Примеры уровней: "Отлично (5)", "Хорошо (4)", "Удовлетворительно (3)", "Неудовлетворительно (0)"
- **Аналитическая рубрика:** сумма баллов по всем критериям
- **Холистическая рубрика:** общая оценка без разбивки по критериям
- Связи: Assignments, Grades (Rubric Assessment хранит отметки по каждому критерию)

**15. Learning Path (Учебный путь) — для корпоративного решения**
- Последовательность Course Offerings для определенной цели (например, "Data Analyst Career Path")
- **Prerequisites:** Course 2 открывается только после завершения Course 1
- Дедлайны на уровне пути
- Связи: Course Offerings (ordered), Users (assigned learners)

**16. Competency (Компетенция)**
- Навык или результат обучения (Learning Outcome)
- Примеры: "Написание SQL-запросов", "Лидерство", "Презентационные навыки"
- Уровни владения: Not Achieved, Developing, Competent, Proficient, Expert
- Связи: Courses (какие курсы развивают компетенцию), Users (текущий уровень пользователя)

### 2.3. ER-диаграмма (текстовое описание связей)

```
Organization (Org Unit)
├── 1──* Department (Org Unit)
│   └── 1──* Program (Org Unit)
│       └── 1──* Course Offering (Org Unit)
│           ├── 1──* Section (Org Unit)
│           └── 1──* Group (Org Unit)
└── 1──* Course Template (Org Unit)
    └── source_for Course Offerings (cloning relationship)

User 1──* Enrollment *──1 Course Offering
Enrollment *──1 Role (роль в курсе)

Course Offering 1──* Content Topic (иерархия модулей)
Course Offering 1──* Assignment
Course Offering 1──* Quiz
Course Offering 1──* Discussion
Course Offering 1──* Gradebook (computed entity)

Assignment 1──1 Grade Item (auto-created)
Quiz 1──1 Grade Item (auto-created)
Discussion 1──0..1 Grade Item (если graded)

User 1──* Submission *──1 Assignment
Submission 1──* Feedback (комментарии преподавателя)

User 1──* Quiz Attempt *──1 Quiz

Grade Item *──1 Grade Category (для группировки)
Grade Category 1──* Grade Item

User × Grade Item → Grade (many-to-many с атрибутами: score, feedback, date)

Assignment *──0..1 Rubric (критерии оценивания)
Grade *──0..1 Rubric Assessment (заполненная рубрика)

Learning Path 1──* Course Offering (упорядоченные)
Learning Path *──* User (assigned learners)

Competency *──* Course Offering (какие курсы развивают компетенцию)
Competency *──* User (уровень владения навыком)
```

**Ключевые архитектурные паттерны для B3 LMS:**

**1. Org Unit как универсальная абстракция:**
- Brightspace использует единую модель для организаций, департаментов, курсов, групп — все наследуется от Org Unit
- **Плюс:** гибкость, возможность строить любую иерархию
- **Минус:** сложность для понимания (нужна документация и обучение)
- **Для B3:** можно упростить — отдельные сущности "Организация", "Департамент", "Курс" (более понятная модель для российских заказчиков)

**2. Course Template → Course Offering (Шаблон → Экземпляр):**
- Четкое разделение мастер-версии и запусков курса
- **Для B3:** Must-have паттерн (уже есть в `gpt_design.md`: Шаблон курса → Экземпляр курса)

**3. Grade Item как центральная сущность оценивания:**
- Любая оцениваемая активность (Assignment, Quiz, Discussion, Attendance) создает Grade Item
- Grade Book — это просто представление (view) Grade Items с вычислениями
- **Для B3:** Взять этот паттерн — упрощает расчет итоговых оценок

**4. Grade Categories: Calculating vs Organizational:**
- Два типа категорий: для вычислений (с весами) и для визуальной группировки
- **Для B3:** Must-have для гибкости (преподаватель может создать "Домашние задания 40%, Экзамены 60%" или просто группировать "Модуль 1", "Модуль 2" без весов)

**5. Rubric как отдельная переиспользуемая сущность:**
- Рубрику можно создать один раз и применить к нескольким заданиям
- **Для B3:** Nice-to-have для v2.0 (в v1.0 достаточно простых оценок)

## 3. UX/UI особенности

### 3.1. Онбординг

**Для студентов:**
- Вход через SSO (корпоративный Active Directory, Okta) или классическая форма логин/пароль
- Первый вход → автоматический редирект на персональный Dashboard ("My Home")
- Курсы, на которые студент уже записан, отображаются автоматически (нет необходимости в дополнительной регистрации)
- Встроенный тур (guided tour) по интерфейсу (опционально, можно отключить)

**Для преподавателей:**
- После создания/импорта курса → Course Setup Wizard:
  - Выбор home page layout (Modules, Content, Assignments, Announcements)
  - Настройка Navbar (какие инструменты показывать: Grades, Discussions, Quizzes)
  - Настройка Gradebook (категории, схема оценивания)
- Импорт контента из предыдущих курсов или Common Cartridge (IMS стандарт)

### 3.2. Навигация

**Homepage (Студент):**
- **My Home:** персональный дашборд с виджетами:
  - **My Courses:** карточки активных курсов
  - **Upcoming Assignments:** ближайшие дедлайны
  - **Calendar:** агрегированные события из всех курсов
  - **News/Announcements:** последние объявления от преподавателей
- **Minibar (верхняя панель):** глобальная навигация:
  - Updates (уведомления)
  - My Courses (dropdown список курсов)
  - Calendar
  - Messages (внутренняя почта)
  - Profile (настройки, выход)

**Course Home (внутри курса):**
- **Navbar (левая панель):** настраиваемое меню курса:
  - Home, Content, Discussions, Quizzes, Assignments, Grades, Classlist, Class Progress (для преподавателей)
- **Course Content (по умолчанию):** иерархическое отображение модулей и тем
  - Древовидная структура: Module → Topic → Subtopics
  - Иконки типов контента (PDF, Video, Quiz, Assignment)
  - Чекбоксы завершения рядом с каждым элементом (зеленая галочка после завершения)
- **Breadcrumbs (крошки навигации):** Home > My Courses > Course Name > Module 2 > Topic 2.1

### 3.3. Прогресс-трекинг: Class Progress Tool (флагманская функция)

**Class Progress — это ключевое отличие Brightspace от конкурентов.** Инструмент предоставляет детальную визуализацию прогресса студентов по любым индикаторам курса.

#### Для преподавателей:

**Class Progress Dashboard:**
- Доступ: Navbar → Class Progress
- Отображает таблицу: Students (строки) × Progress Indicators (столбцы)
- **Progress Indicators (индикаторы прогресса):**
  - **Content Topics Viewed:** количество просмотренных материалов (X / Y topics)
  - **Assignments Submitted:** количество сданных заданий
  - **Quizzes Completed:** количество завершенных тестов
  - **Discussion Posts:** количество постов в форумах
  - **Overall Progress:** общий прогресс в процентах (0-100%)
- **Цветовая индикация:**
  - Зеленый: студент на трек (≥80% прогресса)
  - Желтый: отстает (50-79%)
  - Красный: критическое отставание (<50%)
- **Фильтры:**
  - По модулям курса (показать прогресс только по Module 2)
  - По типам активностей (показать только assignments)
  - По датам (прогресс за последнюю неделю)
- **Drill-down:** клик на студента → детальный отчет:
  - Какие темы просмотрены, какие нет
  - Какие задания сданы, какие пропущены
  - Время, проведенное в курсе (login activity)
  - График активности по дням (activity heatmap)

**Progress Reports (экспорт):**
- Кнопка "Generate Report" → CSV или PDF с детализацией прогресса
- Настраиваемые колонки отчета (администратор выбирает, что включить)
- Автоматическая отправка отчетов по email (настраивается в Course Settings)

#### Для студентов:

**Personal Progress View:**
- Доступ: Navbar → Progress (или через Course Home → "My Progress")
- Отображает:
  - **Overall Course Progress:** кольцевой прогресс-бар (donut chart) с процентом завершения
  - **Progress by Module:** список модулей с прогресс-барами (например, "Module 1: 100%", "Module 2: 60%", "Module 3: 0%")
  - **Breakdown by Activity Type:**
    - Content Topics: 15/20 viewed (75%)
    - Assignments: 3/5 submitted (60%)
    - Quizzes: 2/3 completed (67%)
  - **What's Next:** рекомендация следующего шага (например, "Complete Quiz 3 by Friday")
- **Checklist View:** альтернативное отображение в виде списка задач:
  - Завершенные элементы (зеленая галочка)
  - Незавершенные (пустой чекбокс)
  - Просроченные (красная иконка)

**Gamification элементы (опционально):**
- Некоторые организации включают "Progress Milestones" (вехи прогресса):
  - "You've completed 25% of the course!"
  - "You're halfway there!"
  - "Only 2 assignments left!"

#### Настройка Class Progress (для преподавателей):

**Progress Tracking Setup:**
- Преподаватель выбирает, какие элементы курса отслеживать:
  - Content Topics: автоматическое отслеживание просмотров
  - Assignments: отслеживать submissions
  - Quizzes: отслеживать attempts
  - Discussions: отслеживать participation (количество постов)
- **Completion Criteria для каждого элемента:**
  - "Viewed" (просто открыл)
  - "Submitted" (сдал задание)
  - "Passed" (получил проходной балл)
- **Weights (веса):** преподаватель может назначить разные веса элементам:
  - Assignment 1: weight 10 (важнее)
  - Quiz 1: weight 5 (менее важно)
  - Overall Progress вычисляется с учетом весов

### 3.4. Визуальный дизайн (Daylight Experience)

**Цветовая палитра:**
- **Primary:** синий (#006FBF — Brightspace blue)
- **Secondary:** оранжевый (#F66D00) — для акцентов, кнопок действий
- **Success:** зеленый (#46A661) — для прогресса, завершенных элементов
- **Warning:** желтый/#FFA500 — для предупреждений
- **Danger:** красный (#CD2026) — для критических алертов, просроченных заданий
- **Neutral:** серые оттенки (#F5F5F5 фон, #333333 текст)

**Типографика:**
- Шрифт: **Lato** (sans-serif, как в Canvas)
- Иерархия: четкие размеры для H1 (24px), H2 (20px), H3 (18px), body (16px)
- Улучшенная читаемость: межстрочный интервал 1.5, цветовой контраст 7:1 (WCAG AAA)

**UI-компоненты:**
- **Cards (карточки курсов):** прямоугольные с тенями, course image вверху, название и статистика внизу
- **Progress Bars:** горизонтальные, с процентами и цветовой заливкой
- **Icons:** минималистичные, линейные (Feather Icons style)
- **Кнопки:** закругленные углы, четкие CTA (например, "Submit Assignment" — оранжевая кнопка)
- **Modals (модальные окна):** для критических действий (удаление, публикация)
- **Tooltips:** подсказки при наведении на элементы (объяснения функций)

**Accessibility (WCAG 2.2 AAA):**
- **Keyboard Navigation:** полная навигация без мыши (Tab, Enter, Esc)
- **Screen Reader Support:** ARIA-атрибуты для всех элементов
- **High Contrast Mode:** автоматическое переключение для пользователей с низким зрением
- **Color Blindness:** не полагаться только на цвет (использовать иконки + текст)
- **Adjustable Font Size:** пользователь может увеличить текст до 200% без потери функциональности
- **Accessibility Checker (встроенный):** автоматическая проверка контента на доступность при создании (например, проверка alt-текста для изображений)

### 3.5. Мобильная адаптация

**Responsive Web (адаптивная веб-версия):**
- Daylight Experience изначально responsive (mobile-first design)
- Breakpoints: Desktop (>1024px), Tablet (768-1023px), Mobile (<767px)
- На малых экранах: hamburger menu вместо левой панели Navbar
- Touch-friendly элементы (минимум 48×48px для кнопок)

**Нативные приложения (iOS/Android):**
- **Brightspace Pulse (для студентов):**
  - Основные функции: просмотр курсов, сдача заданий, участие в дискуссиях, просмотр оценок
  - **Offline Mode:** загрузка Content Topics для просмотра без интернета
  - **Notifications:** push-уведомления о новых оценках, дедлайнах, объявлениях
  - **Calendar Sync:** синхронизация с календарем устройства (iOS Calendar, Google Calendar)
  - **Quick Access:** виджеты для iOS/Android (показывают ближайшие задания на home screen)
- **Brightspace Instructor (для преподавателей):**
  - Функции: просмотр списка студентов, проверка заданий, выставление оценок (упрощенный SpeedGrader), создание объявлений
  - **Grading on-the-go:** преподаватель может проверять работы в транспорте, с комментариями и оценками
  - Синхронизация с desktop версией в реальном времени

**Критика мобильных приложений:**
- Пользователи отмечают, что мобильные приложения Brightspace менее функциональны, чем у Canvas
- Некоторые функции доступны только в веб-версии (создание курсов, настройка Gradebook)

### 3.6. Уникальные UX-фишки

**1. Class Progress Tool (детально описан выше) — главная фишка Brightspace**

**2. Intelligent Agents (автоматические агенты)**
- Настраиваемые триггеры: "Если студент не заходил в курс 7 дней → отправить email напоминание"
- Примеры сценариев:
  - "Студент получил <70% на Quiz 1 → отправить ссылку на дополнительные материалы"
  - "За 3 дня до дедлайна Assignment 2 → отправить напоминание всем, кто не сдал"
  - "Студент завершил Module 3 → поздравить и открыть доступ к Module 4"
- **Для B3 LMS:** это можно реализовать через BPMN-процессы с таймерами и условными ветвлениями

**3. Inline Editing (редактирование на месте)**
- Преподаватель может редактировать название/описание элементов курса прямо в Content Browser (без открытия отдельной формы редактирования)
- Двойной клик на элемент → inline editor появляется на месте

**4. Bulk Actions (массовые операции)**
- Выбрать несколько студентов в Classlist → Send Email (отправить групповое сообщение)
- Выбрать несколько Content Topics → Hide/Unhide (скрыть/показать разом)
- Упрощает управление большими курсами (100+ студентов)

**5. Learning Objectives / Competencies Mapping**
- Преподаватель может связать задания с Learning Outcomes (образовательными результатами):
  - Assignment 1 → "Критическое мышление", "Аналитические навыки"
  - Quiz 2 → "Знание терминологии", "Применение формул"
- Brightspace автоматически агрегирует: студент достиг 80% по компетенции "Критическое мышление"
- Отчетность по компетенциям (для аккредитации образовательных программ)

**6. Awards (награды/бейджи) — опционально**
- Преподаватель может создать цифровые бейджи за достижения:
  - "Завершил курс с оценкой >90%"
  - "Первый сдал все задания"
  - "Самый активный участник дискуссий"
- Бейджи отображаются в профиле студента, можно поделиться в LinkedIn
- Интеграция с Open Badges стандартом

### 3.7. Критика UX/UI Brightspace

**Что пользователи критикуют:**

1. **Перегруженность интерфейса:** несмотря на Daylight, некоторые пользователи считают Brightspace "слишком сложным" по сравнению с минималистичным Canvas. Слишком много настроек и опций.

2. **Крутая кривая обучения:** администраторы и преподаватели жалуются, что требуется несколько дней обучения, чтобы освоить все функции платформы.

3. **Inconsistent terminology:** некоторые термины непонятны (например, "Org Unit" вместо привычного "Course"). Требуется глоссарий.

4. **Мобильные приложения уступают Canvas:** функциональность Brightspace Pulse ниже, чем у Canvas Student app.

**Что НЕ брать для B3 LMS:**
- Избыточную сложность настроек (упростить для российских пользователей)
- Термин "Org Unit" (использовать привычные "Организация", "Департамент", "Курс")
- Сложные Intelligent Agents в v1.0 (заменить простыми BPMN-правилами)

## 4. Ключевые процессы

### 4.1. Регистрация и запись на курс

**Сценарий 1: Корпоративный enrollment (D2L for Business)**

```
[HR-система] → Интеграция API с Brightspace → автосоздание Users
    ↓
[Администратор] → Admin Panel → Enrollment Management → Bulk Enroll
    ↓
[Администратор] → Загружает CSV (UserId, CourseId, RoleId, StartDate, EndDate)
    ↓
[Brightspace] → Создает Enrollment records (status=Active)
    ↓
[Brightspace] → Отправляет Welcome Email со ссылкой на курс
    ↓
[Студент] → Получает email → кликает ссылку → логинится через SSO
    ↓
[Студент] → Видит курс на My Home → кликает на карточку курса → попадает на Course Home
```

**Сценарий 2: Self-Enrollment (самостоятельная запись)**

```
[Студент] → Browse Catalog → находит курс → кликает "Enroll"
    ↓
[Brightspace] → Проверяет: разрешена ли self-enrollment?
    ↓ (да)
[Brightspace] → Создает Enrollment (status=Active)
    ↓
[Brightspace] → Редирект на Course Home
    ↓
[Студент] → Видит Welcome Message + Start Module 1
```

### 4.2. Прохождение курса (student journey)

```
[Студент] → My Home → кликает на карточку курса "Leadership Training" (прогресс 45%)
    ↓
[Brightspace] → Открывает Course Home → показывает Content Browser (модули)
    ↓
[Студент] → Видит:
    - Module 1: Completed ✓ (зеленая галочка)
    - Module 2: In Progress (60%) — открыт
    - Module 3: Locked (зависит от завершения Module 2)
    ↓
[Студент] → Кликает Module 2 → открывается список тем:
    - Topic 2.1: Video Lecture ✓ (completed)
    - Topic 2.2: Reading Material ✓
    - Topic 2.3: Quiz (in progress — текущий шаг)
    - Topic 2.4: Assignment (locked)
    ↓
[Студент] → Кликает Quiz → открывается страница теста
    ↓
[Студент] → Проходит Quiz (10 вопросов, 20 минут limit) → Submit
    ↓
[Brightspace] → Автоматическая проверка (objective questions) → результат: 85% (Passed)
    ↓
[Brightspace] → Создает Grade record (Quiz → Grade Item → Grade)
    ↓
[Brightspace] → Обновляет Class Progress: Quiz completed ✓
    ↓
[Brightspace] → Разблокирует Topic 2.4: Assignment
    ↓
[Студент] → Кликает Assignment → читает инструкции → загружает файл → Submit
    ↓
[Brightspace] → Создает Submission record (status=Submitted, SubmittedDate=now)
    ↓
[Brightspace] → Отправляет уведомление преподавателю: "New submission from Student X"
    ↓
[Brightspace] → Обновляет Class Progress: Assignment submitted ✓
    ↓
[Brightspace] → Проверяет: все элементы Module 2 завершены?
    ↓ (да)
[Brightspace] → Разблокирует Module 3
    ↓
[Brightspace] → Отправляет студенту уведомление: "Module 3 is now available!"
    ↓
[Студент] → Видит на Dashboard: "Leadership Training" прогресс 70%
```

### 4.3. Проверка заданий преподавателем

```
[Brightspace] → Email notification преподавателю: "5 new submissions in Leadership Training"
    ↓
[Преподаватель] → Логинится → Course → Assignments → Assignment 2
    ↓
[Преподаватель] → Видит список студентов:
    - Student A: Submitted (2 days ago) — Not Graded
    - Student B: Submitted (1 day ago) — Not Graded
    - Student C: Not Submitted (overdue — красная иконка)
    ↓
[Преподаватель] → Кликает Student A → открывается Submission Viewer
    ↓
[Brightspace] → Показывает:
    - Загруженный файл (PDF) в встроенном viewer
    - Поле для оценки (Max Points: 10)
    - Поле для комментария (Feedback)
    - Rubric (если прикреплена) — критерии оценивания
    ↓
[Преподаватель] → Читает работу → отмечает критерии в Rubric (или вводит балл вручную)
    ↓
[Преподаватель] → Вводит Feedback: "Good analysis, but needs more examples"
    ↓
[Преподаватель] → Сохраняет оценку (Score: 8/10)
    ↓
[Brightspace] → Обновляет Grade record (status=Graded, GradedDate=now)
    ↓
[Brightspace] → Пересчитывает Gradebook (Final Grade студента с учетом весов категорий)
    ↓
[Brightspace] → Отправляет студенту уведомление: "Your assignment has been graded"
    ↓
[Студент] → Получает email → переходит в Grades → видит:
    - Assignment 2: 8/10
    - Feedback: "Good analysis, but needs more examples"
    - Rubric Assessment (детализация по критериям)
    ↓
[Студент] → Может ответить на комментарий (если разрешено)
```

### 4.4. Завершение курса и сертификация

```
[Студент] → Завершает последнее задание курса (Module 5: Final Project)
    ↓
[Brightspace] → Обновляет Class Progress: все элементы completed ✓
    ↓
[Brightspace] → Проверяет условия завершения курса:
    1. Все обязательные Content Topics viewed?
    2. Все обязательные Assignments submitted + graded?
    3. Все обязательные Quizzes passed (≥80%)?
    4. Final Grade ≥ passing threshold (например, 70%)?
    ↓
[Brightspace] → Условия выполнены → обновляет Enrollment (status=Completed, CompletionDate=now)
    ↓
[Brightspace] → Триггерит Intelligent Agent: "Student completed course"
    ↓
[Intelligent Agent] → Проверяет: выдать сертификат?
    ↓ (да)
[Brightspace] → Создает Certificate record (User × Course)
    ↓
[Brightspace] → Генерирует PDF сертификата (из шаблона):
    - Имя студента
    - Название курса
    - Дата завершения
    - Final Grade (опционально)
    - Уникальный verification URL
    ↓
[Brightspace] → Сохраняет PDF в профиль студента (My Awards)
    ↓
[Brightspace] → Отправляет email студенту: "Congratulations! Your certificate is ready"
    ↓
[Студент] → Переходит в My Profile → My Awards → видит Certificate
    ↓
[Студент] → Скачивает PDF или делится в LinkedIn (кнопка "Share to LinkedIn")
    ↓
[LinkedIn] → Автозаполнение: Course Name, Issuing Organization (D2L Brightspace), Date
```

### 4.5. Административные процессы

**Процесс: Массовое назначение курсов (Bulk Enrollment)**

```
[Admin] → Brightspace Admin Panel → Enrollment Management
    ↓
[Admin] → Upload CSV со столбцами: Username, OrgUnitId (Course), RoleId, StartDate, EndDate
    ↓
[Brightspace] → Парсит CSV → проверяет валидность данных
    ↓
[Brightspace] → Для каждой строки:
    - Находит User по Username (или создает нового, если не существует)
    - Создает Enrollment record
    - Отправляет Welcome Email
    ↓
[Brightspace] → Генерирует Enrollment Report: успешно созданные / ошибки
    ↓
[Admin] → Просматривает отчет → исправляет ошибки (повторный upload)
```

**Процесс: Predictive Analytics Alert (Performance+)**

```
[Brightspace Performance+] → Ежедневный анализ активности студентов
    ↓
[AI-модель] → Для каждого студента вычисляет risk score:
    - Последний login > 7 дней: +20 points
    - Не сдано 2+ заданий вовремя: +30 points
    - Низкие оценки на quizzes (<70%): +25 points
    - Нет участия в discussions: +15 points
    ↓
[AI-модель] → Risk score ≥ 50 → помечает студента как "At Risk"
    ↓
[Brightspace] → Отправляет alert преподавателю:
    - "Student B is at risk of falling behind"
    - Рекомендации: "Send personalized message", "Offer extra help session"
    ↓
[Преподаватель] → Class Progress Dashboard → видит Student B с красной иконкой
    ↓
[Преподаватель] → Кликает Student B → детальный отчет:
    - Last login: 10 days ago
    - Missing assignments: 2
    - Quiz average: 65%
    ↓
[Преподаватель] → Отправляет personalized message через Brightspace Messaging:
    - "Hi [Student B], I noticed you haven't logged in recently. Need help?"
    ↓
[Brightspace] → Логирует intervention (вмешательство) в Performance+ analytics
```

## 5. Что можно взять для B3 LMS

### 5.1. Class Progress Tool — Must-Have для v1.0

**Описание:** Детальный прогресс-трекинг с цветовой индикацией, фильтрами и drill-down отчетами.

**Реализация в B3:**
- **Для преподавателей:** Dashboard Builder → таблица Students × Progress Indicators:
  - Данные: агрегированные из Enrollments, Submissions, Quiz Attempts, Discussion Posts
  - Цветовая индикация: вычисляемое поле "Risk Level" (зеленый ≥80%, желтый 50-79%, красный <50%)
  - Drill-down: клик на студента → детальный отчет (отдельная страница с графиками активности)
- **Для студентов:** Personal Progress View:
  - Donut chart (круговой прогресс-бар) — UI-компонент Angular
  - Прогресс по модулям — вычисляемые поля на Enrollment record
  - "What's Next" — business logic: найти следующий незавершенный Content Topic

**Приоритет:** Must-Have (ключевое конкурентное преимущество)

### 5.2. Grade Categories: Calculating vs Organizational

**Описание:** Две типа категорий оценок — для вычисления итогового балла (с весами) и для визуальной группировки.

**Реализация в B3:**
- Data Model: сущность "Категория оценок" с полем "Тип" (Calculating / Organizational)
- Для Calculating: поля "Вес (%)" и "Drop Lowest N Items"
- Business Logic: вычисление итогового балла = SUM(баллы заданий × веса категорий)

**Приоритет:** Must-Have для гибкости оценивания

### 5.3. Intelligent Agents (упрощенная версия через BPMN)

**Описание:** Автоматические триггеры для уведомлений и действий (например, "студент не заходил 7 дней → email").

**Реализация в B3:**
- BPMN-процессы с таймерными событиями:
  - Trigger: "Ежедневно в 9:00"
  - Task: "Получить список Enrollments, где LastLoginDate > 7 дней назад"
  - Task: "Отправить email студентам + уведомление менеджеру"
- Визуальный конструктор правил (без программирования):
  - "Если студент получил <70% на Quiz 1 → отправить ссылку на доп. материалы"
  - "За 3 дня до дедлайна → напоминание"

**Приоритет:** Must-Have для v1.0 (базовые правила), Nice-to-Have для v2.0 (сложные сценарии)

### 5.4. Accessibility (WCAG 2.2 AAA compliance)

**Описание:** Полная доступность для людей с ограниченными возможностями.

**Реализация в B3:**
- **Keyboard Navigation:** все элементы доступны через Tab, Enter, Esc (Angular Accessibility Module)
- **Screen Reader Support:** ARIA-атрибуты для всех компонентов UI Builder
- **High Contrast Mode:** CSS-переменные для автоматического переключения цветовой схемы
- **Color Blindness:** не полагаться только на цвет (иконки + текст для статусов)
- **Adjustable Font Size:** относительные единицы (rem) вместо px
- **Accessibility Checker:** встроенная проверка при создании контента (например, проверка alt-текста для изображений)

**Приоритет:** Must-Have для госсектора РФ (требования законодательства)

**Ресурсы:**
- [D2L Accessibility Standards](https://www.d2l.com/accessibility/standards/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)

### 5.5. Adaptive Learning (упрощенная версия LeaP)

**Описание:** Персонализированные траектории обучения на основе результатов тестов.

**Реализация в B3 (упрощенная версия для v2.0):**
1. **Baseline Assessment:** студент проходит входной тест (Quiz) по началу курса
2. **Gap Analysis:** система вычисляет пробелы (темы, где студент набрал <70%)
3. **Conditional Navigation:** BPMN-правила для разблокировки контента:
   - Если студент прошел Topic 1 Quiz с ≥80% → открыть Topic 3 (skip Topic 2)
   - Если студент прошел с <70% → обязательно пройти Topic 2 (дополнительные материалы)
4. **Learning Path Customization:** администратор настраивает правила через UI Builder (без кода)

**Приоритет:** Nice-to-Have для v2.0 (полноценный LeaP требует AI-моделей, что сложно для MVP)

### 5.6. Bulk Actions (массовые операции)

**Описание:** Выбор нескольких элементов → применение действия ко всем разом.

**Примеры:**
- Выбрать 10 студентов → Send Email (массовая рассылка)
- Выбрать 5 Content Topics → Hide/Unhide (скрыть/показать)
- Выбрать 3 курса → Assign to Department (назначить департаменту)

**Реализация в B3:**
- Dashboard Builder: чекбоксы для строк таблицы + кнопка "Действие"
- BPMN-процесс: for-each loop для обработки выбранных записей

**Приоритет:** Nice-to-Have для v2.0 (упрощает работу с большими курсами)

### 5.7. Rubrics (рубрики оценивания)

**Описание:** Матрица критериев × уровней достижения для структурированной оценки заданий.

**Реализация в B3 (v2.0):**
- Data Model: сущность "Рубрика" с child-таблицей "Критерий" и "Уровень"
- UI: конструктор рубрик (матрица с редактируемыми ячейками)
- Grading Interface: преподаватель отмечает критерии → автоматический расчет итогового балла

**Приоритет:** Nice-to-Have для v2.0 (в v1.0 достаточно простых оценок)

### 5.8. Learning Outcomes / Competencies Mapping

**Описание:** Связь заданий с компетенциями (навыками), агрегированная отчетность по компетенциям.

**Реализация в B3 (v2.0):**
- Data Model: сущность "Компетенция" × "Задание" (many-to-many)
- Business Logic: вычисление уровня владения компетенцией = AVG(оценки по заданиям, связанным с компетенцией)
- Dashboard: отчет "Компетенции студента" (radar chart — паутинка навыков)

**Приоритет:** Nice-to-Have для v2.0 (важно для корпоративного обучения — карьерные треки)

---

## 6. Что НЕ подходит для B3 LMS

### 6.1. Org Unit как универсальная абстракция

**Проблема:**
Brightspace использует единую модель Org Unit для организаций, департаментов, курсов, групп. Это гибко, но **сложно для понимания** российских пользователей (корпоративных и госсекторов), которые привыкли к четким терминам "Организация", "Подразделение", "Курс".

**Почему НЕ брать:**
- Крутая кривая обучения (администраторам нужно изучать концепцию Org Unit)
- Термин "Org Unit" непонятен для нетехнических пользователей
- Избыточная гибкость для большинства российских заказчиков (99% случаев — простая иерархия: Организация → Департамент → Курс)

**Альтернатива для B3:**
- Отдельные сущности: "Организация", "Департамент", "Курс", "Группа" (более понятная модель)
- Если нужна гибкость — добавить в v2.0 с явной документацией и обучающими материалами

### 6.2. Predictive Analytics (Performance+) — AI-модели

**Проблема:**
Performance+ использует машинное обучение для предсказания students at risk. Это требует:
- Больших данных (десятки тысяч студентов для обучения модели)
- Интеграции с AI/ML сервисами (Amazon SageMaker, Google AI Platform)
- Экспертизы в Data Science (настройка весов, валидация модели)

**Почему НЕ брать для v1.0:**
- B3 Learning Portal — новая система, недостаточно исторических данных для обучения AI
- Высокая стоимость разработки и поддержки
- Сложность объяснения алгоритма заказчикам ("почему студент помечен как at risk?")

**Альтернатива для B3:**
- v1.0: **простые правила через BPMN** (не заходил 7 дней → alert, провалил 2 квиза → alert)
- v2.0: базовая аналитика (статистика по группе: средний балл, процент завершивших, топ-отстающие)
- v3.0+: AI-модели (если накопится база данных и будет запрос от заказчиков)

### 6.3. Сложные Intelligent Agents с визуальным конструктором

**Проблема:**
Brightspace Intelligent Agents имеют визуальный конструктор с условиями "IF-THEN-ELSE", множественными триггерами, сложными действиями (например, "Если студент завершил Module 3 + получил ≥80% на Quiz 3 → разослать персонализированные emails + обновить External System через API").

**Почему НЕ брать для v1.0:**
- Требует разработки отдельного Rule Engine (движка правил)
- Сложность для конечных пользователей (преподаватели жалуются, что запутались в настройках)
- Risk of misconfiguration (неправильная настройка → спам студентов уведомлениями)

**Альтернатива для B3:**
- v1.0: **предзаданные шаблоны** правил (выбрать из списка: "Напоминание за 3 дня до дедлайна", "Alert при отсутствии активности 7 дней")
- v2.0: упрощенный конструктор (только базовые условия и действия)
- v3.0: полноценный Rule Engine (если будет запрос от продвинутых пользователей)

### 6.4. SCORM 1.2 / SCORM 2004 поддержка (в полном объеме)

**Проблема:**
Brightspace поддерживает импорт SCORM-пакетов (стандарт e-learning контента). Это требует:
- SCORM Player (JavaScript-движок для воспроизведения SCORM-курсов)
- API для взаимодействия с LMS (tracking completion, scores)
- Поддержка устаревших стандартов (SCORM 1.2 — 2001 год)

**Почему НЕ брать для v1.0:**
- SCORM устаревает (заменяется xAPI/Tin Can, которые более гибкие)
- Сложность реализации (SCORM Player — отдельный проект на недели разработки)
- Низкий приоритет для российских корпоративных заказчиков (большинство создают контент внутри LMS, а не импортируют SCORM)

**Альтернатива для B3:**
- v1.0: встраивание внешнего контента через iframe (URL к внешним курсам)
- v2.0: поддержка xAPI (Tin Can API) — современный стандарт
- v3.0: SCORM поддержка (если будет запрос от заказчиков с legacy-контентом)

### 6.5. Advanced Video Player (interactive transcripts, in-video quizzes)

**Проблема:**
Brightspace имеет интеграцию с продвинутыми видеоплеерами (Kaltura, Panopto), которые поддерживают:
- Interactive transcripts (клик на фразу → перемотка видео)
- In-video quizzes (пауза на определенном моменте → вопрос)
- Heatmaps (где студенты чаще всего перематывают)
- Note-taking (скриншоты + заметки с таймкодами)

**Почему НЕ брать для v1.0:**
- Требует разработки кастомного видеоплеера или интеграции с платным сервисом (Kaltura — дорого)
- Низкий приоритет для MVP (достаточно базового HTML5 video player)
- Российские заказчики чаще используют простые видео (лекции без интерактивности)

**Альтернатива для B3:**
- v1.0: базовый HTML5 video player (play/pause, volume, fullscreen) + встраивание YouTube/Vimeo
- v2.0: интеграция с российскими видеохостингами (RuTube, VK Video)
- v3.0: продвинутый плеер с interactive transcripts (если бюджет позволит)

### 6.6. Awards / Badges (геймификация через Open Badges)

**Проблема:**
Brightspace поддерживает цифровые бейджи (Open Badges стандарт), которые можно делиться в LinkedIn. Это требует:
- Интеграции с Open Badges API
- Генерации изображений бейджей (PNG с метаданными)
- Хранилища бейджей (badge backpack)

**Почему НЕ брать для v1.0:**
- Низкий приоритет для корпоративного обучения в РФ (сотрудники обучаются по необходимости, а не для бейджей)
- Сложность интеграции с LinkedIn (для российских компаний LinkedIn менее актуален, чем для западных)
- Требует дополнительного UX (управление бейджами, витрина достижений)

**Альтернатива для B3:**
- v1.0: простые сертификаты (PDF) — достаточно для большинства заказчиков
- v2.0: система достижений (без интеграции с Open Badges) — внутренние бейджи на портале
- v3.0: Open Badges (если будет запрос от международных корпораций)

---

## 7. Ссылки

### 7.1. Официальные ресурсы D2L Brightspace

**Главная страница и продукты:**
- [D2L Homepage](https://www.d2l.com/)
- [Brightspace LMS Platform](https://www.d2l.com/brightspace/)
- [D2L for Business (корпоративное решение)](https://www.d2l.com/solutions/corporate/)
- [Brightspace Performance+ (predictive analytics)](https://www.d2l.com/brightspace/performance/)
- [Accessibility+ (сервис проверки доступности)](https://www.d2l.com/brightspace/accessibility-plus/)

**Документация и поддержка:**
- [Brightspace Community (knowledge base)](https://community.d2l.com/brightspace/)
- [Class Progress Tool — About](https://community.d2l.com/brightspace/kb/articles/3314-about-class-progress)
- [Track Course Progress with Class Progress Tool](https://community.d2l.com/brightspace/kb/articles/3552-track-course-progress-with-the-class-progress-tool)
- [Set up your Grade book](https://community.d2l.com/brightspace/kb/articles/3539-set-up-your-grade-book)
- [About Roles and Permissions](https://community.d2l.com/brightspace/kb/articles/4451-about-roles-and-permissions)
- [Reach every learner with Brightspace accessibility features](https://community.d2l.com/brightspace/kb/articles/5683-reach-every-learner-with-brightspace-accessibility-features)

**API и Developer Resources:**
- [Valence API Documentation](https://docs.valence.desire2learn.com/)
- [Organization Structure API (Org Units)](https://docs.valence.desire2learn.com/res/orgunit.html)
- [Users API](https://docs.valence.desire2learn.com/res/user.html)

### 7.2. UX/UI и Daylight Experience

**Статьи о Daylight редизайне:**
- [A new look for Brightspace! (Daylight announcement)](https://www.d2l.com/resources/videos/the-brightspace-daylight-user-experience/)
- [Daylight in D2L Brightspace (Augusta University)](https://www.augusta.edu/its/daylight)
- [New Look for D2L Brightspace (Eastern Illinois University, 2018)](https://www.eiu.edu/d2l/daylight.php)

**Accessibility:**
- [D2L Accessibility Standards (WCAG 2.2 AAA)](https://www.d2l.com/accessibility/standards/)
- [Accessibility in Education (D2L overview)](https://www.d2l.com/accessibility/)
- [How Brightspace Delivers Beyond Accessibility Compliance](https://www.d2l.com/blog/how-brightspace-delivers-beyond-accessibility-compliance/)

### 7.3. Adaptive Learning и Predictive Analytics

**Performance+ и Predictive Analytics:**
- [Brightspace Performance+ Overview](https://www.d2l.com/brightspace/performance/)
- [D2L Expands Use of Intelligent Technology (2022 announcement)](https://www.d2l.com/newsroom/d2l-expands-use-of-intelligent-technology/)
- [Predictive Learning Analytics: The Ultimate Guide for 2026](https://www.d2l.com/blog/boost-corporate-learning-predictive-analytics/)
- [What Is Learning Analytics? The Ultimate Guide](https://www.d2l.com/resources/assets/learning-data-analytics-guide/)

**Adaptive Learning (LeaP):**
- [D2L Supercharges Its Integrated Learning Platform with Adaptive Learning (2014)](https://www.globenewswire.com/en/news-release/2014/07/14/1485032/0/en/D2L-Supercharges-Its-Integrated-Learning-Platform-with-Adaptive-Learning-Robust-Analytics-Gamification-Windows-R-8-Mobile-Capabilities-and-the-Newest-Content-All-Delivered-in-the-C.html)

### 7.4. Обзоры и сравнения

**Обзоры платформы:**
- [D2L Brightspace Review 2025 (Research.com)](https://research.com/software/reviews/d2l-brightspace-review)
- [D2L Brightspace Reviews 2025 (G2)](https://www.g2.com/products/d2l-brightspace/reviews)

**Сравнения с конкурентами:**
- [Open LMS vs. D2L Brightspace: Choosing the Most Cost-Effective Solution](https://www.openlms.net/blog/products/open-lms-vs-d2l-brightspace-cost-effective-elearning-solution/)
- [Top 7 LMS Alternatives to D2L Brightspace in 2026](https://www.ispringsolutions.com/blog/d2l-brightspace-alternatives)

**Product Teardown:**
- [D2L Brightspace Product Teardown Analysis (NextSprints)](https://nextsprints.com/guide/d2l-brightspace-product-teardown-analysis)

### 7.5. Корпоративное обучение (D2L for Business)

**Официальные ресурсы:**
- [D2L for Business — Corporate Training LMS](https://www.d2l.com/solutions/corporate/)
- [D2L Products — Learning Management System with Brightspace](https://www.d2l.com/products/)
- [D2L on OMNIA Partners (government procurement)](https://www.omniapartners.com/suppliers/d2l/public-sector)

**Обзоры и аналитика:**
- [D2L for Business Reviews (G2)](https://www.g2.com/products/coursera-for-business/reviews) — note: link might be incorrect in search results
- [D2L Brightspace (SkillQ overview)](https://skillq.com/d2l-brightspace/)
- [D2L LMS (Talented Learning Directory)](https://talentedlearning.com/lms/d2l/)

### 7.6. Дополнительные ресурсы

**Gradebook и оценивание:**
- [Brightspace Gradebook Tutorial (University of Akron)](https://www.uakron.edu/gradsch/docs/BrightSpace_F18.pdf)
- [Understanding the Brightspace Grade Book – Part 1 (Wentworth Institute)](https://sites.wit.edu/lit/understanding_d2l_gradebook-p1/)
- [Linking Brightspace Assignment to Grades (Stony Brook University)](https://it.stonybrook.edu/help/kb/linking-a-brightspace-assignment-to-grades)
- [Creating Grade Items and Categories (Vanderbilt University)](https://www.vanderbilt.edu/brightspace/on-demand-resources/how-do-i-create-grade-categories-and-items/)

**Data Sets и Advanced Analytics:**
- [About Advanced Data Sets (South Dakota Board of Regents)](https://boris.sdbor.edu/d2ldocs/LearnerHelp_201912/insights/data_hub/admin/ads_intro.htm)

---

**Конец анализа D2L Brightspace**

## Итоги анализа

### Ключевые выводы:

1. **Class Progress Tool — главное преимущество Brightspace:** детальный прогресс-трекинг с цветовой индикацией и drill-down отчетами. Это то, чего не хватает Canvas и что реализовано лучше, чем в Coursera. **Must-Have для B3 LMS v1.0.**

2. **Accessibility (WCAG 2.2 AAA) — индустриальный стандарт:** Brightspace демонстрирует, как правильно реализовать доступность для людей с ограниченными возможностями. Критично для госсектора РФ.

3. **Grade Categories (Calculating vs Organizational) — гибкость оценивания:** два типа категорий позволяют преподавателям структурировать Gradebook с весами или без. **Must-Have для B3 LMS.**

4. **Intelligent Agents (упрощенная версия) — автоматизация через BPMN:** базовые правила ("студент не заходил 7 дней → alert") легко реализуются через BPMN B3 Platform. Сложные AI-модели Performance+ — для v2.0+.

5. **Adaptive Learning (LeaP) — упростить для B3:** полноценный LeaP требует AI, но базовую адаптивность (conditional navigation на основе результатов тестов) можно реализовать через BPMN в v2.0.

### Приоритеты для B3 LMS:

**Must-Have (v1.0):**
- Class Progress Tool (детальный прогресс-трекинг)
- WCAG 2.2 AA compliance (доступность)
- Grade Categories: Calculating vs Organizational
- Базовые Intelligent Agents через BPMN (простые правила)
- Bulk Enrollment (массовая запись на курсы через CSV)

**Nice-to-Have (v2.0):**
- Adaptive Learning (упрощенная версия)
- Rubrics (рубрики оценивания)
- Competencies Mapping (связь заданий с навыками)
- Bulk Actions (массовые операции в UI)
- Advanced Progress Reports (экспорт в CSV/PDF с настраиваемыми колонками)

**Low Priority (v3.0+):**
- Predictive Analytics (AI-модели для выявления students at risk)
- Сложные Intelligent Agents (визуальный конструктор правил)
- SCORM поддержка
- Advanced Video Player (interactive transcripts, in-video quizzes)
- Open Badges (геймификация)

### Что НЕ брать:

❌ **Org Unit как универсальная абстракция** — слишком сложно для российских пользователей, использовать отдельные сущности "Организация", "Департамент", "Курс"

❌ **Performance+ AI-модели в v1.0** — недостаточно данных для обучения, заменить простыми BPMN-правилами

❌ **Сложные Intelligent Agents в v1.0** — использовать предзаданные шаблоны вместо визуального конструктора

❌ **SCORM 1.2/2004 в v1.0** — устаревший стандарт, заменить встраиванием внешнего контента через iframe

❌ **Advanced Video Player в v1.0** — достаточно базового HTML5 player + YouTube/Vimeo embedding

❌ **Open Badges в v1.0** — низкий приоритет для корпоративного обучения в РФ, достаточно PDF-сертификатов

---

**Статус:** Анализ завершен
**Дата:** 2025-12-10
**Следующее действие:** Интеграция выводов в Best Practices Summary и архитектуру B3 LMS
