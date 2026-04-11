const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Real-life IoT State
let systemState = {
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
};

// Listen for connections
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  // Send initial state immediately
  socket.emit('state-update', systemState);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Endpoint for Hardware (ESP32) or Web Camera interface to post detection data
app.post('/api/detect', (req, res) => {
  const { subject, confidence, distance } = req.body;

  // Process Logic Flow
  if (subject && subject !== 'None') {
    const elephantAnalyses = [
      'Behavior suggests panicked flight response. Trajectory indicates search for water sources. Prevention strategy: Low-frequency acoustic deterrence (Tribal Drum Pattern 40-60Hz) to safely redirect trajectory without escalating panic.',
      'Target identified as young solitary male. Behavior points to aggressive foraging for crops. Prevention strategy: Fast strobe illuminations coupled with high-intensity low-frequency drum oscillations.',
      'Herd behavior detected. Slow migratory pattern identified heading towards main perimeter. Prevention strategy: Sustained low-frequency tribal drumming to disrupt infrasonic communication safely.'
    ];

    const analysisDb = {
      'elephant': elephantAnalyses[Math.floor(Math.random() * elephantAnalyses.length)],
      'wild boar': 'Rooting behavior likely seeking ground crops. Prevention strategy: High-pitch chaotic alarm sweeps combined with localized physical strobe illumination to break focus.',
      'bird': 'Flocking/feeding behavior detected targeting seed deposits. Prevention strategy: Predator-call aggressive sweeps mapping avian auditory sensitivity.',
      'cat': 'Opportunistic stalking behavior. Prevention strategy: Constant high-frequency sawtooth wave bursts.',
      'dog': 'Pack or solitary roaming behavior. Prevention strategy: Targeted canine deterrent sweeping frequencies mapped near 18kHz.',
      'default': 'Unknown species behavior pattern. Deploying generalized high-frequency auditory deterrence sweep to trigger flight instinct.'
    };
    const behaviorInfo = analysisDb[subject.toLowerCase()] || analysisDb['default'];

    systemState = {
      ...systemState,
      status: 'Active Alert',
      riskLevel: 'Critical',
      pirMotion: true,
      ultrasonicDistance: distance || 30,
      espOutput: 'Large Subject',
      aiConfidence: confidence || '99%',
      aiSubject: subject,
      deterrence: 'Activated',
      intrusionsToday: systemState.intrusionsToday + 1,
      analysis: behaviorInfo
    };

    // Log the alert
    const newAlert = {
      id: Date.now(),
      type: subject,
      dist: `${systemState.ultrasonicDistance}cm`,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      action: 'Aggressive Bio-Acoustic'
    };
    systemState.recentAlerts.unshift(newAlert);
    
    // Broadcast via WebSockets
    io.emit('state-update', systemState);
    
    console.log(`\n===========================================`)
    console.log(`📡 [SMS SECURE PUSH] -> +91 99XXXXXX00`);
    console.log(`🚨 THREAT DETECTED: ${subject.toUpperCase()}`);
    console.log(`📍 LOCATION: Northern Perimeter`);
    console.log(`🔧 ACTION: High Frequency Oscillator Active`);
    console.log(`===========================================\n`)

    // Auto-reset after deterrence cycle (15s)
    setTimeout(() => {
      systemState = {
        ...systemState,
        status: 'Safe',
        riskLevel: 'Low',
        pirMotion: false,
        ultrasonicDistance: 450,
        espOutput: 'No Subject',
        aiConfidence: '-',
        aiSubject: '-',
        deterrence: 'Standby',
        analysis: ''
      };
      io.emit('state-update', systemState);
    }, 15000);

    return res.status(200).json({ message: 'Deterrence logic triggered', state: systemState });
  }

  res.status(200).json({ message: 'No action required' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Backend IoT Edge Server running on port ${PORT}`);
});
