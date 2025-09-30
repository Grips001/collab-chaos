# Collective Canvas

A real-time collaborative generative art experience where audience members contribute colors and words that transform into spectacular visual effects on a shared canvas.

## 🎨 Overview

Collective Canvas creates a living, communal artwork where each participant adds their unique mark through simple color and word choices. The system transforms these contributions into 13 different spectacular visual effects that paint themselves progressively onto a shared canvas, creating an emergent collaborative masterpiece.

## ✨ Features

### **Dual Interface System**

- **Host Canvas**: Creates sessions, displays artwork, manages the experience
- **Participant Interface**: Mobile-friendly color picker and word input

### **13 Spectacular Visual Effects**

Each word submission triggers one of these progressive drawing animations:

1. **Neon Spiral** - Glowing spirals that draw outward progressively
2. **Star Burst** - Explosive rays shooting from center with sparkles
3. **Lightning Bolt** - Jagged electric bolts with bright white cores
4. **Galaxy Swirl** - Three-armed spiral galaxy patterns
5. **Fireworks** - Explosive bursts with trailing particle effects
6. **Aurora** - Flowing northern lights gradients across the screen
7. **Plasma** - Organic energy blobs with radial gradient fills
8. **Crystalline** - Multi-layered geometric crystal structures
9. **Vortex** - Spiraling particles moving inward to center
10. **Paint Splash** - Realistic paint drops with drip effects
11. **Laser Beam** - Bright laser lines with glowing cores
12. **Fractal Tree** - Organic branching tree structures
13. **Wave Ripple** - Expanding concentric circles like water ripples

### **Progressive Drawing System**

- Effects paint themselves onto the canvas over 2-4 seconds
- Each effect has unique timing and animation style
- Creates authentic "watching an artist work" experience
- Permanent marks that layer and accumulate

### **Real-time Collaboration**

- Instant synchronization across all devices
- No server required - uses localStorage + BroadcastChannel API
- Works seamlessly across phones, tablets, and laptops
- Supports multiple simultaneous participants

## 🚀 Getting Started

### **Setup**

1. Open `index.html` in a web browser
2. A unique canvas session will be created automatically
3. Share the displayed join URL with participants

### **For Hosts**

- **Canvas ID**: Unique session identifier (e.g., "bloom42")
- **Join URL**: Share this link or create QR code for participants
- **Controls**: Pause/Resume, Soft Clear, Hard Reset, Save Image
- **Keyboard Shortcuts**:
  - `Space` = Pause/Resume
  - `C` = Soft Clear
  - `S` = Save Canvas

### **For Participants**

1. Visit the join URL on any device
2. Select a color from the curated palette
3. Enter a single word (1-18 characters)
4. Submit to add your mark to the canvas
5. Wait 5 seconds before next contribution

## 🎯 Use Cases

### **Live Presentations**

- Audience participation during talks or workshops
- Interactive elements for conferences and events
- Real-time engagement with large groups

### **Gallery Installations**

- Interactive art installations in museums or galleries
- QR codes for visitor participation
- Permanent or rotating collaborative artworks

### **Educational Workshops**

- Creative collaboration exercises
- Digital art and technology demonstrations
- Team building and group activities

### **Community Events**

- Public art creation at festivals or gatherings
- Social media engagement campaigns
- Collaborative storytelling through visual art

## 🛠 Technical Details

### **Architecture**

- **Frontend Only**: No server infrastructure required
- **Self-contained**: Single HTML file with embedded CSS and JavaScript
- **Cross-platform**: Works on any modern web browser
- **Responsive Design**: Optimized for both desktop and mobile devices

### **Synchronization**

- **localStorage**: Persistent data storage for submissions
- **BroadcastChannel API**: Real-time cross-tab communication
- **Storage Events**: Fallback synchronization method
- **Polling**: 1-second backup sync for reliability

### **Visual System**

- **HTML5 Canvas**: High-performance 2D graphics rendering
- **Progressive Animation**: 60fps drawing effects with requestAnimationFrame
- **Effect Cycling**: Guaranteed variety through all 13 visual styles
- **Artistic Background**: Beautiful gradient backdrop with subtle texture

### **Content Moderation**

- **Word Length Limit**: 1-18 characters maximum
- **Basic Profanity Filter**: Prevents inappropriate content
- **Rate Limiting**: 5-second cooldown between submissions
- **Host Controls**: Pause, clear, and reset capabilities

## 🎨 Artistic Vision

### **Emergent Beauty**

Each individual contribution combines with others to create something greater than the sum of its parts. The randomized effect selection ensures visual variety while the progressive drawing system creates anticipation and delight.

### **Inclusive Participation**

Simple color and word choices make participation accessible to all ages and technical skill levels. The 5-second cooldown ensures fair participation while maintaining engagement.

### **Living Artwork**

The canvas becomes a living, breathing collaborative artwork that grows and evolves with each contribution. Effects layer and interact to create rich, complex compositions.

## 📱 Browser Compatibility

- **Chrome/Chromium**: Full support including BroadcastChannel
- **Firefox**: Full support including BroadcastChannel  
- **Safari**: Full support including BroadcastChannel
- **Edge**: Full support including BroadcastChannel
- **Mobile Browsers**: Optimized touch interface for all major mobile browsers

## 🔧 Customization

### **Color Palette**

Edit the `colorPalette` array in `app.js` to customize available colors:

```javascript
this.colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', // Add your colors here
];
```

### **Effect Parameters**

Modify drawing speeds, sizes, and behaviors in the effect creation methods:

```javascript
speed: 0.02, // Slower drawing
maxPoints: word.length * 30, // More detail
```

### **Cooldown Timer**

Adjust the submission cooldown in the `submitContribution` method:

```javascript
if (lastSubmission && (now - parseInt(lastSubmission)) < 10000) { // 10 seconds
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:

- Additional visual effects
- Sound integration
- Advanced moderation features
- Performance optimizations
- Accessibility improvements

## 🎉 Acknowledgments

Created as a collaborative generative art platform to bring people together through shared creative expression. Inspired by the idea that art is most powerful when created collectively.

---

**Collective Canvas** - Where individual creativity becomes collective art.
