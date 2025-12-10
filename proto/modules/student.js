// B3 Learning Portal - Student Screens Module
// Экраны для студентов

function renderStudentDashboard() {
  const user = getCurrentUser();
  const enrollments = Data.getEnrollmentsByStudent(user.id).filter(e => e.status !== 'pending_approval');
  const upcomingDeadlines = Data.getUpcomingDeadlines(user.id, 5);

  // Get enrolled course IDs to filter recommendations
  const enrolledCourseIds = enrollments.map(e => {
    const course = Data.getCourseWithInstance(e.courseInstanceId);
    return course?.templateId;
  }).filter(Boolean);

  // Recommended courses (published courses not enrolled in)
  const recommendedCourses = Data.courseTemplates
    .filter(c => c.status === 'published' && !enrolledCourseIds.includes(c.id))
    .slice(0, 3);

  // Pending enrollments for approval requests section
  const pendingEnrollments = Data.enrollments.filter(
    e => e.studentId === user.id && e.status === 'pending_approval'
  );

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

                <div style="font-size:12px; color:#6b7280; margin-top:6px;">
                  ${course.status === 'active' ?
                    `Идёт с ${Data.formatDate(course.startDate)}` :
                    `Запланирован на ${Data.formatDate(course.startDate)}`
                  }
                </div>

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

        <!-- Заявки на рассмотрении -->
        ${pendingEnrollments.length > 0 ? `
          <h2 style="font-size:16px; font-weight:600; margin-bottom:12px; margin-top:24px;">
            Заявки на рассмотрении
          </h2>
          <div class="cards-grid" style="grid-template-columns:1fr;">
            ${pendingEnrollments.map(enrollment => {
              const instance = Data.getCourseInstance(enrollment.courseInstanceId);
              const template = Data.getCourseTemplate(instance.courseTemplateId);

              return `
                <div class="card" style="border:2px solid #fbbf24;">
                  <div class="card-header-line">
                    <div class="card-title">${template.title}</div>
                    <span class="pill" style="background:#fef3c7; color:#92400e;">
                      ${Data.formatStatusLabel('pending_approval')}
                    </span>
                  </div>
                  <div class="card-meta">${instance.cohort}</div>
                  <div style="font-size:12px; color:#6b7280; margin-top:8px;">
                    Подана: ${Data.formatDate(enrollment.enrolledAt)}
                  </div>
                  ${enrollment.requestComment ? `
                    <div style="margin-top:8px; padding:8px; background:#f9fafb; border-radius:8px; font-size:12px;">
                      <strong>Ваш комментарий:</strong><br>
                      ${enrollment.requestComment}
                    </div>
                  ` : ''}
                  <div style="margin-top:auto; padding-top:12px;">
                    <button class="btn btn-ghost btn-sm" onclick="cancelRequest('${enrollment.id}')">
                      Отменить заявку
                    </button>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        ` : ''}

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

  // Calculate progress by activity type (U18)
  const progressByType = calculateProgressByActivityType(assignments, assignmentInstances);

  // Calculate progress by module (U17)
  const progressByModule = calculateProgressByModule(assignments, assignmentInstances);

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

        <!-- U19: What's Next Indicator -->
        ${nextAssignment ? `
          <div style="margin: 12px 0; padding: 12px 16px; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); border-radius: 10px; border: 1px solid #bfdbfe;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">🎯</div>
              <div style="flex: 1;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 2px;">Следующий шаг</div>
                <div style="font-weight: 600; font-size: 14px; color: #1e40af;">${nextAssignment.title}</div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${Data.formatAssignmentType(nextAssignment.type)} • ${nextAssignment.maxScore} баллов</div>
              </div>
              <button class="btn btn-primary btn-sm" onclick="navigateTo('studentAssignment', '${courseInstanceId}', '${enrollmentId}', '${nextAssignment.id}')">
                Перейти →
              </button>
            </div>
          </div>
        ` : `
          <div style="margin: 12px 0; padding: 12px 16px; background: #f0fdf4; border-radius: 10px; border: 1px solid #86efac;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="font-size: 24px;">🎉</div>
              <div>
                <div style="font-weight: 600; font-size: 14px; color: #166534;">Курс завершён!</div>
                <div style="font-size: 12px; color: #6b7280;">Все задания выполнены</div>
              </div>
            </div>
          </div>
        `}

        <!-- U18: Progress by Activity Type -->
        <div style="margin: 16px 0; padding: 16px; background: #f9fafb; border-radius: 10px; border: 1px solid var(--color-border);">
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 12px;">📊 Прогресс по типам заданий</div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px;">
            ${progressByType.map(item => `
              <div style="text-align: center; padding: 12px; background: #fff; border-radius: 8px; border: 1px solid var(--color-border);">
                <div style="font-size: 20px; margin-bottom: 4px;">${item.icon}</div>
                <div style="font-size: 11px; color: #6b7280; margin-bottom: 4px;">${item.label}</div>
                <div style="font-weight: 600; font-size: 14px; color: ${item.completed === item.total ? '#16a34a' : '#1f2937'};">
                  ${item.completed}/${item.total}
                </div>
                <div class="progress-bar" style="margin-top: 6px; height: 4px;">
                  <div class="progress-bar-fill" style="width: ${item.total > 0 ? (item.completed / item.total * 100) : 0}%; background: ${item.completed === item.total ? '#16a34a' : 'var(--color-primary)'};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- U17: Progress by Module -->
        <div style="margin: 16px 0; padding: 16px; background: #f9fafb; border-radius: 10px; border: 1px solid var(--color-border);">
          <div style="font-weight: 600; font-size: 13px; margin-bottom: 12px;">📚 Прогресс по модулям</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${progressByModule.map((module, idx) => `
              <div style="padding: 10px 12px; background: #fff; border-radius: 8px; border: 1px solid ${module.completed === module.total ? '#86efac' : 'var(--color-border)'};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="width: 24px; height: 24px; background: ${module.completed === module.total ? '#dcfce7' : '#e5e7eb'}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: ${module.completed === module.total ? '#166534' : '#6b7280'};">
                      ${module.completed === module.total ? '✓' : idx + 1}
                    </span>
                    <span style="font-weight: 500; font-size: 13px;">${module.name}</span>
                  </div>
                  <span style="font-size: 12px; font-weight: 500; color: ${module.completed === module.total ? '#16a34a' : '#6b7280'};">
                    ${module.completed}/${module.total} заданий
                  </span>
                </div>
                <div class="progress-bar" style="height: 4px;">
                  <div class="progress-bar-fill" style="width: ${module.total > 0 ? (module.completed / module.total * 100) : 0}%; background: ${module.completed === module.total ? '#16a34a' : 'var(--color-primary)'};"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="field-label">Преподаватель</div>
        <div class="field-value">${teacher.name}</div>

        <div class="field-label">Описание курса</div>
        <div class="field-value">${course.description}</div>

        ${enrollment.allocatedResources ? `
          <div style="margin-top:20px; padding:12px; background:#eff6ff; border-radius:10px; border:1px solid #bfdbfe;">
            <div style="font-weight:500; margin-bottom:8px; font-size:13px; color:#1e40af;">
              🖥️ Выделенные ресурсы
            </div>
            <div style="font-size:12px; line-height:1.6;">
              <pre style="white-space:pre-wrap; font-family:inherit; margin:0;">${enrollment.allocatedResources}</pre>
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

          ${isFirstAssignment && enrollment.allocatedResources ? `
            <!-- Доступ к стенду для первого задания -->
            <div style="padding:12px; background:#eff6ff; border-radius:8px; border:1px solid #bfdbfe; margin-bottom:12px;">
              <div style="font-weight:500; margin-bottom:8px; font-size:13px; color:#1e40af;">
                🖥️ Выделенные ресурсы
              </div>
              <div style="font-size:12px; line-height:1.6;">
                <pre style="white-space:pre-wrap; font-family:inherit; margin:0;">${enrollment.allocatedResources}</pre>
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
// HELPER FUNCTIONS FOR PROGRESS TRACKING (U17, U18)
// ============================================================================

/**
 * U18: Calculate progress by activity type
 * Groups assignments by type and counts completed vs total
 */
function calculateProgressByActivityType(assignments, assignmentInstances) {
  const types = {
    'lecture': { icon: '📖', label: 'Лекции', completed: 0, total: 0 },
    'practice': { icon: '💻', label: 'Практика', completed: 0, total: 0 },
    'test': { icon: '📝', label: 'Тесты', completed: 0, total: 0 },
    'project': { icon: '🎯', label: 'Проекты', completed: 0, total: 0 }
  };

  assignments.forEach(assignment => {
    const type = assignment.type || 'practice';
    if (!types[type]) {
      types[type] = { icon: '📋', label: Data.formatAssignmentType(type), completed: 0, total: 0 };
    }
    types[type].total++;

    const instance = assignmentInstances.find(ai => ai.assignmentTemplateId === assignment.id);
    if (instance && instance.status === 'accepted') {
      types[type].completed++;
    }
  });

  // Filter out types with 0 total and convert to array
  return Object.values(types).filter(t => t.total > 0);
}

/**
 * U17: Calculate progress by module
 * Groups assignments into logical modules based on order ranges
 */
function calculateProgressByModule(assignments, assignmentInstances) {
  // Group assignments into modules (every 3-4 assignments = 1 module, or by type patterns)
  const modules = [];
  const sortedAssignments = [...assignments].sort((a, b) => a.order - b.order);

  // Try to detect modules by looking at assignment titles for "Модуль" or "Раздел"
  // or group by patterns in order numbers
  let currentModule = null;

  sortedAssignments.forEach((assignment, idx) => {
    // Check if title contains module indicator
    const moduleMatch = assignment.title.match(/^(Модуль|Раздел|Тема|Глава|Урок)\s*(\d+)/i);

    if (moduleMatch) {
      // Found explicit module marker
      const moduleName = `${moduleMatch[1]} ${moduleMatch[2]}`;
      currentModule = modules.find(m => m.name === moduleName);
      if (!currentModule) {
        currentModule = { name: moduleName, assignments: [], completed: 0, total: 0 };
        modules.push(currentModule);
      }
    } else if (!currentModule || currentModule.assignments.length >= 4) {
      // Create new module every 4 assignments if no explicit markers
      const moduleNum = modules.length + 1;
      currentModule = { name: `Модуль ${moduleNum}`, assignments: [], completed: 0, total: 0 };
      modules.push(currentModule);
    }

    currentModule.assignments.push(assignment);
    currentModule.total++;

    const instance = assignmentInstances.find(ai => ai.assignmentTemplateId === assignment.id);
    if (instance && instance.status === 'accepted') {
      currentModule.completed++;
    }
  });

  // If only one module, split more granularly by type
  if (modules.length === 1 && assignments.length > 3) {
    modules.length = 0;
    const introModule = { name: 'Введение', assignments: [], completed: 0, total: 0 };
    const mainModule = { name: 'Основной материал', assignments: [], completed: 0, total: 0 };
    const practiceModule = { name: 'Практические задания', assignments: [], completed: 0, total: 0 };

    sortedAssignments.forEach(assignment => {
      const instance = assignmentInstances.find(ai => ai.assignmentTemplateId === assignment.id);
      const isCompleted = instance && instance.status === 'accepted';

      if (assignment.type === 'lecture' || assignment.order <= 2) {
        introModule.assignments.push(assignment);
        introModule.total++;
        if (isCompleted) introModule.completed++;
      } else if (assignment.type === 'practice' || assignment.type === 'project') {
        practiceModule.assignments.push(assignment);
        practiceModule.total++;
        if (isCompleted) practiceModule.completed++;
      } else {
        mainModule.assignments.push(assignment);
        mainModule.total++;
        if (isCompleted) mainModule.completed++;
      }
    });

    if (introModule.total > 0) modules.push(introModule);
    if (mainModule.total > 0) modules.push(mainModule);
    if (practiceModule.total > 0) modules.push(practiceModule);
  }

  return modules;
}

// ============================================================================
// CANCEL REQUEST FUNCTION
// ============================================================================

function cancelRequest(enrollmentId) {
  if (confirm('Вы уверены, что хотите отменить заявку?')) {
    const idx = Data.enrollments.findIndex(e => e.id === enrollmentId);
    if (idx !== -1) {
      Data.enrollments.splice(idx, 1);
      renderStudentDashboard();
      alert('Заявка отменена');
    }
  }
}
