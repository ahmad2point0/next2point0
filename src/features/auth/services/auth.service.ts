import { apiClient, tokenStorage } from "@/global/config";
import { AUTH_ENDPOINTS } from "@/global/constants";
import type { LoginDto, RegisterDto } from "../@types/auth.dto";
import type { AuthResponse } from "../@types/auth.response";

export const authService = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.login, dto);
    tokenStorage.setAccess(data.accessToken);
    tokenStorage.setRefresh(data.refreshToken);
    return data;
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>(AUTH_ENDPOINTS.register, dto);
    tokenStorage.setAccess(data.accessToken);
    tokenStorage.setRefresh(data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.logout);
    } finally {
      tokenStorage.clear();
    }
  },
};
