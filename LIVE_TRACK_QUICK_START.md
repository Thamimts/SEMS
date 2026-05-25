# Live Track Module - Quick Start Guide

## What Changed?

Your SEMS dashboard's "Live Track" page has been completely redesigned into a premium **Real-Time Emergency Command Center** with:

✅ Advanced ambulance tracking with real-time data
✅ Smart V2X network monitoring (V2V, V2I, V2H, V2N)
✅ AI-powered traffic analytics with congestion prediction
✅ Hospital intelligence system with bed availability
✅ Real-time event timeline tracking
✅ Smart emergency alerts for nearby vehicles
✅ Futuristic cyberpunk animations and UI
✅ Responsive design (mobile, tablet, desktop)
✅ Premium glassmorphism UI with neon effects

## How to Use

### 1. Access Live Track
- Go to Dashboard
- Click "Live Track" in sidebar
- Activate Emergency Mode
- The new command center loads automatically

### 2. Understanding the Layout

#### **Map (Center)**
- Full-screen interactive map
- Shows ambulance (red dot)
- Hospital destination (blue marker)
- Nearby vehicles (purple/yellow dots)
- 20m emergency radius (red glow)
- 50m warning zone (dashed red circle)

#### **Left Panel (Desktop Only)**
1. **Ambulance Status Panel**
   - Current speed
   - ETA to hospital
   - Driver status
   - Fuel/battery level
   - GPS accuracy
   - Emergency level (1-5)
   - Current coordinates
   - V2X connections

2. **V2X Network Panel**
   - V2V vehicles connected
   - V2I traffic signals
   - V2H hospital nodes
   - V2N cloud connection
   - Signal strength per node
   - Connection latency
   - Nearby vehicles within 20m

#### **Right Panel (Desktop Only)**
1. **AI Traffic Analytics**
   - 24-hour congestion forecast graph
   - 3 recommended routes
   - Real-time traffic levels
   - Green corridor status
   - Congestion percentage per route

2. **Hospital Intelligence**
   - Hospital name & status
   - Available beds count
   - ICU availability
   - Department status
   - Emergency readiness %
   - ETA and distance
   - Occupancy rate

#### **Bottom Panel**
1. **Event Timeline** (2/3 width on desktop)
   - Ambulance Dispatched ✓
   - Route Calculated ✓
   - Green Corridor Activated (live)
   - Hospital Notified (live)
   - Arrival Expected (pending)

2. **Control Panel** (1/3 width)
   - Quick distance & speed display
   - Simulate button (play/pause)
   - Recalculate button
   - Arrived at Hospital button
   - Green Corridor status indicator

### 3. Key Controls

**Siren Toggle** (Top Right)
- Click to enable/disable siren
- Red glow indicates active siren
- Visual pulse animation when on

**Show/Hide Panels** (Corners)
- Desktop: Top-left corner buttons
- Mobile: Top-right floating buttons
- Toggle Left, Right, and Bottom panels

**Simulate Route** (Bottom)
- Play: Start ambulance movement simulation
- Pause: Stop movement
- Speed varies automatically (30-80 km/h)

**Recalculate** (Bottom)
- Recalculates optimal route
- Updates traffic data
- Shows alternative routes

**Arrived at Hospital**
- Completes emergency session
- Navigates to verification page

### 4. Real-Time Features

**Automatic Updates**
- Speed updates every 2 seconds
- Emergency level decreases as you approach
- V2V messages every 5 seconds
- ETA countdown automatic
- Hospital beds updated in real-time

**Live Indicators**
- Pulsing ambulance marker
- Flashing emergency alerts
- Animated signal strengths
- Live traffic congestion
- Hospital readiness changes

### 5. Mobile Usage

On mobile devices:
- Map takes full screen
- Use floating buttons (top-right) to toggle panels
- Landscape mode recommended for better visibility
- Bottom panel scrolls if needed

**Mobile Controls:**
- 🚑 Button: Show/hide ambulance panel
- 📡 Button: Show/hide traffic panel
- 📋 Button: Show/hide timeline & controls

### 6. Smart Alert System

**When ambulance enters 20m radius:**
- Full-screen red alert appears
- Voice warning: "Emergency vehicle approaching. Please give way."
- Recommended action: Change lane or reduce speed
- 5 nearby vehicles alerted automatically
- Reroute button for navigation change

### 7. Understanding the Data

