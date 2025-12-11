// B3 Learning Portal - Methodist Screens Module
// Экраны для методистов

// State for template editor
let templateEditorTab = 'info'; // 'info', 'assignments', 'schedule', 'launch'

function renderMethodistDashboard() {
  const user = getCurrentUser();
  const myTemplates = Data.courseTemplates.filter(t => t.createdBy === user.id);

  const totalTemplates = myTemplates.length;
  const totalInstances = Data.courseInstances.filter(ci =>
    myTemplates.some(t => t.id === ci.courseTemplateId)
  ).length;

  const templateCardsHtml = myTemplates.map(template => {
    const instanceCount = Data.courseInstances.filter(ci => ci.courseTemplateId === template.id).length;
    const assignmentCount = Data.getAssignmentTemplatesForCourse(template.id).length;

    return `
      <article class="card">
        <div class="card-header-line">
          <div>
            <div class="card-title">${template.title}</div>
            <div class="card-meta">${template.code} · ${Data.formatLevel(template.level)}</div>
          </div>
          <span class="badge badge-status">${Data.formatStatusLabel(template.status)}</span>
        </div>
        <div class="card-meta">${template.description}</div>
        <div class="card-meta" style="margin-top:8px;">
          <strong>${assignmentCount}</strong> заданий ·
          <strong>${instanceCount}</strong> экземпляров ·
          Порог сертификата: <strong>${template.certificateThreshold}%</strong>
        </div>
        <div class="card-header-line" style="margin-top:8px;">
          <button class="btn" data-edit-template="${template.id}">Редактировать</button>
          <button class="btn btn-ghost" data-preview-template="${template.id}">Предпросмотр</button>
        </div>
      </article>
    `;
  }).join("");

  return `
    <section>
      <header class="main-header">
        <div>
          <h1 class="main-title">Рабочее место методиста</h1>
          <div class="main-subtitle">Проектирование курсов и заданий</div>
        </div>
        <button class="btn btn-primary" id="btnCreateTemplate">Создать шаблон курса</button>
      </header>

      <section style="margin-bottom:20px;">
        <h2 style="font-size:14px;margin:6px 0 8px;">Статистика</h2>
        <div class="cards-grid">
          <div class="card">
            <div class="card-title">Мои шаблоны курсов</div>
            <div style="font-size:32px;font-weight:600;">${totalTemplates}</div>
          </div>
          <div class="card">
            <div class="card-title">Создано экземпляров</div>
            <div style="font-size:32px;font-weight:600;">${totalInstances}</div>
          </div>
        </div>
      </section>

      <section>
        <h2 style="font-size:14px;margin:6px 0 8px;">Мои шаблоны курсов (${totalTemplates})</h2>
        <div class="cards-grid">
          ${templateCardsHtml || '<div class="main-subtitle">Пока нет шаблонов. Создайте первый шаблон курса.</div>'}
        </div>
      </section>
    </section>
  `;
}

