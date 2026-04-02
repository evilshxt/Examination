AFRAME.registerComponent('sunlight', {
    schema: {
        enabled: { default: true },
        
        // Lighting
        sunIntensity: { default: 0.5 },
        ambientIntensity: { default: 0.15 },
        
        // Position
        position: { default: { x: 15, y: 50, z: 15 } },
        
        // Shadows
        castShadow: { default: true }
    },
    
    init: function () {
        if (!this.data.enabled) return;
        
        this.createSunLight();
        this.createAmbientLight();
        this.createSunVisual();
    },

    createSunLight: function () {
        // 🌞 MAIN SUN LIGHT (bright white)
        this.sunLight = document.createElement('a-light');
        this.sunLight.setAttribute('type', 'directional');
        this.sunLight.setAttribute('color', '#ffffff'); // bright white
        this.sunLight.setAttribute('intensity', this.data.sunIntensity * 2.0); // increased intensity
        this.sunLight.setAttribute(
            'position',
            `${this.data.position.x} ${this.data.position.y} ${this.data.position.z}` 
        );

        if (this.data.castShadow) {
            this.sunLight.setAttribute('light', `
                castShadow: true;
                shadowMapSize: 2048;
                shadowCameraLeft: -20;
                shadowCameraRight: 20;
                shadowCameraTop: 20;
                shadowCameraBottom: -20;
                shadowCameraNear: 0.5;
                shadowCameraFar: 100;
            `);
        }

        this.el.appendChild(this.sunLight);
    },

    createAmbientLight: function () {
        // 🌤 SKY LIGHT (soft blue bounce)
        this.ambientLight = document.createElement('a-light');
        this.ambientLight.setAttribute('type', 'ambient');
        this.ambientLight.setAttribute('color', '#cfe8ff'); // subtle sky blue
        this.ambientLight.setAttribute('intensity', this.data.ambientIntensity);

        this.el.appendChild(this.ambientLight);
    },

    createSunVisual: function () {
        // 🌞 VISUAL SUN ONLY (no lighting influence)

        // Core sun (small, not overpowering)
        this.sunCore = document.createElement('a-sphere');
        this.sunCore.setAttribute(
            'position',
            `${this.data.position.x} ${this.data.position.y} ${this.data.position.z}` 
        );
        this.sunCore.setAttribute('radius', '1.5');
        this.sunCore.setAttribute('material', `
            color: #fff4d6;
            src: assets/sun-texture.jpg;
        `);

        // Soft halo (VERY subtle, no scene tinting)
        this.sunGlow = document.createElement('a-sphere');
        this.sunGlow.setAttribute(
            'position',
            `${this.data.position.x} ${this.data.position.y} ${this.data.position.z}` 
        );
        this.sunGlow.setAttribute('radius', '3');
        this.sunGlow.setAttribute('material', `
            color: #ffd27a;
            transparent: true;
            opacity: 0.08;
            depthWrite: false;
        `);

        this.el.appendChild(this.sunGlow);
        this.el.appendChild(this.sunCore);
    },

    update: function (oldData) {
        if (this.sunLight && oldData.sunIntensity !== this.data.sunIntensity) {
            this.sunLight.setAttribute('intensity', this.data.sunIntensity);
        }

        if (this.ambientLight && oldData.ambientIntensity !== this.data.ambientIntensity) {
            this.ambientLight.setAttribute('intensity', this.data.ambientIntensity);
        }
    },

    waitForModelAndAdjustMaterial: function () {
        // Wait for the model to load
        const model = document.querySelector('a-gltf-model');
        if (!model) {
            // Try again in a bit if model not found
            setTimeout(() => this.waitForModelAndAdjustMaterial(), 100);
            return;
        }
        
        // Wait for model to load
        model.addEventListener('model-loaded', () => {
            // Apply flat shader to all meshes in the model
            const applyFlatShader = (node) => {
                if (node.isMesh && node.material) {
                    node.material.shader = 'flat';
                    // Optionally increase emissive to make it brighter
                    node.material.emissive.setHex(0xffffff);
                    node.material.emissiveIntensity = 0.5;
                }
                // Recurse into children
                node.children.forEach(applyFlatShader);
            };
            
            // Apply to the model's object3D
            applyFlatShader(model.getObject3D('mesh'));
        });
        
        // Also try immediate application in case model already loaded
        if (model.getObject3D('mesh')) {
            setTimeout(() => {
                model.emit('model-loaded');
            }, 0);
        }
    },

    remove: function () {
        if (this.sunLight?.parentNode) this.sunLight.parentNode.removeChild(this.sunLight);
        if (this.ambientLight?.parentNode) this.ambientLight.parentNode.removeChild(this.ambientLight);
        if (this.sunCore?.parentNode) this.sunCore.parentNode.removeChild(this.sunCore);
        if (this.sunGlow?.parentNode) this.sunGlow.parentNode.removeChild(this.sunGlow);
    }
});