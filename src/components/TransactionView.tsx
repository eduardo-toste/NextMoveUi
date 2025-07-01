import React from 'react';
import type { TransactionResponseDTO } from '../services/api';

const FIELDS_LABELS: Record<string, string> = {
  title: 'Título',
  description: 'Descrição',
  type: 'Tipo',
  amount: 'Valor',
  status: 'Status',
  dueDate: 'Data de Vencimento',
  createdAt: 'Data de Criação',
};

const STATUS_PT: Record<string, string> = {
  completed: 'Concluída',
  pending: 'Pendente',
  scheduled: 'Agendada',
};

const typeLabels: Record<string, string> = {
  INCOME: 'Receita',
  EXPENSE: 'Despesa',
};

interface TransactionViewProps {
  transaction: TransactionResponseDTO;
  onClose: () => void;
  onEdit?: (transaction: TransactionResponseDTO) => void;
  onStatusChange?: (transaction: TransactionResponseDTO, newStatus: string) => void;
}

const statusColors: Record<string, string> = {
  completed: '#10b981',
  pending: '#f59e0b',
  scheduled: '#3b82f6',
};

const TransactionView: React.FC<TransactionViewProps> = ({ transaction, onClose, onEdit, onStatusChange }) => {
  const mainTitle = (transaction as any).title || transaction.description || 'Detalhes da Transação';
  const fields = Object.entries(transaction).filter(([key]) => !/id/i.test(key));

  // Separar campos principais
  const amount = transaction.amount;
  const status = transaction.status;
  const type = transaction.type;
  const description = transaction.description;
  const dueDate = transaction.dueDate;

  // Campos extras (exclui principais)
  const extraFields = fields.filter(([key]) => !['title','description','amount','status','type','createdAt','dueDate'].includes(key));

  const getNextStatus = (current: string) => {
    if (current.toLowerCase() === 'pending') return { next: 'completed', label: 'Concluir', color: '#10b981', icon: '✔️' };
    if (current.toLowerCase() === 'completed') return { next: 'pending', label: 'Marcar como Pendente', color: '#f59e0b', icon: '⏳' };
    return null;
  };

  const statusAction = getNextStatus(transaction.status);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar detalhes da transação">
            &times;
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {onEdit && (
              <button
                className="modal-edit-btn"
                onClick={() => onEdit(transaction)}
                aria-label="Editar transação"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', fontSize: 20 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            )}
            {statusAction && onStatusChange && (
              <button
                className="modal-status-btn"
                style={{ background: statusAction.color, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                onClick={() => onStatusChange(transaction, statusAction.next as string)}
                aria-label={statusAction.label}
              >
                <span>{statusAction.icon}</span> {statusAction.label}
              </button>
            )}
          </div>
        </div>
        {/* Título grande */}
        <h2 className="dashboard-title" style={{ marginBottom: 8, fontSize: '1.6rem', textAlign: 'center', letterSpacing: 0.2, fontWeight: 700 }}>{mainTitle}</h2>
        {/* Valor em destaque */}
        {typeof amount === 'number' && (
          <div style={{ textAlign: 'center', margin: '10px 0 10px 0' }}>
            <span style={{ fontWeight: 700, color: '#667eea', fontSize: '2.1rem', letterSpacing: 0.2 }}>
              {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
        )}
        {/* Chips de status e tipo */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
          {type && (
            <span style={{
              background: type === 'INCOME' ? 'rgba(16,185,129,0.13)' : 'rgba(239,68,68,0.13)',
              color: type === 'INCOME' ? '#10b981' : '#ef4444',
              fontWeight: 700,
              borderRadius: 14,
              padding: '4px 16px',
              fontSize: '1rem',
              letterSpacing: 0.2,
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
            }}>{typeLabels[type] || type}</span>
          )}
          {status && (
            <span style={{
              background: statusColors[String(status).toLowerCase()] + '22',
              color: statusColors[String(status).toLowerCase()] || 'var(--text-secondary, #6b7280)',
              fontWeight: 700,
              borderRadius: 14,
              padding: '4px 16px',
              fontSize: '1rem',
              letterSpacing: 0.2,
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
            }}>{STATUS_PT[String(status).toLowerCase()] || status}</span>
          )}
        </div>
        {/* Descrição em box separada */}
        {description && (
          <div className="section-main" style={{ borderRadius: 10, padding: '12px 14px', margin: '0 0 16px 0', fontWeight: 500, fontSize: '1.07rem', textAlign: 'center', width: '100%' }}>
            {description}
          </div>
        )}
        {/* Data de vencimento */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: dueDate || extraFields.length ? 16 : 0, width: '100%' }}>
          {dueDate && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: '#667eea', fontSize: '0.95rem' }}>Data de Vencimento</span>
              <span style={{ fontWeight: 500, fontSize: '0.98rem', marginTop: 2 }}>
                {new Date(dueDate as string).toLocaleDateString('pt-BR', { dateStyle: 'short' })}
              </span>
            </div>
          )}
        </div>
        {/* Campos extras em grid uniforme */}
        {extraFields.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 6, width: '100%' }}>
            {extraFields.map(([key, value]) => (
              <div className="section-main" key={key} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 8, padding: '7px 12px', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary, #374151)', minWidth: 80 }}>{FIELDS_LABELS[key] || key}:</span>
                <span style={{ fontWeight: 500, color: 'var(--text-primary, #374151)' }}>{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionView; 