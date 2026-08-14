'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', display_name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submit
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 80px)', padding: '2rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" type="text" className="input" onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label htmlFor="display_name">Display Name</label>
              <input id="display_name" name="display_name" type="text" className="input urdu-text" onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className="input" onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" className="input" onChange={handleChange} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Sign Up
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
