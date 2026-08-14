'use client';

import React from 'react';
import { AlertTriangle, ShieldAlert, FileText, CheckCircle, Search } from 'lucide-react';

interface PlagiarismReportCardProps {
  poemId: string;
  poemTitle: string;
  authorName: string;
  simhashDistance: number; // e.g., 0-64 (lower means more similar)
  jaccardOverlap: number; // e.g., 0-100 percentage
  osintMatches: Array<{ sourceUrl: string; matchType: string }>;
  status: 'Pending Review' | 'Flagged' | 'Cleared';
}

export default function PlagiarismReportCard({
  poemId,
  poemTitle,
  authorName,
  simhashDistance,
  jaccardOverlap,
  osintMatches,
  status
}: PlagiarismReportCardProps) {
  
  // Determine severity based on distance and overlap
  const isHighRisk = simhashDistance < 10 || jaccardOverlap > 70;
  const isMediumRisk = (simhashDistance >= 10 && simhashDistance < 20) || (jaccardOverlap > 40 && jaccardOverlap <= 70);
  
  const riskColor = isHighRisk ? 'var(--color-danger)' : isMediumRisk ? 'var(--color-secondary)' : 'var(--color-success)';
  const riskLabel = isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk';

  return (
    <div className="card" style={{ marginBottom: '1.5rem', borderLeft: `4px solid ${riskColor}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} />
            {poemTitle}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: '0.25rem' }}>by {authorName} • ID: {poemId}</p>
        </div>
        <div style={{ padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: 'var(--text-xs)', fontWeight: 'bold', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
          {status}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBlock: '1.5rem' }}>
        {/* Metrics */}
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <span>Simhash Distance</span>
            <span style={{ fontWeight: 'bold', color: simhashDistance < 15 ? 'var(--color-danger)' : 'inherit' }}>{simhashDistance}/64</span>
          </div>
          <div style={{ width: '100%', background: 'var(--bg-elevated)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: \`\${(1 - simhashDistance/64) * 100}%\`, background: simhashDistance < 15 ? 'var(--color-danger)' : 'var(--color-primary)', height: '100%' }} />
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            <span>Jaccard Overlap</span>
            <span style={{ fontWeight: 'bold', color: jaccardOverlap > 60 ? 'var(--color-danger)' : 'inherit' }}>{jaccardOverlap}%</span>
          </div>
          <div style={{ width: '100%', background: 'var(--bg-elevated)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: \`\${jaccardOverlap}%\`, background: jaccardOverlap > 60 ? 'var(--color-danger)' : 'var(--color-primary)', height: '100%' }} />
          </div>
        </div>
        
        <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
           {isHighRisk ? <ShieldAlert size={32} color={riskColor} /> : isMediumRisk ? <AlertTriangle size={32} color={riskColor} /> : <CheckCircle size={32} color={riskColor} />}
           <div>
             <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Risk Level</div>
             <div style={{ fontWeight: 'bold', color: riskColor, fontSize: 'var(--text-md)' }}>{riskLabel}</div>
           </div>
        </div>
      </div>

      {/* OSINT Evidence */}
      {osintMatches.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <Search size={16} />
            OSINT Match Evidence
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {osintMatches.map((match, idx) => (
              <div key={idx} style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                <a href={match.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>{match.sourceUrl}</a>
                <span style={{ color: 'var(--color-danger)', fontWeight: '500' }}>{match.matchType}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button className="btn btn-primary" style={{ flex: 1, background: 'var(--color-danger)', color: 'white', border: 'none' }}>Take Down Poem</button>
        <button className="btn" style={{ flex: 1, background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Dismiss Report</button>
      </div>
    </div>
  );
}
