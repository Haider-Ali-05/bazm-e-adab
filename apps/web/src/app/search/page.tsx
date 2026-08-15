'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import PoemFeed from '@/components/PoemFeed';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  return (
    <>
      <h1 style={{ fontSize: 'var(--text-xl)', marginBottom: '2rem' }}>
        Search results for: <strong>{query}</strong>
      </h1>
      <PoemFeed />
    </>
  );
}

export default function SearchPage() {
  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto', paddingBlock: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <SearchBar />
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
