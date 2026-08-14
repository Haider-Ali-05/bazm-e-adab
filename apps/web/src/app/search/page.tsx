'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import PoemFeed from '@/components/PoemFeed';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto', paddingBlock: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <SearchBar />
      </div>

      <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: '2rem' }}>
        Search results for: <strong>{query}</strong>
      </h1>

      <PoemFeed />
    </div>
  );
}
