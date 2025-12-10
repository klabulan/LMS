// B3 Learning Portal - Teacher Screens Module
// Экраны для преподавателей

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
