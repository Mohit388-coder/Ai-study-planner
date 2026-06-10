const API_BASE_URL = "https://ai-study-planner-t302.onrender.com";

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  },

  // Auth
  login: (credentials) =>
    api.request("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    api.request("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Subjects
  getSubjects: () => api.request("/subjects"),
  createSubject: (data) =>
    api.request("/subjects", { method: "POST", body: JSON.stringify(data) }),
  updateSubject: (id, data) =>
    api.request(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteSubject: (id) => api.request(`/subjects/${id}`, { method: "DELETE" }),

  // Study Plans
  getPlans: () => api.request("/studyplans"),
  getPlan: (id) => api.request(`/studyplans/${id}`),
  createPlan: (data) =>
    api.request("/studyplans", { method: "POST", body: JSON.stringify(data) }),
  updatePlan: (id, data) =>
    api.request(`/studyplans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deletePlan: (id) => api.request(`/studyplans/${id}`, { method: "DELETE" }),

  // Tasks
  getTasks: (planId) => api.request(`/tasks/${planId}/tasks`),
  createTask: (planId, data) =>
    api.request(`/tasks/${planId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTask: (id, data) =>
    api.request(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteTask: (id) => api.request(`/tasks/${id}`, { method: "DELETE" }),

  // AI
  generatePlan: (prompt) =>
    api.request("/ai/generate-plan", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }),
  suggestTasks: (planId, prompt) =>
    api.request("/ai/suggest-tasks", {
      method: "POST",
      body: JSON.stringify({ planId, prompt }),
    }),
  optimizePlan: (planId, prompt) =>
    api.request("/ai/optimize-plan", {
      method: "POST",
      body: JSON.stringify({ planId, prompt }),
    }),
};