function renderTemplateEditor() {
  const template = Data.getCourseTemplate(state.currentCourseId);
  if (!template) {
    navigateTo("methodistDashboard");
    return "";
  }

  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  // Status management buttons based on current state
  const getStatusActions = () => {
    if (template.status === 'published') {
      return `
        <button class="btn btn-outline-warning btn-sm" onclick="Methodist.changeTemplateStatus('${template.id}', 'draft')">
          <i class="bi bi-eye-slash me-1"></i>Снять с публикации
        </button>
      `;
    } else if (template.status === 'draft') {
      return `
        <button class="btn btn-success btn-sm" onclick="Methodist.changeTemplateStatus('${template.id}', 'published')">
          <i class="bi bi-send me-1"></i>Опубликовать
        </button>
      `;
    } else {
      return '';
    }
  };

  // Info tab content
  const infoContent = `
    <div class="card">
      <div class="field-label">Название</div>
      <input type="text" class="textarea" id="editTitle" value="${template.title}" style="min-height:auto;padding:8px;">

      <div class="field-label">Код</div>
      <input type="text" class="textarea" id="editCode" value="${template.code}" style="min-height:auto;padding:8px;">

      <div class="field-label">Уровень</div>
      <select class="textarea" id="editLevel" style="min-height:auto;padding:8px;">
        <option value="basic" ${template.level === 'basic' ? 'selected' : ''}>Базовый</option>
        <option value="intermediate" ${template.level === 'intermediate' ? 'selected' : ''}>Средний</option>
        <option value="advanced" ${template.level === 'advanced' ? 'selected' : ''}>Продвинутый</option>
      </select>

      <div class="field-label">Категория</div>
      <input type="text" class="textarea" id="editCategory" value="${template.category || ''}" style="min-height:auto;padding:8px;">

      <div class="field-label">Описание</div>
      <textarea class="textarea" id="editDescription">${template.description}</textarea>

      <div class="field-label">Предварительные требования</div>
      <textarea class="textarea" id="editPrerequisites">${template.prerequisites || ''}</textarea>

      <div class="field-label">Порог для сертификата (%)</div>
      <input type="number" class="textarea" id="editThreshold" value="${template.certificateThreshold}" min="0" max="100" style="min-height:auto;padding:8px;">

      <div class="field-label">Ориентировочная длительность (часов)</div>
      <input type="number" class="textarea" id="editHours" value="${template.estimatedHours || 0}" min="0" style="min-height:auto;padding:8px;">

      <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border);">
        <div style="font-weight:500; margin-bottom:12px;">Управление статусом</div>
        <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
          <span class="pill ${template.status === 'published' ? 'status-accepted' : 'status-draft'}">
            ${Data.formatStatusLabel(template.status)}
          </span>
          ${getStatusActions()}
        </div>
      </div>
    </div>
  `;

  // Assignments tab content
  const assignmentsContent = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <div style="font-size:13px; color:#6b7280;">
        Всего заданий: ${assignments.length}
      </div>
      <button class="btn btn-primary btn-sm" onclick="showAddAssignmentModal('${template.id}')">
        + Добавить задание
      </button>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px;">
      ${assignments.length > 0 ? assignments.map(a => `
        <div class="card" style="padding:12px; cursor:pointer; transition:all 0.15s;"
             onclick="showEditAssignmentModal('${a.id}')"
             onmouseover="this.style.borderColor='var(--color-primary)'"
             onmouseout="this.style.borderColor='var(--color-border)'">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="width:24px; height:24px; background:#e5e7eb; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:#374151;">
                  ${a.order}
                </span>
                <div class="card-title">${a.title}</div>
                ${a.deliveryMode === 'in_person' ? '<span class="tag" style="background:#fef3c7; color:#92400e; font-size:10px;">Очное</span>' : ''}
              </div>
              <div class="card-meta" style="margin-top:4px; margin-left:32px;">
                ${Data.formatAssignmentType(a.type)} ·
                ${a.deliveryMode === 'in_person' ? 'Очное' : 'Самостоятельное'} ·
                ${a.isMandatory ? 'Обязательное' : 'Опциональное'} ·
                ${a.maxScore} баллов
              </div>
              <div style="font-size:12px; color:#6b7280; margin-top:4px; margin-left:32px; line-height:1.4;">
                ${(a.short_description || a.description || '').substring(0, 100)}${(a.short_description || a.description || '').length > 100 ? '...' : ''}
              </div>
            </div>
            <span style="color:#9ca3af; font-size:18px;">→</span>
          </div>
        </div>
      `).join('') : `
        <div style="text-align:center; padding:40px; color:#9ca3af;">
          <div style="font-size:32px; margin-bottom:8px;">📝</div>
          <div>Нет заданий. Добавьте первое задание курса.</div>
        </div>
      `}
    </div>
  `;

  // Assignment schedule tab content
  const scheduleContent = `
    <div class="card">
      <div style="font-weight:500; margin-bottom:16px;">График прохождения заданий</div>
      <p style="font-size:13px; color:#6b7280; margin-bottom:16px;">
        Настройте условия доступа к заданиям и их длительность. Эти правила будут применяться
        к каждому экземпляру курса.
      </p>

      ${assignments.length > 0 ? `
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${assignments.map((a, index) => `
            <div style="padding:12px; background:#f9fafb; border-radius:8px; border:1px solid var(--color-border);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                <div style="font-weight:500; font-size:13px;">${a.order}. ${a.title}</div>
                <span class="tag" style="font-size:10px;">${a.deliveryMode === 'in_person' ? 'Очное' : 'Самостоятельное'}</span>
              </div>

              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px;">
                <div>
                  <label class="field-label" style="font-size:11px;">Длительность (дней)</label>
                  <input type="number" class="input" value="${a.durationDays || 7}" min="1"
                         style="width:100%; padding:6px 8px; font-size:12px;"
                         onchange="updateAssignmentSchedule('${a.id}', 'durationDays', this.value)">
                </div>
                <div>
                  <label class="field-label" style="font-size:11px;">Условие старта</label>
                  <select class="input" style="width:100%; padding:6px 8px; font-size:12px;"
                          onchange="updateAssignmentSchedule('${a.id}', 'startCondition', this.value)">
                    <option value="course_start" ${(a.startCondition || 'course_start') === 'course_start' ? 'selected' : ''}>
                      От старта курса
                    </option>
                    <option value="prev_complete" ${a.startCondition === 'prev_complete' ? 'selected' : ''}>
                      После завершения предыдущего
                    </option>
                    <option value="prev_assignment_submitted" ${a.startCondition === 'prev_assignment_submitted' ? 'selected' : ''}>
                      После сдачи предыдущего задания
                    </option>
                    <option value="manual" ${a.startCondition === 'manual' ? 'selected' : ''}>
                      Вручную преподавателем
                    </option>
                  </select>
                </div>
              </div>

              ${(a.startCondition || 'course_start') === 'course_start' ? `
                <div style="margin-top:8px;">
                  <label class="field-label" style="font-size:11px;">Дней от старта курса</label>
                  <input type="number" class="input" value="${a.startOffset || 0}" min="0"
                         style="width:120px; padding:6px 8px; font-size:12px;"
                         onchange="updateAssignmentSchedule('${a.id}', 'startOffset', this.value)">
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border);">
          <button class="btn btn-primary btn-sm" onclick="saveAssignmentSchedule('${template.id}')">
            Сохранить график
          </button>
        </div>
      ` : `
        <div style="text-align:center; padding:30px; color:#9ca3af;">
          <div style="font-size:24px; margin-bottom:8px;">📅</div>
          <div>Сначала добавьте задания в курс</div>
        </div>
      `}
    </div>
  `;

  // Course launch schedule tab content
  const launchContent = `
    <div class="card">
      <div style="font-weight:500; margin-bottom:16px;">График запуска курса</div>
      <p style="font-size:13px; color:#6b7280; margin-bottom:16px;">
        Настройте периодичность запуска новых экземпляров курса или укажите конкретные даты.
      </p>

      <div style="margin-bottom:16px;">
        <label class="field-label">Режим запуска</label>
        <select class="textarea" id="launchMode" style="min-height:auto; padding:8px;"
                onchange="toggleLaunchMode(this.value)">
          <option value="manual" ${(template.launchMode || 'manual') === 'manual' ? 'selected' : ''}>
            Вручную
          </option>
          <option value="periodic" ${template.launchMode === 'periodic' ? 'selected' : ''}>
            Периодически
          </option>
          <option value="dates" ${template.launchMode === 'dates' ? 'selected' : ''}>
            По датам
          </option>
        </select>
      </div>

      <div id="launchPeriodicSettings" style="display:${template.launchMode === 'periodic' ? 'block' : 'none'}; margin-bottom:16px;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <label class="field-label">Периодичность</label>
            <select class="input" id="launchPeriod" style="width:100%;">
              <option value="weekly" ${template.launchPeriod === 'weekly' ? 'selected' : ''}>Еженедельно</option>
              <option value="biweekly" ${template.launchPeriod === 'biweekly' ? 'selected' : ''}>Раз в 2 недели</option>
              <option value="monthly" ${(template.launchPeriod || 'monthly') === 'monthly' ? 'selected' : ''}>Ежемесячно</option>
              <option value="quarterly" ${template.launchPeriod === 'quarterly' ? 'selected' : ''}>Ежеквартально</option>
            </select>
          </div>
          <div>
            <label class="field-label">День недели / число</label>
            <select class="input" id="launchDay" style="width:100%;">
              <option value="1" ${(template.launchDay || '1') === '1' ? 'selected' : ''}>Понедельник / 1-е число</option>
              <option value="2" ${template.launchDay === '2' ? 'selected' : ''}>Вторник / 2-е число</option>
              <option value="3" ${template.launchDay === '3' ? 'selected' : ''}>Среда / 3-е число</option>
              <option value="4" ${template.launchDay === '4' ? 'selected' : ''}>Четверг / 4-е число</option>
              <option value="5" ${template.launchDay === '5' ? 'selected' : ''}>Пятница / 5-е число</option>
              <option value="15" ${template.launchDay === '15' ? 'selected' : ''}>15-е число</option>
            </select>
          </div>
        </div>
        <div style="margin-top:12px;">
          <label class="field-label">Дата до которой планировать *</label>
          <input type="date" class="input" id="planUntilDate" value="${template.planUntilDate || ''}" style="width:200px;" required>
          <div style="font-size:11px; color:#6b7280; margin-top:4px;">Обязательно для периодического запуска</div>
        </div>
        <div style="margin-top:12px;">
          <label class="field-label">Мин. студентов для запуска</label>
          <input type="number" class="input" id="minStudents" value="${template.minStudentsForLaunch || 5}" min="1" style="width:120px;">
        </div>
      </div>

      <div id="launchDatesSettings" style="display:${template.launchMode === 'dates' ? 'block' : 'none'}; margin-bottom:16px;">
        <label class="field-label">Запланированные даты запуска</label>
        <div id="launchDatesList" style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
          ${(template.launchDates || []).map((date, i) => `
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="date" class="input" value="${date}" style="flex:1;">
              <button class="btn btn-ghost btn-sm" onclick="removeLaunchDate(${i})">✕</button>
            </div>
          `).join('') || '<div style="color:#9ca3af; font-size:12px;">Нет запланированных дат</div>'}
        </div>
        <button class="btn btn-ghost btn-sm" onclick="addLaunchDate()">+ Добавить дату</button>
      </div>

      <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border); display:flex; gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="saveLaunchSchedule('${template.id}')">
          Сохранить график запуска
        </button>
        <button class="btn btn-ghost btn-sm" onclick="scheduleCourseLaunches('${template.id}')">
          📅 Запланировать по графику
        </button>
      </div>
    </div>
  `;

  // Course instances tab content
  const instancesContent = renderCourseInstancesTab(template);

  // Get content based on current tab
  let currentContent = infoContent;
  if (templateEditorTab === 'assignments') currentContent = assignmentsContent;
  else if (templateEditorTab === 'schedule') currentContent = scheduleContent;
  else if (templateEditorTab === 'launch') currentContent = launchContent;
  else if (templateEditorTab === 'instances') currentContent = instancesContent;

  return `
    <section>
      ${renderBreadcrumbs([
        { label: "Шаблоны курсов", action: "methodist-dashboard" },
        { label: template.title }
      ])}

      <header class="main-header">
        <div>
          <h1 class="main-title">${template.title}</h1>
          <div class="main-subtitle">${template.code} · ${Data.formatLevel(template.level)}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost" id="btnBackMethodist">← К списку</button>
          <button class="btn btn-primary" id="btnSaveTemplateChanges">Сохранить</button>
        </div>
      </header>

      <div class="layout-course" style="grid-template-columns: 1fr 280px; margin-top:16px;">
        <!-- Main content area - LEFT -->
        <div class="course-main">
          ${currentContent}
        </div>

        <!-- Navigation sidebar - RIGHT (like student view) -->
        <div class="course-sidebar" style="order:2;">
          <div class="course-sidebar-title">Разделы шаблона</div>
          <ul class="assignment-list">
            <li class="assignment-item ${templateEditorTab === 'info' ? 'active' : ''}"
                onclick="switchTemplateTab('info')"
                style="cursor:pointer;">
              <div class="assignment-item-title">📋 Общая информация</div>
            </li>
            <li class="assignment-item ${templateEditorTab === 'assignments' ? 'active' : ''}"
                onclick="switchTemplateTab('assignments')"
                style="cursor:pointer;">
              <div class="assignment-item-title">📝 Задания</div>
              <div class="assignment-item-meta">${assignments.length} шт.</div>
            </li>
            <li class="assignment-item ${templateEditorTab === 'schedule' ? 'active' : ''}"
                onclick="switchTemplateTab('schedule')"
                style="cursor:pointer;">
              <div class="assignment-item-title">📅 График заданий</div>
              <div class="assignment-item-meta">Условия и сроки</div>
            </li>
            <li class="assignment-item ${templateEditorTab === 'launch' ? 'active' : ''}"
                onclick="switchTemplateTab('launch')"
                style="cursor:pointer;">
              <div class="assignment-item-title">🚀 График запуска</div>
              <div class="assignment-item-meta">Периодичность</div>
            </li>
            <li class="assignment-item ${templateEditorTab === 'instances' ? 'active' : ''}"
                onclick="switchTemplateTab('instances')"
                style="cursor:pointer;">
              <div class="assignment-item-title">📊 Группы курса</div>
              <div class="assignment-item-meta">Экземпляры</div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

// Helper function to add video field
function addVideoField(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    const newInput = document.createElement('input');
    newInput.type = 'url';
    newInput.className = 'input';
    newInput.placeholder = 'Ссылка на YouTube/Vimeo';
    newInput.style.width = '100%';
    container.appendChild(newInput);
  }
}

