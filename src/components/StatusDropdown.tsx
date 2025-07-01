import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

interface StatusDropdownProps {
  status: string;
  transaction: any;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onChange: (newStatus: string) => void;
}

const statusOptions = [
  { value: 'completed', label: 'Concluída', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ) },
  { value: 'pending', label: 'Pendente', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
  ) },
  { value: 'cancelled', label: 'Cancelada', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  ) },
];

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, transaction, open, onOpen, onClose, onChange }) => {
  const current = statusOptions.find(opt => opt.value === status);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{top: number, left: number}>({ top: 0, left: 0 });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!btnRef.current) return;
      const dropdown = document.getElementById(`dropdown-status-${transaction.id}`);
      if (dropdown && !dropdown.contains(event.target as Node) && !btnRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose, transaction.id]);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX
      });
    }
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        className="action-btn status-btn"
        style={{ background: 'none', border: 'none', padding: 0, margin: '0 4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={e => {
          e.stopPropagation();
          open ? onClose() : onOpen();
        }}
        title="Alterar status"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Ícone universal de troca/ciclo */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 5.36A9 9 0 0 0 20.49 15" />
        </svg>
      </button>
      {open && ReactDOM.createPortal(
        <div
          id={`dropdown-status-${transaction.id}`}
          style={{
            position: 'absolute',
            top: dropdownPos.top,
            left: dropdownPos.left,
            zIndex: 9999,
            background: '#23272f',
            border: '1px solid #374151',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
            minWidth: 140,
            padding: 4,
            transition: 'opacity 0.15s',
            opacity: 1
          }}
          onClick={e => e.stopPropagation()}
        >
          {statusOptions.map(opt => (
            <button
              key={opt.value}
              disabled={opt.value === status}
              onClick={e => {
                e.stopPropagation();
                onClose();
                if (opt.value !== status) onChange(opt.value);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 16px', background: 'none', border: 'none', color: opt.value === status ? '#6b7280' : '#fff', fontWeight: 500, fontSize: 15, cursor: opt.value === status ? 'default' : 'pointer', opacity: opt.value === status ? 0.6 : 1, borderRadius: 6, transition: 'background 0.15s', marginBottom: 2
              }}
              title={opt.label}
              tabIndex={opt.value === status ? -1 : 0}
              aria-disabled={opt.value === status}
            >
              {opt.icon} {opt.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}; 