**Emergency Level (1-5)**
- Shows danger/urgency level
- Decreases as ambulance approaches hospital
- Visual bar indicator
- Color changes: Red → Amber → Green

**V2X Network Status**
- V2V: Vehicles in communication range
- V2I: Traffic signals coordinated
- V2H: Hospital systems notified
- V2N: Cloud data synchronization
- All in real-time

**Traffic Analytics**
- Green: Light traffic (<45%)
- Amber: Moderate traffic (45-75%)
- Red: Heavy traffic (>75%)
- Shows all 3 alternative routes

## Tips & Tricks

### Maximize Efficiency
1. Enable siren for faster alerts to nearby vehicles
2. Use Route Simulation to test different routes
3. Watch emergency level decrease as you approach
4. Monitor V2X connections for network quality

### Performance
- Close unnecessary browser tabs
- Enable hardware acceleration
- Use modern browsers (Chrome, Firefox, Safari, Edge)
- On mobile, close background apps

### Customization
- Hide panels you don't need
- Keep only essential information visible
- Adjust text size in browser settings
- Use full-screen mode (F11) for immersive view

## What's Happening Behind the Scenes

1. **Real-time GPS Tracking**
   - Updates ambulance position every 2 seconds
   - Calculates distance to hospital
   - Adjusts ETA based on speed and traffic

2. **V2X Communication**
   - Sends alerts to nearby vehicles within 20m
   - Coordinates with traffic signals (green corridor)
   - Notifies hospital of incoming patient
   - Synchronizes with cloud systems

3. **AI Traffic Optimization**
   - Predicts traffic patterns 24 hours ahead
   - Recommends fastest route
   - Monitors congestion in real-time
   - Suggests smart routing

4. **Hospital Coordination**
   - Alerts hospital of incoming patient
   - Reserves beds and ICU as needed
   - Prepares emergency department
   - Tracks ambulance ETA

## Troubleshooting

**Map not showing?**
- Check internet connection
- Refresh the page
- Clear browser cache
- Verify API key is set

**Animations stuttering?**
- Close background applications
- Disable browser extensions
- Update GPU drivers
- Try different browser

**Sound alerts not working?**
- Check browser sound settings
- Verify speaker is enabled
- Check "Siren" toggle is ON
- Allow browser to play audio

**Panels not showing?**
- Click "Show" buttons in corners
- Try full-screen mode
- Increase browser window size
- Check panel toggle buttons

## Keyboard Shortcuts

- `F11`: Full-screen mode
- `F12`: Developer tools
- `Ctrl+Shift+D`: Device mode (responsive)
- `Esc`: Exit full-screen

## Browser Requirements

- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- JavaScript enabled
- Cookies enabled
- Microphone/Speaker (for voice alerts)
- Google Maps API access

## FAQs

**Q: Why is the ambulance speed changing?**
A: Real-time simulation shows realistic speed variations based on traffic and road conditions.

**Q: What do the different colors mean?**
- Red: Emergency/Critical
- Blue: Information/Navigation
- Green: Success/Active
- Amber: Warning/Attention
- Purple: Secondary status

**Q: Can I use this on mobile?**
A: Yes! Responsive design works perfectly on phones, tablets, and desktops.

**Q: How often is data updated?**
A: Every 2-4 seconds for real-time accuracy.

**Q: Can I disable animations?**
A: Animations are optimized for performance, but you can slow them down in settings.

## What's New vs Old

| Feature | Old | New |
|---------|-----|-----|
| Layout | Basic side panel | 3-panel command center |
| Maps | Simple Google Maps | Enhanced interactive map with zones |
| V2X Info | Limited | Full V2V, V2I, V2H, V2N monitoring |
| Traffic | Basic display | AI analytics with prediction |
| Hospital | Simple info | Full intelligence panel |
| Timeline | None | Animated event tracking |
| Animations | Basic | 50+ futuristic effects |
| Responsive | Limited | Full mobile/tablet/desktop |
| Controls | Minimal | Advanced simulation & routing |
| Alerts | Popup only | Full-screen smart alerts |

## Support

For issues or questions:
1. Check this guide first
2. Review troubleshooting section
3. Check browser console (F12) for errors
4. Ensure all components are loaded
5. Contact support team

---

**Version 2.0 - Premium Emergency Command Center**
**SEMS Dashboard - Smart Emergency Management System**
