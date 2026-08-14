'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import UserAvatar from './UserAvatar';
import { Bell, Menu, PenSquare, LogOut, Settings, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  return (
    <nav className="glass-nav">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBlock: '1rem', position: 'relative' }}>
        
        {/* Logo & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span 
              className="urdu-text" 
              style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: 'bold', 
                color: 'var(--color-primary)',
                textShadow: '0 0 20px rgba(79, 70, 229, 0.3)',
                transition: 'text-shadow 0.3s ease'
              }}
            >
              بزمِ ادب
            </span>
          </Link>
          <div style={{ display: 'none' }} className="desktop-search">
            <SearchBar />
          </div>
        </div>

        {/* Actions (Desktop) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ display: 'none' }} className="desktop-actions">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <button className="btn btn-ghost" style={{ position: 'relative', padding: '0.5rem', borderRadius: '50%' }}>
                  <Bell size={22} />
                  <span className="animate-pulse" style={{ position: 'absolute', top: 4, right: 4, width: '10px', height: '10px', backgroundColor: 'var(--color-danger)', borderRadius: '50%', border: '2px solid var(--bg-surface)' }}></span>
                </button>
                
                <Link href="/book" className="btn btn-ghost" style={{ borderRadius: '9999px', padding: '0.5rem 1.25rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  <span>My Books</span>
                </Link>
                
                <Link href="/compose" className="btn btn-primary" style={{ borderRadius: '9999px', padding: '0.5rem 1.25rem' }}>
                  <PenSquare size={18} />
                  <span>Write</span>
                </Link>

                {/* User Dropdown */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  <button 
                    className="btn btn-ghost" 
                    style={{ padding: 0, borderRadius: '50%', overflow: 'hidden' }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <UserAvatar name={user?.display_name || 'User'} url={user?.avatar_url} size="sm" />
                  </button>

                  {dropdownOpen && (
                    <div className="dropdown">
                      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <UserAvatar name={user?.display_name || 'User'} url={user?.avatar_url} size="md" />
                        <div>
                          <div style={{ fontWeight: '600' }}>{user?.display_name}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>@{user?.username}</div>
                        </div>
                      </div>
                      <div style={{ padding: '0.5rem' }}>
                        <Link href="/profile/me" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setDropdownOpen(false)}>
                          <User size={18} /> My Profile
                        </Link>
                        <Link href="/settings" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setDropdownOpen(false)}>
                          <Settings size={18} /> Settings
                        </Link>
                        <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-danger)' }}>
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link href="/login" className="btn btn-ghost">Log In</Link>
                <Link href="/signup" className="btn btn-primary" style={{ borderRadius: '9999px' }}>Sign Up</Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Toggle */}
          <button className="btn btn-ghost mobile-menu-btn" style={{ display: 'none', padding: '0.5rem' }} onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="modal-overlay" style={{ justifyContent: 'flex-end' }}>
          <div style={{ width: '300px', height: '100%', backgroundColor: 'var(--bg-surface)', padding: '1.5rem', animation: 'slideInRight 0.3s forwards', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <span className="urdu-text" style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-primary)' }}>بزمِ ادب</span>
              <button className="btn btn-ghost" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <SearchBar />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {isAuthenticated ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <UserAvatar name={user?.display_name || 'User'} url={user?.avatar_url} size="md" />
                    <div>
                      <div style={{ fontWeight: '600' }}>{user?.display_name}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>@{user?.username}</div>
                    </div>
                  </div>
                  <Link href="/compose" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }} onClick={() => setMobileMenuOpen(false)}>
                    <PenSquare size={18} /> Write a Poem
                  </Link>
                  <Link href="/book" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }} onClick={() => setMobileMenuOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg> My Books
                  </Link>
                  <Link href="/profile/me" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => setMobileMenuOpen(false)}>
                    <User size={18} /> My Profile
                  </Link>
                  <Link href="/settings" className="btn btn-ghost" style={{ justifyContent: 'flex-start' }} onClick={() => setMobileMenuOpen(false)}>
                    <Settings size={18} /> Settings
                  </Link>
                  <div style={{ marginTop: 'auto' }}>
                    <ThemeToggle />
                    <button onClick={handleLogout} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'flex-start', color: 'var(--color-danger)', marginTop: '1rem' }}>
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                  <Link href="/signup" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                  <div style={{ marginTop: 'auto', alignSelf: 'flex-start' }}>
                    <ThemeToggle />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @media (min-width: 768px) {
          .desktop-search { display: block !important; flex: 1; max-width: 300px; }
          .desktop-actions { display: flex !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
