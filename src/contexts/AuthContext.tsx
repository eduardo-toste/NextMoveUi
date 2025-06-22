import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiService, authUtils } from '../services/api';
import type { LoginRequest, RegisterRequest, LoginResponse } from '../services/api';

// Tipos para o contexto
interface User {
  id: string;
  name: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Criar o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Props para o provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider do contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Verificar se o usuário está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = authUtils.getToken();
        
        if (token) {
          // Se um token existir, decodificá-lo para obter os dados do usuário.
          // Isso assume que se um token existe, ele é válido.
          // Esta é uma abordagem mais simples que não valida o token com o backend.
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          const user: User = {
            id: tokenPayload.id || 'unknown',
            username: tokenPayload.sub || 'unknown',
            name: tokenPayload.name || 'Usuário',
          };
          setUser(user);
        }
      } catch (error) {
        // Se o token estiver corrompido ou for inválido, ele falhará ao decodificar.
        console.error('Falha ao processar token local:', error);
        authUtils.removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Função de login
  const login = async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await apiService.login(credentials);
      
      // O backend retorna apenas o token, então vamos extrair informações do JWT
      if (response.token) {
        // Salvar token no localStorage
        authUtils.setToken(response.token);
        
        // Extrair informações do usuário do token JWT
        try {
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          const user: User = {
            id: tokenPayload.id || 'unknown',
            username: tokenPayload.sub || credentials.username,
            name: tokenPayload.name || credentials.username.split('@')[0],
          };
          
          // Atualizar estado do usuário
          setUser(user);
        } catch {
          // Se não conseguir decodificar o JWT, criar usuário básico
          const user: User = {
            id: 'unknown',
            username: credentials.username,
            name: credentials.username.split('@')[0],
          };
          setUser(user);
        }
      } else {
        throw new Error('Token não recebido do servidor');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Chamar logout no backend
      await apiService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout no backend:', error);
    } finally {
      // Limpar dados locais independentemente do resultado do backend
      authUtils.removeToken();
      setUser(null);
      setIsLoading(false);
    }
  };

  // Limpar erro
  const clearError = () => {
    setError(null);
  };

  // Função de registro
  const register = async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiService.register(userData);
      
      // Após registro bem-sucedido, não fazer login automático
      // Apenas mostrar sucesso e deixar o usuário fazer login manualmente
      console.log('Usuário registrado com sucesso!');
      
      // Não definir usuário, deixar na tela de login
      // O usuário precisará fazer login manualmente
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar usuário';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor do contexto
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 