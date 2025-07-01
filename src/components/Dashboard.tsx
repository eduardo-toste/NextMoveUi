import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { TransactionResponseDTO } from '../services/api';
import TransactionView from './TransactionView';
import jsPDF from 'jspdf';

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
  const { user, logout, forceLogout } = useAuth();
  const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummaryItem[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponseDTO | null>(null);

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
        const thisMonth = now.getMonth() + 1;
        const thisYear = now.getFullYear();
        const prevMonth = thisMonth === 1 ? 12 : thisMonth - 1;
        const prevMonthYear = thisMonth === 1 ? thisYear - 1 : thisYear;

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

        // Função utilitária para pegar mês/ano de uma transação (usando apenas dueDate)
        const getMonthYear = (t: TransactionResponseDTO) => {
          if (!t.dueDate) return { month: -1, year: -1 };
          const [year, month] = t.dueDate.split('-');
          return { month: Number(month), year: Number(year) };
        };

        // Valor total de receitas (todas)
        const monthIncome = txs.filter(t =>
          t.status && t.status.toLowerCase() === 'completed' &&
          t.type === 'INCOME'
        ).reduce((sum, t) => sum + t.amount, 0);

        // Valor total de despesas (todas)
        const monthExpense = txs.filter(t =>
          t.status && t.status.toLowerCase() === 'completed' &&
          t.type === 'EXPENSE'
        ).reduce((sum, t) => sum + t.amount, 0);
        // Lucro líquido do mês
        const netProfit = monthIncome - monthExpense;
        // Atividades recentes (últimas 5)
        const activities = txs
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map(t => ({
            id: t.id,
            icon: t.type === 'INCOME' ? '💰' : '📋',
            message: (t as any).title || t.description,
            time: (() => {
              // Formatar manualmente a data YYYY-MM-DD para DD/MM/YYYY
              const [year, month, day] = String(t.createdAt).split('-');
              return `${day}/${month}/${year}`;
            })(),
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
              `Este mês: ${monthPendingCount} transações`,
              `Mês anterior: ${prevMonthPendingCount} transações`
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
          { label: 'Receitas do Mês', value: monthIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), type: 'profit' },
          { label: 'Despesas do Mês', value: monthExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), type: 'expense' },
          { label: 'Total Líquido', value: (monthIncome - monthExpense).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), type: (monthIncome - monthExpense) >= 0 ? 'profit' : 'expense', total: true },
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
      // Se o logout normal falhar, forçar o logout local
      forceLogout();
    }
  };

  // Função para gerar PDF do relatório mensal
  const handleDownloadMonthlyReport = () => {
    // Filtrar transações do mês atual
    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();
    const getMonthYear = (t: TransactionResponseDTO) => {
      if (!t.dueDate) return { month: -1, year: -1 };
      const [year, month] = t.dueDate.split('-');
      return { month: Number(month), year: Number(year) };
    };
    const monthTxs = transactions.filter((t: TransactionResponseDTO) =>
      t.dueDate &&
      getMonthYear(t).month === thisMonth &&
      getMonthYear(t).year === thisYear
    );
    // Totais
    const totalIncome = monthTxs.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = monthTxs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpense;
    // Montar PDF personalizado
    const doc = new jsPDF();
    // Cabeçalho bonito
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255,255,255);
    doc.setFontSize(18);
    doc.text('Relatório Mensal de Transações', 14, 18);
    doc.setFontSize(12);
    doc.text(`Mês: ${String(thisMonth).padStart(2, '0')}/${thisYear}`, 14, 25);
    doc.setTextColor(40,40,40);
    doc.setFontSize(11);
    doc.text(`Total de transações: ${monthTxs.length}`, 14, 35);
    // Tabela
    const headers = ['Tipo', 'Título', 'Descrição', 'Valor', 'Status', 'Vencimento'];
    let y = 43;
    doc.setFont(undefined, 'bold');
    headers.forEach((h, i) => doc.text(String(h), 14 + i*32, y));
    doc.setFont(undefined, 'normal');
    y += 8;
    monthTxs.forEach((t, idx) => {
      const row = [
        t.type === 'INCOME' ? 'Receita' : 'Despesa',
        (t as any).title ? String((t as any).title).slice(0, 15) : (t.description || '').slice(0, 15),
        (t.description || '').slice(0, 15),
        t.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        t.status ? String(t.status) : '-',
        t.dueDate && t.dueDate.includes('-') ? (() => { const [y, m, d] = t.dueDate.split('-'); return `${d}/${m}/${y}`; })() : '-'
      ];
      row.forEach((cell, i) => doc.text(String(cell), 14 + i*32, y));
      y += 8;
      if (y > 250 && idx < monthTxs.length - 1) { doc.addPage(); y = 20; }
    });
    // Totais e balança
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Totais do Mês:', 14, y);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    y += 7;
    doc.text(`Receitas: ${totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, y);
    y += 7;
    doc.text(`Despesas: ${totalExpense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, y);
    y += 7;
    doc.setFont(undefined, 'bold');
    doc.text(`Saldo (Balança): ${netBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 14, y);
    doc.save(`relatorio-mensal-${String(thisMonth).padStart(2, '0')}-${thisYear}.pdf`);
  };

  const quickActions = [
    { icon: '➕', label: 'Criar Transação', action: () => window.location.href = '/criar-transacao' },
    { icon: '📋', label: 'Visualizar Transações', action: () => window.location.href = '/transacoes' },
    { icon: '📊', label: 'Relatório Mensal', action: handleDownloadMonthlyReport },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const handleTransactionClick = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      setSelectedTransaction(tx);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>;
  if (error) return <div style={{ padding: 32, color: 'red', textAlign: 'center' }}>{error}</div>;

  return (
    <div className="dashboard-container">
      {modalOpen && selectedTransaction && (
        <TransactionView transaction={selectedTransaction} onClose={handleCloseModal} />
      )}
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
          {/* Histórico de Transações */}
          <div className="section-main">
            <div className="section-header">
              <h3>Histórico de Transações</h3>
            </div>
            <div className="activities-list" style={{ maxHeight: 340, overflowY: 'auto' }}>
              {recentActivities.slice(0, 10).map((activity, index) => (
                <button
                  key={index}
                  className="activity-item activity-interactive"
                  onClick={() => handleTransactionClick(activity.id)}
                  title="Ver detalhes da transação"
                >
                  <span className="activity-icon">{activity.icon}</span>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                  <div 
                    className="activity-status"
                    style={{ backgroundColor: getStatusColor(activity.status) }}
                  />
                </button>
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
                <div
                  key={index}
                  className={`financial-item ${item.total ? 'total' : ''}`}
                  style={index === financialSummary.length - 1 ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : {}}
                >
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
            <span>Dados Sincronizados</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 