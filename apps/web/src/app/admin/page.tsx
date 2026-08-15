'use client';

import React, { useState } from 'react';
import PlagiarismReportCard from '../../components/admin/PlagiarismReportCard';
import { Shield, AlertCircle, Inbox } from 'lucide-react';

// Mock Data
const mockReports = [
  {
    poemId: 'p-101',
    poemTitle: 'Dard-e-Dil',
    authorName: 'Ali Raza',
    simhashDistance: 5,
    jaccardOverlap: 85,
    osintMatches: [
      { sourceUrl: 'https://rekhta.org/couplets/dard-e-dil-faiz', matchType: 'Exact Match' }
    ],
    status: 'Pending Review' as const
  },
  {
    poemId: 'p-102',
    poemTitle: 'Raat Ka Safar',
    authorName: 'Sara Khan',
    simhashDistance: 18,
    jaccardOverlap: 45,
    osintMatches: [
      { sourceUrl: 'https://twitter.com/poetry_urdu/status/12345', matchType: 'Partial Match' }
    ],
    status: 'Flagged' as const
  },
  {
    poemId: 'p-103',
    poemTitle: 'Subh-e-Umeed',
    authorName: 'Hassan',
    simhashDistance: 45,
    jaccardOverlap: 10,
    osintMatches: [],
    status: 'Cleared' as const
  }
];

const mockTickets = [
  { id: 't-001', type: 'Copyright Claim', user: 'Zainab B.', date: '2 hours ago', status: 'Open' },
  { id: 't-002', type: 'Abusive Content', user: 'Anonymous', date: '5 hours ago', status: 'In Progress' }
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'plagiarism' | 'tickets'>('plagiarism');

  return (
    <div style={{ maxWidth: '1000px', marginInline: 'auto', paddingBlock: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Shield size={32} color="var(--color-primary)" />
        <div>
          <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold' }}>Trust & Safety Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor copyright violations and moderation queue</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('plagiarism')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: 'var(--text-md)', fontWeight: 'bold', cursor: 'pointer',
            color: activeTab === 'plagiarism' ? 'var(--color-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'plagiarism' ? '2px solid var(--color-primary)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            Plagiarism Reports
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('tickets')}
          style={{ 
            background: 'none', border: 'none', padding: '0.5rem 1rem', fontSize: 'var(--text-md)', fontWeight: 'bold', cursor: 'pointer',
            color: activeTab === 'tickets' ? 'var(--color-primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'tickets' ? '2px solid var(--color-primary)' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Inbox size={18} />
            Support Tickets
          </div>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'plagiarism' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>Flagged Content Queue</h2>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{mockReports.length} items to review</span>
          </div>
          
          {mockReports.map(report => (
            <PlagiarismReportCard key={report.poemId} {...report} />
          ))}
        </div>
      )}

      {activeTab === 'tickets' && (
        <div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>User Reports & Claims</h2>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{mockTickets.length} open tickets</span>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-secondary)' }}>
                <tr>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>Ticket ID</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>Type</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>User</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>Date</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>Status</th>
                  <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', fontWeight: 'bold' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockTickets.map((ticket, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontSize: 'var(--text-sm)' }}>{ticket.id}</td>
                    <td style={{ padding: '1rem', fontSize: 'var(--text-sm)', color: ticket.type === 'Copyright Claim' ? 'var(--color-danger)' : 'inherit', fontWeight: '500' }}>{ticket.type}</td>
                    <td style={{ padding: '1rem', fontSize: 'var(--text-sm)' }}>{ticket.user}</td>
                    <td style={{ padding: '1rem', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{ticket.date}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '1rem', 
                        fontSize: 'var(--text-xs)', 
                        background: ticket.status === 'Open' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: ticket.status === 'Open' ? 'var(--color-danger)' : 'var(--color-secondary)'
                      }}>
                        {ticket.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <button className="btn btn-ghost" style={{ fontSize: 'var(--text-sm)', padding: '0.5rem 1rem' }}>Review</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
