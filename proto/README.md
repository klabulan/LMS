# B3 Learning Portal - Prototype

## Структура файлов

```
proto/
├── index.html            # Основная страница (монолитный app.js)
├── index-modular.html    # Модульная версия (для разработки)
├── styles.css            # Стили приложения
├── data.js               # Демо-данные и хелперы данных
├── app.js                # Монолитный код приложения
├── README.md             # Документация
└── modules/              # Модульная версия кода
    ├── state.js          # Состояние приложения
    ├── helpers.js        # Вспомогательные функции
    ├── navigation.js     # Навигация и управление ролями
    ├── guest.js          # Экраны анонимного пользователя
    ├── student.js        # Экраны студента
    ├── methodist.js      # Экраны методиста
    ├── teacher.js        # Экраны преподавателя
    ├── admin.js          # Экраны администратора
    └── main.js           # Главный рендеринг и инициализация
```

## Использование

### Монолитная версия
Открыть `index.html` в браузере. Весь код в одном файле `app.js`.

### Модульная версия
Открыть `index-modular.html` в браузере. Код разделён на модули в папке `modules/`.

**Важно:** Модульная версия требует локального сервера для корректной работы
(из-за CORS при загрузке скриптов). Используйте:
```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

## Модули

### state.js
Глобальное состояние приложения:
- `state.role` - текущая роль пользователя
- `state.currentView` - текущий экран
- `state.currentCourseId` - ID выбранного курса
- и др.

### helpers.js
Вспомогательные функции:
- `getCurrentUser()` - текущий пользователь
- `renderBreadcrumbs()` - хлебные крошки
- `openModal()` / `closeModal()` - модальные окна
- `toggleNotifications()` - уведомления
- и др.

### navigation.js
Навигация:
- `handleRoleChange()` - смена роли
- `switchRole()` - переключение роли
- `renderSidebar()` - боковое меню
- `navigateTo()` - навигация между экранами

### guest.js
Экраны для анонимных пользователей:
- `renderLandingPage()` - главная страница
- `renderCatalogPage()` - каталог курсов
- `renderCourseDetailPage()` - детали курса
- `showRegistrationModal()` - модалка регистрации
- `showLoginModal()` - модалка входа

### student.js
Экраны для студентов:
- `renderStudentDashboard()` - панель студента
- `renderStudentCoursePage()` - страница курса
- `renderStudentAssignmentPage()` - страница задания
- `renderStudentCertificatesPage()` - сертификаты
- `renderStudentMessagesPage()` - сообщения

### methodist.js
Экраны для методистов:
- `renderMethodistDashboard()` - панель методиста
- `renderTemplateEditor()` - редактор шаблона курса
- `showAddAssignmentModal()` - добавление задания
- `showEditAssignmentModal()` - редактирование задания
- Настройки графиков запуска и прохождения

### teacher.js
Экраны для преподавателей:
- `renderTeacherDashboard()` - панель преподавателя
- `renderGradebook()` - журнал оценок
- `showAttendanceModal()` - отметка посещения
- `showGradeModal()` - выставление оценки

### admin.js
Экраны для администраторов:
- `renderAdminDashboard()` - панель администратора
- `renderEnrollmentRequests()` - заявки на запись
- `renderCourseInstancesList()` - экземпляры курсов
- `renderUserManagement()` - управление пользователями
- `renderSystemReports()` - системные отчёты

### main.js
Главные функции:
- `renderMain()` - рендеринг основного контента
- `renderApp()` - полный рендеринг приложения
- `setupEventListeners()` - обработчики событий
- `init()` - инициализация

## Роли

| Роль | Описание | Основные функции |
|------|----------|------------------|
| **anonymous** | Гость | Просмотр каталога, подача заявки |
| **student** | Студент | Прохождение курсов, выполнение заданий |
| **methodist** | Методист | Создание шаблонов курсов и заданий |
| **teacher** | Преподаватель | Ведение курсов, оценивание |
| **admin** | Администратор | Управление порталом |

## Новые функции v2

### Редактор шаблонов методиста
- Навигация справа (унифицирована со студентом)
- 4 вкладки: Общая информация, Задания, График заданий, График запуска
- Тип задания: очное / самостоятельное

### Журнал оценок преподавателя
- Отметка посещения для очных заданий
- Визуальное выделение типов заданий
- Модальные окна для оценивания

### Поля заданий
- `deliveryMode`: "in_person" | "self_study"
- `startCondition`: "course_start" | "prev_complete" | "manual"
- `startOffset`: дней от старта курса

## Данные

Все данные хранятся в `data.js` и доступны через глобальный объект `window.LMSData` (или `Data`).

Основные коллекции:
- `courseTemplates` - шаблоны курсов
- `courseInstances` - экземпляры курсов
- `assignmentTemplates` - шаблоны заданий
- `assignmentInstances` - экземпляры заданий
- `enrollments` - записи на курсы
- `enrollmentRequests` - заявки на запись
- `certificates` - сертификаты
- `dialogs` / `messages` - коммуникация
- `notifications` - уведомления
- `mockUsers` - пользователи для демо
