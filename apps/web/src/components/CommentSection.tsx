'use client';

import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import { useAuthStore } from '@/lib/auth-store';

interface CommentProps {
  id: string;
  content: string;
  author: { name: string; avatar?: string };
  createdAt: string;
}

const mockComments: CommentProps[] = [
  { id: '1', content: 'بہت خوبصورت کلام ہے!', author: { name: 'Ali Raza' }, createdAt: '1h ago' },
  { id: '2', content: 'سبحان اللہ، کیا بات ہے۔', author: { name: 'Ayesha' }, createdAt: '3h ago' },
];

export default function CommentSection({ poemId }: { poemId: string }) {
  const { isAuthenticated, user } = useAuthStore();
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const comment: CommentProps = {
      id: Date.now().toString(),
      content: newComment,
      author: { name: user.display_name, avatar: user.avatar_url },
      createdAt: 'Just now',
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: '1.5rem' }}>Comments ({comments.length})</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <UserAvatar name={user?.display_name || ''} url={user?.avatar_url} size="md" />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <textarea
              className="input urdu-text"
              placeholder="اپنی رائے کا اظہار کریں..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
            <div style={{ alignSelf: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={!newComment.trim()}>
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="card" style={{ textAlign: 'center', marginBottom: '2rem', padding: '2rem' }}>
          <p style={{ marginBottom: '1rem' }}>Please log in to leave a comment.</p>
          <a href="/login" className="btn btn-primary">Log In</a>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {comments.map((comment) => (
          <div key={comment.id} style={{ display: 'flex', gap: '1rem' }}>
            <UserAvatar name={comment.author.name} url={comment.author.avatar} size="md" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <span style={{ fontWeight: '500' }}>{comment.author.name}</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{comment.createdAt}</span>
              </div>
              <div className="urdu-text" style={{ fontSize: 'var(--text-md)', backgroundColor: 'var(--bg-surface)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                {comment.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
