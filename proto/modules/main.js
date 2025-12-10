// B3 Learning Portal - Main Module
// Главные функции рендеринга и инициализации

// ============================================================================
// MAIN RENDER FUNCTION
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
    } else if (state.currentView === "teacherCourses") {
      content = renderTeacherCourses();
    } else if (state.currentView === "teacherCourseDetail") {
      content = renderTeacherCourseDetail(state.currentCourseId);
    } else if (state.currentView === "teacherAllAssignments") {
      content = renderTeacherAllAssignments();
    } else if (state.currentView === "gradebook") {
      // Legacy support - redirect to course detail
      content = renderTeacherCourseDetail(state.currentCourseId);
    } else {
      content = renderTeacherDashboard();
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
// EVENT LISTENERS SETUP
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
        template.title = document.getElementById("editTitle")?.value || template.title;
        template.code = document.getElementById("editCode")?.value || template.code;
        template.level = document.getElementById("editLevel")?.value || template.level;
        template.category = document.getElementById("editCategory")?.value || template.category;
        template.description = document.getElementById("editDescription")?.value || template.description;
        template.prerequisites = document.getElementById("editPrerequisites")?.value || template.prerequisites;
        template.certificateThreshold = parseInt(document.getElementById("editThreshold")?.value) || 70;
        template.estimatedHours = parseInt(document.getElementById("editHours")?.value) || 0;
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
// INITIALIZATION
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
