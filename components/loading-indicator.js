// Loading Indicator Component
AFRAME.registerComponent('loading-indicator', {
    schema: {
        enabled: { default: true },
        delayAfterOverlay: { default: 500 } // Delay in ms after overlay closes
    },

    init: function() {
        if (!this.data.enabled) return;
        
        this.createLoadingScreen();
        this.injectLoadingStyles();
        
        this.overlayClosed = false;
        this.loadingStarted = false;
        
        // 1. Start tracking models IMMEDIATELY so we don't miss early 'model-loaded' events
        this.setupProperModelTracking();
        
        // Listen for overlay close event
        window.addEventListener('overlay-closed', () => {
            this.overlayClosed = true;
            setTimeout(() => {
                if (this.overlayClosed && !this.loadingStarted) {
                    this.startLoadingSequence();
                }
            }, this.data.delayAfterOverlay);
        });
    },

    injectLoadingStyles: function() {
        const style = document.createElement('style');
        style.id = 'loading-indicator-styles';
        style.innerHTML = `
            #loading-screen {
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
                z-index: 9999;
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-family: 'Outfit', sans-serif;
                color: #ffffff;
                transition: opacity 0.5s ease;
            }
            .loading-content { text-align: center; max-width: 400px; padding: 40px; }
            .loading-title { font-size: 28px; font-weight: 600; margin-bottom: 20px; color: #87ceeb; }
            .loading-progress { width: 100%; height: 4px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; overflow: hidden; margin: 20px 0; }
            .loading-progress-bar { height: 100%; background: linear-gradient(90deg, #87ceeb, #4a90e2); border-radius: 2px; transition: width 0.3s ease; width: 0%; }
            .loading-status { font-size: 16px; color: #cccccc; margin: 10px 0; }
            .loading-details { font-size: 14px; color: #888888; margin-top: 15px; }
            .loading-spinner { width: 40px; height: 40px; border: 3px solid rgba(255, 255, 255, 0.1); border-top: 3px solid #87ceeb; border-radius: 50%; animation: spin 1s linear infinite; margin: 20px auto; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    },

    createLoadingScreen: function() {
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.id = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <div class="loading-content">
                <div class="loading-title">Loading 3D Assets</div>
                <div class="loading-spinner"></div>
                <div class="loading-progress">
                    <div class="loading-progress-bar" id="progress-bar"></div>
                </div>
                <div class="loading-status" id="loading-status">Detecting 3D models...</div>
                <div class="loading-details" id="loading-details">Preparing your virtual environment</div>
            </div>
        `;
        document.body.appendChild(this.loadingScreen);

        this.progressBar = document.getElementById('progress-bar');
        this.statusText = document.getElementById('loading-status');
        this.detailsText = document.getElementById('loading-details');
    },

    startLoadingSequence: function() {
        if (this.loadingStarted) return;
        this.loadingStarted = true;
        
        // Show loading screen
        this.loadingScreen.style.display = 'flex';
        
        // 2. Removed `this.setupProperModelTracking()` from here so we don't overwrite the tracking from init!
        
        // Start progress simulation
        this.startProgressSimulation();
        
        // Edge case: If all models somehow loaded before the overlay even closed
        if (this.totalModels > 0 && (this.modelsLoaded + this.modelsErrored === this.totalModels)) {
            this.completeLoading();
        }
    },

    setupProperModelTracking: function() {
        this.modelsToTrack = [];
        this.modelsLoaded = 0;
        this.modelsErrored = 0;

        const scene = this.el.sceneEl;
        
        // 3. Updated Query Selector to catch <a-entity gltf-model="..."> as well
        const models = scene.querySelectorAll('a-gltf-model, [gltf-model]');
        
        this.totalModels = models.length;
        
        if (this.totalModels === 0) {
            // No models to track
            return;
        }

        models.forEach((model, index) => {
            const modelInfo = {
                element: model,
                loaded: false,
                id: model.id || `model-${index}` 
            };
            this.modelsToTrack.push(modelInfo);

            model.addEventListener('model-loaded', () => {
                this.onModelLoaded(modelInfo);
            });
            
            model.addEventListener('model-error', (error) => {
                this.onModelError(modelInfo, error);
            });

            // 4. Proper A-Frame check to see if the 3D model is ALREADY loaded
            const isLoaded = model.getObject3D('mesh') || (model.components['gltf-model'] && model.components['gltf-model'].model);
            
            if (isLoaded) {
                setTimeout(() => this.onModelLoaded(modelInfo), 10);
            }
        });

        scene.addEventListener('loaded', () => {
            this.updateProgress(50, 'Scene loaded', 'Processing 3D models...');
        });
    },

    startProgressSimulation: function() {
        this.simulatedProgress = 0;
        this.progressInterval = setInterval(() => {
            if (this.simulatedProgress < 85) {
                this.simulatedProgress += Math.random() * 3;
                this.updateProgress(this.simulatedProgress, 'Loading 3D assets...', 'Downloading and optimizing models');
            }
        }, 200);
    },

    onModelLoaded: function(model) {
        if (model.loaded) return; 
        
        model.loaded = true;
        this.modelsLoaded++;
        
        const progress = (this.modelsLoaded / this.totalModels) * 100;
        this.updateProgress(
            progress, 
            `Loaded ${this.modelsLoaded}/${this.totalModels} models`,
            `Successfully loaded: ${model.id}` 
        );

        if (this.modelsLoaded + this.modelsErrored === this.totalModels) {
            setTimeout(() => this.completeLoading(), 500);
        }
    },

    onModelError: function(model, error) {
        console.warn(`Failed to load model ${model.id}:`, error);
        if (!model.loaded) {
            model.loaded = true; 
            this.modelsErrored++;
            
            const progress = ((this.modelsLoaded + this.modelsErrored) / this.totalModels) * 100;
            this.updateProgress(
                progress,
                `Error loading model: ${model.id}`,
                'Some assets may not display correctly'
            );
        }

        if (this.modelsLoaded + this.modelsErrored === this.totalModels) {
            setTimeout(() => this.completeLoading(), 500);
        }
    },

    updateProgress: function(progress, status, details) {
        if (this.progressBar) {
            this.progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
        if (this.statusText) {
            this.statusText.textContent = status;
        }
        if (this.detailsText) {
            this.detailsText.textContent = details;
        }
    },

    completeLoading: function() {
        // Only run completion if the loading sequence actually started
        if (!this.loadingStarted) return;

        clearInterval(this.progressInterval);
        this.updateProgress(100, 'Complete!', 'Experience ready - Enjoy your visit');
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    if (this.loadingScreen.parentNode) {
                        this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                    }
                }, 500);
            }
        }, 1000);
    },

    remove: function() {
        clearInterval(this.progressInterval);
        if (this.loadingScreen && this.loadingScreen.parentNode) {
            this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
        const styles = document.getElementById('loading-indicator-styles');
        if (styles && styles.parentNode) {
            styles.parentNode.removeChild(styles);
        }
    }
});
