import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
      {icon && <div style={{ marginBottom: '1rem', fontSize: '2rem' }}>{icon}</div>}
      <p style={{ marginBottom: '1.5rem', fontSize: 'var(--text-lg)' }}>{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
