import type { AuthUser } from "./auth.types";

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}