function switchTemplateTab(tab) {
  templateEditorTab = tab;
  renderApp();
}

// Render course instances tab
function renderCourseInstancesTab(template) {
  const instances = Data.courseInstances.filter(ci => ci.courseTemplateId === template.id);

  // Filter instances by status
  const planned = instances.filter(ci => ci.status === 'planned');
  const active = instances.filter(ci => ci.status === 'active');
  const completed = instances.filter(ci => ci.status === 'completed' || ci.status === 'archived');

  return `
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <div style="font-weight:500; font-size:14px;">Группы курса</div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary btn-sm" onclick="showLaunchCourseModal('${template.id}')">
            🚀 Запустить курс
          </button>
          <button class="btn btn-ghost btn-sm" onclick="scheduleCourseLaunches('${template.id}')">
            📅 Запланировать по графику
          </button>
        </div>
      </div>

      <!-- Tab buttons -->
      <div class="tabs" style="display:flex; gap:8px; margin-bottom:16px; border-bottom:1px solid var(--color-border); padding-bottom:8px;">
        <button class="btn btn-sm active" data-tab="all" onclick="filterCourseInstances('all')" style="background:#dbeafe; color:#1e40af; border:none;">
          Все (${instances.length})
        </button>
        <button class="btn btn-sm" data-tab="planned" onclick="filterCourseInstances('planned')" style="border:1px solid var(--color-border);">
          Запланированные (${planned.length})
        </button>
        <button class="btn btn-sm" data-tab="active" onclick="filterCourseInstances('active')" style="border:1px solid var(--color-border);">
          Активные (${active.length})
        </button>
        <button class="btn btn-sm" data-tab="completed" onclick="filterCourseInstances('completed')" style="border:1px solid var(--color-border);">
          Завершенные (${completed.length})
        </button>
      </div>

      <!-- Course instances table -->
      <div id="instances-list">
        ${instances.length === 0 ? `
          <div style="text-align:center; padding:40px; color:#9ca3af; font-size:13px;">
            Нет созданных групп курса
          </div>
        ` : `
          <table class="course-instances-table" style="width:100%; border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:2px solid var(--color-border);">
                <th style="text-align:left; padding:12px 8px; font-weight:600; font-size:12px; color:#6b7280; min-width:180px;">Название группы</th>
                <th style="text-align:left; padding:12px 8px; font-weight:600; font-size:12px; color:#6b7280; width:150px;">Преподаватель</th>
                <th style="text-align:left; padding:12px 8px; font-weight:600; font-size:12px; color:#6b7280; width:180px;">Даты</th>
                <th style="text-align:center; padding:12px 8px; font-weight:600; font-size:12px; color:#6b7280; width:80px;">Студентов</th>
                <th style="text-align:center; padding:12px 8px; font-weight:600; font-size:12px; color:#6b7280; width:100px;">Статус</th>
              </tr>
            </thead>
            <tbody>
              ${instances.map(instance => {
                const teacher = Data.getUserById(instance.teacherId);
                const enrollments = Data.getEnrollmentsByCourse(instance.id);

                // Determine data-status for filtering
                let dataStatus = 'planned';
                if (instance.status === 'active') dataStatus = 'active';
                else if (instance.status === 'completed' || instance.status === 'archived') dataStatus = 'completed';

                return `
                  <tr data-status="${dataStatus}"
                      style="border-bottom:1px solid var(--color-border); cursor:pointer; transition:background 0.15s;"
                      onclick="viewCourseInstance('${instance.id}')"
                      onmouseover="this.style.background='#f9fafb'"
                      onmouseout="this.style.background=''">
                    <td style="padding:12px 8px;">
                      <div style="font-weight:500; font-size:13px;">${instance.cohort}</div>
                    </td>
                    <td style="padding:12px 8px;">
                      <div style="font-size:12px; color:#374151;">${teacher?.name || 'Не назначен'}</div>
                    </td>
                    <td style="padding:12px 8px;">
                      <div style="font-size:12px; color:#374151;">
                        ${Data.formatDate(instance.startDate)} – ${Data.formatDate(instance.endDate)}
                      </div>
                    </td>
                    <td style="text-align:center; padding:12px 8px;">
                      <span style="font-weight:500; font-size:13px;">${enrollments.length}</span>
                    </td>
                    <td style="text-align:center; padding:12px 8px;">
                      <span class="pill ${instance.status === 'active' ? 'status-accepted' : instance.status === 'planned' ? 'status-submitted' : 'status-draft'}">
                        ${Data.formatStatusLabel(instance.status)}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `}
      </div>
    </div>
  `;
}


function filterCourseInstances(status) {
  // Show/hide table rows based on status
  const rows = document.querySelectorAll('.course-instances-table tbody tr[data-status]');
  rows.forEach(row => {
    if (status === 'all' || row.dataset.status === status) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });

  // Update tab buttons
  const tabs = document.querySelectorAll('[data-tab]');
  tabs.forEach(tab => {
    if (tab.dataset.tab === status) {
      tab.classList.add('active');
      tab.style.background = '#dbeafe';
      tab.style.color = '#1e40af';
      tab.style.border = 'none';
    } else {
      tab.classList.remove('active');
      tab.style.background = '';
      tab.style.color = '';
      tab.style.border = '1px solid var(--color-border)';
    }
  });
}

function showLaunchCourseModal(templateId) {
  const template = Data.getCourseTemplate(templateId);
  const teachers = Object.values(Data.mockUsers).filter(u => u.role === 'teacher');

  const content = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div>
        <label class="field-label">Название группы (опционально)</label>
        <input type="text" id="launch-group-name" class="input" placeholder="Например: Группа 01-2025" style="width:100%;">
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label class="field-label">Дата начала *</label>
          <input type="date" id="launch-start-date" class="input" required style="width:100%;">
        </div>
        <div>
          <label class="field-label">Дата окончания *</label>
          <input type="date" id="launch-end-date" class="input" required style="width:100%;">
        </div>
      </div>

      <div>
        <label class="field-label">Преподаватель *</label>
        <select id="launch-teacher" class="input" required style="width:100%;">
          <option value="">Выберите преподавателя</option>
          ${teachers.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select>
      </div>
    </div>
  `;

  openModal('Запустить курс', content, [
    { label: 'Отмена', className: 'btn-ghost', onClick: 'closeModal()' },
    { label: 'Создать группу', className: 'btn-primary', onClick: `launchCourseInstance('${templateId}')` }
  ]);
}

function launchCourseInstance(templateId) {
  const groupName = document.getElementById('launch-group-name')?.value.trim();
  const startDate = document.getElementById('launch-start-date')?.value;
  const endDate = document.getElementById('launch-end-date')?.value;
  const teacherId = document.getElementById('launch-teacher')?.value;

  if (!startDate || !endDate || !teacherId) {
    alert('Заполните все обязательные поля');
    return;
  }

  if (new Date(startDate) >= new Date(endDate)) {
    alert('Дата окончания должна быть позже даты начала');
    return;
  }

  alert('Группа курса создана! (демо)');
  closeModal();
  renderApp();
}

function viewCourseInstance(instanceId) {
  // Switch to "progress" (Statistics) tab in teacher's course view
  teacherCourseTab = 'progress';
  navigateTo('teacherCourseDetail', instanceId);
}

// Expose Methodist functions to global scope
const Methodist = {
  changeTemplateStatus: function(templateId, newStatus) {
    const template = Data.getCourseTemplate(templateId);
    if (!template) return;

    template.status = newStatus;

    if (newStatus === 'published') {
      alert('Курс опубликован в каталоге! (демо)');
    } else if (newStatus === 'draft') {
      alert('Курс снят с публикации (демо)');
    }

    renderApp();
  },

  renderDashboard: function() {
    renderApp();
  }
};

// Legacy support
function changeTemplateStatus(action) {
  const template = Data.getCourseTemplate(state.currentCourseId);
  if (!template) return;

  if (action === 'publish') {
    Methodist.changeTemplateStatus(template.id, 'published');
  } else if (action === 'draft') {
    Methodist.changeTemplateStatus(template.id, 'draft');
  } else if (action === 'editing') {
    alert('Курс переведён в режим редактирования (демо)');
    renderApp();
  }
}

// Schedule helper functions
function updateAssignmentSchedule(assignmentId, field, value) {
  console.log(`Update ${assignmentId}: ${field} = ${value}`);
}

function saveAssignmentSchedule(templateId) {
  alert('График прохождения заданий сохранён! (демо)');
}

function toggleLaunchMode(mode) {
  const periodicSettings = document.getElementById('launchPeriodicSettings');
  const datesSettings = document.getElementById('launchDatesSettings');

  if (periodicSettings) periodicSettings.style.display = mode === 'periodic' ? 'block' : 'none';
  if (datesSettings) datesSettings.style.display = mode === 'dates' ? 'block' : 'none';
}

function addLaunchDate() {
  const list = document.getElementById('launchDatesList');
  if (list) {
    const today = new Date().toISOString().split('T')[0];
    const newItem = document.createElement('div');
    newItem.style.cssText = 'display:flex; align-items:center; gap:8px;';
    newItem.innerHTML = `
      <input type="date" class="input" value="${today}" style="flex:1;">
      <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">✕</button>
    `;
    list.appendChild(newItem);
  }
}

function removeLaunchDate(index) {
  alert('Дата удалена (демо)');
  renderApp();
}

function saveLaunchSchedule(templateId) {
  const template = Data.getCourseTemplate(templateId);
  if (!template) return;

  // Save launch mode
  const launchMode = document.getElementById('launchMode')?.value;
  if (launchMode) {
    template.launchMode = launchMode;
  }

  // Save periodic settings
  if (launchMode === 'periodic') {
    template.launchPeriod = document.getElementById('launchPeriod')?.value;
    template.launchDay = document.getElementById('launchDay')?.value;
    template.planUntilDate = document.getElementById('planUntilDate')?.value;
    template.minStudentsForLaunch = document.getElementById('minStudents')?.value;
  }

  // Save dates settings
  if (launchMode === 'dates') {
    const dateInputs = document.querySelectorAll('#launchDatesList input[type="date"]');
    template.launchDates = Array.from(dateInputs).map(input => input.value).filter(v => v);
  }

  alert('График запуска курса сохранён! (демо)');
}

function scheduleCourseLaunches(courseTemplateId) {
  const template = Data.getCourseTemplate(courseTemplateId);
  if (!template) {
    alert('Шаблон курса не найден');
    return;
  }

  const launchMode = template.launchMode || 'manual';

  if (launchMode === 'manual') {
    alert('График запуска не настроен. Пожалуйста, настройте график в разделе "График запуска".');
    return;
  }

  let scheduledGroups = [];

  if (launchMode === 'periodic') {
    // Check if planUntilDate is set
    if (!template.planUntilDate) {
      alert('Необходимо указать дату, до которой планировать запуск групп (поле "Дата до которой планировать")');
      return;
    }

    const period = template.launchPeriod || 'monthly';
    const startDay = parseInt(template.launchDay || '1');
    const planUntilDate = new Date(template.planUntilDate);
    const today = new Date();

    // Calculate course duration (default 3 months)
    const courseDurationMonths = 3;

    // Generate launch dates
    let currentDate = new Date(today);

    // Set to next occurrence based on period
    if (period === 'weekly') {
      // startDay is day of week (1=Monday, 2=Tuesday, etc.)
      const daysUntilNext = (startDay - currentDate.getDay() + 7) % 7;
      currentDate.setDate(currentDate.getDate() + daysUntilNext);
    } else if (period === 'biweekly') {
      const daysUntilNext = (startDay - currentDate.getDay() + 7) % 7;
      currentDate.setDate(currentDate.getDate() + daysUntilNext);
    } else if (period === 'monthly') {
      // startDay is day of month
      currentDate.setDate(startDay);
      if (currentDate < today) {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    } else if (period === 'quarterly') {
      // Set to next quarter
      const currentMonth = currentDate.getMonth();
      const nextQuarterMonth = Math.ceil((currentMonth + 1) / 3) * 3;
      currentDate.setMonth(nextQuarterMonth);
      currentDate.setDate(startDay);
    }

    // Generate groups until planUntilDate
    while (currentDate <= planUntilDate) {
      const startDate = new Date(currentDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + courseDurationMonths);

      const groupName = `Группа ${startDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

      scheduledGroups.push({
        name: groupName,
        startDate: startDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        endDate: endDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
      });

      // Move to next period
      if (period === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (period === 'biweekly') {
        currentDate.setDate(currentDate.getDate() + 14);
      } else if (period === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (period === 'quarterly') {
        currentDate.setMonth(currentDate.getMonth() + 3);
      }
    }

  } else if (launchMode === 'dates') {
    // Create groups for specific dates
    if (!template.launchDates || template.launchDates.length === 0) {
      alert('Не указаны даты запуска. Добавьте даты в разделе "График запуска".');
      return;
    }

    const courseDurationMonths = 3;

    template.launchDates.forEach(dateStr => {
      const startDate = new Date(dateStr);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + courseDurationMonths);

      const groupName = `Группа ${startDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

      scheduledGroups.push({
        name: groupName,
        startDate: startDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        endDate: endDate.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    });
  }

  // Show result modal
  if (scheduledGroups.length === 0) {
    alert('Не удалось создать запланированные группы. Проверьте настройки графика запуска.');
    return;
  }

  const groupListHtml = scheduledGroups.map(g =>
    `<li style="padding:4px 0; font-size:13px;">${g.name} - ${g.startDate} – ${g.endDate}</li>`
  ).join('');

  const content = `
    <div style="text-align:center;">
      <div style="font-size:48px; margin-bottom:16px;">✅</div>
      <p style="font-size:14px; margin-bottom:16px;">
        Создано запланированных групп: <strong style="font-size:18px; color:var(--color-primary);">${scheduledGroups.length}</strong>
      </p>
      <div style="text-align:left; max-height:300px; overflow-y:auto; margin-top:16px; padding:12px; background:#f9fafb; border-radius:8px;">
        <div style="font-weight:500; margin-bottom:8px; font-size:13px;">Запланированные группы:</div>
        <ul style="margin:0; padding-left:20px;">
          ${groupListHtml}
        </ul>
      </div>
    </div>
  `;

  openModal('Группы запланированы', content, [
    { label: 'Закрыть', className: 'btn-primary', onClick: 'closeModal()' }
  ]);
}

function showAddAssignmentModal(templateId) {
  const template = Data.getCourseTemplate(templateId);
  const existingAssignments = Data.getAssignmentTemplatesForCourse(templateId);
  const nextOrder = existingAssignments.length + 1;

  const content = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div>
        <label class="field-label">Название задания *</label>
        <input type="text" id="new-assignment-title" class="input" placeholder="Введите название" style="width:100%;">
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label class="field-label">Тип контента</label>
          <select id="new-assignment-type" class="input" style="width:100%;">
            <option value="practical">Практическое</option>
            <option value="lecture">Лекция</option>
            <option value="lab">Лабораторная</option>
            <option value="test">Тест</option>
            <option value="essay">Эссе</option>
          </select>
        </div>
        <div>
          <label class="field-label">Формат проведения</label>
          <select id="new-assignment-delivery" class="input" style="width:100%;">
            <option value="self_study">Самостоятельное</option>
            <option value="in_person">Очное</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label class="field-label">Порядковый номер</label>
          <input type="number" id="new-assignment-order" class="input" value="${nextOrder}" min="1" style="width:100%;">
        </div>
        <div>
          <label class="field-label">Обязательное</label>
          <select id="new-assignment-mandatory" class="input" style="width:100%;">
            <option value="true">Да</option>
            <option value="false">Нет</option>
          </select>
        </div>
      </div>

      <div>
        <label class="field-label">Краткое описание</label>
        <textarea id="new-assignment-desc" class="textarea" placeholder="Краткое описание для карточек предпросмотра" style="min-height:60px;"></textarea>
      </div>

      <div>
        <label class="field-label">Подробная инструкция</label>
        <textarea id="new-assignment-detailed" class="textarea" placeholder="Полная инструкция с шагами выполнения (можно использовать HTML)" style="min-height:120px;"></textarea>
      </div>

      <div>
        <label class="field-label">Видео для просмотра</label>
        <div id="new-video-list" style="display:flex; flex-direction:column; gap:8px; margin-bottom:8px;">
          <input type="url" class="input" placeholder="Ссылка на YouTube/Vimeo" style="width:100%;">
        </div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="addVideoField('new-video-list')">+ Добавить ещё видео</button>
      </div>

      <div>
        <label class="field-label">Файлы инструкции</label>
        <input type="file" id="new-instruction-files" multiple class="input" style="width:100%;">
        <div style="font-size:11px; color:#6b7280; margin-top:4px;">Можно выбрать несколько файлов</div>
      </div>

      <div>
        <label class="field-label">Макс. баллов</label>
        <input type="number" id="new-assignment-score" class="input" value="10" min="1" style="width:100%;">
      </div>
    </div>
  `;

  openModal('Добавить задание', content, [
    { label: 'Отмена', className: 'btn-ghost', onClick: 'closeModal()' },
    { label: 'Добавить', className: 'btn-primary', onClick: `createAssignment('${templateId}')` }
  ]);
}

function createAssignment(templateId) {
  const title = document.getElementById('new-assignment-title')?.value?.trim();
  if (!title) {
    alert('Укажите название задания');
    return;
  }

  alert('Задание добавлено! (демо)');
  closeModal();
  renderApp();
}

function showEditAssignmentModal(assignmentId) {
  const assignment = Data.getAssignmentTemplate(assignmentId);
  if (!assignment) return;

  const content = `
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div>
        <label class="field-label">Название задания *</label>
        <input type="text" id="edit-assignment-title" class="input" value="${assignment.title}" style="width:100%;">
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label class="field-label">Тип контента</label>
          <select id="edit-assignment-type" class="input" style="width:100%;">
            <option value="practical" ${assignment.type === 'practical' ? 'selected' : ''}>Практическое</option>
            <option value="lecture" ${assignment.type === 'lecture' ? 'selected' : ''}>Лекция</option>
            <option value="lab" ${assignment.type === 'lab' ? 'selected' : ''}>Лабораторная</option>
            <option value="test" ${assignment.type === 'test' ? 'selected' : ''}>Тест</option>
            <option value="essay" ${assignment.type === 'essay' ? 'selected' : ''}>Эссе</option>
          </select>
        </div>
        <div>
          <label class="field-label">Формат проведения</label>
          <select id="edit-assignment-delivery" class="input" style="width:100%;">
            <option value="self_study" ${(assignment.deliveryMode || 'self_study') === 'self_study' ? 'selected' : ''}>Самостоятельное</option>
            <option value="in_person" ${assignment.deliveryMode === 'in_person' ? 'selected' : ''}>Очное</option>
          </select>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label class="field-label">Порядковый номер</label>
          <input type="number" id="edit-assignment-order" class="input" value="${assignment.order}" min="1" style="width:100%;">
        </div>
        <div>
          <label class="field-label">Обязательное</label>
          <select id="edit-assignment-mandatory" class="input" style="width:100%;">
            <option value="true" ${assignment.isMandatory ? 'selected' : ''}>Да</option>
            <option value="false" ${!assignment.isMandatory ? 'selected' : ''}>Нет</option>
          </select>
        </div>
      </div>

      <div>
        <label class="field-label">Краткое описание</label>
        <textarea id="edit-assignment-desc" class="textarea" placeholder="Краткое описание для карточек" style="min-height:60px;">${assignment.short_description || assignment.description || ''}</textarea>
      </div>

      <div>
        <label class="field-label">Подробная инструкция</label>
        <textarea id="edit-assignment-detailed" class="textarea" placeholder="Полная инструкция (можно использовать HTML)" style="min-height:120px;">${assignment.detailed_instruction || ''}</textarea>
      </div>

      <div>
        <label class="field-label">Видео для просмотра</label>
        <div id="edit-video-list" style="display:flex; flex-direction:column; gap:8px; margin-bottom:8px;">
          ${(assignment.instruction_videos || []).length > 0 ?
            assignment.instruction_videos.map(url => `<input type="url" class="input" value="${url}" style="width:100%;">`).join('') :
            '<input type="url" class="input" placeholder="Ссылка на YouTube/Vimeo" style="width:100%;">'
          }
        </div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="addVideoField('edit-video-list')">+ Добавить ещё видео</button>
      </div>

      <div>
        <label class="field-label">Файлы инструкции</label>
        <input type="file" id="edit-instruction-files" multiple class="input" style="width:100%;">
        ${(assignment.instruction_files || []).length > 0 ? `
          <div style="font-size:11px; color:#6b7280; margin-top:8px;">
            Текущие файлы: ${assignment.instruction_files.map(f => f.name).join(', ')}
          </div>
        ` : ''}
      </div>

      <div>
        <label class="field-label">Макс. баллов</label>
        <input type="number" id="edit-assignment-score" class="input" value="${assignment.maxScore}" min="1" style="width:100%;">
      </div>

      ${assignment.materials?.length > 0 ? `
        <div>
          <label class="field-label">Материалы</label>
          <div style="font-size:12px; color:#6b7280;">
            ${assignment.materials.map(m => `📎 ${m.title}`).join('<br>')}
          </div>
        </div>
      ` : ''}
    </div>

    <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border); display:flex; justify-content:space-between;">
      <button class="btn btn-danger btn-sm" onclick="deleteAssignment('${assignmentId}')">
        Удалить задание
      </button>
    </div>
  `;

  openModal(`Редактирование: ${assignment.title}`, content, [
    { label: 'Отмена', className: 'btn-ghost', onClick: 'closeModal()' },
    { label: 'Сохранить', className: 'btn-primary', onClick: `saveAssignment('${assignmentId}')` }
  ]);
}

function saveAssignment(assignmentId) {
  alert('Изменения сохранены! (демо)');
  closeModal();
}

function deleteAssignment(assignmentId) {
  if (confirm('Удалить это задание?')) {
    alert('Задание удалено! (демо)');
    closeModal();
    renderApp();
  }
}
