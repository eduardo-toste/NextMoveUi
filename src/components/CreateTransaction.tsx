import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

interface CreateTransactionForm {
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  type: 'INCOME' | 'EXPENSE';
}

const CreateTransaction: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateTransactionForm>({
    title: '',
    description: '',
    amount: 0,
    dueDate: '',
    type: 'EXPENSE'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const transactionData = {
        title: formData.title,
        description: formData.description,
        amount: formData.amount,
        dueDate: formData.dueDate,
        type: formData.type
      };

      await apiService.createTransaction(transactionData);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        amount: 0,
        dueDate: '',
        type: 'EXPENSE'
      });
      
      // Redirecionar para dashboard após 2 segundos
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar transação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="create-transaction-container">
      <div className="create-transaction-card">
        <div className="create-transaction-header">
          <h1>Nova Transação</h1>
          <p>Preencha os dados para criar uma nova transação</p>
        </div>

        {success && (
          <div className="success-message">
            ✅ Transação criada com sucesso! Redirecionando...
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
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

          <div className="form-row">
            <div className="form-group">
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

            <div className="form-group">
              <label htmlFor="dueDate">Data de Vencimento *</label>
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
              onClick={handleCancel}
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
                  <span className="spinner" style={{ marginRight: '8px' }}></span>
                  Criando...
                </>
              ) : (
                'Criar Transação'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTransaction; 