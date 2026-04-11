import React, { useState } from 'react';
import { Bell, Filter, Download } from 'lucide-react';

export default function AlertCenter({ systemState }) {
  const [filterActive, setFilterActive] = useState(false);

  const historicalAlerts = [
    { id: 101, type: 'Elephant', dist: '15cm', time: 'Yesterday, 14:00', action: 'High-Freq Blare (10s)' },
    { id: 102, type: 'Wild Boar', dist: '40cm', time: 'Yesterday, 19:45', action: 'Strobe Flash' },
    { id: 103, type: 'Monkey', dist: '120cm', time: 'Yesterday, 06:15', action: 'Ignored (Safe Distance)' },
    { id: 104, type: 'Bird', dist: '20cm', time: 'Oct 10, 12:20', action: 'Ignored (Small signature)' },
  ];

  let allAlerts = [...systemState.recentAlerts, ...historicalAlerts];
  
  if (filterActive) {
    allAlerts = allAlerts.filter(a => !a.action.includes('Ignored'));
  }

  const handleExportCSV = () => {
    const csvRows = ["TIMESTAMP,THREAT SIGNATURE,PROXIMITY,AUTOMATED RESPONSE"];
    allAlerts.forEach(a => {
      csvRows.push(`${a.time},${a.type},${a.dist},${a.action}`);
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'field_alert_logs.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ flex: 1, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell /> Alert Center & Logs
          </h1>
          <p className="text-muted">Master ledger of all system detections and automated interventions.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="btn" 
            style={{ backgroundColor: filterActive ? 'var(--primary-container)' : 'var(--surface-container-high)', border: '1px solid var(--outline-variant)' }}
            onClick={() => setFilterActive(!filterActive)}
          >
            <Filter size={18} /> {filterActive ? 'Filtering: Threats Only' : 'Filter Options'}
          </button>
          <button className="btn primary" onClick={handleExportCSV}><Download size={18} /> Export CSV</button>
        </div>
      </div>

      <div className="panel-card" style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-container-high)', borderBottom: '1px solid var(--outline-variant)' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>TIMESTAMP</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>THREAT SIGNATURE</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>PROXIMITY</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>AUTOMATED RESPONSE</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--on-surface-variant)' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {allAlerts.map((alert, idx) => (
              <tr key={alert.id || idx} style={{ borderBottom: '1px solid var(--surface-container-highest)', transition: 'background 0.2s', ...((idx === 0 && systemState.status !== 'Safe') ? {backgroundColor: 'var(--error-container)'} : {}) }}>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{alert.time}</td>
                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: alert.type === 'Elephant' || alert.type === 'Wild Boar' ? 'var(--error)' : 'inherit' }}>{alert.type}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{alert.dist}</td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{alert.action}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  {alert.action.includes('Ignored') ? (
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--surface-container-high)', color: 'var(--on-surface-variant)', borderRadius: '4px', fontWeight: 600 }}>LOGGED</span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--primary-container)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 600 }}>DETERRED</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
