import React from 'react';

interface GenreBadgeProps {
  genre: string;
}

export default function GenreBadge({ genre }: GenreBadgeProps) {
  // Simple mapping for colors, can be expanded
  const colors: Record<string, string> = {
    'غزل': '#F59E0B',
    'نظم': '#10B981',
    'حمد': '#3B82F6',
    'نعت': '#8B5CF6',
  };

  const backgroundColor = colors[genre] || 'var(--bg-secondary)';
  const color = colors[genre] ? 'white' : 'var(--text-secondary)';

  return (
    <span className="badge" style={{ backgroundColor, color }}>
      <span className="urdu-text" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
        {genre}
      </span>
    </span>
  );
}
