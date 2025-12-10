// B3 Learning Portal - Guest Screens Module
// Экраны для анонимных пользователей

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
