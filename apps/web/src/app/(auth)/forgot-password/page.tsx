'use client';

import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: '1rem' }}>Reset Password</h1>
        
        {submitted ? (
          <p style={{ color: 'var(--text-secondary)' }}>If an account exists, we've sent a reset link to {email}.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: 'var(--text-sm)' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div className="input-group" style={{ textAlign: 'left' }}>
              <input type="email" className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Send Reset Link</button>
          </form>
        )}
      </div>
    </div>
  );
}
