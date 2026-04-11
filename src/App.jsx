import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';

import Sidebar from './components/Sidebar';
import Overview from './components/Overview';
import LiveMonitor from './components/LiveMonitor';
import HardwareData from './components/HardwareData';
import AIVision from './components/AIVision';
import Analytics from './components/Analytics';
import AlertCenter from './components/AlertCenter';
import FarmerSettings from './components/FarmerSettings';
import './index.css';

// Initialize WebSocket Client
const socket = io('http://localhost:3000');

function playDeterrenceSound(subject) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  const animal = (subject || '').toLowerCase();

  if (animal === 'elephant') {
    // Tribal drum / loud low frequency burst
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(60, ctx.currentTime); // Low rumble drum
    oscillator.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
    // Rapid pulsing for drum effect
    gainNode.gain.setValueAtTime(1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
    
    // Repeat drum pattern multiple times to simulate drums
    for(let i=1; i<10; i++) {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(50 + (Math.random()*20), ctx.currentTime + (i * 0.4));
        gain2.gain.setValueAtTime(1, ctx.currentTime + (i * 0.4));
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (i * 0.4) + 0.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(ctx.currentTime + (i * 0.4));
        osc2.stop(ctx.currentTime + (i * 0.4) + 0.3);
    }
    return;
  } else if (animal === 'bird') {
    // Predator bird call / high sweep
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(3000, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(6000, ctx.currentTime + 0.5);
  } else {
    // Default High-frequency disturbing sound for boars/dogs/general
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(8000, ctx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(8200, ctx.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(7800, ctx.currentTime + 0.2);
  }
  
  gainNode.gain.setValueAtTime(0.2, ctx.currentTime); // keep max volume safe but annoying
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4);
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start();
  oscillator.stop(ctx.currentTime + 4);
}

function sendPhoneAlert(subject) {
  const phoneTarget = localStorage.getItem('farmerPhone') || '+91 9988776655';
  
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    new Notification(`🚨 THREAT ALERT: ${subject.toUpperCase()}`, {
      body: `Dispatching automated Robo-Call to ${phoneTarget}. Immediate action required at Northern Perimeter.`,
      icon: '/vite.svg'
    });
  }

  // Trigger audio speech synthesis to simulate robocall!
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(`Emergency Robo Call dispatched to ${phoneTarget.split('').join(' ')}. Warning, ${subject} detected in primary field sector. Automated deterrence deployed.`);
    window.speechSynthesis.speak(msg);
  }
}
export default function App() {
  const [systemState, setSystemState] = useState({
    status: 'Safe',
    riskLevel: 'Low',
    pirMotion: false,
    ultrasonicDistance: 450,
    espOutput: 'No Subject',
    aiConfidence: '-',
    aiSubject: '-',
    deterrence: 'Standby',
    intrusionsToday: 24,
    recentAlerts: [],
    analysis: ''
  });
  
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Request permission for Phone/Desktop notifications immediately
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    socket.on('state-update', (data) => {
      setSystemState((prevState) => {
        // Did we just transition from Safe -> Alert?
        if (prevState && prevState.status === 'Safe' && data && data.status !== 'Safe') {
          playDeterrenceSound(data.aiSubject);
          sendPhoneAlert(data.aiSubject);
        }
        return data || prevState;
      });
    });
    return () => socket.off('state-update');
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface)' }}>
        <Sidebar systemState={systemState} />
        
        <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', position: 'relative' }}>
            <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search threat signatures..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', 
                  border: 'none', backgroundColor: 'var(--surface-container-low)',
                  color: 'var(--on-surface)'
                }}
              />
              {searchQuery.length > 0 && (
                <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, backgroundColor: 'var(--surface-container-high)', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100 }}>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>Searching registry for "{searchQuery}"...</p>
                  <p style={{ marginTop: '0.5rem', color: 'var(--error)', fontSize: '0.8rem' }}>0 exact matches found.</p>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div id="google_translate_element"></div>
              
              <div style={{ position: 'relative' }}>
                <div 
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor:'pointer' }} 
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <img src="https://ui-avatars.com/api/?name=Arjun+Reddy&background=0D8ABC&color=fff" style={{ width: 40, height: 40, borderRadius: '50%' }} alt="Profile" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Arjun Reddy</p>
                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>Field Officer</p>
                  </div>
                </div>

                {showProfile && (
                  <div style={{ position: 'absolute', top: '110%', right: 0, width: '220px', backgroundColor: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)', borderRadius: '8px', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', zIndex: 100 }}>
                    <div style={{ borderBottom: '1px solid var(--outline-variant)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 'bold' }}>Arjun Reddy</p>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>ID: FW-8422</p>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>● Status: On Duty</p>
                    <button className="btn" style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem', backgroundColor: 'var(--surface)', color: 'var(--error)', border: '1px solid var(--error)' }}>
                      Log Out
                    </button>
                  </div>
                )}
              </div>

            </div>
          </header>

          {systemState ? (
            <Routes>
              <Route path="/" element={<Navigate to="/overview" />} />
              <Route path="/overview" element={<Overview systemState={systemState} />} />
              <Route path="/live" element={<LiveMonitor systemState={systemState} playSound={playDeterrenceSound} />} />
              <Route path="/hardware" element={<HardwareData systemState={systemState} />} />
              <Route path="/vision" element={<AIVision systemState={systemState} playSound={playDeterrenceSound} />} />
              <Route path="/settings" element={<FarmerSettings />} />
              <Route path="/analytics" element={<Analytics systemState={systemState} />} />
              <Route path="/alerts" element={<AlertCenter systemState={systemState} />} />
              <Route path="*" element={<Navigate to="/overview" />} />
            </Routes>
          ) : (
            <div style={{ display: 'grid', placeItems: 'center', flex:1 }}>
               <h3>Synchronizing with Gateway...</h3>
            </div>
          )}
        </main>
      </div>
    </Router>
  );
}
