// B3 Learning Portal - Unified App.js
// ============================================================================
// Complete working application with all roles: Guest, Student, Methodist, Teacher, Admin
// ============================================================================

// ============================================================================
// 1. APP STATE
// ============================================================================

const Data = window.LMSData;

const state = {
  role: "anonymous",  // anonymous | student | methodist | teacher | admin
  currentView: "landing",
  currentCourseId: null,
  currentAssignmentId: null,
  currentEnrollmentId: null,
  notificationsOpen: false,
  sidebarOpen: false,
  searchQuery: "",
  levelFilter: ""
};

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

function getCurrentUser() {
  if (state.role === "anonymous") {
    return { id: "anonymous", name: "Анонимный пользователь", role: "anonymous" };
  }
  return Data.mockUsers[state.role] || { id: "anonymous", name: "Анонимный пользователь", role: "anonymous" };
}

function renderBreadcrumbs(items) {
  if (!items || items.length === 0) return "";

  return `
    <div class="breadcrumbs">
      ${items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast) {
          return `<span>${item.label}</span>`;
        } else if (item.onClick) {
          return `<a href="#" onclick="${item.onClick}">${item.label}</a><span class="breadcrumbs-sep">/</span>`;
        } else if (item.action) {
          return `<a href="#" data-action="${item.action}">${item.label}</a><span class="breadcrumbs-sep">/</span>`;
        } else {
          return `<span>${item.label}</span><span class="breadcrumbs-sep">/</span>`;
        }
      }).join("")}
    </div>
  `;
}

function openModal(title, content, actions = []) {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-overlay";

  let actionsHTML = "";
  if (typeof actions === "string") {
    actionsHTML = actions;
  } else if (actions.length > 0) {
    actionsHTML = `
      <div class="modal-footer">
        ${actions.map(action => `
          <button class="btn ${action.className || ""}" onclick="${action.onClick}">
            ${action.label}
          </button>
        `).join("")}
      </div>
    `;
  }

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">${content}</div>
      ${actionsHTML}
    </div>
  `;

  document.body.appendChild(overlay);
  setTimeout(() => overlay.classList.add("show"), 10);

  // Close on overlay click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
}

function closeModal() {
  const overlay = document.getElementById("modal-overlay");
  if (overlay) {
    overlay.classList.remove("show");
    setTimeout(() => overlay.remove(), 200);
  }
}

// Make closeModal globally accessible
window.closeModal = closeModal;

function toggleNotifications() {
  state.notificationsOpen = !state.notificationsOpen;
  const dropdown = document.getElementById("notificationDropdown");
  if (dropdown) {
    dropdown.classList.toggle("show", state.notificationsOpen);
  }

  if (state.notificationsOpen) {
    renderNotificationDropdown();
  }
}

function toggleSidebar() {
  state.sidebarOpen = !state.sidebarOpen;
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("show", state.sidebarOpen);
  }
}

function syncRoleSelect() {
  const roleSelect = document.getElementById("roleSelect");
  if (roleSelect) {
    roleSelect.value = state.role;
  }
}

function updateNotificationBadge() {
  const user = getCurrentUser();
  const count = Data.getUnreadNotificationCount(user.id);
  const badge = document.getElementById("notificationBadge");
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
  }
}

function renderNotificationDropdown() {
  const dropdown = document.getElementById("notificationDropdown");
  if (!dropdown) return;

  const user = getCurrentUser();
  const notifications = Data.getUserNotifications(user.id);

  if (notifications.length === 0) {
    dropdown.innerHTML = `
      <div class="notification-dropdown-header">Уведомления</div>
      <div class="notification-item">
        <div class="notification-item-title">Нет уведомлений</div>
      </div>
    `;
    return;
  }

  dropdown.innerHTML = `
    <div class="notification-dropdown-header">
      Уведомления
      ${notifications.some(n => !n.isRead) ? `
        <button class="btn-sm" onclick="markAllNotificationsRead()" style="float:right;">
          Прочитать все
        </button>
      ` : ""}
    </div>
    ${notifications.slice(0, 5).map(n => `
      <div class="notification-item ${n.isRead ? "" : "unread"}"
           onclick="handleNotificationClick('${n.id}')"
           style="${n.isRead ? "" : "font-weight:500;"}">
        <div class="notification-item-title">${n.title}</div>
        <div>${n.message}</div>
        <div class="notification-item-time">${Data.formatDateTimeShort(n.createdAt)}</div>
      </div>
    `).join("")}
  `;
}

function handleNotificationClick(notificationId) {
  Data.markNotificationRead(notificationId);
  updateNotificationBadge();
  state.notificationsOpen = false;
  const dropdown = document.getElementById("notificationDropdown");
  if (dropdown) dropdown.classList.remove("show");
}

function markAllNotificationsRead() {
  const user = getCurrentUser();
  Data.markAllNotificationsRead(user.id);
  updateNotificationBadge();
  renderNotificationDropdown();
}

// ============================================================================
// 3. NAVIGATION
// ============================================================================

function handleRoleChange(newRole) {
  switchRole(newRole);
}

function switchRole(newRole) {
  state.role = newRole;

  // Reset view based on role
  if (newRole === "anonymous") {
    state.currentView = "landing";
  } else if (newRole === "student") {
    state.currentView = "studentDashboard";
  } else if (newRole === "methodist") {
    state.currentView = "methodistDashboard";
  } else if (newRole === "teacher") {
    state.currentView = "teacherDashboard";
  } else if (newRole === "admin") {
    state.currentView = "adminDashboard";
  }

  state.currentCourseId = null;
  state.currentAssignmentId = null;
  state.currentEnrollmentId = null;
  state.searchQuery = "";
  state.levelFilter = "";

  renderApp();
}

function renderSidebar() {
  const user = getCurrentUser();
  const sidebar = document.getElementById("sidebarCourseList");

  // Simplified navigation - no courses in sidebar, they are selected inside forms
  if (state.role === "anonymous") {
    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "landing" ? "active" : ""}"
          onclick="navigateTo('landing')">
        <div class="course-list-item-title">🏠 Главная</div>
      </li>
      <li class="course-list-item ${state.currentView === "catalog" ? "active" : ""}"
          onclick="navigateTo('catalog')">
        <div class="course-list-item-title">📚 Каталог курсов</div>
      </li>
    `;
  } else if (state.role === "student") {
    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "studentDashboard" ? "active" : ""}"
          onclick="navigateTo('studentDashboard')">
        <div class="course-list-item-title">🎓 Мои курсы</div>
      </li>
      <li class="course-list-item ${state.currentView === "catalog" ? "active" : ""}"
          onclick="navigateTo('catalog')">
        <div class="course-list-item-title">📚 Каталог курсов</div>
      </li>
      <li class="course-list-item ${state.currentView === "studentCertificates" ? "active" : ""}"
          onclick="navigateTo('studentCertificates')">
        <div class="course-list-item-title">🏆 Сертификаты</div>
      </li>
    `;
  } else if (state.role === "methodist") {
    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "methodistDashboard" ? "active" : ""}"
          onclick="navigateTo('methodistDashboard')">
        <div class="course-list-item-title">📝 Шаблоны курсов</div>
      </li>
    `;
  } else if (state.role === "teacher") {
    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "teacherDashboard" ? "active" : ""}"
          onclick="navigateTo('teacherDashboard')">
        <div class="course-list-item-title">📊 Мои курсы</div>
      </li>
      <li class="course-list-item ${state.currentView === "teacherGrading" ? "active" : ""}"
          onclick="navigateTo('teacherGrading')">
        <div class="course-list-item-title">✅ На проверке</div>
      </li>
      <li class="course-list-item ${state.currentView === "teacherMessages" ? "active" : ""}"
          onclick="navigateTo('teacherMessages')">
        <div class="course-list-item-title">💬 Сообщения</div>
      </li>
    `;
  } else if (state.role === "admin") {
    const pendingCount = Data.getPendingRequests().length;

    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "adminDashboard" ? "active" : ""}"
          onclick="navigateTo('adminDashboard')">
        <div class="course-list-item-title">📊 Панель управления</div>
      </li>
      <li class="course-list-item ${state.currentView === "adminRequests" ? "active" : ""}"
          onclick="navigateTo('adminRequests')">
        <div class="course-list-item-title">📋 Заявки ${pendingCount > 0 ? `<span style="color:var(--color-warning);">(${pendingCount})</span>` : ""}</div>
      </li>
      <li class="course-list-item ${state.currentView === "adminInstances" ? "active" : ""}"
          onclick="navigateTo('adminInstances')">
        <div class="course-list-item-title">📚 Экземпляры курсов</div>
      </li>
      <li class="course-list-item ${state.currentView === "adminUsers" ? "active" : ""}"
          onclick="navigateTo('adminUsers')">
        <div class="course-list-item-title">👥 Пользователи</div>
      </li>
      <li class="course-list-item ${state.currentView === "adminReports" ? "active" : ""}"
          onclick="navigateTo('adminReports')">
        <div class="course-list-item-title">📈 Отчёты</div>
      </li>
    `;
  }
}

function navigateTo(view, courseId = null, enrollmentId = null, assignmentId = null) {
  state.currentView = view;
  state.currentCourseId = courseId;
  state.currentEnrollmentId = enrollmentId;
  state.currentAssignmentId = assignmentId;

  // Close mobile sidebar
  if (window.innerWidth <= 880) {
    state.sidebarOpen = false;
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("show");
  }

  renderApp();
}

// ============================================================================
// 4. GUEST SCREENS
// ============================================================================

