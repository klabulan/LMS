// B3 Learning Portal - Admin Screens Module
// Экраны для администраторов

const Admin = {};

function renderAdminDashboard() {
  const pendingCount = Data.enrollments.filter(e => e.status === 'pending_approval').length;
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
        <div style="font-size:32px;font-weight:600;color:${pendingCount > 0 ? '#f97316' : 'inherit'};">
          ${pendingCount}
        </div>
      </div>
    </div>
  `;

  const pendingEnrollments = Data.enrollments.filter(e => e.status === 'pending_approval').slice(0, 3);
  const recentRequestsHtml = pendingEnrollments.map(enrollment => {
    const user = Data.getUserById(enrollment.studentId);
    const instance = Data.getCourseInstance(enrollment.courseInstanceId);
    const template = instance ? Data.getCourseTemplate(instance.courseTemplateId) : null;

    return `
      <div class="card" style="padding:12px;">
        <div class="card-header-line">
          <div>
            <div class="card-title">${user?.name || 'Неизвестный'}</div>
            <div class="card-meta">Курс: ${template?.title || 'Неизвестный'} · ${Data.formatDateTime(enrollment.enrolledAt)}</div>
          </div>
          <span class="pill status-pending">Ожидает</span>
        </div>
        ${enrollment.requestComment ? `<div class="card-meta" style="margin-top:4px;">«${enrollment.requestComment}»</div>` : ''}
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
          <button class="btn" id="btnViewRequests">Заявки на запись (${pendingCount})</button>
          <button class="btn btn-ghost" id="btnManageInstances">Экземпляры курсов</button>
          <button class="btn btn-ghost" id="btnManageUsers">Управление пользователями</button>
          <button class="btn btn-ghost" id="btnViewReports">Отчёты</button>
        </div>
      </section>

      <section>
        <h2 style="font-size:14px;margin:6px 0 8px;">Последние заявки</h2>
        ${recentRequestsHtml}
        ${pendingCount > 3 ? `
          <div style="margin-top:8px;">
            <button class="btn btn-ghost btn-sm" id="btnViewAllRequests">Показать все заявки</button>
          </div>
        ` : ''}
      </section>
    </section>
  `;
}

function renderEnrollmentRequests() {
  // Get enrollments with pending_approval status
  const pendingEnrollments = Data.enrollments.filter(e => e.status === 'pending_approval');

  let html = `
    <div class="container mt-4">
      <h2 class="mb-4">
        <i class="bi bi-clipboard-check me-2"></i>
        Согласование заявок на курсы
      </h2>

      ${pendingEnrollments.length === 0 ? `
        <div class="alert alert-info">
          <i class="bi bi-info-circle me-2"></i>
          Нет заявок на согласовании
        </div>
      ` : `
        <div class="alert alert-warning">
          <i class="bi bi-exclamation-triangle me-2"></i>
          Найдено заявок на согласовании: <strong>${pendingEnrollments.length}</strong>
        </div>
      `}

      <div class="row">
  `;

  pendingEnrollments.forEach(enrollment => {
    const student = Data.getUserById(enrollment.studentId);
    const instance = Data.getCourseInstance(enrollment.courseInstanceId);
    const template = Data.getCourseTemplate(instance.courseTemplateId);

    html += `
      <div class="col-md-6 mb-3">
        <div class="card border-warning">
          <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">
              <i class="bi bi-person me-2"></i>
              ${student.name}
            </h5>
          </div>
          <div class="card-body">
            <p class="mb-2"><strong>Курс:</strong> ${template.title}</p>
            <p class="mb-2"><strong>Учебная группа:</strong> ${instance.cohort}</p>
            <p class="mb-2"><strong>Организация:</strong> ${student.organization || 'Не указана'}</p>
            <p class="mb-2"><strong>Дата подачи:</strong> ${Data.formatDateTime(enrollment.enrolledAt)}</p>
            ${enrollment.requestComment ? `
              <div class="alert alert-light small mb-3">
                <strong>Комментарий студента:</strong><br>
                ${enrollment.requestComment}
              </div>
            ` : ''}
            <div class="btn-group w-100" role="group">
              <button class="btn btn-success" onclick="Admin.approveEnrollment('${enrollment.id}')">
                <i class="bi bi-check-circle me-1"></i>
                Одобрить
              </button>
              <button class="btn btn-danger" onclick="Admin.rejectEnrollment('${enrollment.id}')">
                <i class="bi bi-x-circle me-1"></i>
                Отклонить
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;

  document.getElementById('app').innerHTML = html;
}

Admin.approveEnrollment = function(enrollmentId) {
  const comment = prompt('Комментарий к одобрению (опционально):');
  if (comment === null) return; // User cancelled

  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return;

  const instance = Data.getCourseInstance(enrollment.courseInstanceId);
  const template = Data.getCourseTemplate(instance.courseTemplateId);

  // Update enrollment status
  enrollment.status = 'approved';
  enrollment.approvedBy = currentUser.id;
  enrollment.approvedAt = new Date().toISOString();
  enrollment.approvalComment = comment || 'Заявка одобрена';

  // Allocate resources if sandbox required
  if (template.requiresSandbox) {
    const timestamp = Date.now();
    enrollment.allocatedResources = `Учебный стенд B3
URL: https://sandbox.b3.example.com/instance-${timestamp}
Логин: student${timestamp}
Пароль: Pass_${timestamp}_Auto!
Действует до: ${new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString('ru-RU')}`;
  }

  alert('Заявка одобрена! Студент получит уведомление.');
  renderEnrollmentRequests();
};

Admin.rejectEnrollment = function(enrollmentId) {
  const reason = prompt('Причина отклонения:');
  if (!reason) {
    alert('Необходимо указать причину отклонения');
    return;
  }

  const enrollment = Data.enrollments.find(e => e.id === enrollmentId);
  if (!enrollment) return;

  enrollment.status = 'rejected';
  enrollment.approvedBy = currentUser.id;
  enrollment.approvedAt = new Date().toISOString();
  enrollment.approvalComment = reason;

  alert('Заявка отклонена. Студент получит уведомление.');
  renderEnrollmentRequests();
};

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
          <strong>Записано студентов:</strong> ${enrollmentCount}
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
          <div class="main-subtitle">Управление учебными группами</div>
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
