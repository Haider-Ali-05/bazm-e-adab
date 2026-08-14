'use client';

import React, { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import PoemCard from './PoemCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import { Feather, AlertCircle } from 'lucide-react';
// import { api } from '@/lib/api'; // Mocking for now

// Mock data generator
const mockPoems = Array.from({ length: 5 }).map((_, i) => ({
  id: `poem-${i}-${Math.random()}`,
  title: 'کبھی اے حقیقتِ منتظر',
  bodyPreview: 'کبھی اے حقیقتِ منتظر نظر آ لباسِ مجاز میں\nکہ ہزاروں سجدے تڑپ رہے ہیں میری جبینِ نیاز میں\nطرب آشنائے خروش ہو تو نوا ہے محرمِ گوش ہو\nوہ سرود کیا کہ چھپا ہوا ہو سکوتِ پردۂ ساز میں\nتو بچا بچا کے نہ رکھ اسے تیرا آئنہ ہے وہ آئنہ\nکہ شکستہ ہو تو عزیز تر ہے نگاہِ آئنہ ساز میں',
  author: { id: `author-${i}`, name: 'علامہ اقبال' },
  genre: 'غزل',
  likes: Math.floor(Math.random() * 1000) + 100,
  comments: Math.floor(Math.random() * 100) + 10,
  saves: Math.floor(Math.random() * 50) + 5,
  createdAt: `${Math.floor(Math.random() * 24) + 1} hours ago`
}));

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
    queryFn: async ({ pageParam = 0 }) => {
      // return api.get(`/poems?cursor=${pageParam}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
      // Simulate error occasionally for testing: if (Math.random() > 0.8) throw new Error("Failed to fetch");
      return { data: mockPoems, nextCursor: pageParam + 1 };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor < 4 ? lastPage.nextCursor : undefined,
    initialPageParam: 0,
  });

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5, rootMargin: "100px" }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading Skeletons
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

  // Error State
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

  const allPoems = data.pages.flatMap(page => page.data);

  // Empty State
  if (allPoems.length === 0) {
    return (
      <EmptyState 
        icon={<Feather size={48} color="var(--color-primary)" />} 
        message="No poems found — be the first to publish!" 
        action={<a href="/compose" className="btn btn-primary">Write a Poem</a>}
      />
    );
  }

  return (
    <div>
      {allPoems.map((poem, i) => (
        <PoemCard key={`${poem.id}-${i}`} {...poem} />
      ))}
      
      {/* Invisible element for Intersection Observer */}
      <div ref={loadMoreRef} style={{ height: '20px', marginBlock: '2rem', display: 'flex', justifyContent: 'center' }}>
        {isFetchingNextPage && <LoadingSpinner size="md" />}
      </div>

      {!hasNextPage && (
        <div style={{ textAlign: 'center', marginBlock: '3rem', color: 'var(--text-muted)' }}>
          <p>You have reached the end of the collection.</p>
        </div>
      )}
    </div>
  );
}
