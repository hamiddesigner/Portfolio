// Constants used across the admin panel
export const ADMIN_ROUTES = {
  DASHBOARD: '/admin',
  CASE_STUDIES: '/admin/case-studies',
  POSTS: '/admin/posts',
  PAGE_CONTENT: '/admin/page-content',
  AVAILABILITY: '/admin/availability',
  SETTINGS: '/admin/settings',
  LOGIN: '/admin/login',
};

export const API_ENDPOINTS = {
  CASE_STUDIES: '/api/case-studies',
  POSTS: '/api/posts',
  PAGE_CONTENT: '/api/page-content',
  AVAILABILITY: '/api/availability',
};

export const FORM_VALIDATION = {
  REQUIRED: 'This field is required',
  MIN_LENGTH: (min) => `Minimum ${min} characters required`,
  MAX_LENGTH: (max) => `Maximum ${max} characters allowed`,
};
