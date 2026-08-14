'use client';

import React, { useState, useEffect } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState('General Inquiry');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('type') === 'copyright') {
        setCategory('Copyright Report');
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '600px', marginInline: 'auto', paddingBlock: '2rem' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>Contact Us</h1>

      {submitted ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-success)', marginBottom: '1rem' }}>Message Sent!</h2>
          <p>Thank you for reaching out. We will review your request and get back to you soon.</p>
        </div>
      ) : (
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Name</label>
              <input type="text" className="input" required />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input type="email" className="input" required />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Copyright Report">Copyright Report</option>
                <option value="Bug Report">Bug Report</option>
              </select>
            </div>
            
            {category === 'Copyright Report' && (
              <div style={{ padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: 'var(--text-md)', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)' }}>Copyright Claim Details</h3>
                <div className="input-group">
                  <label>Original Source URL (Optional)</label>
                  <input type="url" className="input" placeholder="https://example.com/my-original-poem" />
                </div>
                <div className="input-group">
                  <label>Electronic Signature</label>
                  <input type="text" className="input" placeholder="Type your full legal name" required />
                </div>
              </div>
            )}

            <div className="input-group">
              <label>Message / Details</label>
              <textarea className="input textarea" required rows={5} placeholder={category === 'Copyright Report' ? "Please provide details about the copyrighted material and where it appears..." : "How can we help you?"} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}
