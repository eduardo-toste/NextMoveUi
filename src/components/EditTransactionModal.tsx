import React, { useState } from 'react';
import type { TransactionResponseDTO } from '../services/api';
import { apiService } from '../services/api';

interface EditTransactionModalProps {
  transaction: TransactionResponseDTO;
  onClose: () => void;
  onSave: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: (transaction as any).title || '',
    description: transaction.description || '',
    amount: transaction.amount.toString(),
    dueDate: transaction.dueDate ? transaction.dueDate.slice(0, 10) : '',
    type: transaction.type || 'EXPENSE',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const updatedData = {
        ...transaction,
        title: formData.title,
        description: formData.description,
        amount: parseFloat(formData.amount) || 0,
        dueDate: formData.dueDate,
        type: formData.type,
      };
      await apiService.updateTransaction(transaction.id, updatedData);
      setSuccess(true);
      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao editar transação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar edição">&times;</button>
        <h2 className="dashboard-title" style={{ marginBottom: 8, fontSize: '1.6rem', textAlign: 'center', letterSpacing: 0.2, fontWeight: 700 }}>Editar Transação</h2>
        {success && (
          <div className="success-message">✅ Transação editada com sucesso!</div>
        )}
        {error && (
          <div className="error-message">❌ {error}</div>
        )}
        <form onSubmit={handleSubmit} className="create-transaction-form">
          <div className="form-group">
            <label htmlFor="title">Título *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Título da transação"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descrição *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva a transação..."
              required
              rows={3}
            />
          </div>
          <div className="form-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
              <label htmlFor="amount">Valor *</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
              <label htmlFor="dueDate">Vencimento *</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="type">Tipo *</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="EXPENSE">Despesa</option>
              <option value="INCOME">Receita</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal; 