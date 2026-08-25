import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLanguage } from '../../context/LanguageContext';
import { RotateCw, Loader2, Laptop } from 'lucide-react';

interface CIIS3DLaptopMascotProps {
  className?: string;
  modelPath?: string;
}

/**
 * Draws the Official Circular Magenta & White CIIS Emblem matching user logo
 */
function drawOfficialCIISEmblem(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number
) {
  ctx.save();

  // Outer Vibrant Pink Ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#e11d48';
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Inner Filled Core
  const innerR = radius * 0.90;
  const innerGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, innerR);
  innerGrad.addColorStop(0, '#f43f5e');
  innerGrad.addColorStop(0.6, '#e11d48');
  innerGrad.addColorStop(1, '#be123c');
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = innerGrad;
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Arched Top Text: "សាលារៀន"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Kantumruy Pro", "Bayon", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('សាលារៀន', cx, cy - innerR * 0.46);

  // Center Stylized CIIS Ribbon Graphic
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 2, radius * 0.44, radius * 0.24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Bottom Text: "CIIS"
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "Inter", "Impact", sans-serif';
  ctx.letterSpacing = '1.5px';
  ctx.fillText('CIIS', cx, cy + innerR * 0.55);

  ctx.restore();
}

/**
 * Creates soft ground contact shadow texture for 3D realism & physical volume
 */
function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 20, 256, 256, 240);
    grad.addColorStop(0, 'rgba(15, 23, 42, 0.45)');
    grad.addColorStop(0.35, 'rgba(15, 23, 42, 0.25)');
    grad.addColorStop(0.7, 'rgba(15, 23, 42, 0.08)');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(256, 256, 230, 140, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Creates texture for the circular lid logo on the back of the laptop
 */
function createLidLogoCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.clearRect(0, 0, 256, 256);
  drawOfficialCIISEmblem(ctx, 128, 128, 118);
  return canvas;
}

/**
 * High-definition Canvas Texture Generator for CIIS Laptop Screen
 */
