'use client';

import React, { useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  onFileUpload: (file: File) => void;
  mode: 'paste' | 'upload';
  onModeChange: (mode: 'paste' | 'upload') => void;
}

export default function TextInput({
  value,
  onChange,
  onFileUpload,
  mode,
  onModeChange
}: TextInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="tabs">
        <div 
          className={`tab ${mode === 'paste' ? 'active' : ''}`}
          onClick={() => onModeChange('paste')}
        >
          Paste Text
        </div>
        <div 
          className={`tab ${mode === 'upload' ? 'active' : ''}`}
          onClick={() => onModeChange('upload')}
        >
          Upload DOCX
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {mode === 'paste' ? (
          <>
            <textarea
              className="input input-rtl textarea"
              style={{ flex: 1, resize: 'none', fontSize: 'var(--text-lg)', padding: '1rem' }}
              placeholder="اپنی شاعری یہاں پیسٹ کریں..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
              <span>{value.length} characters</span>
              <span>{value.split('\n').filter(line => line.trim().length > 0).length} lines</span>
            </div>
          </>
        ) : (
          <div 
            className="upload-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <UploadCloud size={48} className="upload-icon" />
            <div>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: '0.5rem' }}>Upload Document</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>Drag & drop your DOCX file here, or click to browse</p>
            </div>
            <div className="badge badge-genre" style={{ marginTop: '1rem' }}>
              <FileText size={14} style={{ marginRight: '4px' }} /> .docx only
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
