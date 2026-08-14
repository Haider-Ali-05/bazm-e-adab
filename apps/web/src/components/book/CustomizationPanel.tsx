'use client';

import React from 'react';

export interface BookSettings {
  fontSize: number;
  pageSize: string;
  marginTop: number;
  marginBottom: number;
  marginInner: number;
  marginOuter: number;
  lineHeight: number;
  sherSpacing: number;
  showBorder: boolean;
  showSeparator: boolean;
  separatorText: string;
  showHeader: boolean;
  showFooter: boolean;
  numeralStyle: 'urdu' | 'arabic';
}

export default function CustomizationPanel({
  settings,
  onChange
}: {
  settings: BookSettings;
  onChange: (settings: BookSettings) => void;
}) {
  const handleChange = (key: keyof BookSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="customization-panel">
      
      {/* Typography Section */}
      <div className="setting-section">
        <h3 className="setting-section-title">Typography</h3>
        
        <div className="slider-control">
          <div className="slider-header">
            <span>Font Size</span>
            <span style={{ fontWeight: '500' }}>{settings.fontSize}pt</span>
          </div>
          <input 
            type="range" 
            min="12" max="24" step="1"
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="slider-control">
          <div className="slider-header">
            <span>Line Height</span>
            <span style={{ fontWeight: '500' }}>{settings.lineHeight.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="1.8" max="3.0" step="0.1"
            value={settings.lineHeight}
            onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
            className="slider-input"
          />
        </div>

        <div className="slider-control">
          <div className="slider-header">
            <span>Sher Spacing</span>
            <span style={{ fontWeight: '500' }}>{settings.sherSpacing}pt</span>
          </div>
          <input 
            type="range" 
            min="16" max="60" step="2"
            value={settings.sherSpacing}
            onChange={(e) => handleChange('sherSpacing', parseInt(e.target.value))}
            className="slider-input"
          />
        </div>
      </div>

      {/* Page Setup Section */}
      <div className="setting-section">
        <h3 className="setting-section-title">Page Setup</h3>
        
        <div style={{ marginBottom: '1rem' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Margins (mm)</label>
          <div className="margin-grid">
            <div className="margin-input-group">
              <label>Top</label>
              <input type="number" className="margin-input" value={settings.marginTop} onChange={(e) => handleChange('marginTop', parseInt(e.target.value))} />
            </div>
            <div className="margin-input-group">
              <label>Bottom</label>
              <input type="number" className="margin-input" value={settings.marginBottom} onChange={(e) => handleChange('marginBottom', parseInt(e.target.value))} />
            </div>
            <div className="margin-input-group">
              <label>Inner</label>
              <input type="number" className="margin-input" value={settings.marginInner} onChange={(e) => handleChange('marginInner', parseInt(e.target.value))} />
            </div>
            <div className="margin-input-group">
              <label>Outer</label>
              <input type="number" className="margin-input" value={settings.marginOuter} onChange={(e) => handleChange('marginOuter', parseInt(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      {/* Decorations Section */}
      <div className="setting-section">
        <h3 className="setting-section-title">Decorations</h3>
        
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            className="toggle-input"
            checked={settings.showBorder}
            onChange={(e) => handleChange('showBorder', e.target.checked)}
          />
          <span>Page Border</span>
        </label>

        <label className="toggle-switch">
          <input 
            type="checkbox" 
            className="toggle-input"
            checked={settings.showHeader}
            onChange={(e) => handleChange('showHeader', e.target.checked)}
          />
          <span>Header (Poet Name)</span>
        </label>

        <label className="toggle-switch">
          <input 
            type="checkbox" 
            className="toggle-input"
            checked={settings.showFooter}
            onChange={(e) => handleChange('showFooter', e.target.checked)}
          />
          <span>Footer (Page Numbers)</span>
        </label>

        <label className="toggle-switch">
          <input 
            type="checkbox" 
            className="toggle-input"
            checked={settings.showSeparator}
            onChange={(e) => handleChange('showSeparator', e.target.checked)}
          />
          <span>Sher Separator</span>
        </label>

        {settings.showSeparator && (
          <div style={{ paddingLeft: '2.5rem', marginBottom: '1rem' }}>
            <input 
              type="text" 
              className="input input-rtl" 
              value={settings.separatorText}
              onChange={(e) => handleChange('separatorText', e.target.value)}
              placeholder="Custom separator (e.g. ٭)"
            />
          </div>
        )}
      </div>

    </div>
  );
}
