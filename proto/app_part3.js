// ============================================================================
// B3 Learning Portal - TEACHER SCREENS (Part 3)
// ============================================================================
// Teacher Dashboard, Gradebook, Grading Modal, Student Communication, Course Management

// Access to global objects
const Data = window.LMSData;
const Auth = window.LMSAuth;

// ============================================================================
// TEACHER DASHBOARD
// ============================================================================

function renderTeacherDashboard() {
  const currentUser = Auth.currentUser;

  // Get all course instances taught by this teacher
  const myCourses = Data.courseInstances.filter(ci => ci.teacherId === currentUser.id);

  // Calculate stats for each course
  const courseStats = myCourses.map(instance => {
    const template = Data.getCourseTemplate(instance.courseTemplateId);
    const enrollments = Data.getEnrollmentsByCourse(instance.id);
    const assignments = Data.getAssignmentInstancesForCourse(instance.id);

    // Count pending submissions (submitted but not graded)
    const pendingCount = assignments.filter(ai => ai.status === 'submitted').length;

    // Count unread messages in course dialogs
    const courseDialogs = Data.getDialogsByCourse(instance.id);
    let unreadMessages = 0;
    courseDialogs.forEach(dialog => {
      const messages = Data.getMessagesForDialog(dialog.id);
      unreadMessages += messages.filter(m => !m.isRead && m.authorId !== currentUser.id).length;
    });

    return {
      instance,
      template,
      studentCount: enrollments.length,
      pendingCount,
      unreadMessages
    };
  });

  // Calculate overall stats
  const totalStudents = courseStats.reduce((sum, cs) => sum + cs.studentCount, 0);
  const totalPending = courseStats.reduce((sum, cs) => sum + cs.pendingCount, 0);
  const totalUnread = courseStats.reduce((sum, cs) => sum + cs.unreadMessages, 0);

  return `
    <div class="teacher-dashboard">
      <div class="dashboard-header">
        <h1>Мои курсы</h1>
        <div class="quick-stats">
          <div class="stat-card">
            <div class="stat-value">${totalStudents}</div>
            <div class="stat-label">Всего студентов</div>
          </div>
          <div class="stat-card alert">
            <div class="stat-value">${totalPending}</div>
            <div class="stat-label">На проверке</div>
          </div>
          <div class="stat-card ${totalUnread > 0 ? 'alert' : ''}">
            <div class="stat-value">${totalUnread}</div>
            <div class="stat-label">Непрочитанных сообщений</div>
          </div>
        </div>
      </div>

      <div class="course-grid">
        ${courseStats.map(cs => `
          <div class="course-card teacher-view">
            <div class="course-card-header">
              <h3>${cs.template.title}</h3>
              <span class="course-code">${cs.template.code}</span>
            </div>
            <div class="course-card-body">
              <div class="course-info">
                <div class="info-item">
                  <strong>Поток:</strong> ${cs.instance.cohort}
                </div>
                <div class="info-item">
                  <strong>Период:</strong> ${Data.formatDate(cs.instance.startDate)} - ${Data.formatDate(cs.instance.endDate)}
                </div>
                <div class="info-item">
                  <strong>Статус:</strong>
                  <span class="badge ${cs.instance.status === 'active' ? 'badge-success' : 'badge-secondary'}">
                    ${Data.formatStatusLabel(cs.instance.status)}
                  </span>
                </div>
              </div>

              <div class="course-stats-row">
                <div class="stat-item">
                  <span class="stat-icon">👥</span>
                  <span class="stat-text">${cs.studentCount} студентов</span>
                </div>
                ${cs.pendingCount > 0 ? `
                  <div class="stat-item alert">
                    <span class="stat-icon">⏳</span>
                    <span class="stat-text">${cs.pendingCount} на проверке</span>
                  </div>
                ` : ''}
                ${cs.unreadMessages > 0 ? `
                  <div class="stat-item alert">
                    <span class="stat-icon">💬</span>
                    <span class="stat-text">${cs.unreadMessages} новых сообщений</span>
                  </div>
                ` : ''}
              </div>
            </div>
            <div class="course-card-actions">
              <button class="btn btn-primary" onclick="navigateTo('gradebook', '${cs.instance.id}')">
                Журнал оценок
              </button>
              <button class="btn btn-secondary" onclick="navigateTo('teacher-communication', '${cs.instance.id}')">
                Сообщения
              </button>
              <button class="btn btn-secondary" onclick="navigateTo('course-management', '${cs.instance.id}')">
                Управление
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      ${courseStats.length === 0 ? `
        <div class="empty-state">
          <p>У вас пока нет активных курсов</p>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================================================
// GRADEBOOK
// ============================================================================

function renderGradebook(courseInstanceId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  if (!instance) {
    return '<div class="error">Курс не найден</div>';
  }

  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);
  const assignments = Data.getAssignmentTemplatesForCourse(template.id);

  // Sort assignments by order
  assignments.sort((a, b) => a.order - b.order);

  // Build gradebook matrix
  const gradebookData = enrollments.map(enrollment => {
    const student = Data.getUserById(enrollment.studentId);
    const assignmentGrades = assignments.map(assignment => {
      const ai = Data.getAssignmentInstance(courseInstanceId, assignment.id, enrollment.studentId);
      return {
        assignment,
        instance: ai,
        status: ai ? ai.status : 'draft',
        grade: ai ? ai.grade : null,
        maxScore: assignment.maxScore
      };
    });

    // Calculate totals
    const totalEarned = assignmentGrades.reduce((sum, ag) => sum + (ag.grade || 0), 0);
    const totalPossible = assignments.reduce((sum, a) => sum + a.maxScore, 0);
    const completionPercent = assignments.length > 0
      ? Math.round((assignmentGrades.filter(ag => ag.status === 'accepted').length / assignments.length) * 100)
      : 0;
    const avgScore = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;

    return {
      student,
      enrollment,
      assignmentGrades,
      totalEarned,
      totalPossible,
      completionPercent,
      avgScore
    };
  });

  // Calculate column totals
  const columnStats = assignments.map((assignment, idx) => {
    const allGrades = gradebookData
      .map(row => row.assignmentGrades[idx])
      .filter(ag => ag.grade !== null);

    const avgGrade = allGrades.length > 0
      ? Math.round(allGrades.reduce((sum, ag) => sum + ag.grade, 0) / allGrades.length)
      : 0;

    const completionRate = gradebookData.length > 0
      ? Math.round((allGrades.filter(ag => ag.status === 'accepted').length / gradebookData.length) * 100)
      : 0;

    return { avgGrade, completionRate };
  });

  return `
    <div class="gradebook-container">
      <div class="gradebook-header">
        <div>
          <button class="btn btn-back" onclick="navigateTo('teacher-dashboard')">← Назад</button>
          <h1>${template.title}</h1>
          <p class="course-meta">${template.code} | ${instance.cohort}</p>
        </div>
        <div class="gradebook-actions">
          <button class="btn btn-secondary" onclick="exportGradebook('${courseInstanceId}')">
            Экспорт в Excel
          </button>
        </div>
      </div>

      ${enrollments.length === 0 ? `
        <div class="empty-state">
          <p>Пока нет зачисленных студентов</p>
        </div>
      ` : `
        <div class="gradebook-scroll">
          <table class="gradebook-table">
            <thead>
              <tr>
                <th class="sticky-col student-col">Студент</th>
                ${assignments.map(a => `
                  <th class="assignment-col" title="${a.title}">
                    <div class="assignment-header">
                      <div class="assignment-title">${truncateText(a.title, 30)}</div>
                      <div class="assignment-meta">
                        ${a.maxScore} баллов
                      </div>
                    </div>
                  </th>
                `).join('')}
                <th class="total-col">Прогресс</th>
                <th class="total-col">Баллы</th>
              </tr>
            </thead>
            <tbody>
              ${gradebookData.map(row => `
                <tr class="student-row">
                  <td class="sticky-col student-col">
                    <div class="student-info">
                      <div class="student-name">${row.student.name}</div>
                      <div class="student-meta">${row.student.email}</div>
                    </div>
                  </td>
                  ${row.assignmentGrades.map(ag => `
                    <td class="grade-cell ${ag.status}"
                        onclick="openGradingModal('${ag.instance ? ag.instance.id : ''}', '${row.enrollment.id}', '${ag.assignment.id}')"
                        title="Нажмите для проверки">
                      ${renderGradeCell(ag)}
                    </td>
                  `).join('')}
                  <td class="total-col">
                    <div class="progress-cell">
                      <div class="progress-bar-mini">
                        <div class="progress-fill" style="width: ${row.completionPercent}%"></div>
                      </div>
                      <span class="progress-text">${row.completionPercent}%</span>
                    </div>
                  </td>
                  <td class="total-col">
                    <strong>${row.totalEarned}</strong> / ${row.totalPossible}
                    <div class="score-percent">(${row.avgScore}%)</div>
                  </td>
                </tr>
              `).join('')}

              <tr class="totals-row">
                <td class="sticky-col student-col"><strong>Средние показатели</strong></td>
                ${columnStats.map(stat => `
                  <td class="assignment-col">
                    <div class="column-stat">
                      <div>Сред. балл: <strong>${stat.avgGrade}</strong></div>
                      <div>Выполнено: ${stat.completionRate}%</div>
                    </div>
                  </td>
                `).join('')}
                <td class="total-col">
                  <strong>${Math.round(gradebookData.reduce((sum, row) => sum + row.completionPercent, 0) / gradebookData.length)}%</strong>
                </td>
                <td class="total-col">
                  <strong>${Math.round(gradebookData.reduce((sum, row) => sum + row.avgScore, 0) / gradebookData.length)}%</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gradebook-legend">
          <h4>Обозначения:</h4>
          <div class="legend-items">
            <div class="legend-item">
              <span class="status-indicator draft"></span>
              <span>Не начато</span>
            </div>
            <div class="legend-item">
              <span class="status-indicator submitted"></span>
              <span>Ожидает проверки</span>
            </div>
            <div class="legend-item">
              <span class="status-indicator accepted"></span>
              <span>Принято</span>
            </div>
            <div class="legend-item">
              <span class="status-indicator needs_revision"></span>
              <span>На доработку</span>
            </div>
          </div>
        </div>
      `}
    </div>

    <!-- Grading Modal Placeholder -->
    <div id="grading-modal" class="modal"></div>
  `;
}

function renderGradeCell(assignmentGrade) {
  const { status, grade, maxScore } = assignmentGrade;

  switch (status) {
    case 'draft':
      return `<span class="status-icon">−</span>`;

    case 'submitted':
      return `
        <div class="grade-content">
          <span class="status-icon">⏳</span>
          <span class="needs-grading">Проверить</span>
        </div>
      `;

    case 'accepted':
      return `
        <div class="grade-content">
          <span class="status-icon">✓</span>
          <span class="grade-value">${grade}/${maxScore}</span>
        </div>
      `;

    case 'needs_revision':
      return `
        <div class="grade-content">
          <span class="status-icon">↻</span>
          <span class="grade-value">${grade}/${maxScore}</span>
        </div>
      `;

    default:
      return `<span class="status-icon">?</span>`;
  }
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// ============================================================================
// GRADING MODAL
// ============================================================================

function openGradingModal(assignmentInstanceId, enrollmentId, assignmentTemplateId) {
  let assignmentInstance = null;
  let enrollment = null;
  let assignmentTemplate = null;

  // Get or create assignment instance
  if (assignmentInstanceId) {
    assignmentInstance = Data.getAssignmentInstanceById(assignmentInstanceId);
  }

  if (!assignmentInstance && enrollmentId && assignmentTemplateId) {
    // Create new assignment instance if it doesn't exist
    enrollment = Data.enrollments.find(e => e.id === enrollmentId);
    assignmentTemplate = Data.getAssignmentTemplate(assignmentTemplateId);

    if (enrollment && assignmentTemplate) {
      // This is a draft assignment - show info but don't allow grading yet
      const modal = document.getElementById('grading-modal');
      modal.innerHTML = renderGradingModalContent(null, enrollment, assignmentTemplate);
      modal.classList.add('active');
      return;
    }
  }

  if (!assignmentInstance) {
    alert('Задание не найдено');
    return;
  }

  enrollment = Data.enrollments.find(e => e.id === assignmentInstance.enrollmentId);
  assignmentTemplate = Data.getAssignmentTemplate(assignmentInstance.assignmentTemplateId);

  const modal = document.getElementById('grading-modal');
  modal.innerHTML = renderGradingModalContent(assignmentInstance, enrollment, assignmentTemplate);
  modal.classList.add('active');
}

function renderGradingModalContent(assignmentInstance, enrollment, assignmentTemplate) {
  const student = Data.getUserById(enrollment.studentId);
  const isDraft = !assignmentInstance || assignmentInstance.status === 'draft';

  return `
    <div class="modal-overlay" onclick="closeGradingModal()"></div>
    <div class="modal-content grading-modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h2>Проверка задания</h2>
        <button class="modal-close" onclick="closeGradingModal()">×</button>
      </div>

      <div class="modal-body">
        ${isDraft ? `
          <div class="alert alert-info">
            <p><strong>Студент еще не начал работу над заданием</strong></p>
            <p>Задание будет доступно для проверки после отправки студентом.</p>
          </div>
        ` : ''}

        <div class="grading-section">
          <h3>Информация</h3>
          <div class="info-grid">
            <div class="info-item">
              <label>Студент:</label>
              <div>${student.name} (${student.email})</div>
            </div>
            <div class="info-item">
              <label>Задание:</label>
              <div>${assignmentTemplate.title}</div>
            </div>
            <div class="info-item">
              <label>Модуль:</label>
              <div>${assignmentTemplate.module}</div>
            </div>
            <div class="info-item">
              <label>Тип:</label>
              <div>${Data.formatAssignmentType(assignmentTemplate.type)}</div>
            </div>
            ${!isDraft ? `
              <div class="info-item">
                <label>Отправлено:</label>
                <div>${Data.formatDateTime(assignmentInstance.submittedAt)}</div>
              </div>
              <div class="info-item">
                <label>Попытка:</label>
                <div>${assignmentInstance.attemptCount}</div>
              </div>
            ` : ''}
          </div>
        </div>

        ${!isDraft ? `
          <div class="grading-section">
            <h3>Работа студента</h3>

            ${assignmentInstance.submissionText ? `
              <div class="submission-block">
                <label>Текст ответа:</label>
                <div class="submission-text">${assignmentInstance.submissionText}</div>
              </div>
            ` : ''}

            ${assignmentInstance.submissionFiles && assignmentInstance.submissionFiles.length > 0 ? `
              <div class="submission-block">
                <label>Файлы:</label>
                <div class="file-list">
                  ${assignmentInstance.submissionFiles.map(file => `
                    <div class="file-item">
                      <span class="file-icon">📎</span>
                      <a href="${file.url}" target="_blank">${file.name}</a>
                      <span class="file-size">(${file.size})</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            ${assignmentInstance.submissionUrl ? `
              <div class="submission-block">
                <label>Ссылка:</label>
                <div>
                  <a href="${assignmentInstance.submissionUrl}" target="_blank" class="submission-link">
                    ${assignmentInstance.submissionUrl}
                  </a>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="grading-section">
            <h3>Оценка</h3>
            <form id="grading-form" onsubmit="submitGrade(event, '${assignmentInstance.id}')">
              <div class="form-group">
                <label for="grade-input">Баллы (максимум: ${assignmentTemplate.maxScore})</label>
                <input
                  type="number"
                  id="grade-input"
                  name="grade"
                  min="0"
                  max="${assignmentTemplate.maxScore}"
                  value="${assignmentInstance.grade || ''}"
                  required
                  class="form-control"
                />
              </div>

              <div class="form-group">
                <label for="status-select">Статус</label>
                <select id="status-select" name="status" class="form-control" required>
                  <option value="accepted" ${assignmentInstance.status === 'accepted' ? 'selected' : ''}>
                    Принято
                  </option>
                  <option value="needs_revision" ${assignmentInstance.status === 'needs_revision' ? 'selected' : ''}>
                    На доработку
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="feedback-input">Комментарий</label>
                <textarea
                  id="feedback-input"
                  name="feedback"
                  rows="4"
                  class="form-control"
                  placeholder="Оставьте развернутый комментарий для студента..."
                >${assignmentInstance.feedback || ''}</textarea>
              </div>

              ${assignmentInstance.status === 'accepted' || assignmentInstance.status === 'needs_revision' ? `
                <div class="alert alert-warning">
                  <p><strong>Внимание:</strong> Это задание уже было оценено ранее.</p>
                  <p>Оценка: ${assignmentInstance.grade}/${assignmentTemplate.maxScore},
                     Статус: ${Data.formatAssignmentStatusLabel(assignmentInstance.status)}</p>
                  <p>Вы можете изменить оценку, если необходимо.</p>
                </div>
              ` : ''}

              <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="closeGradingModal()">
                  Отмена
                </button>
                <button type="submit" class="btn btn-primary">
                  Сохранить оценку
                </button>
              </div>
            </form>
          </div>
        ` : `
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" onclick="closeGradingModal()">
              Закрыть
            </button>
          </div>
        `}
      </div>
    </div>
  `;
}

function closeGradingModal() {
  const modal = document.getElementById('grading-modal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.innerHTML = '';
  }, 300);
}

function submitGrade(event, assignmentInstanceId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const grade = parseInt(formData.get('grade'));
  const status = formData.get('status');
  const feedback = formData.get('feedback');

  const success = saveGrade(assignmentInstanceId, grade, feedback, status);

  if (success) {
    closeGradingModal();

    // Refresh gradebook view
    const currentView = getCurrentView();
    if (currentView && currentView.type === 'gradebook') {
      renderView(currentView.type, currentView.params);
    }

    alert('Оценка успешно сохранена!');
  } else {
    alert('Ошибка при сохранении оценки');
  }
}

function saveGrade(assignmentInstanceId, grade, feedback, status) {
  const ai = Data.getAssignmentInstanceById(assignmentInstanceId);
  if (!ai) return false;

  const currentUser = Auth.currentUser;

  // Update assignment instance
  ai.grade = grade;
  ai.feedback = feedback;
  ai.status = status;
  ai.gradedAt = new Date().toISOString();
  ai.gradedBy = currentUser.id;

  // Update enrollment total score and progress
  const enrollment = Data.enrollments.find(e => e.id === ai.enrollmentId);
  if (enrollment) {
    enrollment.totalScore = Data.calculateTotalScore(enrollment.id);
    enrollment.progress = Data.calculateProgress(enrollment.id);
    enrollment.lastActivityAt = new Date().toISOString();
  }

  // Create notification for student
  Data.notifications.push({
    id: `n-${Date.now()}`,
    userId: ai.studentId,
    title: status === 'accepted' ? 'Задание принято' : 'Задание требует доработки',
    message: `Задание "${Data.getAssignmentTemplate(ai.assignmentTemplateId).title}" проверено. Оценка: ${grade}`,
    type: status === 'accepted' ? 'success' : 'warning',
    link: `#assignment-${ai.id}`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  return true;
}

// ============================================================================
// TEACHER COMMUNICATION
// ============================================================================

function renderTeacherCommunication(courseInstanceId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  if (!instance) {
    return '<div class="error">Курс не найден</div>';
  }

  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const dialogs = Data.getDialogsByCourse(courseInstanceId);

  // Separate course-level and assignment-level dialogs
  const courseDialogs = dialogs.filter(d => d.type === 'course');
  const assignmentDialogs = dialogs.filter(d => d.type === 'assignment');

  return `
    <div class="communication-container">
      <div class="communication-header">
        <button class="btn btn-back" onclick="navigateTo('teacher-dashboard')">← Назад</button>
        <h1>Сообщения: ${template.title}</h1>
        <p class="course-meta">${template.code} | ${instance.cohort}</p>
      </div>

      <div class="communication-tabs">
        <button class="tab-btn active" onclick="switchCommTab('course')">
          Общий чат (${courseDialogs.length})
        </button>
        <button class="tab-btn" onclick="switchCommTab('assignments')">
          Обсуждения заданий (${assignmentDialogs.length})
        </button>
      </div>

      <div id="comm-tab-course" class="tab-content active">
        ${courseDialogs.length > 0 ? `
          ${courseDialogs.map(dialog => renderDialogCard(dialog, 'course')).join('')}
        ` : `
          <div class="empty-state">
            <p>Нет сообщений в общем чате</p>
          </div>
        `}
      </div>

      <div id="comm-tab-assignments" class="tab-content">
        ${assignmentDialogs.length > 0 ? `
          ${assignmentDialogs.map(dialog => renderDialogCard(dialog, 'assignment')).join('')}
        ` : `
          <div class="empty-state">
            <p>Нет обсуждений по заданиям</p>
          </div>
        `}
      </div>

      <div class="announcement-section">
        <h3>Отправить объявление всем студентам</h3>
        <form id="announcement-form" onsubmit="sendAnnouncement(event, '${courseInstanceId}')">
          <div class="form-group">
            <textarea
              id="announcement-text"
              name="announcement"
              rows="3"
              class="form-control"
              placeholder="Введите текст объявления..."
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Отправить объявление</button>
        </form>
      </div>
    </div>
  `;
}

function renderDialogCard(dialog, type) {
  const messages = Data.getMessagesForDialog(dialog.id);
  const lastMessage = messages[messages.length - 1];
  const unreadCount = messages.filter(m => !m.isRead && m.authorId !== Auth.currentUser.id).length;

  let dialogTitle = '';
  let dialogSubtitle = '';

  if (type === 'course') {
    dialogTitle = 'Общий чат курса';
    dialogSubtitle = `${dialog.participants.length} участников`;
  } else {
    const ai = Data.getAssignmentInstanceById(dialog.referenceId);
    if (ai) {
      const assignment = Data.getAssignmentTemplate(ai.assignmentTemplateId);
      const student = Data.getUserById(ai.studentId);
      dialogTitle = assignment.title;
      dialogSubtitle = `Студент: ${student.name}`;
    }
  }

  return `
    <div class="dialog-card" onclick="openDialogView('${dialog.id}')">
      <div class="dialog-header">
        <h4>${dialogTitle}</h4>
        ${unreadCount > 0 ? `<span class="unread-badge">${unreadCount}</span>` : ''}
      </div>
      <div class="dialog-subtitle">${dialogSubtitle}</div>
      ${lastMessage ? `
        <div class="dialog-preview">
          <div class="message-author">${Data.getUserById(lastMessage.authorId).name}:</div>
          <div class="message-text">${truncateText(lastMessage.text, 100)}</div>
          <div class="message-time">${Data.formatDateTimeShort(lastMessage.createdAt)}</div>
        </div>
      ` : ''}
    </div>
  `;
}

function switchCommTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  document.getElementById(`comm-tab-${tabName}`).classList.add('active');
}

function openDialogView(dialogId) {
  // TODO: Implement full dialog view with message history and reply form
  alert('Полный просмотр диалога будет реализован в следующей версии');
}

function sendAnnouncement(event, courseInstanceId) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const announcementText = formData.get('announcement');

  if (!announcementText.trim()) {
    alert('Введите текст объявления');
    return;
  }

  // Get course dialog
  const dialogs = Data.getDialogsByCourse(courseInstanceId);
  let courseDialog = dialogs.find(d => d.type === 'course');

  if (!courseDialog) {
    // Create course dialog if it doesn't exist
    const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);
    const instance = Data.getCourseInstance(courseInstanceId);

    courseDialog = {
      id: `dlg-course-${Date.now()}`,
      type: 'course',
      referenceId: courseInstanceId,
      courseId: courseInstanceId,
      participants: [instance.teacherId, ...enrollments.map(e => e.studentId)],
      isArchived: false,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString()
    };

    Data.dialogs.push(courseDialog);
  }

  // Add message
  const newMessage = {
    id: `msg-${Date.now()}`,
    dialogId: courseDialog.id,
    authorId: Auth.currentUser.id,
    text: announcementText,
    attachments: [],
    isRead: false,
    createdAt: new Date().toISOString(),
    editedAt: null
  };

  Data.messages.push(newMessage);
  courseDialog.lastMessageAt = new Date().toISOString();

  // Create notifications for all students
  const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);
  enrollments.forEach(enrollment => {
    Data.notifications.push({
      id: `n-${Date.now()}-${enrollment.studentId}`,
      userId: enrollment.studentId,
      title: 'Новое объявление преподавателя',
      message: truncateText(announcementText, 100),
      type: 'info',
      link: `#dialog-${courseDialog.id}`,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  });

  alert('Объявление отправлено всем студентам!');
  event.target.reset();
}

// ============================================================================
// COURSE MANAGEMENT
// ============================================================================

function renderCourseManagement(courseInstanceId) {
  const instance = Data.getCourseInstance(courseInstanceId);
  if (!instance) {
    return '<div class="error">Курс не найден</div>';
  }

  const template = Data.getCourseTemplate(instance.courseTemplateId);
  const enrollments = Data.getEnrollmentsByCourse(courseInstanceId);

  // Calculate summary stats
  const notStarted = enrollments.filter(e => e.status === 'not_started').length;
  const inProgress = enrollments.filter(e => e.status === 'in_progress').length;
  const completed = enrollments.filter(e => e.status === 'completed').length;
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0;

  return `
    <div class="course-management-container">
      <div class="management-header">
        <button class="btn btn-back" onclick="navigateTo('teacher-dashboard')">← Назад</button>
        <h1>Управление курсом: ${template.title}</h1>
        <p class="course-meta">${template.code} | ${instance.cohort}</p>
      </div>

      <div class="management-summary">
        <h3>Общая статистика</h3>
        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-value">${enrollments.length}</div>
            <div class="summary-label">Всего студентов</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${notStarted}</div>
            <div class="summary-label">Не начали</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${inProgress}</div>
            <div class="summary-label">В процессе</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${completed}</div>
            <div class="summary-label">Завершили</div>
          </div>
          <div class="summary-card">
            <div class="summary-value">${avgProgress}%</div>
            <div class="summary-label">Средний прогресс</div>
          </div>
        </div>
      </div>

      <div class="students-list-section">
        <h3>Список студентов</h3>
        ${enrollments.length > 0 ? `
          <table class="students-table">
            <thead>
              <tr>
                <th>ФИО</th>
                <th>Email</th>
                <th>Организация</th>
                <th>Прогресс</th>
                <th>Баллы</th>
                <th>Статус</th>
                <th>Последняя активность</th>
              </tr>
            </thead>
            <tbody>
              ${enrollments.map(enrollment => {
                const student = Data.getUserById(enrollment.studentId);
                return `
                  <tr>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.organization || '—'}</td>
                    <td>
                      <div class="progress-cell">
                        <div class="progress-bar-mini">
                          <div class="progress-fill" style="width: ${enrollment.progress}%"></div>
                        </div>
                        <span class="progress-text">${enrollment.progress}%</span>
                      </div>
                    </td>
                    <td><strong>${enrollment.totalScore}</strong></td>
                    <td>
                      <span class="badge ${enrollment.status === 'completed' ? 'badge-success' : enrollment.status === 'in_progress' ? 'badge-primary' : 'badge-secondary'}">
                        ${Data.formatStatusLabel(enrollment.status)}
                      </span>
                    </td>
                    <td>${Data.formatDateTimeShort(enrollment.lastActivityAt)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        ` : `
          <div class="empty-state">
            <p>Нет зачисленных студентов</p>
          </div>
        `}
      </div>

      <div class="course-info-section">
        <h3>Информация о курсе</h3>
        <div class="info-grid">
          <div class="info-item">
            <label>Код курса:</label>
            <div>${template.code}</div>
          </div>
          <div class="info-item">
            <label>Уровень:</label>
            <div>${Data.formatLevel(template.level)}</div>
          </div>
          <div class="info-item">
            <label>Период:</label>
            <div>${Data.formatDate(instance.startDate)} - ${Data.formatDate(instance.endDate)}</div>
          </div>
          <div class="info-item">
            <label>Максимум студентов:</label>
            <div>${instance.maxEnrollments}</div>
          </div>
          <div class="info-item">
            <label>Порог сертификата:</label>
            <div>${template.certificateThreshold}%</div>
          </div>
          <div class="info-item">
            <label>Оценочное время:</label>
            <div>${template.estimatedHours} часов</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

function exportGradebook(courseInstanceId) {
  // TODO: Implement Excel export using a library like SheetJS
  alert('Экспорт в Excel будет реализован в следующей версии');
}

// ============================================================================
// HELPER FUNCTIONS FOR VIEW MANAGEMENT
// ============================================================================

// These functions should be integrated with the main app navigation
// Assuming there's a global navigation system

function getCurrentView() {
  // This should return current view state from main app
  // Placeholder implementation
  if (window.currentView) {
    return window.currentView;
  }
  return null;
}

function renderView(viewType, params) {
  // This should be implemented in main app to re-render current view
  // Placeholder implementation
  if (window.renderCurrentView) {
    window.renderCurrentView(viewType, params);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Export teacher functions to global scope
window.TeacherView = {
  renderTeacherDashboard,
  renderGradebook,
  renderTeacherCommunication,
  renderCourseManagement,
  openGradingModal,
  closeGradingModal,
  submitGrade,
  saveGrade,
  sendAnnouncement,
  exportGradebook,
  switchCommTab,
  openDialogView
};

console.log('[Teacher Module] Loaded successfully');
