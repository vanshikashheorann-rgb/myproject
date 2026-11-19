/**
 * SIGNIFY - 3D Human Hand Visualization & Viewport Renderer
 * Powered by Three.js with studio lighting, realistic skin rendering,
 * interactive 3D orbit rotation, and smooth keyframe interpolation.
 */

class Hand3DRenderer {
  constructor(options = {}) {
    this.container = options.container || document.getElementById('demonstration-stage');
    this.canvasId = options.canvasId || 'hand-3d-canvas';

    // Three.js Core Components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lights = {};
    
    // 3D Hand Models
    this.rightHand = null;
    this.leftHand = null;

    // Camera & Orbit State
    this.defaultCameraPos = new THREE.Vector3(0, 0.35, 4.2);
    this.targetLookAt = new THREE.Vector3(0, 0.25, 0.3);
    this.cameraDistance = 4.2;
    this.orbitAngles = { theta: 0, phi: 0 }; // Yaw, Pitch offsets
    this.isDragging = false;
    this.previousMousePos = { x: 0, y: 0 };

    // Active Pose & Animation State
    this.currentSignId = 'namaste';
    this.activePoseDef = null;
    this.animationTime = 0;
    this.animationDuration = 1800; // ms
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.lastFrameTime = performance.now();
    this.rafId = null;

    // Transition State (Blends between consecutive signs)
    this.isTransitioning = false;
    this.transitionProgress = 1.0;
    this.transitionDuration = 220; // ms
    this.fromPose = { right: null, left: null };
    this.toPose = { right: null, left: null };

    this.init();
  }

  init() {
    if (!this.container) return;

    // 1. Setup Three.js Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070b16, 0.08);

    // 2. Setup Camera
    const aspect = this.container.clientWidth / this.container.clientHeight || (5 / 4);
    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    this.camera.position.copy(this.defaultCameraPos);
    this.camera.lookAt(this.targetLookAt);

    // 3. Setup WebGLRenderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.renderer.domElement.id = this.canvasId;
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.zIndex = '3';
    this.renderer.domElement.style.cursor = 'grab';

    // Clear any previous canvas
    const oldCanvas = this.container.querySelector(`#${this.canvasId}`);
    if (oldCanvas) oldCanvas.remove();
    this.container.appendChild(this.renderer.domElement);

    // 4. Setup Lighting
    this.setupLighting();

    // 5. Setup Ground Shadow Plane & Studio Floor
    this.setupStudioFloor();

    // 6. Build Rigged 3D Hand Models (Right & Left)
    this.rightHand = new Hand3DModel(false);
    this.leftHand = new Hand3DModel(true);

    this.scene.add(this.rightHand.root);
    this.scene.add(this.leftHand.root);

    // 7. Setup Orbit Drag Rotation & Touch Listeners
    this.setupOrbitControls();

    // 8. Handle Window / Viewport Resize
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // 9. Load Default Initial Pose (Namaste)
    this.setSign('namaste');

    // 10. Start Render Loop
    this.renderLoop();
  }

  setupLighting() {
    // Ambient Light (Soft base illumination)
    const ambient = new THREE.AmbientLight(0x1e293b, 1.2);
    this.scene.add(ambient);
    this.lights.ambient = ambient;

    // Key Light (Warm directional studio key light with soft shadows)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    keyLight.position.set(2.5, 4.0, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 12;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 2.5;
    keyLight.shadow.camera.bottom = -2.5;
    keyLight.shadow.bias = -0.0005;
    this.scene.add(keyLight);
    this.lights.key = keyLight;

    // Fill Light (Cool blue fill light to balance shadows)
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.7);
    fillLight.position.set(-3.0, 1.5, 2.5);
    this.scene.add(fillLight);
    this.lights.fill = fillLight;

    // Rim / Silhouette Light (Cybernetic sky blue rim light highlighting finger edges)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.25);
    rimLight.position.set(0, 3.0, -3.0);
    this.scene.add(rimLight);
    this.lights.rim = rimLight;

