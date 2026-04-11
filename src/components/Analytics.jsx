import React from 'react';
import { BarChart3, PieChart as PieChartIcon, Target, TrendingUp } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TREND_DATA = [
  { time: 'Mon', incursions: 4, safe: 20 },
  { time: 'Tue', incursions: 3, safe: 21 },
  { time: 'Wed', incursions: 7, safe: 17 },
  { time: 'Thu', incursions: 2, safe: 22 },
  { time: 'Fri', incursions: 9, safe: 15 },
  { time: 'Sat', incursions: 12, safe: 12 },
  { time: 'Sun', incursions: 5, safe: 19 }
];

const PIE_DATA = [
  { name: 'Elephant', value: 35 },
  { name: 'Wild Boar', value: 45 },
  { name: 'Monkey', value: 10 },
  { name: 'Human/Other', value: 10 }
];
const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#cbd5e1'];

export default function Analytics({ systemState }) {
  return (
    <div style={{ flex: 1, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 /> Analytics Engine
          </h1>
          <p className="text-muted">Macro-organism behavioral trends and deterrence efficacy.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
         <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>TOTAL INCURSIONS (7D)</p>
            <h2 style={{ fontSize: '2.5rem' }}>42</h2>
            <p className="text-danger" style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}><TrendingUp size={16}/> +14% vs last week</p>
         </div>
         <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>DETERRENCE SUCCESS</p>
            <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>92.8%</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Failed deterrence: 3</p>
         </div>
         <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <p className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600 }}>AVG RESPONSE TIME</p>
            <h2 style={{ fontSize: '2.5rem' }}>0.4s</h2>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>From detection to acoustic pulse</p>
         </div>
         <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: 'var(--primary-container)', border: 'none' }}>
            <p style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>PREDICTIVE INSIGHT</p>
            <p style={{ color: 'var(--on-surface)', fontSize: '0.9rem', marginTop: '0.5rem' }}>High probability of boar activity predicted tonight between 19:00 - 22:00 in Sector 04.</p>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="panel-card">
           <h3 style={{ marginBottom: '1.5rem' }}>Weekly Intrusion Volume</h3>
           <div style={{ height: '300px', width: '100%' }}>
             <ResponsiveContainer>
               <AreaChart data={TREND_DATA}>
                 <defs>
                   <linearGradient id="colorIncursions" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--error)" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="var(--error)" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--outline-variant)" />
                 <XAxis dataKey="time" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--surface-container-high)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                 <Area type="monotone" dataKey="incursions" stroke="var(--error)" strokeWidth={3} fillOpacity={1} fill="url(#colorIncursions)" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        <div className="panel-card">
           <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <PieChartIcon size={20} /> Species Distribution
           </h3>
           <div style={{ height: '220px', width: '100%' }}>
             <ResponsiveContainer>
               <PieChart>
                 <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                   {PIE_DATA.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', backgroundColor: 'var(--surface-container-high)' }} />
               </PieChart>
             </ResponsiveContainer>
           </div>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {PIE_DATA.map((entry, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: COLORS[index] }}></div>
                    <span style={{ fontSize: '0.9rem' }}>{entry.name}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>{entry.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
