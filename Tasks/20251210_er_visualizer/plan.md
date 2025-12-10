# ER-диаграмма и статусные переходы — Визуализатор

**Дата:** 2025-12-10
**Статус:** План
**Оценка времени:** 1.5-2 часа

---

## Цель

Создать интерактивную HTML/JS страницу для визуализации:
1. **ER-графа** сущностей B3 LMS (на базе vis.js Network)
2. **Панели атрибутов** выбранной сущности (справа)
3. **Диаграммы переходов статусов** (снизу)

---

## Технологии

- **vis.js Network** — интерактивный граф с drag-n-drop, zoom, физикой
- **Чистый HTML/CSS** — без фреймворков
- **CDN** — vis.js загружается с CDN, без npm

---

## Структура файлов

```
proto/er-viewer/
├── index.html          # Основная страница
├── styles.css          # Стили
├── data.js             # Данные: сущности, атрибуты, связи, статусы
└── app.js              # Логика: граф, панель, диаграмма статусов
```

---

## Данные (data.js)

```javascript
const entities = [
  {
    id: "course_template",
    label: "Шаблон курса\nCourse Template",
    group: "template",
    attributes: [
      { name: "id", type: "UUID", required: true, desc: "Уникальный идентификатор" },
      { name: "code", type: "String(50)", required: true, desc: "Код курса" },
      { name: "title", type: "String(255)", required: true, desc: "Название" },
      // ... остальные атрибуты
    ],
    statuses: [
      { id: "draft", label: "Черновик", desc: "Курс в разработке" },
      { id: "published", label: "Опубликован", desc: "Виден в каталоге" },
      { id: "archived", label: "Архивирован", desc: "Скрыт из каталога" }
    ],
    transitions: [
      { from: "draft", to: "published", label: "Публикация", initiator: "Методист" },
      { from: "published", to: "draft", label: "Снять с публикации", initiator: "Методист" },
      { from: "published", to: "archived", label: "Архивировать", initiator: "Методист/Админ" },
      { from: "draft", to: "archived", label: "Удалить черновик", initiator: "Методист" }
    ]
  },
  // ... остальные сущности
];

const relations = [
  { from: "course_template", to: "course_instance", label: "1:N", arrows: "to" },
  { from: "course_template", to: "assignment_template", label: "1:N", arrows: "to" },
  { from: "course_instance", to: "enrollment", label: "1:N", arrows: "to" },
  // ... остальные связи
];
```

---

## Сущности для визуализации

1. **User** (Пользователь) — базовая, без статусов
2. **Student** (Слушатель) — расширение User
3. **Course Template** (Шаблон курса) — статусы: draft/published/archived
4. **Course Instance** (Учебная группа) — статусы: planned/active/completed/archived
5. **Enrollment** (Запись на курс) — статусы: pending_approval/approved/active/completed/withdrawn/failed
6. **Assignment Template** (Шаблон задания) — статусы: draft/active/archived
7. **Assignment Instance** (Экземпляр задания) — статусы: not_started/in_progress/submitted/under_review/graded/needs_revision
8. **Dialog** (Диалог) — статусы: active/archived
9. **Message** (Сообщение) — без статусов
10. **Certificate Template** (Шаблон сертификата) — статусы: draft/active/archived
11. **Certificate Instance** (Экземпляр сертификата) — статусы: issued/revoked
12. **Notification** (Уведомление) — без статусов
13. **Assignment Schedule** (График заданий) — без статусов
14. **Launch Schedule** (График запуска) — без статусов

---

## Layout страницы

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: "B3 LMS — Модель данных"                               │
├─────────────────────────────────────────────┬───────────────────┤
│                                             │                   │
│                                             │  Панель атрибутов │
│           vis.js Network Graph              │  ───────────────  │
│           (ER-диаграмма)                    │  Сущность: ...    │
│                                             │  ───────────────  │
│           - Drag-n-drop узлов               │  | Поле | Тип |   │
│           - Zoom/Pan                        │  |------|-----|   │
│           - Клик = выбор сущности           │  | id   | UUID|   │
│           - Hover = подсказка               │  | ...  | ... |   │
│                                             │                   │
├─────────────────────────────────────────────┴───────────────────┤
│                                                                 │
│  Диаграмма переходов статусов (для выбранной сущности)          │
│                                                                 │
│  [draft] ─────► [published] ─────► [archived]                   │
│     │               │                                           │
│     └───────────────┘ (снять с публикации)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Визуальные группы (цвета)

| Группа | Цвет | Сущности |
|--------|------|----------|
| template | #4CAF50 (зеленый) | Course Template, Assignment Template, Certificate Template |
| instance | #2196F3 (синий) | Course Instance, Assignment Instance, Certificate Instance |
| user | #9C27B0 (фиолетовый) | User, Student |
| process | #FF9800 (оранжевый) | Enrollment, Dialog |
| support | #607D8B (серый) | Message, Notification, Assignment Schedule, Launch Schedule |

---

## Шаги реализации

### Шаг 1: Создать базовую структуру (15 мин)
- `index.html` с layout
- `styles.css` с flexbox-layout
- Подключить vis.js через CDN

### Шаг 2: Создать data.js (30 мин)
- Извлечь все сущности из `doc/03_entities.md`
- Добавить атрибуты каждой сущности
- Добавить статусы и переходы
- Определить связи между сущностями

### Шаг 3: Реализовать ER-граф (20 мин)
- Инициализировать vis.js Network
- Настроить физику для автолейаута
- Настроить группы (цвета)
- Добавить обработчик клика на узел

### Шаг 4: Реализовать панель атрибутов (15 мин)
- Таблица с атрибутами выбранной сущности
- Показ при клике на узел графа
- Пустое состояние: "Выберите сущность"

### Шаг 5: Реализовать диаграмму статусов (20 мин)
- Второй vis.js Network (или простой SVG)
- Показ статусов и переходов выбранной сущности
- Обновляется при смене выбранной сущности

### Шаг 6: Финальная полировка (10 мин)
- Responsive design
- Hover-подсказки
- Легенда цветов

---

## Риски и упрощения

1. **Сложные связи** — некоторые связи полиморфные (Dialog.reference_id). Упрощаем до простых линий.
2. **Много атрибутов** — таблица атрибутов может быть длинной. Добавим скролл.
3. **Переходы статусов** — некоторые диаграммы сложные (Enrollment с 6 статусами). vis.js справится.

---

## Результат

Интерактивная HTML-страница, которую можно:
- Открыть локально в браузере
- Использовать для презентации модели данных
- Встроить в документацию

---

## Запуск

```bash
# Из корня проекта
npx http-server -p 8080
# Открыть: http://localhost:8080/proto/er-viewer/
```

Или просто открыть `index.html` (vis.js загружается с CDN).
