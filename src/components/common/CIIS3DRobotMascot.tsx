import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useLanguage } from '../../context/LanguageContext';
import {
  RotateCw,
  Hand,
  Compass,
  Laptop,
  Brain,
  Zap,
  AlertTriangle,
  Loader2,
  FileCode
} from 'lucide-react';

interface CIIS3DRobotMascotProps {
  className?: string;
  modelPath?: string;
}

type RobotAnimationState = 'idle' | 'greeting' | 'explaining' | 'analyzing' | 'thinking' | 'celebrating';

interface KinematicRig {
  root: THREE.Group;
  torso: THREE.Group;
  head: THREE.Group;
  shoulderL: THREE.Group;
  shoulderR: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  forearmL: THREE.Group;
  forearmR: THREE.Group;
  handL: THREE.Group;
  handR: THREE.Group;
  pelvis: THREE.Group;
  holoGroup: THREE.Group;
  holoLogoMesh: THREE.Mesh;
  holoDataPill: THREE.Mesh;
  reactorMaterials: THREE.MeshStandardMaterial[];
  eyeMaterials: THREE.MeshStandardMaterial[];
}

/**
 * Creates high-resolution dynamic texture for the CIIS School Logo Hologram (Clean Vector Image)
 */
function createHoloLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;

  const renderCanvas = (customImg?: HTMLImageElement) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, 512, 512);

    if (customImg && customImg.complete && customImg.naturalWidth > 0) {
      // Draw pristine SVG logo directly with crisp edges (no extra white outer lines)
      ctx.drawImage(customImg, 0, 0, 512, 512);
    } else {
      // Fallback Procedural Vector CIIS Logo
      const cx = 256;
      const cy = 256;
      const r = 246;

      const grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, r);
      grad.addColorStop(0, 'rgba(225, 29, 72, 0.90)');
      grad.addColorStop(0.65, 'rgba(157, 23, 77, 0.92)');
      grad.addColorStop(1, 'rgba(80, 7, 36, 0.96)');

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px "Kantumruy Pro", "Bayon", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('សាលារៀន CIIS', cx, 110);

      ctx.font = '900 88px "Inter", "Montserrat", sans-serif';
      ctx.fillText('CIIS', cx, 260);

      ctx.font = 'bold 22px "Inter", sans-serif';
      ctx.fillStyle = '#fbcfe8';
      ctx.fillText('DIGITAL LAB • LMS', cx, 315);
    }

    texture.needsUpdate = true;
  };

  renderCanvas();

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => renderCanvas(img);
  img.src = '/ciis-logo.svg';

  return texture;
}

/**
 * Creates floating hologram subtitle badge texture
 */
function createHoloDataPillTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'rgba(10, 15, 30, 0.75)';
    ctx.beginPath();
    ctx.roundRect(10, 10, 492, 108, 30);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 34px "Inter", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CIIS • DIGITAL COMPUTER LAB', 256, 72);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  return texture;
}

