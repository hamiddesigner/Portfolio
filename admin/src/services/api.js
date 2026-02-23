// API service for backend communication

const API_BASE = '';  // Netlify redirects /api/* → functions

function getToken() {
  return localStorage.getItem('admin_token') || '';
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
}

async function request(method, url, body = null) {
  const options = { method, headers: authHeaders() };
  if (body !== null) options.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${url}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authAPI = {
  login: (username, password) =>
    request('POST', '/api/auth/login', { username, password }),
  logout: () => request('POST', '/api/auth/logout'),
  verify: () => request('GET', '/api/auth/verify'),
};

// ─── Case Studies ──────────────────────────────────────────────────────────
export const caseStudiesAPI = {
  getAll: () => request('GET', '/api/case-studies'),
  getOne: (id) => request('GET', `/api/case-studies/${id}`),
  create: (data) => request('POST', '/api/case-studies', data),
  update: (id, data) => request('PUT', `/api/case-studies/${id}`, data),
  delete: (id) => request('DELETE', `/api/case-studies/${id}`),
};

// ─── Posts ─────────────────────────────────────────────────────────────────
export const postsAPI = {
  getAll: () => request('GET', '/api/posts'),
  getOne: (id) => request('GET', `/api/posts/${id}`),
  create: (data) => request('POST', '/api/posts', data),
  update: (id, data) => request('PUT', `/api/posts/${id}`, data),
  delete: (id) => request('DELETE', `/api/posts/${id}`),
};

// ─── Page Content ──────────────────────────────────────────────────────────
export const pageContentAPI = {
  getAll: () => request('GET', '/api/content'),
  getSection: (section) => request('GET', `/api/content/${section}`),
  updateSection: (section, content) =>
    request('PUT', `/api/content/${section}`, { content }),
};

// ─── Settings ──────────────────────────────────────────────────────────────
export const settingsAPI = {
  get: () => request('GET', '/api/settings'),
  update: (data) => request('PUT', '/api/settings', data),
};

// ─── Availability ──────────────────────────────────────────────────────────
export const availabilityAPI = {
  get: () => request('GET', '/api/availability'),
  update: (data) => request('PUT', '/api/availability', data),
};

export default { authAPI, caseStudiesAPI, postsAPI, pageContentAPI, settingsAPI, availabilityAPI };
