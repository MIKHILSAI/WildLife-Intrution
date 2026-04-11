import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Zap, Server, Battery } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function HardwareData() {
  const [inferenceData, setInferenceData] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  
  // Real-time chart streaming
  useEffect(() => {
    const generateData = () => {
      const nextInf = [];
      const nextSens = [];
      for(let i=0; i<12; i++) {
        nextInf.push({ name: `T-${11 - i}`, latency: Math.floor(Math.random() * 80) + 40 });
        nextSens.push({ name: `T-${11 - i}`, pir: Math.random() > 0.8 ? 1 : 0, usonic: Math.random() * 30 + 10 });
      }
      setInferenceData(nextInf);
      setSensorData(nextSens);
    };
    generateData();

    const interval = setInterval(() => {
      setInferenceData(prev => {
        return [...prev.slice(1), { name: 'Now', latency: Math.floor(Math.random() * 80) + 40 }];
      });
      setSensorData(prev => {
        // Mock PIR boolean and Ultrasonic distance (cm)
        return [...prev.slice(1), { name: 'Now', pir: Math.random() > 0.9 ? 1 : 0, usonic: Math.random() * 30 + 10 }];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Edge Intelligence
          </h1>
          <p className="text-muted">Real-time processing metrics for distributed ESP32 nodes.</p>
        </div>
        <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--primary-container)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
          • System: Synchronized
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Main Logic Stream */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="panel-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu /> Logic Stream & Inference
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>INFERENCE SPEED</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:'0.25rem' }}>
                  <h2 style={{ fontSize:'2.5rem' }}>142</h2><span className="text-muted">ms/task</span>
                </div>
                <div style={{ height: 4, width: '100%', backgroundColor: 'var(--primary)', marginTop: '0.5rem' }}></div>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>RAM UTILIZATION</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:'0.25rem' }}>
                  <h2 style={{ fontSize:'2.5rem' }}>312</h2><span className="text-muted">KB</span>
                </div>
                <div style={{ height: 4, width: '100%', backgroundColor: 'var(--primary)', marginTop: '0.5rem' }}></div>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>THREAD LOAD</p>
                <div style={{ display:'flex', alignItems:'baseline', gap:'0.25rem' }}>
                  <h2 style={{ fontSize:'2.5rem' }}>4</h2><span className="text-muted">Active</span>
                </div>
                <div style={{ height: 4, width: '100%', backgroundColor: 'var(--warning)', marginTop: '0.5rem' }}></div>
              </div>
            </div>

            <div style={{ height: 180, width: '100%', marginBottom: '2rem' }}>
              <ResponsiveContainer>
                <BarChart data={inferenceData}>
                  <Bar dataKey="latency" fill="var(--primary)" opacity={0.6} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p style={{ textAlign: 'center', color: 'var(--on-surface-variant)', fontSize: '0.8rem', marginTop: '-10px', letterSpacing: '2px', opacity: 0.5 }}>LATENCY PER STREAM</p>
            </div>

            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               Sensor Array Feed (Node_Alpha)
            </h3>
            <div style={{ height: 150, width: '100%' }}>
              <ResponsiveContainer>
                <LineChart data={sensorData}>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface-container-high)', border: 'none' }} />
                  <Line type="stepAfter" dataKey="pir" stroke="var(--error)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="usonic" stroke="var(--primary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
                 <span style={{ color: 'var(--error)' }}>■ PIR Tripped</span>
                 <span style={{ color: 'var(--primary)' }}>■ Ultrasonic (cm)</span>
              </div>
            </div>
          </div>

          {/* Power Grid */}
          <div className="panel-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Power Grid Distribution
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                 <span style={{ display:'flex', alignItems:'center', gap:'0.25rem' }}><div className="status-dot warning" style={{width:8,height:8}}></div> Solar</span>
                 <span style={{ display:'flex', alignItems:'center', gap:'0.25rem' }}><div className="status-dot safe" style={{width:8,height:8}}></div> Battery</span>
              </div>
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
               <div className="nested-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--primary)', marginBottom: '0.5rem' }}><Zap size={20}/> <span>+4.2W</span></div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Node_Alpha</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <div style={{ flex:1, height:4, backgroundColor:'var(--surface-container-highest)', borderRadius:2 }}><div style={{width:'82%', height:4, backgroundColor:'var(--primary)', borderRadius:2}}></div></div>
                     <span style={{ fontSize: '0.85rem' }}>82%</span>
                  </div>
               </div>
               <div className="nested-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--warning)', marginBottom: '0.5rem' }}><Activity size={20}/> <span>+1.8W</span></div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Node_Beta</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <div style={{ flex:1, height:4, backgroundColor:'var(--surface-container-highest)', borderRadius:2 }}><div style={{width:'64%', height:4, backgroundColor:'var(--warning)', borderRadius:2}}></div></div>
                     <span style={{ fontSize: '0.85rem' }}>64%</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="panel-card" style={{ flex: 1 }}>
             <h3 style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem' }}>Node Registry <span style={{fontSize:'0.7rem', padding:'2px 6px', backgroundColor:'var(--primary-container)', color:'var(--primary)', borderRadius:'4px'}}>12 ONLINE</span></h3>
             
             {[ {n: 'Node_Alpha_01', l: 'Root Boundary', h: true, v: '99.8%'}, {n: 'Node_Beta_04', l: 'Central Hub', h: true, v: '98.2%'}, {n: 'Node_Gamma_02', l: 'Outer Perimeter', h: false, v: 'High Jitter'}, {n: 'Node_Delta_09', l: 'Water Gate', h: true, v: '100%'} ].map((node, i) => (
                <div key={i} className="nested-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', borderLeft: node.h ? '4px solid var(--primary)' : '4px solid var(--warning)' }}>
                   <Server size={20} color={node.h ? 'var(--primary)' : 'var(--warning)'} />
                   <div style={{ flex: 1 }}>
                     <h4 style={{ fontSize: '0.9rem' }}>{node.n}</h4>
                     <p className="text-muted" style={{ fontSize: '0.75rem' }}>{node.l}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <p style={{ fontSize: '0.8rem', color: node.h ? 'var(--primary)' : 'var(--warning)', fontWeight: 600 }}>{node.h ? 'Healthy' : 'Latency'}</p>
                     <p className="text-muted" style={{ fontSize: '0.7rem' }}>{node.v}</p>
                   </div>
                </div>
             ))}
          </div>

          <div className="panel-card" style={{ backgroundColor: '#1f2937', color: '#f3f4f6' }}>
             <p style={{ fontSize: '0.75rem', letterSpacing: '1px', textAlign: 'right', marginBottom: '1rem', color: '#9ca3af' }}>PIPELINE LOG</p>
             <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p><span style={{color: '#4ade80'}}>14:02:11 &gt;</span> TCP_CONNECT_SUCCESS: Alpha_01</p>
                <p><span style={{color: '#9ca3af'}}>14:02:15 &gt;</span> INFERENCE_STARTED: MODEL_v2.1</p>
                <p><span style={{color: '#9ca3af'}}>14:02:18 &gt;</span> DATA_PACKET_SEND: [Temp, Hum, Soil]</p>
                <p><span style={{color: '#facc15'}}>14:03:01 &gt;</span> WARNING: Node_Gamma V_BAT &lt; 3.2V</p>
                <p><span style={{color: '#9ca3af'}}>14:03:04 &gt;</span> SYNC_PULSE: Global_Clock_Ref_A1</p>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
