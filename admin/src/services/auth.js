// Authentication service
export const login = (password) => {
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
  return password === adminPassword;
};

export const logout = () => {
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const setAuthenticated = (value) => {
  localStorage.setItem('isAuthenticated', value.toString());
};
