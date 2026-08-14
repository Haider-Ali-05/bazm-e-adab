import React from 'react';
import Sidebar from '@/components/Sidebar';
import PoemFeed from '@/components/PoemFeed';

export default function HomePage() {
  return (
    <>
      <div style={{ 
        textAlign: 'center', 
        paddingBlock: '4rem 2rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '2rem',
        background: 'linear-gradient(to bottom, var(--color-primary-light), transparent)'
      }}>
        <div className="container">
          <h1 className="urdu-text" style={{ 
            fontSize: 'var(--text-4xl)', 
            fontWeight: 'bold', 
            color: 'var(--color-primary)',
            marginBottom: '1rem',
            textShadow: '0 4px 20px rgba(79, 70, 229, 0.2)'
          }}>
            بزمِ ادب
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)', maxWidth: '600px', marginInline: 'auto' }}>
            Where Poetry Lives. Discover, share, and celebrate the rich heritage of Urdu poetry.
          </p>
        </div>
      </div>

      <div className="sidebar-layout">
        <Sidebar />
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <PoemFeed />
        </div>
      </div>
    </>
  );
}
