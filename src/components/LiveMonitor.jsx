import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { AlertCircle, Target, Loader2, Volume2, ShieldCheck } from 'lucide-react';

export default function LiveMonitor({ systemState }) {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Track continuous detection to avoid spamming the backend
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
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Set canvas size
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const predictions = await model.detect(video);
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, videoWidth, videoHeight);

      let criticalDetection = null;

      predictions.forEach(prediction => {
        // Draw bounding box
        const [x, y, width, height] = prediction.bbox;
        
        // We look for certain classes to simulate wildlife
        const threatClasses = ['bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'];
        const isThreat = threatClasses.includes(prediction.class) && prediction.score > 0.40;
        
        ctx.strokeStyle = isThreat ? '#ef4444' : '#10b981'; // Red or Green
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = isThreat ? '#ef4444' : '#10b981';
        ctx.fillRect(x, y - 30, width, 30);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px Inter';
        ctx.fillText(
          `${prediction.class.toUpperCase()} - ${Math.round(prediction.score * 100)}%`,
          x + 5,
          y - 10
        );

        if (isThreat) {
           if (!criticalDetection || prediction.score > criticalDetection.score) {
               criticalDetection = prediction;
           }
        }
      });

      // TRIGGER REAL LIFE BACKEND IF THREAT DETECTED
      const now = Date.now();
      // Only send post every 10 seconds to avoid flooding the API
      if (criticalDetection && now - lastAlertTimeRef.current > 10000) {
        lastAlertTimeRef.current = now;
        
        // Send to our local Node.js Edge Runtime
        fetch('http://localhost:3000/api/detect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subject: criticalDetection.class,
            confidence: `${Math.round(criticalDetection.score * 100)}%`,
            distance: Math.floor(Math.random() * 50) + 10 // Random distance for telemetry
          })
        }).catch(err => console.error("Edge connection failed:", err));
      }
    }
  };

  useEffect(() => {
    let interval;
    if (isDetecting) {
      interval = setInterval(() => {
        detectFrame();
      }, 500); // scan every 500ms
    }
    return () => clearInterval(interval);
  }, [isDetecting, model]);

  const isAlert = systemState.status !== 'Safe';

  return (
    <div style={{ flex: 1, backgroundColor: 'transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem' }}>Live Threat Monitor</h1>
        <button 
          className="btn primary" 
          onClick={() => setIsDetecting(!isDetecting)}
          disabled={!model}
        >
          {isDetecting ? 'Stop Local AI Pipeline' : (model ? 'Start Webcam Edge Pipeline' : 'Loading AI Model...')}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Main Feed */}
        <div className={`panel-card ${isAlert ? 'ambient-shadow' : ''}`} style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Live Surveillance 
              <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--primary-container)', color: 'var(--primary)', fontSize: '0.75rem', borderRadius: '4px', display:'flex', alignItems:'center', gap:'0.25rem' }}>
                <div className="status-dot safe" style={{ width: 8, height: 8 }}></div> LIVE FEED
              </span>
            </h2>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '480px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden' }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              videoConstraints={{ width: 840, height: 480, facingMode: "user" }}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 10
              }}
            />
            
            {/* Overlay Telemetry HUD */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', zIndex: 20, backgroundColor: 'rgba(0,0,0,0.7)', padding: '1rem', borderRadius: '8px', color: 'white' }}>
               <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.5rem' }}>SYSTEM STATE OVERRIDE</p>
               {isAlert ? (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 'bold' }}>
                   <AlertCircle /> HIGH INTENSITY ALERT
                 </div>
               ) : (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
                    <ShieldCheck /> PERIMETER SECURE
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Side Actions & Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="panel-card">
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 /> Acoustic Deterrence
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
               <div style={{ padding: '1rem', border: '1px solid var(--outline-variant)', borderRadius: '8px', textAlign: 'center', backgroundColor: isAlert ? 'var(--error-container)' : 'transparent', color: isAlert ? 'var(--error)' : 'inherit', transition: 'all 0.3s' }}>
                  <Volume2 style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>ULTRASONIC BLAST</p>
               </div>
               <div style={{ padding: '1rem', border: '1px solid var(--outline-variant)', borderRadius: '8px', textAlign: 'center', backgroundColor: isAlert ? 'var(--error-container)' : 'transparent', color: isAlert ? 'var(--error)' : 'inherit', transition: 'all 0.3s' }}>
                  <Loader2 style={{ margin: '0 auto 0.5rem' }} />
                  <p style={{ fontSize: '0.8rem', fontWeight: 600 }}>STROBE LIGHT</p>
               </div>
            </div>

            <div style={{ backgroundColor: isAlert ? '#ef4444' : '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.3s' }}>
               <ShieldCheck size={24} />
               <div style={{ flex: 1 }}>
                 <p style={{ fontWeight: 600 }}>{isAlert ? 'Automatic Defense Firing' : 'Auto-Deterrence Armed'}</p>
                 <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Will trigger upon validated tracking</p>
               </div>
            </div>
          </div>

          <div className="panel-card" style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '1rem' }}>Live Alert Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
               {systemState.recentAlerts.slice(0, 3).map((a, i) => (
                 <div key={i} style={{ padding: '1rem', backgroundColor: 'var(--error-container)', borderLeft: '4px solid var(--error)', borderRadius: '6px' }}>
                    <p style={{ fontWeight: 600, color: 'var(--error)' }}>{a.type} Identified</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-variant)' }}>Distance: {a.dist} • {a.time}</p>
                 </div>
               ))}
               {systemState.recentAlerts.length === 0 && (
                 <p className="text-muted text-center" style={{ marginTop: '2rem' }}>No recent threats recorded.</p>
               )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
