// B3 Learning Portal - Part 2: Methodist & Admin Screens
// This file extends the LMS prototype with Methodist and Admin functionality
// Depends on: data.js (LMSData global), app.js (state, modal system, breadcrumbs)

// Using global LMSData and state from app.js
const Data = window.LMSData;

// ============================================================================
// METHODIST SCREENS (Course Designer)
// ============================================================================

/**
 * Methodist Dashboard
 * Shows: My course templates list, stats, "Create template" button
 */
function renderMethodistDashboard() {
  const user = getCurrentUser();

  // Get templates created by this methodist
  const myTemplates = Data.courseTemplates.filter(t => t.createdBy === user.id);

  // Calculate stats
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
          <span class="badge badge-status">${template.isPublic ? 'Опубликован' : 'Черновик'}</span>
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

  mainEl.innerHTML = `
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

  // Event handlers
  document.getElementById("btnCreateTemplate")?.addEventListener("click", () => {
    openCreateTemplateModal();
  });

  mainEl.querySelectorAll("[data-edit-template]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.currentCourseId = btn.dataset.editTemplate;
      state.currentView = "template-editor";
      renderApp();
    });
  });

  mainEl.querySelectorAll("[data-preview-template]").forEach(btn => {
    btn.addEventListener("click", () => {
      const templateId = btn.dataset.previewTemplate;
      const template = Data.getCourseTemplate(templateId);
      alert(`Предпросмотр курса "${template.title}"\n\nВ реальной системе B3 здесь откроется режим предпросмотра интерфейса студента.`);
    });
  });
}

/**
 * Modal for creating new course template
 */
function openCreateTemplateModal() {
  openModal("Создать шаблон курса", `
    <div class="field-label">Название курса *</div>
    <input type="text" class="textarea" id="templateTitle" placeholder="Например: Основы платформы B3" style="min-height:auto;padding:8px;">

    <div class="field-label">Код курса *</div>
    <input type="text" class="textarea" id="templateCode" placeholder="Например: B3-BASIC-101" style="min-height:auto;padding:8px;">

    <div class="field-label">Уровень *</div>
    <select class="textarea" id="templateLevel" style="min-height:auto;padding:8px;">
      <option value="basic">Базовый</option>
      <option value="intermediate">Средний</option>
      <option value="advanced">Продвинутый</option>
    </select>

    <div class="field-label">Категория</div>
    <input type="text" class="textarea" id="templateCategory" placeholder="Например: Разработка" style="min-height:auto;padding:8px;">

    <div class="field-label">Описание</div>
    <textarea class="textarea" id="templateDescription" placeholder="Краткое описание курса..."></textarea>

    <div class="field-label">Порог для сертификата (%)</div>
    <input type="number" class="textarea" id="templateThreshold" value="70" min="0" max="100" style="min-height:auto;padding:8px;">
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
    <button class="btn btn-primary" id="btnSaveTemplate">Создать</button>
  `);

  document.getElementById("btnSaveTemplate")?.addEventListener("click", () => {
    const title = document.getElementById("templateTitle").value;
    const code = document.getElementById("templateCode").value;
    const level = document.getElementById("templateLevel").value;
    const category = document.getElementById("templateCategory").value;
    const description = document.getElementById("templateDescription").value;
    const threshold = parseInt(document.getElementById("templateThreshold").value) || 70;

    if (!title || !code) {
      alert("Заполните обязательные поля: название и код курса");
      return;
    }

    // In real B3 system, this would create a new record
    const newTemplate = {
      id: `tpl-${Date.now()}`,
      title,
      code,
      level,
      category,
      description,
      targetAudience: "",
      prerequisites: "",
      isPublic: false,
      certificateThreshold: threshold,
      estimatedHours: 0,
      requiresSandbox: false,
      createdBy: getCurrentUser().id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    Data.courseTemplates.push(newTemplate);

    alert(`Шаблон курса "${title}" создан!`);
    closeModal();
    renderMethodistDashboard();
  });
}

/**
 * Course Template Editor
 * Edit template properties, manage assignment templates
 */
function renderTemplateEditor() {
  const template = Data.getCourseTemplate(state.currentCourseId);
  if (!template) return renderMethodistDashboard();

  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  const assignmentsHtml = assignments.map(a => {
    return `
      <div class="card" style="padding:12px;">
        <div class="card-header-line">
          <div>
            <div class="card-title">${a.order}. ${a.title}</div>
            <div class="card-meta">
              ${Data.formatAssignmentType(a.type)} ·
              ${a.isMandatory ? 'Обязательное' : 'Опциональное'} ·
              Макс. балл: ${a.maxScore}
            </div>
          </div>
          <div style="display:flex;gap:4px;">
            <button class="btn btn-ghost btn-sm" data-edit-assignment="${a.id}">Редактировать</button>
            <button class="btn btn-danger btn-sm" data-delete-assignment="${a.id}">Удалить</button>
          </div>
        </div>
        <div class="card-meta" style="margin-top:4px;">${a.description}</div>
        ${a.dueDays ? `<div class="card-meta">Срок выполнения: ${a.dueDays} дней</div>` : ''}
      </div>
    `;
  }).join("");

  mainEl.innerHTML = `
    <section>
      ${renderBreadcrumbs([
        { label: "Методист", action: "methodist-dashboard" },
        { label: template.title }
      ])}

      <header class="main-header">
        <div>
          <h1 class="main-title">${template.title}</h1>
          <div class="main-subtitle">${template.code} · ${Data.formatLevel(template.level)}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost" id="btnBackMethodist">К списку</button>
          <button class="btn btn-primary" id="btnSaveTemplateChanges">Сохранить изменения</button>
        </div>
      </header>

      <section style="margin-bottom:20px;">
        <h2 style="font-size:14px;margin:6px 0 8px;">Свойства курса</h2>
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

          <div class="field-label">Целевая аудитория</div>
          <textarea class="textarea" id="editAudience">${template.targetAudience || ''}</textarea>

          <div class="field-label">Предварительные требования</div>
          <textarea class="textarea" id="editPrerequisites">${template.prerequisites || ''}</textarea>

          <div class="field-label">Порог для сертификата (%)</div>
          <input type="number" class="textarea" id="editThreshold" value="${template.certificateThreshold}" min="0" max="100" style="min-height:auto;padding:8px;">

          <div class="field-label">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="editPublic" ${template.isPublic ? 'checked' : ''}>
              <span>Опубликовать в каталоге (видно всем пользователям)</span>
            </label>
          </div>

          <div class="field-label">
            <label style="display:flex;align-items:center;gap:8px;">
              <input type="checkbox" id="editSandbox" ${template.requiresSandbox ? 'checked' : ''}>
              <span>Требуется лабораторный стенд (sandbox)</span>
            </label>
          </div>
        </div>
      </section>

      <section>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h2 style="font-size:14px;margin:0;">Задания курса (${assignments.length})</h2>
          <button class="btn btn-primary btn-sm" id="btnAddAssignment">Добавить задание</button>
        </div>
        ${assignmentsHtml || '<div class="main-subtitle">Нет заданий. Добавьте первое задание курса.</div>'}
      </section>
    </section>
  `;

  // Event handlers
  document.getElementById("btnBackMethodist")?.addEventListener("click", () => {
    state.currentView = "methodist-dashboard";
    state.currentCourseId = null;
    renderApp();
  });

  document.getElementById("btnSaveTemplateChanges")?.addEventListener("click", () => {
    template.title = document.getElementById("editTitle").value;
    template.code = document.getElementById("editCode").value;
    template.level = document.getElementById("editLevel").value;
    template.category = document.getElementById("editCategory").value;
    template.description = document.getElementById("editDescription").value;
    template.targetAudience = document.getElementById("editAudience").value;
    template.prerequisites = document.getElementById("editPrerequisites").value;
    template.certificateThreshold = parseInt(document.getElementById("editThreshold").value) || 70;
    template.isPublic = document.getElementById("editPublic").checked;
    template.requiresSandbox = document.getElementById("editSandbox").checked;
    template.updatedAt = new Date().toISOString();

    alert("Изменения сохранены!");
    renderTemplateEditor();
  });

  document.getElementById("btnAddAssignment")?.addEventListener("click", () => {
    openAssignmentTemplateModal(template.id, null);
  });

  mainEl.querySelectorAll("[data-edit-assignment]").forEach(btn => {
    btn.addEventListener("click", () => {
      const assignmentId = btn.dataset.editAssignment;
      openAssignmentTemplateModal(template.id, assignmentId);
    });
  });

  mainEl.querySelectorAll("[data-delete-assignment]").forEach(btn => {
    btn.addEventListener("click", () => {
      const assignmentId = btn.dataset.deleteAssignment;
      const assignment = Data.getAssignmentTemplate(assignmentId);

      if (confirm(`Удалить задание "${assignment.title}"?`)) {
        const index = Data.assignmentTemplates.findIndex(a => a.id === assignmentId);
        if (index >= 0) {
          Data.assignmentTemplates.splice(index, 1);
          alert("Задание удалено");
          renderTemplateEditor();
        }
      }
    });
  });

  // Breadcrumb navigation
  mainEl.querySelectorAll("[data-action]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = link.dataset.action;
      if (action === "methodist-dashboard") {
        state.currentView = "methodist-dashboard";
        state.currentCourseId = null;
        renderApp();
      }
    });
  });
}

/**
 * Modal for creating/editing assignment template
 */
function openAssignmentTemplateModal(courseTemplateId, assignmentId) {
  const isEdit = !!assignmentId;
  const assignment = isEdit ? Data.getAssignmentTemplate(assignmentId) : null;
  const assignments = Data.getAssignmentTemplatesForCourse(courseTemplateId);
  const nextOrder = isEdit ? assignment.order : (Math.max(0, ...assignments.map(a => a.order)) + 1);

  openModal(isEdit ? "Редактировать задание" : "Добавить задание", `
    <div class="field-label">Название задания *</div>
    <input type="text" class="textarea" id="assignmentTitle" value="${assignment?.title || ''}"
           placeholder="Например: Создание первого справочника" style="min-height:auto;padding:8px;">

    <div class="field-label">Тип задания *</div>
    <select class="textarea" id="assignmentType" style="min-height:auto;padding:8px;">
      <option value="lecture" ${assignment?.type === 'lecture' ? 'selected' : ''}>Лекция</option>
      <option value="lab" ${assignment?.type === 'lab' ? 'selected' : ''}>Практика</option>
      <option value="project" ${assignment?.type === 'project' ? 'selected' : ''}>Проект</option>
      <option value="test" ${assignment?.type === 'test' ? 'selected' : ''}>Тест</option>
      <option value="quiz" ${assignment?.type === 'quiz' ? 'selected' : ''}>Квиз</option>
    </select>

    <div class="field-label">Модуль/Раздел</div>
    <input type="text" class="textarea" id="assignmentModule" value="${assignment?.module || ''}"
           placeholder="Например: Основы объектной модели" style="min-height:auto;padding:8px;">

    <div class="field-label">Порядковый номер</div>
    <input type="number" class="textarea" id="assignmentOrder" value="${nextOrder}" min="1"
           style="min-height:auto;padding:8px;">

    <div class="field-label">Описание</div>
    <textarea class="textarea" id="assignmentDescription"
              placeholder="Что должен сделать студент...">${assignment?.description || ''}</textarea>

    <div class="field-label">Максимальный балл</div>
    <input type="number" class="textarea" id="assignmentMaxScore" value="${assignment?.maxScore || 100}"
           min="0" style="min-height:auto;padding:8px;">

    <div class="field-label">Срок выполнения (дней от начала курса)</div>
    <input type="number" class="textarea" id="assignmentDueDays" value="${assignment?.dueDays || ''}"
           min="0" placeholder="Оставьте пустым, если нет дедлайна" style="min-height:auto;padding:8px;">

    <div class="field-label">Тип сдачи работы</div>
    <div style="display:flex;flex-direction:column;gap:4px;margin-top:4px;">
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" class="submission-type-check" value="text"
               ${assignment?.submissionType?.includes('text') ? 'checked' : ''}>
        <span>Текстовый ответ</span>
      </label>
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" class="submission-type-check" value="file"
               ${assignment?.submissionType?.includes('file') ? 'checked' : ''}>
        <span>Загрузка файлов</span>
      </label>
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" class="submission-type-check" value="link"
               ${assignment?.submissionType?.includes('link') ? 'checked' : ''}>
        <span>Ссылка на стенд/результат</span>
      </label>
    </div>

    <div class="field-label">
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="assignmentMandatory" ${assignment?.isMandatory ? 'checked' : ''}>
        <span>Обязательное задание (учитывается в прогрессе)</span>
      </label>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
    <button class="btn btn-primary" id="btnSaveAssignment">${isEdit ? 'Сохранить' : 'Создать'}</button>
  `);

  document.getElementById("btnSaveAssignment")?.addEventListener("click", () => {
    const title = document.getElementById("assignmentTitle").value;
    const type = document.getElementById("assignmentType").value;
    const module = document.getElementById("assignmentModule").value;
    const order = parseInt(document.getElementById("assignmentOrder").value) || 1;
    const description = document.getElementById("assignmentDescription").value;
    const maxScore = parseInt(document.getElementById("assignmentMaxScore").value) || 100;
    const dueDays = parseInt(document.getElementById("assignmentDueDays").value) || null;
    const isMandatory = document.getElementById("assignmentMandatory").checked;

    // Get selected submission types
    const submissionTypes = Array.from(document.querySelectorAll(".submission-type-check:checked"))
      .map(cb => cb.value);

    if (!title) {
      alert("Укажите название задания");
      return;
    }

    if (isEdit) {
      // Update existing
      assignment.title = title;
      assignment.type = type;
      assignment.module = module;
      assignment.order = order;
      assignment.description = description;
      assignment.maxScore = maxScore;
      assignment.dueDays = dueDays;
      assignment.isMandatory = isMandatory;
      assignment.submissionType = submissionTypes;

      alert("Задание обновлено!");
    } else {
      // Create new
      const newAssignment = {
        id: `a-${Date.now()}`,
        courseTemplateId,
        title,
        type,
        module,
        order,
        description,
        materials: [],
        maxScore,
        dueDays,
        isMandatory,
        submissionType: submissionTypes,
        autoGrade: false
      };

      Data.assignmentTemplates.push(newAssignment);
      alert("Задание создано!");
    }

    closeModal();
    renderTemplateEditor();
  });
}

// ============================================================================
// ADMIN SCREENS (System Manager)
// ============================================================================

/**
 * Admin Dashboard
 * Stats, quick actions, enrollment requests preview
 */
function renderAdminDashboard() {
  const user = getCurrentUser();

  const pendingRequests = Data.getPendingRequests();
  const totalCourses = Data.courseTemplates.length;
  const totalInstances = Data.courseInstances.length;
  const totalStudents = Object.values(Data.mockUsers).filter(u => u.role === 'student').length;
  const activeEnrollments = Data.enrollments.filter(e => e.status === 'in_progress').length;

  const statsHtml = `
    <div class="cards-grid">
      <div class="card">
        <div class="card-title">Шаблонов курсов</div>
        <div style="font-size:32px;font-weight:600;">${totalCourses}</div>
      </div>
      <div class="card">
        <div class="card-title">Экземпляров курсов</div>
        <div style="font-size:32px;font-weight:600;">${totalInstances}</div>
      </div>
      <div class="card">
        <div class="card-title">Всего студентов</div>
        <div style="font-size:32px;font-weight:600;">${totalStudents}</div>
      </div>
      <div class="card">
        <div class="card-title">Активных записей</div>
        <div style="font-size:32px;font-weight:600;">${activeEnrollments}</div>
      </div>
      <div class="card">
        <div class="card-title">Заявок на рассмотрении</div>
        <div style="font-size:32px;font-weight:600;color:${pendingRequests.length > 0 ? '#f97316' : 'inherit'};">
          ${pendingRequests.length}
        </div>
      </div>
    </div>
  `;

  const recentRequestsHtml = pendingRequests.slice(0, 3).map(req => {
    const user = Data.getUserById(req.userId);
    const instance = Data.getCourseInstance(req.courseInstanceId);
    const template = instance ? Data.getCourseTemplate(instance.courseTemplateId) : null;

    return `
      <div class="card" style="padding:12px;">
        <div class="card-header-line">
          <div>
            <div class="card-title">${user?.name || 'Неизвестный'}</div>
            <div class="card-meta">Курс: ${template?.title || 'Неизвестный'} · ${Data.formatDateTime(req.createdAt)}</div>
          </div>
          <span class="pill status-pending">Ожидает</span>
        </div>
        ${req.comment ? `<div class="card-meta" style="margin-top:4px;">«${req.comment}»</div>` : ''}
      </div>
    `;
  }).join("") || '<div class="main-subtitle">Нет заявок на рассмотрении</div>';

  mainEl.innerHTML = `
    <section>
      <header class="main-header">
        <div>
          <h1 class="main-title">Панель администратора</h1>
          <div class="main-subtitle">Управление порталом обучения B3</div>
        </div>
      </header>

      <section style="margin-bottom:20px;">
        <h2 style="font-size:14px;margin:6px 0 8px;">Статистика</h2>
        ${statsHtml}
      </section>

      <section style="margin-bottom:20px;">
        <h2 style="font-size:14px;margin:6px 0 8px;">Быстрые действия</h2>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn" id="btnViewRequests">Заявки на запись (${pendingRequests.length})</button>
          <button class="btn btn-ghost" id="btnManageInstances">Экземпляры курсов</button>
          <button class="btn btn-ghost" id="btnManageUsers">Управление пользователями</button>
          <button class="btn btn-ghost" id="btnViewReports">Отчёты</button>
        </div>
      </section>

      <section>
        <h2 style="font-size:14px;margin:6px 0 8px;">Последние заявки</h2>
        ${recentRequestsHtml}
        ${pendingRequests.length > 3 ? `
          <div style="margin-top:8px;">
            <button class="btn btn-ghost btn-sm" id="btnViewAllRequests">Показать все заявки</button>
          </div>
        ` : ''}
      </section>
    </section>
  `;

  // Event handlers
  document.getElementById("btnViewRequests")?.addEventListener("click", () => {
    state.currentView = "admin-requests";
    renderApp();
  });

  document.getElementById("btnViewAllRequests")?.addEventListener("click", () => {
    state.currentView = "admin-requests";
    renderApp();
  });

  document.getElementById("btnManageInstances")?.addEventListener("click", () => {
    state.currentView = "admin-instances";
    renderApp();
  });

  document.getElementById("btnManageUsers")?.addEventListener("click", () => {
    state.currentView = "admin-users";
    renderApp();
  });

  document.getElementById("btnViewReports")?.addEventListener("click", () => {
    state.currentView = "admin-reports";
    renderApp();
  });
}

/**
 * Enrollment Requests Management
 * Table of requests with approve/reject actions
 */
function renderEnrollmentRequests() {
  const allRequests = Data.getAllRequests();

  const requestsHtml = allRequests.map(req => {
    const user = Data.getUserById(req.userId);
    const instance = Data.getCourseInstance(req.courseInstanceId);
    const template = instance ? Data.getCourseTemplate(instance.courseTemplateId) : null;
    const reviewer = req.reviewedBy ? Data.getUserById(req.reviewedBy) : null;

    const statusClass = req.status === 'approved' ? 'status-accepted' :
                       req.status === 'rejected' ? 'status-needs_revision' :
                       'status-pending';

    return `
      <div class="card" style="padding:12px;">
        <div class="card-header-line">
          <div>
            <div class="card-title">${user?.name || 'Неизвестный'}</div>
            <div class="card-meta">
              ${user?.organization || 'Без организации'} ·
              ${user?.position || 'Без должности'}
            </div>
          </div>
          <span class="pill ${statusClass}">${Data.formatRequestStatusLabel(req.status)}</span>
        </div>

        <div class="card-meta" style="margin-top:8px;">
          <strong>Курс:</strong> ${template?.title || 'Неизвестный'} (${template?.code || ''})
        </div>

        <div class="card-meta">
          <strong>Поток:</strong> ${instance?.cohort || 'Не указан'} ·
          Дата заявки: ${Data.formatDateTime(req.createdAt)}
        </div>

        ${req.comment ? `
          <div class="card-meta" style="margin-top:4px;">
            <strong>Комментарий:</strong> «${req.comment}»
          </div>
        ` : ''}

        ${req.reviewedBy ? `
          <div class="card-meta" style="margin-top:8px;padding-top:8px;border-top:1px solid #e5e7eb;">
            <strong>Рассмотрел:</strong> ${reviewer?.name || 'Неизвестный'} ·
            ${Data.formatDateTime(req.reviewedAt)}
            ${req.reviewComment ? `<br><strong>Комментарий:</strong> ${req.reviewComment}` : ''}
          </div>
        ` : ''}

        ${req.status === 'pending' ? `
          <div class="card-header-line" style="margin-top:8px;">
            <button class="btn btn-primary btn-sm" data-approve="${req.id}">Одобрить</button>
            <button class="btn btn-danger btn-sm" data-reject="${req.id}">Отклонить</button>
          </div>
        ` : ''}
      </div>
    `;
  }).join("") || '<div class="main-subtitle">Нет заявок</div>';

  mainEl.innerHTML = `
    <section>
      ${renderBreadcrumbs([
        { label: "Администратор", action: "admin-dashboard" },
        { label: "Заявки на запись" }
      ])}

      <header class="main-header">
        <div>
          <h1 class="main-title">Заявки на запись</h1>
          <div class="main-subtitle">Всего заявок: ${allRequests.length}</div>
        </div>
        <button class="btn btn-ghost" id="btnBackAdmin">К панели</button>
      </header>

      <section>
        ${requestsHtml}
      </section>
    </section>
  `;

  // Event handlers
  document.getElementById("btnBackAdmin")?.addEventListener("click", () => {
    state.currentView = "admin-dashboard";
    renderApp();
  });

  mainEl.querySelectorAll("[data-approve]").forEach(btn => {
    btn.addEventListener("click", () => {
      const requestId = btn.dataset.approve;
      const request = Data.enrollmentRequests.find(r => r.id === requestId);

      openModal("Одобрить заявку", `
        <div class="field-label">Комментарий для студента (опционально)</div>
        <textarea class="textarea" id="approveComment" placeholder="Заявка одобрена. Добро пожаловать на курс!"></textarea>
      `, `
        <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
        <button class="btn btn-primary" id="btnConfirmApprove">Одобрить</button>
      `);

      document.getElementById("btnConfirmApprove")?.addEventListener("click", () => {
        const comment = document.getElementById("approveComment").value;
        const success = Data.approveRequest(requestId, getCurrentUser().id, comment);

        if (success) {
          alert("Заявка одобрена! Студент записан на курс.");
          closeModal();
          renderEnrollmentRequests();
        } else {
          alert("Ошибка при одобрении заявки");
        }
      });
    });
  });

  mainEl.querySelectorAll("[data-reject]").forEach(btn => {
    btn.addEventListener("click", () => {
      const requestId = btn.dataset.reject;

      openModal("Отклонить заявку", `
        <div class="field-label">Причина отклонения *</div>
        <textarea class="textarea" id="rejectComment" placeholder="Укажите причину отклонения..."></textarea>
      `, `
        <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
        <button class="btn btn-danger" id="btnConfirmReject">Отклонить</button>
      `);

      document.getElementById("btnConfirmReject")?.addEventListener("click", () => {
        const comment = document.getElementById("rejectComment").value;

        if (!comment) {
          alert("Укажите причину отклонения");
          return;
        }

        const success = Data.rejectRequest(requestId, getCurrentUser().id, comment);

        if (success) {
          alert("Заявка отклонена.");
          closeModal();
          renderEnrollmentRequests();
        } else {
          alert("Ошибка при отклонении заявки");
        }
      });
    });
  });

  // Breadcrumb navigation
  mainEl.querySelectorAll("[data-action]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = link.dataset.action;
      if (action === "admin-dashboard") {
        state.currentView = "admin-dashboard";
        renderApp();
      }
    });
  });
}

/**
 * Course Instances Management
 * List of all instances, create new from template, assign teachers
 */
function renderCourseInstancesList() {
  const instances = Data.courseInstances;

  const instancesHtml = instances.map(instance => {
    const template = Data.getCourseTemplate(instance.courseTemplateId);
    const teacher = Data.getUserById(instance.teacherId);
    const enrollmentCount = Data.getEnrollmentsByCourse(instance.id).length;

    const statusClass = instance.status === 'active' ? 'badge-status in-progress' :
                       instance.status === 'planned' ? 'badge-status' :
                       'badge-status done';

    return `
      <div class="card">
        <div class="card-header-line">
          <div>
            <div class="card-title">${template?.title || 'Неизвестный курс'}</div>
            <div class="card-meta">${instance.cohort} · ${template?.code || ''}</div>
          </div>
          <span class="badge ${statusClass}">${Data.formatStatusLabel(instance.status)}</span>
        </div>

        <div class="card-meta" style="margin-top:8px;">
          <strong>Преподаватель:</strong> ${teacher?.name || 'Не назначен'}<br>
          <strong>Период:</strong> ${Data.formatDate(instance.startDate)} – ${Data.formatDate(instance.endDate)}<br>
          <strong>Записано студентов:</strong> ${enrollmentCount} / ${instance.maxEnrollments}
        </div>

        <div class="card-header-line" style="margin-top:8px;">
          <button class="btn btn-ghost btn-sm" data-view-enrollments="${instance.id}">Студенты</button>
          <button class="btn btn-ghost btn-sm" data-edit-instance="${instance.id}">Редактировать</button>
        </div>
      </div>
    `;
  }).join("");

  mainEl.innerHTML = `
    <section>
      ${renderBreadcrumbs([
        { label: "Администратор", action: "admin-dashboard" },
        { label: "Экземпляры курсов" }
      ])}

      <header class="main-header">
        <div>
          <h1 class="main-title">Экземпляры курсов</h1>
          <div class="main-subtitle">Управление потоками обучения</div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost" id="btnBackAdmin">К панели</button>
          <button class="btn btn-primary" id="btnCreateInstance">Создать экземпляр</button>
        </div>
      </header>

      <section>
        <div class="cards-grid">
          ${instancesHtml || '<div class="main-subtitle">Нет экземпляров курсов</div>'}
        </div>
      </section>
    </section>
  `;

  // Event handlers
  document.getElementById("btnBackAdmin")?.addEventListener("click", () => {
    state.currentView = "admin-dashboard";
    renderApp();
  });

  document.getElementById("btnCreateInstance")?.addEventListener("click", () => {
    openCreateInstanceModal();
  });

  mainEl.querySelectorAll("[data-view-enrollments]").forEach(btn => {
    btn.addEventListener("click", () => {
      const instanceId = btn.dataset.viewEnrollments;
      const enrollments = Data.getEnrollmentsByCourse(instanceId);

      const studentsHtml = enrollments.map(enr => {
        const student = Data.getUserById(enr.studentId);
        return `<li>${student?.name || 'Неизвестный'} – ${Data.formatStatusLabel(enr.status)} (${enr.progress}%)</li>`;
      }).join("") || '<li>Нет записанных студентов</li>';

      openModal("Студенты курса", `
        <ul style="list-style:disc;padding-left:20px;">
          ${studentsHtml}
        </ul>
      `, `
        <button class="btn btn-primary" onclick="closeModal()">Закрыть</button>
      `);
    });
  });

  mainEl.querySelectorAll("[data-edit-instance]").forEach(btn => {
    btn.addEventListener("click", () => {
      const instanceId = btn.dataset.editInstance;
      alert(`Редактирование экземпляра ${instanceId}\n\nВ реальной системе B3 откроется форма редактирования.`);
    });
  });

  // Breadcrumb navigation
  mainEl.querySelectorAll("[data-action]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = link.dataset.action;
      if (action === "admin-dashboard") {
        state.currentView = "admin-dashboard";
        renderApp();
      }
    });
  });
}

/**
 * Modal for creating new course instance
 */
function openCreateInstanceModal() {
  const templates = Data.courseTemplates;
  const teachers = Object.values(Data.mockUsers).filter(u => u.role === 'teacher');

  const templateOptions = templates.map(t =>
    `<option value="${t.id}">${t.title} (${t.code})</option>`
  ).join("");

  const teacherOptions = teachers.map(t =>
    `<option value="${t.id}">${t.name}</option>`
  ).join("");

  openModal("Создать экземпляр курса", `
    <div class="field-label">Шаблон курса *</div>
    <select class="textarea" id="instanceTemplate" style="min-height:auto;padding:8px;">
      <option value="">Выберите шаблон курса</option>
      ${templateOptions}
    </select>

    <div class="field-label">Название потока/группы *</div>
    <input type="text" class="textarea" id="instanceCohort"
           placeholder="Например: 2026-Q1-CORP" style="min-height:auto;padding:8px;">

    <div class="field-label">Преподаватель</div>
    <select class="textarea" id="instanceTeacher" style="min-height:auto;padding:8px;">
      <option value="">Не назначен</option>
      ${teacherOptions}
    </select>

    <div class="field-label">Дата начала *</div>
    <input type="date" class="textarea" id="instanceStartDate" style="min-height:auto;padding:8px;">

    <div class="field-label">Дата окончания *</div>
    <input type="date" class="textarea" id="instanceEndDate" style="min-height:auto;padding:8px;">

    <div class="field-label">Максимум студентов</div>
    <input type="number" class="textarea" id="instanceMaxEnroll" value="30" min="1"
           style="min-height:auto;padding:8px;">

    <div class="field-label">Статус</div>
    <select class="textarea" id="instanceStatus" style="min-height:auto;padding:8px;">
      <option value="planned">Запланирован</option>
      <option value="active">Активен</option>
      <option value="archived">Архивирован</option>
    </select>
  `, `
    <button class="btn btn-ghost" onclick="closeModal()">Отмена</button>
    <button class="btn btn-primary" id="btnSaveInstance">Создать</button>
  `);

  document.getElementById("btnSaveInstance")?.addEventListener("click", () => {
    const templateId = document.getElementById("instanceTemplate").value;
    const cohort = document.getElementById("instanceCohort").value;
    const teacherId = document.getElementById("instanceTeacher").value || null;
    const startDate = document.getElementById("instanceStartDate").value;
    const endDate = document.getElementById("instanceEndDate").value;
    const maxEnrollments = parseInt(document.getElementById("instanceMaxEnroll").value) || 30;
    const status = document.getElementById("instanceStatus").value;

    if (!templateId || !cohort || !startDate || !endDate) {
      alert("Заполните обязательные поля");
      return;
    }

    const newInstance = {
      id: `ci-${Date.now()}`,
      courseTemplateId: templateId,
      teacherId,
      cohort,
      startDate,
      endDate,
      status,
      maxEnrollments,
      createdAt: new Date().toISOString()
    };

    Data.courseInstances.push(newInstance);

    alert("Экземпляр курса создан!");
    closeModal();
    renderCourseInstancesList();
  });
}

/**
 * User Management
 * Simple list of users by role
 */
function renderUserManagement() {
  const users = Object.values(Data.mockUsers).filter(u => u.id !== 'guest');

  const usersByRole = {
    student: users.filter(u => u.role === 'student'),
    teacher: users.filter(u => u.role === 'teacher'),
    methodist: users.filter(u => u.role === 'methodist'),
    admin: users.filter(u => u.role === 'admin')
  };

  const roleLabels = {
    student: 'Студенты',
    teacher: 'Преподаватели',
    methodist: 'Методисты',
    admin: 'Администраторы'
  };

  const sectionsHtml = Object.entries(usersByRole).map(([role, users]) => {
    const usersHtml = users.map(user => `
      <div class="card" style="padding:12px;">
        <div class="card-header-line">
          <div>
            <div class="card-title">${user.name}</div>
            <div class="card-meta">${user.email}</div>
          </div>
          <span class="badge ${user.isActive ? 'badge-status in-progress' : 'badge-status'}">
            ${user.isActive ? 'Активен' : 'Неактивен'}
          </span>
        </div>
        ${user.organization ? `
          <div class="card-meta" style="margin-top:4px;">
            ${user.organization} · ${user.department || ''} · ${user.position || ''}
          </div>
        ` : ''}
      </div>
    `).join("");

    return `
      <section style="margin-bottom:20px;">
        <h2 style="font-size:14px;margin:6px 0 8px;">${roleLabels[role]} (${users.length})</h2>
        ${usersHtml || '<div class="main-subtitle">Нет пользователей</div>'}
      </section>
    `;
  }).join("");

  mainEl.innerHTML = `
    <section>
      ${renderBreadcrumbs([
        { label: "Администратор", action: "admin-dashboard" },
        { label: "Управление пользователями" }
      ])}

      <header class="main-header">
        <div>
          <h1 class="main-title">Управление пользователями</h1>
          <div class="main-subtitle">Всего пользователей: ${users.length}</div>
        </div>
        <button class="btn btn-ghost" id="btnBackAdmin">К панели</button>
      </header>

      ${sectionsHtml}
    </section>
  `;

  // Event handlers
  document.getElementById("btnBackAdmin")?.addEventListener("click", () => {
    state.currentView = "admin-dashboard";
    renderApp();
  });

  // Breadcrumb navigation
  mainEl.querySelectorAll("[data-action]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = link.dataset.action;
      if (action === "admin-dashboard") {
        state.currentView = "admin-dashboard";
        renderApp();
      }
    });
  });
}

/**
 * System Reports
 * Simple dashboard with completion rates, certificates, enrollments
 */
function renderSystemReports() {
  const totalEnrollments = Data.enrollments.length;
  const completedEnrollments = Data.enrollments.filter(e => e.status === 'completed').length;
  const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;
  const certificateCount = Data.certificates.length;
  const activeEnrollments = Data.enrollments.filter(e => e.status === 'in_progress').length;

  // Assignment stats
  const totalSubmitted = Data.assignmentInstances.filter(ai => ai.status === 'submitted').length;
  const totalAccepted = Data.assignmentInstances.filter(ai => ai.status === 'accepted').length;
  const totalNeedsRevision = Data.assignmentInstances.filter(ai => ai.status === 'needs_revision').length;

  // Course stats
  const courseStats = Data.courseTemplates.map(template => {
    const instances = Data.courseInstances.filter(ci => ci.courseTemplateId === template.id);
    const enrollments = instances.flatMap(instance =>
      Data.getEnrollmentsByCourse(instance.id)
    );
    const completed = enrollments.filter(e => e.status === 'completed').length;

    return {
      title: template.title,
      enrollments: enrollments.length,
      completed,
      completionRate: enrollments.length > 0 ? Math.round((completed / enrollments.length) * 100) : 0
    };
  });

  const courseStatsHtml = courseStats.map(stat => `
    <div class="card" style="padding:12px;">
      <div class="card-title">${stat.title}</div>
      <div class="card-meta" style="margin-top:4px;">
        Записей: ${stat.enrollments} ·
        Завершено: ${stat.completed} ·
        Успеваемость: ${stat.completionRate}%
      </div>
      <div class="progress-bar" style="margin-top:4px;">
        <div class="progress-bar-fill" style="width:${stat.completionRate}%;"></div>
      </div>
    </div>
  `).join("");

  mainEl.innerHTML = `
    <section>
      ${renderBreadcrumbs([
        { label: "Администратор", action: "admin-dashboard" },
        { label: "Отчёты" }
      ])}

      <header class="main-header">
        <div>
          <h1 class="main-title">Системные отчёты</h1>
          <div class="main-subtitle">Аналитика портала обучения</div>
        </div>
        <button class="btn btn-ghost" id="btnBackAdmin">К панели</button>
      </header>

      <section style="margin-bottom:20px;">
        <h2 style="font-size:14px;margin:6px 0 8px;">Общая статистика</h2>
        <div class="cards-grid">
          <div class="card">
            <div class="card-title">Общая успеваемость</div>
            <div style="font-size:32px;font-weight:600;">${completionRate}%</div>
            <div class="card-meta">${completedEnrollments} из ${totalEnrollments} записей завершено</div>
          </div>
          <div class="card">
            <div class="card-title">Выдано сертификатов</div>
            <div style="font-size:32px;font-weight:600;">${certificateCount}</div>
          </div>
          <div class="card">
            <div class="card-title">Активных записей</div>
            <div style="font-size:32px;font-weight:600;">${activeEnrollments}</div>
          </div>
        </div>
      </section>

      <section style="margin-bottom:20px;">
        <h2 style="font-size:14px;margin:6px 0 8px;">Статистика по заданиям</h2>
        <div class="cards-grid">
          <div class="card">
            <div class="card-title">На проверке</div>
            <div style="font-size:32px;font-weight:600;color:#f97316;">${totalSubmitted}</div>
          </div>
          <div class="card">
            <div class="card-title">Принято</div>
            <div style="font-size:32px;font-weight:600;color:#10b981;">${totalAccepted}</div>
          </div>
          <div class="card">
            <div class="card-title">На доработку</div>
            <div style="font-size:32px;font-weight:600;color:#ef4444;">${totalNeedsRevision}</div>
          </div>
        </div>
      </section>

      <section>
        <h2 style="font-size:14px;margin:6px 0 8px;">Статистика по курсам</h2>
        ${courseStatsHtml}
      </section>
    </section>
  `;

  // Event handlers
  document.getElementById("btnBackAdmin")?.addEventListener("click", () => {
    state.currentView = "admin-dashboard";
    renderApp();
  });

  // Breadcrumb navigation
  mainEl.querySelectorAll("[data-action]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = link.dataset.action;
      if (action === "admin-dashboard") {
        state.currentView = "admin-dashboard";
        renderApp();
      }
    });
  });
}

// ============================================================================
// EXPORT RENDER FUNCTIONS (to be integrated with main app.js)
// ============================================================================

// These functions should be called from the main renderApp() function:
// - renderMethodistDashboard()
// - renderTemplateEditor()
// - renderAdminDashboard()
// - renderEnrollmentRequests()
// - renderCourseInstancesList()
// - renderUserManagement()
// - renderSystemReports()

console.log("[app_part2.js] Methodist and Admin screens loaded");