function renderLandingPage() {
  const featuredCourses = Data.courseTemplates.filter(c => c.isPublic).slice(0, 3);
  const allCourses = Data.courseTemplates.filter(c => c.isPublic);

  return `
    <div class="main-header">
      <div>
        <h1 class="main-title">Платформа B3</h1>
        <div class="main-subtitle">
          Low-code платформа для создания корпоративных приложений
        </div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="showRegistrationModal()">
          Начать обучение
        </button>
        <button class="btn" onclick="showLoginModal()">
          Войти
        </button>
      </div>
    </div>

    <!-- Что такое B3 -->
    <div style="margin-top:24px; padding:24px; background:linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%); border-radius:14px; border:1px solid #bae6fd;">
      <h2 style="font-size:18px; font-weight:600; margin-bottom:12px; color:#0369a1;">
        Что такое B3?
      </h2>
      <p style="font-size:14px; line-height:1.7; color:#1e3a5f; margin-bottom:16px;">
        <strong>B3</strong> — это low-code платформа для создания корпоративных приложений.
        Вместо написания кода вы проектируете модели данных, настраиваете бизнес-процессы
        и собираете интерфейсы из готовых компонентов.
      </p>
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:20px;">📊</span>
          <div>
            <div style="font-weight:600; font-size:13px; color:#0369a1;">Конструктор данных</div>
            <div style="font-size:12px; color:#64748b;">Визуальное создание моделей и связей</div>
          </div>
        </div>
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:20px;">⚙️</span>
          <div>
            <div style="font-weight:600; font-size:13px; color:#0369a1;">BPMN-процессы</div>
            <div style="font-size:12px; color:#64748b;">Автоматизация бизнес-логики</div>
          </div>
        </div>
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <span style="font-size:20px;">🖥️</span>
          <div>
            <div style="font-weight:600; font-size:13px; color:#0369a1;">Дашборды</div>
            <div style="font-size:12px; color:#64748b;">Готовые UI-компоненты</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Как освоить платформу -->
    <div style="margin-top:20px; padding:24px; background:#fff; border-radius:14px; border:1px solid var(--color-border);">
      <h2 style="font-size:18px; font-weight:600; margin-bottom:12px;">
        Как освоить платформу?
      </h2>
      <p style="font-size:14px; line-height:1.7; color:#4b5563; margin-bottom:16px;">
        На этом портале вы можете изучить возможности B3 и научиться создавать приложения.
        Выберите интересующий курс, оставьте заявку — и после подтверждения вы получите
        доступ к материалам и персональному стенду для практики. По завершении курса
        выдаётся сертификат.
      </p>
      <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:16px;">
        <div style="display:flex; align-items:center; gap:8px; padding:8px 12px; background:#f8fafc; border-radius:8px;">
          <span style="width:24px; height:24px; background:#0ea5e9; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600;">1</span>
          <span style="font-size:13px; color:#374151;">Выберите курс</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; padding:8px 12px; background:#f8fafc; border-radius:8px;">
          <span style="width:24px; height:24px; background:#0ea5e9; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600;">2</span>
          <span style="font-size:13px; color:#374151;">Оставьте заявку</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; padding:8px 12px; background:#f8fafc; border-radius:8px;">
          <span style="width:24px; height:24px; background:#0ea5e9; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600;">3</span>
          <span style="font-size:13px; color:#374151;">Практикуйтесь на стенде</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; padding:8px 12px; background:#f8fafc; border-radius:8px;">
          <span style="width:24px; height:24px; background:#10b981; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600;">✓</span>
          <span style="font-size:13px; color:#374151;">Получите сертификат</span>
        </div>
      </div>
    </div>

    <!-- Доступные курсы -->
    <div style="margin-top:32px;">
      <h2 style="font-size:16px; font-weight:600; margin-bottom:12px;">
        Доступные курсы
      </h2>
      <div class="cards-grid">
        ${featuredCourses.map(course => `
          <div class="card">
            <div class="card-header-line">
              <div class="card-title">${course.title}</div>
              <span class="tag">${Data.formatLevel(course.level)}</span>
            </div>
            <div class="card-meta">${course.code} • ${course.estimatedHours} часов</div>
            <div style="margin-top:8px; font-size:13px; line-height:1.5;">
              ${course.description.substring(0, 120)}...
            </div>
            <div style="margin-top:auto; padding-top:12px; display:flex; gap:8px;">
              <button class="btn btn-ghost btn-sm"
                      onclick="navigateTo('courseDetail', '${course.id}')">
                Подробнее
              </button>
              <button class="btn btn-primary btn-sm"
                      onclick="showRegistrationModal('${course.id}')">
                Записаться
              </button>
            </div>
          </div>
        `).join("")}
      </div>
      ${allCourses.length > 3 ? `
        <div style="text-align:center; margin-top:16px;">
          <button class="btn" onclick="navigateTo('catalog')">
            Все курсы (${allCourses.length})
          </button>
        </div>
      ` : ''}
    </div>

    <!-- Контакты и поддержка -->
    <div style="margin-top:32px; padding:20px; background:#fff; border-radius:14px; border:1px solid var(--color-border);">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:20px;">
        <div>
          <h3 style="font-size:14px; font-weight:600; margin-bottom:8px; color:#374151;">
            Есть вопросы?
          </h3>
          <p style="font-size:13px; color:#6b7280; line-height:1.6; margin:0;">
            Напишите нам, и мы поможем выбрать подходящий курс<br>
            или ответим на вопросы по обучению.
          </p>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <a href="mailto:learning@b3.ru" style="display:inline-flex; align-items:center; gap:6px; padding:10px 16px; background:#f3f4f6; border-radius:8px; font-size:13px; color:#374151; text-decoration:none;">
            learning@b3.ru
          </a>
          <a href="https://t.me/b3_support" target="_blank" style="display:inline-flex; align-items:center; gap:6px; padding:10px 16px; background:#e0f2fe; border-radius:8px; font-size:13px; color:#0369a1; text-decoration:none;">
            Telegram
          </a>
        </div>
      </div>
    </div>
  `;
}

