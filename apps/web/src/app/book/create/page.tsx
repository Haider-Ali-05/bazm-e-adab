'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api';
import TemplateSelector, { TEMPLATES } from '@/components/book/TemplateSelector';
import FontSelector, { FONTS } from '@/components/book/FontSelector';
import CustomizationPanel, { BookSettings } from '@/components/book/CustomizationPanel';
import BookPreview from '@/components/book/BookPreview';
import TextInput from '@/components/book/TextInput';
import { Download, Save, Eye } from 'lucide-react';

export default function BookEditorPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Editor State
  const [title, setTitle] = useState('');
  const [poetName, setPoetName] = useState('');
  const [textMode, setTextMode] = useState<'paste' | 'upload'>('paste');
  const [sourceText, setSourceText] = useState('');
  const [couplets, setCouplets] = useState<Array<{ misra1: string; misra2: string }>>([]);
  
  // Customization State
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [selectedFont, setSelectedFont] = useState(FONTS[0].id);
  const [settings, setSettings] = useState<BookSettings>({
    fontSize: 16,
    pageSize: 'A4',
    marginTop: 20,
    marginBottom: 20,
    marginInner: 25,
    marginOuter: 15,
    lineHeight: 2.2,
    sherSpacing: 32,
    showBorder: true,
    showSeparator: true,
    separatorText: '٭',
    showHeader: true,
    showFooter: true,
    numeralStyle: 'urdu'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  // Check auth
  useEffect(() => {
    setIsMounted(true);
    if (isMounted && !isAuthenticated) {
      router.push('/login?redirect=/book/create');
    }
  }, [isMounted, isAuthenticated, router]);

  // Parse source text into couplets (mock implementation for client-side)
  useEffect(() => {
    const lines = sourceText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const newCouplets = [];
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        newCouplets.push({ misra1: lines[i], misra2: lines[i + 1] });
      } else {
        newCouplets.push({ misra1: lines[i], misra2: '' });
      }
    }
    setCouplets(newCouplets);
  }, [sourceText]);

  const handleFileUpload = async (file: File) => {
    // In a real app, this would upload the docx to the server and get extracted text back
    setSourceText("دل سے جو بات نکلتی ہے اثر رکھتی ہے\nپر نہیں، طاقتِ پرواز مگر رکھتی ہے\n\nقدسی الاصل ہے رفعت پہ نظر رکھتی ہے\nخاک سے اٹھتی ہے گردوں پہ گزر رکھتی ہے");
    setTextMode('paste');
  };

  const handleSaveDraft = async () => {
    try {
      setIsGenerating(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Draft saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save draft');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      setProgress(0);
      
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 90) {
            clearInterval(interval);
            return 90;
          }
          return p + 10;
        });
      }, 500);

      // Simulate API call to generate PDF
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setProgress(100);
      clearInterval(interval);
      
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        alert('PDF generated! (This is a mock)');
      }, 500);
      
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      setProgress(0);
      alert('Failed to generate PDF');
    }
  };

  if (!isMounted || !isAuthenticated) return null;

  const template = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
  
  // Calculate approximate total pages based on couplets and page size (mock calculation)
  const coupletsPerPage = Math.floor(600 / (settings.fontSize * settings.lineHeight + settings.sherSpacing));
  const totalPages = Math.max(1, Math.ceil(couplets.length / coupletsPerPage));
  
  // Slice couplets for current page
  const startIndex = (currentPage - 1) * coupletsPerPage;
  const pageCouplets = couplets.slice(startIndex, startIndex + coupletsPerPage);

  return (
    <div className="book-editor-layout" style={{ margin: '-1rem -1rem -1rem -1rem' }}> {/* Compensate for container padding */}
      
      {/* Tool Panel */}
      <div className="book-tool-panel">
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="urdu-text" style={{ color: 'var(--color-primary)' }}>کتاب ساز</span>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', fontWeight: 'normal' }}>Book Editor</span>
          </h2>

          <div className="input-group">
            <label className="form-label">Book Title (Urdu)</label>
            <input 
              type="text" 
              className="input input-rtl" 
              placeholder="کتاب کا نام"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="form-label">Poet Name (Urdu)</label>
            <input 
              type="text" 
              className="input input-rtl" 
              placeholder="شاعر کا نام"
              value={poetName}
              onChange={e => setPoetName(e.target.value)}
            />
          </div>
        </div>

        <div style={{ flex: 1, minHeight: '300px' }}>
          <TextInput 
            value={sourceText}
            onChange={setSourceText}
            mode={textMode}
            onModeChange={setTextMode}
            onFileUpload={handleFileUpload}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
          <button className="btn btn-primary" onClick={handleDownloadPDF} disabled={isGenerating || couplets.length === 0}>
            <Download size={18} />
            Download PDF
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={handleSaveDraft} disabled={isGenerating}>
              <Save size={18} />
              Save Draft
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} disabled={isGenerating}>
              <Eye size={18} />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Preview Area */}
      <BookPreview 
        couplets={pageCouplets}
        template={template}
        fontName={selectedFont}
        settings={settings}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        title={title || 'کتاب کا نام'}
        poet={poetName || 'شاعر کا نام'}
      />

      {/* Settings Panel */}
      <div className="book-settings-panel">
        <div className="setting-section">
          <h3 className="setting-section-title">Template</h3>
          <TemplateSelector selectedId={selectedTemplate} onSelect={setSelectedTemplate} />
        </div>

        <div className="setting-section">
          <h3 className="setting-section-title">Font Selection</h3>
          <FontSelector selectedFont={selectedFont} onSelect={setSelectedFont} />
        </div>

        <CustomizationPanel settings={settings} onChange={setSettings} />
      </div>

      {/* Generation Overlay */}
      {isGenerating && (
        <div className="generation-overlay">
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem 3rem' }}>
            <div className="animate-spin" style={{ marginBottom: '1rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--text-primary)' }}>Typesetting your book...</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Please wait while we generate the PDF.</p>
            
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.5rem' }}>{progress}% Complete</span>
          </div>
        </div>
      )}

    </div>
  );
}