function createLaptopScreenCanvas(
  isKhmer: boolean,
  animTick: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 576;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Deep Studio Space-Gray / Charcoal Metallic Background
  const bgGrad = ctx.createRadialGradient(512, 288, 60, 512, 288, 620);
  bgGrad.addColorStop(0, '#1c222e');
  bgGrad.addColorStop(0.5, '#0d1118');
  bgGrad.addColorStop(1, '#040609');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 576);

  // Subtle ambient glow behind center banner
  const glowGrad = ctx.createRadialGradient(512, 260, 40, 512, 260, 360);
  glowGrad.addColorStop(0, 'rgba(2, 132, 199, 0.16)');
  glowGrad.addColorStop(0.5, 'rgba(225, 29, 72, 0.12)');
  glowGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(512, 260, 360, 0, Math.PI * 2);
  ctx.fill();

  // Top Global OS Header Bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, 0, 1024, 44);
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 44);
  ctx.lineTo(1024, 44);
  ctx.stroke();

  // OS Window Controls
  const drawCircle = (x: number, y: number, r: number, color: string) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  };
  drawCircle(24, 22, 5.5, '#f43f5e');
  drawCircle(44, 22, 5.5, '#fbbf24');
  drawCircle(64, 22, 5.5, '#10b981');

  // School Brand Text in Top Header
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('CIIS OS 2.6 • COMMUNITY INTERNAL INSPIRATION SCHOOL', 86, 28);

  // Live Clock & Telemetry Status in Header Right
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  ctx.textAlign = 'right';
  ctx.font = 'bold 13px "Roboto Mono", monospace';
  ctx.fillStyle = '#38bdf8';
  ctx.fillText(`40/40 ONLINE  |  ${timeStr}`, 996, 28);

  // Glass Banner Container Backdrop
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(70, 105, 884, 290, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 1. Left: Circular Magenta CIIS Emblem
  const emblemCx = 190;
  const emblemCy = 250;
  const emblemRadius = 72;
  drawOfficialCIISEmblem(ctx, emblemCx, emblemCy, emblemRadius);

  // 2. Right Top: Vibrant Sky-Blue Khmer Script Title
  ctx.textAlign = 'left';
  ctx.fillStyle = '#00a2e8';
  ctx.font = 'bold 44px "Bayon", "Khmer OS Muol", "Kantumruy Pro", sans-serif';
  ctx.shadowColor = 'rgba(0, 162, 232, 0.45)';
  ctx.shadowBlur = 10;
  ctx.fillText('សាលារៀនស៊ី អាយ អាយ អេស', 290, 225);
  ctx.shadowBlur = 0;

  // 3. Right Bottom: Bold Magenta/Pink English Sub-Text
  ctx.fillStyle = '#e11d48';
  ctx.font = '900 24px "Impact", "Arial Black", "Inter", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.shadowColor = 'rgba(225, 29, 72, 0.45)';
  ctx.shadowBlur = 10;
  ctx.fillText('COMMUNITY INTERNAL INSPIRATION SCHOOL', 290, 285);
  ctx.shadowBlur = 0;

  // 4. Bottom Feature Badges
  const badgeY = 430;
  const badges = [
    { text: '💻 40+ Workstations', color: '#38bdf8' },
    { text: '⌨️ Touch Typing Lab', color: '#f43f5e' },
    { text: '📊 Microsoft Excel & Office', color: '#10b981' },
    { text: '🎓 Official Portal v2.6', color: '#a855f7' }
  ];

  let startBx = 512 - (badges.length * 190) / 2;
  badges.forEach((b) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    ctx.roundRect(startBx, badgeY, 178, 38, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.stroke();

    ctx.fillStyle = b.color;
    ctx.font = 'bold 12.5px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(b.text, startBx + 89, badgeY + 24);
    startBx += 190;
  });

  // 5. Bottom Audio Waveform Animation
  const waveY = 525;
  for (let w = 0; w < 48; w++) {
    const wh = 6 + Math.abs(Math.sin(animTick * 0.08 + w * 0.22)) * 22;
    const wx = 180 + w * 14;
    ctx.fillStyle = w % 2 === 0 ? '#e11d48' : '#00a2e8';
    ctx.beginPath();
    ctx.roundRect(wx, waveY - wh / 2, 8, wh, 3);
    ctx.fill();
  }

  return canvas;
}

