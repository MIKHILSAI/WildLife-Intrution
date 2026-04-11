import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Activity, Battery, Signal, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Overview({ systemState }) {
  const isAlert = systemState.status !== 'Safe';
  
  // Real-time animated chart data
  const [chartData, setChartData] = useState(
    Array.from({ length: 15 }, (_, i) => ({ time: `-${15 - i}m`, value: 15 + Math.random() * 10 }))
  );
  
  const [battery, setBattery] = useState(84);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1].value;
        const trend = (Math.random() - 0.5) * 4;
        newData.push({ 
           time: 'Live', 
           value: Math.max(0, lastVal + trend + (isAlert ? 15 : 0)) // Spike on alert
        });
        return newData;
      });
      // simulate slight battery drain occasionally
      if (Math.random() > 0.8) setBattery(b => Math.max(10, b - 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [isAlert]);

  return (
    <div style={{ flex: 1, backgroundColor: 'transparent' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        Overview <span className="text-muted" style={{ fontSize: '1rem', fontWeight: 500 }}>LAB_ID: NAMMA-2401</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Main Status Block */}
        <div className={`panel-card ${isAlert ? 'bg-danger-transparent' : 'bg-primary-transparent'}`} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className={`status-dot ${isAlert ? 'danger' : 'safe'}`}></div>
            <span style={{ fontWeight: 600, color: isAlert ? 'var(--error)' : 'var(--primary)', letterSpacing: '1px', fontSize: '0.8rem' }}>
              {isAlert ? 'THREAT DETECTED' : 'LIVE SHIELD ACTIVE'}
            </span>
          </div>
          <h2 style={{ fontSize: '2.5rem' }}>Status: <span className={isAlert ? 'text-danger' : 'text-primary'}>{systemState.status}</span></h2>
          <p className="text-muted" style={{ maxWidth: '80%' }}>
            {isAlert 
              ? `System AI vision confirms intrusion by: ${systemState.aiSubject}. Automated deterrence is currently ${systemState.deterrence}.` 
              : "System AI vision confirms no thermal anomalies or macro-organism intrusion detected in the past 24 hours."}
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '0.5rem' }}>
               <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-container)', borderRadius: '50%', color: 'var(--primary)' }}><ShieldCheck size={20} /></div>
             </div>
             <button style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--outline-variant)', backgroundColor: 'transparent', cursor: 'pointer' }}>Download Report</button>
          </div>
        </div>

        {/* Nodes Grid */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1.5rem' }}>
          <div className="panel-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px' }}>ACTIVE NODES</p>
              <h2 style={{ fontSize: '2.5rem' }}>42<span className="text-muted" style={{ fontSize: '1.25rem' }}>/44</span></h2>
            </div>
            <Zap size={32} className="text-primary" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="panel-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <Battery size={24} className={battery > 20 ? "text-primary" : "text-danger"} style={{ marginBottom: '0.5rem' }} />
               <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>AVG BATTERY</p>
               <h3 style={{ fontSize: '1.5rem' }}>{battery}%</h3>
            </div>
            <div className="panel-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               <Signal size={24} className="text-primary" style={{ marginBottom: '0.5rem' }} />
               <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>SIGNAL</p>
               <h3 style={{ fontSize: '1rem' }}>Excellent</h3>
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Recent Activity</h2>
            <span className="text-primary" style={{ cursor: 'pointer', fontWeight: 600 }}>View All Events &rarr;</span>
          </div>

          <div className="panel-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <div style={{ padding: '0.75rem', backgroundColor: 'var(--primary-container)', borderRadius: '8px', color: 'var(--primary)' }}><Activity size={24} /></div>
             <div style={{ flex: 1 }}>
               <h4 style={{ fontSize: '1.1rem' }}>{systemState.recentAlerts[0] ? `${systemState.recentAlerts[0].type} Detection` : 'Node 08 Detection'}</h4>
               <p className="text-muted" style={{ fontSize: '0.9rem' }}>{systemState.recentAlerts[0] ? `Distance: ${systemState.recentAlerts[0].dist}` : 'Small macro-organism bypassed - Zone C'}</p>
             </div>
             <div style={{ textAlign: 'right' }}>
               <p style={{ fontWeight: 600 }}>{systemState.recentAlerts[0] ? systemState.recentAlerts[0].time : '04:12 AM'}</p>
               <span style={{ backgroundColor: 'var(--surface-container-highest)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>LOGGED</span>
             </div>
          </div>

        </div>

        <div className="panel-card" style={{ backgroundColor: '#064e3b', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
           <div>
             <h3 style={{ marginBottom: '1rem', color: '#ecfdf5' }}>Today's Stats</h3>
             <p style={{ fontSize: '0.8rem', color: '#6ee7b7', letterSpacing: '1px' }}>TOTAL INTRUSIONS</p>
             <h1 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{systemState.intrusionsToday.toString().padStart(2, '0')}</h1>
             <p style={{ fontSize: '0.8rem', color: '#6ee7b7' }}>88% LOWER THAN AVG</p>
           </div>
           
           <div style={{ marginTop: '2rem' }}>
             <p style={{ fontSize: '0.8rem', color: '#6ee7b7', letterSpacing: '1px' }}>RISK LEVEL</p>
             <h2 style={{ fontSize: '2rem' }}>{systemState.riskLevel.toUpperCase()}</h2>
             <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
               <div style={{ height: 4, flex: 1, backgroundColor: systemState.riskLevel === 'Low' ? '#10b981' : '#dc2626' }}></div>
               <div style={{ height: 4, flex: 1, backgroundColor: systemState.riskLevel === 'Critical' ? '#dc2626' : '#065f46' }}></div>
               <div style={{ height: 4, flex: 1, backgroundColor: '#065f46' }}></div>
             </div>
           </div>
        </div>

      </div>

      <div className="panel-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Field Vitals Trend</h3>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--surface-container-highest)" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--on-surface-variant)', fontSize: 12}} />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--surface-container-high)', border: 'none', borderRadius: '8px', color: 'var(--on-surface)' }} />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={false} fill="url(#colorUv)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
