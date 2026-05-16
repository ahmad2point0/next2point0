import { loginAction, registerAction, logoutAction } from "../actions/auth.action";

// On the fullstack branch, auth is handled by Auth.js + server actions.
// This service is a thin facade so feature consumers stay consistent across branches.
export const authService = {
  login: loginAction,
  register: registerAction,
  logout: logoutAction,
};
