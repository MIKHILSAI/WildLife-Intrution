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

let activeAudioContexts = [];

export function stopDeterrenceSound() {
  activeAudioContexts.forEach(ctx => {
    try { ctx.close(); } catch(e){}
  });
  activeAudioContexts = [];
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function playDeterrenceSound(subject) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  activeAudioContexts.push(ctx);

  const animal = (subject || '').toLowerCase();

  // ----- ELEPHANT: Drum Bass -----
  if (animal.includes('elephant')) {
    for(let i=0; i<8; i++) {
        const t = ctx.currentTime + (i * 0.45);
        const sub = ctx.createOscillator(); const sg = ctx.createGain();
        sub.type = 'sine'; sub.frequency.setValueAtTime(100, t); sub.frequency.exponentialRampToValueAtTime(30, t+0.3);
        sg.gain.setValueAtTime(3.0, t); sg.gain.exponentialRampToValueAtTime(0.01, t+0.3);
        sub.connect(sg); sg.connect(ctx.destination); sub.start(t); sub.stop(t+0.4);

        const mid = ctx.createOscillator(); const mg = ctx.createGain();
        mid.type = 'sawtooth'; mid.frequency.setValueAtTime(150, t); mid.frequency.exponentialRampToValueAtTime(40, t+0.15);
        mg.gain.setValueAtTime(1.5, t); mg.gain.exponentialRampToValueAtTime(0.01, t+0.2);
        mid.connect(mg); mg.connect(ctx.destination); mid.start(t); mid.stop(t+0.3);
    }
  } 
  // ----- PEACOCK / BIRD: Screeching Predator Sweeps -----
  else if (animal.includes('bird') || animal.includes('peacock')) {
    for(let i=0; i<5; i++) {
        const t = ctx.currentTime + (i * 0.6);
        const osc = ctx.createOscillator(); const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2000, t);
        osc.frequency.exponentialRampToValueAtTime(6000, t + 0.3);
        g.gain.setValueAtTime(2.0, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t); osc.stop(t + 0.6);

        // Clapping noise layer
        const snap = ctx.createOscillator(); const sGain = ctx.createGain();
        snap.type = 'square'; snap.frequency.setValueAtTime(150, t); snap.frequency.exponentialRampToValueAtTime(50, t+0.1);
        sGain.gain.setValueAtTime(1.5, t); sGain.gain.exponentialRampToValueAtTime(0.01, t+0.1);
        snap.connect(sGain); sGain.connect(ctx.destination); snap.start(t); snap.stop(t+0.2);
    }
  } 
  // ----- WILD BOAR / BEAR / PIG: Low Frequency Roar & High pitched irritation -----
  else if (animal.includes('boar') || animal.includes('bear') || animal.includes('cow') || animal.includes('dog')) {
    for(let i=0; i<4; i++) {
        const t = ctx.currentTime + (i * 0.8);
        const growl = ctx.createOscillator(); const gg = ctx.createGain();
        growl.type = 'sawtooth'; growl.frequency.setValueAtTime(40, t); growl.frequency.linearRampToValueAtTime(60, t+0.4);
        gg.gain.setValueAtTime(2.5, t); gg.gain.linearRampToValueAtTime(0.01, t+0.6);
        growl.connect(gg); gg.connect(ctx.destination); growl.start(t); growl.stop(t+0.7);

        const whistle = ctx.createOscillator(); const wg = ctx.createGain();
        whistle.type = 'sine'; whistle.frequency.setValueAtTime(12000, t);
        wg.gain.setValueAtTime(1.5, t); wg.gain.exponentialRampToValueAtTime(0.01, t+0.7);
        whistle.connect(wg); wg.connect(ctx.destination); whistle.start(t); whistle.stop(t+0.8);
    }
  }
  // ----- MONKEY / CAT / SMALL MAMMALS: Ultrasound Chaos sweeps -----
  else {
    for(let i=0; i<10; i++) {
        const t = ctx.currentTime + (i * 0.25);
        const osc = ctx.createOscillator(); const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(14000 + Math.random()*2000, t); // Piercing high freq
        osc.frequency.linearRampToValueAtTime(15000, t+0.1);
        g.gain.setValueAtTime(1.0, t); g.gain.linearRampToValueAtTime(0.01, t+0.2);
        osc.connect(g); g.connect(ctx.destination); osc.start(t); osc.stop(t+0.25);
    }
  }
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
              <Route path="/live" element={<LiveMonitor systemState={systemState} playSound={playDeterrenceSound} stopSound={stopDeterrenceSound} />} />
              <Route path="/hardware" element={<HardwareData systemState={systemState} />} />
              <Route path="/vision" element={<AIVision systemState={systemState} playSound={playDeterrenceSound} stopSound={stopDeterrenceSound} />} />
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
