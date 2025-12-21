import React from 'react';
import './QuickActions.css';

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 1, icon: '📤', label: 'Upload File', action: 'upload' },
    { id: 2, icon: '🔍', label: 'Search Files', action: 'search' },
    { id: 3, icon: '📝', label: 'Cloud Notes', action: 'notes' },
    { id: 4, icon: '📊', label: 'Analytics', action: 'analytics' },
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
