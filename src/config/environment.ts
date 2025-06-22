// Configurações de ambiente
export const config = {
  // URL da API Gateway (microservices) - sem /api no final
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8082',
  
  // Nome da aplicação
  appName: import.meta.env.VITE_APP_NAME || 'NextMove',
  
  // Versão da aplicação
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Modo de desenvolvimento
  isDevelopment: import.meta.env.DEV,
  
  // Modo de produção
  isProduction: import.meta.env.PROD,
};

// Validação das configurações obrigatórias
export const validateConfig = () => {
  const requiredConfigs = ['apiUrl'];
  
  for (const configKey of requiredConfigs) {
    if (!config[configKey as keyof typeof config]) {
      console.error(`Configuração obrigatória não encontrada: ${configKey}`);
    }
  }
}; 