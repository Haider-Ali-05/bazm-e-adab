'use client';

import React from 'react';
import CommentSection from '@/components/CommentSection';
import UserAvatar from '@/components/UserAvatar';
import GenreBadge from '@/components/GenreBadge';
import { Heart, Bookmark, Share2, MoreHorizontal, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function PoemPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params as any);
  const id = unwrappedParams.id;
  // Mock data
  const poem = {
    title: 'کبھی اے حقیقتِ منتظر',
    body: 'کبھی اے حقیقتِ منتظر نظر آ لباسِ مجاز میں\nکہ ہزاروں سجدے تڑپ رہے ہیں میری جبینِ نیاز میں\n\nطرب آشنائے خروش ہو تو نوا ہے محرمِ گوش ہو\nوہ سرود کیا کہ چھپا ہوا ہو سکوتِ پردۂ ساز میں\n\nتو بچا بچا کے نہ رکھ اسے تیرا آئنہ ہے وہ آئنہ\nکہ شکستہ ہو تو عزیز تر ہے نگاہِ آئنہ ساز میں\n\nدمِ طوف کرمکِ شمع نے یہ کہا کہ وہ اثرِ کہن\nنہ تری حکایتِ سوز میں نہ مری حدیثِ گداز میں\n\nنہ کہیں جہاں میں اماں ملی جو اماں ملی تو کہاں ملی\nمرے جرمِ خانہ خراب کو ترے عفوِ بندہ نواز میں',
    author: { id: 'allama-iqbal', name: 'علامہ اقبال', bio: 'مفکر پاکستان، شاعرِ مشرق', followers: '10.5k' },
    genre: 'غزل',
    likes: 1240,
    saves: 300,
    comments: 45,
    tags: ['فلسفہ', 'عشق', 'خودی'],
    createdAt: 'Oct 24, 1935'
  };

  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto', paddingBlock: '3rem' }}>
      
      {/* Poem Card */}
      <div className="card" style={{ marginBottom: '3rem', padding: '0', overflow: 'hidden' }}>
        
        {/* Author Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link href={`/profile/${poem.author.id}`} style={{ textDecoration: 'none' }}>
              <UserAvatar name={poem.author.name} size="lg" />
            </Link>
            <div>
              <Link href={`/profile/${poem.author.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 className="urdu-text" style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>{poem.author.name}</h3>
              </Link>
              <p className="urdu-text" style={{ color: 'var(--text-muted)' }}>{poem.author.bio}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button className="btn btn-primary" style={{ borderRadius: '9999px', paddingInline: '1.5rem' }}>Follow</button>
            <button className="btn btn-ghost" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <MoreHorizontal size={24} />
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <GenreBadge genre={poem.genre} />
          </div>
          
          <h1 className="urdu-text" style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', marginBottom: '3rem', color: 'var(--color-primary)' }}>
            {poem.title}
          </h1>
          
          <div className="poem-verse urdu-text" style={{ whiteSpace: 'pre-line', fontSize: 'var(--text-2xl)', lineHeight: 'var(--leading-urdu)' }}>
            {poem.body}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '4rem' }}>
            {poem.tags.map(tag => (
              <span key={tag} className="badge badge-genre urdu-text">#{tag}</span>
            ))}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: '2rem' }}>
            Published on {poem.createdAt}
          </div>
        </div>

        {/* Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', padding: '1.5rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
          <button className="btn btn-ghost" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Heart size={28} style={{ transition: 'color 0.2s' }} /> 
            <span style={{ fontWeight: '500' }}>{poem.likes}</span>
          </button>
          
          <button className="btn btn-ghost" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <MessageCircle size={28} /> 
            <span style={{ fontWeight: '500' }}>{poem.comments}</span>
          </button>
          
          <button className="btn btn-ghost" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Bookmark size={28} style={{ transition: 'color 0.2s' }} /> 
            <span style={{ fontWeight: '500' }}>{poem.saves}</span>
          </button>

          <button className="btn btn-ghost" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Share2 size={28} /> 
            <span style={{ fontWeight: '500' }}>Share</span>
          </button>
        </div>
      </div>

      <div className="divider"></div>

      <CommentSection poemId={id} />
    </div>
  );
}
