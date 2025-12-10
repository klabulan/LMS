// B3 Learning Portal - Navigation Module
// Навигация и управление ролями

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
    const user = getCurrentUser();
    const pendingCount = Data.assignmentInstances.filter(ai =>
      ai.status === 'submitted' &&
      Data.courseInstances.some(ci => ci.teacherId === user.id && ci.id === ai.courseInstanceId)
    ).length;

    sidebar.innerHTML = `
      <li class="course-list-item ${state.currentView === "teacherDashboard" ? "active" : ""}"
          onclick="navigateTo('teacherDashboard')">
        <div class="course-list-item-title">🏠 Личный кабинет</div>
      </li>
      <li class="course-list-item ${state.currentView === "teacherCourses" || state.currentView === "teacherCourseDetail" ? "active" : ""}"
          onclick="navigateTo('teacherCourses')">
        <div class="course-list-item-title">📚 Курсы</div>
      </li>
      <li class="course-list-item ${state.currentView === "teacherAllAssignments" ? "active" : ""}"
          onclick="navigateTo('teacherAllAssignments')">
        <div class="course-list-item-title">📝 Задания ${pendingCount > 0 ? `<span style="color:var(--color-warning);">(${pendingCount})</span>` : ""}</div>
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
