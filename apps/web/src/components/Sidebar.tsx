'use client';

import React from 'react';
import Link from 'next/link';
import UserAvatar from './UserAvatar';

export default function Sidebar() {
  const genres = ['غزل', 'نظم', 'حمد', 'نعت', 'رباعی', 'قطعہ'];
  
  return (
    <aside style={{ position: 'sticky', top: '5rem', height: 'fit-content' }}>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Explore Genres</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {genres.map((genre) => (
            <label key={genre} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span className="urdu-text" style={{ fontSize: 'var(--text-md)' }}>{genre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>Trending Poets</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <UserAvatar name={`Poet ${i}`} size="md" />
              <div>
                <Link href={`/profile/${i}`} style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>
                  <div className="urdu-text" style={{ fontSize: 'var(--text-md)' }}>شاعر {i}</div>
                </Link>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>10k Followers</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
