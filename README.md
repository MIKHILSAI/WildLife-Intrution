# Namma Payir 🛡️ - Intelligent Crop Guardian

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-5-orange?logo=vite)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node-20-green?logo=node.js)](https://nodejs.org)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-red?logo=socket.io)](https://socket.io)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-teal?logo=tensorflow)](https://www.tensorflow.org/js)

## 🌾 **Namma Payir** (எங்கள் பயிர் - \"Our Crops\")

**AI-Driven Wildlife Intrusion Detection & Bio-Acoustic Deterrence System** for protecting farmlands from elephants, wild boars, birds, and more. Real-time dashboard with computer vision, IoT sensor integration, automated alerts (WhatsApp/SMS), and intelligent sound deterrence using WebAudio API.

![Hero](src/assets/hero.png)

### ✨ **Key Features**
- **🤖 AI Vision**: Real-time object detection with TensorFlow.js Coco-SSD + Webcam
- **📡 IoT Integration**: ESP32 sensors (PIR motion, ultrasonic distance) via Socket.io
- **🔊 Bio-Acoustic Deterrence**: Procedural audio (tribal drums for elephants, screeches for birds, ultrasound chaos)
- **🚨 Smart Alerts**: WhatsApp auto-open, desktop notifications, simulated SMS/Robo-calls
- **📊 Analytics**: Recharts dashboards for intrusions, trends
- **🌐 Multilingual**: Google Translate integration (Tamil/English/10+ languages)
- **⚙️ Farmer-First**: Configurable settings, manual override modes (AI vs Manual sequences)

### 🏗️ **Tech Stack**
| Frontend | Backend | AI/ML | Data/Charting | Utils |
|----------|---------|-------|---------------|-------|
| React 19 | Express.js | TensorFlow.js Coco-SSD | Recharts | Socket.io-client |
| Vite 5 | Socket.io | React Webcam | Lucide Icons | Google Translate |
| Tailwind CSS | CORS | WebAudio API | | |

## 🚀 **Quick Start**

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm/yarn

### 1. Clone & Install Frontend
```bash
git clone <repo> namma-payir
cd namma-payir
pnpm install
```

### 2. Setup Backend
```bash
cd backend
pnpm install
```

### 3. Run Backend (IoT Gateway)
```bash
cd backend
pnpm start  # or node server.js
# Server running on http://localhost:3000
```

### 4. Run Frontend
```bash
pnpm dev
# Open http://localhost:5173
```

**Demo Flow**:
1. Backend simulates wildlife detections
2. Frontend receives real-time updates via WebSockets
3. AI detects → Triggers deterrence sounds → Sends WhatsApp alert → Auto-reset

## 🔌 **API Documentation**

**POST** `/api/detect`
```json
{
  \"subject\": \"elephant\",  // or 'wild boar', 'bird', etc.
  \"confidence\": \"0.95\",
  \"distance\": 30  // cm from ultrasonic
}
```
Response: Triggers state update, analysis, deterrence cycle (15s auto-reset).

**Behavioral Analysis Examples**:
```
Elephant: 'Low-frequency acoustic deterrence (Tribal Drum Pattern 40-60Hz)'
Wild Boar: 'High-pitch chaotic alarm sweeps'
```

## 🖥️ **Screenshots**

### Dashboard Overview
![Overview](/screenshots/overview.png)

### AI Vision in Action
![AIVision](/screenshots/ai-vision.png)

### Alert Center
![Alerts](/screenshots/alerts.png)

*(Add your screenshots to `/public/screenshots/` for auto-hosting)*

## 🎮 **Deterrence Audio Patterns**
- **Drum**: Elephant herds (infrasonic disruption)
- **Screech**: Birds/peacocks (predator calls)
- **Roar**: Boars/bears (territorial aggression)
- **Ultrasound**: Generic (18kHz+ flight instinct)

Modes: **AI-Auto** (animal-specific) | **Manual** (custom sequences)

## 🤝 **Contributing**
1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Open Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📱 **Production Deployment**
- **Frontend**: `pnpm build` → Static host (Vercel/Netlify)
- **Backend**: Render/Heroku/Railway (with MongoDB for persistence)
- **Hardware**: ESP32 → POST to `/api/detect` endpoint

## 📄 **License**
ISC License - See [LICENSE](LICENSE) (add one if needed).

---

**Built with ❤️ for Indian farmers. Protect your payir! 🌾🛡️**

**Star this repo if it helps your farm! ⭐**

