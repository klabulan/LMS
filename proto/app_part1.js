// B3 Learning Portal - App.js Part 1: Core + Guest + Student
// ============================================================================
// PART 1: Core State, Helpers, Navigation, Guest Screens, Student Screens
// ============================================================================

// ============================================================================
// 1. APP STATE
// ============================================================================

const Data = window.LMSData;

const state = {
  role: "guest",  // guest | student | methodist | teacher | admin
  currentView: "landing",
  currentCourseId: null,
  currentAssignmentId: null,
  currentEnrollmentId: null,
  notificationsOpen: false,
  sidebarOpen: false,
  modalOpen: false,
  modalData: null
};

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

function getCurrentUser() {
  return Data.mockUsers[state.role] || Data.mockUsers.guest;
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
        } else {
          return `<span>${item.label}</span><span class="breadcrumbs-sep">/</span>`;
        }
      }).join("")}
    </div>
  `;
}

function openModal(title, content, actions = []) {
  state.modalOpen = true;
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "modal-overlay";

  const actionsHTML = actions.length > 0 ? `
    <div class="modal-footer">
      ${actions.map(action => `
        <button class="btn ${action.className || ""}" onclick="${action.onClick}">
          ${action.label}
        </button>
      `).join("")}
    </div>
  ` : "";

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
  state.modalOpen = false;
}

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

function syncRoleButtons() {
  const roleButtons = document.querySelectorAll(".role-btn");
  roleButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.role === state.role);
  });
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

  // Navigate based on notification link (simplified for demo)
  const notification = Data.notifications.find(n => n.id === notificationId);
  if (notification && notification.link) {
    console.log("Navigate to:", notification.link);
  }
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

function switchRole(newRole) {
  state.role = newRole;

  // Reset view based on role
  if (newRole === "guest") {
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

  syncRoleButtons();
  renderSidebar();
  renderMain();
  updateNotificationBadge();
}

function renderSidebar() {
  const user = getCurrentUser();
  const sidebar = document.getElementById("sidebarCourseList");

  if (state.role === "guest") {
    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "landing" ? "active" : ""}"
          onclick="navigateTo('landing')">
        <div class="course-list-item-title">Главная</div>
      </li>
      <li class="course-list-item ${state.currentView === "catalog" ? "active" : ""}"
          onclick="navigateTo('catalog')">
        <div class="course-list-item-title">Каталог курсов</div>
      </li>
    `;
  } else if (state.role === "student") {
    const enrollments = Data.getEnrollmentsByStudent(user.id);

    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "studentDashboard" ? "active" : ""}"
          onclick="navigateTo('studentDashboard')">
        <div class="course-list-item-title">Моя панель</div>
      </li>
      <li class="course-list-item ${state.currentView === "studentCertificates" ? "active" : ""}"
          onclick="navigateTo('studentCertificates')">
        <div class="course-list-item-title">Сертификаты</div>
      </li>
      <li class="course-list-item ${state.currentView === "studentMessages" ? "active" : ""}"
          onclick="navigateTo('studentMessages')">
        <div class="course-list-item-title">Сообщения</div>
      </li>
      ${enrollments.length > 0 ? `
        <div class="sidebar-section-title" style="margin-top:12px;">Мои курсы</div>
        ${enrollments.map(enrollment => {
          const course = Data.getCourseWithInstance(enrollment.courseInstanceId);
          const isActive = state.currentCourseId === enrollment.courseInstanceId;
          return `
            <li class="course-list-item ${isActive ? "active" : ""}"
                onclick="navigateTo('studentCourse', '${enrollment.courseInstanceId}', '${enrollment.id}')">
              <div class="course-list-item-title">${course.title}</div>
              <div class="course-list-item-meta">
                <span>${enrollment.progress}%</span>
                <span>${Data.formatStatusLabel(enrollment.status)}</span>
              </div>
            </li>
          `;
        }).join("")}
      ` : ""}
    `;
  }
  // Other roles will be implemented in part 2
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

  renderSidebar();
  renderMain();
}

// ============================================================================
// 4. GUEST SCREENS
// ============================================================================

// 4.1 Landing Page
function renderLandingPage() {
  const featuredCourses = Data.courseTemplates.filter(c => c.isPublic).slice(0, 3);

  return `
    <div class="main-header">
      <div>
        <h1 class="main-title">Добро пожаловать в Портал обучения B3</h1>
        <div class="main-subtitle">
          Изучайте low-code разработку на платформе B3. Получайте сертификаты.
        </div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="navigateTo('catalog')">
          Каталог курсов
        </button>
        <button class="btn" onclick="showLoginModal()">
          Войти
        </button>
      </div>
    </div>

    <div style="margin-top:24px;">
      <h2 style="font-size:16px; font-weight:600; margin-bottom:12px;">
        Популярные курсы
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
            <div style="margin-top:auto; padding-top:8px;">
              <button class="btn btn-ghost btn-sm"
                      onclick="navigateTo('courseDetail', '${course.id}')">
                Подробнее
              </button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div style="margin-top:32px; padding:20px; background:#fff; border-radius:14px; border:1px solid var(--color-border);">
      <h2 style="font-size:16px; font-weight:600; margin-bottom:8px;">
        Почему B3 Learning Portal?
      </h2>
      <ul style="font-size:13px; line-height:1.8; color:#6b7280;">
        <li>Практические задания на реальных стендах B3</li>
        <li>Сопровождение опытными преподавателями</li>
        <li>Сертификаты с верификацией</li>
        <li>Гибкий график обучения</li>
      </ul>
    </div>
  `;
}

// 4.2 Catalog Page
function renderCatalogPage() {
  const courses = Data.courseTemplates.filter(c => c.isPublic);

  return `
    ${renderBreadcrumbs([
      { label: "Главная", onClick: "navigateTo('landing')" },
      { label: "Каталог курсов" }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">Каталог курсов</h1>
        <div class="main-subtitle">
          ${courses.length} доступных курсов
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <input type="text"
               placeholder="Поиск..."
               style="padding:6px 12px; border-radius:999px; border:1px solid #d1d5db; font-size:12px; min-width:200px;"
               oninput="filterCatalog(this.value)">
        <select style="padding:6px 12px; border-radius:999px; border:1px solid #d1d5db; font-size:12px;"
                onchange="filterCatalogByLevel(this.value)">
          <option value="">Все уровни</option>
          <option value="basic">Базовый</option>
          <option value="intermediate">Средний</option>
          <option value="advanced">Продвинутый</option>
        </select>
      </div>
    </div>

    <div class="cards-grid" id="catalog-grid">
      ${courses.map(course => {
        const activeInstance = Data.courseInstances.find(ci =>
          ci.courseTemplateId === course.id && ci.status === "active"
        );

        return `
          <div class="card" data-level="${course.level}" data-title="${course.title.toLowerCase()}">
            <div class="card-header-line">
              <div class="card-title">${course.title}</div>
              <span class="tag">${Data.formatLevel(course.level)}</span>
            </div>
            <div class="card-meta">
              ${course.code} • ${course.estimatedHours} часов • ${course.category}
            </div>
            <div style="margin-top:8px; font-size:13px; line-height:1.5; color:#6b7280;">
              ${course.description.substring(0, 140)}...
            </div>
            ${activeInstance ? `
              <div style="margin-top:8px;">
                <span class="pill status-accepted" style="font-size:11px;">
                  Набор открыт
                </span>
              </div>
            ` : ""}
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
  `;
}

function filterCatalog(searchTerm) {
  const cards = document.querySelectorAll("#catalog-grid .card");
  const term = searchTerm.toLowerCase();

  cards.forEach(card => {
    const title = card.dataset.title;
    card.style.display = title.includes(term) ? "" : "none";
  });
}

function filterCatalogByLevel(level) {
  const cards = document.querySelectorAll("#catalog-grid .card");

  cards.forEach(card => {
    if (level === "") {
      card.style.display = "";
    } else {
      card.style.display = card.dataset.level === level ? "" : "none";
    }
  });
}

// 4.3 Course Detail Page
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
      ${activeInstance ? `
        <button class="btn btn-primary"
                onclick="showEnrollModal('${activeInstance.id}', '${course.title}')">
          Записаться на курс
        </button>
      ` : `
        <button class="btn" disabled>Набор не открыт</button>
      `}
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

// 4.4 Login Modal
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

function showEnrollModal(instanceId, courseTitle) {
  const content = `
    <div style="font-size:13px; line-height:1.6;">
      <p>Вы подаете заявку на курс <strong>${courseTitle}</strong>.</p>
      <p>После одобрения заявки администратором вы получите доступ к курсу и лабораторному стенду.</p>
      <div style="margin-top:12px;">
        <label style="font-size:11px; text-transform:uppercase; color:#9ca3af; display:block; margin-bottom:4px;">
          Комментарий (необязательно)
        </label>
        <textarea id="enroll-comment" class="textarea" placeholder="Расскажите, почему вы хотите пройти этот курс"></textarea>
      </div>
    </div>
  `;

  const actions = [
    { label: "Отмена", className: "btn-ghost", onClick: "closeModal()" },
    { label: "Подать заявку", className: "btn-primary", onClick: `submitEnrollRequest('${instanceId}')` }
  ];

  openModal("Записаться на курс", content, actions);
}

function submitEnrollRequest(instanceId) {
  alert("Для подачи заявки необходимо войти в систему как студент");
  closeModal();
  showLoginModal();
}

// ============================================================================
// 5. STUDENT SCREENS
// ============================================================================

// 5.1 Student Dashboard
function renderStudentDashboard() {
  const user = getCurrentUser();
  const enrollments = Data.getEnrollmentsByStudent(user.id);
  const upcomingDeadlines = Data.getUpcomingDeadlines(user.id, 5);
  const notifications = Data.getUserNotifications(user.id).slice(0, 3);

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

        <h2 style="font-size:16px; font-weight:600; margin-bottom:12px; margin-top:20px;">
          Последние уведомления
        </h2>
        <div style="background:#fff; border-radius:14px; border:1px solid var(--color-border); padding:12px; font-size:12px;">
          ${notifications.length > 0 ? notifications.map((n, index) => `
            <div style="padding:8px; ${index < notifications.length - 1 ? "border-bottom:1px solid var(--color-border);" : ""} cursor:pointer;"
                 onclick="handleNotificationClick('${n.id}')">
              <div style="font-weight:${n.isRead ? "400" : "500"};">${n.title}</div>
              <div style="font-size:11px; color:#6b7280; margin-top:2px;">
                ${Data.formatDateTimeShort(n.createdAt)}
              </div>
            </div>
          `).join("") : `
            <div style="text-align:center; padding:20px; color:#6b7280;">
              Нет уведомлений
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}

// 5.2 Student Course Page
function renderStudentCoursePage(courseInstanceId, enrollmentId) {
  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return "<div>Запись не найдена</div>";

  const course = Data.getCourseWithInstance(courseInstanceId);
  const assignments = Data.getAssignmentTemplatesForCourse(course.templateId);
  const teacher = Data.getUserById(course.teacherId);

  // Get assignment instances for this enrollment
  const assignmentInstances = Data.getAssignmentInstancesForEnrollment(enrollmentId);

  return `
    ${renderBreadcrumbs([
      { label: "Моя панель", onClick: "navigateTo('studentDashboard')" },
      { label: course.title }
    ])}

    <div class="layout-course">
      <div class="course-sidebar">
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

      <div class="course-main">
        <div class="course-main-header">
          <div>
            <h2>${course.title}</h2>
            <div class="card-meta">${course.code} • ${course.cohort}</div>
          </div>
        </div>

        <div class="field-label">Преподаватель</div>
        <div class="field-value">${teacher.name}</div>

        <div class="field-label">Описание курса</div>
        <div class="field-value">${course.description}</div>

        ${enrollment.credentials ? `
          <div style="margin-top:20px; padding:12px; background:#eff6ff; border-radius:10px; border:1px solid #2563eb;">
            <div style="font-weight:500; margin-bottom:8px; font-size:13px;">
              Учебный стенд B3
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
    </div>
  `;
}

// 5.3 Student Assignment Page
function renderStudentAssignmentPage(courseInstanceId, enrollmentId, assignmentTemplateId) {
  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return "<div>Запись не найдена</div>";

  const course = Data.getCourseWithInstance(courseInstanceId);
  const assignment = Data.getAssignmentTemplate(assignmentTemplateId);
  const assignmentInstance = Data.getAssignmentInstance(courseInstanceId, assignmentTemplateId, enrollment.studentId);

  // Get all assignments for sidebar
  const assignments = Data.getAssignmentTemplatesForCourse(course.templateId);
  const assignmentInstances = Data.getAssignmentInstancesForEnrollment(enrollmentId);

  // Get comments (from dialogs)
  const dialog = Data.dialogs.find(d => d.type === "assignment" && d.referenceId === assignmentInstance?.id);
  const messages = dialog ? Data.getMessagesForDialog(dialog.id) : [];

  const dueDate = Data.computeDueDate(enrollment.enrolledAt, assignment.dueDays);
  const daysLeft = Data.getDaysUntilDeadline(dueDate);

  return `
    ${renderBreadcrumbs([
      { label: "Моя панель", onClick: "navigateTo('studentDashboard')" },
      { label: course.title, onClick: `navigateTo('studentCourse', '${courseInstanceId}', '${enrollmentId}')` },
      { label: assignment.title }
    ])}

    <div class="layout-course">
      <div class="course-sidebar">
        <div class="course-sidebar-title">Программа курса</div>
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

        ${messages.length > 0 ? `
          <div class="comments">
            <div style="font-weight:500; margin-bottom:8px; font-size:13px;">
              Комментарии (${messages.length})
            </div>
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
        ` : ""}
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
  // In real app, would save to state and refresh
}

function saveDraft(enrollmentId, assignmentTemplateId) {
  alert("Черновик сохранен! (демо)");
}

// 5.4 Student Certificates
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

// 5.5 Student Messages
function renderStudentMessagesPage() {
  const user = getCurrentUser();
  const enrollments = Data.getEnrollmentsByStudent(user.id);

  // Get all dialogs for student's courses
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

  // Sort by last message time
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
// 6. MAIN RENDER FUNCTION
// ============================================================================

function renderMain() {
  const main = document.getElementById("main");
  const topbarRole = document.getElementById("topbarRole");

  const user = getCurrentUser();
  topbarRole.textContent = user.name || user.role;

  let content = "";

  // Guest views
  if (state.role === "guest") {
    if (state.currentView === "landing") {
      content = renderLandingPage();
    } else if (state.currentView === "catalog") {
      content = renderCatalogPage();
    } else if (state.currentView === "courseDetail") {
      content = renderCourseDetailPage(state.currentCourseId);
    }
  }
  // Student views
  else if (state.role === "student") {
    if (state.currentView === "studentDashboard") {
      content = renderStudentDashboard();
    } else if (state.currentView === "studentCourse") {
      content = renderStudentCoursePage(state.currentCourseId, state.currentEnrollmentId);
    } else if (state.currentView === "studentAssignment") {
      content = renderStudentAssignmentPage(state.currentCourseId, state.currentEnrollmentId, state.currentAssignmentId);
    } else if (state.currentView === "studentCertificates") {
      content = renderStudentCertificatesPage();
    } else if (state.currentView === "studentMessages") {
      content = renderStudentMessagesPage();
    }
  }
  // Other roles will be added in part 2

  main.innerHTML = content;
}

// ============================================================================
// 7. INITIALIZATION
// ============================================================================

document.addEventListener("DOMContentLoaded", function() {
  console.log("[App] Initializing B3 Learning Portal");

  // Setup role switcher
  const roleButtons = document.querySelectorAll(".role-btn");
  roleButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      switchRole(btn.dataset.role);
    });
  });

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
  syncRoleButtons();
  renderSidebar();
  renderMain();
  updateNotificationBadge();

  console.log("[App] Ready!");
});