export const CIIS3DLaptopMascot: React.FC<CIIS3DLaptopMascotProps> = ({
  className = '',
  modelPath = '/models/futuristic_laptop_v2.glb'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isKhmer } = useLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';
    setIsLoading(true);
    setLoadError(null);

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    // 1. Three.js Scene
    const scene = new THREE.Scene();

    // 2. Camera Setup: Tuned for complete, unclipped framing with comfortable margins
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 14.5);

    // 3. WebGL Renderer with Alpha Transparency
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. OrbitControls (Smooth 360 rotation, NO ZOOM, NO AUTO SPIN)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.target.set(0, 0, 0);

    // 5. Studio Lighting Rig Tailored for Metallic Space-Gray Chassis & Backlit Keyboard
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(8, 14, 10);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const pinkRimLight = new THREE.DirectionalLight(0xbe185d, 4.5);
    pinkRimLight.position.set(-8, 6, -6);
    scene.add(pinkRimLight);

    const cyanFillLight = new THREE.DirectionalLight(0x38bdf8, 3.0);
    cyanFillLight.position.set(8, 4, 4);
    scene.add(cyanFillLight);

    const bottomBounceLight = new THREE.DirectionalLight(0xffffff, 1.8);
    bottomBounceLight.position.set(0, -6, 6);
    scene.add(bottomBounceLight);

    const screenPointLight = new THREE.PointLight(0xe11d48, 3.5, 12.0);
    screenPointLight.position.set(0, 3.2, 1.5);
    scene.add(screenPointLight);

    // 6. Ground Contact Shadow for 3D Volume & Realism
    const shadowGeo = new THREE.PlaneGeometry(16, 12);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0, -1.8, 0);
    scene.add(contactShadow);

    // Dynamic Screen Texture State
    let dynamicTexture: THREE.CanvasTexture | null = null;
    let screenMaterial: THREE.MeshBasicMaterial | null = null;
    let loadedLaptop: THREE.Group | null = null;

    // 7. GLTF Loader Pipeline for futuristic_laptop_v2.glb
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf) => {
        setIsLoading(false);

        const laptop = gltf.scene;

        // Position slightly lowered (-0.45) and Scale tuned to 0.38 for zero clipping
        laptop.position.set(0, -0.45, 0);
        laptop.scale.setScalar(0.38);

        // Rotation: orient base flat and face screen towards user with isometric perspective
        laptop.rotation.set(-Math.PI / 2 + 0.12, -0.28, 0);

        loadedLaptop = laptop;

        // Create Dynamic Screen Canvas Texture
        const initialCanvas = createLaptopScreenCanvas(isKhmer, 0);
        dynamicTexture = new THREE.CanvasTexture(initialCanvas);
        dynamicTexture.colorSpace = THREE.SRGBColorSpace;
        dynamicTexture.generateMipmaps = false;
        dynamicTexture.minFilter = THREE.LinearFilter;
        dynamicTexture.magFilter = THREE.LinearFilter;
        dynamicTexture.needsUpdate = true;

        screenMaterial = new THREE.MeshBasicMaterial({
          map: dynamicTexture,
          side: THREE.DoubleSide,
          toneMapped: false
        });

        // Lid Rose-Gold Logo Texture for Outer Lid Badge
        const lidCanvas = createLidLogoCanvas();
        const lidTexture = new THREE.CanvasTexture(lidCanvas);
        lidTexture.colorSpace = THREE.SRGBColorSpace;
        const lidBadgeMat = new THREE.MeshStandardMaterial({
          map: lidTexture,
          metalness: 0.85,
          roughness: 0.18,
          emissive: new THREE.Color(0xf43f5e),
          emissiveIntensity: 0.4
        });

        laptop.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const nameLower = (mesh.name || '').toLowerCase();
            const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
            const matName = (mat?.name || '').toLowerCase();

            if (nameLower.includes('logo') || mesh.name === 'Logo') {
              mesh.material = lidBadgeMat;
            }
            else if (
              (nameLower.includes('screen') ||
              mesh.name === 'Screen' ||
              matName.includes('screen')) &&
              screenMaterial
            ) {
              if (mesh.geometry && mesh.geometry.attributes.position) {
                const pos = mesh.geometry.attributes.position;
                const count = pos.count;
                const uvs = new Float32Array(count * 2);
                for (let i = 0; i < count; i++) {
                  const px = pos.getX(i);
                  const pz = pos.getZ(i);
                  const u = (px + 6.275) / 12.55;
                  const v = (pz + 3.525) / 7.05;
                  uvs[i * 2] = u;
                  uvs[i * 2 + 1] = v;
                }
                mesh.geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
                mesh.geometry.attributes.uv.needsUpdate = true;
              }
              mesh.material = screenMaterial;
            } else if (mat) {
              const stdMat = mat as THREE.MeshStandardMaterial;
              if (matName.includes('aluminum') || matName.includes('space black') || matName.includes('body') || matName.includes('chassis')) {
                stdMat.roughness = 0.28;
                stdMat.metalness = 0.82;
                stdMat.color = new THREE.Color(0x4a5260);
              }
              else if (matName.includes('trackpad')) {
                stdMat.roughness = 0.22;
                stdMat.metalness = 0.65;
                stdMat.color = new THREE.Color(0x566072);
              }
              else if (matName.includes('accent') || matName.includes('cyan') || matName.includes('blue')) {
                stdMat.color = new THREE.Color(0xe11d48);
                stdMat.emissive = new THREE.Color(0xe11d48);
                stdMat.emissiveIntensity = 2.5;
              }
              else if (matName.includes('key')) {
                stdMat.color = new THREE.Color(0x20242c);
                stdMat.roughness = 0.38;
                stdMat.metalness = 0.35;
              }
              else {
                stdMat.color = new THREE.Color(0x424854);
                stdMat.roughness = 0.30;
                stdMat.metalness = 0.75;
              }
            }
          }
        });

        // Dedicated High-Definition Front-Facing Screen Display Plane
        const screenPlaneGeo = new THREE.PlaneGeometry(12.45, 6.95);
        const screenOverlayMesh = new THREE.Mesh(screenPlaneGeo, screenMaterial);
        screenOverlayMesh.position.set(0, 3.46, 5.1);
        screenOverlayMesh.rotation.set(Math.PI / 2, 0, 0); // Faces user/trackpad forwards
        laptop.add(screenOverlayMesh);

        // Matching Circular Metallic Rose-Gold Badge on Outer Lid Back
        const lidDiscGeo = new THREE.CircleGeometry(1.35, 32);
        const lidDiscMesh = new THREE.Mesh(lidDiscGeo, lidBadgeMat);
        lidDiscMesh.position.set(0, 4.02, 5.1);
        lidDiscMesh.rotation.set(-Math.PI / 2, 0, 0);
        laptop.add(lidDiscMesh);

        scene.add(laptop);
      },
      undefined,
      (error) => {
        console.error('[CIIS LAPTOP V2] GLB LOAD FAILED:', error);
        setIsLoading(false);
        setLoadError(
          isKhmer
            ? 'មិនអាចទាញយកឯកសារ futuristic_laptop_v2.glb បានទេ។'
            : 'Could not load futuristic_laptop_v2.glb model.'
        );
      }
    );

    // 8. 60 FPS Animation & Dynamic Screen Refresh Loop
    let animationFrameId: number;
    let animTick = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      animTick++;

      controls.update();

      // Gentle floating levitation animation
      if (loadedLaptop) {
        loadedLaptop.position.y = -0.45 + Math.sin(elapsed * 1.8) * 0.08;
      }

      // Refresh dynamic screen canvas texture every ~2 frames for smooth live stats
      if (animTick % 3 === 0 && dynamicTexture) {
        const updatedCanvas = createLaptopScreenCanvas(isKhmer, animTick);
        dynamicTexture.image = updatedCanvas;
        dynamicTexture.needsUpdate = true;
      }

      screenPointLight.intensity = 2.8 + Math.sin(elapsed * 3.0) * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 340;
      const newH = container.clientHeight || 340;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [modelPath, isKhmer]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none w-full max-w-full bg-transparent overflow-visible ${className}`}>
      
      {/* Floating 360° Drag & 3D Laptop Badges */}
      <div className="absolute top-0 right-2 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-950/80 text-white backdrop-blur-md border border-zinc-800 text-[10.5px] font-mono font-bold shadow-md pointer-events-none">
        <RotateCw className="w-2.5 h-2.5 text-pink-400 animate-spin-slow" />
        <span>360° DRAG</span>
      </div>

      <div className="absolute top-0 left-2 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full backdrop-blur-md text-[10.5px] font-mono font-bold shadow-md bg-pink-950/85 text-pink-200 border border-pink-700/50 pointer-events-none">
        <Laptop className="w-3 h-3 text-pink-400" />
        <span>3D LAPTOP</span>
      </div>

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-transparent space-y-2 pointer-events-none">
          <Loader2 className="w-6 h-6 text-pink-700 animate-spin" />
          <span className="text-[11px] font-mono text-zinc-700 font-bold bg-white/80 px-2 py-0.5 rounded-md shadow-xs">
            {isKhmer ? 'កំពុងទាញយក 3D...' : 'Loading 3D Laptop...'}
          </span>
        </div>
      )}

      {/* Error Notice */}
      {loadError && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-950/90 p-4 rounded-3xl text-center space-y-2">
          <p className="text-xs text-rose-300 font-bold">{loadError}</p>
        </div>
      )}

      {/* Pure Transparent WebGL 3D Canvas Container */}
      <div
        ref={containerRef}
        className="w-full h-[320px] sm:h-[350px] lg:h-[370px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none bg-transparent"
      />
    </div>
  );
};

// Aliased export for compatibility
export { CIIS3DLaptopMascot as CIIS3DRobotMascot };
export default CIIS3DLaptopMascot;
