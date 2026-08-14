'use client';

import React from 'react';

export interface BookTemplate {
  id: string;
  nameUrdu: string;
  nameEng: string;
  dimensions: string;
  description: string;
  aspectRatio: number;
  isPremium?: boolean;
}

export const TEMPLATES: BookTemplate[] = [
  { id: 'classical', nameUrdu: 'کلاسیکی', nameEng: 'Classical', dimensions: '176 × 250 mm (B5)', description: 'Ornate borders, traditional feel', aspectRatio: 176/250, isPremium: true },
  { id: 'modern', nameUrdu: 'جدید', nameEng: 'Modern', dimensions: '148 × 210 mm (A5)', description: 'Minimalist, clean spacing', aspectRatio: 148/210 },
  { id: 'calligraphic', nameUrdu: 'خوشنویسی', nameEng: 'Calligraphic', dimensions: '210 × 297 mm (A4)', description: 'Wide margins, large font', aspectRatio: 210/297, isPremium: true },
  { id: 'pocket', nameUrdu: 'جیبی', nameEng: 'Pocket', dimensions: '105 × 148 mm (A6)', description: 'Compact, easy to carry', aspectRatio: 105/148 },
  { id: 'digital', nameUrdu: 'ڈیجیٹل', nameEng: 'Digital', dimensions: '16:9 Screen', description: 'Optimized for screens', aspectRatio: 9/16 },
];

export default function TemplateSelector({ 
  selectedId, 
  onSelect,
  isPremiumUser = false
}: { 
  selectedId: string; 
  onSelect: (id: string) => void;
  isPremiumUser?: boolean;
}) {
  return (
    <div className="template-grid">
      {TEMPLATES.map((template) => {
        const isLocked = template.isPremium && !isPremiumUser;
        return (
          <div 
            key={template.id}
            className={`template-card ${selectedId === template.id ? 'selected' : ''} ${template.isPremium ? 'premium-template' : ''} ${isLocked ? 'locked' : ''}`}
            onClick={() => {
              if (!isLocked) onSelect(template.id);
            }}
            style={{
              position: 'relative',
              borderColor: template.isPremium ? (selectedId === template.id ? 'gold' : 'rgba(255, 215, 0, 0.5)') : undefined,
              boxShadow: template.isPremium && selectedId === template.id ? '0 0 10px rgba(255, 215, 0, 0.5)' : undefined,
              opacity: isLocked ? 0.6 : 1,
              cursor: isLocked ? 'not-allowed' : 'pointer',
            }}
          >
            {template.isPremium && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                background: 'linear-gradient(45deg, gold, #ffaa00)',
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                zIndex: 10
              }} title="Premium Template">
                👑
              </div>
            )}
            
            {isLocked && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(1px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
                borderRadius: 'inherit'
              }}>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: 'var(--text-xs)',
                  fontWeight: '600'
                }}>
                  Premium Only
                </div>
              </div>
            )}

            <div 
              className="template-card__preview"
              style={{ aspectRatio: template.aspectRatio }}
            >
              {/* Miniature page representation */}
              {template.id === 'classical' && (
                <div style={{ position: 'absolute', inset: '8px', border: '2px double #ccc', borderRadius: '4px' }}></div>
              )}
              <div style={{ width: '60%', height: '2px', background: '#ccc', marginBottom: '4px' }}></div>
              <div style={{ width: '60%', height: '2px', background: '#ccc', marginBottom: '8px' }}></div>
              <div style={{ width: '60%', height: '2px', background: '#ccc', marginBottom: '4px' }}></div>
              <div style={{ width: '60%', height: '2px', background: '#ccc' }}></div>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
              <div className="template-card__title">{template.nameUrdu}</div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: '500' }}>{template.nameEng}</div>
              <div className="template-card__subtitle" style={{ marginTop: '0.25rem' }}>{template.dimensions}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
