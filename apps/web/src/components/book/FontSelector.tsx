'use client';

import React, { useState } from 'react';

export const FONTS = [
  { id: 'jameel-noori', nameUrdu: 'جمیل نوری نستعلیق', nameEng: 'Jameel Noori Nastaleeq', style: 'Nastaliq' },
  { id: 'noto-nastaliq', nameUrdu: 'نوٹو نستعلیق', nameEng: 'Noto Nastaliq Urdu', style: 'Nastaliq' },
  { id: 'amiri', nameUrdu: 'امیری', nameEng: 'Amiri', style: 'Naskh' },
  { id: 'noto-sans-arabic', nameUrdu: 'نوٹو سانس', nameEng: 'Noto Sans Arabic', style: 'Naskh' },
];

type UploadState = 'idle' | 'uploading' | 'validating' | 'success' | 'error';

export default function FontSelector({
  selectedFont,
  onSelect
}: {
  selectedFont: string;
  onSelect: (font: string) => void;
}) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [progress, setProgress] = useState(0);
  const [customFontName, setCustomFontName] = useState<string | null>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulate upload and validation
    setUploadState('uploading');
    setCustomFontName(file.name);
    setProgress(0);
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setUploadState('validating');
        
        // Simulate OTS check delay
        setTimeout(() => {
          if (file.name.endsWith('.ttf') || file.name.endsWith('.otf') || file.name.endsWith('.woff') || file.name.endsWith('.woff2')) {
            setUploadState('success');
            onSelect('custom-font');
          } else {
            setUploadState('error');
          }
          
          setTimeout(() => {
            if (uploadState !== 'error') setUploadState('idle');
          }, 3000);
        }, 1500);
      }
    }, 200);
  };

  return (
    <div>
      <div className="font-list">
        {FONTS.map((font) => (
          <div 
            key={font.id}
            className={`font-item ${selectedFont === font.id ? 'selected' : ''}`}
            onClick={() => onSelect(font.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', fontSize: 'var(--text-sm)' }}>{font.nameEng}</span>
              <span className="badge badge-genre">{font.style}</span>
            </div>
            <div 
              className="font-preview-text"
              style={{ 
                fontFamily: font.id === 'jameel-noori' ? 'var(--font-urdu-display)' : 
                            font.id === 'noto-nastaliq' ? 'var(--font-urdu-body)' : 
                            'var(--font-urdu-body)' // Fallback
              }}
            >
              دل سے جو بات نکلتی ہے اثر رکھتی ہے
            </div>
          </div>
        ))}
        {customFontName && uploadState === 'success' && (
          <div 
            className={`font-item ${selectedFont === 'custom-font' ? 'selected' : ''}`}
            onClick={() => onSelect('custom-font')}
          >
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '500', fontSize: 'var(--text-sm)' }}>{customFontName} (Custom)</span>
              <span className="badge badge-genre" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>Uploaded</span>
            </div>
            <div className="font-preview-text" style={{ fontFamily: 'inherit' }}>
              دل سے جو بات نکلتی ہے اثر رکھتی ہے
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-glass)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: 'var(--text-sm)', fontWeight: '600' }}>Upload Custom Font</h4>
        <p style={{ margin: '0 0 1rem 0', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Supported formats: TTF, OTF, WOFF, WOFF2. Max size 10MB.</p>
        
        <input 
          type="file" 
          id="font-upload" 
          accept=".ttf,.otf,.woff,.woff2"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label 
          htmlFor="font-upload"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            fontSize: 'var(--text-sm)',
            transition: 'all 0.2s'
          }}
        >
          Choose File
        </label>

        {uploadState !== 'idle' && (
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', marginBottom: '0.25rem' }}>
              <span>
                {uploadState === 'uploading' && 'Uploading...'}
                {uploadState === 'validating' && 'Validating font (OTS check)...'}
                {uploadState === 'success' && 'Upload successful!'}
                {uploadState === 'error' && <span style={{ color: 'red' }}>Invalid font file format</span>}
              </span>
              {uploadState === 'uploading' && <span>{progress}%</span>}
            </div>
            {(uploadState === 'uploading' || uploadState === 'validating') && (
              <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-secondary)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  backgroundColor: 'var(--color-primary)', 
                  width: uploadState === 'validating' ? '100%' : `${progress}%`,
                  transition: 'width 0.2s',
                  animation: uploadState === 'validating' ? 'pulse 1s infinite alternate' : 'none'
                }}></div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
