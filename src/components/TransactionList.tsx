import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { TransactionResponseDTO } from '../services/api';
import TransactionView from './TransactionView';
import { StatusDropdown } from './StatusDropdown';
import EditTransactionModal from './EditTransactionModal';

const TransactionList: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponseDTO | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionResponseDTO | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionResponseDTO | null>(null);
  
  // Filtros
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  const [openStatusDropdownId, setOpenStatusDropdownId] = useState<string | null>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [transactions, filters]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setOpenStatusDropdownId(null);
      }
    }
    if (openStatusDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openStatusDropdownId]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.getAllTransactions();
      const txs = res.content || [];
      setTransactions(txs);
    } catch (e: any) {
      setError(e.message || 'Erro ao buscar transações');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...transactions];

    // Filtro por tipo
    if (filters.type) {
      filtered = filtered.filter(t => t.type === filters.type);
    }

    // Filtro por status
    if (filters.status) {
      filtered = filtered.filter(t => t.status && t.status.toLowerCase() === filters.status.toLowerCase());
    }

    // Filtro por busca (título ou descrição)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        ((t as any).title || '').toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      status: '',
      search: ''
    });
  };

  const handleTransactionClick = (transaction: TransactionResponseDTO) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleBackToDashboard = () => {
    window.location.href = '/dashboard';
  };

  const handleEdit = (transaction: TransactionResponseDTO) => {
    setTransactionToEdit(transaction);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setTransactionToEdit(null);
  };

  const handleDeleteClick = (transaction: TransactionResponseDTO) => {
    setTransactionToDelete(transaction);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!transactionToDelete) return;
    setDeletingId(transactionToDelete.id);
    try {
      await apiService.deleteTransaction(transactionToDelete.id);
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
      setSuccessMessage('Transação excluída com sucesso!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (e: any) {
      alert('Erro ao excluir transação: ' + (e.message || 'Erro desconhecido'));
    } finally {
      setDeleteModalOpen(false);
      setTransactionToDelete(null);
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setTransactionToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'scheduled': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      case 'failed': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusBackgroundColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'rgba(16, 185, 129, 0.1)';
      case 'pending': return 'rgba(245, 158, 11, 0.1)';
      case 'scheduled': return 'rgba(59, 130, 246, 0.1)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.1)';
      case 'failed': return 'rgba(220, 38, 38, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'rgba(16, 185, 129, 0.2)';
      case 'pending': return 'rgba(245, 158, 11, 0.2)';
      case 'scheduled': return 'rgba(59, 130, 246, 0.2)';
      case 'cancelled': return 'rgba(239, 68, 68, 0.2)';
      case 'failed': return 'rgba(220, 38, 38, 0.2)';
      default: return 'rgba(107, 114, 128, 0.2)';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'INCOME' ? '💰' : '📋';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const [year, month, day] = String(dateString).split('-');
    return `${day}/${month}/${year}`;
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    });
  };

  const handleStatusChange = async (transaction: TransactionResponseDTO, newStatus: string) => {
    try {
      await apiService.updateTransaction(transaction.id, { status: newStatus.toUpperCase() as any });
      fetchTransactions();
    } catch (e: any) {
      alert('Erro ao atualizar status: ' + (e.message || 'Erro desconhecido'));
    }
  };

  if (loading) return (
    <div className="transaction-list-container">
      <div className="transaction-list-card">
        <div style={{ padding: 32, textAlign: 'center' }}>Carregando transações...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="transaction-list-container">
      <div className="transaction-list-card">
        <div style={{ padding: 32, color: 'red', textAlign: 'center' }}>{error}</div>
      </div>
    </div>
  );

  return (
    <div className="transaction-list-container">
      {modalOpen && selectedTransaction && (
        <TransactionView transaction={selectedTransaction} onClose={handleCloseModal} onEdit={handleEdit} onStatusChange={handleStatusChange} />
      )}
      {editModalOpen && transactionToEdit && (
        <EditTransactionModal
          transaction={transactionToEdit}
          onClose={handleCloseEditModal}
          onSave={() => {
            fetchTransactions();
            handleCloseEditModal();
          }}
        />
      )}
      {deleteModalOpen && transactionToDelete && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Exclusão</h2>
            <p>Tem certeza que deseja excluir a transação "{(transactionToDelete as any).title || transactionToDelete.description}"?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={handleCancelDelete}>Cancelar</button>
              <button className="delete-btn" onClick={handleConfirmDelete} disabled={deletingId === transactionToDelete.id}>
                {deletingId === transactionToDelete.id ? 'Excluindo...' : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 6, verticalAlign: 'middle'}}>
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Excluir
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="transaction-list-card">
        <div className="transaction-list-header">
          <h1>Transações</h1>
          <p>Visualize todas as suas transações cadastradas</p>
        </div>

        {/* Filtros */}
        <div className="transaction-filters">
          <div className="filters-row">
            <div className="filter-group">
              <label htmlFor="search-filter">Buscar:</label>
              <input
                id="search-filter"
                type="text"
                placeholder="Título ou descrição..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="filter-input"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="type-filter">Tipo:</label>
              <select
                id="type-filter"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos</option>
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="status-filter">Status:</label>
              <select
                id="status-filter"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos</option>
                <option value="completed">Concluída</option>
                <option value="pending">Pendente</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <button 
              className="clear-filters-btn"
              onClick={clearFilters}
              disabled={!filters.type && !filters.status && !filters.search}
            >
              Limpar Filtros
            </button>
          </div>
          <div className="filters-info">
            <span>Mostrando {filteredTransactions.length} de {transactions.length} transações</span>
          </div>
        </div>

        {successMessage && (
          <div className="success-message" style={{marginBottom: 16}}>{successMessage}</div>
        )}

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Nenhuma transação encontrada</h3>
            <p>
              {transactions.length === 0 
                ? 'Você ainda não possui transações cadastradas.'
                : 'Nenhuma transação corresponde aos filtros aplicados.'
              }
            </p>
            {transactions.length === 0 && (
              <button 
                className="create-transaction-btn"
                onClick={() => window.location.href = '/criar-transacao'}
              >
                Criar Primeira Transação
              </button>
            )}
          </div>
        ) : (
          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Título</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                  <th>Vencimento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredTransactions]
                  .sort((a, b) => {
                    if (!a.dueDate && !b.dueDate) return 0;
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return b.dueDate.localeCompare(a.dueDate);
                  })
                  .map((transaction) => (
                    <tr key={transaction.id} className="transaction-row">
                      <td className="transaction-type-cell">
                        <span className="transaction-type-icon">{getTypeIcon(transaction.type)}</span>
                        <span className="transaction-type-text">
                          {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td className="transaction-title-cell" title={(transaction as any).title || 'Sem título'}>
                        {(transaction as any).title || 'Sem título'}
                      </td>
                      <td className="transaction-description-cell" title={transaction.description}>
                        {transaction.description}
                      </td>
                      <td className="transaction-amount-cell">
                        {formatAmount(transaction.amount)}
                      </td>
                      <td className="transaction-status-cell">
                        <span 
                          className="transaction-status-badge"
                          style={{ 
                            backgroundColor: getStatusBackgroundColor(transaction.status),
                            color: getStatusColor(transaction.status),
                            border: `1px solid ${getStatusBorderColor(transaction.status)}`,
                            fontWeight: '600'
                          }}
                          title={`Status: ${transaction.status}`}
                        >
                          {transaction.status && transaction.status.toLowerCase() === 'completed' && 'Concluída'}
                          {transaction.status && transaction.status.toLowerCase() === 'pending' && 'Pendente'}
                          {transaction.status && transaction.status.toLowerCase() === 'cancelled' && 'Cancelada'}
                          {['completed','pending','cancelled'].indexOf(transaction.status && transaction.status.toLowerCase()) === -1 && transaction.status}
                        </span>
                      </td>
                      <td className="transaction-due-date-cell">
                        <span style={{ color: 'var(--text-primary, #374151)', fontWeight: '500' }}>
                          {transaction.dueDate ? formatDate(transaction.dueDate) : '-'}
                        </span>
                      </td>
                      <td className="transaction-actions-cell">
                        <div className="transaction-actions">
                          <StatusDropdown
                            status={transaction.status?.toLowerCase()}
                            transaction={transaction}
                            open={openStatusDropdownId === transaction.id}
                            onOpen={() => setOpenStatusDropdownId(transaction.id)}
                            onClose={() => setOpenStatusDropdownId(null)}
                            onChange={optValue => handleStatusChange(transaction, optValue)}
                          />
                          <button
                            className="action-btn edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(transaction);
                            }}
                            title="Editar"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(transaction);
                            }}
                            disabled={deletingId === transaction.id}
                            title="Excluir"
                          >
                            {deletingId === transaction.id ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18"/>
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="transaction-list-actions">
          <button className="back-btn" onClick={handleBackToDashboard}>
            Voltar ao Dashboard
          </button>
          <button 
            className="create-btn"
            onClick={() => window.location.href = '/criar-transacao'}
          >
            Nova Transação
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionList; 