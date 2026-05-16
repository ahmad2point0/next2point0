export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  logout: "/auth/logout",
  refresh: "/auth/refresh",
  me: "/auth/me",
} as const;

export const PROJECTS_ENDPOINTS = {
  list: "/projects",
  detail: (id: string) => `/projects/${id}`,
  create: "/projects",
  update: (id: string) => `/projects/${id}`,
  delete: (id: string) => `/projects/${id}`,
} as const;
