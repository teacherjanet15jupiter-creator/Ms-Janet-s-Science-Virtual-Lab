import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Camera, CameraOff, Sparkles, Award, Moon, Globe, Sun, RefreshCw,
  Sliders, Maximize2, Download, CheckCircle2, AlertCircle, Volume2,
  Scan, Layers, Compass, Eye, ShieldCheck, Heart, Leaf, Microscope,
  Check, X, HelpCircle, Info, ZoomIn, ZoomOut, Target, Tag, Sparkle
} from 'lucide-react';
import { soundEffects } from '../../utils/sound';
import { VirtualMicroscopeLab } from '../microscope/VirtualMicroscopeLab';

interface Props {
  onUnlockBadge?: (badgeId: string) => void;
}

export type ArCategory = 'cells' | 'space';
export type ArTarget = 'plant_cell' | 'animal_cell' | 'moon' | 'earth' | 'eclipse' | 'rover';

export interface OrganelleData {
  id: string;
  name: string;
  category: 'plant_only' | 'animal_only' | 'both';
  color: string;
  sizeUm: string;
  stainMethod: string;
  function: string;
  cambridgeExamTip: string;
  examQuestion: string;
  location: string;
  focusCoord: { x: number; y: number; z: number };
}

export const ORGANELLES_DATA: OrganelleData[] = [
  {
    id: 'cell_wall',
    name: 'Cell Wall',
    category: 'plant_only',
    color: '#059669',
    sizeUm: '0.1 – 5.0 µm thick',
    stainMethod: 'Iodine Solution (stains pale yellow-brown)',
    function: 'A rigid outer envelope composed of interwoven cellulose microfibrils. Provides high tensile strength and structural support, giving plant cells their regular, fixed rectangular shape and preventing cellular lysis (bursting) when taking in water by osmosis.',
    cambridgeExamTip: 'Crucial Distinction: The cell wall is fully permeable (allows all dissolved minerals and water to pass through freely). Do not confuse it with the partially permeable cell membrane! Animal cells NEVER have a cell wall.',
    examQuestion: 'Q: What prevents a plant cell from bursting when placed in distilled water? A: The tough cellulose cell wall exerts opposing wall pressure against the high turgor pressure of cell sap.',
    location: 'Outermost protective layer of plant cells only',
    focusCoord: { x: 0, y: 1.4, z: 0 }
  },
  {
    id: 'cell_membrane',
    name: 'Cell Membrane',
    category: 'both',
    color: '#E11D48',
    sizeUm: '7 – 10 nm (0.008 µm)',
    stainMethod: 'Methylene Blue (stains thin boundary line)',
    function: 'A delicate fluid mosaic phospholipid bilayer embedded with transport proteins. Acts as a selectively (partially) permeable barrier that regulates the entry and exit of substances (glucose, water, mineral ions, oxygen, carbon dioxide).',
    cambridgeExamTip: 'Present in ALL living cells without exception. In plant cells, it is pressed tightly against the inside of the cell wall. In animal cells, it forms the outer flexible surface, allowing cell shape flexibility.',
    examQuestion: 'Q: Which cell part controls the passage of mineral salts into the cell? A: The partially permeable cell membrane.',
    location: 'Lining the inner surface of plant cell wall; outermost border of animal cell',
    focusCoord: { x: -1.7, y: 0, z: 0 }
  },
  {
    id: 'cytoplasm',
    name: 'Cytoplasm (Cytosol)',
    category: 'both',
    color: '#D97706',
    sizeUm: 'Continuous matrix (~80% water)',
    stainMethod: 'Eosin / Light Methylene Blue',
    function: 'A translucent, jelly-like aqueous colloid containing dissolved glucose, amino acids, enzymes, and salts. Serves as the reaction chamber where glycolysis, protein synthesis, and vital metabolic chemical reactions occur. Exhibits continuous cytoplasmic streaming (cyclosis).',
    cambridgeExamTip: 'Transports materials between organelles and houses suspended ribosomes, chloroplasts, and mitochondria. It is not just "empty jelly" — it is living protoplasm in constant motion.',
    examQuestion: 'Q: Name the jelly-like substance where most chemical reactions of the cell take place. A: Cytoplasm.',
    location: 'Fills the entire cellular volume between nucleus and membrane',
    focusCoord: { x: 0, y: 0, z: 0.4 }
  },
  {
    id: 'nucleus',
    name: 'Nucleus & Nucleolus',
    category: 'both',
    color: '#7C3AED',
    sizeUm: '5 – 8 µm diameter',
    stainMethod: 'Methylene Blue / Acetic Orcein (stains dark violet)',
    function: 'The master command center of the cell enclosed by a double nuclear envelope with nuclear pore complexes. Houses hereditary genetic material (DNA assembled into chromosomes/chromatin). Controls growth, metabolism, protein synthesis, and cell division. Contains a dense nucleolus where ribosomes are assembled.',
    cambridgeExamTip: 'Exam Standard: Never just say "the brain of the cell"! Cambridge Stage 6 and MOE Singapore mark schemes explicitly demand: "Controls all cellular activities and contains genetic information for inheritance."',
    examQuestion: 'Q: State the role of the nucleus in a leaf cell. A: It contains genetic information (DNA) and controls all cell activities including photosynthesis and respiration.',
    location: 'Displaced toward the wall in plant cells by the central vacuole; centrally located in animal cells',
    focusCoord: { x: -0.95, y: 0.45, z: 0.2 }
  },
  {
    id: 'chloroplast',
    name: 'Chloroplast (Thylakoids)',
    category: 'plant_only',
    color: '#16A34A',
    sizeUm: '4 – 7 µm length × 2 – 3 µm width',
    stainMethod: 'Natural bright green (contains chlorophyll a & b)',
    function: 'Biconvex disc-shaped organelles enclosing stacks of thylakoid membranes called grana surrounded by fluid stroma. Contains chlorophyll which captures light energy for photosynthesis to synthesize glucose and release oxygen.',
    cambridgeExamTip: 'Common Exam Trap: Chloroplasts are NOT found in all plant cells! Root hair cells, onion bulb scales, and underground stem tubers do NOT have chloroplasts because they grow in the dark underground where light is absent.',
    examQuestion: 'Q: Explain why an onion bulb cell does not contain chloroplasts. A: The onion bulb grows underground in the soil where there is no light, so chloroplasts are not needed.',
    location: 'Abundant in green leaves (palisade & spongy mesophyll) and green herbaceous stems',
    focusCoord: { x: 1.1, y: 0.75, z: 0.2 }
  },
  {
    id: 'vacuole',
    name: 'Large Central Vacuole',
    category: 'both',
    color: '#0284C7',
    sizeUm: 'Occupies 40% – 85% of plant cell volume',
    stainMethod: 'Neutral Red / Toluidine Blue',
    function: 'In plant cells: A giant permanent central reservoir enclosed by a tonoplast membrane, filled with cell sap (water, dissolved sugars, amino acids, and mineral salts). It exerts turgor pressure outward against the cell wall to keep the plant cell firm, turgid, and upright. In animal cells: Multiple small, temporary vacuoles.',
    cambridgeExamTip: 'Turgidity Pointer: When a plant cell lacks water, the central vacuole shrinks, pulling the membrane away from the cell wall (plasmolysis). The loss of turgor pressure causes the whole plant to wilt.',
    examQuestion: 'Q: Compare the vacuole of a plant cell with that of an animal cell. A: A plant cell has one large permanent central vacuole filled with cell sap, whereas an animal cell has several small, temporary vacuoles.',
    location: 'Dominates the central volume of plant cells; tiny vesicles in animal cells',
    focusCoord: { x: 0.4, y: -0.2, z: 0.1 }
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria (Cristae)',
    category: 'both',
    color: '#EA580C',
    sizeUm: '1 – 3 µm length × 0.5 µm diameter',
    stainMethod: 'Janus Green B (stains live mitochondria green-blue)',
    function: 'The cellular powerhouses enclosed by a double membrane. The inner membrane is folded into finger-like cristae to maximize surface area for respiratory enzymes. Site of aerobic cellular respiration where glucose reacts with oxygen to release energy (ATP) for growth and active transport.',
    cambridgeExamTip: 'Energy Needs: Cells that perform high rates of active metabolic work (e.g. root hair cells absorbing minerals against concentration gradients, or animal muscle cells) contain abundant mitochondria.',
    examQuestion: 'Q: Which organelle provides energy for active mineral absorption in plant roots? A: Mitochondria, through cellular respiration.',
    location: 'Scattered oval capsules throughout the cytoplasm',
    focusCoord: { x: -0.3, y: 0.2, z: 0.35 }
  }
];

