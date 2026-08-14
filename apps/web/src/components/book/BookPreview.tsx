'use client';

import React, { useState } from 'react';
import { BookTemplate } from './TemplateSelector';
import { BookSettings } from './CustomizationPanel';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface BookPreviewProps {
  couplets: Array<{ misra1: string; misra2: string }>;
  template: BookTemplate;
  fontName: string;
  settings: BookSettings;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  title: string;
  poet: string;
}

export default function BookPreview({
  couplets,
  template,
  fontName,
  settings,
  currentPage,
  totalPages,
  onPageChange,
  title,
  poet
}: BookPreviewProps) {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleZoomReset = () => setZoom(100);

  // Convert English numerals to Urdu
  const toUrduNumerals = (num: number) => {
    const urduDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num.toString().replace(/\d/g, d => urduDigits[parseInt(d)]);
  };

  const displayPageNum = settings.numeralStyle === 'urdu' ? toUrduNumerals(currentPage) : currentPage;

  // Calculate actual height based on aspect ratio
  // Standard A4 is 210x297 (aspect ratio ~0.707)
  const pageWidth = 500;
  const pageHeight = pageWidth / template.aspectRatio;

  const fontFam = fontName === 'jameel-noori' ? 'var(--font-urdu-display)' : 
                  fontName === 'noto-nastaliq' ? 'var(--font-urdu-body)' : 
                  'var(--font-urdu-body)';

  return (
    <div className="book-preview-area" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      
      <div 
        className="book-page-container" 
        style={{ 
          transform: `scale(${zoom / 100})`, 
          transformOrigin: 'top center',
          marginBottom: zoom > 100 ? `${(zoom - 100) * 5}px` : '0' // Adjust spacing when zoomed
        }}
      >
        <div 
          className="book-page"
          style={{
            width: `${pageWidth}px`,
            height: `${pageHeight}px`,
            paddingTop: `${settings.marginTop * 3.77}px`, // roughly converting mm to px
            paddingBottom: `${settings.marginBottom * 3.77}px`,
            paddingLeft: `${settings.marginOuter * 3.77}px`,
            paddingRight: `${settings.marginInner * 3.77}px`,
          }}
        >
          {/* Page Border */}
          {settings.showBorder && (
            <div style={{
              position: 'absolute',
              top: '15px', bottom: '15px', left: '15px', right: '15px',
              border: template.id === 'classical' ? '3px double #333' : '1px solid #999',
              pointerEvents: 'none'
            }}></div>
          )}

          {/* Header */}
          {settings.showHeader && (
            <div style={{
              position: 'absolute',
              top: `${(settings.marginTop * 3.77) / 2}px`,
              left: 0, right: 0,
              textAlign: 'center',
              fontFamily: fontFam,
              fontSize: '12px',
              color: '#666'
            }}>
              {currentPage % 2 === 0 ? title : poet}
            </div>
          )}

          {/* Content Area */}
          <div 
            className="book-page-content"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {couplets.map((couplet, idx) => (
              <div 
                key={idx} 
                className="preview-couplet"
                style={{ 
                  marginBottom: `${settings.sherSpacing}px`,
                  fontFamily: fontFam,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight
                }}
              >
                <div className="preview-misra">{couplet.misra1}</div>
                <div className="preview-misra">{couplet.misra2}</div>
                
                {settings.showSeparator && idx < couplets.length - 1 && (
                  <div className="preview-separator" style={{ fontFamily: fontFam }}>
                    {settings.separatorText || '٭'}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer / Page Number */}
          {settings.showFooter && (
            <div style={{
              position: 'absolute',
              bottom: `${(settings.marginBottom * 3.77) / 2}px`,
              left: 0, right: 0,
              textAlign: 'center',
              fontFamily: fontFam,
              fontSize: '14px',
              color: '#333'
            }}>
              - {displayPageNum} -
            </div>
          )}

        </div>
      </div>

      {/* Navigation */}
      <div className="page-nav">
        <button 
          className="btn btn-ghost" 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
        >
          <ChevronLeft size={20} />
        </button>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>
        <button 
          className="btn btn-ghost" 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="zoom-controls">
        <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In"><ZoomIn size={18} /></button>
        <div className="zoom-value">{zoom}%</div>
        <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out"><ZoomOut size={18} /></button>
        <button className="zoom-btn" onClick={handleZoomReset} title="Reset Zoom" style={{ borderTop: '1px solid var(--border-color)' }}><Maximize size={18} /></button>
      </div>

    </div>
  );
}
