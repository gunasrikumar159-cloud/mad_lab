/* ==========================================================================
   GUNASRI A - 3D THREE.JS EXPERIENCE
   Hero Workstation Scene, Contact Earth Globe, and Starfield Background Canvas
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. STARFIELD BACKGROUND ENGINE ---
  function initStarsCanvas() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = [];
    const starCount = Math.min(Math.floor((width * height) / 3000), 300);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005,
        color: Math.random() > 0.3 ? '#915eff' : '#ffffff'
      });
    }

    function animateStars() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, star.alpha));
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    animateStars();
  }

  // --- 2. HERO 3D WORKSTATION CANVAS (THREE.JS) ---
  function initHeroCanvas() {
    const container = document.getElementById('hero-canvas-container');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x915eff, 2.5);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00aea9, 3, 20);
    pointLight.position.set(-4, 3, 2);
    scene.add(pointLight);

    // Create 3D Workstation Group
    const workstation = new THREE.Group();

    // Laptop Base
    const baseGeo = new THREE.BoxGeometry(3.6, 0.15, 2.4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1d1836, roughness: 0.3, metalness: 0.8 });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -0.075;
    workstation.add(baseMesh);

    // Screen Lid
    const screenGroup = new THREE.Group();
    const screenGeo = new THREE.BoxGeometry(3.6, 2.2, 0.1);
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0f0c20, roughness: 0.2, metalness: 0.9 });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 1.1, -1.15);
    screenGroup.add(screenMesh);

    // Glowing Code Screen Display
    const displayGeo = new THREE.PlaneGeometry(3.4, 2.0);
    const canvasTexture = createCodeScreenTexture();
    const displayMat = new THREE.MeshBasicMaterial({ map: canvasTexture });
    const displayMesh = new THREE.Mesh(displayGeo, displayMat);
    displayMesh.position.set(0, 1.1, -1.09);
    screenGroup.add(displayMesh);

    workstation.add(screenGroup);

    // Floating 3D Tech Elements around Laptop
    const floatingGroup = new THREE.Group();
    const techGeometries = [
      new THREE.IcosahedronGeometry(0.4, 0),
      new THREE.TorusGeometry(0.35, 0.12, 16, 100),
      new THREE.OctahedronGeometry(0.4),
      new THREE.DodecahedronGeometry(0.38)
    ];

    const techMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x915eff, roughness: 0.1, metalness: 0.7, wireframe: true }),
      new THREE.MeshStandardMaterial({ color: 0x00aea9, roughness: 0.2, metalness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0xff4f8b, roughness: 0.1, metalness: 0.5 }),
      new THREE.MeshStandardMaterial({ color: 0xffc107, roughness: 0.2, metalness: 0.7, wireframe: true })
    ];

    const floatingObjects = [];
    const positions = [
      { x: -3.2, y: 1.5, z: 0 },
      { x: 3.2, y: 1.8, z: 0.5 },
      { x: -2.5, y: -0.5, z: 1.5 },
      { x: 2.8, y: -0.2, z: 1.2 }
    ];

    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(techGeometries[i], techMaterials[i]);
      mesh.position.set(positions[i].x, positions[i].y, positions[i].z);
      floatingGroup.add(mesh);
      floatingObjects.push({
        mesh: mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        floatOffsetY: Math.random() * Math.PI * 2
      });
    }

    workstation.add(floatingGroup);
    workstation.position.y = -0.5;
    scene.add(workstation);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        mouseX = (e.clientX - rect.left - width / 2) * 0.0015;
        mouseY = (e.clientY - rect.top - height / 2) * 0.0015;
      }
    });

    let clock = new THREE.Clock();

    function animateHero() {
      requestAnimationFrame(animateHero);

      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      workstation.rotation.y = Math.sin(elapsedTime * 0.5) * 0.15 + targetX;
      workstation.rotation.x = Math.cos(elapsedTime * 0.5) * 0.05 + targetY * 0.5;

      // Animate floating objects
      floatingObjects.forEach((obj, idx) => {
        obj.mesh.rotation.x += obj.rotSpeedX;
        obj.mesh.rotation.y += obj.rotSpeedY;
        obj.mesh.position.y = positions[idx].y + Math.sin(elapsedTime * 1.5 + obj.floatOffsetY) * 0.15;
      });

      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    animateHero();
  }

  // Dynamic Texture Generator for the Laptop Screen
  function createCodeScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a071b';
    ctx.fillRect(0, 0, 512, 300);

    // Code lines styling
    ctx.fillStyle = '#915eff';
    ctx.font = '14px monospace';
    ctx.fillText('const developer = {', 20, 35);
    ctx.fillStyle = '#dfd9ff';
    ctx.fillText('  name: "GUNASRI A",', 20, 60);
    ctx.fillText('  role: "Computer Science Engineering Student",', 20, 85);
    ctx.fillText('  skills: ["Python", "Java", "React", "MySQL"],', 20, 110);
    ctx.fillText('  status: "Ready for Software Engineering Roles"', 20, 135);
    ctx.fillStyle = '#915eff';
    ctx.fillText('};', 20, 160);

    ctx.fillStyle = '#00aea9';
    ctx.fillText('// Building practical & responsive solutions', 20, 200);
    ctx.fillStyle = '#4ade80';
    ctx.fillText('> npm run dev --build success', 20, 230);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  // --- 3. CONTACT 3D EARTH GLOBE CANVAS (THREE.JS) ---
  function initEarthCanvas() {
    const container = document.getElementById('earth-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe
    const globeGeo = new THREE.SphereGeometry(2.2, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x151030,
      roughness: 0.4,
      metalness: 0.6,
      wireframe: true
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globeMesh);

    // Inner Glowing Core
    const coreGeo = new THREE.SphereGeometry(1.9, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x915eff,
      transparent: true,
      opacity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Orbit Ring
    const ringGeo = new THREE.RingGeometry(2.8, 2.9, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00aea9, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x915eff, 3);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    function animateEarth() {
      requestAnimationFrame(animateEarth);

      globeMesh.rotation.y += 0.005;
      ringMesh.rotation.z += 0.002;

      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    animateEarth();
  }

  // DOM Content Loaded Handler
  document.addEventListener('DOMContentLoaded', () => {
    initStarsCanvas();
    initHeroCanvas();
    initEarthCanvas();
  });
})();

