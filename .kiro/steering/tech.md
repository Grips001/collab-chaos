# Technology Stack

## Core Technologies

- **HTML5 Canvas**: 2D graphics rendering with requestAnimationFrame for 60fps progressive drawing animations
- **Vanilla JavaScript**: ES6+ class-based architecture, no external dependencies
- **Modern CSS3**: Glassmorphism effects with backdrop-filter, CSS Grid, Flexbox, CSS Variables, and mobile-first responsive design
- **Web APIs**: localStorage, BroadcastChannel, StorageEvent for real-time sync
- **Google Fonts**: Inter font family for premium typography

## Architecture

- **Single Page Application**: Self-contained HTML file with embedded CSS and JavaScript
- **Client-side Only**: No server infrastructure required
- **Progressive Enhancement**: Graceful fallbacks for older browsers with modern enhancements
- **Event-driven**: Real-time updates via browser storage events and broadcast channels
- **Glassmorphism Design System**: CSS variables for consistent theming and glass effects

## UI/UX Technology Stack

### Design System

- **CSS Custom Properties**: Centralized design tokens for colors, spacing, and effects
- **Glassmorphism**: backdrop-filter with rgba backgrounds for frosted glass effects
- **Fluid Typography**: Inter font with multiple weights (300-700) for hierarchy
- **Animation System**: CSS transitions with cubic-bezier easing functions
- **Responsive Grid**: CSS Grid and Flexbox for adaptive layouts

### Visual Effects

- **Progressive Drawing**: Canvas effects that animate over time using requestAnimationFrame
- **Smooth Transitions**: 0.3s cubic-bezier(0.4, 0, 0.2, 1) for premium feel
- **Micro-interactions**: Hover states, focus indicators, and button animations
- **Glass Morphism**: Semi-transparent backgrounds with blur effects throughout

## Key Libraries & Frameworks

- **None**: Pure vanilla JavaScript and CSS implementation
- **External Fonts**: Google Fonts (Inter) for premium typography
- **Browser APIs**: Leverages modern web platform capabilities

## Development Commands

Since this is a client-side only application:

### Running Locally

```bash
# Serve the file using any local server
python -m http.server 8000
# OR
npx serve .
# OR simply open index.html in browser
```

### Testing

- Open `index.html` in multiple browser tabs/windows to test real-time sync
- Test on mobile devices for participant interface glassmorphism design
- Use browser dev tools for debugging canvas rendering and CSS effects
- Test window resize behavior to ensure background persistence
- Verify glassmorphism effects across different browsers

### Deployment

- Deploy as static files to any web server
- No build process required
- Works with GitHub Pages, Netlify, Vercel, etc.
- Ensure HTTPS for optimal font loading and modern CSS features

## Performance Considerations

### Canvas Optimization

- **60fps Animation**: Canvas operations use requestAnimationFrame for smooth progressive drawing
- **Smart Positioning**: Margin-based effect placement prevents clipping and ensures even distribution
- **Adaptive Sizing**: Minimum canvas dimensions (800x600) with responsive scaling
- **Progressive Rendering**: Effects are pre-calculated and rendered incrementally over 2-4 seconds
- **Background Preservation**: Canvas resize handling maintains artistic gradient background
- **Effect Validation**: Dimension checks prevent effects from being created on undersized canvases
- **Efficient Drawing**: Optimized rendering techniques with proper context management

### UI Performance

- CSS transforms and opacity for hardware-accelerated animations
- backdrop-filter effects optimized for modern browsers
- Minimal DOM manipulation with efficient event handling
- Mobile-optimized touch interactions with appropriate touch targets

### Network & Storage

- Storage operations are batched to prevent excessive I/O
- Google Fonts loaded with font-display: swap for optimal loading
- Minimal external dependencies for fast initial load
- Efficient localStorage usage for real-time collaboration

## Browser Compatibility

### Modern Features Required

- **backdrop-filter**: For glassmorphism effects (fallback: solid backgrounds)
- **CSS Grid**: For responsive layouts (fallback: flexbox)
- **CSS Custom Properties**: For design system (fallback: hardcoded values)
- **BroadcastChannel API**: For real-time sync (fallback: storage events only)

### Supported Browsers

- Chrome/Chromium 76+ (full glassmorphism support)
- Firefox 103+ (full glassmorphism support)
- Safari 14+ (full glassmorphism support)
- Edge 79+ (full glassmorphism support)
