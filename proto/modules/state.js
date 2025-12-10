// B3 Learning Portal - State Module
// Глобальное состояние приложения

// Data is loaded from data.js
const Data = window.LMSData;

// Global application state
var state = {
  role: "anonymous",  // anonymous | student | methodist | teacher | admin
  currentView: "landing",
  currentCourseId: null,
  currentAssignmentId: null,
  currentEnrollmentId: null,
  notificationsOpen: false,
  sidebarOpen: false,
  searchQuery: "",
  levelFilter: ""
};
