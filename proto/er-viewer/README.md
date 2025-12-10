# ER Viewer — Визуализатор модели данных B3 LMS

Интерактивная визуализация ER-диаграммы и статусных переходов.

## Запуск

Открыть `index.html` в браузере (vis.js загружается с CDN).

Или через локальный сервер:
```bash
npx http-server -p 8080
# http://localhost:8080/proto/er-viewer/
```

## Структура

```
er-viewer/
├── index.html    # Разметка страницы
├── styles.css    # Стили
├── data.js       # Данные: сущности, атрибуты, связи, статусы
└── app.js        # Логика визуализации (vis.js)
```

## Редактирование данных

Все данные модели находятся в `data.js`. При изменении структуры в `doc/03_entities.md` нужно обновить:

### 1. Сущности (`entities`)

```javascript
{
    id: "entity_id",           // Уникальный ID (snake_case)
    label: "Название\nName",   // Отображаемое имя (рус + англ через \n)
    group: "template",         // Группа: template|instance|user|process|support
    attributes: [...],         // Атрибуты (см. ниже)
    statuses: [...],           // Статусы (см. ниже)
    transitions: [...]         // Переходы между статусами
}
```

### 2. Атрибуты (`attributes`)

```javascript
{ name: "field_name", type: "String(255)", required: true, desc: "Описание" }
```

### 3. Статусы (`statuses`)

```javascript
{ id: "draft", label: "Черновик", desc: "Описание", color: "#FFA000" }
```

### 4. Переходы (`transitions`)

```javascript
{
    from: "draft",
    to: "published",
    label: "Публикация",
    initiator: "Методист",
    trigger: "Ручной",
    conditions: "Все обязательные поля заполнены",
    validation: "Минимум 1 задание",
    visibility: "Появляется в каталоге",
    access: "Только чтение для студентов",
    childObjects: "—",
    notifications: "—",
    updatedFields: "published_at = NOW()",
    parentUpdates: "—",
    notes: "Дополнительная информация"
}
```

### 5. Связи (`relations`)

```javascript
{ from: "course_template", to: "course_instance", label: "1:N", arrows: "to" }
```

### 6. Позиции узлов

В `app.js` в функции `initERGraph()` есть `positionMap` — начальные координаты узлов:

```javascript
const positionMap = {
    'entity_id': { x: 0, y: 100 },
    // ...
};
```

## Цветовая схема групп

| Группа | Цвет | Сущности |
|--------|------|----------|
| template | #4CAF50 | Шаблоны курсов, заданий, сертификатов |
| instance | #2196F3 | Экземпляры курсов, заданий, сертификатов |
| user | #9C27B0 | User, Student |
| process | #FF9800 | Enrollment, Dialog |
| support | #607D8B | Message, Notification, Schedules |
