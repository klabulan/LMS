// B3 Learning Portal - Teacher Screens Module
// Экраны для преподавателей

// State for course detail view
let teacherCourseTab = 'students'; // 'students' or 'assignments'
let selectedStudentId = null;
let selectedAssignmentId = null;

// ============================================================================
// ЛИЧНЫЙ КАБИНЕТ (Dashboard)
// ============================================================================

function renderTeacherDashboard() {
  const user = getCurrentUser();
  const myCourses = Data.courseInstances.filter(ci => ci.teacherId === user.id);

  // Ближайшие события (дедлайны заданий)
  const upcomingEvents = [];
  myCourses.forEach(instance => {
    const template = Data.getCourseTemplate(instance.courseTemplateId);
    const assignments = Data.getAssignmentTemplatesForCourse(template.id);
    assignments.forEach(a => {
      if (a.deliveryMode === 'in_person') {
        upcomingEvents.push({
          type: 'class',
          title: a.title,
          course: template.title,
          date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Demo: random date in next 7 days
        });
      }
    });
  });
  upcomingEvents.sort((a, b) => a.date - b.date);

  // Последние сообщения (демо)
  const recentMessages = [
    { from: 'Иван Петров', course: 'B3-BASIC', text: 'Добрый день! Не могу войти в систему...', time: '2 часа назад' },
    { from: 'Мария Сидорова', course: 'B3-BASIC', text: 'Отправила задание, проверьте пожалуйста', time: '5 часов назад' }
  ];

  // Статистика
  const totalStudents = myCourses.reduce((sum, ci) => sum + Data.getEnrollmentsByCourse(ci.id).length, 0);
  const pendingCount = Data.assignmentInstances.filter(ai =>
    ai.status === 'submitted' &&
    myCourses.some(ci => ci.id === ai.courseInstanceId)
  ).length;

  return `
    <div class="main-header">
      <div>
        <h1 class="main-title">Личный кабинет</h1>
        <div class="main-subtitle">Добро пожаловать, ${user.name}!</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px; margin-top:16px;">
      <!-- Левая колонка: статистика и курсы -->
      <div>
        <!-- Статистика -->
        <div class="cards-grid" style="margin-bottom:20px;">
          <div class="card">
            <div class="card-title">Активных курсов</div>
            <div style="font-size:32px; font-weight:600;">${myCourses.filter(c => c.status === 'active').length}</div>
          </div>
          <div class="card">
            <div class="card-title">Всего студентов</div>
            <div style="font-size:32px; font-weight:600;">${totalStudents}</div>
          </div>
          <div class="card">
            <div class="card-title">На проверке</div>
            <div style="font-size:32px; font-weight:600; color:${pendingCount > 0 ? '#f97316' : 'inherit'};">${pendingCount}</div>
          </div>
        </div>

        <!-- Мои курсы -->
        <h2 style="font-size:14px; font-weight:600; margin-bottom:12px;">Мои курсы</h2>
        <div class="cards-grid" style="grid-template-columns: 1fr;">
          ${myCourses.slice(0, 3).map(instance => {
            const template = Data.getCourseTemplate(instance.courseTemplateId);
            const enrollments = Data.getEnrollmentsByCourse(instance.id);
            const coursePending = Data.assignmentInstances.filter(ai =>
              ai.status === 'submitted' && ai.courseInstanceId === instance.id
            ).length;

            return `
              <div class="card" style="padding:12px;">
                <div class="card-header-line">
                  <div>
                    <div class="card-title">${template.title}</div>
                    <div class="card-meta">${instance.cohort}</div>
                  </div>
                  <span class="badge badge-status">${Data.formatStatusLabel(instance.status)}</span>
                </div>
                <div style="margin-top:8px; font-size:12px; display:flex; gap:16px;">
                  <span>👥 ${enrollments.length} студентов</span>
                  ${coursePending > 0 ? `<span style="color:#f97316;">⏳ ${coursePending} на проверке</span>` : ''}
                </div>
                <div style="margin-top:8px;">
                  <button class="btn btn-primary btn-sm" onclick="navigateTo('teacherCourseDetail', '${instance.id}')">
                    Детали курса
                  </button>
                </div>
              </div>
            `;
          }).join("")}
        </div>
        ${myCourses.length > 3 ? `
          <div style="margin-top:8px;">
            <button class="btn btn-ghost btn-sm" onclick="navigateTo('teacherCourses')">Все курсы (${myCourses.length})</button>
          </div>
        ` : ''}
      </div>

      <!-- Правая колонка: события и сообщения -->
      <div>
        <!-- Ближайшие события -->
        <h2 style="font-size:14px; font-weight:600; margin-bottom:12px;">Ближайшие события</h2>
        <div class="card" style="padding:12px; margin-bottom:20px;">
          ${upcomingEvents.length > 0 ? upcomingEvents.slice(0, 5).map((event, i) => `
            <div style="padding:8px 0; ${i < upcomingEvents.length - 1 ? 'border-bottom:1px solid var(--color-border);' : ''}">
              <div style="font-size:12px; font-weight:500;">${event.type === 'class' ? '📅' : '📝'} ${event.title}</div>
              <div style="font-size:11px; color:#6b7280;">${event.course} · ${event.date.toLocaleDateString('ru-RU')}</div>
            </div>
          `).join('') : `
            <div style="text-align:center; padding:20px; color:#9ca3af; font-size:12px;">
              Нет ближайших событий
            </div>
          `}
        </div>

        <!-- Последние сообщения -->
        <h2 style="font-size:14px; font-weight:600; margin-bottom:12px;">Последние сообщения</h2>
        <div class="card" style="padding:12px;">
          ${recentMessages.map((msg, i) => `
            <div style="padding:8px 0; ${i < recentMessages.length - 1 ? 'border-bottom:1px solid var(--color-border);' : ''}">
              <div style="font-size:12px; font-weight:500;">${msg.from}</div>
              <div style="font-size:11px; color:#6b7280;">${msg.course} · ${msg.time}</div>
              <div style="font-size:12px; margin-top:4px; color:#374151;">${msg.text.substring(0, 50)}...</div>
            </div>
          `).join('')}
          ${recentMessages.length === 0 ? `
            <div style="text-align:center; padding:20px; color:#9ca3af; font-size:12px;">
              Нет сообщений
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// СПИСОК КУРСОВ
// ============================================================================

function renderTeacherCourses() {
  const user = getCurrentUser();
  const myCourses = Data.courseInstances.filter(ci => ci.teacherId === user.id);

  return `
    ${renderBreadcrumbs([
      { label: "Личный кабинет", onClick: "navigateTo('teacherDashboard')" },
      { label: "Курсы" }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">Мои курсы</h1>
        <div class="main-subtitle">${myCourses.length} курсов</div>
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
            <div class="card-meta">${instance.cohort} · ${template.code}</div>
            <div style="margin-top:8px; font-size:12px;">
              <div>👥 ${enrollments.length} студентов</div>
              <div>📅 ${Data.formatDate(instance.startDate)} – ${Data.formatDate(instance.endDate)}</div>
              ${pendingCount > 0 ? `<div style="color:#f97316;">⏳ ${pendingCount} на проверке</div>` : ''}
            </div>
            <div style="margin-top:auto; padding-top:12px;">
              <button class="btn btn-primary btn-sm" onclick="navigateTo('teacherCourseDetail', '${instance.id}')">
                Детали курса
              </button>
            </div>
          </div>
        `;
      }).join("")}

      ${myCourses.length === 0 ? `
        <div class="card" style="text-align:center; padding:40px; grid-column:1/-1;">
          <div style="font-size:40px; margin-bottom:12px;">📚</div>
          <div style="font-weight:500; margin-bottom:8px;">У вас пока нет курсов</div>
        </div>
      ` : ""}
    </div>
  `;
}

// ============================================================================
// ДЕТАЛИ КУРСА (с вкладками Студенты / Задания)
// ============================================================================

function renderTeacherCourseDetail(courseInstanceId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  if (!instance) return '<div class="error">Курс не найден</div>';

  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);
  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  let mainContent = '';

  if (teacherCourseTab === 'students') {
    mainContent = renderStudentsTab(courseInstanceId, enrollments, assignments);
  } else if (teacherCourseTab === 'assignments') {
    mainContent = renderAssignmentsTab(courseInstanceId, enrollments, assignments);
  } else if (teacherCourseTab === 'progress') {
    mainContent = renderClassProgressTab(courseInstanceId);
  }

  return `
    ${renderBreadcrumbs([
      { label: "Личный кабинет", onClick: "navigateTo('teacherDashboard')" },
      { label: "Курсы", onClick: "navigateTo('teacherCourses')" },
      { label: template.title }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">${template.title}</h1>
        <div class="main-subtitle">${instance.cohort} · ${enrollments.length} студентов</div>
      </div>
    </div>

    <div class="layout-course" style="grid-template-columns: 1fr 280px; margin-top:16px;">
      <!-- Main content -->
      <div class="course-main">
        ${mainContent}
      </div>

      <!-- Right sidebar navigation -->
      <div class="course-sidebar" style="order:2;">
        <div class="course-sidebar-title">Разделы</div>
        <ul class="assignment-list">
          <li class="assignment-item ${teacherCourseTab === 'progress' ? 'active' : ''}"
              onclick="switchTeacherCourseTab('progress', '${courseInstanceId}')"
              style="cursor:pointer;">
            <div class="assignment-item-title">📊 Прогресс группы</div>
            <div class="assignment-item-meta">Матрица</div>
          </li>
          <li class="assignment-item ${teacherCourseTab === 'students' ? 'active' : ''}"
              onclick="switchTeacherCourseTab('students', '${courseInstanceId}')"
              style="cursor:pointer;">
            <div class="assignment-item-title">👥 Студенты</div>
            <div class="assignment-item-meta">${enrollments.length} чел.</div>
          </li>
          <li class="assignment-item ${teacherCourseTab === 'assignments' ? 'active' : ''}"
              onclick="switchTeacherCourseTab('assignments', '${courseInstanceId}')"
              style="cursor:pointer;">
            <div class="assignment-item-title">📝 Задания</div>
            <div class="assignment-item-meta">${assignments.length} шт.</div>
          </li>
        </ul>
      </div>
    </div>
  `;
}

function switchTeacherCourseTab(tab, courseInstanceId) {
  teacherCourseTab = tab;
  selectedStudentId = null;
  selectedAssignmentId = null;
  navigateTo('teacherCourseDetail', courseInstanceId);
}

// ============================================================================
// ВКЛАДКА СТУДЕНТЫ (TABLE VIEW WITH MODALS)
// ============================================================================

function renderStudentsTab(courseInstanceId, enrollments, assignments) {
  return `
    <div style="font-weight:500; margin-bottom:12px;">Список студентов (${enrollments.length})</div>
    ${renderStudentsTable(courseInstanceId, enrollments, assignments)}
  `;
}

/**
 * Render students as a table (converted from cards)
 */
function renderStudentsTable(courseInstanceId, enrollments, assignments) {
  if (enrollments.length === 0) {
    return `
      <div style="text-align:center; padding:30px; color:#9ca3af;">
        Нет записанных студентов
      </div>
    `;
  }

  // Calculate risk levels for each student
  const studentsData = enrollments.map(enrollment => {
    const student = Data.getUserById(enrollment.studentId);
    const completedCount = Data.assignmentInstances.filter(ai =>
      ai.courseInstanceId === courseInstanceId &&
      ai.studentId === enrollment.studentId &&
      ai.status === 'accepted'
    ).length;
    const submittedCount = Data.assignmentInstances.filter(ai =>
      ai.courseInstanceId === courseInstanceId &&
      ai.studentId === enrollment.studentId &&
      ai.status === 'submitted'
    ).length;

    // Risk level based on progress (Brightspace pattern)
    let riskLevel = 'green';
    let riskLabel = 'В норме';
    if (enrollment.progress < 50) {
      riskLevel = 'red';
      riskLabel = 'Отстаёт';
    } else if (enrollment.progress < 80) {
      riskLevel = 'yellow';
      riskLabel = 'Внимание';
    }

    return {
      enrollment,
      student,
      completedCount,
      submittedCount,
      riskLevel,
      riskLabel
    };
  });

  return `
    <div style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th style="min-width:180px;">Студент</th>
            <th style="width:100px; text-align:center;">Прогресс</th>
            <th style="width:100px; text-align:center;">Задания</th>
            <th style="width:100px; text-align:center;">На проверке</th>
            <th style="width:90px; text-align:center;">Статус</th>
            <th style="width:100px; text-align:center;">Действия</th>
          </tr>
        </thead>
        <tbody>
          ${studentsData.map(data => `
            <tr>
              <td>
                <div style="font-weight:500; font-size:13px;">${data.student?.name || 'Неизвестный'}</div>
                <div style="font-size:11px; color:#6b7280;">${data.student?.email || ''}</div>
              </td>
              <td style="text-align:center;">
                <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                  <span style="font-weight:600; font-size:14px;">${data.enrollment.progress}%</span>
                  <div class="progress-bar" style="width:60px; height:4px;">
                    <div class="progress-bar-fill" style="width:${data.enrollment.progress}%;"></div>
                  </div>
                </div>
              </td>
              <td style="text-align:center;">
                <span style="font-weight:500;">${data.completedCount}</span>
                <span style="color:#6b7280;">/${assignments.length}</span>
              </td>
              <td style="text-align:center;">
                ${data.submittedCount > 0 ? `
                  <span style="color:#f97316; font-weight:500;">${data.submittedCount}</span>
                ` : `
                  <span style="color:#9ca3af;">0</span>
                `}
              </td>
              <td style="text-align:center;">
                <span class="tag" style="background:${data.riskLevel === 'green' ? '#dcfce7' : data.riskLevel === 'yellow' ? '#fef3c7' : '#fee2e2'}; color:${data.riskLevel === 'green' ? '#166534' : data.riskLevel === 'yellow' ? '#92400e' : '#991b1b'}; font-size:10px;">
                  ${data.riskLabel}
                </span>
              </td>
              <td style="text-align:center;">
                <button class="btn btn-sm btn-ghost" style="font-size:11px; padding:4px 8px;"
                        onclick="openStudentDetailModal('${courseInstanceId}', '${data.enrollment.studentId}')">
                  Подробнее
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderStudentAssignmentsList(courseInstanceId, studentId, assignments) {
  return `
    <div style="display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto;">
      ${assignments.map(assignment => {
        const ai = Data.getAssignmentInstance(courseInstanceId, assignment.id, studentId);
        const isInPerson = assignment.deliveryMode === 'in_person';

        let statusBadge = '<span class="pill status-draft">Не начато</span>';
        if (ai) {
          if (ai.status === 'submitted') statusBadge = '<span class="pill status-submitted">На проверке</span>';
          else if (ai.status === 'accepted') statusBadge = `<span class="pill status-accepted">${ai.grade || '✓'}</span>`;
          else if (ai.status === 'needs_revision') statusBadge = '<span class="pill status-needs_revision">На доработке</span>';
        }

        return `
          <div style="padding:10px; background:#f9fafb; border-radius:8px; border:1px solid var(--color-border);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="flex:1;">
                <div style="font-size:12px; font-weight:500;">${assignment.order}. ${assignment.title}</div>
                <div style="font-size:11px; color:#6b7280; margin-top:2px;">
                  ${isInPerson ? '📍 Очное' : '💻 Самостоятельное'}
                  ${ai?.submittedAt ? ` · Сдано: ${Data.formatDate(ai.submittedAt)}` : ''}
                </div>
              </div>
              ${statusBadge}
            </div>

            ${ai && (ai.status === 'submitted' || isInPerson) ? `
              <div style="margin-top:8px; display:flex; gap:8px;">
                ${isInPerson && !ai?.attended ? `
                  <button class="btn btn-sm" style="font-size:11px; padding:4px 8px;"
                          onclick="showQuickAttendance('${courseInstanceId}', '${assignment.id}', '${studentId}')">
                    Посещение
                  </button>
                ` : ''}
                ${ai?.status === 'submitted' ? `
                  <button class="btn btn-primary btn-sm" style="font-size:11px; padding:4px 8px;"
                          onclick="showQuickGrade('${courseInstanceId}', '${assignment.id}', '${studentId}')">
                    Оценить
                  </button>
                ` : ''}
              </div>
            ` : ''}

            ${isInPerson && ai?.attended !== undefined ? `
              <div style="margin-top:6px; font-size:11px;">
                Посещение: ${ai.attended ? '<span style="color:#16a34a;">✓ Присутствовал</span>' : '<span style="color:#dc2626;">✗ Отсутствовал</span>'}
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function selectStudent(studentId, courseInstanceId) {
  selectedStudentId = studentId;
  navigateTo('teacherCourseDetail', courseInstanceId);
}

// ============================================================================
// ВКЛАДКА ЗАДАНИЯ (TABLE VIEW WITH MODALS)
// ============================================================================

function renderAssignmentsTab(courseInstanceId, enrollments, assignments) {
  return `
    <div style="font-weight:500; margin-bottom:12px;">Список заданий (${assignments.length})</div>
    ${renderAssignmentsTable(courseInstanceId, enrollments, assignments)}
  `;
}

/**
 * Render assignments as a table (converted from cards)
 */
function renderAssignmentsTable(courseInstanceId, enrollments, assignments) {
  if (assignments.length === 0) {
    return `
      <div style="text-align:center; padding:30px; color:#9ca3af;">
        Нет заданий в курсе
      </div>
    `;
  }

  // Calculate stats for each assignment
  const assignmentsData = assignments.map(assignment => {
    const isInPerson = assignment.deliveryMode === 'in_person';
    let submitted = 0, accepted = 0, notStarted = 0, attended = 0;

    enrollments.forEach(enrollment => {
      const ai = Data.getAssignmentInstance(courseInstanceId, assignment.id, enrollment.studentId);
      if (ai) {
        if (ai.status === 'submitted') submitted++;
        else if (ai.status === 'accepted') accepted++;
        if (ai.attended) attended++;
      } else {
        notStarted++;
      }
    });

    const completionRate = enrollments.length > 0 ? Math.round((accepted / enrollments.length) * 100) : 0;

    return {
      assignment,
      isInPerson,
      submitted,
      accepted,
      notStarted,
      attended,
      completionRate
    };
  });

  return `
    <div style="overflow-x:auto;">
      <table class="data-table">
        <thead>
          <tr>
            <th style="width:40px; text-align:center;">№</th>
            <th style="min-width:200px;">Задание</th>
            <th style="width:100px; text-align:center;">Тип</th>
            <th style="width:80px; text-align:center;">Баллы</th>
            <th style="width:100px; text-align:center;">Выполнено</th>
            <th style="width:90px; text-align:center;">На проверке</th>
            <th style="width:100px; text-align:center;">Действия</th>
          </tr>
        </thead>
        <tbody>
          ${assignmentsData.map(data => `
            <tr>
              <td style="text-align:center;">
                <span style="width:24px; height:24px; background:#e5e7eb; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:11px; font-weight:600;">
                  ${data.assignment.order}
                </span>
              </td>
              <td>
                <div style="font-weight:500; font-size:13px;">${data.assignment.title}</div>
                <div style="font-size:11px; color:#6b7280;">
                  ${data.isInPerson ? '📍 Очное' : '💻 Самостоятельное'}
                  ${data.isInPerson ? ` · ${data.attended}/${enrollments.length} посетили` : ''}
                </div>
              </td>
              <td style="text-align:center;">
                <span class="tag" style="font-size:10px;">${Data.formatAssignmentType(data.assignment.type)}</span>
              </td>
              <td style="text-align:center; font-weight:500;">
                ${data.assignment.maxScore}
              </td>
              <td style="text-align:center;">
                <div style="display:flex; flex-direction:column; align-items:center; gap:2px;">
                  <span style="font-weight:500; color:#16a34a;">${data.accepted}</span>
                  <span style="font-size:10px; color:#6b7280;">/${enrollments.length} (${data.completionRate}%)</span>
                </div>
              </td>
              <td style="text-align:center;">
                ${data.submitted > 0 ? `
                  <span style="background:#fff7ed; color:#c2410c; padding:2px 8px; border-radius:999px; font-size:11px; font-weight:500;">
                    ${data.submitted}
                  </span>
                ` : `
                  <span style="color:#9ca3af;">—</span>
                `}
              </td>
              <td style="text-align:center;">
                <button class="btn btn-sm btn-ghost" style="font-size:11px; padding:4px 8px;"
                        onclick="openAssignmentDetailModal('${courseInstanceId}', '${data.assignment.id}')">
                  Подробнее
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderAssignmentStudentsList(courseInstanceId, assignmentId, enrollments, assignment) {
  const isInPerson = assignment?.deliveryMode === 'in_person';

  return `
    <div style="font-size:13px; margin-bottom:12px; font-weight:500;">Студенты</div>
    <div style="display:flex; flex-direction:column; gap:8px; max-height:400px; overflow-y:auto;">
      ${enrollments.map(enrollment => {
        const student = Data.getUserById(enrollment.studentId);
        const ai = Data.getAssignmentInstance(courseInstanceId, assignmentId, enrollment.studentId);

        let statusText = 'Не начато';
        let statusColor = '#9ca3af';
        if (ai) {
          if (ai.status === 'submitted') { statusText = 'На проверке'; statusColor = '#f97316'; }
          else if (ai.status === 'accepted') { statusText = `Принято: ${ai.grade}`; statusColor = '#16a34a'; }
          else if (ai.status === 'needs_revision') { statusText = 'На доработке'; statusColor = '#ef4444'; }
        }

        return `
          <div style="padding:10px; background:#f9fafb; border-radius:8px; border:1px solid var(--color-border);">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:12px; font-weight:500;">${student?.name || 'Неизвестный'}</div>
                <div style="font-size:11px; color:${statusColor}; margin-top:2px;">${statusText}</div>
                ${isInPerson ? `
                  <div style="font-size:11px; margin-top:2px;">
                    ${ai?.attended === true ? '<span style="color:#16a34a;">✓ Присутствовал</span>' :
                      ai?.attended === false ? '<span style="color:#dc2626;">✗ Отсутствовал</span>' :
                      '<span style="color:#9ca3af;">Посещение не отмечено</span>'}
                  </div>
                ` : ''}
              </div>

              <div style="display:flex; gap:4px;">
                ${isInPerson && ai?.attended === undefined ? `
                  <button class="btn btn-sm" style="font-size:10px; padding:3px 6px;"
                          onclick="showQuickAttendance('${courseInstanceId}', '${assignmentId}', '${enrollment.studentId}')">
                    📍
                  </button>
                ` : ''}
                ${ai?.status === 'submitted' ? `
                  <button class="btn btn-primary btn-sm" style="font-size:10px; padding:3px 6px;"
                          onclick="showQuickGrade('${courseInstanceId}', '${assignmentId}', '${enrollment.studentId}')">
                    Оценить
                  </button>
                ` : !ai || ai.status === 'draft' ? `
                  <button class="btn btn-sm" style="font-size:10px; padding:3px 6px;"
                          onclick="showQuickGrade('${courseInstanceId}', '${assignmentId}', '${enrollment.studentId}')">
                    Оценка
                  </button>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function selectAssignment(assignmentId, courseInstanceId) {
  selectedAssignmentId = assignmentId;
  navigateTo('teacherCourseDetail', courseInstanceId);
}

// ============================================================================
// ЗАДАНИЯ ПО ВСЕМ КУРСАМ
// ============================================================================

function renderTeacherAllAssignments() {
  const user = getCurrentUser();
  const myCourses = Data.courseInstances.filter(ci => ci.teacherId === user.id);

  // Собираем все задания по всем курсам
  const allAssignmentsData = [];
  myCourses.forEach(instance => {
    const template = Data.getCourseTemplate(instance.courseTemplateId);
    const enrollments = Data.getEnrollmentsByCourse(instance.id);
    const assignments = Data.getAssignmentTemplatesForCourse(template.id);

    assignments.forEach(assignment => {
      let submitted = 0, accepted = 0, attended = 0;
      enrollments.forEach(enrollment => {
        const ai = Data.getAssignmentInstance(instance.id, assignment.id, enrollment.studentId);
        if (ai) {
          if (ai.status === 'submitted') submitted++;
          if (ai.status === 'accepted') accepted++;
          if (ai.attended) attended++;
        }
      });

      allAssignmentsData.push({
        assignment,
        instance,
        template,
        enrollments,
        submitted,
        accepted,
        attended,
        total: enrollments.length
      });
    });
  });

  // Сортируем: сначала те, что на проверке
  allAssignmentsData.sort((a, b) => b.submitted - a.submitted);

  return `
    ${renderBreadcrumbs([
      { label: "Личный кабинет", onClick: "navigateTo('teacherDashboard')" },
      { label: "Задания" }
    ])}

    <div class="main-header">
      <div>
        <h1 class="main-title">Задания</h1>
        <div class="main-subtitle">Все задания по всем курсам</div>
      </div>
    </div>

    <div style="display:flex; flex-direction:column; gap:8px; margin-top:16px;">
      ${allAssignmentsData.map(data => {
        const isInPerson = data.assignment.deliveryMode === 'in_person';

        return `
          <div class="card" style="padding:12px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="flex:1;">
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-weight:500; font-size:13px;">${data.assignment.title}</span>
                  ${isInPerson ? '<span class="tag" style="background:#fef3c7; color:#92400e; font-size:9px;">Очное</span>' : ''}
                </div>
                <div style="font-size:11px; color:#6b7280; margin-top:4px;">
                  ${data.template.title} · ${data.instance.cohort}
                </div>
              </div>

              <button class="btn btn-sm" onclick="openAssignmentDetailModal('${data.instance.id}', '${data.assignment.id}')">
                Подробнее
              </button>
            </div>

            <div style="margin-top:8px; display:flex; gap:16px; font-size:11px;">
              ${data.submitted > 0 ? `<span style="color:#f97316; font-weight:500;">⏳ ${data.submitted} на проверке</span>` : ''}
              <span style="color:#16a34a;">✓ ${data.accepted}/${data.total} принято</span>
              ${isInPerson ? `<span>📍 ${data.attended}/${data.total} посетили</span>` : ''}
            </div>
          </div>
        `;
      }).join('')}

      ${allAssignmentsData.length === 0 ? `
        <div class="card" style="text-align:center; padding:40px;">
          <div style="font-size:40px; margin-bottom:12px;">📝</div>
          <div style="font-weight:500;">Нет заданий</div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// МОДАЛЬНЫЕ ОКНА ДЛЯ ОЦЕНКИ И ПОСЕЩЕНИЯ
// ============================================================================

function showQuickAttendance(courseInstanceId, assignmentId, studentId) {
  const student = Data.getUserById(studentId);
  const assignment = Data.getAssignmentTemplate(assignmentId);

  const content = `
    <div style="font-size:13px; margin-bottom:16px;">
      <strong>Студент:</strong> ${student?.name || 'Неизвестный'}<br>
      <strong>Задание:</strong> ${assignment?.title || 'Неизвестное'}
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

function showQuickGrade(courseInstanceId, assignmentId, studentId) {
  const student = Data.getUserById(studentId);
  const assignment = Data.getAssignmentTemplate(assignmentId);
  const ai = Data.getAssignmentInstance(courseInstanceId, assignmentId, studentId);

  const content = `
    <div style="font-size:13px; margin-bottom:16px;">
      <strong>Студент:</strong> ${student?.name || 'Неизвестный'}<br>
      <strong>Задание:</strong> ${assignment?.title || 'Неизвестное'}
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

// Legacy function for backward compatibility
function renderGradebook(courseInstanceId) {
  return renderTeacherCourseDetail(courseInstanceId);
}

// ============================================================================
// MODAL DIALOGS FOR STUDENT/ASSIGNMENT DETAILS
// ============================================================================

/**
 * Open modal with student details (all assignments for this student)
 */
function openStudentDetailModal(courseInstanceId, studentId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const enrollment = Data.enrollments.find(e => e.courseInstanceId === courseInstanceId && e.studentId === studentId);
  const student = Data.getUserById(studentId);
  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  // Get all assignment instances for this student
  const assignmentData = assignments.map(assignment => {
    const ai = Data.getAssignmentInstance(courseInstanceId, assignment.id, studentId);
    return { assignment, instance: ai };
  });

  const completedCount = assignmentData.filter(d => d.instance?.status === 'accepted').length;
  const submittedCount = assignmentData.filter(d => d.instance?.status === 'submitted').length;

  const content = `
    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div>
          <div style="font-size:11px; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em;">Студент</div>
          <div style="font-weight:600; font-size:16px;">${student?.name || 'Неизвестный'}</div>
          <div style="font-size:12px; color:#6b7280;">${student?.email || ''}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:32px; font-weight:700; color:var(--color-primary);">${enrollment?.progress || 0}%</div>
          <div style="font-size:11px; color:#6b7280;">Общий прогресс</div>
        </div>
      </div>

      <!-- Stats -->
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:16px;">
        <div style="text-align:center; padding:10px; background:#f0fdf4; border-radius:8px;">
          <div style="font-size:18px; font-weight:600; color:#16a34a;">${completedCount}</div>
          <div style="font-size:10px; color:#6b7280;">Выполнено</div>
        </div>
        <div style="text-align:center; padding:10px; background:#fff7ed; border-radius:8px;">
          <div style="font-size:18px; font-weight:600; color:#c2410c;">${submittedCount}</div>
          <div style="font-size:10px; color:#6b7280;">На проверке</div>
        </div>
        <div style="text-align:center; padding:10px; background:#f3f4f6; border-radius:8px;">
          <div style="font-size:18px; font-weight:600; color:#6b7280;">${assignments.length - completedCount - submittedCount}</div>
          <div style="font-size:10px; color:#6b7280;">Осталось</div>
        </div>
      </div>
    </div>

    <!-- Assignments list -->
    <div style="font-weight:500; font-size:13px; margin-bottom:8px;">Задания</div>
    <div style="max-height:300px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
      ${assignmentData.map(data => {
        const ai = data.instance;
        const assignment = data.assignment;
        const isInPerson = assignment.deliveryMode === 'in_person';

        let statusBadge = '<span class="pill status-draft" style="font-size:10px;">Не начато</span>';
        let statusColor = '#9ca3af';
        if (ai) {
          if (ai.status === 'submitted') {
            statusBadge = '<span class="pill status-submitted" style="font-size:10px;">На проверке</span>';
            statusColor = '#f97316';
          } else if (ai.status === 'accepted') {
            statusBadge = `<span class="pill status-accepted" style="font-size:10px;">${ai.grade || '✓'}</span>`;
            statusColor = '#16a34a';
          } else if (ai.status === 'needs_revision') {
            statusBadge = '<span class="pill status-needs_revision" style="font-size:10px;">На доработке</span>';
            statusColor = '#ef4444';
          }
        }

        return `
          <div style="padding:10px; background:#f9fafb; border-radius:8px; border-left:3px solid ${statusColor};">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
              <div style="flex:1;">
                <div style="font-size:12px; font-weight:500;">${assignment.order}. ${assignment.title}</div>
                <div style="font-size:11px; color:#6b7280; margin-top:2px;">
                  ${isInPerson ? '📍 Очное' : '💻 Самостоятельное'}
                  ${ai?.submittedAt ? ` · Сдано: ${Data.formatDate(ai.submittedAt)}` : ''}
                </div>
              </div>
              ${statusBadge}
            </div>

            ${ai && ai.status === 'submitted' ? `
              <div style="margin-top:8px;">
                <button class="btn btn-primary btn-sm" style="font-size:11px; padding:4px 8px;"
                        onclick="closeModal(); showQuickGrade('${courseInstanceId}', '${assignment.id}', '${studentId}')">
                  Оценить
                </button>
              </div>
            ` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;

  openModal(`Студент: ${student?.name || 'Неизвестный'}`, content, [
    { label: 'Закрыть', className: 'btn-ghost', onClick: 'closeModal()' }
  ]);
}

/**
 * Open modal with assignment details (like student view but with grading)
 */
function openAssignmentDetailModal(courseInstanceId, assignmentId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const assignment = Data.getAssignmentTemplate(assignmentId);
  const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);
  const isInPerson = assignment?.deliveryMode === 'in_person';

  // Calculate stats
  let submitted = 0, accepted = 0, notStarted = 0, needsRevision = 0, attended = 0;
  const studentsData = enrollments.map(enrollment => {
    const student = Data.getUserById(enrollment.studentId);
    const ai = Data.getAssignmentInstance(courseInstanceId, assignmentId, enrollment.studentId);

    if (ai) {
      if (ai.status === 'submitted') submitted++;
      else if (ai.status === 'accepted') accepted++;
      else if (ai.status === 'needs_revision') needsRevision++;
      if (ai.attended) attended++;
    } else {
      notStarted++;
    }

    return { enrollment, student, ai };
  });

  const completionRate = enrollments.length > 0 ? Math.round((accepted / enrollments.length) * 100) : 0;

  const content = `
    <!-- Header with title and stats -->
    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
            <span style="font-weight:600; font-size:16px;">${assignment?.title || 'Неизвестное'}</span>
            ${isInPerson ? '<span class="tag" style="background:#fef3c7; color:#92400e; font-size:10px;">Очное</span>' : ''}
          </div>
          <div style="font-size:12px; color:#6b7280;">
            ${template.title} · ${instance.cohort}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:28px; font-weight:700; color:#16a34a;">${completionRate}%</div>
          <div style="font-size:10px; color:#6b7280;">выполнено</div>
        </div>
      </div>

      <!-- Meta info -->
      <div style="display:flex; gap:12px; font-size:12px; color:#6b7280; margin-bottom:12px;">
        <span>${Data.formatAssignmentType(assignment?.type)}</span>
        <span>·</span>
        <span>${assignment?.maxScore || 0} баллов</span>
        <span>·</span>
        <span>${assignment?.isMandatory ? 'Обязательное' : 'Необязательное'}</span>
      </div>

      <!-- Stats cards -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:12px;">
        <div style="text-align:center; padding:8px; background:#f0fdf4; border-radius:6px;">
          <div style="font-size:16px; font-weight:600; color:#16a34a;">${accepted}</div>
          <div style="font-size:9px; color:#6b7280;">Принято</div>
        </div>
        <div style="text-align:center; padding:8px; background:#fff7ed; border-radius:6px;">
          <div style="font-size:16px; font-weight:600; color:#c2410c;">${submitted}</div>
          <div style="font-size:9px; color:#6b7280;">На проверке</div>
        </div>
        <div style="text-align:center; padding:8px; background:#fef2f2; border-radius:6px;">
          <div style="font-size:16px; font-weight:600; color:#dc2626;">${needsRevision}</div>
          <div style="font-size:9px; color:#6b7280;">Доработка</div>
        </div>
        <div style="text-align:center; padding:8px; background:#f3f4f6; border-radius:6px;">
          <div style="font-size:16px; font-weight:600; color:#6b7280;">${notStarted}</div>
          <div style="font-size:9px; color:#6b7280;">Не начато</div>
        </div>
      </div>
    </div>

    <!-- Assignment description (like student view) -->
    ${assignment?.description ? `
      <div style="margin-bottom:12px;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#9ca3af; margin-bottom:4px;">Описание задания</div>
        <div style="font-size:13px; line-height:1.5; color:#374151; padding:10px; background:#f9fafb; border-radius:6px;">
          ${assignment.description}
        </div>
      </div>
    ` : ''}

    <!-- Materials (like student view) -->
    ${assignment?.materials && assignment.materials.length > 0 ? `
      <div style="margin-bottom:12px;">
        <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#9ca3af; margin-bottom:4px;">Материалы</div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          ${assignment.materials.map(m => `
            <a href="${m.url}" target="_blank" style="font-size:12px; color:#2563eb; text-decoration:none; display:flex; align-items:center; gap:6px;">
              📎 ${m.title}
            </a>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Submission types info -->
    <div style="margin-bottom:16px;">
      <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:#9ca3af; margin-bottom:4px;">Формат сдачи</div>
      <div style="display:flex; gap:8px; flex-wrap:wrap;">
        ${(assignment?.submissionType || []).map(type => {
          const typeLabels = { text: '📝 Текст', file: '📁 Файл', link: '🔗 Ссылка' };
          return `<span class="tag" style="font-size:11px;">${typeLabels[type] || type}</span>`;
        }).join('')}
      </div>
    </div>

    <!-- Students list -->
    <div style="font-weight:500; font-size:13px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
      <span>Студенты (${enrollments.length})</span>
      ${submitted > 0 ? `<span style="font-size:11px; color:#f97316; font-weight:normal;">⏳ ${submitted} ожидают проверки</span>` : ''}
    </div>
    <div style="max-height:250px; overflow-y:auto; display:flex; flex-direction:column; gap:6px;">
      ${studentsData.map(data => {
        const ai = data.ai;
        const student = data.student;

        let statusText = 'Не начато';
        let statusColor = '#9ca3af';
        let bgColor = '#f3f4f6';
        if (ai) {
          if (ai.status === 'submitted') { statusText = 'На проверке'; statusColor = '#f97316'; bgColor = '#fff7ed'; }
          else if (ai.status === 'accepted') { statusText = `Оценка: ${ai.grade}/${assignment?.maxScore || 100}`; statusColor = '#16a34a'; bgColor = '#f0fdf4'; }
          else if (ai.status === 'needs_revision') { statusText = 'На доработке'; statusColor = '#ef4444'; bgColor = '#fef2f2'; }
          else if (ai.status === 'draft') { statusText = 'Черновик'; statusColor = '#6b7280'; bgColor = '#f9fafb'; }
        }

        return `
          <div style="padding:10px; background:${bgColor}; border-radius:8px; border-left:3px solid ${statusColor};">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="flex:1;">
                <div style="font-size:12px; font-weight:500;">${student?.name || 'Неизвестный'}</div>
                <div style="font-size:11px; color:${statusColor}; margin-top:2px;">${statusText}</div>
                ${isInPerson ? `
                  <div style="font-size:10px; margin-top:2px;">
                    ${ai?.attended === true ? '<span style="color:#16a34a;">✓ Присутствовал</span>' :
                      ai?.attended === false ? '<span style="color:#dc2626;">✗ Отсутствовал</span>' :
                      '<span style="color:#9ca3af;">Посещение не отмечено</span>'}
                  </div>
                ` : ''}
                ${ai?.submittedAt ? `<div style="font-size:10px; color:#9ca3af; margin-top:2px;">Сдано: ${Data.formatDate(ai.submittedAt)}</div>` : ''}
              </div>

              <div style="display:flex; gap:4px;">
                ${isInPerson && ai?.attended === undefined ? `
                  <button class="btn btn-sm" style="font-size:10px; padding:3px 6px;"
                          onclick="closeModal(); showQuickAttendance('${courseInstanceId}', '${assignmentId}', '${data.enrollment.studentId}')">
                    📍 Посещение
                  </button>
                ` : ''}
                ${ai?.status === 'submitted' ? `
                  <button class="btn btn-primary btn-sm" style="font-size:10px; padding:4px 10px;"
                          onclick="closeModal(); showQuickGrade('${courseInstanceId}', '${assignmentId}', '${data.enrollment.studentId}')">
                    ✓ Оценить
                  </button>
                ` : ai?.status === 'accepted' ? `
                  <button class="btn btn-ghost btn-sm" style="font-size:10px; padding:3px 6px;"
                          onclick="closeModal(); showQuickGrade('${courseInstanceId}', '${assignmentId}', '${data.enrollment.studentId}')">
                    Изменить
                  </button>
                ` : `
                  <button class="btn btn-sm" style="font-size:10px; padding:3px 6px;"
                          onclick="closeModal(); showQuickGrade('${courseInstanceId}', '${assignmentId}', '${data.enrollment.studentId}')">
                    Оценка
                  </button>
                `}
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  openModal(`${assignment?.title || 'Задание'}`, content, [
    { label: 'Закрыть', className: 'btn-ghost', onClick: 'closeModal()' }
  ], 'large');
}

/**
 * Extended openModal with size option
 */
function openModalLarge(title, content, actions) {
  openModal(title, content, actions, 'large');
}

// ============================================================================
// U20: CLASS PROGRESS DASHBOARD (Students × Progress Matrix)
// ============================================================================

/**
 * Add "Class Progress" tab to teacher course detail sidebar
 */
function renderClassProgressTab(courseInstanceId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);
  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  if (enrollments.length === 0) {
    return `
      <div style="text-align:center; padding:30px; color:#9ca3af;">
        Нет записанных студентов
      </div>
    `;
  }

  // Build matrix data
  const matrixData = enrollments.map(enrollment => {
    const student = Data.getUserById(enrollment.studentId);
    const assignmentStatuses = assignments.map(assignment => {
      const ai = Data.getAssignmentInstance(courseInstanceId, assignment.id, enrollment.studentId);
      return {
        assignment,
        status: ai?.status || 'not_started',
        grade: ai?.grade,
        attended: ai?.attended
      };
    });

    // Risk calculation
    let riskLevel = 'green';
    if (enrollment.progress < 50) riskLevel = 'red';
    else if (enrollment.progress < 80) riskLevel = 'yellow';

    return {
      enrollment,
      student,
      assignmentStatuses,
      riskLevel
    };
  });

  // Summary stats
  const totalStudents = enrollments.length;
  const avgProgress = Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalStudents);
  const atRiskCount = matrixData.filter(d => d.riskLevel === 'red').length;
  const onTrackCount = matrixData.filter(d => d.riskLevel === 'green').length;

  return `
    <!-- U20: Class Progress Summary -->
    <div style="margin-bottom:16px;">
      <div style="font-weight:600; font-size:14px; margin-bottom:12px;">📊 Прогресс группы</div>

      <!-- Summary cards -->
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:16px;">
        <div style="text-align:center; padding:12px; background:#f9fafb; border-radius:8px; border:1px solid var(--color-border);">
          <div style="font-size:24px; font-weight:700; color:var(--color-primary);">${avgProgress}%</div>
          <div style="font-size:10px; color:#6b7280;">Средний прогресс</div>
        </div>
        <div style="text-align:center; padding:12px; background:#f0fdf4; border-radius:8px; border:1px solid #86efac;">
          <div style="font-size:24px; font-weight:700; color:#16a34a;">${onTrackCount}</div>
          <div style="font-size:10px; color:#6b7280;">На треке (≥80%)</div>
        </div>
        <div style="text-align:center; padding:12px; background:#fef3c7; border-radius:8px; border:1px solid #fcd34d;">
          <div style="font-size:24px; font-weight:700; color:#92400e;">${totalStudents - onTrackCount - atRiskCount}</div>
          <div style="font-size:10px; color:#6b7280;">Внимание (50-79%)</div>
        </div>
        <div style="text-align:center; padding:12px; background:#fee2e2; border-radius:8px; border:1px solid #fca5a5;">
          <div style="font-size:24px; font-weight:700; color:#dc2626;">${atRiskCount}</div>
          <div style="font-size:10px; color:#6b7280;">Отстают (<50%)</div>
        </div>
      </div>
    </div>

    <!-- Progress Matrix (Students × Assignments) -->
    <div style="font-weight:600; font-size:13px; margin-bottom:8px;">Матрица прогресса</div>
    <div style="overflow-x:auto; border:1px solid var(--color-border); border-radius:8px;">
      <table class="gradebook-table" style="font-size:11px; margin:0;">
        <thead>
          <tr>
            <th style="position:sticky; left:0; background:#f9fafb; z-index:10; min-width:140px;">Студент</th>
            <th style="text-align:center; width:60px;">%</th>
            ${assignments.map(a => `
              <th style="text-align:center; min-width:40px; max-width:40px; writing-mode:vertical-rl; text-orientation:mixed; height:80px; font-size:10px;" title="${a.title}">
                ${a.order}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${matrixData.map(data => `
            <tr>
              <td style="position:sticky; left:0; background:#fff; z-index:5; border-right:2px solid var(--color-border);">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="width:8px; height:8px; border-radius:50%; background:${data.riskLevel === 'green' ? '#16a34a' : data.riskLevel === 'yellow' ? '#f59e0b' : '#dc2626'};"></span>
                  <span style="font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:120px;" title="${data.student?.name}">
                    ${data.student?.name || 'N/A'}
                  </span>
                </div>
              </td>
              <td style="text-align:center; font-weight:600; background:${data.riskLevel === 'green' ? '#f0fdf4' : data.riskLevel === 'yellow' ? '#fef3c7' : '#fee2e2'};">
                ${data.enrollment.progress}%
              </td>
              ${data.assignmentStatuses.map(as => {
                let cellBg = '#fff';
                let cellContent = '—';
                let cellColor = '#9ca3af';

                if (as.status === 'accepted') {
                  cellBg = '#dcfce7';
                  cellContent = as.grade || '✓';
                  cellColor = '#166534';
                } else if (as.status === 'submitted') {
                  cellBg = '#fef3c7';
                  cellContent = '⏳';
                  cellColor = '#92400e';
                } else if (as.status === 'needs_revision') {
                  cellBg = '#fee2e2';
                  cellContent = '↻';
                  cellColor = '#dc2626';
                } else if (as.status === 'draft') {
                  cellBg = '#f3f4f6';
                  cellContent = '✎';
                  cellColor = '#6b7280';
                }

                return `
                  <td style="text-align:center; background:${cellBg}; color:${cellColor}; font-weight:500; cursor:pointer;"
                      onclick="showQuickGrade('${courseInstanceId}', '${as.assignment.id}', '${data.enrollment.studentId}')"
                      title="${as.assignment.title}: ${as.status === 'accepted' ? 'Принято' : as.status === 'submitted' ? 'На проверке' : as.status === 'needs_revision' ? 'На доработке' : 'Не начато'}">
                    ${cellContent}
                  </td>
                `;
              }).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Legend -->
    <div style="margin-top:12px; padding:10px; background:#f9fafb; border-radius:6px; font-size:10px; display:flex; flex-wrap:wrap; gap:12px;">
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="width:16px; height:16px; background:#dcfce7; border-radius:3px; display:inline-flex; align-items:center; justify-content:center; color:#166534; font-size:9px;">✓</span>
        <span>Принято</span>
      </div>
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="width:16px; height:16px; background:#fef3c7; border-radius:3px; display:inline-flex; align-items:center; justify-content:center; color:#92400e; font-size:9px;">⏳</span>
        <span>На проверке</span>
      </div>
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="width:16px; height:16px; background:#fee2e2; border-radius:3px; display:inline-flex; align-items:center; justify-content:center; color:#dc2626; font-size:9px;">↻</span>
        <span>На доработке</span>
      </div>
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="width:16px; height:16px; background:#f3f4f6; border-radius:3px; display:inline-flex; align-items:center; justify-content:center; color:#6b7280; font-size:9px;">✎</span>
        <span>Черновик</span>
      </div>
      <div style="display:flex; align-items:center; gap:4px;">
        <span style="width:16px; height:16px; background:#fff; border:1px solid #e5e7eb; border-radius:3px; display:inline-flex; align-items:center; justify-content:center; color:#9ca3af; font-size:9px;">—</span>
        <span>Не начато</span>
      </div>
    </div>
  `;
}