function renderCatalogPage() {
  let courses = Data.courseTemplates.filter(c => c.isPublic);

  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    courses = courses.filter(c =>
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.code.toLowerCase().includes(query)
    );
  }

  // Apply level filter
  if (state.levelFilter) {
    courses = courses.filter(c => c.level === state.levelFilter);
  }

  const totalCourses = Data.courseTemplates.filter(c => c.isPublic).length;

  return `
    ${renderBreadcrumbs([
      { label: "Главная", onClick: "navigateTo('landing')" },
      { label: "Каталог курсов" }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">Каталог курсов</h1>
        <div class="main-subtitle">
          ${courses.length} из ${totalCourses} курсов
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div style="display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; align-items:center;">
      <div style="flex:1; min-width:200px; max-width:400px;">
        <input type="text"
               id="searchInput"
               placeholder="🔍 Поиск по названию, описанию или коду..."
               value="${state.searchQuery}"
               style="width:100%;"
               onkeyup="handleSearch(this.value)">
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <span style="font-size:13px; color:var(--color-text-muted);">Уровень:</span>
        <select id="levelFilter" onchange="handleLevelFilter(this.value)" style="min-width:120px;">
          <option value="" ${!state.levelFilter ? 'selected' : ''}>Все уровни</option>
          <option value="basic" ${state.levelFilter === 'basic' ? 'selected' : ''}>Базовый</option>
          <option value="intermediate" ${state.levelFilter === 'intermediate' ? 'selected' : ''}>Средний</option>
          <option value="advanced" ${state.levelFilter === 'advanced' ? 'selected' : ''}>Продвинутый</option>
        </select>
        ${state.searchQuery || state.levelFilter ? `
          <button class="btn btn-ghost btn-sm" onclick="clearFilters()">
            Сбросить
          </button>
        ` : ''}
      </div>
    </div>

    ${courses.length === 0 ? `
      <div style="text-align:center; padding:60px 20px; background:var(--color-card); border-radius:var(--radius-lg); border:1px solid var(--color-border);">
        <div style="font-size:48px; margin-bottom:16px;">🔍</div>
        <div style="font-size:16px; font-weight:500; margin-bottom:8px;">Курсы не найдены</div>
        <div style="font-size:13px; color:var(--color-text-muted);">
          Попробуйте изменить параметры поиска
        </div>
      </div>
    ` : `
      <div class="cards-grid" id="catalog-grid">
        ${courses.map(course => {
          const activeInstance = Data.courseInstances.find(ci =>
            ci.courseTemplateId === course.id && ci.status === "active"
          );

          return `
            <div class="card">
              <div class="card-header-line">
                <div class="card-title">${course.title}</div>
                <span class="tag">${Data.formatLevel(course.level)}</span>
              </div>
              <div class="card-meta">
                ${course.code} • ${course.estimatedHours} часов • ${course.category}
              </div>
              <div style="margin-top:8px; font-size:13px; line-height:1.5; color:var(--color-text-muted);">
                ${course.description.substring(0, 140)}...
              </div>
              ${activeInstance ? `
                <div style="margin-top:8px;">
                  <span class="pill status-accepted" style="font-size:11px;">
                    Набор открыт
                  </span>
                </div>
              ` : `
                <div style="margin-top:8px;">
                  <span class="pill status-draft" style="font-size:11px;">
                    Набор закрыт
                  </span>
                </div>
              `}
              <div style="margin-top:auto; padding-top:12px; display:flex; gap:8px;">
                <button class="btn btn-ghost btn-sm"
                        onclick="navigateTo('courseDetail', '${course.id}')">
                  Подробнее
                </button>
                ${activeInstance ? `
                  <button class="btn btn-primary btn-sm"
                          onclick="showEnrollModal('${activeInstance.id}', '${course.title}')">
                    Записаться
                  </button>
                ` : ""}
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `}
  `;
}

function handleSearch(query) {
  state.searchQuery = query;
  renderMain();
}

function handleLevelFilter(level) {
  state.levelFilter = level;
  renderMain();
}

function clearFilters() {
  state.searchQuery = "";
  state.levelFilter = "";
  renderMain();
}

function renderCourseDetailPage(courseTemplateId) {
  const course = Data.getCourseTemplate(courseTemplateId);
  if (!course) return "<div>Курс не найден</div>";

  const assignments = Data.getAssignmentTemplatesForCourse(courseTemplateId);
  const activeInstance = Data.courseInstances.find(ci =>
    ci.courseTemplateId === courseTemplateId && ci.status === "active"
  );

  return `
    ${renderBreadcrumbs([
      { label: "Главная", onClick: "navigateTo('landing')" },
      { label: "Каталог", onClick: "navigateTo('catalog')" },
      { label: course.title }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">${course.title}</h1>
        <div class="main-subtitle">
          ${course.code} • ${Data.formatLevel(course.level)} • ${course.estimatedHours} часов
        </div>
      </div>
      <button class="btn btn-primary"
              onclick="showRegistrationModal('${course.id}')">
        Записаться на курс
      </button>
    </div>

    <div style="background:#fff; border-radius:14px; border:1px solid var(--color-border); padding:16px; margin-top:16px;">
      <div class="field-label">Описание</div>
      <div class="field-value">${course.description}</div>

      <div class="field-label">Целевая аудитория</div>
      <div class="field-value">${course.targetAudience}</div>

      <div class="field-label">Предварительные требования</div>
      <div class="field-value">${course.prerequisites}</div>

      <div class="field-label">Порог сертификации</div>
      <div class="field-value">${course.certificateThreshold}% от общей оценки</div>

      ${course.requiresSandbox ? `
        <div class="field-label">Лабораторный стенд</div>
        <div class="field-value">
          <span class="tag" style="background:#dcfce7; color:#166534; border-color:#22c55e;">
            Предоставляется
          </span>
          <div style="font-size:12px; color:#6b7280; margin-top:4px;">
            Вы получите персональный доступ к виртуальной машине B3
          </div>
        </div>
      ` : ""}
    </div>

    <div style="margin-top:20px;">
      <h2 style="font-size:16px; font-weight:600; margin-bottom:12px;">
        Программа курса (${assignments.length} заданий)
      </h2>
      <div style="background:#fff; border-radius:14px; border:1px solid var(--color-border); padding:12px;">
        ${assignments.map((assignment, index) => `
          <div style="padding:10px; ${index < assignments.length - 1 ? "border-bottom:1px solid var(--color-border);" : ""}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-weight:500; font-size:13px;">
                  ${assignment.order}. ${assignment.title}
                </div>
                <div style="font-size:12px; color:#6b7280; margin-top:2px;">
                  ${Data.formatAssignmentType(assignment.type)} •
                  ${assignment.maxScore} баллов •
                  ${assignment.dueDays} дней
                </div>
              </div>
              ${assignment.isMandatory ? `
                <span class="tag" style="background:#fef3c7; color:#92400e; border-color:#fbbf24;">
                  Обязательно
                </span>
              ` : ""}
            </div>
            <div style="font-size:12px; color:#6b7280; margin-top:6px; line-height:1.5;">
              ${assignment.description}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function showLoginModal() {
  const content = `
    <div style="font-size:13px; margin-bottom:16px;">
      Это демо-версия портала. Выберите роль для входа:
    </div>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button class="btn" onclick="switchRole('student'); closeModal();">
        Войти как Студент
      </button>
      <button class="btn" onclick="switchRole('teacher'); closeModal();">
        Войти как Преподаватель
      </button>
      <button class="btn" onclick="switchRole('methodist'); closeModal();">
        Войти как Методист
      </button>
      <button class="btn" onclick="switchRole('admin'); closeModal();">
        Войти как Администратор
      </button>
    </div>
  `;

  openModal("Вход в систему", content);
}

function showRegistrationModal(preselectedCourseId = null) {
  const courses = Data.courseTemplates.filter(c => c.isPublic);

  const content = `
    <div style="font-size:13px; line-height:1.6; margin-bottom:16px;">
      Заполните форму, и мы свяжемся с вами для подтверждения записи на курс.
    </div>

    <div style="display:flex; flex-direction:column; gap:12px;">
      <div>
        <label class="field-label" style="margin-bottom:4px; display:block;">Имя и фамилия *</label>
        <input type="text" id="reg-name" class="input" placeholder="Иван Иванов" style="width:100%;">
      </div>

      <div>
        <label class="field-label" style="margin-bottom:4px; display:block;">Email *</label>
        <input type="email" id="reg-email" class="input" placeholder="ivan@company.ru" style="width:100%;">
      </div>

      <div>
        <label class="field-label" style="margin-bottom:4px; display:block;">Телефон *</label>
        <input type="tel" id="reg-phone" class="input" placeholder="+7 (999) 123-45-67" style="width:100%;">
      </div>

      <div>
        <label class="field-label" style="margin-bottom:4px; display:block;">Организация</label>
        <input type="text" id="reg-company" class="input" placeholder="ООО «Компания»" style="width:100%;">
      </div>

      <div>
        <label class="field-label" style="margin-bottom:4px; display:block;">Должность</label>
        <input type="text" id="reg-position" class="input" placeholder="Бизнес-аналитик" style="width:100%;">
      </div>

      <div>
        <label class="field-label" style="margin-bottom:4px; display:block;">Желаемый курс *</label>
        <select id="reg-course" class="input" style="width:100%;">
          <option value="">— Выберите курс —</option>
          ${courses.map(c => `
            <option value="${c.id}" ${preselectedCourseId === c.id ? 'selected' : ''}>
              ${c.title} (${c.code})
            </option>
          `).join('')}
        </select>
      </div>

      <div>
        <label class="field-label" style="margin-bottom:4px; display:block;">Комментарий</label>
        <textarea id="reg-comment" class="textarea" placeholder="Расскажите о своём опыте или задайте вопрос" style="width:100%; min-height:60px;"></textarea>
      </div>
    </div>

    <div style="margin-top:16px; font-size:11px; color:#9ca3af;">
      * — обязательные поля
    </div>
  `;

  const actions = [
    { label: "Отмена", className: "btn-ghost", onClick: "closeModal()" },
    { label: "Отправить заявку", className: "btn-primary", onClick: "submitRegistration()" }
  ];

  openModal("Заявка на обучение", content, actions);
}

function submitRegistration() {
  const name = document.getElementById('reg-name')?.value?.trim();
  const email = document.getElementById('reg-email')?.value?.trim();
  const phone = document.getElementById('reg-phone')?.value?.trim();
  const company = document.getElementById('reg-company')?.value?.trim();
  const position = document.getElementById('reg-position')?.value?.trim();
  const courseId = document.getElementById('reg-course')?.value;
  const comment = document.getElementById('reg-comment')?.value?.trim();

  // Validation
  if (!name) {
    alert('Пожалуйста, укажите ваше имя');
    return;
  }
  if (!email || !email.includes('@')) {
    alert('Пожалуйста, укажите корректный email');
    return;
  }
  if (!phone) {
    alert('Пожалуйста, укажите телефон');
    return;
  }
  if (!courseId) {
    alert('Пожалуйста, выберите курс');
    return;
  }

  const course = Data.getCourseTemplate(courseId);
  const courseName = course ? course.title : 'Не указан';

  // In demo mode just show confirmation
  closeModal();

  openModal("Заявка отправлена", `
    <div style="text-align:center; padding:20px 0;">
      <div style="font-size:48px; margin-bottom:16px;">✅</div>
      <div style="font-size:16px; font-weight:600; margin-bottom:8px;">Спасибо за заявку!</div>
      <div style="font-size:13px; color:#6b7280; line-height:1.6;">
        Мы получили вашу заявку на курс «${courseName}».<br>
        В ближайшее время свяжемся с вами по указанным контактам.
      </div>
    </div>
  `, [
    { label: "Закрыть", className: "btn-primary", onClick: "closeModal()" }
  ]);

  console.log('[Registration] New application:', { name, email, phone, company, position, courseId, comment });
}

function showEnrollModal(instanceId, courseTitle) {
  // Redirect to registration modal with preselected course
  const instance = Data.courseInstances.find(ci => ci.id === instanceId);
  if (instance) {
    showRegistrationModal(instance.courseTemplateId);
  } else {
    showRegistrationModal();
  }
}

// ============================================================================
// 5. STUDENT SCREENS
// ============================================================================

function renderStudentDashboard() {
  const user = getCurrentUser();
  const enrollments = Data.getEnrollmentsByStudent(user.id);
  const upcomingDeadlines = Data.getUpcomingDeadlines(user.id, 5);

  // Get enrolled course IDs to filter recommendations
  const enrolledCourseIds = enrollments.map(e => {
    const course = Data.getCourseWithInstance(e.courseInstanceId);
    return course?.templateId;
  }).filter(Boolean);

  // Recommended courses (public courses not enrolled in)
  const recommendedCourses = Data.courseTemplates
    .filter(c => c.isPublic && !enrolledCourseIds.includes(c.id))
    .slice(0, 3);

  return `
    <div class="main-header">
      <div>
        <h1 class="main-title">Моя панель</h1>
        <div class="main-subtitle">
          Добро пожаловать, ${user.name}!
        </div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:2fr 1fr; gap:16px; margin-top:16px;">
      <div>
        <h2 style="font-size:16px; font-weight:600; margin-bottom:12px;">
          Мои курсы (${enrollments.length})
        </h2>
        <div class="cards-grid" style="grid-template-columns:1fr;">
          ${enrollments.map(enrollment => {
            const course = Data.getCourseWithInstance(enrollment.courseInstanceId);
            const nextAssignment = Data.getNextAssignment(enrollment.id);

            return `
              <div class="card">
                <div class="card-header-line">
                  <div class="card-title">${course.title}</div>
                  <span class="pill status-${enrollment.status === "in_progress" ? "submitted" : enrollment.status === "completed" ? "accepted" : "draft"}">
                    ${Data.formatStatusLabel(enrollment.status)}
                  </span>
                </div>
                <div class="card-meta">${course.code} • ${course.cohort}</div>

                <div style="margin-top:8px;">
                  <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
                    <span style="color:#6b7280;">Прогресс</span>
                    <span style="font-weight:500;">${enrollment.progress}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" style="width:${enrollment.progress}%;"></div>
                  </div>
                </div>

                <div style="margin-top:auto; padding-top:12px; display:flex; gap:8px;">
                  ${nextAssignment ? `
                    <button class="btn btn-primary btn-sm"
                            onclick="navigateTo('studentAssignment', '${enrollment.courseInstanceId}', '${enrollment.id}', '${nextAssignment.id}')">
                      Продолжить → ${nextAssignment.title}
                    </button>
                  ` : `
                    <button class="btn btn-ghost btn-sm"
                            onclick="navigateTo('studentCourse', '${enrollment.courseInstanceId}', '${enrollment.id}')">
                      Открыть курс
                    </button>
                  `}
                </div>
              </div>
            `;
          }).join("")}

          ${enrollments.length === 0 ? `
            <div class="card" style="text-align:center; padding:40px;">
              <div style="font-size:40px; margin-bottom:12px;">📚</div>
              <div style="font-weight:500; margin-bottom:8px;">У вас пока нет курсов</div>
              <div style="font-size:12px; color:#6b7280; margin-bottom:16px;">
                Перейдите в каталог и запишитесь на курс
              </div>
              <button class="btn btn-primary" onclick="navigateTo('catalog')">
                Каталог курсов
              </button>
            </div>
          ` : ""}
        </div>

        <!-- Рекомендованные курсы -->
        ${recommendedCourses.length > 0 ? `
          <h2 style="font-size:16px; font-weight:600; margin-bottom:12px; margin-top:24px;">
            Рекомендуем изучить
          </h2>
          <div class="cards-grid">
            ${recommendedCourses.map(course => `
              <div class="card" style="background:#f8fafc;">
                <div class="card-header-line">
                  <div class="card-title">${course.title}</div>
                  <span class="tag">${Data.formatLevel(course.level)}</span>
                </div>
                <div class="card-meta">${course.code} • ${course.estimatedHours} ч.</div>
                <div style="margin-top:8px; font-size:12px; color:#6b7280; line-height:1.5;">
                  ${course.description.substring(0, 80)}...
                </div>
                <div style="margin-top:auto; padding-top:12px;">
                  <button class="btn btn-ghost btn-sm"
                          onclick="showRegistrationModal('${course.id}')">
                    Записаться
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        ` : ''}
      </div>

      <div>
        <h2 style="font-size:16px; font-weight:600; margin-bottom:12px;">
          Предстоящие дедлайны
        </h2>
        <div style="background:#fff; border-radius:14px; border:1px solid var(--color-border); padding:12px; font-size:12px;">
          ${upcomingDeadlines.length > 0 ? upcomingDeadlines.map((deadline, index) => `
            <div style="padding:8px; ${index < upcomingDeadlines.length - 1 ? "border-bottom:1px solid var(--color-border);" : ""}">
              <div style="font-weight:500;">${deadline.assignmentTitle}</div>
              <div style="font-size:11px; color:#6b7280; margin-top:2px;">
                ${deadline.courseTitle}
              </div>
              <div style="margin-top:4px;">
                <span class="tag ${deadline.daysLeft <= 1 ? "tag-warning" : ""}">
                  ${Data.formatDaysRemaining(deadline.daysLeft)}
                </span>
              </div>
            </div>
          `).join("") : `
            <div style="text-align:center; padding:20px; color:#6b7280;">
              Нет предстоящих дедлайнов
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderStudentCoursePage(courseInstanceId, enrollmentId) {
  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return "<div>Запись не найдена</div>";

  const course = Data.getCourseWithInstance(courseInstanceId);
  const assignments = Data.getAssignmentTemplatesForCourse(course.templateId);
  const teacher = Data.getUserById(course.teacherId);

  const assignmentInstances = Data.getAssignmentInstancesForEnrollment(enrollmentId);

  // Find next assignment to continue
  const nextAssignment = Data.getNextAssignment(enrollmentId);

  return `
    ${renderBreadcrumbs([
      { label: "Моя панель", onClick: "navigateTo('studentDashboard')" },
      { label: course.title }
    ])}

    <div class="layout-course" style="grid-template-columns: 1fr 280px;">
      <!-- Main content - LEFT -->
      <div class="course-main">
        <div class="course-main-header">
          <div>
            <h2>${course.title}</h2>
            <div class="card-meta">${course.code} • ${course.cohort}</div>
          </div>
          ${nextAssignment ? `
            <button class="btn btn-primary"
                    onclick="navigateTo('studentAssignment', '${courseInstanceId}', '${enrollmentId}', '${nextAssignment.id}')">
              Продолжить обучение
            </button>
          ` : ''}
        </div>

        <div class="field-label">Преподаватель</div>
        <div class="field-value">${teacher.name}</div>

        <div class="field-label">Описание курса</div>
        <div class="field-value">${course.description}</div>

        ${enrollment.credentials ? `
          <div style="margin-top:20px; padding:12px; background:#eff6ff; border-radius:10px; border:1px solid #bfdbfe;">
            <div style="font-weight:500; margin-bottom:8px; font-size:13px; color:#1e40af;">
              🖥️ Учебный стенд B3
            </div>
            <div style="font-size:12px; line-height:1.6;">
              <div style="margin-bottom:4px;">
                <strong>URL:</strong>
                <a href="${enrollment.credentials.vm_url}" target="_blank" style="color:#2563eb;">
                  ${enrollment.credentials.vm_url}
                </a>
              </div>
              <div style="margin-bottom:4px;">
                <strong>Логин:</strong>
                <code style="background:#fff; padding:2px 6px; border-radius:4px; font-size:11px;">
                  ${enrollment.credentials.username}
                </code>
              </div>
              <div style="margin-bottom:4px;">
                <strong>Пароль:</strong>
                <code style="background:#fff; padding:2px 6px; border-radius:4px; font-size:11px;">
                  ${enrollment.credentials.password}
                </code>
              </div>
              <div style="font-size:11px; color:#6b7280; margin-top:8px;">
                Доступ действителен до ${Data.formatDate(enrollment.credentials.expires_at)}
              </div>
            </div>
          </div>
        ` : ""}

        <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--color-border);">
          <div style="font-size:12px; color:#6b7280;">
            Последняя активность: ${Data.formatDateTime(enrollment.lastActivityAt)}
          </div>
        </div>
      </div>

      <!-- Program sidebar - RIGHT -->
      <div class="course-sidebar" style="order:2;">
        <div class="course-sidebar-title">Программа курса</div>
        <div style="margin:8px 0;">
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${enrollment.progress}%;"></div>
          </div>
          <div style="font-size:11px; color:#6b7280; margin-top:4px;">
            Прогресс: ${enrollment.progress}%
          </div>
        </div>
        <ul class="assignment-list">
          ${assignments.map(assignment => {
            const instance = assignmentInstances.find(ai => ai.assignmentTemplateId === assignment.id);
            const isActive = state.currentAssignmentId === assignment.id;

            return `
              <li class="assignment-item ${isActive ? "active" : ""}"
                  onclick="navigateTo('studentAssignment', '${courseInstanceId}', '${enrollmentId}', '${assignment.id}')">
                <div class="assignment-item-title">${assignment.title}</div>
                <div class="assignment-item-meta">
                  <span>${Data.formatAssignmentType(assignment.type)}</span>
                  ${instance ? `
                    <span class="pill status-${instance.status}" style="font-size:10px; padding:1px 5px;">
                      ${Data.formatAssignmentStatusLabel(instance.status)}
                    </span>
                  ` : ""}
                </div>
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    </div>
  `;
}

function renderStudentAssignmentPage(courseInstanceId, enrollmentId, assignmentTemplateId) {
  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return "<div>Запись не найдена</div>";

  const course = Data.getCourseWithInstance(courseInstanceId);
  const assignment = Data.getAssignmentTemplate(assignmentTemplateId);
  const assignmentInstance = Data.getAssignmentInstance(courseInstanceId, assignmentTemplateId, enrollment.studentId);

  const assignments = Data.getAssignmentTemplatesForCourse(course.templateId);
  const assignmentInstances = Data.getAssignmentInstancesForEnrollment(enrollmentId);

  const dialog = Data.dialogs.find(d => d.type === "assignment" && d.referenceId === assignmentInstance?.id);
  const messages = dialog ? Data.getMessagesForDialog(dialog.id) : [];

  const dueDate = Data.computeDueDate(enrollment.enrolledAt, assignment.dueDays);
  const daysLeft = Data.getDaysUntilDeadline(dueDate);

  // Check if this is the first assignment (introductory)
  const isFirstAssignment = assignment.order === 1;

  return `
    ${renderBreadcrumbs([
      { label: "Моя панель", onClick: "navigateTo('studentDashboard')" },
      { label: course.title, onClick: `navigateTo('studentCourse', '${courseInstanceId}', '${enrollmentId}')` },
      { label: assignment.title }
    ])}

    <div class="layout-course" style="grid-template-columns: 1fr 280px;">
      <!-- Main content - LEFT -->
      <div class="course-main">
        <div class="course-main-header">
          <div>
            <h2>${assignment.title}</h2>
            <div class="card-meta">
              ${Data.formatAssignmentType(assignment.type)} •
              ${assignment.maxScore} баллов •
              ${assignment.isMandatory ? "Обязательное" : "Необязательное"}
            </div>
          </div>
          ${assignmentInstance ? `
            <span class="pill status-${assignmentInstance.status}">
              ${Data.formatAssignmentStatusLabel(assignmentInstance.status)}
            </span>
          ` : `
            <span class="pill status-draft">Не начато</span>
          `}
        </div>

        ${dueDate ? `
          <div style="margin-bottom:12px;">
            <span class="tag ${daysLeft <= 1 ? "tag-warning" : ""}">
              Срок сдачи: ${Data.formatDate(dueDate)} (${Data.formatDaysRemaining(daysLeft)})
            </span>
          </div>
        ` : ""}

        <div class="field-label">Описание задания</div>
        <div class="field-value">${assignment.description}</div>

        ${assignment.materials.length > 0 ? `
          <div class="field-label">Материалы</div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            ${assignment.materials.map(m => `
              <a href="${m.url}" style="font-size:12px; color:#2563eb; text-decoration:none;">
                📎 ${m.title}
              </a>
            `).join("")}
          </div>
        ` : ""}

        ${assignmentInstance && assignmentInstance.status !== "draft" ? `
          <div style="margin-top:20px; padding:12px; background:#f9fafb; border-radius:10px;">
            <div class="field-label">Ваша работа</div>
            ${assignmentInstance.submissionText ? `
              <div class="field-value" style="white-space:pre-line;">${assignmentInstance.submissionText}</div>
            ` : ""}
            ${assignmentInstance.submissionFiles.length > 0 ? `
              <div style="margin-top:8px;">
                ${assignmentInstance.submissionFiles.map(f => `
                  <a href="${f.url}" style="font-size:12px; color:#2563eb; display:block; margin-bottom:4px;">
                    📎 ${f.name} (${f.size})
                  </a>
                `).join("")}
              </div>
            ` : ""}
            ${assignmentInstance.submissionUrl ? `
              <div style="margin-top:8px;">
                <a href="${assignmentInstance.submissionUrl}" target="_blank" style="font-size:12px; color:#2563eb;">
                  🔗 ${assignmentInstance.submissionUrl}
                </a>
              </div>
            ` : ""}
            ${assignmentInstance.submittedAt ? `
              <div style="font-size:11px; color:#6b7280; margin-top:8px;">
                Отправлено: ${Data.formatDateTime(assignmentInstance.submittedAt)}
              </div>
            ` : ""}
          </div>

          ${assignmentInstance.grade !== null ? `
            <div style="margin-top:12px; padding:12px; background:#ecfdf5; border-radius:10px; border:1px solid #22c55e;">
              <div style="font-weight:500; margin-bottom:4px;">
                Оценка: ${assignmentInstance.grade} / ${assignment.maxScore}
              </div>
              ${assignmentInstance.feedback ? `
                <div style="font-size:12px; margin-top:8px;">
                  <strong>Отзыв преподавателя:</strong>
                  <div style="margin-top:4px; white-space:pre-line;">${assignmentInstance.feedback}</div>
                </div>
              ` : ""}
              ${assignmentInstance.gradedAt ? `
                <div style="font-size:11px; color:#6b7280; margin-top:8px;">
                  Проверено: ${Data.formatDateTime(assignmentInstance.gradedAt)}
                </div>
              ` : ""}
            </div>
          ` : assignmentInstance.status === "submitted" ? `
            <div style="margin-top:12px; padding:12px; background:#fffbeb; border-radius:10px; border:1px solid #fbbf24;">
              <div style="font-size:12px; color:#92400e;">
                Работа отправлена на проверку. Ожидайте обратной связи от преподавателя.
              </div>
            </div>
          ` : ""}
        ` : `
          <div style="margin-top:20px; padding:16px; background:#f9fafb; border-radius:10px;">
            <div style="font-weight:500; margin-bottom:12px;">Отправить работу</div>

            ${assignment.submissionType.includes("text") ? `
              <div class="field-label">Текст работы</div>
              <textarea id="submission-text" class="textarea" placeholder="Введите описание выполненной работы"></textarea>
            ` : ""}

            ${assignment.submissionType.includes("file") ? `
              <div class="field-label">Файлы</div>
              <div class="file-upload-zone" onclick="alert('Загрузка файлов (демо)')">
                <div class="file-upload-zone-icon">📁</div>
                <div class="file-upload-zone-text">Нажмите для загрузки файлов</div>
              </div>
            ` : ""}

            ${assignment.submissionType.includes("link") ? `
              <div class="field-label">Ссылка на работу</div>
              <input type="text"
                     id="submission-url"
                     placeholder="https://..."
                     style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #d1d5db; font-size:12px;">
            ` : ""}

            <div class="field-label">Комментарий к работе</div>
            <textarea id="submission-comment" class="textarea" placeholder="Опишите, что было сделано, какие возникли вопросы" style="min-height:60px;"></textarea>

            <div style="margin-top:16px; display:flex; gap:8px;">
              <button class="btn btn-primary" onclick="submitAssignment('${enrollmentId}', '${assignmentTemplateId}')">
                Отправить на проверку
              </button>
              <button class="btn btn-ghost" onclick="saveDraft('${enrollmentId}', '${assignmentTemplateId}')">
                Сохранить черновик
              </button>
            </div>
          </div>
        `}

        <!-- Обсуждение задания -->
        <div style="margin-top:24px; padding:16px; background:#fff; border-radius:10px; border:1px solid var(--color-border);">
          <div style="font-weight:600; margin-bottom:12px; font-size:14px;">
            Обсуждение задания
          </div>

          ${isFirstAssignment && enrollment.credentials ? `
            <!-- Доступ к стенду для первого задания -->
            <div style="padding:12px; background:#eff6ff; border-radius:8px; border:1px solid #bfdbfe; margin-bottom:12px;">
              <div style="font-weight:500; margin-bottom:8px; font-size:13px; color:#1e40af;">
                🖥️ Доступ к учебному стенду B3
              </div>
              <div style="font-size:12px; line-height:1.6;">
                <div style="margin-bottom:4px;">
                  <strong>URL:</strong>
                  <a href="${enrollment.credentials.vm_url}" target="_blank" style="color:#2563eb;">
                    ${enrollment.credentials.vm_url}
                  </a>
                </div>
                <div style="margin-bottom:4px;">
                  <strong>Логин:</strong>
                  <code style="background:#fff; padding:2px 6px; border-radius:4px; font-size:11px;">
                    ${enrollment.credentials.username}
                  </code>
                </div>
                <div style="margin-bottom:4px;">
                  <strong>Пароль:</strong>
                  <code style="background:#fff; padding:2px 6px; border-radius:4px; font-size:11px;">
                    ${enrollment.credentials.password}
                  </code>
                </div>
                <div style="font-size:11px; color:#6b7280; margin-top:8px;">
                  Доступ действителен до ${Data.formatDate(enrollment.credentials.expires_at)}
                </div>
              </div>
            </div>
          ` : ""}

          ${messages.length > 0 ? `
            <div style="margin-bottom:12px;">
              ${messages.map(msg => {
                const author = Data.getUserById(msg.authorId);
                const isTeacher = author.role === 'teacher';
                return `
                  <div style="padding:10px; margin-bottom:8px; background:${isTeacher ? '#f0fdf4' : '#f8fafc'}; border-radius:8px; border-left:3px solid ${isTeacher ? '#22c55e' : '#e5e7eb'};">
                    <div style="font-size:11px; color:#6b7280; margin-bottom:4px;">
                      <strong style="color:${isTeacher ? '#166534' : '#374151'};">${author.name}</strong>
                      ${isTeacher ? '<span style="color:#22c55e;"> (преподаватель)</span>' : ''}
                      • ${Data.formatDateTime(msg.createdAt)}
                    </div>
                    <div style="font-size:13px; line-height:1.5;">${msg.text}</div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div style="text-align:center; padding:20px; color:#9ca3af; font-size:13px;">
              Пока нет сообщений. Задайте вопрос преподавателю, если что-то непонятно.
            </div>
          `}

          <div style="display:flex; gap:8px; margin-top:12px;">
            <input type="text" id="discussion-message" placeholder="Написать сообщение..."
                   style="flex:1; padding:8px 12px; border-radius:8px; border:1px solid #d1d5db; font-size:13px;">
            <button class="btn btn-primary btn-sm" onclick="sendDiscussionMessage('${assignmentInstance?.id || ''}')">
              Отправить
            </button>
          </div>
        </div>
      </div>

      <!-- Program sidebar - RIGHT -->
      <div class="course-sidebar" style="order:2;">
        <div class="course-sidebar-title">Программа курса</div>
        <div style="margin:8px 0;">
          <div class="progress-bar">
            <div class="progress-bar-fill" style="width:${enrollment.progress}%;"></div>
          </div>
          <div style="font-size:11px; color:#6b7280; margin-top:4px;">
            Прогресс: ${enrollment.progress}%
          </div>
        </div>
        <ul class="assignment-list">
          ${assignments.map(a => {
            const instance = assignmentInstances.find(ai => ai.assignmentTemplateId === a.id);
            const isActive = a.id === assignmentTemplateId;

            return `
              <li class="assignment-item ${isActive ? "active" : ""}"
                  onclick="navigateTo('studentAssignment', '${courseInstanceId}', '${enrollmentId}', '${a.id}')">
                <div class="assignment-item-title">${a.title}</div>
                <div class="assignment-item-meta">
                  <span>${Data.formatAssignmentType(a.type)}</span>
                  ${instance ? `
                    <span class="pill status-${instance.status}" style="font-size:10px; padding:1px 5px;">
                      ${Data.formatAssignmentStatusLabel(instance.status)}
                    </span>
                  ` : ""}
                </div>
              </li>
            `;
          }).join("")}
        </ul>
      </div>
    </div>
  `;
}

function submitAssignment(enrollmentId, assignmentTemplateId) {
  const text = document.getElementById("submission-text")?.value || "";
  const url = document.getElementById("submission-url")?.value || "";

  if (!text && !url) {
    alert("Пожалуйста, заполните хотя бы одно поле");
    return;
  }

  alert("Работа отправлена на проверку! (демо)");
}

function saveDraft(enrollmentId, assignmentTemplateId) {
  alert("Черновик сохранен! (демо)");
}

function sendDiscussionMessage(assignmentInstanceId) {
  const messageInput = document.getElementById("discussion-message");
  const message = messageInput?.value?.trim();

  if (!message) {
    alert("Введите сообщение");
    return;
  }

  alert("Сообщение отправлено! (демо)");
  messageInput.value = "";
}

function renderStudentCertificatesPage() {
  const user = getCurrentUser();
  const certificates = Data.certificates.filter(c => c.studentId === user.id);

  return `
    ${renderBreadcrumbs([
      { label: "Моя панель", onClick: "navigateTo('studentDashboard')" },
      { label: "Сертификаты" }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">Мои сертификаты</h1>
        <div class="main-subtitle">
          ${certificates.length} сертификат(ов)
        </div>
      </div>
    </div>

    <div class="cards-grid">
      ${certificates.map(cert => {
        const course = Data.getCourseWithInstance(cert.courseInstanceId);
        return `
          <div class="card">
            <div style="text-align:center; padding:20px; background:#f9fafb; border-radius:10px; margin-bottom:12px;">
              <div style="font-size:40px; margin-bottom:8px;">🏆</div>
              <div style="font-weight:600; font-size:14px; margin-bottom:4px;">
                ${course.title}
              </div>
              <div style="font-size:11px; color:#6b7280;">
                Сертификат #${cert.serialNumber}
              </div>
            </div>

            <div class="card-meta">
              Выдан: ${Data.formatDate(cert.issuedAt)}
            </div>

            <div style="margin-top:8px; font-size:11px; color:#6b7280;">
              Код верификации: ${cert.verificationCode}
            </div>

            <div style="margin-top:auto; padding-top:12px; display:flex; gap:8px;">
              <button class="btn btn-primary btn-sm" onclick="window.open('${cert.pdfUrl}', '_blank')">
                Скачать PDF
              </button>
              <button class="btn btn-ghost btn-sm" onclick="alert('Поделиться (демо)')">
                Поделиться
              </button>
            </div>
          </div>
        `;
      }).join("")}

      ${certificates.length === 0 ? `
        <div class="card" style="text-align:center; padding:40px; grid-column:1/-1;">
          <div style="font-size:40px; margin-bottom:12px;">🎓</div>
          <div style="font-weight:500; margin-bottom:8px;">У вас пока нет сертификатов</div>
          <div style="font-size:12px; color:#6b7280;">
            Завершите курс с проходным баллом, чтобы получить сертификат
          </div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderStudentMessagesPage() {
  const user = getCurrentUser();
  const enrollments = Data.getEnrollmentsByStudent(user.id);

  let allDialogs = [];
  enrollments.forEach(enrollment => {
    const dialogs = Data.getDialogsByCourse(enrollment.courseInstanceId);
    dialogs.forEach(dialog => {
      if (dialog.participants.includes(user.id)) {
        const course = Data.getCourseWithInstance(enrollment.courseInstanceId);
        const messages = Data.getMessagesForDialog(dialog.id);
        allDialogs.push({
          dialog,
          course,
          messages,
          lastMessage: messages[messages.length - 1]
        });
      }
    });
  });

  allDialogs.sort((a, b) =>
    new Date(b.dialog.lastMessageAt) - new Date(a.dialog.lastMessageAt)
  );

  return `
    ${renderBreadcrumbs([
      { label: "Моя панель", onClick: "navigateTo('studentDashboard')" },
      { label: "Сообщения" }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">Сообщения</h1>
        <div class="main-subtitle">
          ${allDialogs.length} диалог(ов)
        </div>
      </div>
    </div>

    <div style="background:#fff; border-radius:14px; border:1px solid var(--color-border); padding:16px; margin-top:16px;">
      ${allDialogs.length > 0 ? allDialogs.map((item, index) => {
        const lastAuthor = Data.getUserById(item.lastMessage.authorId);
        const isUnread = !item.lastMessage.isRead && item.lastMessage.authorId !== user.id;

        return `
          <div style="padding:12px; ${index < allDialogs.length - 1 ? "border-bottom:1px solid var(--color-border);" : ""} cursor:pointer; ${isUnread ? "background:#eff6ff;" : ""}"
               onclick="openDialog('${item.dialog.id}', '${item.course.title}')">
            <div style="display:flex; justify-content:space-between; align-items:start;">
              <div>
                <div style="font-weight:${isUnread ? "600" : "500"}; font-size:13px; margin-bottom:4px;">
                  ${item.course.title}
                  ${item.dialog.type === "assignment" ? " - Задание" : " - Общий чат"}
                </div>
                <div style="font-size:12px; color:#6b7280;">
                  ${lastAuthor.name}: ${item.lastMessage.text.substring(0, 60)}${item.lastMessage.text.length > 60 ? "..." : ""}
                </div>
              </div>
              <div style="font-size:11px; color:#6b7280;">
                ${Data.formatDateTimeShort(item.dialog.lastMessageAt)}
              </div>
            </div>
          </div>
        `;
      }).join("") : `
        <div style="text-align:center; padding:40px; color:#6b7280;">
          <div style="font-size:40px; margin-bottom:12px;">💬</div>
          <div>У вас пока нет сообщений</div>
        </div>
      `}
    </div>
  `;
}

function openDialog(dialogId, courseTitle) {
  const dialog = Data.dialogs.find(d => d.id === dialogId);
  const messages = Data.getMessagesForDialog(dialogId);

  const content = `
    <div style="max-height:400px; overflow-y:auto; margin-bottom:16px;">
      ${messages.map(msg => {
        const author = Data.getUserById(msg.authorId);
        return `
          <div class="comment">
            <div class="comment-header">
              <strong>${author.name}</strong> • ${Data.formatDateTime(msg.createdAt)}
            </div>
            <div class="comment-body">${msg.text}</div>
          </div>
        `;
      }).join("")}
    </div>

    <div>
      <textarea id="new-message-text" class="textarea" placeholder="Введите сообщение" style="min-height:60px;"></textarea>
    </div>
  `;

  const actions = [
    { label: "Отмена", className: "btn-ghost", onClick: "closeModal()" },
    { label: "Отправить", className: "btn-primary", onClick: `sendMessage('${dialogId}')` }
  ];

  openModal(`${courseTitle} - Диалог`, content, actions);
}

function sendMessage(dialogId) {
  const text = document.getElementById("new-message-text")?.value || "";
  if (!text.trim()) {
    alert("Введите текст сообщения");
    return;
  }

  alert("Сообщение отправлено! (демо)");
  closeModal();
}

// ============================================================================
// 6. METHODIST SCREENS
// ============================================================================

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

// State for template editor
let templateEditorTab = 'info'; // 'info', 'assignments', 'schedule', 'launch'

function renderTemplateEditor() {
  const template = Data.getCourseTemplate(state.currentCourseId);
  if (!template) {
    navigateTo("methodistDashboard");
    return "";
  }

  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  // Status management buttons based on current state
  const getStatusActions = () => {
    if (template.isPublic) {
      // Published - can hide or edit
      return `
        <button class="btn btn-ghost btn-sm" onclick="changeTemplateStatus('draft')">
          Скрыть из каталога
        </button>
        <button class="btn btn-sm" onclick="changeTemplateStatus('editing')">
          Внести изменения
        </button>
      `;
    } else {
      // Draft - can publish
      return `
        <button class="btn btn-primary btn-sm" onclick="changeTemplateStatus('publish')">
          Опубликовать
        </button>
      `;
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
          <span class="pill ${template.isPublic ? 'status-accepted' : 'status-draft'}">
            ${template.isPublic ? 'Опубликован' : 'Черновик'}
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
                ${a.description.substring(0, 100)}${a.description.length > 100 ? '...' : ''}
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
                  <input type="number" class="input" value="${a.dueDays || 7}" min="1"
                         style="width:100%; padding:6px 8px; font-size:12px;"
                         onchange="updateAssignmentSchedule('${a.id}', 'dueDays', this.value)">
                </div>
                <div>
                  <label class="field-label" style="font-size:11px;">Условие старта</label>
                  <select class="input" style="width:100%; padding:6px 8px; font-size:12px;"
                          onchange="updateAssignmentSchedule('${a.id}', 'startCondition', this.value)">
                    <option value="course_start" ${(a.startCondition || 'course_start') === 'course_start' ? 'selected' : ''}>
                      От старта курса
                    </option>
                    <option value="prev_complete" ${a.startCondition === 'prev_complete' ? 'selected' : ''}>
                      После предыдущего
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
            Вручную администратором
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

      <div style="margin-top:16px; padding-top:16px; border-top:1px solid var(--color-border);">
        <button class="btn btn-primary btn-sm" onclick="saveLaunchSchedule('${template.id}')">
          Сохранить график запуска
        </button>
      </div>
    </div>
  `;

  // Get content based on current tab
  let currentContent = infoContent;
  if (templateEditorTab === 'assignments') currentContent = assignmentsContent;
  else if (templateEditorTab === 'schedule') currentContent = scheduleContent;
  else if (templateEditorTab === 'launch') currentContent = launchContent;

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
          </ul>
        </div>
      </div>
    </section>
  `;
}

function switchTemplateTab(tab) {
  templateEditorTab = tab;
  renderApp();
}

function changeTemplateStatus(action) {
  const template = Data.getCourseTemplate(state.currentCourseId);
  if (!template) return;

  if (action === 'publish') {
    template.isPublic = true;
    alert('Курс опубликован в каталоге! (демо)');
  } else if (action === 'draft') {
    template.isPublic = false;
    alert('Курс скрыт из каталога (демо)');
  } else if (action === 'editing') {
    alert('Курс переведён в режим редактирования (демо)');
  }

  renderApp();
}

// Schedule helper functions
function updateAssignmentSchedule(assignmentId, field, value) {
  // Demo - would update assignment in real app
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
  // Demo - would remove from template.launchDates
  alert('Дата удалена (демо)');
  renderApp();
}

function saveLaunchSchedule(templateId) {
  alert('График запуска курса сохранён! (демо)');
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
        <label class="field-label">Описание</label>
        <textarea id="new-assignment-desc" class="textarea" placeholder="Опишите задание" style="min-height:80px;"></textarea>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label class="field-label">Макс. баллов</label>
          <input type="number" id="new-assignment-score" class="input" value="10" min="1" style="width:100%;">
        </div>
        <div>
          <label class="field-label">Срок (дней)</label>
          <input type="number" id="new-assignment-days" class="input" value="7" min="1" style="width:100%;">
        </div>
      </div>

      <div>
        <label class="field-label">Тип сдачи</label>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <label style="display:flex; align-items:center; gap:4px; font-size:13px;">
            <input type="checkbox" id="new-sub-text" checked> Текст
          </label>
          <label style="display:flex; align-items:center; gap:4px; font-size:13px;">
            <input type="checkbox" id="new-sub-file"> Файл
          </label>
          <label style="display:flex; align-items:center; gap:4px; font-size:13px;">
            <input type="checkbox" id="new-sub-link"> Ссылка
          </label>
        </div>
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
        <label class="field-label">Описание</label>
        <textarea id="edit-assignment-desc" class="textarea" style="min-height:80px;">${assignment.description}</textarea>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label class="field-label">Макс. баллов</label>
          <input type="number" id="edit-assignment-score" class="input" value="${assignment.maxScore}" min="1" style="width:100%;">
        </div>
        <div>
          <label class="field-label">Срок (дней)</label>
          <input type="number" id="edit-assignment-days" class="input" value="${assignment.dueDays}" min="1" style="width:100%;">
        </div>
      </div>

      <div>
        <label class="field-label">Тип сдачи</label>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <label style="display:flex; align-items:center; gap:4px; font-size:13px;">
            <input type="checkbox" id="edit-sub-text" ${assignment.submissionType?.includes('text') ? 'checked' : ''}> Текст
          </label>
          <label style="display:flex; align-items:center; gap:4px; font-size:13px;">
            <input type="checkbox" id="edit-sub-file" ${assignment.submissionType?.includes('file') ? 'checked' : ''}> Файл
          </label>
          <label style="display:flex; align-items:center; gap:4px; font-size:13px;">
            <input type="checkbox" id="edit-sub-link" ${assignment.submissionType?.includes('link') ? 'checked' : ''}> Ссылка
          </label>
        </div>
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

// ============================================================================
// 7. ADMIN SCREENS
// ============================================================================

function renderAdminDashboard() {
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

  return `
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
}

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

  return `
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
}

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

  return `
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
}

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

  return `
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
}

function renderSystemReports() {
  const totalEnrollments = Data.enrollments.length;
  const completedEnrollments = Data.enrollments.filter(e => e.status === 'completed').length;
  const completionRate = totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;
  const certificateCount = Data.certificates.length;
  const activeEnrollments = Data.enrollments.filter(e => e.status === 'in_progress').length;

  const totalSubmitted = Data.assignmentInstances.filter(ai => ai.status === 'submitted').length;
  const totalAccepted = Data.assignmentInstances.filter(ai => ai.status === 'accepted').length;
  const totalNeedsRevision = Data.assignmentInstances.filter(ai => ai.status === 'needs_revision').length;

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

  return `
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
}

// ============================================================================
// 8. TEACHER SCREENS (Simplified - Full implementation would require more code)
// ============================================================================

function renderTeacherDashboard() {
  const user = getCurrentUser();
  const myCourses = Data.courseInstances.filter(ci => ci.teacherId === user.id);

  return `
    <div class="main-header">
      <div>
        <h1 class="main-title">Мои курсы</h1>
        <div class="main-subtitle">
          Преподавательская панель
        </div>
      </div>
    </div>

    <div class="cards-grid">
      ${myCourses.map(instance => {
        const template = Data.getCourseTemplate(instance.courseTemplateId);
        const enrollments = Data.getEnrollmentsByCourse(instance.id);
        const assignments = Data.getAssignmentInstancesForCourse(instance.id);
        const pendingCount = assignments.filter(ai => ai.status === 'submitted').length;

        return `
          <div class="card">
            <div class="card-header-line">
              <div class="card-title">${template.title}</div>
              <span class="badge badge-status">${Data.formatStatusLabel(instance.status)}</span>
            </div>
            <div class="card-meta">${instance.cohort}</div>
            <div style="margin-top:8px; font-size:12px;">
              <div>👥 ${enrollments.length} студентов</div>
              ${pendingCount > 0 ? `<div style="color:#f97316;">⏳ ${pendingCount} на проверке</div>` : ""}
            </div>
            <div style="margin-top:auto; padding-top:12px;">
              <button class="btn btn-primary btn-sm" onclick="navigateTo('gradebook', '${instance.id}')">
                Журнал оценок
              </button>
            </div>
          </div>
        `;
      }).join("")}

      ${myCourses.length === 0 ? `
        <div class="card" style="text-align:center; padding:40px; grid-column:1/-1;">
          <div style="font-size:40px; margin-bottom:12px;">📚</div>
          <div style="font-weight:500; margin-bottom:8px;">У вас пока нет активных курсов</div>
        </div>
      ` : ""}
    </div>
  `;
}

function renderGradebook(courseInstanceId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  if (!instance) return '<div class="error">Курс не найден</div>';

  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);
  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  // Check if there are any in-person assignments
  const hasInPersonAssignments = assignments.some(a => a.deliveryMode === 'in_person');

  return `
    ${renderBreadcrumbs([
      { label: "Мои курсы", onClick: "navigateTo('teacherDashboard')" },
      { label: template.title }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">Журнал оценок: ${template.title}</h1>
        <div class="main-subtitle">${instance.cohort}</div>
      </div>
    </div>

    ${hasInPersonAssignments ? `
      <div style="margin-top:12px; padding:12px 16px; background:#fef3c7; border-radius:8px; border:1px solid #fcd34d; font-size:13px;">
        <strong>💡 Очные занятия:</strong> Для заданий с форматом "Очное" вы можете отмечать посещение студентов.
        Кликните на ячейку с заданием, чтобы отметить посещение или выставить оценку.
      </div>
    ` : ''}

    ${enrollments.length === 0 ? `
      <div style="text-align:center; padding:40px;">
        <p>Пока нет зачисленных студентов</p>
      </div>
    ` : `
      <div style="overflow-x:auto; margin-top:16px;">
        <table class="gradebook-table">
          <thead>
            <tr>
              <th>Студент</th>
              ${assignments.map(a => `
                <th title="${a.title}${a.deliveryMode === 'in_person' ? ' (Очное)' : ''}">
                  ${a.title}
                  ${a.deliveryMode === 'in_person' ? '<br><span style="font-size:9px; color:#92400e; font-weight:normal;">очное</span>' : ''}
                </th>
              `).join('')}
              <th>Прогресс</th>
            </tr>
          </thead>
          <tbody>
            ${enrollments.map(enrollment => {
              const student = Data.getUserById(enrollment.studentId);
              return `
                <tr>
                  <td>${student.name}</td>
                  ${assignments.map(assignment => {
                    const ai = Data.getAssignmentInstance(
                      courseInstanceId,
                      assignment.id,
                      enrollment.studentId
                    );
                    const isInPerson = assignment.deliveryMode === 'in_person';

                    if (isInPerson) {
                      // In-person assignment - show attendance controls
                      const attended = ai?.attended;
                      const grade = ai?.grade;

                      if (attended === true) {
                        return `<td style="background:#ecfdf5; cursor:pointer; text-align:center;"
                                    onclick="showAttendanceModal('${courseInstanceId}', '${assignment.id}', '${enrollment.studentId}', '${assignment.title}')">
                          <span style="color:#166534;">✓</span>
                          ${grade ? `<br><span style="font-size:11px;">${grade}</span>` : ''}
                        </td>`;
                      } else if (attended === false) {
                        return `<td style="background:#fef2f2; cursor:pointer; text-align:center;"
                                    onclick="showAttendanceModal('${courseInstanceId}', '${assignment.id}', '${enrollment.studentId}', '${assignment.title}')">
                          <span style="color:#dc2626;">✗</span>
                        </td>`;
                      } else {
                        return `<td style="background:#fefce8; cursor:pointer; text-align:center;"
                                    onclick="showAttendanceModal('${courseInstanceId}', '${assignment.id}', '${enrollment.studentId}', '${assignment.title}')">
                          <span style="color:#a16207; font-size:11px;">отметить</span>
                        </td>`;
                      }
                    } else {
                      // Self-study assignment - standard grading
                      if (!ai || ai.status === 'draft') {
                        return `<td>-</td>`;
                      } else if (ai.status === 'submitted') {
                        return `<td style="background:#fffbeb; cursor:pointer;"
                                    onclick="showGradeModal('${courseInstanceId}', '${assignment.id}', '${enrollment.studentId}', '${assignment.title}')">⏳</td>`;
                      } else if (ai.status === 'accepted') {
                        return `<td style="background:#ecfdf5;">${ai.grade}</td>`;
                      } else {
                        return `<td>${ai.grade || '-'}</td>`;
                      }
                    }
                  }).join('')}
                  <td>${enrollment.progress}%</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

function showAttendanceModal(courseInstanceId, assignmentId, studentId, assignmentTitle) {
  const student = Data.getUserById(studentId);
  const assignment = Data.getAssignmentTemplate(assignmentId);

  const content = `
    <div style="font-size:13px; margin-bottom:16px;">
      <strong>Студент:</strong> ${student?.name || 'Неизвестный'}<br>
      <strong>Задание:</strong> ${assignmentTitle}
    </div>

    <div style="margin-bottom:16px;">
      <label class="field-label">Посещение</label>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-sm" style="flex:1; background:#dcfce7; border-color:#22c55e; color:#166534;"
                onclick="markAttendance('${courseInstanceId}', '${assignmentId}', '${studentId}', true)">
          ✓ Присутствовал
        </button>
        <button class="btn btn-sm" style="flex:1; background:#fee2e2; border-color:#ef4444; color:#dc2626;"
                onclick="markAttendance('${courseInstanceId}', '${assignmentId}', '${studentId}', false)">
          ✗ Отсутствовал
        </button>
      </div>
    </div>

    <div>
      <label class="field-label">Оценка (опционально)</label>
      <div style="display:flex; gap:8px; align-items:center;">
        <input type="number" id="attendance-grade" class="input" placeholder="0-100" min="0" max="${assignment?.maxScore || 100}" style="width:100px;">
        <span style="font-size:12px; color:#6b7280;">из ${assignment?.maxScore || 100}</span>
      </div>
    </div>
  `;

  openModal('Отметка посещения', content, [
    { label: 'Отмена', className: 'btn-ghost', onClick: 'closeModal()' }
  ]);
}

function markAttendance(courseInstanceId, assignmentId, studentId, attended) {
  const grade = document.getElementById('attendance-grade')?.value;
  alert(`Посещение ${attended ? 'отмечено' : 'отсутствие зафиксировано'}${grade ? `, оценка: ${grade}` : ''} (демо)`);
  closeModal();
  renderApp();
}

function showGradeModal(courseInstanceId, assignmentId, studentId, assignmentTitle) {
  const student = Data.getUserById(studentId);
  const assignment = Data.getAssignmentTemplate(assignmentId);
  const ai = Data.getAssignmentInstance(courseInstanceId, assignmentId, studentId);

  const content = `
    <div style="font-size:13px; margin-bottom:16px;">
      <strong>Студент:</strong> ${student?.name || 'Неизвестный'}<br>
      <strong>Задание:</strong> ${assignmentTitle}
    </div>

    ${ai?.submissionText ? `
      <div style="margin-bottom:12px;">
        <label class="field-label">Ответ студента</label>
        <div style="padding:10px; background:#f9fafb; border-radius:6px; font-size:12px; max-height:150px; overflow:auto;">
          ${ai.submissionText}
        </div>
      </div>
    ` : ''}

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
      <div>
        <label class="field-label">Оценка</label>
        <input type="number" id="grade-value" class="input" value="${ai?.grade || ''}" placeholder="0-${assignment?.maxScore || 100}" min="0" max="${assignment?.maxScore || 100}" style="width:100%;">
      </div>
      <div style="display:flex; align-items:flex-end;">
        <span style="font-size:12px; color:#6b7280; padding-bottom:10px;">из ${assignment?.maxScore || 100} баллов</span>
      </div>
    </div>

    <div style="margin-top:12px;">
      <label class="field-label">Комментарий</label>
      <textarea id="grade-comment" class="textarea" placeholder="Комментарий к оценке" style="min-height:60px;">${ai?.teacherComment || ''}</textarea>
    </div>
  `;

  openModal('Оценка работы', content, [
    { label: 'Отмена', className: 'btn-ghost', onClick: 'closeModal()' },
    { label: 'Сохранить оценку', className: 'btn-primary', onClick: `saveGrade('${courseInstanceId}', '${assignmentId}', '${studentId}')` }
  ]);
}

function saveGrade(courseInstanceId, assignmentId, studentId) {
  const grade = document.getElementById('grade-value')?.value;
  const comment = document.getElementById('grade-comment')?.value;

  if (!grade) {
    alert('Укажите оценку');
    return;
  }

  alert(`Оценка ${grade} сохранена! (демо)`);
  closeModal();
  renderApp();
}

// ============================================================================
// 9. MAIN RENDER FUNCTION
// ============================================================================

function renderMain() {
  const main = document.getElementById("main");
  const topbarRole = document.getElementById("topbarRole");

  const user = getCurrentUser();
  topbarRole.textContent = user.name || user.role;

  let content = "";

  // Anonymous views
  if (state.role === "anonymous") {
    if (state.currentView === "landing") {
      content = renderLandingPage();
    } else if (state.currentView === "catalog") {
      content = renderCatalogPage();
    } else if (state.currentView === "courseDetail") {
      content = renderCourseDetailPage(state.currentCourseId);
    } else {
      content = renderLandingPage();
    }
  }
  // Student views
  else if (state.role === "student") {
    if (state.currentView === "studentDashboard") {
      content = renderStudentDashboard();
    } else if (state.currentView === "catalog") {
      content = renderCatalogPage();
    } else if (state.currentView === "courseDetail") {
      content = renderCourseDetailPage(state.currentCourseId);
    } else if (state.currentView === "studentCourse") {
      content = renderStudentCoursePage(state.currentCourseId, state.currentEnrollmentId);
    } else if (state.currentView === "studentAssignment") {
      content = renderStudentAssignmentPage(state.currentCourseId, state.currentEnrollmentId, state.currentAssignmentId);
    } else if (state.currentView === "studentCertificates") {
      content = renderStudentCertificatesPage();
    } else if (state.currentView === "studentMessages") {
      content = renderStudentMessagesPage();
    } else {
      content = renderStudentDashboard();
    }
  }
  // Methodist views
  else if (state.role === "methodist") {
    if (state.currentView === "methodistDashboard") {
      content = renderMethodistDashboard();
    } else if (state.currentView === "templateEditor") {
      content = renderTemplateEditor();
    }
  }
  // Teacher views
  else if (state.role === "teacher") {
    if (state.currentView === "teacherDashboard") {
      content = renderTeacherDashboard();
    } else if (state.currentView === "gradebook") {
      content = renderGradebook(state.currentCourseId);
    }
  }
  // Admin views
  else if (state.role === "admin") {
    if (state.currentView === "adminDashboard") {
      content = renderAdminDashboard();
    } else if (state.currentView === "adminRequests") {
      content = renderEnrollmentRequests();
    } else if (state.currentView === "adminInstances") {
      content = renderCourseInstancesList();
    } else if (state.currentView === "adminUsers") {
      content = renderUserManagement();
    } else if (state.currentView === "adminReports") {
      content = renderSystemReports();
    }
  }

  main.innerHTML = content;

  // Setup event listeners after rendering
  setupEventListeners();
}

function renderApp() {
  syncRoleSelect();
  renderSidebar();
  updateNotificationBadge();
  renderMain();
}

// ============================================================================
// 10. EVENT LISTENERS SETUP
// ============================================================================

function setupEventListeners() {
  const main = document.getElementById("main");

  // Methodist dashboard
  const btnCreateTemplate = document.getElementById("btnCreateTemplate");
  if (btnCreateTemplate) {
    btnCreateTemplate.addEventListener("click", () => {
      alert("Создание нового шаблона курса (демо)");
    });
  }

  const btnBackMethodist = document.getElementById("btnBackMethodist");
  if (btnBackMethodist) {
    btnBackMethodist.addEventListener("click", () => {
      navigateTo("methodistDashboard");
    });
  }

  const btnSaveTemplateChanges = document.getElementById("btnSaveTemplateChanges");
  if (btnSaveTemplateChanges) {
    btnSaveTemplateChanges.addEventListener("click", () => {
      const template = Data.getCourseTemplate(state.currentCourseId);
      if (template) {
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
        renderApp();
      }
    });
  }

  const btnAddAssignment = document.getElementById("btnAddAssignment");
  if (btnAddAssignment) {
    btnAddAssignment.addEventListener("click", () => {
      alert("Добавление нового задания (демо)");
    });
  }

  // Admin dashboard
  const btnViewRequests = document.getElementById("btnViewRequests");
  if (btnViewRequests) {
    btnViewRequests.addEventListener("click", () => {
      navigateTo("adminRequests");
    });
  }

  const btnViewAllRequests = document.getElementById("btnViewAllRequests");
  if (btnViewAllRequests) {
    btnViewAllRequests.addEventListener("click", () => {
      navigateTo("adminRequests");
    });
  }

  const btnManageInstances = document.getElementById("btnManageInstances");
  if (btnManageInstances) {
    btnManageInstances.addEventListener("click", () => {
      navigateTo("adminInstances");
    });
  }

  const btnManageUsers = document.getElementById("btnManageUsers");
  if (btnManageUsers) {
    btnManageUsers.addEventListener("click", () => {
      navigateTo("adminUsers");
    });
  }

  const btnViewReports = document.getElementById("btnViewReports");
  if (btnViewReports) {
    btnViewReports.addEventListener("click", () => {
      navigateTo("adminReports");
    });
  }

  const btnBackAdmin = document.getElementById("btnBackAdmin");
  if (btnBackAdmin) {
    btnBackAdmin.addEventListener("click", () => {
      navigateTo("adminDashboard");
    });
  }

  const btnCreateInstance = document.getElementById("btnCreateInstance");
  if (btnCreateInstance) {
    btnCreateInstance.addEventListener("click", () => {
      alert("Создание экземпляра курса (демо)");
    });
  }

  // Approve/reject buttons
  main.querySelectorAll("[data-approve]").forEach(btn => {
    btn.addEventListener("click", () => {
      const requestId = btn.dataset.approve;
      const success = Data.approveRequest(requestId, getCurrentUser().id, "Заявка одобрена");
      if (success) {
        alert("Заявка одобрена! Студент записан на курс.");
        renderApp();
      }
    });
  });

  main.querySelectorAll("[data-reject]").forEach(btn => {
    btn.addEventListener("click", () => {
      const requestId = btn.dataset.reject;
      const reason = prompt("Укажите причину отклонения:");
      if (reason) {
        const success = Data.rejectRequest(requestId, getCurrentUser().id, reason);
        if (success) {
          alert("Заявка отклонена.");
          renderApp();
        }
      }
    });
  });

  // Edit template buttons
  main.querySelectorAll("[data-edit-template]").forEach(btn => {
    btn.addEventListener("click", () => {
      navigateTo("templateEditor", btn.dataset.editTemplate);
    });
  });

  // View enrollments buttons
  main.querySelectorAll("[data-view-enrollments]").forEach(btn => {
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
      `, `<button class="btn btn-primary" onclick="closeModal()">Закрыть</button>`);
    });
  });

  // Breadcrumb navigation
  main.querySelectorAll("[data-action]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const action = link.dataset.action;
      if (action === "methodist-dashboard") {
        navigateTo("methodistDashboard");
      } else if (action === "admin-dashboard") {
        navigateTo("adminDashboard");
      }
    });
  });
}

// ============================================================================
// 11. INITIALIZATION
// ============================================================================

function init() {
  console.log("[App] Initializing B3 Learning Portal");

  // Role select is handled via onchange in HTML

  // Setup mobile menu
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleSidebar);
  }

  // Setup notification bell
  const notificationBell = document.getElementById("notificationBell");
  if (notificationBell) {
    notificationBell.addEventListener("click", toggleNotifications);
  }

  // Close notifications when clicking outside
  document.addEventListener("click", (e) => {
    const bell = document.getElementById("notificationBell");
    const dropdown = document.getElementById("notificationDropdown");
    if (bell && dropdown && !bell.contains(e.target)) {
      state.notificationsOpen = false;
      dropdown.classList.remove("show");
    }
  });

  // Initial render
  renderApp();

  console.log("[App] Ready!");
}

document.addEventListener("DOMContentLoaded", init);
