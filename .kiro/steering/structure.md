# Project Structure

## File Organization

```text
collective-canvas/
├── index.html          # Main application file with glassmorphism UI and embedded CSS/JS
├── app.js             # Core application logic, canvas effects, and progressive animations
├── README.md          # Comprehensive documentation with Phase Two updates
├── .git/              # Git repository
├── .kiro/             # Kiro AI assistant configuration
│   └── steering/      # AI guidance documents (updated for Phase Two)
│       ├── product.md # Product overview with UI/UX details
│       ├── tech.md    # Technology stack including glassmorphism
│       └── structure.md # Project structure and architecture
└── .vscode/           # VS Code workspace settings
```

## Code Architecture

### Main Application Class

- **CollectiveCanvas**: Primary class in `app.js` managing entire application lifecycle
- **Constructor**: Initializes canvas, generates session ID, sets up color palette, creates drawing effects array
- **View Management**: Handles host vs participant interface switching with glassmorphism styling

### Key Methods Organization

#### Setup & Initialization

- **Setup Methods**: `init()`, `setupCanvas()`, `setupView()`, `setupEventListeners()`, `setupBroadcastChannel()`
- **UI Methods**: `createArtisticBackground()`, `resizeCanvas()` (with background preservation)
- **View Methods**: `showHostView()`, `showParticipantView()`, `setupColorPalette()`

#### Submission & Sync

- **Submission Handling**: `submitContribution()`, `saveSubmission()`, `loadSubmissions()`, `processSubmission()`
- **Real-time Sync**: `broadcastUpdate()`, storage event listeners, BroadcastChannel integration

#### Visual Effects System

- **13 Effect Creation Methods**: `createNeonSpiral()`, `createStarBurst()`, `createLightningBolt()`, etc.
- **Progressive Drawing System**: `startAnimation()`, `updateDrawingEffects()`, `drawProgressiveEffect()`
- **13 Progressive Renderers**: `drawProgressiveSpiral()`, `drawProgressiveStarBurst()`, etc.
- **Effect Management**: `drawFinalEffect()`, effect lifecycle management

#### Host Controls

- **Control Methods**: `togglePause()`, `softClear()`, `hardReset()`, `saveCanvas()`
- **UI Feedback**: `showStatus()`, `updateSubmissionCount()`, `checkCooldown()`, `showCooldownTimer()`

### Effect System Architecture

Each visual effect follows consistent progressive drawing pattern:

1. **Creation Method**: Pre-calculates all points/parameters and adds to `drawingEffects` array
2. **Progressive Animation**: `updateDrawingEffects()` advances progress and calls renderer
3. **Progressive Rendering**: Draws effect incrementally based on progress (0-1)
4. **Completion**: Effect reaches 100% progress and is removed from active effects array
5. **Persistence**: Completed effects remain permanently painted on canvas

### Data Flow Architecture

1. **Participant Input**: Color selection (glassmorphism swatches) + word input → validation → localStorage
2. **Real-time Sync**: BroadcastChannel + StorageEvent → all connected devices update
3. **Effect Generation**: Submission → effect cycling selection → progressive animation creation
4. **Progressive Drawing**: 60fps animation loop renders effects incrementally over 2-4 seconds
5. **Canvas Persistence**: Completed effects remain permanently on canvas with artistic background

### UI/UX Architecture

#### Design System Structure

- **CSS Variables**: Centralized design tokens in `:root` for glassmorphism effects
- **Component Classes**: `.host-controls`, `.join-banner`, `.contribution-form`, `.color-palette`
- **State Classes**: `.selected`, `.btn-primary`, `.status-success`, `.status-error`
- **Responsive Classes**: Mobile-first approach with `@media` queries

#### Glassmorphism Implementation

- **Glass Backgrounds**: `rgba(255, 255, 255, 0.08)` with `backdrop-filter: blur(20px)`
- **Glass Borders**: `rgba(255, 255, 255, 0.12)` for subtle definition
- **Glass Shadows**: Layered shadows for depth and floating effect
- **Interactive States**: Hover and focus states with smooth transitions

## Naming Conventions

### JavaScript

- **Classes**: PascalCase (`CollectiveCanvas`)
- **Methods**: camelCase (`createNeonSpiral`, `updateDrawingEffects`, `drawProgressiveEffect`)
- **Properties**: camelCase (`drawingEffects`, `colorPalette`, `effectIndex`)
- **Constants**: UPPER_SNAKE_CASE for any future constants

### CSS

- **CSS Variables**: kebab-case with semantic naming (`--glass-bg`, `--text-primary`, `--accent-primary`)
- **Component Classes**: kebab-case (`host-controls`, `join-banner`, `contribution-form`)
- **State Classes**: kebab-case (`selected`, `btn-primary`, `status-success`)
- **DOM IDs**: kebab-case (`canvas-id`, `join-url`, `color-palette`, `word-input`)

### HTML Structure

- **Semantic Elements**: Proper use of headings, buttons, inputs for accessibility
- **Class Organization**: Component-based class structure for maintainability
- **ID Usage**: Unique IDs for JavaScript interaction points

## File Responsibilities

### index.html

- **UI Structure**: Semantic HTML with glassmorphism component structure
- **Styling System**: Complete CSS with design system, glassmorphism effects, and responsive design
- **Typography**: Inter font integration and text hierarchy
- **Accessibility**: Focus states, contrast ratios, and semantic structure

### app.js

- **Application Logic**: Complete class-based architecture with all methods
- **Canvas Rendering**: 13 progressive drawing effects with smooth animations
- **Real-time Sync**: localStorage and BroadcastChannel integration
- **UI Interactions**: Event handling, form validation, and state management
- **Effect System**: Progressive animation system with 60fps rendering

### README.md

- **User Documentation**: Complete setup instructions and feature descriptions
- **Technical Details**: Architecture overview and customization guide
- **Use Cases**: Detailed scenarios for different deployment contexts
- **Phase Two Updates**: Modern UI/UX features and glassmorphism details

## Development Workflow

### Phase One (Complete)

- Core functionality with 13 visual effects
- Real-time collaboration system
- Basic UI with functional design

### Phase Two (Complete)

- Modern glassmorphism UI/UX design
- Premium typography and animations
- Responsive design optimization
- Canvas resize handling improvements

### Future Phases

- Enhanced accessibility features
- Additional visual effects
- Sound integration possibilities
- Advanced moderation features
