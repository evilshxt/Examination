// Floor Component with exclusion zones for pools and other objects
AFRAME.registerComponent('floor', {
    schema: {
        width: { default: 100 },
        height: { default: 100 },
        color: { default: '#87A96B' },
        roughness: { default: 0.6 },
        metalness: { default: 0.1 },
        receiveShadow: { default: true },
        // Exclusions should be an array of objects: [{x: 0, z: 0, width: 5, depth: 5}]
        exclusions: { default: [] },
        // NEW: Defines how large the texture image should be in real-world meters.
        // A value of 1 means the image will be 1x1 meters and repeat endlessly.
        textureSize: { default: 1 },
        // Texture image path
        texture: { default: '' } 
    },

    init: function() {
        // Set exclusions manually to avoid JSON parsing issues
        this.data.exclusions = [
            {x: -3.78, z: -18.487, width: 7.2, depth: 4.8},
            {x: 6.8, z: -17.4, width: 10.65, depth: 7}
        ];
        this.createFloor();
    },

    update: function(oldData) {
        // Rebuild floor if properties change
        if (Object.keys(oldData).length > 0) {
            this.remove();
            this.createFloor();
        }
    },

    createFloor: function() {
        const data = this.data;

        // 1. Create the outer boundary of the floor as a 2D Shape
        const shape = new THREE.Shape();
        const hw = data.width / 2;
        const hh = data.height / 2;

        shape.moveTo(-hw, -hh);
        shape.lineTo(hw, -hh);
        shape.lineTo(hw, hh);
        shape.lineTo(-hw, hh);
        shape.lineTo(-hw, -hh);

        // 2. Cut holes for each exclusion zone
        if (data.exclusions && data.exclusions.length > 0) {
            data.exclusions.forEach(exclusion => {
                const hole = new THREE.Path();
                
                const exW = exclusion.width / 2;
                const exH = exclusion.depth / 2;

                // IMPORTANT: When a shape is rotated -90 degrees on the X axis to lay flat, 
                // the 2D Y axis becomes the 3D negative Z axis. We must invert Z here.
                const exX = exclusion.x;
                const exY = -exclusion.z;

                // Draw the rectangular hole
                hole.moveTo(exX - exW, exY - exH);
                hole.lineTo(exX + exW, exY - exH);
                hole.lineTo(exX + exW, exY + exH);
                hole.lineTo(exX - exW, exY + exH);
                hole.lineTo(exX - exW, exY - exH);

                // Add the hole to the main shape
                shape.holes.push(hole);
            });
        }

        // 3. Generate Geometry from the shape and holes with UV mapping
        const geometry = new THREE.ShapeGeometry(shape);
        
        // Manually create UV coordinates for the shape geometry
        const positions = geometry.attributes.position;
        const uvs = new Float32Array(positions.count * 2);
        
        // Map 3D coordinates to 2D UV space (0-1 range)
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
            // Convert from local coordinates to UV (0-1)
            const u = (x + hw) / data.width;
            const v = (y + hh) / data.height;
            
            uvs[i * 2] = u;
            uvs[i * 2 + 1] = v;
        }
        
        geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

        // 4. Create Material with texture support
        let material;
        
        if (data.texture) {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(data.texture, (loadedTexture) => {
                loadedTexture.wrapS = THREE.RepeatWrapping;
                loadedTexture.wrapT = THREE.RepeatWrapping;
                loadedTexture.repeat.set(data.width / data.textureSize, data.height / data.textureSize);
                loadedTexture.anisotropy = this.el.sceneEl.renderer.capabilities.getMaxAnisotropy();
            });
            
            material = new THREE.MeshStandardMaterial({
                color: 0xffffff, // White to show texture colors
                roughness: data.roughness,
                metalness: data.metalness,
                map: texture,
                side: THREE.FrontSide
            });
        } else {
            material = new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: data.roughness,
                metalness: data.metalness,
                side: THREE.FrontSide
            });
        }

        // 5. Create Mesh, rotate it to lay flat, and add to scene
        this.floorMesh = new THREE.Mesh(geometry, material);
        
        // Rotate the 2D shape to lay flat on the ground
        this.floorMesh.rotateX(-Math.PI / 2);
        this.floorMesh.position.set(0, -0.41, 0);
        this.floorMesh.receiveShadow = data.receiveShadow;
        
        // Add to the entity
        this.el.setObject3D('mesh', this.floorMesh);
    },

    remove: function() {
        if (this.floorMesh) {
            this.el.removeObject3D('mesh');
            this.floorMesh.geometry.dispose();
            if (this.floorMesh.material.dispose) {
                this.floorMesh.material.dispose();
            }
            this.floorMesh = null;
        }
    }
});