    // Soft Front Subtle Flash
    const frontLight = new THREE.PointLight(0xffffff, 0.4, 8);
    frontLight.position.set(0, 0.5, 3.0);
    this.scene.add(frontLight);
  }

  setupStudioFloor() {
    // Soft shadow receiver plane beneath hands
    const shadowGeo = new THREE.PlaneGeometry(12, 12);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.2;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);

    // Subtle dark circular platform glow
    const circleGeo = new THREE.CircleGeometry(2.4, 32);
    const circleMat = new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.05,
      depthWrite: false
    });
    const circleMesh = new THREE.Mesh(circleGeo, circleMat);
    circleMesh.rotation.x = -Math.PI / 2;
    circleMesh.position.y = -1.19;
    this.scene.add(circleMesh);
  }

  setupOrbitControls() {
    const el = this.renderer.domElement;

    const onMouseDown = (e) => {
      this.isDragging = true;
      this.previousMousePos = { x: e.clientX, y: e.clientY };
      el.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePos.x;
      const deltaY = e.clientY - this.previousMousePos.y;
      this.previousMousePos = { x: e.clientX, y: e.clientY };

      // Orbit angles update (damped)
      this.orbitAngles.theta -= deltaX * 0.007;
      this.orbitAngles.phi = Math.max(-0.65, Math.min(0.65, this.orbitAngles.phi + deltaY * 0.007));
      this.updateCameraOrbit();
    };

    const onMouseUp = () => {
      this.isDragging = false;
      el.style.cursor = 'grab';
    };

    const onWheel = (e) => {
      e.preventDefault();
      // Zoom within ergonomic boundaries
      this.cameraDistance = Math.max(2.8, Math.min(5.8, this.cameraDistance + e.deltaY * 0.003));
      this.updateCameraOrbit();
    };

    // Touch events for mobile
    let touchStartDist = 0;
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const deltaX = e.touches[0].clientX - this.previousMousePos.x;
        const deltaY = e.touches[0].clientY - this.previousMousePos.y;
        this.previousMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        this.orbitAngles.theta -= deltaX * 0.008;
        this.orbitAngles.phi = Math.max(-0.65, Math.min(0.65, this.orbitAngles.phi + deltaY * 0.008));
        this.updateCameraOrbit();
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (touchStartDist - dist) * 0.005;
        this.cameraDistance = Math.max(2.8, Math.min(5.8, this.cameraDistance + factor));
        touchStartDist = dist;
        this.updateCameraOrbit();
      }
    };

    const onTouchEnd = () => {
      this.isDragging = false;
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
  }

  updateCameraOrbit() {
    const r = this.cameraDistance;
    const theta = this.orbitAngles.theta;
    const phi = this.orbitAngles.phi;

    // Spherical coordinates
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(phi) + 0.35;
    const z = r * Math.cos(theta) * Math.cos(phi);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.targetLookAt);
  }

  /**
   * Snaps camera back to canonical viewing angles.
   * @param {'front'|'isometric'|'top'} preset
   */
  setCameraPreset(preset = 'front') {
    if (preset === 'front') {
      this.orbitAngles = { theta: 0, phi: 0 };
      this.cameraDistance = 4.2;
    } else if (preset === 'isometric') {
      this.orbitAngles = { theta: 0.55, phi: 0.25 };
      this.cameraDistance = 4.0;
    } else if (preset === 'top') {
      this.orbitAngles = { theta: 0, phi: 0.62 };
      this.cameraDistance = 3.8;
    }
    this.updateCameraOrbit();
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Sets the active sign and starts smooth interpolation into it.
   */
  setSign(signId, durationMs = 1800, isImmediate = false) {
    const poseDef = (window.ISL_3D_POSES && window.ISL_3D_POSES[signId]) 
      ? window.ISL_3D_POSES[signId] 
      : (window.ISL_3D_POSES ? window.ISL_3D_POSES['namaste'] : null);

    if (!poseDef) return;

    this.currentSignId = signId;
    this.activePoseDef = poseDef;
    this.animationDuration = durationMs;
    this.animationTime = 0;

    // Two-handed visibility handling
    if (poseDef.twoHanded) {
      this.leftHand.setVisible(true);
    } else {
      // For single-handed signs, smoothly lower left hand to resting posture
      this.leftHand.setVisible(false);
    }

    if (isImmediate) {
      this.applyPoseAtRatio(0.0);
    }
  }

  setSpeed(speedMultiplier) {
    this.playbackSpeed = speedMultiplier;
  }

  play() {
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
  }

  pause() {
    this.isPlaying = false;
  }

  seekToProgress(progress01) {
    const clamped = Math.max(0, Math.min(1, progress01));
    this.animationTime = clamped * this.animationDuration;
    this.applyPoseAtRatio(clamped);
  }

  /**
   * Evaluates keyframes and interpolates hand poses at given timeline ratio [0..1]
   */
  applyPoseAtRatio(ratio) {
    if (!this.activePoseDef) return;

    if (!this.activePoseDef.animated) {
      // Static pose
      if (this.activePoseDef.right) this.rightHand.setPose(this.activePoseDef.right);
      if (this.activePoseDef.twoHanded && this.activePoseDef.left) {
        this.leftHand.setPose(this.activePoseDef.left);
      }
      return;
    }

    // Keyframe Animation
    const kfs = this.activePoseDef.keyframes;
    if (!kfs || kfs.length === 0) return;

    // Find bounding keyframes
    let k1 = kfs[0];
    let k2 = kfs[kfs.length - 1];

    for (let i = 0; i < kfs.length - 1; i++) {
      if (ratio >= kfs[i].t && ratio <= kfs[i + 1].t) {
        k1 = kfs[i];
        k2 = kfs[i + 1];
        break;
      }
    }

    const span = k2.t - k1.t;
    const localT = span > 0 ? (ratio - k1.t) / span : 0;
    // Smooth cubic easing
    const easedT = localT * localT * (3 - 2 * localT);

    // Interpolate Right Hand
    if (k1.right && k2.right) {
      const blendedRight = this.interpolatePoses(k1.right, k2.right, easedT);
      this.rightHand.setPose(blendedRight);
    }

    // Interpolate Left Hand if active
    if (this.activePoseDef.twoHanded && k1.left && k2.left) {
      const blendedLeft = this.interpolatePoses(k1.left, k2.left, easedT);
      this.leftHand.setPose(blendedLeft);
    }
  }

  /**
   * Linearly interpolates all joint rotations and wrist positions between two poses.
   */
  interpolatePoses(p1, p2, t) {
    const result = {
      wrist: {
        pos: [
          THREE.MathUtils.lerp(p1.wrist.pos[0], p2.wrist.pos[0], t),
          THREE.MathUtils.lerp(p1.wrist.pos[1], p2.wrist.pos[1], t),
          THREE.MathUtils.lerp(p1.wrist.pos[2], p2.wrist.pos[2], t)
        ],
        rot: [
          THREE.MathUtils.lerp(p1.wrist.rot[0], p2.wrist.rot[0], t),
          THREE.MathUtils.lerp(p1.wrist.rot[1], p2.wrist.rot[1], t),
          THREE.MathUtils.lerp(p1.wrist.rot[2], p2.wrist.rot[2], t)
        ]
      },
      thumb: {
        mcp: [
          THREE.MathUtils.lerp(p1.thumb.mcp[0], p2.thumb.mcp[0], t),
          THREE.MathUtils.lerp(p1.thumb.mcp[1] || 0, p2.thumb.mcp[1] || 0, t),
          THREE.MathUtils.lerp(p1.thumb.mcp[2] || 0, p2.thumb.mcp[2] || 0, t)
        ],
        ip: THREE.MathUtils.lerp(p1.thumb.ip || 0, p2.thumb.ip || 0, t)
      }
    };

    const fingers = ['index', 'middle', 'ring', 'pinky'];
    fingers.forEach(f => {
      const f1 = p1[f] || {};
      const f2 = p2[f] || {};
      result[f] = {
        mcp: THREE.MathUtils.lerp(f1.mcp || 0, f2.mcp || 0, t),
        pip: THREE.MathUtils.lerp(f1.pip || 0, f2.pip || 0, t),
        dip: THREE.MathUtils.lerp(f1.dip || 0, f2.dip || 0, t),
        spread: THREE.MathUtils.lerp(f1.spread || 0, f2.spread || 0, t)
      };
    });

    return result;
  }

  /**
   * Master RequestAnimationFrame Loop
   */
  renderLoop() {
    this.rafId = requestAnimationFrame(() => this.renderLoop());

    const now = performance.now();
    const delta = (now - this.lastFrameTime);
    this.lastFrameTime = now;

    // Advance animation time if playing
    if (this.isPlaying && this.activePoseDef) {
      this.animationTime += delta * this.playbackSpeed;
      const effectiveDuration = this.animationDuration;

      let ratio = this.animationTime / effectiveDuration;
      if (ratio > 1.0) {
        ratio = 1.0;
      }
      this.applyPoseAtRatio(ratio);
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

window.Hand3DRenderer = Hand3DRenderer;
