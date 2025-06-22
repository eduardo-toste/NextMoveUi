import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import ConnectionStatus from './components/ConnectionStatus';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Componente interno que usa o contexto
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, error, clearError } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const handleSwitchToRegister = () => {
    setShowRegister(true);
    clearError();
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    clearError();
  };

  const handleRegisterSuccess = () => {
    // Voltar para a tela de login após registro bem-sucedido
    setShowRegister(false);
    clearError();
  };

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '2rem',
          borderRadius: '16px',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'inline-block',
            width: '40px',
            height: '40px',
            border: '3px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '50%',
            borderTopColor: '#667eea',
            animation: 'spin 1s ease-in-out infinite',
            marginBottom: '1rem'
          }}></div>
          <p style={{ color: '#666', margin: 0 }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ConnectionStatus />
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <>
          {showRegister ? (
            <RegisterForm 
              onSwitchToLogin={handleSwitchToLogin}
              error={error}
              onClearError={clearError}
              onRegisterSuccess={handleRegisterSuccess}
            />
          ) : (
            <LoginForm
              onSwitchToRegister={handleSwitchToRegister}
              error={error}
              onClearError={clearError}
            />
          )}
        </>
      )}
    </>
  );
};

// Componente principal que envolve tudo com o AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
