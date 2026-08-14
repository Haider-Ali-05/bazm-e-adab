'use client';

import React from 'react';
import Link from 'next/link';

export default function EditProfilePage() {
  return (
    <div style={{ maxWidth: '600px', marginInline: 'auto', paddingBlock: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Edit Profile</h1>
        <Link href="/profile/me" className="btn btn-ghost">Cancel</Link>
      </div>

      <div className="card">
        <form>
          <div className="input-group">
            <label>Display Name</label>
            <input className="input urdu-text" defaultValue="شاعر کا نام" />
          </div>

          <div className="input-group">
            <label>Bio</label>
            <textarea className="input textarea urdu-text" defaultValue="یہاں اپنے بارے میں کچھ لکھیں۔" />
          </div>

          <div className="input-group">
            <label>City</label>
            <input className="input urdu-text" defaultValue="لاہور" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
