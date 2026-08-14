'use client';

import React from 'react';
import ThemeToggle from '@/components/ThemeToggle';

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: '600px', marginInline: 'auto', paddingBlock: '2rem' }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: '2rem' }}>Settings</h1>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: '1.5rem' }}>Preferences</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Appearance</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: '1.5rem' }}>Account Settings</h2>
        <form>
          <div className="input-group">
            <label>Email</label>
            <input type="email" className="input" defaultValue="user@example.com" />
          </div>
          <button type="button" className="btn btn-secondary">Update Email</button>
        </form>
      </div>

      <div className="card" style={{ border: '1px solid var(--color-danger)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--color-danger)' }}>Danger Zone</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Once you delete your account, there is no going back. Please be certain.</p>
        <button className="btn" style={{ backgroundColor: 'var(--color-danger)', color: 'white' }}>Delete Account</button>
      </div>
    </div>
  );
}
