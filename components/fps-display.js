// FPS Display Component
AFRAME.registerComponent('fps-display', {
    schema: {
        enabled: { default: true },
        // Removed unused 3D position/scale properties
    },

    init: function() {
        if (!this.data.enabled) return;
        
        this.fps = 0;
        this.frames = 0;
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.maxHistoryLength = 60; // Store last 60 frames
        
        this.createFPSDisplay();
        this.injectFPSStyles();
    },

    injectFPSStyles: function() {
        const style = document.createElement('style');
        style.id = 'fps-display-styles';
        style.innerHTML = `
            .fps-display {
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: #00ff00;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                padding: 8px 12px;
                border-radius: 4px;
                border: 1px solid rgba(0, 255, 0, 0.3);
                z-index: 9998;
                user-select: none;
                backdrop-filter: blur(4px);
            }
            .fps-value { font-weight: bold; font-size: 14px; }
            .fps-good { color: #00ff00; }
            .fps-medium { color: #ffff00; }
            .fps-poor { color: #ff6600; }
            .fps-bad { color: #ff0000; }
            .fps-details { font-size: 10px; color: #cccccc; margin-top: 4px; opacity: 0.8; }
            .fps-graph {
                width: 60px;
                height: 20px;
                margin-top: 4px;
                border: 1px solid rgba(0, 255, 0, 0.2);
                display: block; /* Canvas setup */
            }
        `;
        document.head.appendChild(style);
    },

    createFPSDisplay: function() {
        this.fpsElement = document.createElement('div');
        this.fpsElement.className = 'fps-display';
        this.fpsElement.innerHTML = `
            <div class="fps-value" id="fps-value">60 FPS</div>
            <div class="fps-details" id="fps-details">
                <div>Min: <span id="fps-min">60</span> | Max: <span id="fps-max">60</span></div>
                <div>Avg: <span id="fps-avg">60</span> | <span id="frame-time">16.7</span>ms</div>
            </div>
            <canvas class="fps-graph" id="fps-canvas" width="60" height="20"></canvas>
        `;
        document.body.appendChild(this.fpsElement);

        this.fpsValueElement = document.getElementById('fps-value');
        this.fpsMinElement = document.getElementById('fps-min');
        this.fpsMaxElement = document.getElementById('fps-max');
        this.fpsAvgElement = document.getElementById('fps-avg');
        this.frameTimeElement = document.getElementById('frame-time');
        
        // Setup Canvas for high performance rendering
        this.canvas = document.getElementById('fps-canvas');
        this.ctx = this.canvas.getContext('2d');
    },

    tick: function(time, delta) {
        if (!this.data.enabled || !delta) return;

        this.frames++;
        
        // Keep delta in milliseconds (e.g. 16.6ms)
        this.fpsHistory.push(delta);
        if (this.fpsHistory.length > this.maxHistoryLength) {
            this.fpsHistory.shift();
        }

        // Only update the DOM text once per second to save performance
        if (time - this.lastTime >= 1000) {
            this.fps = Math.round((this.frames * 1000) / (time - this.lastTime));
            this.frames = 0;
            this.lastTime = time;
            
            this.updateFPSText();
        }

        // Draw graph (Canvas is fast enough to do every frame)
        this.drawGraphCanvas();
    },

    updateFPSText: function() {
        if (!this.fpsValueElement || this.fpsHistory.length === 0) return;

        this.fpsValueElement.textContent = `${this.fps} FPS`;
        
        this.fpsValueElement.className = 'fps-value';
        if (this.fps >= 50) this.fpsValueElement.classList.add('fps-good');
        else if (this.fps >= 30) this.fpsValueElement.classList.add('fps-medium');
        else if (this.fps >= 20) this.fpsValueElement.classList.add('fps-poor');
        else this.fpsValueElement.classList.add('fps-bad');

        // Convert delta histories to FPS for stats
        const frameRates = this.fpsHistory.map(dt => 1000 / dt);
        const minFps = Math.min(...frameRates);
        const maxFps = Math.max(...frameRates);
        const avgFps = frameRates.reduce((a, b) => a + b, 0) / frameRates.length;
        const avgFrameTime = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;

        this.fpsMinElement.textContent = Math.round(minFps);
        this.fpsMaxElement.textContent = Math.round(maxFps);
        this.fpsAvgElement.textContent = Math.round(avgFps);
        this.frameTimeElement.textContent = avgFrameTime.toFixed(1);
    },

    drawGraphCanvas: function() {
        if (!this.ctx || this.fpsHistory.length === 0) return;

        // Clear previous frame
        this.ctx.clearRect(0, 0, 60, 20);

        const minFrameTime = 0; // 0ms (Infinite FPS)
        const maxFrameTime = 50; // 50ms (20 FPS) - keeps graph scale consistent

        for (let i = 0; i < this.fpsHistory.length; i++) {
            const frameTime = this.fpsHistory[i];
            
            // Calculate height (taller means higher frameTime / worse FPS)
            // We invert it so taller bars = better FPS
            const heightMultiplier = Math.max(0, 1 - (frameTime / maxFrameTime));
            const barHeight = Math.max(1, heightMultiplier * 20); 
            const yPos = 20 - barHeight;

            // Determine color based on FPS (1000/frameTime)
            const fps = 1000 / frameTime;
            if (fps >= 50) this.ctx.fillStyle = '#00ff00';
            else if (fps >= 30) this.ctx.fillStyle = '#ffff00';
            else if (fps >= 20) this.ctx.fillStyle = '#ff6600';
            else this.ctx.fillStyle = '#ff0000';

            // Draw 1px wide bar
            this.ctx.fillRect(i, yPos, 1, barHeight);
        }
    },

    remove: function() {
        if (this.fpsElement && this.fpsElement.parentNode) {
            this.fpsElement.parentNode.removeChild(this.fpsElement);
        }
        const styles = document.getElementById('fps-display-styles');
        if (styles && styles.parentNode) {
            styles.parentNode.removeChild(styles);
        }
    }
});
