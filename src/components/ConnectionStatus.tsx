import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ConnectionInfo {
  status: 'online' | 'offline' | 'checking';
  lastCheck: Date;
  responseTime?: number;
  error?: string;
}

const ConnectionStatus: React.FC = () => {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    status: 'checking',
    lastCheck: new Date()
  });
  const [showDebug, setShowDebug] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const checkConnection = async () => {
    setConnectionInfo(prev => ({ ...prev, status: 'checking' }));
    
    try {
      const startTime = Date.now();
      await apiService.healthCheck();
      const responseTime = Date.now() - startTime;
      
      setConnectionInfo({
        status: 'online',
        lastCheck: new Date(),
        responseTime
      });
    } catch (error) {
      setConnectionInfo({
        status: 'offline',
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Verificar conexão a cada 30 segundos
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (connectionInfo.status) {
      case 'online': return '#10b981';
      case 'offline': return '#ef4444';
      case 'checking': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusText = () => {
    switch (connectionInfo.status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'checking': return 'Verificando...';
      default: return 'Desconhecido';
    }
  };

  // Em desenvolvimento, mostrar debug expandido
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="connection-status">
      {/* Ponto de conexão sutil */}
      <div 
        className="connection-dot"
        style={{ backgroundColor: getStatusColor() }}
        onClick={() => setShowDebug(!showDebug)}
        title={`Status: ${getStatusText()}`}
      />
      
      {/* Painel de debug (apenas em desenvolvimento) */}
      {isDevelopment && showDebug && (
        <div className="debug-panel">
          <div className="debug-header">
            <h4>Status da Conexão</h4>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="expand-btn"
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
          
          <div className="debug-content">
            <div className="debug-item">
              <span>Status:</span>
              <span style={{ color: getStatusColor() }}>
                {getStatusText()}
              </span>
            </div>
            
            <div className="debug-item">
              <span>Última verificação:</span>
              <span>{connectionInfo.lastCheck.toLocaleTimeString()}</span>
            </div>
            
            {connectionInfo.responseTime && (
              <div className="debug-item">
                <span>Tempo de resposta:</span>
                <span>{connectionInfo.responseTime}ms</span>
              </div>
            )}
            
            {connectionInfo.error && (
              <div className="debug-item">
                <span>Erro:</span>
                <span style={{ color: '#ef4444' }}>{connectionInfo.error}</span>
              </div>
            )}
            
            {isExpanded && (
              <div className="debug-actions">
                <button 
                  onClick={checkConnection}
                  className="debug-btn"
                  disabled={connectionInfo.status === 'checking'}
                >
                  Verificar Agora
                </button>
                <button 
                  onClick={() => setShowDebug(false)}
                  className="debug-btn"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus; 