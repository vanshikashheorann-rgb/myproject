/**
 * SIGNIFY - 3D Futuristic Cyber-Mesh & Holographic Particle Background
 * Powered by Three.js with graceful HTML5 Canvas fallback for offline resilience.
 */

(function () {
  const container = document.getElementById('three-bg-canvas-container');
  if (!container) return;

  // Check if Three.js is loaded
  if (typeof THREE !== 'undefined') {
    initThreeJS();
  } else {
    initCanvasFallback();
  }

  function initThreeJS() {
    let scene, camera, renderer, particles, particleGeo, particleMat;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080c18, 0.0012);

    camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;

    // Particle Cloud Geometry
    const particleCount = Math.min(1200, Math.floor(window.innerWidth * 0.8));
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(0x38bdf8); // Sky blue
    const color2 = new THREE.Color(0x818cf8); // Indigo
    const color3 = new THREE.Color(0xa855f7); // Purple

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 2200;
      positions[i + 1] = (Math.random() - 0.5) * 1600;
      positions[i + 2] = (Math.random() - 0.5) * 1800;

      // Subtle cybernetic color gradient
      const mixedColor = color1.clone().lerp(color2, Math.random()).lerp(color3, Math.random() * 0.4);
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material with soft circular blur
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(56,189,248,0.7)');
    grad.addColorStop(1, 'rgba(15,23,42,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 16,
      map: texture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0.65
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Interactive Floating Plane Grid
    const gridHelper = new THREE.GridHelper(2400, 32, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -600;
    scene.add(gridHelper);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '0';
    container.appendChild(renderer.domElement);

    // Mouse parallax listener
    document.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
    window.addEventListener('resize', onWindowResize, { passive: true });

    function onDocumentMouseMove(event) {
      mouseX = (event.clientX - windowHalfX) * 0.15;
      mouseY = (event.clientY - windowHalfY) * 0.15;
    }

    function onWindowResize() {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Fluid orbital drift
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05;

      camera.position.x += (mouseX - camera.position.x) * 0.03;
      camera.position.y += (-mouseY - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    animate();
  }

  function initCanvasFallback() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      dots = [];
      const count = Math.min(80, Math.floor(width / 20));
      for (let i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1
        });
      }
    }

    window.addEventListener('resize', resize);
    resize();

    function loop() {
      ctx.clearRect(0, 0, width, height);

      // Connect near dots
      for (let i = 0; i < dots.length; i++) {
        const d1 = dots[i];
        d1.x += d1.vx;
        d1.y += d1.vy;
        if (d1.x < 0) d1.x = width;
        if (d1.x > width) d1.x = 0;
        if (d1.y < 0) d1.y = height;
        if (d1.y > height) d1.y = 0;

        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.beginPath();
        ctx.arc(d1.x, d1.y, d1.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < dots.length; j++) {
          const d2 = dots[j];
          const dist = Math.hypot(d1.x - d2.x, d1.y - d2.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 120) * 0.2})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(loop);
    }

    loop();
  }
})();
