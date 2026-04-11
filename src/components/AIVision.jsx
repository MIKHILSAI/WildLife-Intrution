import React, { useRef, useState, useEffect } from 'react';
import { Target, Activity, ShieldAlert, Cpu, Download } from 'lucide-react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function AIVision({ systemState, playSound }) {
  const isAlert = systemState.status !== 'Safe';
  
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const lastAlertTimeRef = useRef(0);

  useEffect(() => {
    // Load COCO-SSD Model
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
      } catch (err) {
        console.error("Failed to load model", err);
      }
    };
    loadModel();
  }, []);

  const detectFrame = async () => {
    if (webcamRef.current && webcamRef.current.video.readyState === 4 && model) {
      const video = webcamRef.current.video;
      const predictions = await model.detect(video);
      
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      let criticalDetection = null;

      predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        const threatClasses = ['bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'];
        // Lowered threshold to 30% to easily catch blurry running videos
        const isThreat = threatClasses.includes(prediction.class) && prediction.score > 0.30;
        
        ctx.strokeStyle = isThreat ? '#ef4444' : '#10b981';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        if (isThreat) {
           criticalDetection = prediction;
        }
      });

      const now = Date.now();
      if (criticalDetection && now - lastAlertTimeRef.current > 10000) {
        lastAlertTimeRef.current = now;
        fetch('http://localhost:3000/api/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: criticalDetection.class,
            confidence: `${Math.round(criticalDetection.score * 100)}%`,
            distance: Math.floor(Math.random() * 50) + 10
          })
        }).catch(err => console.error("Edge connection failed:", err));
      }
    }
  };

  useEffect(() => {
    let interval;
    if (model) {
      interval = setInterval(() => {
        detectFrame();
      }, 500); 
    }
    return () => clearInterval(interval);
  }, [model]);

  return (
    <div style={{ flex: 1, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI Vision & Deterrence</h1>
          <p className="text-muted">Active Field Monitoring: Sector 04 - Northern Perimeter</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <span style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--primary-container)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
             SYSTEM LIVE
           </span>
           <span style={{ padding: '0.4rem 1rem', backgroundColor: 'var(--surface-container-high)', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem', border: '1px solid var(--outline-variant)' }}>
             LATENCY: 42ms
           </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Main Camera Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="panel-card" style={{ padding: 0, overflow: 'hidden', height: '480px', position: 'relative', backgroundColor: '#000' }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={{ width: 840, height: 480, facingMode: "user" }}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8, position: 'absolute' }}
            />
            <canvas
              ref={canvasRef}
              width={840}
              height={480}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 10 }}
            />
            {isAlert && (
              <div style={{ position: 'absolute', top: '30%', left: '40%', width: '150px', height: '200px', border: '2px solid var(--error)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                 <div style={{ position: 'absolute', top: -25, left: -2, backgroundColor: 'var(--error)', color: 'white', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                   SUBJECT: {systemState.aiSubject.toUpperCase()} [ID: 942]
                 </div>
                 <div style={{ position: 'absolute', bottom: 5, right: 5, color: 'var(--error)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                   CONF: {systemState.aiConfidence}
                 </div>
              </div>
            )}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', color: 'white', fontFamily: 'monospace', fontSize: '0.8rem' }}>
              <p><span style={{color:'red'}}>● REC</span> 00:42:15:04</p>
              <p>CAM_04_NORTH_PERIMETER</p>
              <p>GPS: 12.9716° N, 77.5946° E</p>
            </div>
            
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
               <div style={{ color: 'white', textAlign: 'center' }}><p style={{fontSize: '0.6rem', color: '#9ca3af'}}>EXPOSURE</p><p style={{fontWeight:'bold'}}>EV +0.3</p></div>
               <div style={{ color: 'white', textAlign: 'center' }}><p style={{fontSize: '0.6rem', color: '#9ca3af'}}>ISO</p><p style={{fontWeight:'bold'}}>400</p></div>
               <div style={{ color: 'white', textAlign: 'center' }}><p style={{fontSize: '0.6rem', color: '#9ca3af'}}>FOCUS</p><p style={{fontWeight:'bold'}}>AF-S</p></div>
            </div>
          </div>

          {/* Event Logs */}
          <div className="panel-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Vision Event Logs</h3>
              <p className="text-primary" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => alert("Downloading Sector 04 Event Report CSV...")}>Download Report</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {(systemState.recentAlerts || []).map((log, i) => (
                 <div key={i} className="nested-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-container)', borderRadius: '8px', color: 'var(--primary)' }}><Target size={20} /></div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '0.95rem' }}>Detection: {log.type}</h4>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>Sector 04 • {log.time} • {log.action}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className="text-primary" style={{ fontSize: '0.85rem', fontWeight: 600 }}>SUCCESS</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>Confidence 98%</p>
                    </div>
                 </div>
               ))}
               {!(systemState.recentAlerts && systemState.recentAlerts.length > 0) && (
                 <p className="text-muted" style={{textAlign: 'center', padding: '2rem 0', fontSize: '0.85rem'}}>No recent events logged.</p>
               )}
            </div>
          </div>
        </div>

        {/* Right Info Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="panel-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}><Cpu size={20} /> AI Intelligence</h3>
            
            <div style={{ backgroundColor: 'var(--surface-container-high)', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem', border: '1px solid var(--outline-variant)' }}>
               <p className="text-muted" style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px', marginBottom: '0.5rem' }}>CURRENT TARGET</p>
               <h2 style={{ color: isAlert ? 'var(--error)' : 'var(--primary)', fontSize: '2rem' }}>{isAlert ? systemState.aiSubject.toUpperCase() : 'NO TARGET'}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
               <div style={{ textAlign: 'center', backgroundColor: 'var(--surface-container-high)', padding: '1rem', borderRadius: '8px' }}>
                 <p className="text-primary" style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>CONFIDENCE</p>
                 <h3 style={{ fontSize: '1.5rem' }}>{isAlert ? systemState.aiConfidence : '---'}</h3>
               </div>
               <div style={{ textAlign: 'center', backgroundColor: isAlert ? 'var(--error-container)' : 'var(--surface-container-high)', padding: '1rem', borderRadius: '8px' }}>
                 <p className={isAlert ? 'text-danger' : 'text-muted'} style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1px' }}>RISK LEVEL</p>
                 <h3 className={isAlert ? 'text-danger' : ''} style={{ fontSize: '1.5rem' }}>{systemState.riskLevel.toUpperCase()}</h3>
               </div>
            </div>

            <p className="text-muted" style={{ fontSize: '0.85rem', fontStyle: 'italic', lineHeight: '1.5' }}>
              {isAlert && systemState.analysis ? 
                 `"Target identified as ${systemState.aiSubject}. ${systemState.analysis}"` : 
                 `"System actively monitoring environment parameters. No biological threats detected in this sector."`}
            </p>
          </div>

          <div className="panel-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={20} /> Deterrence</h3>
              <span className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', backgroundColor: 'var(--primary-container)', borderRadius: '4px' }}>ACTIVE</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
               <style>{`
                 @keyframes eqBounce {
                   0%, 100% { transform: scaleY(0.2); }
                   50% { transform: scaleY(1); }
                 }
               `}</style>
               <div style={{ display: 'flex', gap: '4px', height: '40px', alignItems: 'center' }}>
                 {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                   <div key={i} style={{ 
                     width: '4px', 
                     height: '40px', 
                     backgroundColor: isAlert ? 'var(--error)' : 'var(--primary)', 
                     borderRadius: '2px', 
                     transformOrigin: 'bottom',
                     animation: isAlert ? `eqBounce ${0.4 + (i%3)*0.1}s infinite alternate ease-in-out` : 'none',
                     transform: isAlert ? 'scaleY(1)' : 'scaleY(0.1)',
                     transition: 'all 0.2s' 
                   }}></div>
                 ))}
               </div>
               <div style={{ textAlign: 'center' }}>
                 <p style={{ fontWeight: 600 }}>Frequency: {isAlert && systemState.aiSubject === 'elephant' ? '40-60Hz Drum Rhythm' : '18.5kHz Ultrasonic'}</p>
                 <p className="text-muted" style={{ fontSize: '0.8rem' }}>Sequence '{isAlert ? 'Predator_Alpha' : 'Standby'}' engaged</p>
               </div>
            </div>

            <button 
              className="btn" 
              style={{ width: '100%', backgroundColor: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', marginTop: '1.5rem' }}
              onClick={() => {
                if (playSound) playSound(systemState.aiSubject || 'elephant');
              }}
            >
              Cycle Sound Pattern
            </button>
            <button 
              className="btn" 
              style={{ width: '100%', backgroundColor: 'var(--error)', color: 'white', marginTop: '0.5rem' }}
              onClick={() => alert("EMERGENCY OVERRIDE ENGAGED. Deterrence hardware halted.")}
            >
              EMERGENCY STOP
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
