import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSeason } from '../context/SeasonContext';

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    group: THREE.Group;
    particles: THREE.Points;
    animId: number;
    mouse: { x: number; y: number };
    targetRot: { x: number; y: number };
    currentRot: { x: number; y: number };
    isBeach: boolean;
    morphProgress: number;
    targetMorph: number;
    cityMesh: THREE.Group;
    beachMesh: THREE.Group;
    steam: THREE.Points;
    bubbles: THREE.Points;
    clock: THREE.Clock;
  } | null>(null);

  const { isBeach } = useSeason();
  const isBeachRef = useRef(isBeach);

  useEffect(() => {
    isBeachRef.current = isBeach;
    if (sceneRef.current) {
      sceneRef.current.isBeach = isBeach;
      sceneRef.current.targetMorph = isBeach ? 1 : 0;
    }
  }, [isBeach]);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;
    const W = mount.clientWidth;
    const H = mount.clientHeight;
    const isMobile = window.matchMedia('(pointer: coarse), (max-width: 768px)').matches;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.5);
    keyLight.position.set(3, 5, 5);
    keyLight.castShadow = !isMobile;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00a896, 1.2);
    rimLight.position.set(-4, 2, -2);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xd4af37, 1.5, 10);
    fillLight.position.set(2, -2, 3);
    scene.add(fillLight);

    // --- CITY GROUP: Espresso Cup ---
    const cityGroup = new THREE.Group();

    // Saucer
    const saucerGeo = new THREE.CylinderGeometry(0.85, 0.7, 0.08, 48);
    const ceramicMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f0e8,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const saucer = new THREE.Mesh(saucerGeo, ceramicMat);
    saucer.position.y = -0.8;
    saucer.castShadow = true;
    cityGroup.add(saucer);

    // Saucer rim detail
    const saucerRimGeo = new THREE.TorusGeometry(0.78, 0.04, 8, 48);
    const goldMat = new THREE.MeshPhysicalMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.1 });
    const saucerRim = new THREE.Mesh(saucerRimGeo, goldMat);
    saucerRim.rotation.x = Math.PI / 2;
    saucerRim.position.y = -0.76;
    cityGroup.add(saucerRim);

    // Cup body – tapered cylinder
    const cupGeo = new THREE.CylinderGeometry(0.45, 0.3, 0.7, 48);
    const cup = new THREE.Mesh(cupGeo, ceramicMat);
    cup.position.y = -0.41;
    cup.castShadow = true;
    cityGroup.add(cup);

    // Cup gold rim
    const cupRimGeo = new THREE.TorusGeometry(0.45, 0.025, 8, 48);
    const cupRim = new THREE.Mesh(cupRimGeo, goldMat);
    cupRim.rotation.x = Math.PI / 2;
    cupRim.position.y = -0.06;
    cityGroup.add(cupRim);

    // Espresso surface
    const espressoGeo = new THREE.CircleGeometry(0.43, 48);
    const espressoMat = new THREE.MeshPhysicalMaterial({
      color: 0x3d1a00,
      roughness: 0.3,
      metalness: 0.1,
    });
    const espresso = new THREE.Mesh(espressoGeo, espressoMat);
    espresso.rotation.x = -Math.PI / 2;
    espresso.position.y = -0.07;
    cityGroup.add(espresso);

    // Crema swirl
    const cremaGeo = new THREE.TorusGeometry(0.2, 0.08, 8, 32);
    const cremaMat = new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 });
    const crema = new THREE.Mesh(cremaGeo, cremaMat);
    crema.rotation.x = -Math.PI / 2;
    crema.position.y = -0.06;
    cityGroup.add(crema);

    // Cup handle
    const handleCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0.45, -0.25, 0),
      new THREE.Vector3(0.85, -0.25, 0),
      new THREE.Vector3(0.45, -0.58, 0)
    );
    const handleGeo = new THREE.TubeGeometry(handleCurve, 20, 0.045, 8, false);
    const handle = new THREE.Mesh(handleGeo, ceramicMat);
    cityGroup.add(handle);

    // Steam particles
    const steamCount = 120;
    const steamPositions = new Float32Array(steamCount * 3);
    const steamVelocities = new Float32Array(steamCount);
    for (let i = 0; i < steamCount; i++) {
      steamPositions[i * 3] = (Math.random() - 0.5) * 0.3;
      steamPositions[i * 3 + 1] = Math.random() * 1.5;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
      steamVelocities[i] = 0.005 + Math.random() * 0.01;
    }
    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    const steamMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.35, sizeAttenuation: true });
    const steam = new THREE.Points(steamGeo, steamMat);
    steam.position.y = -0.05;
    cityGroup.add(steam);

    // --- BEACH GROUP: Cocktail Glass ---
    const beachGroup = new THREE.Group();

    // Glass stem
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 16);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0,
      metalness: 0,
      transmission: 0.95,
      transparent: true,
      opacity: 0.3,
      ior: 1.5,
      thickness: 0.5,
    });
    const stem = new THREE.Mesh(stemGeo, glassMat);
    stem.position.y = -0.6;
    beachGroup.add(stem);

    // Glass base
    const baseGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.07, 32);
    const base = new THREE.Mesh(baseGeo, glassMat);
    base.position.y = -1.02;
    beachGroup.add(base);

    // Martini bowl shape (cone)
    const bowlGeo = new THREE.CylinderGeometry(0.75, 0.05, 0.85, 48, 1, true);
    const bowlMat = new THREE.MeshPhysicalMaterial({
      color: 0xb3f0ff,
      roughness: 0,
      metalness: 0,
      transmission: 0.9,
      transparent: true,
      opacity: 0.25,
      ior: 1.5,
      thickness: 0.3,
      side: THREE.DoubleSide,
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.y = -0.075;
    beachGroup.add(bowl);

    // Cocktail liquid
    const liquidGeo = new THREE.CylinderGeometry(0.68, 0.07, 0.65, 48);
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: 0xff6b6b,
      roughness: 0.1,
      metalness: 0,
      transparent: true,
      opacity: 0.75,
    });
    const liquid = new THREE.Mesh(liquidGeo, liquidMat);
    liquid.position.y = -0.2;
    beachGroup.add(liquid);

    // Lime wedge
    const limeGeo = new THREE.SphereGeometry(0.2, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const limeMat = new THREE.MeshPhysicalMaterial({ color: 0x5cb85c, roughness: 0.5, metalness: 0 });
    const lime = new THREE.Mesh(limeGeo, limeMat);
    lime.position.set(0.65, 0.05, 0);
    lime.rotation.z = -0.5;
    beachGroup.add(lime);

    // Straw
    const strawCurve = new THREE.LineCurve3(new THREE.Vector3(0.2, -0.3, 0.1), new THREE.Vector3(0.4, 0.7, 0.1));
    const strawGeo = new THREE.TubeGeometry(strawCurve, 8, 0.025, 8, false);
    const strawMat = new THREE.MeshStandardMaterial({ color: 0xff4e50 });
    const straw = new THREE.Mesh(strawGeo, strawMat);
    beachGroup.add(straw);

    // Cocktail umbrella
    const umbrellaGeo = new THREE.ConeGeometry(0.25, 0.12, 8, 1, true);
    const umbrellaMat = new THREE.MeshStandardMaterial({ color: 0xffd700, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const umbrella = new THREE.Mesh(umbrellaGeo, umbrellaMat);
    umbrella.position.set(0.35, 0.55, 0.1);
    umbrella.rotation.z = 0.3;
    beachGroup.add(umbrella);

    // Bubble particles for cocktail
    const bubbleCount = 80;
    const bubblePositions = new Float32Array(bubbleCount * 3);
    for (let i = 0; i < bubbleCount; i++) {
      const r = Math.random() * 0.55;
      const angle = Math.random() * Math.PI * 2;
      bubblePositions[i * 3] = Math.cos(angle) * r;
      bubblePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.5 - 0.2;
      bubblePositions[i * 3 + 2] = Math.sin(angle) * r;
    }
    const bubbleGeo = new THREE.BufferGeometry();
    bubbleGeo.setAttribute('position', new THREE.BufferAttribute(bubblePositions, 3));
    const bubbleMat = new THREE.PointsMaterial({ color: 0x80ffff, size: 0.035, transparent: true, opacity: 0.6, sizeAttenuation: true });
    const bubbles = new THREE.Points(bubbleGeo, bubbleMat);
    beachGroup.add(bubbles);

    // Main group
    const group = new THREE.Group();
    group.add(cityGroup);
    group.add(beachGroup);
    scene.add(group);

    beachGroup.position.y = -8; // hidden initially (unless beach mode)

    // Background particles
    const bgCount = 200;
    const bgPositions = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      bgPositions[i * 3] = (Math.random() - 0.5) * 14;
      bgPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      bgPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    const bgMat = new THREE.PointsMaterial({ color: 0xd4af37, size: 0.05, transparent: true, opacity: 0.5, sizeAttenuation: true });
    const particles = new THREE.Points(bgGeo, bgMat);
    scene.add(particles);

    const mouse = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const currentRot = { x: 0, y: 0 };
    const clock = new THREE.Clock();

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let morphProgress = isBeachRef.current ? 1 : 0;
    let targetMorph = morphProgress;

    const state = {
      renderer, scene, camera, group, particles, animId: 0,
      mouse, targetRot, currentRot,
      isBeach: isBeachRef.current,
      morphProgress, targetMorph,
      cityMesh: cityGroup, beachMesh: beachGroup,
      steam, bubbles, clock,
    };
    sceneRef.current = state;

    // Set initial state
    if (isBeachRef.current) {
      cityGroup.position.y = 8;
      beachGroup.position.y = 0;
    }

    // Animation loop
    function animate() {
      state.animId = requestAnimationFrame(animate);
      clock.getDelta();
      const elapsed = clock.elapsedTime;

      // Lerp morph
      state.morphProgress = lerp(state.morphProgress, state.targetMorph, 0.04);

      const mp = state.morphProgress;
      cityGroup.position.y = lerp(0, 8, mp);
      cityGroup.scale.setScalar(lerp(1, 0.3, mp));
      (cityGroup.children[0] as THREE.Mesh).material && 
        ((cityGroup as any).traverse((c: any) => {
          if (c.material && c.material.opacity !== undefined) {
            // handled via opacity
          }
        }));

      beachGroup.position.y = lerp(-8, 0, mp);
      beachGroup.scale.setScalar(lerp(0.3, 1, mp));

      // Smooth mouse tracking
      targetRot.x = mouse.y * 0.3;
      targetRot.y = mouse.x * 0.4;
      currentRot.x = lerp(currentRot.x, targetRot.x, 0.06);
      currentRot.y = lerp(currentRot.y, targetRot.y, 0.06);

      group.rotation.x = currentRot.x;
      group.rotation.y = currentRot.y + elapsed * 0.15;

      // Floating animation
      group.position.y = Math.sin(elapsed * 0.8) * 0.08;

      // Steam animation
      const steamPositions = steam.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < steamCount; i++) {
        steamPositions[i * 3 + 1] += steamVelocities[i];
        steamPositions[i * 3] += Math.sin(elapsed + i) * 0.002;
        if (steamPositions[i * 3 + 1] > 1.5) {
          steamPositions[i * 3 + 1] = 0;
          steamPositions[i * 3] = (Math.random() - 0.5) * 0.3;
        }
      }
      steam.geometry.attributes.position.needsUpdate = true;
      (steam.material as THREE.PointsMaterial).opacity = (1 - mp) * 0.35;

      // Bubble animation
      const bubblePos = bubbles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < bubbleCount; i++) {
        bubblePos[i * 3 + 1] += 0.006;
        if (bubblePos[i * 3 + 1] > 0.3) {
          bubblePos[i * 3 + 1] = -0.45;
        }
      }
      bubbles.geometry.attributes.position.needsUpdate = true;
      (bubbles.material as THREE.PointsMaterial).opacity = mp * 0.6;

      // Particles
      particles.rotation.y = elapsed * 0.02;
      (particles.material as THREE.PointsMaterial).color.setStyle(
        state.isBeach ? '#00a896' : '#d4af37'
      );

      // Update lights
      rimLight.color.setStyle(state.isBeach ? '#00a896' : '#4a2500');
      fillLight.color.setStyle(state.isBeach ? '#ff4e50' : '#d4af37');

      renderer.render(scene, camera);
    }
    animate();

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(state.animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{ cursor: 'none' }}
    />
  );
}
