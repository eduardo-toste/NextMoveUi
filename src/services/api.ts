import { config } from '../config/environment';

// Configuração da API
const API_BASE_URL = config.apiUrl;

// Tipos para as respostas da API
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string; // Resposta real do backend
}

export interface RegisterResponse {
  token: string; // Assumindo que retorna token após registro
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface TransactionResponseDTO {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  status: 'completed' | 'pending' | 'scheduled';
  description: string;
  createdAt: string;
  // Adicione outros campos conforme necessário
}

// Classe para gerenciar as chamadas da API
class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Método genérico para fazer requisições
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Configurações padrão para microservices
    const requestConfig: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      credentials: 'include', // Para cookies se necessário
      ...options,
    };

    // Adicionar token de autenticação se existir
    const token = localStorage.getItem('authToken');
    if (token) {
      requestConfig.headers = {
        ...requestConfig.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      // Criar AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout
      
      const response = await fetch(url, {
        ...requestConfig,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Log para debug em desenvolvimento
      if (config.isDevelopment) {
        console.log(`API Request: ${requestConfig.method || 'GET'} ${url}`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        });
      }
      
      // Verificar se a resposta é ok
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          // Usar a mensagem específica do backend se disponível
          errorMessage = errorData.message || errorData.error || errorMessage;
          
          // Log detalhado em desenvolvimento
          if (config.isDevelopment) {
            console.error('API Error Details:', {
              status: response.status,
              statusText: response.statusText,
              errorData,
              url: url
            });
          }
        } catch {
          // Se não conseguir parsear JSON, usar status text
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Log para debug em desenvolvimento
      if (config.isDevelopment) {
        console.log(`API Response: ${requestConfig.method || 'GET'} ${url}`, data);
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        // Log de erro em desenvolvimento
        if (config.isDevelopment) {
          console.error(`API Error: ${endpoint}`, error);
        }
        
        // Tratamento específico para erros de rede
        if (error.name === 'AbortError') {
          throw new Error('Timeout: Servidor não respondeu em tempo hábil');
        } else if (error.message.includes('fetch')) {
          throw new Error('Erro de conexão: Verifique sua conexão com a internet');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Servidor inacessível: Verifique se o backend está rodando');
        }
        
        throw new Error(error.message);
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }

  // Login - usando o endpoint específico do auth-service
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth-service/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Register - usando o endpoint específico do auth-service
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth-service/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Logout - usando o endpoint específico do auth-service
  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth-service/auth/logout', {
      method: 'POST',
    });
  }

  // Verificar se o token é válido - usando o endpoint específico do auth-service
  async validateToken(): Promise<{ valid: boolean; user?: User }> {
    // Retornar a promise diretamente. O erro será capturado no AuthContext.
    return this.request<{ valid: boolean; user?: User }>('/auth-service/auth/validate');
  }

  // Recuperar dados do usuário - usando o endpoint específico do user-service
  async getUserProfile(): Promise<User> {
    return this.request<User>('/user-service/user/profile');
  }

  // Função para testar conexão com o backend
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return { connected: true, message: 'Conectado ao backend' };
      } else {
        return { connected: false, message: `Erro HTTP: ${response.status}` };
      }
    } catch (error) {
      return { 
        connected: false, 
        message: error instanceof Error ? error.message : 'Erro de conexão' 
      };
    }
  }

  // Buscar todas as transações do usuário autenticado (endpoint correto)
  async getAllTransactions(): Promise<{ content: TransactionResponseDTO[] }> {
    return this.request<{ content: TransactionResponseDTO[] }>('/transaction-service/transaction', {
      method: 'GET'
    });
  }
}

// Instância do serviço de API
export const apiService = new ApiService(API_BASE_URL);

// Utilitários para autenticação
export const authUtils = {
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  },

  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  removeToken(): void {
    localStorage.removeItem('authToken');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
}; 