export const CIIS3DRobotMascot: React.FC<CIIS3DRobotMascotProps> = ({
  className = '',
  modelPath = '/models/school-ai-robot.glb'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isKhmer } = useLanguage();
  const [animState, setAnimState] = useState<RobotAnimationState>('analyzing');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const animStateRef = useRef<RobotAnimationState>('analyzing');
  animStateRef.current = animState;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Clear container completely (Guarantees single instance)
    container.innerHTML = '';
    setIsLoading(true);
    setLoadError(null);

    const width = container.clientWidth || 350;
    const height = container.clientHeight || 440;

    // 2. Three.js Scene Setup
    const scene = new THREE.Scene();

    // 3. Perspective Camera (Portrait framing)
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 4.3);

    // 4. WebGL Renderer with Alpha Transparency (No background)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // 100% Transparent
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 5. OrbitControls (Rotation enabled, NO ZOOM, NO AUTO-ROTATE)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false; // User CANNOT zoom in or out
    controls.enableRotate = true; // Rotates normally
    controls.autoRotate = false; // No auto spin
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.minPolarAngle = Math.PI * 0.15;
    controls.target.set(0, 1.15, 0);

    // 6. Studio Multi-Point Lighting Rig
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x334155, 2.2);
    scene.add(hemisphereLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf1f5f9, 1.8);
    fillLight.position.set(-5, 4, 4);
    scene.add(fillLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 4.0);
    cyanRimLight.position.set(6, 4, -4);
    scene.add(cyanRimLight);

    const reactorPointLight = new THREE.PointLight(0x0284c7, 3.5, 4.0);
    reactorPointLight.position.set(0, 1.3, 0.6);
    scene.add(reactorPointLight);

    // 7. Master Robot Root Group
    const robotRoot = new THREE.Group();
    scene.add(robotRoot);

    // Kinematic Rig Holding Assembled Joint Groups
    let rig: KinematicRig | null = null;

    // 8. GLTFLoader & Hierarchical Assembly Pipeline
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf) => {
        setIsLoading(false);

        const allMeshes: THREE.Mesh[] = [];
        const reactorMats: THREE.MeshStandardMaterial[] = [];
        const eyeMats: THREE.MeshStandardMaterial[] = [];

        // Shared High-Glow Cyan Eye Material
        const sharedEyeMat = new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          emissive: new THREE.Color(0x00f0ff),
          emissiveIntensity: 4.8,
          roughness: 0.1,
          metalness: 0.1,
          toneMapped: false
        });
        eyeMats.push(sharedEyeMat);

        gltf.scene.traverse((obj) => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.visible = true;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            allMeshes.push(mesh);

            // Fix Eye Materials: luminous cyan through visor
            if (mesh.name.includes('eye_core') || mesh.name.includes('eye_ring')) {
              mesh.material = sharedEyeMat;
              mesh.renderOrder = 10;
            } else if (mesh.name === 'visor_glass') {
              // Semi-transparent dark curved visor lens
              const visorMat = new THREE.MeshPhysicalMaterial({
                color: 0x07090e,
                metalness: 0.9,
                roughness: 0.05,
                transparent: true,
                opacity: 0.8,
                transmission: 0.5,
                ior: 1.45
              });
              mesh.material = visorMat;
            } else if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness ?? 0.3, 0.38);
              mat.metalness = Math.max(mat.metalness ?? 0.1, 0.1);

              const nameLower = (mesh.name + ' ' + (mat.name || '')).toLowerCase();
              if (nameLower.includes('reactor') || nameLower.includes('core') || nameLower.includes('hex')) {
                reactorMats.push(mat);
              }
            }
          }
        });

        // ============================================================
        // HIERARCHICAL ARTICULATION BUILDER
        // ============================================================
        const masterRig = new THREE.Group();
        masterRig.name = 'Kinematic_Master_Rig';

        // 1. Pelvis Base Group
        const pelvisGroup = new THREE.Group();
        pelvisGroup.name = 'Rig_Pelvis';
        masterRig.add(pelvisGroup);

        // 2. Torso & Spine Group
        const torsoGroup = new THREE.Group();
        torsoGroup.name = 'Rig_Torso';
        torsoGroup.position.set(0, 2.05, 0.1);
        pelvisGroup.add(torsoGroup);

        // 3. Head & Helmet Group (Pivoting cleanly at neck)
        const headGroup = new THREE.Group();
        headGroup.name = 'Rig_Head';
        headGroup.position.set(0, 3.30 - 2.05, -0.07);
        torsoGroup.add(headGroup);

        // 4. Left Arm Chain
        const shoulderLGroup = new THREE.Group();
        shoulderLGroup.name = 'Rig_Shoulder_L';
        shoulderLGroup.position.set(-0.78, 3.00 - 2.05, 0.04 - 0.1);
        torsoGroup.add(shoulderLGroup);

        const armLGroup = new THREE.Group();
        armLGroup.name = 'Rig_Arm_L';
        armLGroup.position.set(-0.91 - -0.78, 2.57 - 3.00, 0.01 - 0.04);
        shoulderLGroup.add(armLGroup);

        const forearmLGroup = new THREE.Group();
        forearmLGroup.name = 'Rig_Forearm_L';
        forearmLGroup.position.set(0, 1.97 - 2.57, 0.02 - 0.01);
        armLGroup.add(forearmLGroup);

        const handLGroup = new THREE.Group();
        handLGroup.name = 'Rig_Hand_L';
        handLGroup.position.set(-0.93 - -0.91, 1.54 - 1.97, 0.04 - 0.02);
        forearmLGroup.add(handLGroup);

        // 5. Right Arm Chain
        const shoulderRGroup = new THREE.Group();
        shoulderRGroup.name = 'Rig_Shoulder_R';
        shoulderRGroup.position.set(0.78, 3.00 - 2.05, 0.04 - 0.1);
        torsoGroup.add(shoulderRGroup);

        const armRGroup = new THREE.Group();
        armRGroup.name = 'Rig_Arm_R';
        armRGroup.position.set(0.91 - 0.78, 2.57 - 3.00, 0.01 - 0.04);
        shoulderRGroup.add(armRGroup);

        const forearmRGroup = new THREE.Group();
        forearmRGroup.name = 'Rig_Forearm_R';
        forearmRGroup.position.set(0, 1.97 - 2.57, 0.02 - 0.01);
        armRGroup.add(forearmRGroup);

        const handRGroup = new THREE.Group();
        handRGroup.name = 'Rig_Hand_R';
        handRGroup.position.set(0.93 - 0.91, 1.54 - 1.97, 0.04 - 0.02);
        forearmRGroup.add(handRGroup);

        // 6. Futuristic 3D Holographic Projector Group & CIIS School Logo (Positioned in FRONT of hands)
        const holoGroup = new THREE.Group();
        holoGroup.name = 'Rig_Holo_Group';
        holoGroup.position.set(0, 0.70, 0.92); // Front of robot's hands
        holoGroup.scale.set(1.0, 1.0, 1.0); // Active by default
        torsoGroup.add(holoGroup);

        // A. Hologram CIIS Logo Disc (88-90% Visibility, Front of Hands)
        const logoTexture = createHoloLogoTexture();
        const logoGeo = new THREE.PlaneGeometry(0.96, 0.96);
        const logoMat = new THREE.MeshBasicMaterial({
          map: logoTexture,
          transparent: true,
          opacity: 0.88, // 88% High Clarity Holographic Visibility
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const holoLogoMesh = new THREE.Mesh(logoGeo, logoMat);
        holoLogoMesh.position.set(0, 0.22, 0);
        holoLogoMesh.renderOrder = 30;
        holoGroup.add(holoLogoMesh);

        // B. Glowing Hologram Ambient Disc (Pure soft aura, NO outer white lines/rings)
        const glowDiscGeo = new THREE.CircleGeometry(0.50, 32);
        const glowDiscMat = new THREE.MeshBasicMaterial({
          color: 0xbe185d,
          transparent: true,
          opacity: 0.32,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const glowDiscMesh = new THREE.Mesh(glowDiscGeo, glowDiscMat);
        glowDiscMesh.position.set(0, 0.22, -0.01);
        glowDiscMesh.renderOrder = 29;
        holoGroup.add(glowDiscMesh);

        // C. Floating Data Pill Label
        const dataPillTex = createHoloDataPillTexture();
        const dataPillGeo = new THREE.PlaneGeometry(0.62, 0.15);
        const dataPillMat = new THREE.MeshBasicMaterial({
          map: dataPillTex,
          transparent: true,
          opacity: 0.88,
          side: THREE.DoubleSide,
          depthWrite: false
        });
        const holoDataPill = new THREE.Mesh(dataPillGeo, dataPillMat);
        holoDataPill.position.set(0, -0.32, 0.08);
        holoDataPill.renderOrder = 32;
        holoGroup.add(holoDataPill);

        // 7. Attach meshes into respective joint groups
        allMeshes.forEach((mesh) => {
          const name = mesh.name;
          if (name.startsWith('L_shoulder')) {
            shoulderLGroup.attach(mesh);
          } else if (name.startsWith('R_shoulder')) {
            shoulderRGroup.attach(mesh);
          } else if (name.startsWith('L_upper_arm') || name.startsWith('L_elbow')) {
            armLGroup.attach(mesh);
          } else if (name.startsWith('R_upper_arm') || name.startsWith('R_elbow')) {
            armRGroup.attach(mesh);
          } else if (name.startsWith('L_forearm') || name.startsWith('L_wrist')) {
            forearmLGroup.attach(mesh);
          } else if (name.startsWith('R_forearm') || name.startsWith('R_wrist')) {
            forearmRGroup.attach(mesh);
          } else if (name.startsWith('L_palm') || name.startsWith('L_finger') || name.startsWith('L_thumb')) {
            handLGroup.attach(mesh);
          } else if (name.startsWith('R_palm') || name.startsWith('R_finger') || name.startsWith('R_thumb')) {
            handRGroup.attach(mesh);
          } else if (
            name.includes('head') ||
            name.includes('visor') ||
            name.includes('eye') ||
            name.includes('chin') ||
            name.includes('ear') ||
            name.includes('helmet')
          ) {
            headGroup.attach(mesh);
          } else if (name.startsWith('neck')) {
            torsoGroup.attach(mesh);
          } else if (
            name.startsWith('pelvis') ||
            name.startsWith('L_thigh') ||
            name.startsWith('R_thigh') ||
            name.startsWith('L_shin') ||
            name.startsWith('R_shin') ||
            name.startsWith('L_foot') ||
            name.startsWith('R_foot') ||
            name.startsWith('L_knee') ||
            name.startsWith('R_knee') ||
            name.startsWith('L_ankle') ||
            name.startsWith('R_ankle') ||
            name.startsWith('L_calf') ||
            name.startsWith('R_calf') ||
            name.startsWith('L_hip') ||
            name.startsWith('R_hip')
          ) {
            pelvisGroup.attach(mesh);
          } else {
            torsoGroup.attach(mesh);
          }
        });

        // Refined Target Scale: 2.35m
        const box = new THREE.Box3().setFromObject(masterRig);
        const size = box.getSize(new THREE.Vector3());
        const targetHeight = 2.35;
        const scale = size.y > 0 ? targetHeight / size.y : 1.0;
        masterRig.scale.setScalar(scale);

        // Ground feet at y = 0
        const scaledBox = new THREE.Box3().setFromObject(masterRig);
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
        masterRig.position.x = -scaledCenter.x;
        masterRig.position.y = -scaledBox.min.y;
        masterRig.position.z = -scaledCenter.z;

        // Auto-fit Camera
        const finalBox = new THREE.Box3().setFromObject(masterRig);
        const finalCenter = finalBox.getCenter(new THREE.Vector3());

        camera.position.set(0, finalCenter.y * 1.02, 4.3);
        controls.target.set(0, finalCenter.y, 0);
        camera.lookAt(0, finalCenter.y, 0);
        controls.update();

        // Update reactor light position
        reactorPointLight.position.set(0, finalCenter.y * 1.05, 0.6);

        // Save active rig for animation loop
        rig = {
          root: masterRig,
          torso: torsoGroup,
          head: headGroup,
          shoulderL: shoulderLGroup,
          shoulderR: shoulderRGroup,
          armL: armLGroup,
          armR: armRGroup,
          forearmL: forearmLGroup,
          forearmR: forearmRGroup,
          handL: handLGroup,
          handR: handRGroup,
          pelvis: pelvisGroup,
          holoGroup: holoGroup,
          holoLogoMesh: holoLogoMesh,
          holoDataPill: holoDataPill,
          reactorMaterials: reactorMats,
          eyeMaterials: eyeMats
        };

        robotRoot.clear();
        robotRoot.add(masterRig);
      },
      undefined,
      (error) => {
        console.error('[CIIS ROBOT] GLB LOAD FAILED:', error);
        setIsLoading(false);
        setLoadError(
          isKhmer
            ? 'មិនទាន់មានឯកសារម៉ូឌែល 3D GLB នៅ public/models/school-ai-robot.glb ទេ។ សូមដាក់ឯកសារ .glb ពិតប្រាកដនៅទីតាំងនេះ។'
            : 'The GLB model is missing. Place the actual GLB file at public/models/school-ai-robot.glb.'
        );
      }
    );

    // ============================================================
    // 9. RAYCAST ROTATION & CLICK INTERACTION
    // ============================================================
    const raycaster = new THREE.Raycaster();
    const pointerCoords = new THREE.Vector2();

    const checkPointerOnRobot = (clientX: number, clientY: number): boolean => {
      if (!rig) return false;
      const rect = renderer.domElement.getBoundingClientRect();
      pointerCoords.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerCoords.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointerCoords, camera);
      const intersects = raycaster.intersectObjects(rig.root.children, true);
      return intersects.length > 0;
    };

    let pointerDownTime = 0;
    const onPointerDown = (e: PointerEvent) => {
      pointerDownTime = Date.now();
      const isHit = checkPointerOnRobot(e.clientX, e.clientY);
      if (isHit) {
        controls.enabled = true;
        controls.enableRotate = true;
        renderer.domElement.style.cursor = 'grabbing';
      } else {
        controls.enabled = false;
        controls.enableRotate = false;
        renderer.domElement.style.cursor = 'default';
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.buttons === 1) return;
      const isHit = checkPointerOnRobot(e.clientX, e.clientY);
      renderer.domElement.style.cursor = isHit ? 'grab' : 'default';
    };

    const onPointerUp = (e: PointerEvent) => {
      controls.enabled = true;
      controls.enableRotate = true;
      // Quick tap / click triggers interactive hologram or greeting!
      if (Date.now() - pointerDownTime < 220 && checkPointerOnRobot(e.clientX, e.clientY)) {
        setAnimState((prev) => (prev === 'analyzing' ? 'greeting' : 'analyzing'));
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // ============================================================
    // 10. HIGH-ENERGY KINEMATIC ANIMATION ENGINE (60 FPS)
    // ============================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const mouseTarget = { x: 0, y: 0 };
    let lastMouseMoveTime = 0;
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      lastMouseMoveTime = clock.getElapsedTime();
    };

    window.addEventListener('mousemove', handleMouseMove);

    let currentActivity: RobotAnimationState = 'analyzing';
    let activityStartTime = 0;
    let nextBlinkTime = 3.0;
    let nextMicroMoveTime = 4.0;
    const microMoveOffsets = { headY: 0, headX: 0, shoulderR: 0, wrist: 0 };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const t = clock.getElapsedTime();
      const targetMode = animStateRef.current;

      controls.update();

      if (!rig) {
        renderer.render(scene, camera);
        return;
      }

      // State transition timer
      if (targetMode !== currentActivity) {
        currentActivity = targetMode;
        activityStartTime = t;
      }
      const stateElapsed = t - activityStartTime;

      // ------------------------------------------------------------
      // A. HIGH-TECH OPTICAL EYE BLINK
      // ------------------------------------------------------------
      if (t >= nextBlinkTime) {
        nextBlinkTime = t + 3.0 + Math.random() * 4.0;
      }
      const timeUntilBlink = nextBlinkTime - t;
      let eyeGlow = 4.8;
      if (timeUntilBlink < 0.22) {
        const blinkProgress = 1.0 - timeUntilBlink / 0.22;
        eyeGlow = 0.3 + 4.5 * Math.abs(Math.sin(blinkProgress * Math.PI));
      }
      if (currentActivity === 'analyzing') {
        eyeGlow = 5.6 + Math.sin(t * 6.0) * 1.4;
      }
      rig.eyeMaterials.forEach((mat) => {
        mat.emissiveIntensity = eyeGlow;
      });

      // ------------------------------------------------------------
      // B. ORGANIC MICRO-MOVEMENTS & CURIOUS LOOK-AROUND
      // ------------------------------------------------------------
      if (t >= nextMicroMoveTime) {
        nextMicroMoveTime = t + 3.5 + Math.random() * 3.5;
        microMoveOffsets.headY = (Math.random() - 0.5) * 0.08;
        microMoveOffsets.headX = (Math.random() - 0.5) * 0.05;
        microMoveOffsets.shoulderR = (Math.random() - 0.5) * 0.04;
        microMoveOffsets.wrist = (Math.random() - 0.5) * 0.06;
      }

      // When cursor is stationary for 2.5s, robot looks around curiously
      const isMouseIdle = t - lastMouseMoveTime > 2.5;
      let autonomousLookX = 0;
      let autonomousLookY = 0;
      if (isMouseIdle && currentActivity !== 'analyzing') {
        // Autonomous scan sequence (looks left at school info, looks around)
        autonomousLookY = Math.sin(t * 0.4) * 0.25;
        autonomousLookX = Math.cos(t * 0.6) * 0.08;
      }

      // ------------------------------------------------------------
      // C. BASE DYNAMIC BODY KINEMATICS (Fluid breathing, weight shift)
      // ------------------------------------------------------------
      const breath = Math.sin(t * 1.5) * 0.0035;
      const weightShift = Math.sin(t * 0.9) * 0.008;
      const torsoSway = Math.sin(t * 0.9) * 0.012;
      const headSwayY = Math.sin(t * 0.7) * 0.05 + microMoveOffsets.headY + autonomousLookY;
      const headSwayX = Math.sin(t * 0.9) * 0.03 + microMoveOffsets.headX + autonomousLookX;

      // Arm living idle flex
      const armIdleSwayL = Math.sin(t * 1.2) * 0.04;
      const armIdleSwayR = Math.cos(t * 1.2) * 0.04;

      // Cursor Head Tracking (±20° Y, ±10° X)
      const maxAngleY = (20 * Math.PI) / 180;
      const maxAngleX = (10 * Math.PI) / 180;
      const targetLookY = THREE.MathUtils.clamp(mouseTarget.x * maxAngleY, -maxAngleY, maxAngleY);
      const targetLookX = THREE.MathUtils.clamp(-mouseTarget.y * maxAngleX, -maxAngleX, maxAngleX);

      // Target Joint Rotations
      const targetHeadRot = new THREE.Euler(headSwayX + targetLookX, headSwayY + targetLookY, -torsoSway * 0.5);
      const targetTorsoRot = new THREE.Euler(0, 0, torsoSway);
      const targetShoulderLRot = new THREE.Euler(0.04 + armIdleSwayL, 0, 0.06);
      const targetShoulderRRot = new THREE.Euler(0.04 + armIdleSwayR, 0, -0.06 + microMoveOffsets.shoulderR);
      const targetArmLRot = new THREE.Euler(0.06 + armIdleSwayL * 0.8, 0, 0);
      const targetArmRRot = new THREE.Euler(0.06 + armIdleSwayR * 0.8, 0, 0);
      const targetForearmLRot = new THREE.Euler(-0.12 - Math.sin(t * 1.5) * 0.05, 0, 0);
      const targetForearmRRot = new THREE.Euler(-0.12 - Math.cos(t * 1.5) * 0.05, 0, 0);
      const targetHandLRot = new THREE.Euler(0, 0, Math.sin(t * 1.8) * 0.04);
      const targetHandRRot = new THREE.Euler(0, 0, microMoveOffsets.wrist + Math.cos(t * 1.8) * 0.04);
      let reactorIntensity = 2.6 + Math.sin(t * 2.5) * 0.8;

      // ------------------------------------------------------------
      // D. DYNAMIC ACTIVITY STATES
      // ------------------------------------------------------------
      // 1. GREETING (Energetic wave)
      if (currentActivity === 'greeting') {
        if (stateElapsed < 0.4) {
          targetHeadRot.set(-0.08, 0.1, -0.06);
        } else if (stateElapsed < 0.8) {
          targetHeadRot.set(-0.08, 0.1, -0.06);
          targetShoulderRRot.set(-0.5, 0, -0.4);
          targetArmRRot.set(-1.4, 0, 0);
          targetForearmRRot.set(-0.35, 0, 0);
        } else if (stateElapsed < 2.6) {
          const wavePhase = (stateElapsed - 0.8) * 9.0;
          targetHeadRot.set(-0.08, 0.1, -0.06);
          targetShoulderRRot.set(-0.7, 0, -0.55);
          targetArmRRot.set(-1.7, 0, -0.2);
          targetForearmRRot.set(-0.45 + Math.cos(wavePhase) * 0.2, 0, 0);
          targetHandRRot.set(0, 0, Math.sin(wavePhase) * 0.45);
          reactorIntensity = 4.2 + Math.sin(t * 6.0) * 1.0;
        } else if (stateElapsed < 3.2) {
          targetArmRRot.set(-0.4, 0, 0);
          targetForearmRRot.set(-0.15, 0, 0);
        }
      }

      // 2. EXPLAINING (Pointing to school overview with open left gesture)
      else if (currentActivity === 'explaining') {
        if (stateElapsed < 3.2) {
          targetHeadRot.set(-0.06, -0.42 + Math.sin(t * 1.5) * 0.04, 0);
          targetShoulderLRot.set(-0.45, 0, 0.45);
          targetArmLRot.set(-1.15 + Math.sin(t * 2.0) * 0.08, 0, 0);
          targetForearmLRot.set(-0.25, 0, 0);
          targetHandLRot.set(0, -0.35, 0);

          targetArmRRot.set(-0.3, 0, 0);
          targetForearmRRot.set(-0.35, 0, 0);
          reactorIntensity = 3.6 + Math.sin(t * 3.5) * 0.8;
        }
      }

      // 3. THINKING (Hand to chin & thoughtful pose)
      else if (currentActivity === 'thinking') {
        if (stateElapsed < 2.8) {
          targetHeadRot.set(0.14, 0.18, (9 * Math.PI) / 180);
          targetShoulderRRot.set(-0.45, 0, -0.35);
          targetArmRRot.set(-1.45, 0, 0);
          targetForearmRRot.set(-1.3, 0, 0);
          targetHandRRot.set(0.25, 0, 0.2);

          targetArmLRot.set(-0.3, 0, 0.25);
          targetForearmLRot.set(-0.75, 0, 0);
          reactorIntensity = 3.2 + Math.sin(t * 2.0) * 0.6;
        }
      }

      // 4. ANALYZING / HOLOGRAM (Projecting and displaying CIIS School Logo Hologram)
      else if (currentActivity === 'analyzing') {
        // Head tilts and looks intently down at the floating CIIS logo hologram
        targetHeadRot.set(0.26 + Math.sin(t * 1.5) * 0.03, Math.sin(t * 1.0) * 0.04, 0);

        // Dual cupping arm pose projecting the hologram beam from palms
        targetShoulderLRot.set(-0.62, 0.15, 0.35);
        targetArmLRot.set(-1.08 + Math.sin(t * 3.0) * 0.04, 0, 0.12);
        targetForearmLRot.set(-0.78 + Math.cos(t * 3.5) * 0.04, 0, 0);
        targetHandLRot.set(0.25, -0.35, 0.15);

        targetShoulderRRot.set(-0.62, -0.15, -0.35);
        targetArmRRot.set(-1.08 + Math.cos(t * 3.0) * 0.04, 0, -0.12);
        targetForearmRRot.set(-0.78 + Math.sin(t * 3.5) * 0.04, 0, 0);
        targetHandRRot.set(0.25, 0.35, -0.15);

        reactorIntensity = 5.2 + Math.sin(t * 7.0) * 1.6;
      }

      // 5. CELEBRATING (Grand welcome & radiant pulse)
      else if (currentActivity === 'celebrating') {
        if (stateElapsed < 2.8) {
          targetHeadRot.set(-0.16 + Math.sin(t * 2.5) * 0.05, 0, 0);
          targetShoulderLRot.set(-0.35, 0, 0.7 + Math.sin(t * 4.5) * 0.08);
          targetArmLRot.set(-0.7, 0, 0);
          targetForearmLRot.set(-0.35, 0, 0);

          targetShoulderRRot.set(-0.35, 0, -0.7 - Math.sin(t * 4.5) * 0.08);
          targetArmRRot.set(-0.7, 0, 0);
          targetForearmRRot.set(-0.35, 0, 0);

          reactorIntensity = 6.2 + Math.sin(t * 9.0) * 2.2;
        }
      }

      // ------------------------------------------------------------
      // E. CIIS LOGO HOLOGRAM PRESENTATION & SMOOTH ROTATION
      // ------------------------------------------------------------
      const isHoloActive = currentActivity === 'analyzing';
      const targetHoloScale = isHoloActive ? 1.0 : 0.0001;

      rig.holoGroup.scale.lerp(
        new THREE.Vector3(targetHoloScale, targetHoloScale, targetHoloScale),
        isHoloActive ? 0.12 : 0.2
      );
      rig.holoGroup.visible = rig.holoGroup.scale.x > 0.015;

      if (rig.holoGroup.visible) {
        // Hologram Logo stays FRONT-FACING (fronted) with organic levitation & subtle breathing tilt
        rig.holoLogoMesh.rotation.y = Math.sin(t * 1.2) * 0.08; // Subtle ±4.5° breathing sway, stays front-facing!
        rig.holoLogoMesh.rotation.z = Math.cos(t * 1.0) * 0.03;
        rig.holoLogoMesh.position.y = 0.22 + Math.sin(t * 2.8) * 0.035;

        // Subtitle badge gentle orientation sway
        rig.holoDataPill.rotation.y = Math.sin(t * 1.2) * 0.08;
      }

      // Smooth Interpolation to Joint Rig (Fluid 60 FPS)
      const lerpFactor = Math.min(delta * 7.5, 0.18);

      rig.head.rotation.x = THREE.MathUtils.lerp(rig.head.rotation.x, targetHeadRot.x, lerpFactor);
      rig.head.rotation.y = THREE.MathUtils.lerp(rig.head.rotation.y, targetHeadRot.y, lerpFactor);
      rig.head.rotation.z = THREE.MathUtils.lerp(rig.head.rotation.z, targetHeadRot.z, lerpFactor);

      rig.torso.rotation.z = THREE.MathUtils.lerp(rig.torso.rotation.z, targetTorsoRot.z, lerpFactor);
      rig.torso.position.y += breath;
      rig.root.position.x = THREE.MathUtils.lerp(rig.root.position.x, weightShift, lerpFactor);

      rig.shoulderL.rotation.x = THREE.MathUtils.lerp(rig.shoulderL.rotation.x, targetShoulderLRot.x, lerpFactor);
      rig.shoulderL.rotation.y = THREE.MathUtils.lerp(rig.shoulderL.rotation.y, targetShoulderLRot.y, lerpFactor);
      rig.shoulderL.rotation.z = THREE.MathUtils.lerp(rig.shoulderL.rotation.z, targetShoulderLRot.z, lerpFactor);

      rig.shoulderR.rotation.x = THREE.MathUtils.lerp(rig.shoulderR.rotation.x, targetShoulderRRot.x, lerpFactor);
      rig.shoulderR.rotation.y = THREE.MathUtils.lerp(rig.shoulderR.rotation.y, targetShoulderRRot.y, lerpFactor);
      rig.shoulderR.rotation.z = THREE.MathUtils.lerp(rig.shoulderR.rotation.z, targetShoulderRRot.z, lerpFactor);

      rig.armL.rotation.x = THREE.MathUtils.lerp(rig.armL.rotation.x, targetArmLRot.x, lerpFactor);
      rig.armR.rotation.x = THREE.MathUtils.lerp(rig.armR.rotation.x, targetArmRRot.x, lerpFactor);

      rig.forearmL.rotation.x = THREE.MathUtils.lerp(rig.forearmL.rotation.x, targetForearmLRot.x, lerpFactor);
      rig.forearmR.rotation.x = THREE.MathUtils.lerp(rig.forearmR.rotation.x, targetForearmRRot.x, lerpFactor);

      rig.handL.rotation.y = THREE.MathUtils.lerp(rig.handL.rotation.y, targetHandLRot.y, lerpFactor);
      rig.handR.rotation.z = THREE.MathUtils.lerp(rig.handR.rotation.z, targetHandRRot.z, lerpFactor);

      // Reactor Dynamic Glow Pulse
      reactorPointLight.intensity = reactorIntensity;
      rig.reactorMaterials.forEach((mat) => {
        mat.emissiveIntensity = reactorIntensity;
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || 350;
      const newH = container.clientHeight || 440;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
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
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 360° Drag Interaction Badge */}
      <div className="absolute top-2 right-4 z-20 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-950/85 text-white backdrop-blur-md border border-zinc-700 text-xs font-mono font-bold shadow-xl pointer-events-none">
        <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
        <span>360° DRAG TO INSPECT</span>
      </div>

      {/* Loading State Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-transparent pointer-events-none space-y-2.5">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <span className="text-xs font-mono text-zinc-300 font-bold bg-zinc-950/80 px-3 py-1 rounded-lg backdrop-blur-md">
            {isKhmer ? 'កំពុងទាញយកម៉ូឌែល 3D Robot...' : 'Loading 3D Robot...'}
          </span>
        </div>
      )}

      {/* Clear Missing Asset Guidance Banner (If GLB is absent) */}
      {loadError && (
        <div className="absolute top-10 inset-x-4 z-30 p-4 rounded-2xl bg-zinc-950/95 text-white border border-amber-500/60 shadow-2xl backdrop-blur-md space-y-2">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-left">
              <p className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wide">
                3D Asset Pipeline Ready • GLB File Missing
              </p>
              <p className="text-[12px] text-zinc-300 leading-relaxed font-sans">{loadError}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] font-mono text-zinc-400">
            <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Target: public/models/school-ai-robot.glb</span>
          </div>
        </div>
      )}

      {/* Main 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-[280px] h-[370px] sm:w-[320px] sm:h-[410px] lg:w-[350px] lg:h-[440px] flex items-center justify-center"
      />

      {/* Robot Animation Activity State Selector */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/95 backdrop-blur-md border border-zinc-800 shadow-2xl z-20 -mt-2">
        <button
          type="button"
          onClick={() => setAnimState('idle')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${animState === 'idle'
            ? 'bg-zinc-800 text-white shadow-xs'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{isKhmer ? 'ធម្មតា' : 'Idle'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAnimState('greeting')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${animState === 'greeting'
            ? 'bg-pink-900 text-white shadow-xs'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
        >
          <Hand className="w-3.5 h-3.5" />
          <span>{isKhmer ? 'ស្វាគមន៍' : 'Greeting'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAnimState('explaining')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${animState === 'explaining'
            ? 'bg-pink-900 text-white shadow-xs'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{isKhmer ? 'ណែនាំសាលា' : 'Explain'}</span>
        </button>

        {/* HOLOGRAM BUTTON: ACTIVATES FLOATING CIIS LOGO HOLOGRAM */}
        <button
          type="button"
          onClick={() => setAnimState('analyzing')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${animState === 'analyzing'
              ? 'bg-gradient-to-r from-pink-700 via-rose-600 to-cyan-600 text-white shadow-md shadow-pink-950/40 border border-pink-400/50 scale-102'
              : 'text-pink-300 hover:text-white hover:bg-pink-950/60 border border-pink-500/20'
            }`}
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>{isKhmer ? 'ហូឡូក្រាម Logo CIIS' : 'CIIS Hologram'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAnimState('thinking')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${animState === 'thinking'
            ? 'bg-zinc-800 text-white shadow-xs'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{isKhmer ? 'គិត' : 'Thinking'}</span>
        </button>

        <button
          type="button"
          onClick={() => setAnimState('celebrating')}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${animState === 'celebrating'
            ? 'bg-rose-900 text-white shadow-xs'
            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isKhmer ? 'ថាមពល' : 'Welcome'}</span>
        </button>
      </div>

      {/* Subtitle Status */}
      <p className="text-[11px] font-mono text-zinc-400 mt-2 text-center">
        {isKhmer
          ? 'ម៉ូឌែល 3D GLB • ចុចលើ "ហូឡូក្រាម Logo CIIS" ដើម្បីបញ្ចាំងឡូហ្គោសាលា CIIS'
          : 'Interactive 3D Robot • Click "CIIS Hologram" to Project Glowing CIIS School Logo'}
      </p>
    </div>
  );
};

