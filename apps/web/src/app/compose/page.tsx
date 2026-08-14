'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

export default function ComposePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // In a real app, we'd use a layout or middleware for protection
  React.useEffect(() => {
    // if (!isAuthenticated) {
    //   router.push('/login');
    // }
  }, [isAuthenticated, router]);

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [genre, setGenre] = useState('غزل');
  const [scriptType, setScriptType] = useState<'urdu' | 'roman'>('urdu');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', paddingBlock: '3rem' }}>
      
      {/* Editor Panel */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: '2rem' }}>Write a Poem</h1>
        
        <form style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="input-group">
            <label className="form-label">Title</label>
            <input 
              className={`input ${scriptType === 'urdu' ? 'input-rtl' : ''}`}
              style={{ fontSize: 'var(--text-xl)', padding: '1rem' }}
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder={scriptType === 'urdu' ? "عنوان لکھیں..." : "Enter title..."} 
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <div className="input-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Genre</label>
              <select className="input urdu-text" value={genre} onChange={e => setGenre(e.target.value)}>
                <option value="غزل">غزل</option>
                <option value="نظم">نظم</option>
                <option value="حمد">حمد</option>
                <option value="نعت">نعت</option>
                <option value="رباعی">رباعی</option>
                <option value="قطعہ">قطعہ</option>
              </select>
            </div>
            
            <div className="input-group" style={{ flex: 1, minWidth: '150px' }}>
              <label className="form-label">Script Type</label>
              <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', padding: '0.25rem' }}>
                <button 
                  type="button"
                  className="btn"
                  style={{ flex: 1, backgroundColor: scriptType === 'urdu' ? 'var(--bg-surface)' : 'transparent', boxShadow: scriptType === 'urdu' ? 'var(--shadow-sm)' : 'none', color: scriptType === 'urdu' ? 'var(--color-primary)' : 'var(--text-secondary)' }}
                  onClick={() => setScriptType('urdu')}
                >
                  اردو
                </button>
                <button 
                  type="button"
                  className="btn"
                  style={{ flex: 1, backgroundColor: scriptType === 'roman' ? 'var(--bg-surface)' : 'transparent', boxShadow: scriptType === 'roman' ? 'var(--shadow-sm)' : 'none', color: scriptType === 'roman' ? 'var(--color-primary)' : 'var(--text-secondary)' }}
                  onClick={() => setScriptType('roman')}
                >
                  Roman
                </button>
              </div>
            </div>
          </div>

          <div className="input-group" style={{ flex: 1 }}>
            <label className="form-label">Poem Body</label>
            <textarea 
              className={`input textarea ${scriptType === 'urdu' ? 'input-rtl' : ''}`}
              value={body} 
              onChange={e => setBody(e.target.value)}
              placeholder={scriptType === 'urdu' ? "یہاں لکھیں..." : "Write your poem here..."}
              style={{ flex: 1, minHeight: '300px', fontSize: scriptType === 'urdu' ? 'var(--text-lg)' : 'var(--text-md)', lineHeight: scriptType === 'urdu' ? 'var(--leading-urdu)' : 'var(--leading-normal)' }}
            />
          </div>

          <div className="input-group">
            <label className="form-label">Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {tags.map(tag => (
                <span key={tag} className="badge badge-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', paddingRight: '0.25rem' }}>
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', padding: '0.1rem', borderRadius: '50%' }}>
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input 
              type="text" 
              className="input" 
              placeholder="Press Enter to add tags..." 
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Publish Poem</button>
          </div>
        </form>
      </div>

      {/* Live Preview Panel */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)', border: '1px dashed var(--border-color)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--text-muted)', textAlign: 'center' }}>Live Preview</h2>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
          <span className="badge badge-genre" style={{ marginBottom: '2rem' }}>{genre}</span>
          
          <h2 className={scriptType === 'urdu' ? 'urdu-text' : ''} style={{ 
            fontSize: 'var(--text-3xl)', 
            fontWeight: 'bold', 
            marginBottom: '2rem', 
            color: 'var(--color-primary)',
            fontFamily: scriptType === 'urdu' ? 'var(--font-urdu-display)' : 'inherit'
          }}>
            {title || (scriptType === 'urdu' ? 'عنوان' : 'Title')}
          </h2>
          
          <div className={scriptType === 'urdu' ? 'poem-verse urdu-text' : ''} style={{ 
            whiteSpace: 'pre-line',
            opacity: body ? 1 : 0.5,
            fontFamily: scriptType === 'urdu' ? 'var(--font-urdu-display)' : 'inherit'
          }}>
            {body || (scriptType === 'urdu' ? 'آپ کا کلام یہاں نظر آئے گا...' : 'Your poem will appear here...')}
          </div>
        </div>
      </div>
      
    </div>
  );
}
