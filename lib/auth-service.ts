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

// Serviços de autenticação
export class AuthService {
  // Login com email/senha
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

      // Salvar token no localStorage se remember = true
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

  // Registro de novo usuário
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

  // Esqueceu a senha
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

  // Logout
  static async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("auth_token");

      if (token) {
        // Opcional: chamar endpoint de logout no backend
        await apiRequest("/auth/logout", {
          method: "POST",
          headers: getAuthHeaders(token),
        });
      }
    } catch (error) {
    } finally {
      // Limpar dados locais sempre
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_data");
    }
  }

  // Verificar se usuário está autenticado
  static isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  // Obter dados do usuário logado
  static getCurrentUser(): { id: string; name: string; email: string } | null {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  // Obter token de autenticação
  static getToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

// Funções para autenticação social (para implementação futura)
export class SocialAuthService {
  static async loginWithGoogle(): Promise<AuthResponse> {
    // Implementar integração com Google OAuth
    return {
      success: false,
      message: "Autenticação com Google em desenvolvimento",
      error: "NOT_IMPLEMENTED",
    };
  }

  static async loginWithGitHub(): Promise<AuthResponse> {
    // Implementar integração com GitHub OAuth
    return {
      success: false,
      message: "Autenticação com GitHub em desenvolvimento",
      error: "NOT_IMPLEMENTED",
    };
  }
}
