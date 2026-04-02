// Elite Luxury Bar Component for Pool Villa — FIXED
AFRAME.registerComponent('bar-scene', {
  schema: {
    position: { type: 'vec3', default: { x: -10, y: 0, z: -2 } }
  },

  init: function () {
    const el = document.createElement('a-entity');
    el.setAttribute('position', this.data.position);
    
    // Materials Dictionary (Using hex codes and PBR properties for extreme realism)
    const mats = {
      woodMain: 'color: #3b2516; roughness: 0.85; metalness: 0.05',
      woodFluted: 'color: #4a2f1d; roughness: 0.9',
      woodLight: 'color: #7a4f2a; roughness: 0.8',
      marble: 'color: #fcfcfc; roughness: 0.08; metalness: 0.1',
      mirror: 'color: #bbbbcc; roughness: 0.02; metalness: 0.95',
      metalBlack: 'color: #1a1a1a; roughness: 0.4; metalness: 0.8',
      metalGold: 'color: #d4af37; roughness: 0.3; metalness: 0.9',
      metalChrome: 'color: #e0e0e0; roughness: 0.1; metalness: 1.0',
      velvetGreen: 'color: #0b3b24; roughness: 0.95',
      glassClear: 'color: #ffffff; opacity: 0.3; transparent: true; roughness: 0.05',
      glassDark: 'color: #111111; opacity: 0.8; transparent: true; roughness: 0.1',
      ledWarm: 'color: #ffcc88; emissive: #ffaa44; emissiveIntensity: 2; shader: flat'
    };

    let html = '';

    // ==========================================
    // 1. ARCHITECTURAL PERGOLA
    // ==========================================
    
    const postPositions = [[-1.6, -2.4], [1.6, -2.4], [-1.6, 0.2], [1.6, 0.2]];
    postPositions.forEach(p => {
      html += `<a-box position="${p[0]} 0.1 ${p[1]}" width="0.25" height="0.2" depth="0.25" material="color: #666; roughness: 1.0"></a-box>`;
      html += `<a-box position="${p[0]} 1.6 ${p[1]}" width="0.12" height="3.0" depth="0.12" material="${mats.woodMain}"></a-box>`;
      html += `<a-box position="${p[0]} 3.0 ${p[1]}" width="0.15" height="0.2" depth="0.15" material="${mats.metalBlack}"></a-box>`;
    });

    html += `<a-box position="0 3.1 -2.4" width="3.4" height="0.15" depth="0.12" material="${mats.woodMain}"></a-box>`;
    html += `<a-box position="0 3.1 0.2" width="3.4" height="0.15" depth="0.12" material="${mats.woodMain}"></a-box>`;
    html += `<a-box position="-1.6 3.1 -1.1" width="0.12" height="0.15" depth="2.8" material="${mats.woodMain}"></a-box>`;
    html += `<a-box position="1.6 3.1 -1.1" width="0.12" height="0.15" depth="2.8" material="${mats.woodMain}"></a-box>`;

    for(let i = 0; i < 22; i++) {
      let zPos = -2.6 + (i * 0.13);
      html += `<a-box position="0 3.25 ${zPos}" width="3.6" height="0.08" depth="0.03" material="${mats.woodMain}"></a-box>`;
    }


    // ==========================================
    // 2. LUXURY BAR COUNTER
    // ==========================================
    
    html += `<a-box position="0 0.55 -1.5" width="3.1" height="1.1" depth="0.75" material="${mats.woodMain}"></a-box>`;
    
    for(let i = 0; i < 31; i++) {
      let xPos = -1.5 + (i * 0.1);
      html += `<a-cylinder position="${xPos} 0.55 -1.12" radius="0.048" height="1.1" material="${mats.woodFluted}"></a-cylinder>`;
    }

    html += `<a-box position="0 1.12 -1.45" width="3.3" height="0.05" depth="0.9" material="${mats.marble}"></a-box>`;
    html += `<a-box position="0 1.08 -1.05" width="3.1" height="0.01" depth="0.02" material="${mats.ledWarm}"></a-box>`;
    html += `<a-light type="point" position="0 0.8 -1.0" color="#ffaa44" intensity="0.5" distance="1.5"></a-light>`;

    // Footrest bar (runs along X axis at front of counter)
    html += `<a-cylinder position="0 0.2 -0.9" radius="0.025" height="3.1" rotation="0 0 90" material="${mats.metalBlack}"></a-cylinder>`;

    // FIX #4: Footrest supports - connect bar to counter base. 
    // They should run in Z (from footrest bar at z=-0.9 toward counter face at z=-1.12),
    // rotation="0 0 0" so the cylinder's axis is along Y, then rotate 90 on X so it runs in Z.
    // Position them at x = ±1.0, halfway between z=-0.9 and z=-1.12 → z = -1.01, height = 0.22
    html += `<a-cylinder position="-1.0 0.2 -1.01" radius="0.015" height="0.22" rotation="90 0 0" material="${mats.metalBlack}"></a-cylinder>`;
    html += `<a-cylinder position="1.0 0.2 -1.01" radius="0.015" height="0.22" rotation="90 0 0" material="${mats.metalBlack}"></a-cylinder>`;


    // ==========================================
    // 3. BACK BAR & SHELVING
    // ==========================================
    
    html += `<a-box position="0 1.6 -2.38" width="3.0" height="1.0" depth="0.02" material="${mats.mirror}"></a-box>`;
    
    // Shelf surfaces — top surface of shelf is at shelfTopY
    // Bottom shelf top surface: 1.4 + 0.03/2 = 1.415 → bottles sit on 1.415
    // Top shelf top surface:    1.8 + 0.03/2 = 1.815 → bottles sit on 1.815
    html += `<a-box position="0 1.4 -2.2" width="3.0" height="0.03" depth="0.35" material="${mats.woodMain}"></a-box>`;
    html += `<a-box position="0 1.8 -2.2" width="3.0" height="0.03" depth="0.35" material="${mats.woodMain}"></a-box>`;

    // FIX #2 & #3: Bottles — clamp height so they never clip the shelf above,
    // and anchor each bottle so its base always sits exactly on the shelf surface.
    //
    // Bottom shelf: top at y=1.415. Next shelf at y=1.8 (bottom face at 1.785).
    //   Max safe total height (body + neck) must fit under 1.785 → max body h = 0.28
    // Top shelf: top at y=1.815. Pergola is high enough → give same max for consistency.
    //
    // Bottle base is at shelfTopY. Body centre is at shelfTopY + h/2.
    // Neck centre is at shelfTopY + h + 0.04 (neck height = 0.08).

    const shelfTopY = [1.415, 1.815];

    for(let s = 0; s < 2; s++) {
      const sy = shelfTopY[s];
      for(let b = 0; b < 12; b++) {
        let x = -1.3 + (b * 0.23) + (Math.random() * 0.05);
        let isDark = Math.random() > 0.5;
        let bMat = isDark ? mats.glassDark : mats.glassClear;
        let liqColor = isDark ? '#331100' : (Math.random() > 0.5 ? '#eec268' : '#ccddff');

        // FIX #2: Cap height so neck top stays below next shelf (or ceiling)
        // body h range 0.2–0.28, neck 0.08 → total max 0.36, well clear of the 0.37 gap
        let h = 0.2 + (Math.random() * 0.08); // 0.20–0.28

        let bodyCentreY  = sy + h / 2;            // base on shelf surface
        let neckCentreY  = sy + h + 0.04;         // sits directly on top of body
        let labelCentreY = sy + h / 2;            // same as body centre

        html += `
          <a-entity>
            <!-- Glass Body -->
            <a-cylinder position="${x} ${bodyCentreY.toFixed(3)} -2.2" radius="0.04" height="${h.toFixed(3)}" material="${bMat}"></a-cylinder>
            <!-- Liquid inside -->
            <a-cylinder position="${x} ${(sy + (h - 0.05) / 2).toFixed(3)} -2.2" radius="0.035" height="${(h - 0.05).toFixed(3)}" material="color: ${liqColor}; opacity: 0.9; transparent: true"></a-cylinder>
            <!-- Neck -->
            <a-cylinder position="${x} ${neckCentreY.toFixed(3)} -2.2" radius="0.015" height="0.08" material="${bMat}"></a-cylinder>
            <!-- Label band -->
            <a-cylinder position="${x} ${labelCentreY.toFixed(3)} -2.2" radius="0.041" height="0.06" material="color: #eee; roughness: 0.9"></a-cylinder>
          </a-entity>
        `;
      }
    }


    // ==========================================
    // 4. COUNTERTOP CLUTTER
    // ==========================================
    const tableY = 1.145; // top of marble slab (1.12 + 0.05/2 = 1.145)

    // 4a. Whiskey Setup
    html += `
      <a-entity position="-0.8 0 -1.2">
        <!-- Square Whiskey Bottle — base at tableY, body h=0.2, centre at tableY+0.1 -->
        <a-box position="0 ${(tableY + 0.1).toFixed(3)} 0" width="0.08" height="0.2" depth="0.08" material="${mats.glassClear}"></a-box>
        <!-- Whiskey Liquid — base at tableY, height 0.15, centre at tableY+0.075 -->
        <a-box position="0 ${(tableY + 0.075).toFixed(3)} 0" width="0.07" height="0.15" depth="0.07" material="color: #c96b1a; opacity: 0.9; transparent: true"></a-box>
        <!-- Gold Cap — sits on top of bottle: tableY + 0.2 + 0.02 = tableY+0.22 -->
        <a-cylinder position="0 ${(tableY + 0.22).toFixed(3)} 0" radius="0.02" height="0.04" material="${mats.metalGold}"></a-cylinder>
        
        <!-- Rocks Glass — base at tableY, h=0.08, centre at tableY+0.04 -->
        <a-cylinder position="0.15 ${(tableY + 0.04).toFixed(3)} 0.05" radius="0.035" height="0.08" material="${mats.glassClear}"></a-cylinder>
        <!-- Whiskey in glass — base at tableY, h=0.04, centre at tableY+0.02 -->
        <a-cylinder position="0.15 ${(tableY + 0.02).toFixed(3)} 0.05" radius="0.03" height="0.04" material="color: #c96b1a; opacity: 0.9; transparent: true"></a-cylinder>
        <!-- Ice Cube — sitting in the whiskey, roughly at tableY+0.03 -->
        <a-box position="0.15 ${(tableY + 0.03).toFixed(3)} 0.05" width="0.03" height="0.03" depth="0.03" rotation="15 45 20" material="color: #ffffff; opacity: 0.6; transparent: true"></a-box>
      </a-entity>
    `;

    // 4b. Champagne Ice Bucket
    // FIX #5: Cone height=0.2, so half-height=0.1. Base sits on tableY → centre at tableY+0.1
    html += `
      <a-entity position="0.6 0 -1.4">
        <!-- Chrome Bucket — base on marble, centre at tableY+0.1 -->
        <a-cone position="0 ${(tableY + 0.1).toFixed(3)} 0" radius-bottom="0.08" radius-top="0.12" height="0.2" material="${mats.metalChrome}"></a-cone>
        <!-- Angled Champagne Bottle protruding from bucket top (tableY+0.2) -->
        <a-entity rotation="30 45 0" position="0.05 ${(tableY + 0.22).toFixed(3)} 0">
          <a-cylinder position="0 0 0" radius="0.045" height="0.25" material="color: #0d2e16; roughness: 0.1"></a-cylinder>
          <a-cylinder position="0 0.15 0" radius="0.018" height="0.1" material="color: #0d2e16"></a-cylinder>
          <a-cylinder position="0 0.18 0" radius="0.02" height="0.06" material="${mats.metalGold}"></a-cylinder>
        </a-entity>
        <!-- Ice Shards at bucket rim level -->
        <a-box position="-0.02 ${(tableY + 0.18).toFixed(3)} 0.04" width="0.04" height="0.04" depth="0.04" rotation="20 10 40" material="color: #fff; opacity: 0.7; transparent: true"></a-box>
        <a-box position="0.04 ${(tableY + 0.17).toFixed(3)} -0.05" width="0.04" height="0.04" depth="0.04" rotation="70 40 10" material="color: #fff; opacity: 0.7; transparent: true"></a-box>
      </a-entity>
    `;

    // 4c. Cocktail Glasses
    // FIX #6: Martini glass — build stem-up so each piece connects cleanly.
    // Base disc at tableY, stem from tableY+0.005 to tableY+0.085 (h=0.08),
    // bowl (cone) base connects at tableY+0.085, cone h=0.09 → top rim at tableY+0.175
    html += `
      <!-- Martini Glass -->
      <a-entity position="0.1 0 -1.2">
        <!-- Base disc -->
        <a-cylinder position="0 ${(tableY + 0.005).toFixed(3)} 0" radius="0.035" height="0.01" material="${mats.glassClear}"></a-cylinder>
        <!-- Stem -->
        <a-cylinder position="0 ${(tableY + 0.045).toFixed(3)} 0" radius="0.005" height="0.08" material="${mats.glassClear}"></a-cylinder>
        <!-- Bowl: cone narrow-end (radius 0.01) at bottom connecting to stem, wide-end (radius 0.06) at top -->
        <a-cone position="0 ${(tableY + 0.13).toFixed(3)} 0" radius-bottom="0.01" radius-top="0.06" height="0.09" material="${mats.glassClear}"></a-cone>
        <!-- Olive/lime pick — resting across rim -->
        <a-cylinder position="0.03 ${(tableY + 0.18).toFixed(3)} 0" radius="0.002" height="0.1" rotation="30 0 45" material="color: #ddd"></a-cylinder>
      </a-entity>

      <!-- Highball Glass — base at tableY, h=0.14, centre at tableY+0.07 -->
      <a-cylinder position="-0.2 ${(tableY + 0.07).toFixed(3)} -1.3" radius="0.03" height="0.14" material="${mats.glassClear}"></a-cylinder>
      <!-- Drink inside — base at tableY, h=0.10, centre at tableY+0.05 -->
      <a-cylinder position="-0.2 ${(tableY + 0.05).toFixed(3)} -1.3" radius="0.025" height="0.10" material="color: #ff3366; opacity: 0.8; transparent: true"></a-cylinder>
      <!-- Black Straw — bottom just above drink level, angled -->
      <a-cylinder position="-0.21 ${(tableY + 0.16).toFixed(3)} -1.3" radius="0.004" height="0.18" rotation="10 0 20" material="color: #111"></a-cylinder>
    `;


    // ==========================================
    // 5. PLUSH VELVET STOOLS — FIXED BACKREST
    // ==========================================
    const stoolX = [-0.9, 0, 0.9];
    stoolX.forEach(x => {
      // Seat top surface: floor(0) + brass plate(0.04) + post(0.7 height, base at 0.04, top at 0.74) + seat half(0.06) = seat top at ~0.78
      // Seat centre Y = 0.04 + 0.7/2 ... actually: plate centre 0.02, post centre 0.04+0.35=0.39, seat centre 0.04+0.7+0.06=0.80
      const seatCentreY = 0.80;
      const seatTopY = seatCentreY + 0.06; // 0.86

      // FIX #1: Replace the broken theta-start cylinder backrest with a proper arc backrest.
      // Use a thin curved-looking box that sits ABOVE and BEHIND the seat like a low backrest lip.
      // Two angled side pieces + one horizontal top piece form a minimal "C" backrest silhouette.
      const backY = seatTopY + 0.08; // just above seat
      const backZ = -0.17;           // behind seat centre

      html += `
        <a-entity position="${x} 0 -0.4">
          <!-- Heavy Brass Floor Plate -->
          <a-cylinder position="0 0.02 0" radius="0.25" height="0.04" material="${mats.metalGold}"></a-cylinder>
          <!-- Center Post -->
          <a-cylinder position="0 0.39 0" radius="0.035" height="0.7" material="${mats.metalGold}"></a-cylinder>
          <!-- Footrest Ring -->
          <a-torus position="0 0.25 0" radius="0.16" radius-tubular="0.015" rotation="90 0 0" material="${mats.metalGold}"></a-torus>
          <!-- Plush Velvet Seat -->
          <a-cylinder position="0 ${seatCentreY.toFixed(3)} 0" radius="0.22" height="0.12" material="${mats.velvetGreen}"></a-cylinder>

          <!-- FIXED Backrest: three velvet panels forming a low crescent back -->
          <!-- Horizontal top rail -->
          <a-box position="0 ${(seatTopY + 0.18).toFixed(3)} ${backZ}" width="0.38" height="0.06" depth="0.06" material="${mats.velvetGreen}"></a-box>
          <!-- Left upright -->
          <a-box position="-0.16 ${(seatTopY + 0.09).toFixed(3)} ${backZ}" width="0.06" height="0.18" depth="0.06" material="${mats.velvetGreen}"></a-box>
          <!-- Right upright -->
          <a-box position="0.16 ${(seatTopY + 0.09).toFixed(3)} ${backZ}" width="0.06" height="0.18" depth="0.06" material="${mats.velvetGreen}"></a-box>
        </a-entity>
      `;
    });


    // ==========================================
    // 6. EDISON PENDANT LIGHTING
    // ==========================================
    const lightX = [-1.0, 0, 1.0];
    lightX.forEach(x => {
      html += `
        <a-entity position="${x} 3.0 -1.2">
          <!-- Black Wire dropping down -->
          <a-cylinder position="0 -0.5 0" radius="0.005" height="1.0" material="${mats.metalBlack}"></a-cylinder>
          <!-- Brass Socket -->
          <a-cylinder position="0 -1.0 0" radius="0.025" height="0.06" material="${mats.metalGold}"></a-cylinder>
          <!-- Clear Glass Teardrop Bulb — sits directly below socket -->
          <a-sphere position="0 -1.08 0" radius="0.06" material="${mats.glassClear}"></a-sphere>
          <!-- Glowing Filament inside bulb -->
          <a-cylinder position="0 -1.08 0" radius="0.005" height="0.04" material="${mats.ledWarm}"></a-cylinder>
          <!-- Actual Light Emitter -->
          <a-light type="point" position="0 -1.1 0" color="#ffddaa" intensity="0.3" distance="4"></a-light>
        </a-entity>
      `;
    });

    el.innerHTML = html;
    this.el.appendChild(el);
  }
});