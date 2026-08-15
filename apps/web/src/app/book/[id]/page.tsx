'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import Link from 'next/link';
import { ArrowLeft, Download, Settings, Trash2, Book as BookIcon } from 'lucide-react';
// We would import BookPreview here to show the full preview in a real implementation

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Unwrapping params is necessary in Next.js 15
  const { id } = React.use(params);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !isAuthenticated) {
      router.push(`/login?redirect=/book/${id}`);
    }
  }, [isMounted, isAuthenticated, router, id]);

  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [isAuthenticated]);

  if (!isMounted || !isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="section" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="animate-spin">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <Link href="/book" className="btn btn-ghost" style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={18} /> Back to My Books
      </Link>

      <div className="sidebar-layout">
        {/* Left Col: Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '120px', height: '170px', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px', border: '4px solid var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', boxShadow: 'var(--shadow-lg)' }}>
                <BookIcon size={48} />
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 className="urdu-text" style={{ fontSize: 'var(--text-3xl)', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>بانگِ درا</h1>
              <h2 className="urdu-text" style={{ fontSize: 'var(--text-xl)', color: 'var(--text-secondary)' }}>علامہ اقبال</h2>
            </div>

            <div className="divider"></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--text-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Template</span>
                <span style={{ fontWeight: '500' }}>Classical (B5)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Font</span>
                <span style={{ fontWeight: '500' }}>Jameel Noori Nastaleeq</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Pages</span>
                <span style={{ fontWeight: '500' }}>120</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Couplets</span>
                <span style={{ fontWeight: '500' }}>480</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Created</span>
                <span style={{ fontWeight: '500' }}>August 10, 2026</span>
              </div>
            </div>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
            <Download size={20} /> Download PDF
          </button>
          
          <Link href={`/book/create?edit=${id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
            <Settings size={20} /> Re-generate Settings
          </Link>

          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--color-danger)' }}>
            <Trash2 size={20} /> Delete Book
          </button>
        </div>

        {/* Right Col: Preview */}
        <div className="card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-secondary)' }}>
           {/* We would render BookPreview here with all pages */}
           <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
             <BookIcon size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
             <p>Full preview is generated dynamically.</p>
             <p style={{ fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>Click "Download PDF" to view the complete book.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
