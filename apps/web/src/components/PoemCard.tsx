'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Bookmark, Share2, MoreVertical, AlertTriangle } from 'lucide-react';
import UserAvatar from './UserAvatar';
import GenreBadge from './GenreBadge';

interface PoemCardProps {
  id: string;
  title: string;
  bodyPreview: string;
  author: { id: string; name: string; avatar?: string };
  genre: string;
  likes: number;
  comments: number;
  saves: number;
  hasLiked?: boolean;
  hasSaved?: boolean;
  createdAt?: string;
}

export default function PoemCard({ 
  id, title, bodyPreview, author, genre, 
  likes, comments, saves, hasLiked, hasSaved, createdAt = '2 hours ago' 
}: PoemCardProps) {
  const [liked, setLiked] = useState(hasLiked || false);
  const [saved, setSaved] = useState(hasSaved || false);
  const [likeCount, setLikeCount] = useState(likes);
  const [saveCount, setSaveCount] = useState(saves);
  const [showMenu, setShowMenu] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setSaved(!saved);
    setSaveCount(saved ? saveCount - 1 : saveCount + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    // Native share or copy link
    if (navigator.share) {
      navigator.share({
        title: `${title} by ${author.name}`,
        text: bodyPreview,
        url: `${window.location.origin}/poem/${id}`,
      }).catch(console.error);
    }
  };

  // Preview lines logic
  const lines = bodyPreview.split('\n');
  const showPreview = lines.length > 4;
  const previewText = showPreview ? lines.slice(0, 4).join('\n') : bodyPreview;

  return (
    <Link href={`/poem/${id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', outline: 'none' }}>
      <div className="card" style={{ marginBottom: '1.5rem', animation: 'pageEnter 0.4s ease-out forwards' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <UserAvatar name={author.name} url={author.avatar} size="md" />
            <div>
              <div style={{ fontWeight: '600', fontSize: 'var(--text-md)' }}>{author.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{createdAt}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <GenreBadge genre={genre} />
            <div style={{ position: 'relative' }}>
              <button 
                onClick={(e) => { e.preventDefault(); setShowMenu(!showMenu); }}
                className="btn btn-ghost" 
                style={{ padding: '0.25rem', borderRadius: '50%' }}
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>
              {showMenu && (
                <div style={{ 
                  position: 'absolute', right: 0, top: '100%', 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                  zIndex: 10,
                  minWidth: '200px',
                  overflow: 'hidden'
                }}>
                  <Link href={`/contact?type=copyright&id=${id}`} 
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.5rem', 
                      padding: '0.75rem 1rem', 
                      color: 'var(--color-danger)', 
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)',
                      fontWeight: '500'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AlertTriangle size={16} />
                    Report Copyright Violation
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Poem Body */}
        <div style={{ marginBlock: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="urdu-text" style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>
            {title}
          </h2>
          <div className="poem-verse urdu-text" style={{ whiteSpace: 'pre-line' }}>
            {previewText}
          </div>
          {showPreview && (
            <div style={{ marginTop: '1rem', color: 'var(--color-primary)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
              مزید پڑھیں... (Read more)
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
          <button 
            onClick={handleLike} 
            className="btn btn-ghost" 
            style={{ padding: '0.5rem', color: liked ? 'var(--color-accent)' : 'inherit', borderRadius: '50%' }}
            aria-label={liked ? "Unlike" : "Like"}
          >
            <Heart size={22} fill={liked ? 'currentColor' : 'none'} className={liked ? 'animate-heartbeat' : ''} style={{ transition: 'fill 0.2s' }} />
            <span style={{ marginLeft: '0.5rem', fontWeight: '500' }}>{likeCount}</span>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
            <MessageCircle size={22} />
            <span style={{ fontWeight: '500' }}>{comments}</span>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={handleShare} 
              className="btn btn-ghost" 
              style={{ padding: '0.5rem', borderRadius: '50%' }}
              aria-label="Share"
            >
              <Share2 size={20} />
            </button>
            <button 
              onClick={handleSave} 
              className="btn btn-ghost" 
              style={{ padding: '0.5rem', color: saved ? 'var(--color-secondary)' : 'inherit', borderRadius: '50%' }}
              aria-label={saved ? "Unsave" : "Save"}
            >
              <Bookmark size={22} fill={saved ? 'currentColor' : 'none'} style={{ transition: 'fill 0.2s' }} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
