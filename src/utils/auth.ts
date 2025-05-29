
// Utilitários de autenticação
export const getAuthToken = (): string | null => {
  return localStorage.getItem('wiki-auth-token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('wiki-auth-token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('wiki-auth-token');
  localStorage.removeItem('wiki-user');
};

export const getCurrentUser = () => {
  const userString = localStorage.getItem('wiki-user');
  return userString ? JSON.parse(userString) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

export const hasPermission = (requiredRole: 'admin' | 'editor' | 'viewer'): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  const roleHierarchy = { admin: 3, editor: 2, viewer: 1 };
  return roleHierarchy[user.role as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole];
};

// Hook personalizado para redirecionamento se não autenticado
export const redirectIfAuthenticated = () => {
  if (typeof window !== 'undefined' && isAuthenticated()) {
    window.location.href = '/';
  }
};
