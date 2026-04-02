// Overlay Slideshow Component - Premium Muted Glassmorphism
AFRAME.registerComponent('overlay-slideshow', {
    schema: {
        enabled: { default: true }
    },

    init: function() {
        this.checkDevMode();
        this.injectStyles();
        this.createOverlay();
        this.startSlideshow();
    },

    checkDevMode: function() {
        this.showOverlay = !window.config?.devMode || window.config?.devMode === false;
    },

    injectStyles: function() {
        if (!this.showOverlay || document.getElementById('slideshow-styles')) return;

        const style = document.createElement('style');
        style.id = 'slideshow-styles';
        
        // Color Palette Mappings:
        // Darkest: #323031
        // Dark: #3d3b3c
        // Mid-Grey: #7f7979
        // Light Ash: #c1bdb3
        // Accent Grey: #5f5b6b

        style.innerHTML = `
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');

            #overlay-slideshow {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(50, 48, 49, 0.85); /* #323031 */
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                z-index: 9999;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: 'Outfit', sans-serif;
                color: #c1bdb3; /* #c1bdb3 */
                transition: opacity 0.5s ease;
            }

            .slide-card {
                background: linear-gradient(145deg, rgba(61, 59, 60, 0.7) 0%, rgba(50, 48, 49, 0.9) 100%); /* #3d3b3c to #323031 */
                border: 1px solid rgba(193, 189, 179, 0.15); /* #c1bdb3 */
                border-radius: 24px;
                padding: 50px;
                max-width: 650px;
                max-height: 80vh;
                width: 90%;
                box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(193, 189, 179, 0.1);
                opacity: 0;
                transform: translateY(30px);
                animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                position: relative;
                overflow-x: hidden;
                overflow-y: auto;
            }

            @keyframes slideUpFade {
                to { opacity: 1; transform: translateY(0); }
            }

            .slide-icon {
                width: 60px; height: 60px;
                background: rgba(95, 91, 107, 0.4); /* #5f5b6b */
                border: 1px solid rgba(193, 189, 179, 0.2); /* #c1bdb3 */
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 24px;
                color: #c1bdb3; /* #c1bdb3 */
            }

            .slide-title {
                font-size: 42px;
                font-weight: 800;
                margin: 0 0 16px 0;
                background: linear-gradient(to right, #c1bdb3, #7f7979);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                line-height: 1.1;
            }

            .slide-content {
                font-size: 18px;
                line-height: 1.6;
                color: #c1bdb3;
                margin-bottom: 40px;
                font-weight: 300;
            }

            /* Credits Table Styling */
            .credit-box {
                background: rgba(50, 48, 49, 0.6); /* #323031 */
                border-radius: 12px;
                padding: 16px;
                margin-top: 16px;
                border: 1px solid rgba(127, 121, 121, 0.3); /* #7f7979 */
            }
            .credit-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid rgba(127, 121, 121, 0.2); /* #7f7979 */
            }
            .credit-row:last-child { border-bottom: none; }
            .credit-label { font-weight: 600; color: #7f7979; } /* #7f7979 */
            .credit-value { color: #c1bdb3; font-weight: 400; text-align: right; }
            .highlight { color: #c1bdb3; font-weight: 600; background: rgba(193, 189, 179, 0.1); padding: 0 6px; border-radius: 4px;}

            /* Controls and Footer */
            .slide-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
                padding-top: 24px;
                border-top: 1px solid rgba(127, 121, 121, 0.2); /* #7f7979 */
            }

            .progress-dots {
                display: flex;
                gap: 8px;
            }
            .dot {
                width: 8px; height: 8px;
                border-radius: 50%;
                background: #7f7979; /* #7f7979 */
                transition: all 0.3s ease;
            }
            .dot.active {
                background: #c1bdb3; /* #c1bdb3 */
                box-shadow: 0 0 10px rgba(193, 189, 179, 0.5);
                transform: scale(1.3);
            }

            .nav-hint {
                font-size: 14px;
                color: #7f7979; /* #7f7979 */
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .key-badge {
                background: rgba(95, 91, 107, 0.5); /* #5f5b6b */
                padding: 4px 10px;
                border-radius: 6px;
                color: #c1bdb3; /* #c1bdb3 */
                font-weight: 600;
                font-size: 12px;
                border: 1px solid rgba(193, 189, 179, 0.2);
            }

            .next-btn {
                background: #5f5b6b; /* #5f5b6b */
                color: #c1bdb3; /* #c1bdb3 */
                border: 1px solid rgba(193, 189, 179, 0.3);
                padding: 10px 24px;
                border-radius: 30px;
                font-size: 16px;
                font-weight: 600;
                font-family: 'Outfit', sans-serif;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .next-btn:hover {
                background: #c1bdb3; /* #c1bdb3 */
                color: #323031; /* #323031 */
                transform: translateY(-2px);
                box-shadow: 0 10px 20px rgba(193, 189, 179, 0.15);
            }
            
            /* Background glow effect */
            .glow-orb {
                position: absolute;
                width: 300px; height: 300px;
                background: radial-gradient(circle, rgba(193, 189, 179, 0.08) 0%, rgba(0,0,0,0) 70%); /* #c1bdb3 */
                top: -100px; right: -100px;
                pointer-events: none;
            }

            /* Custom scrollbar styling */
            .slide-card::-webkit-scrollbar {
                width: 8px;
            }
            .slide-card::-webkit-scrollbar-track {
                background: rgba(50, 48, 49, 0.3); /* #323031 */
                border-radius: 4px;
            }
            .slide-card::-webkit-scrollbar-thumb {
                background: rgba(127, 121, 121, 0.6); /* #7f7979 */
                border-radius: 4px;
                transition: background 0.3s ease;
            }
            .slide-card::-webkit-scrollbar-thumb:hover {
                background: rgba(193, 189, 179, 0.8); /* #c1bdb3 */
            }
        `;
        document.head.appendChild(style);
    },

    createOverlay: function() {
        if (!this.showOverlay) return;

        this.overlayContainer = document.createElement('div');
        this.overlayContainer.setAttribute('id', 'overlay-slideshow');

        this.slides = [
            {
                icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/></svg>`,
                title: 'Welcome to the Experience',
                content: `
                    <div style="margin-bottom: 20px;">
                        <span style="font-size: 24px; font-weight: 600; color: #c1bdb3;">Computer Graphics Examination Project</span>
                    </div>
                    <div>
                        <span style="color: #7f7979;">Author:</span> <span style="color: #c1bdb3;">Frimpong-Boateng Richmond</span><br>
                        <span style="color: #7f7979;">ID:</span> <span class="highlight">FCM.41.020.061.24</span>
                    </div>
                `
            },
            {
                icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
                title: '3D Model Credits & Attributes',
                content: `
                    <p style="margin-bottom: 15px; color: #7f7979;">The centerpiece of this showcase features the incredible work of the 3D community.</p>
                    <div class="credit-box">
                        <h3 style="margin: 0 0 10px 0; color: #c1bdb3; font-size: 20px;">Colonial Mansion</h3>
                        <div class="credit-row">
                            <span class="credit-label">Creator</span>
                            <span class="credit-value">Home Design 3D</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Platform</span>
                            <span class="credit-value">Sketchfab</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">License</span>
                            <span class="credit-value">Sketchfab Standard License</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">File Path</span>
                            <span class="credit-value" style="font-family: monospace; color: #7f7979;">models/compressed/colonial_mansion-compressed.glb</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Original URL</span>
                            <span class="credit-value" style="font-size: 11px;">sketchfab.com/models/6224cfa62a6541a2aea5a02f17dfdd96</span>
                        </div>
                    </div>
                    <div class="credit-box" style="margin-top: 15px;">
                        <h3 style="margin: 0 0 10px 0; color: #c1bdb3; font-size: 20px;">McLaren F1 1993</h3>
                        <div class="credit-row">
                            <span class="credit-label">Creator</span>
                            <span class="credit-value">Alex.Ka.🤍🖤 by ᗩᒪE᙭. Kᗩ.🚗</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">License</span>
                            <span class="credit-value">CC Attribution-NonCommercial</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">File Path</span>
                            <span class="credit-value" style="font-family: monospace; color: #7f7979;">models/compressed/mclaren-compressed.glb</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">File Size</span>
                            <span class="credit-value">5.9 MB</span>
                        </div>
                    </div>
                    <div class="credit-box" style="margin-top: 15px;">
                        <h3 style="margin: 0 0 10px 0; color: #c1bdb3; font-size: 20px;">Framework Credits</h3>
                        <div class="credit-row">
                            <span class="credit-label">WebXR Framework</span>
                            <span class="credit-value">A-Frame by Mozilla</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Environment Component</span>
                            <span class="credit-value">A-Frame Environment Component</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">3D Compression</span>
                            <span class="credit-value">Draco by Google</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Conversion Tool</span>
                            <span class="credit-value">convert3d.org</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Documentation Tool</span>
                            <span class="credit-value">Canva Docs</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Background Music</span>
                            <span class="credit-value">"Cylinder Five" by Chris Zabriskie</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Music License</span>
                            <span class="credit-value">CC BY 4.0</span>
                        </div>
                        <div class="credit-row">
                            <span class="credit-label">Special Thanks</span>
                            <span class="credit-value">A-Frame Development Community</span>
                        </div>
                    </div>
                `
            },
            {
                icon: `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 10.5L21 3"></path><path d="M16 3h5v5"></path><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg>`,
                title: 'Ignition Sequence Initiated.',
                content: `
                    <p style="font-size: 22px; color: #c1bdb3; margin-bottom: 15px;">You are now ready to explore.</p>
                    <p style="color: #7f7979;">Use your <span class="highlight">Mouse</span> to look around and pan the camera.<br>
                    Use <span class="highlight">W A S D</span> keys to move through the environment.<br>
                    Use <span class="highlight">Q</span> and <span class="highlight">E</span> to move down and up.</p>
                    <div style="margin-top: 25px; padding: 15px; background: rgba(95, 91, 107, 0.2); border: 1px solid rgba(193, 189, 179, 0.2); border-radius: 8px; color: #c1bdb3; text-align: center; letter-spacing: 0.5px;">
                        Systems online. Environment rendered.
                    </div>
                `
            }
        ];

        this.currentSlide = 0;
        document.body.appendChild(this.overlayContainer);

        this.keydownHandler = (e) => {
            if (!this.showOverlay) return;
            if (e.key === 'Escape') {
                this.hideOverlay();
            } else if (e.key === ' ' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        };
        document.addEventListener('keydown', this.keydownHandler);
        
        window.advanceAframeSlideshow = () => this.nextSlide();
    },

    startSlideshow: function() {
        if (!this.showOverlay) return;
        this.renderSlide();
    },

    renderSlide: function() {
        if (this.currentSlide >= this.slides.length) {
            this.hideOverlay();
            return;
        }

        const slide = this.slides[this.currentSlide];
        const isLast = this.currentSlide === this.slides.length - 1;

        let dotsHtml = '';
        for(let i = 0; i < this.slides.length; i++) {
            dotsHtml += `<div class="dot ${i === this.currentSlide ? 'active' : ''}"></div>`;
        }
        
        this.overlayContainer.innerHTML = `
            <div class="slide-card">
                <div class="glow-orb"></div>
                <div class="slide-icon">${slide.icon}</div>
                <h1 class="slide-title">${slide.title}</h1>
                <div class="slide-content">${slide.content}</div>
                
                <div class="slide-footer">
                    <div class="progress-dots">
                        ${dotsHtml}
                    </div>
                    <div class="nav-hint" style="display: ${isLast ? 'none' : 'flex'}">
                        <span class="key-badge">Space</span> or <span class="key-badge">→</span> to advance
                    </div>
                    <button class="next-btn" onclick="window.advanceAframeSlideshow()">
                        ${isLast ? 'Enter Experience' : 'Next Stage'}
                    </button>
                </div>
            </div>
        `;
    },

    nextSlide: function() {
        this.currentSlide++;
        this.renderSlide();
    },

    hideOverlay: function() {
        if (this.overlayContainer) {
            this.overlayContainer.style.opacity = '0';
            setTimeout(() => {
                if (this.overlayContainer.parentNode) {
                    this.overlayContainer.parentNode.removeChild(this.overlayContainer);
                }
            }, 500);
        }
        this.showOverlay = false;
        document.removeEventListener('keydown', this.keydownHandler);
        
        // Start background music when overlay closes
        const backgroundMusic = document.getElementById('background-music');
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3; // Set volume to 30%
            backgroundMusic.play().catch(e => {
                console.log('Music autoplay prevented:', e);
                // Fallback: Add click listener to start music on first user interaction
                document.addEventListener('click', function startMusic() {
                    backgroundMusic.play().catch(err => console.log('Music play failed:', err));
                    document.removeEventListener('click', startMusic);
                }, { once: true });
            });
        }
    },

    remove: function() {
        this.hideOverlay();
    }
});