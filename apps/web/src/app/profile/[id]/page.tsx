'use client';

import React, { useState } from 'react';
import UserAvatar from '@/components/UserAvatar';
import PoemFeed from '@/components/PoemFeed';
import { Settings, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params as any);
  const id = unwrappedParams.id;
  const [activeTab, setActiveTab] = useState<'poems' | 'saved'>('poems');
  const isOwnProfile = id === 'me' || id === '1'; // Mock condition

  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto', paddingBlock: '2rem' }}>
      <div className="card" style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Cover Photo placeholder */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', backgroundColor: 'var(--color-primary)', opacity: 0.1 }}></div>
        
        <div style={{ position: 'relative', marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <UserAvatar name="User" size="lg" />
          <h1 className="urdu-text" style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginTop: '1rem' }}>شاعر کا نام</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>@username</p>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
            <div><strong style={{ fontSize: 'var(--text-lg)' }}>42</strong> <span style={{ color: 'var(--text-muted)' }}>Poems</span></div>
            <div><strong style={{ fontSize: 'var(--text-lg)' }}>1.2k</strong> <span style={{ color: 'var(--text-muted)' }}>Followers</span></div>
            <div><strong style={{ fontSize: 'var(--text-lg)' }}>50</strong> <span style={{ color: 'var(--text-muted)' }}>Following</span></div>
          </div>

          {isOwnProfile ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/profile/edit" className="btn btn-secondary" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                <Edit size={18} /> Edit Profile
              </Link>
              <Link href="/settings" className="btn btn-ghost">
                <Settings size={18} />
              </Link>
            </div>
          ) : (
            <button className="btn btn-primary">Follow</button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button 
          className="btn btn-ghost"
          style={{ flex: 1, borderRadius: 0, borderBottom: activeTab === 'poems' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'poems' ? 'var(--color-primary)' : 'inherit' }}
          onClick={() => setActiveTab('poems')}
        >
          Poems
        </button>
        {isOwnProfile && (
          <button 
            className="btn btn-ghost"
            style={{ flex: 1, borderRadius: 0, borderBottom: activeTab === 'saved' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'saved' ? 'var(--color-primary)' : 'inherit' }}
            onClick={() => setActiveTab('saved')}
          >
            Saved
          </button>
        )}
      </div>

      <PoemFeed />
    </div>
  );
}
