import React from 'react';
import './QuickActions.css';

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 1, icon: '📤', label: 'Upload File', action: 'upload' },
    { id: 2, icon: '🔍', label: 'Search Files', action: 'search' },
    { id: 3, icon: '�', label: 'Share Link', action: 'share' },
    { id: 4, icon: '💾', label: 'Backup Files', action: 'backup' },
    { id: 5, icon: '📂', label: 'Organize', action: 'organize' },
    { id: 6, icon: '📦', label: 'Archive', action: 'archive' },
  ];

  const handleActionClick = (action) => {
    if (onAction) {
      onAction(action);
    }
  };

  return (
    <section className="quick-actions">
      <h2 className="section-title">⚡ Quick Actions</h2>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button 
            key={action.id} 
            className="action-card" 
            onClick={() => handleActionClick(action.action)}
            style={{ animationDelay: `${index * 0.1}s` }}
            title={action.label}
          >
            <div className="action-icon">{action.icon}</div>
            <div className="action-label">{action.label}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
