import { LoginFormData, RegisterFormData } from "./auth-schemas";
import API_CONFIG, { apiRequest, getAuthHeaders } from "./api-config";

// Tipos para respostas da API
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: string;
    refreshToken?: string;
  };
  error?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error: string;
  statusCode?: number;
}

export class AuthService {
  static async login(data: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          remember: data.remember,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao fazer login");
      }

      if (data.remember && result.data?.token) {
        localStorage.setItem("auth_token", result.data.token);
        localStorage.setItem("user_data", JSON.stringify(result.data.user));
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro inesperado no login",
        error: "LOGIN_FAILED",
      };
    }
  }

  static async register(data: RegisterFormData): Promise<AuthResponse> {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.REGISTER, {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao criar conta");
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro inesperado no registro",
        error: "REGISTER_FAILED",
      };
    }
  }

  static async forgotPassword(email: string): Promise<AuthResponse> {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao enviar email de recuperação");
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Erro inesperado",
        error: "FORGOT_PASSWORD_FAILED",
      };
    }
  }

  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("auth_token");

      if (token) {
        await apiRequest("/auth/logout", {
          method: "POST",
          headers: getAuthHeaders(token),
        });
      }
    } catch {
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  static getCurrentUser(): { id: string; name: string; email: string } | null {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  static getToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

export class SocialAuthService {
  static async loginWithGoogle(): Promise<AuthResponse> {
    return {
      success: false,
      message: "Autenticação com Google em desenvolvimento",
      error: "NOT_IMPLEMENTED",
    };
  }

  static async loginWithGitHub(): Promise<AuthResponse> {
    return {
      success: false,
      message: "Autenticação com GitHub em desenvolvimento",
      error: "NOT_IMPLEMENTED",
    };
  }
}