// Procedural biological texture generators
function createRealisticCellWallTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 512);
  grad.addColorStop(0, '#064E3B');
  grad.addColorStop(0.5, '#047857');
  grad.addColorStop(1, '#059669');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Microfibril cellulose criss-cross weave
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
  ctx.lineWidth = 1.6;
  for (let i = -512; i < 1024; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 512, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 512);
    ctx.lineTo(i + 512, 0);
    ctx.stroke();
  }

  // Cellulose pits & plasmodesmata channels
  ctx.fillStyle = 'rgba(2, 44, 34, 0.7)';
  for (let i = 0; i < 90; i++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    ctx.beginPath();
    ctx.arc(px, py, 2 + Math.random() * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createRealisticNucleusTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep chromatin base
  const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 256);
  grad.addColorStop(0, '#581C87');
  grad.addColorStop(0.65, '#6B21A8');
  grad.addColorStop(1, '#3B0764');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Chromatin coils
  ctx.strokeStyle = 'rgba(192, 132, 252, 0.55)';
  ctx.lineWidth = 2.2;
  for (let i = 0; i < 35; i++) {
    ctx.beginPath();
    let cx = Math.random() * 512;
    let cy = Math.random() * 512;
    ctx.moveTo(cx, cy);
    for (let s = 0; s < 5; s++) {
      cx += (Math.random() - 0.5) * 70;
      cy += (Math.random() - 0.5) * 70;
      ctx.lineTo(cx, cy);
    }
    ctx.stroke();
  }

  // Nuclear pore complexes
  ctx.fillStyle = '#1E1B4B';
  ctx.strokeStyle = '#DDD6FE';
  ctx.lineWidth = 1;
  for (let i = 0; i < 110; i++) {
    const nx = Math.random() * 512;
    const ny = Math.random() * 512;
    ctx.beginPath();
    ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

function createRealisticChloroplastTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#14532D';
  ctx.fillRect(0, 0, 256, 256);

  // Thylakoid grana stacks
  ctx.fillStyle = '#15803D';
  ctx.strokeStyle = '#4ADE80';
  ctx.lineWidth = 1.2;
  for (let y = 16; y < 240; y += 22) {
    for (let x = 18; x < 240; x += 32) {
      for (let stack = 0; stack < 3; stack++) {
        ctx.beginPath();
        ctx.ellipse(x, y + stack * 3, 12, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  return new THREE.CanvasTexture(canvas);
}

function createRealisticMitochondriaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9A3412';
  ctx.fillRect(0, 0, 256, 256);

  // Cristae membrane inner folds
  ctx.strokeStyle = '#FED7AA';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  for (let y = 20; y < 240; y += 22) {
    ctx.beginPath();
    ctx.moveTo(15, y);
    ctx.lineTo(170, y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(85, y + 11);
    ctx.lineTo(240, y + 11);
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}

export const AugmentedRealityHub: React.FC<Props> = ({ onUnlockBadge }) => {
  const [activeCategory, setActiveCategory] = useState<ArCategory>('cells');
  const [activeTab, setActiveTab] = useState<'camera_ar' | 'microscope_lab' | 'hologram_sandbox' | 'comparison' | 'cards'>('microscope_lab');
  const [selectedTarget, setSelectedTarget] = useState<ArTarget>('plant_cell');
  const [selectedOrganelle, setSelectedOrganelle] = useState<OrganelleData>(ORGANELLES_DATA[0]);
  const [magnificationMultiplier, setMagnificationMultiplier] = useState<number>(1000); // 1,000x to 5,000x
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hologramScale, setHologramScale] = useState<number>(1.2);
  const [hologramRotationSpeed, setHologramRotationSpeed] = useState<number>(0.8);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isDissected, setIsDissected] = useState<boolean>(true); // Cross-section cutaway view
  const [lunarPhaseAngle, setLunarPhaseAngle] = useState<number>(180);

  // Screen Positions for dynamic floating 3D labels
  const [labelPositions, setLabelPositions] = useState<{ id: string; name: string; color: string; x: number; y: number }[]>([]);

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const threeSceneRef = useRef<THREE.Scene | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const threeRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const activeMeshRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Target camera position and lookAt for smooth zooming
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 8));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const organelleMeshesMapRef = useRef<Map<string, THREE.Object3D>>(new Map());

  // Hologram Position in 3D AR space
  const [holoPos, setHoloPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize Three.js WebGL overlay canvas
  useEffect(() => {
    if (!canvas3dRef.current) return;
    const canvas = canvas3dRef.current;
    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 480;

    const scene = new THREE.Scene();
    threeSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    threeCameraRef.current = camera;
    targetCamPosRef.current.set(0, 0, 8);
    targetLookAtRef.current.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    threeRendererRef.current = renderer;

    // Realistic PBR Biological Illumination
    const ambient = new THREE.AmbientLight(0xFFFFFF, 1.1);
    scene.add(ambient);

    // Key Light
    const keyLight = new THREE.DirectionalLight(0xFFF7ED, 2.6);
    keyLight.position.set(5, 5, 7);
    scene.add(keyLight);
    dirLightRef.current = keyLight;

    // Back / Rim Light for cellular translucency & membrane glow
    const rimLight = new THREE.DirectionalLight(0x38BDF8, 1.8);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // Soft Green/Cyan Biological Transillumination Fill
    const bioFill = new THREE.PointLight(0x10B981, 1.4, 20);
    bioFill.position.set(0, 0, 4);
    scene.add(bioFill);

    // Build Current Hologram Target
    loadHologramMesh(selectedTarget, scene);

    // Resize listener
    const handleResize = () => {
      if (!canvas.parentElement || !threeCameraRef.current || !threeRendererRef.current) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight || 480;
      threeCameraRef.current.aspect = w / h;
      threeCameraRef.current.updateProjectionMatrix();
      threeRendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Smooth camera interpolation for magnification dolly zoom
      camera.position.lerp(targetCamPosRef.current, 0.08);
      camera.lookAt(targetLookAtRef.current);

      if (activeMeshRef.current) {
        activeMeshRef.current.rotation.y += 0.005 * hologramRotationSpeed;

        // Subtle biological breathing / organelle pulsation
        const pulse = Math.sin(Date.now() * 0.002) * 0.015;
        activeMeshRef.current.scale.set(
          hologramScale + pulse,
          hologramScale + pulse,
          hologramScale + pulse
        );
      }

      // Update 2D Screen Coordinates for Floating Labels
      if (canvas.parentElement && organelleMeshesMapRef.current.size > 0) {
        const w = canvas.parentElement.clientWidth;
        const h = canvas.parentElement.clientHeight || 480;
        const nextLabels: { id: string; name: string; color: string; x: number; y: number }[] = [];

        organelleMeshesMapRef.current.forEach((mesh, id) => {
          const org = ORGANELLES_DATA.find(o => o.id === id);
          if (!org) return;

          const worldPos = new THREE.Vector3();
          mesh.getWorldPosition(worldPos);

          const screenPos = worldPos.clone().project(camera);
          if (screenPos.z < 1) {
            const x = (screenPos.x * 0.5 + 0.5) * w;
            const y = (-(screenPos.y * 0.5) + 0.5) * h;
            nextLabels.push({
              id,
              name: org.name,
              color: org.color,
              x: Math.round(x),
              y: Math.round(y)
            });
          }
        });
        setLabelPositions(nextLabels);
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Smooth Zoom into Organelle
  const zoomToOrganelle = (coord: { x: number; y: number; z: number }, mag = 3500) => {
    soundEffects.playPhaseUnlock();
    setMagnificationMultiplier(mag);

    // Position camera closer to organelle
    targetCamPosRef.current.set(coord.x * 0.8, coord.y * 0.8, 3.4);
    targetLookAtRef.current.set(coord.x, coord.y, coord.z);
  };

  // Reset Zoom back to Full Cell Overview
  const resetZoom = () => {
    soundEffects.playClick();
    setMagnificationMultiplier(1000);
    targetCamPosRef.current.set(0, 0, 8);
    targetLookAtRef.current.set(0, 0, 0);
  };

  // Update Hologram mesh when target or dissection mode changes
  const loadHologramMesh = (target: ArTarget, scene: THREE.Scene) => {
    if (activeMeshRef.current) {
      scene.remove(activeMeshRef.current);
      activeMeshRef.current = null;
    }
    organelleMeshesMapRef.current.clear();

    const group = new THREE.Group();

    if (target === 'plant_cell') {
      // =========================================================================
      // 🌿 HIGH-REALISM 3D PLANT CELL SPECIMEN (Confocal Microscopic Fidelity)
      // =========================================================================
      const cellWallTex = createRealisticCellWallTexture();
      const nucleusTex = createRealisticNucleusTexture();
      const chloroTex = createRealisticChloroplastTexture();
      const mitoTex = createRealisticMitochondriaTexture();

      // 1. Thick Cellulose Cell Wall with Beveled Cutaway Window
      const wallMat = new THREE.MeshStandardMaterial({
        map: cellWallTex,
        roughness: 0.45,
        metalness: 0.05,
        side: THREE.DoubleSide,
        wireframe: isWireframe,
        transparent: true,
        opacity: isDissected ? 0.78 : 0.95
      });
      const wallGeo = new THREE.BoxGeometry(3.8, 2.9, isDissected ? 1.4 : 2.0);
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.userData = { organelleId: 'cell_wall', name: 'Cell Wall' };
      group.add(wallMesh);
      organelleMeshesMapRef.current.set('cell_wall', wallMesh);

      // 2. Phospholipid Cell Membrane Lining
      const memMat = new THREE.MeshStandardMaterial({
        color: 0x84CC16,
        roughness: 0.25,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const memGeo = new THREE.BoxGeometry(3.55, 2.65, isDissected ? 1.25 : 1.85);
      const memMesh = new THREE.Mesh(memGeo, memMat);
      memMesh.userData = { organelleId: 'cell_membrane', name: 'Cell Membrane' };
      group.add(memMesh);
      organelleMeshesMapRef.current.set('cell_membrane', memMesh);

      // 3. Cytoplasm Jelly with Suspended Cytosol Granules
      const cytoMat = new THREE.MeshPhysicalMaterial({
        color: 0x6EE7B7,
        transparent: true,
        opacity: 0.22,
        roughness: 0.1,
        transmission: 0.65,
        ior: 1.33
      });
      const cytoMesh = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.5, isDissected ? 1.15 : 1.7), cytoMat);
      cytoMesh.userData = { organelleId: 'cytoplasm', name: 'Cytoplasm' };
      group.add(cytoMesh);
      organelleMeshesMapRef.current.set('cytoplasm', cytoMesh);

      // Streaming ribosomes / metabolic particles in cytoplasm
      const particleGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({ color: 0xFDE047, transparent: true, opacity: 0.75 });
      for (let i = 0; i < 28; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.position.set(
          (Math.random() - 0.5) * 3.1,
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 0.9
        );
        group.add(p);
      }

      // 4. Large Central Vacuole (Refractive Cell Sap, occupying ~45% volume)
      const vacMat = new THREE.MeshPhysicalMaterial({
        color: 0x38BDF8,
        transparent: true,
        opacity: 0.68,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.75,
        ior: 1.34
      });
      const vacGeo = new THREE.SphereGeometry(1.05, 32, 32);
      vacGeo.scale(1.25, 0.95, 0.75);
      const vacMesh = new THREE.Mesh(vacGeo, vacMat);
      vacMesh.position.set(0.42, -0.22, 0.08);
      vacMesh.userData = { organelleId: 'vacuole', name: 'Large Central Vacuole' };
      group.add(vacMesh);
      organelleMeshesMapRef.current.set('vacuole', vacMesh);

      // 5. Nucleus with Nuclear Membrane Pores & Nucleolus
      const nucMat = new THREE.MeshStandardMaterial({
        map: nucleusTex,
        roughness: 0.35,
        metalness: 0.1
      });
      const nucGeo = new THREE.SphereGeometry(0.58, 32, 32);
      const nucMesh = new THREE.Mesh(nucGeo, nucMat);
      nucMesh.position.set(-0.95, 0.45, 0.15);
      nucMesh.userData = { organelleId: 'nucleus', name: 'Nucleus' };
      group.add(nucMesh);
      organelleMeshesMapRef.current.set('nucleus', nucMesh);

      // Dense Nucleolus core
      const nucleolusMat = new THREE.MeshStandardMaterial({ color: 0x3B0764, roughness: 0.2 });
      const nucleolusMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), nucleolusMat);
      nucleolusMesh.position.set(-0.95, 0.45, 0.15);
      group.add(nucleolusMesh);

      // Endoplasmic Reticulum (ER) sheets hugging nucleus
      const erMat = new THREE.MeshStandardMaterial({ color: 0xA78BFA, roughness: 0.4, side: THREE.DoubleSide });
      const erMesh = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.05, 8, 24, Math.PI * 1.3), erMat);
      erMesh.position.set(-0.95, 0.45, 0.1);
      erMesh.rotation.z = 0.4;
      group.add(erMesh);

      // 6. Realistic Chloroplasts with Grana Disc Textures
      const chloroMat = new THREE.MeshStandardMaterial({
        map: chloroTex,
        roughness: 0.3,
        metalness: 0.15
      });
      const chloroGeo = new THREE.SphereGeometry(0.26, 24, 24);
      chloroGeo.scale(1.45, 0.85, 0.65);

      const chloroPositions = [
        { x: -1.25, y: -0.72, z: 0.35 },
        { x: -0.32, y: 0.88, z: 0.25 },
        { x: 1.15, y: 0.76, z: 0.22 },
        { x: 1.25, y: -0.82, z: 0.28 },
        { x: -0.15, y: -0.96, z: -0.2 }
      ];

      chloroPositions.forEach((pos, idx) => {
        const cMesh = new THREE.Mesh(chloroGeo, chloroMat);
        cMesh.position.set(pos.x, pos.y, pos.z);
        cMesh.rotation.set(0.3 * idx, 0.4 * idx, 0.2 * idx);
        cMesh.userData = { organelleId: 'chloroplast', name: 'Chloroplast' };
        group.add(cMesh);
        if (idx === 0) organelleMeshesMapRef.current.set('chloroplast', cMesh);
      });

      // 7. Mitochondria with Folded Cristae Ridges
      const mitoMat = new THREE.MeshStandardMaterial({ map: mitoTex, roughness: 0.4 });
      const mitoGeo = new THREE.CapsuleGeometry(0.13, 0.25, 8, 16);

      const mitoPositions = [
        { x: -0.32, y: 0.22, z: 0.38, rot: 0.6 },
        { x: 0.95, y: 0.15, z: -0.22, rot: -0.4 }
      ];
      mitoPositions.forEach((pos, idx) => {
        const mMesh = new THREE.Mesh(mitoGeo, mitoMat);
        mMesh.position.set(pos.x, pos.y, pos.z);
        mMesh.rotation.z = pos.rot;
        mMesh.userData = { organelleId: 'mitochondria', name: 'Mitochondria' };
        group.add(mMesh);
        if (idx === 0) organelleMeshesMapRef.current.set('mitochondria', mMesh);
      });

    } else if (target === 'animal_cell') {
      // =========================================================================
      // 🐾 HIGH-REALISM 3D ANIMAL CELL SPECIMEN (Flexible Membrane, NO Cell Wall)
      // =========================================================================
      const nucleusTex = createRealisticNucleusTexture();
      const mitoTex = createRealisticMitochondriaTexture();

      // 1. Flexible Fluid Mosaic Cell Membrane (Translucent organic ellipsoid)
      const cellMemMat = new THREE.MeshPhysicalMaterial({
        color: 0xFB7185,
        roughness: 0.35,
        metalness: 0.1,
        transparent: true,
        opacity: isDissected ? 0.62 : 0.88,
        transmission: 0.55,
        ior: 1.36,
        wireframe: isWireframe,
        side: THREE.DoubleSide
      });
      const cellMemGeo = new THREE.SphereGeometry(2.2, 48, 48);
      cellMemGeo.scale(1.18, 0.96, isDissected ? 0.85 : 0.92);
      const cellMemMesh = new THREE.Mesh(cellMemGeo, cellMemMat);
      cellMemMesh.userData = { organelleId: 'cell_membrane', name: 'Cell Membrane' };
      group.add(cellMemMesh);
      organelleMeshesMapRef.current.set('cell_membrane', cellMemMesh);

      // 2. Cytoplasm Core (Warm Amber Protoplasm)
      const cytoMat = new THREE.MeshPhysicalMaterial({
        color: 0xFDE68A,
        transparent: true,
        opacity: 0.25,
        transmission: 0.6,
        ior: 1.33
      });
      const cytoGeo = new THREE.SphereGeometry(2.0, 36, 36);
      cytoGeo.scale(1.12, 0.9, isDissected ? 0.78 : 0.86);
      const cytoMesh = new THREE.Mesh(cytoGeo, cytoMat);
      cytoMesh.userData = { organelleId: 'cytoplasm', name: 'Cytoplasm' };
      group.add(cytoMesh);
      organelleMeshesMapRef.current.set('cytoplasm', cytoMesh);

      // Ribosome beads floating in animal cytoplasm
      const riboGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const riboMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B, transparent: true, opacity: 0.8 });
      for (let i = 0; i < 30; i++) {
        const rMesh = new THREE.Mesh(riboGeo, riboMat);
        rMesh.position.set(
          (Math.random() - 0.5) * 2.8,
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 0.8
        );
        group.add(rMesh);
      }

      // 3. Central Nucleus with Nuclear Envelope & Dense Nucleolus
      const nucMat = new THREE.MeshStandardMaterial({
        map: nucleusTex,
        roughness: 0.35,
        metalness: 0.1
      });
      const nucMesh = new THREE.Mesh(new THREE.SphereGeometry(0.72, 32, 32), nucMat);
      nucMesh.position.set(0, 0.12, 0.05);
      nucMesh.userData = { organelleId: 'nucleus', name: 'Nucleus' };
      group.add(nucMesh);
      organelleMeshesMapRef.current.set('nucleus', nucMesh);

      // Nucleolus
      const nucleolusMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 20, 20),
        new THREE.MeshStandardMaterial({ color: 0x3B0764, roughness: 0.2 })
      );
      nucleolusMesh.position.set(0, 0.12, 0.05);
      group.add(nucleolusMesh);

      // 4. Multiple Small Temporary Vacuoles (Tiny vesicles, contrasting with plant central vacuole)
      const smallVacMat = new THREE.MeshPhysicalMaterial({
        color: 0x22D3EE,
        transparent: true,
        opacity: 0.72,
        roughness: 0.1,
        transmission: 0.7
      });
      const smallVacPositions = [
        { x: -1.15, y: 0.65, z: 0.38, r: 0.24 },
        { x: 1.05, y: -0.75, z: 0.32, r: 0.27 },
        { x: -0.85, y: -0.82, z: -0.22, r: 0.2 },
        { x: 0.95, y: 0.72, z: -0.28, r: 0.22 }
      ];
      smallVacPositions.forEach((p, idx) => {
        const sv = new THREE.Mesh(new THREE.SphereGeometry(p.r, 20, 20), smallVacMat);
        sv.position.set(p.x, p.y, p.z);
        sv.userData = { organelleId: 'vacuole', name: 'Small Vacuole' };
        group.add(sv);
        if (idx === 0) organelleMeshesMapRef.current.set('vacuole', sv);
      });

      // 5. Numerous Mitochondria
      const mitoMat = new THREE.MeshStandardMaterial({ map: mitoTex, roughness: 0.4 });
      const mitoGeo = new THREE.CapsuleGeometry(0.14, 0.28, 8, 16);
      const mitoPositions = [
        { x: -1.25, y: -0.22, z: 0.24, rot: 0.7 },
        { x: 1.25, y: 0.24, z: 0.28, rot: -0.5 },
        { x: -0.42, y: 1.05, z: -0.12, rot: 1.2 },
        { x: 0.42, y: -1.15, z: 0.22, rot: -0.9 }
      ];
      mitoPositions.forEach((pos, idx) => {
        const mMesh = new THREE.Mesh(mitoGeo, mitoMat);
        mMesh.position.set(pos.x, pos.y, pos.z);
        mMesh.rotation.set(0.4, 0.3, pos.rot);
        mMesh.userData = { organelleId: 'mitochondria', name: 'Mitochondria' };
        group.add(mMesh);
        if (idx === 0) organelleMeshesMapRef.current.set('mitochondria', mMesh);
      });

      // 6. Centrosome with Paired Centrioles (Microtubule triplets)
      const centrioleMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, roughness: 0.3 });
      const c1 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.32, 12), centrioleMat);
      c1.position.set(0.68, 0.78, 0.22);
      group.add(c1);

      const c2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.32, 12), centrioleMat);
      c2.position.set(0.68, 0.78, 0.22);
      c2.rotation.z = Math.PI / 2;
      group.add(c2);

      // Notice: NO cell wall and NO chloroplasts added!

    } else if (target === 'moon') {
      // 3D Moon with craters
      const moonGeo = new THREE.SphereGeometry(2.2, 48, 48);
      const moonCanvas = document.createElement('canvas');
      moonCanvas.width = 512;
      moonCanvas.height = 256;
      const mctx = moonCanvas.getContext('2d');
      if (mctx) {
        mctx.fillStyle = '#CCCCCC';
        mctx.fillRect(0, 0, 512, 256);
        mctx.fillStyle = '#777777';
        [
          { x: 180, y: 100, r: 40 },
          { x: 260, y: 120, r: 30 },
          { x: 290, y: 150, r: 35 },
          { x: 130, y: 140, r: 32 },
        ].forEach(m => {
          mctx.beginPath();
          mctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          mctx.fill();
        });
      }
      const moonTex = new THREE.CanvasTexture(moonCanvas);
      const moonMat = new THREE.MeshStandardMaterial({
        map: moonTex,
        roughness: 0.85,
        wireframe: isWireframe
      });
      const moonMesh = new THREE.Mesh(moonGeo, moonMat);
      group.add(moonMesh);

      const ringGeo = new THREE.RingGeometry(2.6, 2.7, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38BDF8, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    } else if (target === 'earth') {
      // 3D Earth
      const earthGeo = new THREE.SphereGeometry(2.4, 48, 48);
      const earthCanvas = document.createElement('canvas');
      earthCanvas.width = 512;
      earthCanvas.height = 256;
      const ectx = earthCanvas.getContext('2d');
      if (ectx) {
        ectx.fillStyle = '#1D4ED8';
        ectx.fillRect(0, 0, 512, 256);
        ectx.fillStyle = '#15803D';
        [
          { x: 140, y: 90, w: 100, h: 70 },
          { x: 160, y: 150, w: 60, h: 70 },
          { x: 380, y: 80, w: 80, h: 60 },
          { x: 400, y: 160, w: 60, h: 80 },
        ].forEach(c => {
          ectx.beginPath();
          ectx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
          ectx.fill();
        });
      }
      const earthTex = new THREE.CanvasTexture(earthCanvas);
      const earthMat = new THREE.MeshStandardMaterial({
        map: earthTex,
        roughness: 0.5,
        wireframe: isWireframe
      });
      const earthMesh = new THREE.Mesh(earthGeo, earthMat);
      earthMesh.rotation.z = THREE.MathUtils.degToRad(23.5);
      group.add(earthMesh);

      const glowGeo = new THREE.SphereGeometry(2.55, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.2, side: THREE.BackSide });
      group.add(new THREE.Mesh(glowGeo, glowMat));
    } else if (target === 'eclipse') {
      const sunGeo = new THREE.SphereGeometry(1.6, 24, 24);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B });
      const sunM = new THREE.Mesh(sunGeo, sunMat);
      sunM.position.set(3.8, 0, 0);
      group.add(sunM);

      const moonGeo = new THREE.SphereGeometry(0.8, 24, 24);
      const moonMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const moonM = new THREE.Mesh(moonGeo, moonMat);
      moonM.position.set(0.8, 0, 0);
      group.add(moonM);

      const earthGeo = new THREE.SphereGeometry(1.4, 24, 24);
      const earthMat = new THREE.MeshStandardMaterial({ color: 0x2563EB });
      const earthM = new THREE.Mesh(earthGeo, earthMat);
      earthM.position.set(-2.6, 0, 0);
      group.add(earthM);
    } else {
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.8, 1.2, 8);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.8, roughness: 0.2 });
      const baseM = new THREE.Mesh(baseGeo, baseMat);
      group.add(baseM);

      const cabinGeo = new THREE.DodecahedronGeometry(1.1);
      const cabinMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.6 });
      const cabinM = new THREE.Mesh(cabinGeo, cabinMat);
      cabinM.position.y = 1.3;
      group.add(cabinM);
    }

    group.position.set(holoPos.x, holoPos.y, 0);
    group.scale.set(hologramScale, hologramScale, hologramScale);
    scene.add(group);
    activeMeshRef.current = group;
  };

  useEffect(() => {
    if (threeSceneRef.current) {
      loadHologramMesh(selectedTarget, threeSceneRef.current);
    }
  }, [selectedTarget, isWireframe, isDissected]);

  useEffect(() => {
    if (activeMeshRef.current) {
      activeMeshRef.current.position.set(holoPos.x, holoPos.y, 0);
    }
  }, [holoPos]);

  useEffect(() => {
    if (dirLightRef.current) {
      if (selectedTarget === 'moon') {
        const rad = THREE.MathUtils.degToRad(lunarPhaseAngle);
        dirLightRef.current.position.set(Math.cos(rad) * 10, 0, Math.sin(rad) * 10);
      } else {
        dirLightRef.current.position.set(5, 5, 7);
      }
    }
  }, [lunarPhaseAngle, selectedTarget]);

  // Raycaster click on canvas to magnify organelle
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvas3dRef.current;
    if (!canvas || !threeCameraRef.current || !activeMeshRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, threeCameraRef.current);

    const intersects = raycaster.intersectObjects(activeMeshRef.current.children, true);
    if (intersects.length > 0) {
      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && curr !== activeMeshRef.current) {
          if (curr.userData && curr.userData.organelleId) {
            const org = ORGANELLES_DATA.find(o => o.id === curr!.userData.organelleId);
            if (org) {
              setSelectedOrganelle(org);
              zoomToOrganelle(org.focusCoord, 3500);
              return;
            }
          }
          curr = curr.parent;
        }
      }
    }
  };

  // Drag interaction to move hologram in AR view
  const handleCanvasDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const ny = -((e.clientY - rect.top) / rect.height - 0.5) * 4;
    setHoloPos({ x: nx, y: ny });
  };

  // Camera start/stop
  const startCamera = async () => {
    soundEffects.playScannerBeep();
    setCameraError(null);
    setIsScanning(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access is not supported by your browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      setIsScanning(false);
      soundEffects.playHologramActivate();
      onUnlockBadge?.('badge_ar_pioneer');
    } catch (err: unknown) {
      setIsScanning(false);
      const message = err instanceof Error ? err.message : 'Camera permission was denied.';
      setCameraError(message);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    soundEffects.playClick();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Snapshot Capture
  const handleTakeSnapshot = () => {
    soundEffects.playCameraShutter();
    if (!canvas3dRef.current) return;

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = 1280;
    snapCanvas.height = 720;
    const sctx = snapCanvas.getContext('2d');
    if (!sctx) return;

    if (cameraActive && videoRef.current) {
      sctx.drawImage(videoRef.current, 0, 0, 1280, 720);
    } else {
      sctx.fillStyle = '#090D16';
      sctx.fillRect(0, 0, 1280, 720);
    }

    sctx.drawImage(canvas3dRef.current, 0, 0, 1280, 720);

    sctx.fillStyle = '#10B981';
    sctx.font = 'bold 20px monospace';
    sctx.fillText(`Bina Bangsa School AR · ${selectedTarget.toUpperCase().replace('_', ' ')} · ${magnificationMultiplier}x`, 40, 680);

    const dataUrl = snapCanvas.toDataURL('image/png');
    setSnapshotTaken(dataUrl);
    soundEffects.playFanfare();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Augmented Reality Science Hub */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-sky-50/80 to-indigo-50/90 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm relative overflow-hidden backdrop-blur-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-950 text-xs font-bold shadow-2xs">
                <Microscope className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cambridge Stage 6 & BBS Primary 6 Biology (6Bs.01/02)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 border border-sky-300/80 text-sky-950 text-xs font-bold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Ultra-Realistic 3D WebGL PBR Specimen</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight font-serif-display">
              Living Plant & Animal Cell 3D Holographic AR
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore living plant and animal cells under high-resolution simulated electron microscopy. Click any organelle to magnify up to <strong>5,000x</strong>, view interactive anatomical labels, and master Cambridge Stage 6 examination questions.
            </p>
          </div>

          {/* Category Switcher & Quick Target Selector */}
          <div className="p-3 bg-white/95 rounded-2xl border border-emerald-200/80 shadow-xs shrink-0 w-full sm:w-auto space-y-2.5">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Select 3D Hologram:
              </span>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveCategory('cells');
                    setSelectedTarget('plant_cell');
                    resetZoom();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeCategory === 'cells'
                      ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-emerald-700 bg-slate-50'
                  }`}
                >
                  Micro Cell AR
                </button>
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    setActiveCategory('space');
                    setSelectedTarget('moon');
                    resetZoom();
                  }}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeCategory === 'space'
                      ? 'bg-sky-600 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-sky-700 bg-slate-50'
                  }`}
                >
                  Space AR
                </button>
              </div>
            </div>

            {/* Target Buttons */}
            {activeCategory === 'cells' ? (
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {[
                  { id: 'plant_cell', label: 'Plant Cell (3D)', icon: Leaf, sub: 'Cell Wall · Chloroplasts' },
                  { id: 'animal_cell', label: 'Animal Cell (3D)', icon: Microscope, sub: 'Flexible · No Cell Wall' },
                ].map(t => {
                  const Icon = t.icon;
                  const isSelected = selectedTarget === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedTarget(t.id as ArTarget);
                        resetZoom();
                        soundEffects.playHologramActivate();
                      }}
                      className={`flex flex-col items-start p-2.5 rounded-xl border text-xs transition-all text-left ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold scale-[1.02]'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.label}</span>
                      </div>
                      <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {t.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
                {[
                  { id: 'moon', label: '3D Moon Sphere', icon: Moon },
                  { id: 'earth', label: '3D Earth Globe', icon: Globe },
                  { id: 'eclipse', label: 'Eclipse Umbra', icon: Sun },
                  { id: 'rover', label: 'Lunar Rover', icon: Compass },
                ].map(t => {
                  const Icon = t.icon;
                  const isSelected = selectedTarget === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedTarget(t.id as ArTarget);
                        resetZoom();
                        soundEffects.playHologramActivate();
                      }}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] transition-all ${
                        isSelected
                          ? 'bg-sky-600 text-white border-sky-600 shadow-2xs font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AR Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('microscope_lab');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'microscope_lab'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
            }`}
          >
            <Microscope className="w-3.5 h-3.5 text-emerald-300" />
            <span>Compound Microscope (40x – 1,000x)</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('camera_ar');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'camera_ar'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera AR Projection</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('hologram_sandbox');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hologram_sandbox'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Spatial Sandbox</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('comparison');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'comparison'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Plant vs Animal Comparison Matrix</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('cards');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cards'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AR Printable Target Cards</span>
          </button>
        </div>

        {/* View Controls: Cross-Section Dissection, Labels & Wireframe */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              soundEffects.playClick();
              setIsDissected(!isDissected);
            }}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
              isDissected ? 'bg-emerald-100 text-emerald-950 border-emerald-300 font-bold' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {isDissected ? 'Cross-Section Cutaway' : 'Full 3D Envelope'}
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setShowLabels(!showLabels);
            }}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all flex items-center gap-1 ${
              showLabels ? 'bg-sky-100 text-sky-950 border-sky-300 font-bold' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            <Tag className="w-3 h-3 text-sky-600" />
            <span>{showLabels ? 'Labels ON' : 'Labels OFF'}</span>
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
              isWireframe ? 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {isWireframe ? 'Solid Surface' : 'X-Ray Wireframe'}
          </button>
        </div>
      </div>

      {/* TAB 1: Live WebCam AR Projection */}
      {activeTab === 'camera_ar' && (
        <div className="space-y-4">
          {/* Main AR Viewport Stage */}
          <div
            ref={stageContainerRef}
            onMouseMove={handleCanvasDrag}
            className="relative w-full aspect-[16/9] min-h-[460px] max-h-[620px] rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-300 shadow-md flex items-center justify-center select-none"
          >
            {/* Background Layer 1: Real-World Camera Stream */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Background Layer 2: Simulated Lab Classroom Wallpaper if camera is disabled */}
            {!cameraActive && (
              <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                  <Camera className="w-10 h-10 text-emerald-300 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Simulated Holographic Stage Ready</h3>
                  <p className="text-xs text-slate-300 max-w-md">
                    Click <strong>"Start Camera AR Mode"</strong> below to project the 3D {selectedTarget === 'plant_cell' ? 'Plant Cell' : selectedTarget === 'animal_cell' ? 'Animal Cell' : selectedTarget} directly onto your classroom desk! Or click any organelle directly to magnify up to 5,000x!
                  </p>
                </div>
              </div>
            )}

            {/* Layer 3: Interactive 3D WebGL Canvas Overlay with Click-to-Magnify */}
            <canvas
              ref={canvas3dRef}
              onClick={handleCanvasClick}
              className="absolute inset-0 w-full h-full z-10 pointer-events-auto cursor-pointer"
            />

            {/* Layer 4: Dynamic 3D Floating Organelle Labels */}
            {showLabels && (selectedTarget === 'plant_cell' || selectedTarget === 'animal_cell') && (
              <div className="absolute inset-0 z-20 pointer-events-none">
                {labelPositions.map(label => {
                  const isSelected = selectedOrganelle.id === label.id;
                  return (
                    <div
                      key={label.id}
                      style={{
                        left: `${label.x}px`,
                        top: `${label.y}px`,
                        transform: 'translate(-50%, -100%)'
                      }}
                      className="absolute transition-transform duration-75 pointer-events-auto"
                    >
                      <button
                        onClick={() => {
                          const org = ORGANELLES_DATA.find(o => o.id === label.id);
                          if (org) {
                            setSelectedOrganelle(org);
                            zoomToOrganelle(org.focusCoord, 3500);
                          }
                        }}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-md transition-all whitespace-nowrap border ${
                          isSelected
                            ? 'bg-emerald-500 text-white border-white scale-110 ring-2 ring-emerald-300'
                            : 'bg-slate-900/85 hover:bg-slate-900 text-white border-slate-700/80 hover:scale-105'
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                        <span>{label.name}</span>
                        <ZoomIn className="w-3 h-3 text-slate-300" />
                      </button>
                      <div className="w-1.5 h-1.5 bg-white border border-slate-900 rounded-full mx-auto -mt-0.5" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* Layer 5: AR Scanner HUD Overlay */}
            <div className="absolute inset-0 z-25 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
              {/* Top HUD Bar */}
              <div className="flex items-center justify-between">
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-400/40 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>SPECIMEN: {selectedTarget.toUpperCase().replace('_', ' ')}</span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-[11px] font-mono text-sky-300 flex items-center gap-2">
                  <Microscope className="w-3.5 h-3.5 text-sky-400" />
                  <span>MAGNIFICATION: {magnificationMultiplier.toLocaleString()}x</span>
                </div>
              </div>

              {/* Magnified Organelle Focus Reticle */}
              {magnificationMultiplier > 1000 && (
                <div className="self-center flex flex-col items-center justify-center space-y-2 animate-in fade-in">
                  <div className="w-44 h-44 border-2 border-emerald-400/70 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <div className="w-24 h-24 border border-dashed border-emerald-300 rounded-full animate-spin-slow" />
                  </div>
                  <div className="bg-slate-950/90 border border-emerald-400/40 px-3 py-1 rounded-xl text-emerald-300 font-mono text-xs flex items-center gap-2">
                    <Target className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>MAGNIFIED: {selectedOrganelle.name.toUpperCase()} ({magnificationMultiplier}x)</span>
                  </div>
                </div>
              )}

              {/* Bottom HUD Bar */}
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                    CLICK ON ANY CELL PART TO ZOOM IN
                  </div>

                  {magnificationMultiplier > 1000 && (
                    <button
                      onClick={resetZoom}
                      className="flex items-center gap-1 text-[11px] font-bold text-amber-200 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 px-3 py-1 rounded-lg transition-all"
                    >
                      <ZoomOut className="w-3 h-3 text-amber-400" />
                      <span>Reset to 1,000x</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  Bina Bangsa AR Science Laboratory
                </div>
              </div>
            </div>
          </div>

          {/* AR Controls & Tools Toolbar */}
          <div className="bg-white/95 rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Left: Camera Start/Stop Button & Photo Snap */}
            <div className="flex items-center gap-3">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>{isScanning ? 'Starting Camera...' : 'Start Camera AR Mode'}</span>
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Stop Camera</span>
                </button>
              )}

              {/* Snapshot Button */}
              <button
                onClick={handleTakeSnapshot}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs shadow-2xs transition-all active:scale-95"
              >
                <Scan className="w-3.5 h-3.5 text-indigo-600" />
                <span>Snap AR Photo</span>
              </button>
            </div>

            {/* Center: Microscope Magnification Quick Steps */}
            {(selectedTarget === 'plant_cell' || selectedTarget === 'animal_cell') && (
              <div className="flex items-center gap-1.5 text-xs font-semibold bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <span className="text-slate-500 px-2 text-[11px]">Zoom:</span>
                {[
                  { mag: 1000, label: '1,000x Overview' },
                  { mag: 2500, label: '2,500x Cell' },
                  { mag: 3500, label: '3,500x Focus' },
                  { mag: 5000, label: '5,000x TEM' },
                ].map(step => (
                  <button
                    key={step.mag}
                    onClick={() => {
                      soundEffects.playClick();
                      if (step.mag === 1000) {
                        resetZoom();
                      } else {
                        zoomToOrganelle(selectedOrganelle.focusCoord, step.mag);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs transition-all ${
                      magnificationMultiplier === step.mag
                        ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {step.label}
                  </button>
                ))}
              </div>
            )}

            {/* Right: Sliders for Scale & Rotation */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span>Scale:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={hologramScale}
                  onChange={e => setHologramScale(Number(e.target.value))}
                  className="w-20 accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="font-mono text-emerald-800 text-[11px]">{hologramScale.toFixed(1)}x</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Spin:</span>
                <input
                  type="range"
                  min="0"
                  max="2.5"
                  step="0.2"
                  value={hologramRotationSpeed}
                  onChange={e => setHologramRotationSpeed(Number(e.target.value))}
                  className="w-16 accent-emerald-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="font-mono text-emerald-800 text-[11px]">{hologramRotationSpeed.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          {/* Interactive Organelle Inspector Drawer */}
          {(selectedTarget === 'plant_cell' || selectedTarget === 'animal_cell') && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-sm text-indigo-950">
                      Organelle Anatomy & Examination Inspector
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Click any organelle below to automatically magnify and focus on it in the 3D specimen.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Active Specimen:</span>
                  <span className="font-bold px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-200">
                    {selectedTarget === 'plant_cell' ? '🌿 Plant Cell (Elodea)' : '🐾 Animal Cell (Epithelial)'}
                  </span>
                </div>
              </div>

              {/* Organelle selector pills with live zoom action */}
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                {ORGANELLES_DATA.map(org => {
                  const isSelected = selectedOrganelle.id === org.id;
                  const isAbsentInCurrent =
                    (selectedTarget === 'animal_cell' && org.category === 'plant_only') ||
                    (selectedTarget === 'plant_cell' && org.category === 'animal_only');

                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedOrganelle(org);
                        zoomToOrganelle(org.focusCoord, 3500);
                      }}
                      className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs font-bold scale-[1.03] ring-2 ring-emerald-200'
                          : isAbsentInCurrent
                          ? 'bg-slate-100 text-slate-400 border-slate-200 line-through opacity-60'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: isSelected ? '#FFFFFF' : org.color }}
                      />
                      <span>{org.name}</span>
                      {isAbsentInCurrent && <span className="text-[10px] text-rose-500 font-mono">(Absent)</span>}
                    </button>
                  );
                })}
              </div>

              {/* Detailed Magnified Organelle Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50/80 via-white to-sky-50/70 border border-emerald-100 space-y-3 text-xs shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-100/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: selectedOrganelle.color }}
                    />
                    <div>
                      <h4 className="font-extrabold text-base text-emerald-950 flex items-center gap-2">
                        <span>{selectedOrganelle.name}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                          {selectedOrganelle.sizeUm}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">{selectedOrganelle.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-xl ${
                        selectedOrganelle.category === 'plant_only'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : selectedOrganelle.category === 'animal_only'
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                    >
                      {selectedOrganelle.category === 'plant_only'
                        ? '🌿 Plant Cell Only'
                        : selectedOrganelle.category === 'animal_only'
                        ? '🐾 Animal Cell Only'
                        : '🧬 Both Plant & Animal'}
                    </span>

                    <button
                      onClick={() => zoomToOrganelle(selectedOrganelle.focusCoord, 3500)}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shadow-2xs"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Magnify 3,500x</span>
                    </button>
                  </div>
                </div>

                {/* Function & Stain Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Primary Biological Function:
                    </span>
                    <p className="text-slate-700 leading-relaxed text-xs">
                      {selectedOrganelle.function}
                    </p>
                  </div>

                  <div className="space-y-1 bg-white/80 p-3 rounded-xl border border-slate-200/70">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkle className="w-3 h-3 text-sky-600" />
                      Microscopy & Staining Technique:
                    </span>
                    <p className="text-slate-600 text-xs">
                      {selectedOrganelle.stainMethod}
                    </p>
                  </div>
                </div>

                {/* Cambridge & BBS Examination Tip */}
                <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 text-amber-950 text-xs space-y-1 leading-relaxed">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cambridge Primary Science Stage 6 & BBS Exam Standard:</span>
                  </div>
                  <p>{selectedOrganelle.cambridgeExamTip}</p>
                  <p className="text-[11px] text-amber-800 font-medium italic pt-1 border-t border-amber-200/60">
                    {selectedOrganelle.examQuestion}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Snapshot Preview Modal if photo captured */}
          {snapshotTaken && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Classroom AR Photo Captured!</span>
                </div>
                <a
                  href={snapshotTaken}
                  download="Bina_Bangsa_AR_Science_Lab.png"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xs hover:bg-emerald-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </a>
              </div>

              <div className="w-full max-h-80 rounded-2xl overflow-hidden border border-slate-200">
                <img src={snapshotTaken} alt="AR Snapshot" className="w-full h-full object-contain bg-slate-950" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Compound Optical Microscope Simulation (40x – 1,000x) */}
      {activeTab === 'microscope_lab' && <VirtualMicroscopeLab />}

      {/* TAB 3: 3D Spatial Sandbox */}
      {activeTab === 'hologram_sandbox' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-2xs space-y-3">
            <h3 className="font-bold text-base text-indigo-950 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Plant Cell Ultrastructure (Cambridge Stage 6)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Plant cells are characterized by their rigid cellulose <strong>cell wall</strong>, which gives them a regular fixed shape, and their <strong>large central vacuole</strong> which maintains turgor pressure against wilting.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="p-2.5 bg-emerald-50 rounded-xl"><strong>Photosynthesis Center:</strong> Chloroplasts contain chlorophyll to trap sunlight energy.</div>
              <div className="p-2.5 bg-emerald-50 rounded-xl"><strong>Vacuole Volume:</strong> Up to 90% of mature plant cell volume is occupied by the central vacuole filled with cell sap.</div>
              <div className="p-2.5 bg-emerald-50 rounded-xl"><strong>Permeability:</strong> Cell wall is freely permeable; cell membrane is selectively permeable.</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-2xs space-y-3">
            <h3 className="font-bold text-base text-indigo-950 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-rose-600" />
              <span>Animal Cell Functional Dynamics</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Animal cells lack a rigid cell wall, giving them an <strong>irregular and flexible shape</strong> that permits cell movement, phagocytosis, and tissue deformation.
            </p>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="p-2.5 bg-rose-50 rounded-xl"><strong>No Chloroplasts:</strong> Animals are heterotrophs (consumers) and cannot synthesize glucose from sunlight.</div>
              <div className="p-2.5 bg-rose-50 rounded-xl"><strong>Small Vacuoles:</strong> Multiple tiny temporary vacuoles store digested food droplets or waste.</div>
              <div className="p-2.5 bg-rose-50 rounded-xl"><strong>Membrane Plasticity:</strong> Allows red blood cells to squeeze through narrow capillaries.</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Plant vs Animal Cell Comparison Matrix */}
      {activeTab === 'comparison' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-2xs space-y-3">
            <h3 className="font-bold text-base text-indigo-950 flex items-center gap-2">
              <Microscope className="w-4 h-4 text-emerald-600" />
              <span>Diagnostic Comparison Matrix: Plant Cell vs. Animal Cell</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Memorizing this comparison matrix is essential for full marks in Cambridge Stage 6 and Primary 6 Science Section B open-ended questions.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 pt-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3">Cell Part / Organelle</th>
                    <th className="p-3 text-emerald-800 bg-emerald-50">Plant Cell</th>
                    <th className="p-3 text-rose-800 bg-rose-50">Animal Cell</th>
                    <th className="p-3">Scientific Function & Significance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">Cell Wall</td>
                    <td className="p-3 bg-emerald-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present (Cellulose)
                    </td>
                    <td className="p-3 bg-rose-50/50 font-bold text-rose-600">
                      <span className="flex items-center gap-1"><X className="w-4 h-4 text-rose-500" /> Absent</span>
                    </td>
                    <td className="p-3 text-slate-600">Provides support and regular fixed shape; prevents bursting under high water intake.</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">Cell Membrane</td>
                    <td className="p-3 bg-emerald-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present
                    </td>
                    <td className="p-3 bg-rose-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present
                    </td>
                    <td className="p-3 text-slate-600">Partially permeable barrier; controls passage of substances into and out of cell.</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">Cytoplasm</td>
                    <td className="p-3 bg-emerald-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present
                    </td>
                    <td className="p-3 bg-rose-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present
                    </td>
                    <td className="p-3 text-slate-600">Jelly-like medium where metabolic chemical reactions and cytoplasmic streaming occur.</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">Nucleus</td>
                    <td className="p-3 bg-emerald-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present
                    </td>
                    <td className="p-3 bg-rose-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present
                    </td>
                    <td className="p-3 text-slate-600">Contains genetic material (DNA/chromosomes); controls all cell activities and division.</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">Chloroplasts</td>
                    <td className="p-3 bg-emerald-50/50 font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" /> Present (green parts)
                    </td>
                    <td className="p-3 bg-rose-50/50 font-bold text-rose-600">
                      <span className="flex items-center gap-1"><X className="w-4 h-4 text-rose-500" /> Absent</span>
                    </td>
                    <td className="p-3 text-slate-600">Contains chlorophyll to absorb light energy for photosynthesis. (Absent in roots/onions).</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">Vacuole</td>
                    <td className="p-3 bg-emerald-50/50 font-bold text-emerald-700">
                      One Large Central Vacuole
                    </td>
                    <td className="p-3 bg-rose-50/50 font-bold text-slate-700">
                      Small, Numerous & Temporary
                    </td>
                    <td className="p-3 text-slate-600">Plant vacuole holds cell sap, maintaining turgidity; animal vacuoles hold transient food/waste.</td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-indigo-950">Overall Shape</td>
                    <td className="p-3 bg-emerald-50/50 font-semibold text-emerald-900">
                      Regular, Fixed rectangular shape
                    </td>
                    <td className="p-3 bg-rose-50/50 font-semibold text-rose-900">
                      Irregular, Flexible rounded shape
                    </td>
                    <td className="p-3 text-slate-600">Fixed shape is maintained by the non-elastic cellulose wall.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Printable AR Target Cards */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
            <div className="font-bold text-sm">Classroom AR Target Cards</div>
            <p className="text-slate-600 mt-1">
              Print or display these cards on another screen. Point your camera at them to lock 3D microscopic cells or celestial bodies into AR mode!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'c_plant', title: 'Target 1: Plant Cell (Elodea)', code: '6Bs.01', theme: 'Life Sciences', icon: Leaf, color: 'bg-emerald-100 text-emerald-800' },
              { id: 'c_animal', title: 'Target 2: Animal Cell (Cheek)', code: '6Bs.02', theme: 'Life Sciences', icon: Microscope, color: 'bg-rose-100 text-rose-800' },
              { id: 'c1', title: 'Target 3: Moon Phases', code: '6Es.01', theme: 'Cycles', icon: Moon, color: 'bg-sky-100 text-sky-800' },
              { id: 'c2', title: 'Target 4: Earth Globe', code: '6Es.02', theme: 'Earth & Space', icon: Globe, color: 'bg-blue-100 text-blue-800' },
              { id: 'c3', title: 'Target 5: Solar Eclipse', code: '6Es.03', theme: 'Interactions', icon: Sun, color: 'bg-amber-100 text-amber-800' },
              { id: 'c4', title: 'Target 6: Apollo Lander', code: 'TWS 6TWSm.01', theme: 'Technology', icon: Compass, color: 'bg-indigo-100 text-indigo-800' },
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.id} className="bg-white rounded-3xl p-5 border-2 border-dashed border-emerald-200 text-center space-y-3 shadow-2xs">
                  <div className={`w-16 h-16 mx-auto rounded-2xl ${card.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-indigo-950">{card.title}</h4>
                    <span className="text-[11px] font-mono text-emerald-800">{card.code} · {card.theme}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Point AR camera directly at this target card to project 3D hologram.
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
