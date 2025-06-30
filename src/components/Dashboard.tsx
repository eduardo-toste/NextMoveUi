import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import type { TransactionResponseDTO } from '../services/api';
import { apiService } from '../services/api';

interface Metric {
  icon: string;
  value: string;
  label: string;
  trend: string;
  trendType: string;
  details: string[];
}

interface FinancialSummaryItem {
  label: string;
  value: string;
  type: 'profit' | 'expense' | 'warning';
  total?: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.getAllTransactions();
        const txs = res.content || [];
        setTransactions(txs);
        // Cálculos
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const prevMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const prevMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        // Filtros
        const completed = txs.filter(t => t.status === 'completed');
        const income = completed.filter(t => t.type === 'INCOME');
        const expense = completed.filter(t => t.type === 'EXPENSE');
        // Valor total apenas das transações pendentes (status 'PENDING')
        const pendingTxs = txs.filter(t => t.status && t.status.toUpperCase() === 'PENDING');
        const totalValue = pendingTxs.reduce((sum, t) => sum + t.amount, 0);
        // Quantidade de transações pendentes (status 'PENDING')
        const totalPendingCount = pendingTxs.length;
        const monthPendingCount = pendingTxs.filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;
        const prevMonthPendingCount = pendingTxs.filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
        }).length;
        // Taxa de sucesso das transações pendentes
        const successRate = txs.length > 0 ? (totalPendingCount / txs.length) * 100 : 0;
        // Valor do mês atual e anterior (apenas pendentes)
        const monthValue = pendingTxs.filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).reduce((sum, t) => sum + t.amount, 0);
        const prevMonthValue = pendingTxs.filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
        }).reduce((sum, t) => sum + t.amount, 0);
        // Quantidade do mês atual e anterior
        const monthTxCount = completed.filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).length;
        const prevMonthTxCount = completed.filter(t => {
          const d = new Date(t.createdAt);
          return d.getMonth() === prevMonth && d.getFullYear() === prevMonthYear;
        }).length;
        // Comissões pendentes (despesas pendentes)
        const pendingCommissions = txs.filter(t => t.status === 'pending' && t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0);
        // Lucro líquido do mês
        const netProfit = monthValue - prevMonthValue;
        // Atividades recentes (últimas 5)
        const activities = txs
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map(t => ({
            icon: t.type === 'INCOME' ? '💰' : '📋',
            message: t.description,
            time: new Date(t.createdAt).toLocaleString('pt-BR'),
            status: t.status
          }));
        setRecentActivities(activities);
        // Atualiza métricas
        setMetrics([
          {
            icon: '💰',
            value: totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            label: 'Valor Total em Transações Pendentes',
            trend: '',
            trendType: 'warning',
            details: [
              `Este mês: ${monthValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
              `Mês anterior: ${prevMonthValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
            ]
          },
          {
            icon: '📊',
            value: totalPendingCount.toString(),
            label: 'Transações Pendentes',
            trend: '',
            trendType: 'warning',
            details: [
              `Este mês: ${monthPendingCount} transações`,
              `Mês anterior: ${prevMonthPendingCount} transações`
            ]
          },
          {
            icon: '🎯',
            value: `${successRate.toFixed(1)}%`,
            label: 'Taxa de Sucesso (Pendentes)',
            trend: '',
            trendType: 'warning',
            details: [
              `Taxa de pendentes sobre o total: ${successRate.toFixed(1)}%`,
              totalPendingCount === 0 ? 'Nenhuma pendente' : 'Há pendentes a resolver'
            ]
          }
        ]);
        // Atualiza resumo financeiro
        setFinancialSummary([
          { label: 'Receitas do Mês', value: monthValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), type: 'profit' },
          { label: 'Despesas Operacionais', value: prevMonthValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), type: 'expense' },
          { label: 'Comissões Pendentes', value: pendingCommissions.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), type: 'warning' },
          { label: 'Lucro Líquido', value: netProfit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), type: 'profit', total: true },
        ]);
      } catch (e: any) {
        setError(e.message || 'Erro ao buscar transações');
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const quickActions = [
    { icon: '➕', label: 'Nova Transação', action: () => console.log('Nova transação') },
    { icon: '📋', label: 'Criar Proposta', action: () => console.log('Criar proposta') },
    { icon: '📊', label: 'Relatórios', action: () => console.log('Relatórios') },
    { icon: '👥', label: 'Clientes', action: () => console.log('Clientes') },
    { icon: '📅', label: 'Agenda', action: () => console.log('Agenda') }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>;
  if (error) return <div style={{ padding: 32, color: 'red', textAlign: 'center' }}>{error}</div>;

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
                {metric.details.map((detail: string, idx: number) => (
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