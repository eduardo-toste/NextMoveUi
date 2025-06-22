import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Dados simulados para o dashboard
  const metrics = [
    {
      icon: '💰',
      value: 'R$ 2.847.500',
      label: 'Valor Total em Transações',
      trend: '+12.5%',
      trendType: 'positive',
      details: ['Este mês: R$ 245.300', 'Mês anterior: R$ 218.000']
    },
    {
      icon: '📊',
      value: '156',
      label: 'Transações Realizadas',
      trend: '+8.2%',
      trendType: 'positive',
      details: ['Este mês: 23 transações', 'Mês anterior: 21 transações']
    },
    {
      icon: '🎯',
      value: '94.2%',
      label: 'Taxa de Sucesso',
      trend: '+2.1%',
      trendType: 'positive',
      details: ['Meta: 90%', 'Performance: Excelente']
    }
  ];

  const recentActivities = [
    {
      icon: '🏠',
      message: 'Venda de apartamento no Centro - R$ 450.000',
      time: '2 horas atrás',
      status: 'completed'
    },
    {
      icon: '📋',
      message: 'Nova proposta recebida - Casa em condomínio',
      time: '4 horas atrás',
      status: 'pending'
    },
    {
      icon: '✅',
      message: 'Documentação aprovada - Terreno comercial',
      time: '1 dia atrás',
      status: 'completed'
    },
    {
      icon: '📞',
      message: 'Visita agendada - Apartamento 3 quartos',
      time: '2 dias atrás',
      status: 'scheduled'
    },
    {
      icon: '💰',
      message: 'Comissão recebida - R$ 12.500',
      time: '3 dias atrás',
      status: 'completed'
    }
  ];

  const quickActions = [
    { icon: '➕', label: 'Nova Transação', action: () => console.log('Nova transação') },
    { icon: '📋', label: 'Criar Proposta', action: () => console.log('Criar proposta') },
    { icon: '📊', label: 'Relatórios', action: () => console.log('Relatórios') },
    { icon: '👥', label: 'Clientes', action: () => console.log('Clientes') },
    { icon: '📅', label: 'Agenda', action: () => console.log('Agenda') }
  ];

  const financialSummary = [
    { label: 'Receitas do Mês', value: 'R$ 45.800', type: 'profit' },
    { label: 'Despesas Operacionais', value: 'R$ 12.300', type: 'expense' },
    { label: 'Comissões Pendentes', value: 'R$ 8.900', type: 'warning' },
    { label: 'Lucro Líquido', value: 'R$ 24.600', type: 'profit', total: true }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">
              Bem-vindo de volta, {user?.name}! Aqui está o resumo das suas atividades.
            </p>
          </div>
          <div className="dashboard-actions">
            <button className="action-btn">
              📊 Relatório Mensal
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Sair
            </button>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card">
              <div className="metric-header">
                <span className="metric-icon">{metric.icon}</span>
                <span className={`metric-trend ${metric.trendType}`}>
                  {metric.trend}
                </span>
              </div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-details">
                {metric.details.map((detail, idx) => (
                  <div key={idx}>{detail}</div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Seções Principais */}
        <div className="dashboard-sections">
          {/* Seção Principal - Atividades Recentes */}
          <div className="section-main">
            <div className="section-header">
              <h3>Atividades Recentes</h3>
              <button className="view-all-btn">Ver todas</button>
            </div>
            <div className="activities-list">
              {recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                  <div 
                    className="activity-status"
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="section-sidebar">
            {/* Ações Rápidas */}
            <div className="quick-actions">
              <h3>Ações Rápidas</h3>
              <div className="action-buttons">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="quick-action-btn"
                    onClick={action.action}
                  >
                    <span>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="financial-summary">
              <h3>Resumo Financeiro</h3>
              {financialSummary.map((item, index) => (
                <div key={index} className={`financial-item ${item.total ? 'total' : ''}`}>
                  <span>{item.label}</span>
                  <strong className={item.type}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="system-status">
          <div className="status-item">
            <div className="status-dot" />
            <span>Sistema Online</span>
          </div>
          <div className="status-item">
            <div className="status-dot" />
            <span>API Conectada</span>
          </div>
          <div className="status-item">
            <div className="status-dot" />
            <span>Dados Sincronizados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 