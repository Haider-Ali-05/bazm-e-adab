'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book, Plus, Edit2, Download, Trash2 } from 'lucide-react';

interface BookItem {
  id: string;
  title: string;
  poet: string;
  template: string;
  pages: number;
  createdAt: string;
  status: 'draft' | 'published';
}

export default function MyBooksPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !isAuthenticated) {
      router.push('/login?redirect=/book');
    }
  }, [isMounted, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      // Mock fetch
      setTimeout(() => {
        setBooks([
          { id: '1', title: 'بانگِ درا', poet: 'علامہ اقبال', template: 'Classical', pages: 120, createdAt: '2026-08-10', status: 'published' },
          { id: '2', title: 'دیوانِ غالب', poet: 'مرزا غالب', template: 'Calligraphic', pages: 85, createdAt: '2026-08-12', status: 'draft' }
        ]);
        setIsLoading(false);
      }, 800);
    }
  }, [isAuthenticated]);

  if (!isMounted || !isAuthenticated) return null;

  return (
    <div className="section">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold' }}>My Books</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Manage your generated poetry collections</p>
        </div>
        <Link href="/book/create" className="btn btn-primary btn-lg">
          <Plus size={20} />
          Create New Book
        </Link>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card skeleton" style={{ height: '200px' }}></div>
          ))}
        </div>
      ) : books.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {books.map(book => (
            <div key={book.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '56px', backgroundColor: 'var(--color-primary-light)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                    <Book size={20} />
                  </div>
                  <div>
                    <h3 className="urdu-text" style={{ fontSize: 'var(--text-xl)', marginBottom: '0.25rem' }}>{book.title}</h3>
                    <p className="urdu-text" style={{ fontSize: 'var(--text-md)', color: 'var(--text-secondary)' }}>{book.poet}</p>
                  </div>
                </div>
                <span className={`badge ${book.status === 'published' ? 'badge-status' : 'badge-genre'}`}>
                  {book.status}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <div>Template: <strong>{book.template}</strong></div>
                <div>Pages: <strong>{book.pages}</strong></div>
                <div>Created: <strong>{new Date(book.createdAt).toLocaleDateString()}</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <Link href={`/book/${book.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Eye size={16} /> View
                </Link>
                <Link href={`/book/create?edit=${book.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                  <Edit2 size={16} /> Edit
                </Link>
                <button className="btn btn-ghost" style={{ color: 'var(--color-danger)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Book size={48} style={{ margin: '0 auto 1rem', color: 'var(--border-color)' }} />
          <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: '0.5rem' }}>No books created yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Start compiling your poetry into a beautiful PDF book.</p>
          <Link href="/book/create" className="btn btn-primary">
            Start Your First Book
          </Link>
        </div>
      )}
    </div>
  );
}
