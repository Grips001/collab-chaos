// Collective Canvas - Real-time collaborative generative art
class CollectiveCanvas {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvasId = this.generateCanvasId();
        this.submissions = [];
        this.isPaused = false;
        this.animationId = null;
        this.drawingEffects = []; // Active drawing effects
        
        // Effect cycling system
        this.effects = [
            'neonSpiral', 'starBurst', 'lightningBolt', 'galaxySwirl', 
            'fireworks', 'aurora', 'plasma', 'crystalline', 'vortex',
            'paintSplash', 'laserBeam', 'fractalTree', 'waveRipple'
        ];
        this.effectIndex = Math.floor(Math.random() * this.effects.length);
        
        // Color palette for participants
        this.colorPalette = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
            '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
            '#F1948A', '#85C1E9', '#F4D03F', '#AED6F1', '#A9DFBF', '#F5B7B1',
            '#D7BDE2', '#A3E4D7', '#FAD7A0', '#D5A6BD', '#A9CCE3', '#ABEBC6'
        ];
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupView();
        this.setupEventListeners();
        this.setupBroadcastChannel();
        this.startAnimation();
        this.setupStorage();
    }

    setupBroadcastChannel() {
        if (typeof BroadcastChannel !== 'undefined') {
            this.channel = new BroadcastChannel('canvas-updates');
            this.channel.onmessage = (event) => {
                if (event.data.type === 'submission') {
                    setTimeout(() => {
                        this.loadSubmissions();
                        this.updateSubmissionCount();
                    }, 100);
                }
            };
        }
    }

    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create beautiful gradient background
        this.createArtisticBackground();
    }

    createArtisticBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#1a1a2e');
        gradient.addColorStop(0.7, '#16213e');
        gradient.addColorStop(1, '#0f0f23');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas() {
        // Resize canvas (this clears the canvas automatically)
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Always redraw the artistic background after resize
        this.createArtisticBackground();
        
        // Note: Any existing artwork will be lost during resize
        // This is acceptable for this type of collaborative art experience
    }

    setupView() {
        const urlParams = new URLSearchParams(window.location.search);
        const joinId = urlParams.get('join');
        
        if (joinId) {
            this.showParticipantView(joinId);
        } else {
            this.showHostView();
        }
    }

    showHostView() {
        document.getElementById('host-view').style.display = 'block';
        document.getElementById('participant-view').style.display = 'none';
        
        document.getElementById('canvas-id').textContent = this.canvasId;
        const joinUrl = `${window.location.origin}${window.location.pathname}?join=${this.canvasId}`;
        document.getElementById('join-url').textContent = joinUrl;
        
        this.loadSubmissions();
        this.updateSubmissionCount();
    }

    showParticipantView(joinId) {
        document.getElementById('host-view').style.display = 'none';
        document.getElementById('participant-view').style.display = 'flex';
        
        this.targetCanvasId = joinId;
        this.setupColorPalette();
        this.checkCooldown();
    }

    setupColorPalette() {
        const palette = document.getElementById('color-palette');
        this.colorPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.onclick = () => this.selectColor(swatch, color);
            palette.appendChild(swatch);
        });
    }

    selectColor(element, color) {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        element.classList.add('selected');
        this.selectedColor = color;
    }

    setupEventListeners() {
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('canvas_')) {
                this.loadSubmissions();
                this.updateSubmissionCount();
            }
        });

        setInterval(() => {
            this.loadSubmissions();
        }, 1000);

        document.addEventListener('keydown', (e) => {
            if (document.getElementById('host-view').style.display !== 'none') {
                if (e.key === ' ') {
                    e.preventDefault();
                    this.togglePause();
                } else if (e.key === 'c') {
                    this.softClear();
                } else if (e.key === 's') {
                    this.saveCanvas();
                }
            }
        });
    }

    generateCanvasId() {
        const words = ['art', 'flow', 'wave', 'bloom', 'spark', 'dream', 'glow', 'dance'];
        const numbers = Math.floor(Math.random() * 100).toString().padStart(2, '0');
        const word = words[Math.floor(Math.random() * words.length)];
        return `${word}${numbers}`;
    }

    submitContribution() {
        if (!this.selectedColor) {
            this.showStatus('Please select a color first', 'error');
            return;
        }

        const word = document.getElementById('word-input').value.trim();
        if (!word) {
            this.showStatus('Please enter a word', 'error');
            return;
        }

        if (word.length > 18) {
            this.showStatus('Word must be 18 characters or less', 'error');
            return;
        }

        const inappropriate = ['fuck', 'shit', 'bitch', 'cunt'];
        if (inappropriate.some(bad => word.toLowerCase() === bad)) {
            this.showStatus('Please choose a different word', 'error');
            return;
        }

        const lastSubmission = localStorage.getItem('lastSubmission');
        const now = Date.now();
        if (lastSubmission && (now - parseInt(lastSubmission)) < 5000) {
            const remaining = Math.ceil((5000 - (now - parseInt(lastSubmission))) / 1000);
            this.showStatus(`Please wait ${remaining} seconds before submitting again`, 'error');
            return;
        }

        const submission = {
            id: Date.now() + Math.random(),
            color: this.selectedColor,
            word: word,
            timestamp: now,
            canvasId: this.targetCanvasId
        };

        this.saveSubmission(submission);
        
        this.showStatus('Your mark has been added to the canvas!', 'success');
        document.getElementById('word-input').value = '';
        document.getElementById('submit-btn').disabled = true;
        
        localStorage.setItem('lastSubmission', now.toString());
        setTimeout(() => {
            document.getElementById('submit-btn').disabled = false;
            this.checkCooldown();
        }, 5000);

        this.showCooldownTimer();
    }

    saveSubmission(submission) {
        const key = `canvas_${submission.canvasId}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(submission);
        localStorage.setItem(key, JSON.stringify(existing));
        
        this.broadcastUpdate(key, existing);
    }

    broadcastUpdate(key, data) {
        localStorage.setItem('lastUpdate', Date.now().toString());
        
        setTimeout(() => {
            window.dispatchEvent(new StorageEvent('storage', {
                key: key,
                newValue: JSON.stringify(data),
                oldValue: null,
                storageArea: localStorage
            }));
        }, 10);
        
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('canvas-updates');
            channel.postMessage({
                type: 'submission',
                canvasId: key.replace('canvas_', ''),
                data: data
            });
        }
    }

    loadSubmissions() {
        const key = `canvas_${this.canvasId}`;
        const stored = localStorage.getItem(key);
        if (stored) {
            try {
                const newSubmissions = JSON.parse(stored);
                const currentIds = new Set(this.submissions.map(s => s.id));
                const fresh = newSubmissions.filter(s => !currentIds.has(s.id));
                
                fresh.forEach(submission => {
                    this.processSubmission(submission);
                });
                
                this.submissions = newSubmissions;
            } catch (e) {
                console.error('Error loading submissions:', e);
            }
        }
    }

    processSubmission(submission) {
        if (this.isPaused) return;
        this.createVisualFromSubmission(submission);
    }

    createVisualFromSubmission(submission) {
        const { word, color } = submission;
        
        const effectType = this.effects[this.effectIndex];
        this.effectIndex = (this.effectIndex + 1) % this.effects.length;
        
        console.log(`Creating: ${effectType} for "${word}"`);
        
        // Create progressive drawing effects
        switch (effectType) {
            case 'neonSpiral':
                this.createNeonSpiral(word, color);
                break;
            case 'starBurst':
                this.createStarBurst(word, color);
                break;
            case 'lightningBolt':
                this.createLightningBolt(word, color);
                break;
            case 'galaxySwirl':
                this.createGalaxySwirl(word, color);
                break;
            case 'fireworks':
                this.createFireworks(word, color);
                break;
            case 'aurora':
                this.createAurora(word, color);
                break;
            case 'plasma':
                this.createPlasma(word, color);
                break;
            case 'crystalline':
                this.createCrystalline(word, color);
                break;
            case 'vortex':
                this.createVortex(word, color);
                break;
            case 'paintSplash':
                this.createPaintSplash(word, color);
                break;
            case 'laserBeam':
                this.createLaserBeam(word, color);
                break;
            case 'fractalTree':
                this.createFractalTree(word, color);
                break;
            case 'waveRipple':
                this.createWaveRipple(word, color);
                break;
            default:
                this.createNeonSpiral(word, color);
        }
    }

    // Progressive effect creation methods
    createNeonSpiral(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const points = [];
        
        for (let i = 0; i < word.length * 20; i++) {
            const angle = i * 0.3;
            const radius = i * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            points.push({ x, y });
        }
        
        this.drawingEffects.push({
            type: 'neonSpiral',
            points: points,
            color: color,
            progress: 0,
            speed: 0.02
        });
    }

    createStarBurst(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const rays = 8 + word.length;
        const rayData = [];
        
        for (let i = 0; i < rays; i++) {
            const angle = (Math.PI * 2 * i) / rays;
            const length = 100 + Math.random() * 150;
            const endX = centerX + Math.cos(angle) * length;
            const endY = centerY + Math.sin(angle) * length;
            rayData.push({ endX, endY });
        }
        
        this.drawingEffects.push({
            type: 'starBurst',
            centerX: centerX,
            centerY: centerY,
            rays: rayData,
            color: color,
            progress: 0,
            speed: 0.03
        });
    }

    createLightningBolt(word, color) {
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height;
        const endX = Math.random() * this.canvas.width;
        const endY = Math.random() * this.canvas.height;
        
        const segments = 8 + word.length;
        const points = [];
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = startX + (endX - startX) * t + (Math.random() - 0.5) * 100;
            const y = startY + (endY - startY) * t + (Math.random() - 0.5) * 100;
            points.push({ x, y });
        }
        
        this.drawingEffects.push({
            type: 'lightningBolt',
            points: points,
            color: color,
            progress: 0,
            speed: 0.05
        });
    }

    createGalaxySwirl(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const armPoints = [];
        
        // Pre-calculate 3 spiral arms
        for (let arm = 0; arm < 3; arm++) {
            const points = [];
            for (let i = 0; i < word.length * 15; i++) {
                const t = i / (word.length * 15);
                const angle = arm * (Math.PI * 2 / 3) + t * Math.PI * 4;
                const radius = t * 120;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                points.push({ x, y });
            }
            armPoints.push(points);
        }
        
        this.drawingEffects.push({
            type: 'galaxySwirl',
            centerX: centerX,
            centerY: centerY,
            armPoints: armPoints,
            color: color,
            progress: 0,
            speed: 0.025
        });
    }

    createFireworks(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const particles = [];
        
        for (let i = 0; i < word.length * 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const length = 50 + Math.random() * 100;
            const endX = centerX + Math.cos(angle) * length;
            const endY = centerY + Math.sin(angle) * length;
            
            particles.push({
                endX: endX,
                endY: endY,
                width: 2 + Math.random() * 3,
                sparkleSize: 2 + Math.random() * 2
            });
        }
        
        this.drawingEffects.push({
            type: 'fireworks',
            centerX: centerX,
            centerY: centerY,
            particles: particles,
            color: color,
            progress: 0,
            speed: 0.04
        });
    }

    createAurora(word, color) {
        const startY = Math.random() * this.canvas.height;
        const waves = [];
        
        for (let wave = 0; wave < 3 + Math.floor(word.length / 3); wave++) {
            waves.push({
                startY: startY + wave * 60,
                points: []
            });
            
            // Pre-calculate wave points
            for (let x = 0; x <= this.canvas.width; x += 10) {
                const y = startY + wave * 60 + Math.sin(x * 0.01) * 30;
                waves[wave].points.push({ x, y });
            }
        }
        
        this.drawingEffects.push({
            type: 'aurora',
            waves: waves,
            color: color,
            progress: 0,
            speed: 0.03
        });
    }

    createPlasma(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const blobs = [];
        
        for (let i = 0; i < word.length * 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = 5 + Math.random() * 15;
            
            blobs.push({ x, y, size });
        }
        
        this.drawingEffects.push({
            type: 'plasma',
            centerX: centerX,
            centerY: centerY,
            blobs: blobs,
            color: color,
            progress: 0,
            speed: 0.035
        });
    }

    createCrystalline(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const layers = [];
        
        for (let layer = 0; layer < 4; layer++) {
            const sides = 6 + layer * 2;
            const radius = 30 + layer * 25;
            const points = [];
            
            for (let i = 0; i < sides; i++) {
                const angle = (Math.PI * 2 * i) / sides;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                points.push({ x, y });
            }
            
            layers.push({ points, radius });
        }
        
        this.drawingEffects.push({
            type: 'crystalline',
            centerX: centerX,
            centerY: centerY,
            layers: layers,
            color: color,
            progress: 0,
            speed: 0.04
        });
    }

    createVortex(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const particles = [];
        
        for (let i = 0; i < word.length * 25; i++) {
            const t = i / (word.length * 25);
            const angle = t * Math.PI * 8;
            const radius = (1 - t) * 120;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            const size = 2 + (1 - t) * 4;
            
            particles.push({ x, y, size });
        }
        
        this.drawingEffects.push({
            type: 'vortex',
            centerX: centerX,
            centerY: centerY,
            particles: particles,
            color: color,
            progress: 0,
            speed: 0.03
        });
    }

    createPaintSplash(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const drops = [];
        
        for (let i = 0; i < word.length * 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 120;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            const size = 3 + Math.random() * 8;
            const hasDrip = Math.random() < 0.3;
            const dripHeight = hasDrip ? 10 + Math.random() * 20 : 0;
            
            drops.push({ x, y, size, hasDrip, dripHeight });
        }
        
        this.drawingEffects.push({
            type: 'paintSplash',
            centerX: centerX,
            centerY: centerY,
            drops: drops,
            color: color,
            progress: 0,
            speed: 0.045
        });
    }

    createLaserBeam(word, color) {
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height;
        const angle = Math.random() * Math.PI * 2;
        const length = 300 + word.length * 20;
        const endX = startX + Math.cos(angle) * length;
        const endY = startY + Math.sin(angle) * length;
        const width = 8 + Math.random() * 6;
        
        this.drawingEffects.push({
            type: 'laserBeam',
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            width: width,
            color: color,
            progress: 0,
            speed: 0.06
        });
    }

    createFractalTree(word, color) {
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height;
        const branches = [];
        
        // Generate all branches recursively
        const generateBranches = (x, y, angle, length, depth, width) => {
            if (depth > 4) return;
            
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            
            branches.push({
                startX: x,
                startY: y,
                endX: endX,
                endY: endY,
                width: width,
                depth: depth
            });
            
            if (depth < 4) {
                const branchCount = 2 + Math.floor(Math.random() * 2);
                for (let i = 0; i < branchCount; i++) {
                    const newAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
                    const newLength = length * (0.6 + Math.random() * 0.3);
                    const newWidth = Math.max(1, width - 1);
                    generateBranches(endX, endY, newAngle, newLength, depth + 1, newWidth);
                }
            }
        };
        
        generateBranches(startX, startY, -Math.PI / 2 + (Math.random() - 0.5), 60 + word.length * 3, 0, 5);
        
        this.drawingEffects.push({
            type: 'fractalTree',
            branches: branches,
            color: color,
            progress: 0,
            speed: 0.025
        });
    }

    createWaveRipple(word, color) {
        const centerX = Math.random() * this.canvas.width;
        const centerY = Math.random() * this.canvas.height;
        const rings = [];
        
        for (let ring = 0; ring < 5 + word.length; ring++) {
            const radius = ring * 25 + 15;
            const alpha = 1 - (ring / (5 + word.length));
            rings.push({ radius, alpha });
        }
        
        this.drawingEffects.push({
            type: 'waveRipple',
            centerX: centerX,
            centerY: centerY,
            rings: rings,
            color: color,
            progress: 0,
            speed: 0.04
        });
    }

    startAnimation() {
        const animate = () => {
            this.updateDrawingEffects();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    updateDrawingEffects() {
        for (let i = this.drawingEffects.length - 1; i >= 0; i--) {
            const effect = this.drawingEffects[i];
            effect.progress += effect.speed;
            
            if (effect.progress >= 1) {
                // Effect is complete, draw final version and remove
                this.drawFinalEffect(effect);
                this.drawingEffects.splice(i, 1);
            } else {
                // Continue drawing the effect progressively
                this.drawProgressiveEffect(effect);
            }
        }
    }

    drawProgressiveEffect(effect) {
        this.ctx.save();
        this.ctx.globalAlpha = 1.0;
        
        switch (effect.type) {
            case 'neonSpiral':
                this.drawProgressiveSpiral(effect);
                break;
            case 'starBurst':
                this.drawProgressiveStarBurst(effect);
                break;
            case 'lightningBolt':
                this.drawProgressiveLightning(effect);
                break;
            case 'galaxySwirl':
                this.drawProgressiveGalaxy(effect);
                break;
            case 'fireworks':
                this.drawProgressiveFireworks(effect);
                break;
            case 'aurora':
                this.drawProgressiveAurora(effect);
                break;
            case 'plasma':
                this.drawProgressivePlasma(effect);
                break;
            case 'crystalline':
                this.drawProgressiveCrystalline(effect);
                break;
            case 'vortex':
                this.drawProgressiveVortex(effect);
                break;
            case 'paintSplash':
                this.drawProgressivePaintSplash(effect);
                break;
            case 'laserBeam':
                this.drawProgressiveLaserBeam(effect);
                break;
            case 'fractalTree':
                this.drawProgressiveFractalTree(effect);
                break;
            case 'waveRipple':
                this.drawProgressiveWaveRipple(effect);
                break;
        }
        
        this.ctx.restore();
    }

    drawProgressiveSpiral(effect) {
        const currentPoints = Math.floor(effect.progress * effect.points.length);
        if (currentPoints < 2) return;
        
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 20;
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(effect.points[0].x, effect.points[0].y);
        
        for (let i = 1; i < currentPoints; i++) {
            this.ctx.lineTo(effect.points[i].x, effect.points[i].y);
        }
        
        this.ctx.stroke();
        this.ctx.shadowBlur = 0;
    }

    drawProgressiveStarBurst(effect) {
        const currentRays = Math.floor(effect.progress * effect.rays.length);
        
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 25;
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = 6;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < currentRays; i++) {
            const ray = effect.rays[i];
            const rayProgress = Math.min(1, (effect.progress * effect.rays.length) - i);
            
            if (rayProgress > 0) {
                const currentEndX = effect.centerX + (ray.endX - effect.centerX) * rayProgress;
                const currentEndY = effect.centerY + (ray.endY - effect.centerY) * rayProgress;
                
                this.ctx.beginPath();
                this.ctx.moveTo(effect.centerX, effect.centerY);
                this.ctx.lineTo(currentEndX, currentEndY);
                this.ctx.stroke();
            }
        }
        
        this.ctx.shadowBlur = 0;
    }

    drawProgressiveLightning(effect) {
        const currentPoints = Math.floor(effect.progress * effect.points.length);
        if (currentPoints < 2) return;
        
        // Outer glow
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 30;
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = 8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(effect.points[0].x, effect.points[0].y);
        for (let i = 1; i < currentPoints; i++) {
            this.ctx.lineTo(effect.points[i].x, effect.points[i].y);
        }
        this.ctx.stroke();
        
        // Inner core
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    drawProgressiveGalaxy(effect) {
        let totalPointsDrawn = 0;
        const totalPointsToShow = Math.floor(effect.progress * effect.armPoints.reduce((sum, arm) => sum + arm.length, 0));
        
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        
        for (let armIndex = 0; armIndex < effect.armPoints.length && totalPointsDrawn < totalPointsToShow; armIndex++) {
            const arm = effect.armPoints[armIndex];
            const pointsInThisArm = Math.min(arm.length, totalPointsToShow - totalPointsDrawn);
            
            if (pointsInThisArm > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(arm[0].x, arm[0].y);
                
                for (let i = 1; i < pointsInThisArm; i++) {
                    this.ctx.lineTo(arm[i].x, arm[i].y);
                }
                
                this.ctx.stroke();
            }
            
            totalPointsDrawn += pointsInThisArm;
        }
        
        this.ctx.shadowBlur = 0;
    }

    drawProgressiveFireworks(effect) {
        const currentParticles = Math.floor(effect.progress * effect.particles.length);
        
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = effect.color;
        this.ctx.fillStyle = effect.color;
        
        for (let i = 0; i < currentParticles; i++) {
            const particle = effect.particles[i];
            const particleProgress = Math.min(1, (effect.progress * effect.particles.length) - i);
            
            if (particleProgress > 0) {
                const currentX = effect.centerX + (particle.endX - effect.centerX) * particleProgress;
                const currentY = effect.centerY + (particle.endY - effect.centerY) * particleProgress;
                
                this.ctx.lineWidth = particle.width;
                this.ctx.beginPath();
                this.ctx.moveTo(effect.centerX, effect.centerY);
                this.ctx.lineTo(currentX, currentY);
                this.ctx.stroke();
                
                if (particleProgress >= 0.8) {
                    this.ctx.beginPath();
                    this.ctx.arc(currentX, currentY, particle.sparkleSize, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
        
        this.ctx.shadowBlur = 0;
    }

    drawProgressiveAurora(effect) {
        const currentWaves = Math.floor(effect.progress * effect.waves.length);
        
        for (let i = 0; i < currentWaves; i++) {
            const wave = effect.waves[i];
            const waveProgress = Math.min(1, (effect.progress * effect.waves.length) - i);
            
            if (waveProgress > 0) {
                const gradient = this.ctx.createLinearGradient(
                    0, wave.startY,
                    0, wave.startY + 80
                );
                gradient.addColorStop(0, effect.color);
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.globalAlpha = waveProgress * 0.7;
                
                const currentPoints = Math.floor(waveProgress * wave.points.length);
                
                this.ctx.beginPath();
                this.ctx.moveTo(0, wave.startY);
                
                for (let j = 0; j < currentPoints; j++) {
                    this.ctx.lineTo(wave.points[j].x, wave.points[j].y);
                }
                
                if (currentPoints > 0) {
                    this.ctx.lineTo(wave.points[currentPoints - 1].x, wave.startY + 80);
                    this.ctx.lineTo(0, wave.startY + 80);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
                
                this.ctx.globalAlpha = 1.0;
            }
        }
    }

    drawProgressivePlasma(effect) {
        const currentBlobs = Math.floor(effect.progress * effect.blobs.length);
        
        for (let i = 0; i < currentBlobs; i++) {
            const blob = effect.blobs[i];
            const blobProgress = Math.min(1, (effect.progress * effect.blobs.length) - i);
            
            if (blobProgress > 0) {
                const currentSize = blob.size * blobProgress;
                
                const gradient = this.ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, currentSize);
                gradient.addColorStop(0, effect.color);
                gradient.addColorStop(0.7, effect.color + '80');
                gradient.addColorStop(1, 'transparent');
                
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(blob.x, blob.y, currentSize, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    }

    drawProgressiveCrystalline(effect) {
        const currentLayers = Math.floor(effect.progress * effect.layers.length);
        
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = effect.color;
        this.ctx.fillStyle = effect.color + '40';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < currentLayers; i++) {
            const layer = effect.layers[i];
            const layerProgress = Math.min(1, (effect.progress * effect.layers.length) - i);
            
            if (layerProgress > 0) {
                this.ctx.globalAlpha = layerProgress;
                
                this.ctx.beginPath();
                for (let j = 0; j < layer.points.length; j++) {
                    const point = layer.points[j];
                    if (j === 0) this.ctx.moveTo(point.x, point.y);
                    else this.ctx.lineTo(point.x, point.y);
                }
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                
                this.ctx.globalAlpha = 1.0;
            }
        }
        
        this.ctx.shadowBlur = 0;
    }

    drawProgressiveVortex(effect) {
        const currentParticles = Math.floor(effect.progress * effect.particles.length);
        
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 12;
        this.ctx.fillStyle = effect.color;
        
        for (let i = 0; i < currentParticles; i++) {
            const particle = effect.particles[i];
            const particleProgress = Math.min(1, (effect.progress * effect.particles.length) - i);
            
            if (particleProgress > 0) {
                this.ctx.globalAlpha = particleProgress;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.globalAlpha = 1.0;
            }
        }
        
        this.ctx.shadowBlur = 0;
    }

    drawProgressivePaintSplash(effect) {
        const currentDrops = Math.floor(effect.progress * effect.drops.length);
        
        this.ctx.fillStyle = effect.color;
        
        for (let i = 0; i < currentDrops; i++) {
            const drop = effect.drops[i];
            const dropProgress = Math.min(1, (effect.progress * effect.drops.length) - i);
            
            if (dropProgress > 0) {
                const currentSize = drop.size * dropProgress;
                
                this.ctx.globalAlpha = dropProgress;
                this.ctx.beginPath();
                this.ctx.arc(drop.x, drop.y, currentSize, 0, Math.PI * 2);
                this.ctx.fill();
                
                if (drop.hasDrip && dropProgress > 0.5) {
                    const dripHeight = drop.dripHeight * (dropProgress - 0.5) * 2;
                    this.ctx.fillRect(drop.x - 1, drop.y, 2, dripHeight);
                }
                
                this.ctx.globalAlpha = 1.0;
            }
        }
    }

    drawProgressiveLaserBeam(effect) {
        if (effect.progress < 0.1) return;
        
        const beamProgress = (effect.progress - 0.1) / 0.9;
        const currentEndX = effect.startX + (effect.endX - effect.startX) * beamProgress;
        const currentEndY = effect.startY + (effect.endY - effect.startY) * beamProgress;
        
        this.ctx.shadowColor = effect.color;
        this.ctx.shadowBlur = 25;
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = effect.width;
        this.ctx.lineCap = 'round';
        
        this.ctx.beginPath();
        this.ctx.moveTo(effect.startX, effect.startY);
        this.ctx.lineTo(currentEndX, currentEndY);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = effect.width * 0.3;
        this.ctx.stroke();
    }

    drawProgressiveFractalTree(effect) {
        const currentBranches = Math.floor(effect.progress * effect.branches.length);
        
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineCap = 'round';
        
        for (let i = 0; i < currentBranches; i++) {
            const branch = effect.branches[i];
            const branchProgress = Math.min(1, (effect.progress * effect.branches.length) - i);
            
            if (branchProgress > 0) {
                const currentEndX = branch.startX + (branch.endX - branch.startX) * branchProgress;
                const currentEndY = branch.startY + (branch.endY - branch.startY) * branchProgress;
                
                this.ctx.lineWidth = branch.width;
                this.ctx.beginPath();
                this.ctx.moveTo(branch.startX, branch.startY);
                this.ctx.lineTo(currentEndX, currentEndY);
                this.ctx.stroke();
            }
        }
    }

    drawProgressiveWaveRipple(effect) {
        const currentRings = Math.floor(effect.progress * effect.rings.length);
        
        this.ctx.strokeStyle = effect.color;
        this.ctx.lineWidth = 3;
        
        for (let i = 0; i < currentRings; i++) {
            const ring = effect.rings[i];
            const ringProgress = Math.min(1, (effect.progress * effect.rings.length) - i);
            
            if (ringProgress > 0) {
                this.ctx.globalAlpha = ring.alpha * ringProgress;
                this.ctx.beginPath();
                this.ctx.arc(effect.centerX, effect.centerY, ring.radius * ringProgress, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.globalAlpha = 1.0;
            }
        }
    }

    drawFinalEffect(effect) {
        // Draw the complete effect when animation finishes
        effect.progress = 1;
        this.drawProgressiveEffect(effect);
    }

    // Host controls
    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.querySelector('button[onclick="togglePause()"]');
        if (btn) btn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    softClear() {
        this.drawingEffects = [];
        this.createArtisticBackground();
    }

    hardReset() {
        if (confirm('This will clear the canvas and all submissions. Continue?')) {
            this.drawingEffects = [];
            this.submissions = [];
            localStorage.removeItem(`canvas_${this.canvasId}`);
            this.createArtisticBackground();
            this.updateSubmissionCount();
        }
    }

    saveCanvas() {
        const link = document.createElement('a');
        link.download = `collective-canvas-${this.canvasId}-${Date.now()}.png`;
        link.href = this.canvas.toDataURL();
        link.click();
    }

    setupStorage() {
        const key = `canvas_${this.canvasId}`;
        if (!localStorage.getItem(key)) {
            localStorage.setItem(key, JSON.stringify([]));
        }
    }

    updateSubmissionCount() {
        const count = this.submissions.length;
        const element = document.getElementById('submission-count');
        if (element) {
            element.textContent = count;
        }
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('status-message');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `status-message status-${type}`;
            statusDiv.style.display = 'block';
            
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }

    checkCooldown() {
        const lastSubmission = localStorage.getItem('lastSubmission');
        const now = Date.now();
        
        if (lastSubmission && (now - parseInt(lastSubmission)) < 5000) {
            const remaining = Math.ceil((5000 - (now - parseInt(lastSubmission))) / 1000);
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) {
                submitBtn.disabled = true;
                this.showCooldownTimer(remaining);
            }
        }
    }

    showCooldownTimer(remaining = 5) {
        const statusDiv = document.getElementById('status-message');
        if (!statusDiv) return;
        
        const updateTimer = () => {
            if (remaining > 0) {
                statusDiv.textContent = `Please wait ${remaining} seconds before submitting again`;
                statusDiv.className = 'status-message cooldown';
                statusDiv.style.display = 'block';
                remaining--;
                setTimeout(updateTimer, 1000);
            } else {
                statusDiv.style.display = 'none';
                const submitBtn = document.getElementById('submit-btn');
                if (submitBtn) submitBtn.disabled = false;
            }
        };
        
        updateTimer();
    }
}

// Global functions for button onclick handlers
function togglePause() {
    if (window.canvas) window.canvas.togglePause();
}

function softClear() {
    if (window.canvas) window.canvas.softClear();
}

function hardReset() {
    if (window.canvas) window.canvas.hardReset();
}

function saveCanvas() {
    if (window.canvas) window.canvas.saveCanvas();
}

function submitContribution() {
    if (window.canvas) window.canvas.submitContribution();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.canvas = new CollectiveCanvas();
        console.log('Collective Canvas initialized successfully');
    } catch (error) {
        console.error('Error initializing Collective Canvas:', error);
    }
});