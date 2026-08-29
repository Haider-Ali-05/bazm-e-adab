'use client';

import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import PoemCard from './PoemCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { Feather, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

async function fetchPoems({ pageParam = 0 }: { pageParam: number }) {
  const res = await fetch(`${API_BASE}/poems?limit=10&offset=${pageParam * 10}`);
  if (!res.ok) throw new Error(`Failed to fetch poems (${res.status})`);
  const data = await res.json();
  return {
    poems: data.poems || [],
    nextCursor: (data.poems?.length === 10) ? pageParam + 1 : undefined,
  };
}

export default function PoemFeed() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ['poems'],
    queryFn: fetchPoems,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5, rootMargin: '100px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading skeletons
  if (status === 'pending') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>
              <div>
                <div className="skeleton" style={{ width: '120px', height: '16px', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ width: '80px', height: '12px' }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBlock: '2rem' }}>
              <div className="skeleton" style={{ width: '60%', height: '32px' }}></div>
              <div className="skeleton" style={{ width: '80%', height: '24px' }}></div>
              <div className="skeleton" style={{ width: '70%', height: '24px' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <AlertCircle size={48} color="var(--color-danger)" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1rem' }}>Something went wrong</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>We couldn't load the poems at this time.</p>
        <button onClick={() => refetch()} className="btn btn-primary">Try Again</button>
      </div>
    );
  }

  const allPoems = data.pages.flatMap(page => page.poems);

  // Empty state (no poems in DB yet)
  if (allPoems.length === 0) {
    return (
      <EmptyState
        icon={<Feather size={48} color="var(--color-primary)" />}
        message="No poems yet — be the first to publish!"
        action={<Link href="/compose" className="btn btn-primary">Write a Poem</Link>}
      />
    );
  }

  return (
    <div>
      {allPoems.map((poem: any, i: number) => (
        <PoemCard
          key={`${poem.id}-${i}`}
          id={poem.id}
          title={poem.title}
          bodyPreview={poem.body}
          author={{
            id: poem.author_id,
            name: poem.display_name || poem.username || 'Unknown',
            avatar: poem.avatar_url,
          }}
          genre={poem.genre || 'غزل'}
          likes={poem.like_count || 0}
          comments={poem.comment_count || 0}
          saves={poem.saves || 0}
          createdAt={poem.created_at ? new Date(poem.created_at).toLocaleDateString('ur-PK') : ''}
        />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} style={{ height: '20px', marginBlock: '2rem', display: 'flex', justifyContent: 'center' }}>
        {isFetchingNextPage && <LoadingSpinner size="md" />}
      </div>

      {!hasNextPage && allPoems.length > 0 && (
        <div style={{ textAlign: 'center', marginBlock: '3rem', color: 'var(--text-muted)' }}>
          <p>آپ نے تمام کلام پڑھ لیا۔</p>
        </div>
      )}
    </div>
  );
}
