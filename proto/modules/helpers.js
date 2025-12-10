// B3 Learning Portal - Helper Functions Module
// Вспомогательные функции

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
