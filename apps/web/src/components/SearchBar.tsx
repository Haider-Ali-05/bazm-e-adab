'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', position: 'relative', width: '100%', maxWidth: '400px' }}>
      <input
        type="text"
        className="input urdu-text"
        placeholder="تلاش کریں..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ paddingRight: '2.5rem', width: '100%' }}
      />
      <button type="submit" style={{ position: 'absolute', right: '0.75rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <Search size={18} />
      </button>
    </form>
  );
}
