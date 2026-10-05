import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Play, Pause, RotateCcw, Compass, HelpCircle, CheckCircle2,
  Sparkles, Award, BookOpen, Eye, Volume2, Info, Moon, Sun, Globe, Scan
} from 'lucide-react';
import { soundEffects } from '../../utils/sound';

interface Props {
  onRecordExperiment?: () => void;
  onUnlockBadge?: (badgeId: string) => void;
  onLaunchAr?: () => void;
}

interface MoonPhaseInfo {
  name: string;
  angle: number; // in degrees from 0 to 360
  day: number;
  description: string;
  illumination: string;
  riseTime: string;
  p6Rule: string;
}

const LUNAR_PHASES: MoonPhaseInfo[] = [
  {
    name: 'New Moon',
    angle: 0,
    day: 0,
    description: 'The Moon is between Earth and Sun. The illuminated side faces away from Earth; Moon is invisible or a dark silhouette.',
    illumination: '0%',
    riseTime: 'Rises at Sunrise (6:00 AM)',
    p6Rule: 'The dark unlit side of the Moon faces Earth. The Moon does not produce its own light; it only reflects sunlight.'
  },
  {
    name: 'Waxing Crescent',
    angle: 45,
    day: 3.7,
    description: 'A thin silver sliver illuminated on the right side grows (waxes) larger each night in the western sky after sunset.',
    illumination: '25%',
    riseTime: 'Rises mid-morning (9:00 AM)',
    p6Rule: '"Waxing" means growing larger in illumination. The right side is lit in the Northern Hemisphere.'
  },
  {
    name: 'First Quarter (Half Moon)',
    angle: 90,
    day: 7.4,
    description: 'One half of the visible Moon surface is lit (right side). The Moon has completed one quarter of its orbit around Earth.',
    illumination: '50%',
    riseTime: 'Rises at Noon (12:00 PM)',
    p6Rule: 'Called "First Quarter" because the Moon has traveled 1/4 of its total orbit, even though half the disk is visible.'
  },
  {
    name: 'Waxing Gibbous',
    angle: 135,
    day: 11.1,
    description: 'More than half but not fully illuminated. "Gibbous" comes from the Latin word for humpbacked.',
    illumination: '75%',
    riseTime: 'Rises mid-afternoon (3:00 PM)',
    p6Rule: 'Illumination continues to grow towards full illumination.'
  },
  {
    name: 'Full Moon',
    angle: 180,
    day: 14.8,
    description: 'Earth is between the Sun and Moon. The entire sunlit hemisphere of the Moon faces Earth.',
    illumination: '100%',
    riseTime: 'Rises at Sunset (6:00 PM)',
    p6Rule: 'The Moon, Earth, and Sun are in a straight line with Earth in the middle. Highest brightness.'
  },
  {
    name: 'Waning Gibbous',
    angle: 225,
    day: 18.5,
    description: 'The illuminated portion begins to decrease ("wane"). More than half is still lit, now on the left side.',
    illumination: '75%',
    riseTime: 'Rises mid-evening (9:00 PM)',
    p6Rule: '"Waning" means shrinking or decreasing in illumination. The left side remains illuminated.'
  },
  {
    name: 'Third / Last Quarter',
    angle: 270,
    day: 22.1,
    description: 'Half of the Moon is lit on the left side. The Moon has completed 3/4 of its orbit around Earth.',
    illumination: '50%',
    riseTime: 'Rises at Midnight (12:00 AM)',
    p6Rule: 'Completed 3/4 of the synodic cycle. Visible in the early morning sky.'
  },
  {
    name: 'Waning Crescent',
    angle: 315,
    day: 25.8,
    description: 'A thin crescent lit on the left side, visible in the east just before dawn, slimming towards New Moon.',
    illumination: '25%',
    riseTime: 'Rises before Dawn (3:00 AM)',
    p6Rule: 'Final visible crescent before repeating the 29.5-day cycle.'
  }
];

export const EarthMoon3DLab: React.FC<Props> = ({ onRecordExperiment, onUnlockBadge, onLaunchAr }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [orbitAngle, setOrbitAngle] = useState<number>(45); // in degrees
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'space' | 'earth'>('space');
  const [eclipseMode, setEclipseMode] = useState<'none' | 'solar' | 'lunar'>('none');
  const [showRays, setShowRays] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(1);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const moonMeshRef = useRef<THREE.Mesh | null>(null);
  const moonPivotRef = useRef<THREE.Group | null>(null);
  const sunlightRef = useRef<THREE.DirectionalLight | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const orbitLineRef = useRef<THREE.Line | null>(null);
  const earthAtmosphereRef = useRef<THREE.Mesh | null>(null);
  const shadowConeRef = useRef<THREE.Mesh | null>(null);
  const reqAnimRef = useRef<number | null>(null);

  // Current calculated lunar phase based on angle
  const normalizedAngle = ((orbitAngle % 360) + 360) % 360;
  const currentDay = (normalizedAngle / 360) * 29.5;

  // Closest phase
  const closestPhase = LUNAR_PHASES.reduce((prev, curr) => {
    const diffPrev = Math.abs(prev.angle - normalizedAngle);
    const diffCurr = Math.abs(curr.angle - normalizedAngle);
    return diffCurr < diffPrev ? curr : prev;
  });

  // Setup Three.js 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 460;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070913); // Deep cosmic midnight

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 24, 38);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 300;
      starPositions[i + 1] = (Math.random() - 0.5) * 300;
      starPositions[i + 2] = (Math.random() - 0.5) * 300;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xDDDDFF, size: 0.8, transparent: true, opacity: 0.75 });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // 5. Ambient Light (Subtle cosmic fill so dark side is visible for P6 students)
    const ambientLight = new THREE.AmbientLight(0x222638, 0.4);
    scene.add(ambientLight);

    // 6. The Sun (Directional sunlight from the Right: +X direction)
    const sunLight = new THREE.DirectionalLight(0xFFF9E6, 3.2);
    sunLight.position.set(45, 0, 0);
    sunLight.target.position.set(0, 0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);
    scene.add(sunLight.target);
    sunlightRef.current = sunLight;

    // Sun Visual Sphere & Corona Glow
    const sunGeo = new THREE.SphereGeometry(4.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xFFD13B });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(48, 0, 0);
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // Sun Glow Halo
    const glowGeo = new THREE.SphereGeometry(6.0, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xFFAA00,
      transparent: true,
      opacity: 0.25,
      side: THREE.BackSide
    });
    const sunGlow = new THREE.Mesh(glowGeo, glowMat);
    sunMesh.add(sunGlow);

    // 7. Earth Globe
    const earthRadius = 3.6;
    const earthGeo = new THREE.SphereGeometry(earthRadius, 48, 48);

    // Procedural Earth canvas texture with oceans, continents, and cloud swirls
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const ctx = earthCanvas.getContext('2d');
    if (ctx) {
      // Ocean deep blue
      ctx.fillStyle = '#104e8b';
      ctx.fillRect(0, 0, 1024, 512);

      // Continent green/brown patches
      ctx.fillStyle = '#2e8b57';
      const continents = [
        { x: 250, y: 180, w: 220, h: 140 }, // Eurasia
        { x: 300, y: 280, w: 120, h: 140 }, // Africa
        { x: 750, y: 160, w: 140, h: 120 }, // N America
        { x: 800, y: 300, w: 110, h: 140 }, // S America
        { x: 420, y: 360, w: 90, h: 70 },   // Australia
      ];
      continents.forEach(c => {
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Ice caps
      ctx.fillStyle = '#f0f8ff';
      ctx.fillRect(0, 0, 1024, 30);
      ctx.fillRect(0, 482, 1024, 30);

      // White cloud wisps
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.ellipse(Math.random() * 1024, Math.random() * 512, 60 + Math.random() * 80, 10 + Math.random() * 15, Math.random() * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const earthTexture = new THREE.CanvasTexture(earthCanvas);

    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.1
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.castShadow = true;
    earthMesh.receiveShadow = true;
    earthMesh.rotation.z = THREE.MathUtils.degToRad(23.5); // 23.5° axial tilt
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Atmospheric Glow
    const atmosGeo = new THREE.SphereGeometry(earthRadius * 1.05, 32, 32);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const earthAtmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    earthMesh.add(earthAtmosphere);
    earthAtmosphereRef.current = earthAtmosphere;

    // Earth's Axis of Rotation Line
    const axisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -6, 0),
      new THREE.Vector3(0, 6, 0)
    ]);
    const axisMat = new THREE.LineDashedMaterial({ color: 0x66B2FF, dashSize: 0.5, gapSize: 0.3 });
    const axisLine = new THREE.Line(axisGeo, axisMat);
    axisLine.computeLineDistances();
    earthMesh.add(axisLine);

    // 8. Moon Orbit Pivot Group
    const moonOrbitGroup = new THREE.Group();
    scene.add(moonOrbitGroup);
    moonPivotRef.current = moonOrbitGroup;

    // Moon Orbit Circular Track Line
    const orbitRadius = 16.0;
    const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius, 0, Math.PI * 2, false, 0);
    const orbitPoints = orbitCurve.getPoints(100);
    const orbitPoints3D = orbitPoints.map(p => new THREE.Vector3(p.x, 0, p.y));
    const orbitLineGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints3D);
    const orbitLineMat = new THREE.LineBasicMaterial({ color: 0x4B5563, transparent: true, opacity: 0.6 });
    const orbitLine = new THREE.Line(orbitLineGeo, orbitLineMat);
    scene.add(orbitLine);
    orbitLineRef.current = orbitLine;

    // 9. Moon Sphere with Procedural Craters
    const moonRadius = 1.35;
    const moonGeo = new THREE.SphereGeometry(moonRadius, 32, 32);

    const moonCanvas = document.createElement('canvas');
    moonCanvas.width = 512;
    moonCanvas.height = 256;
    const mctx = moonCanvas.getContext('2d');
    if (mctx) {
      mctx.fillStyle = '#CCCCCC';
      mctx.fillRect(0, 0, 512, 256);

      // Dark basalt maria
      mctx.fillStyle = '#777777';
      const maria = [
        { x: 180, y: 100, r: 35 }, // Mare Imbrium
        { x: 240, y: 120, r: 28 }, // Mare Serenitatis
        { x: 280, y: 130, r: 30 }, // Mare Tranquillitatis
        { x: 140, y: 130, r: 32 }, // Oceanus Procellarum
      ];
      maria.forEach(m => {
        mctx.beginPath();
        mctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        mctx.fill();
      });

      // Small impact craters
      mctx.strokeStyle = '#555555';
      mctx.lineWidth = 2;
      for (let i = 0; i < 40; i++) {
        const cx = Math.random() * 512;
        const cy = Math.random() * 256;
        const cr = 2 + Math.random() * 8;
        mctx.beginPath();
        mctx.arc(cx, cy, cr, 0, Math.PI * 2);
        mctx.stroke();
      }
    }
    const moonTexture = new THREE.CanvasTexture(moonCanvas);

    const moonMat = new THREE.MeshStandardMaterial({
      map: moonTexture,
      roughness: 0.9,
      metalness: 0.05
    });
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.castShadow = true;
    moonMesh.receiveShadow = true;
    moonOrbitGroup.add(moonMesh);
    moonMeshRef.current = moonMesh;

    // 10. Phase Marker Nodes on Orbit
    const markerGroup = new THREE.Group();
    scene.add(markerGroup);
    LUNAR_PHASES.forEach((phase) => {
      const rad = THREE.MathUtils.degToRad(phase.angle);
      const mx = Math.cos(rad) * orbitRadius;
      const mz = -Math.sin(rad) * orbitRadius;
      const markerGeo = new THREE.SphereGeometry(0.35, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0x93C5FD, transparent: true, opacity: 0.7 });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.set(mx, 0, mz);
      markerGroup.add(marker);
    });

    // Handle mouse drag rotation on the 3D canvas
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      if (cameraRef.current) {
        const cam = cameraRef.current;
        const radius = Math.sqrt(cam.position.x ** 2 + cam.position.y ** 2 + cam.position.z ** 2);
        let theta = Math.atan2(cam.position.x, cam.position.z);
        let phi = Math.acos(Math.max(-1, Math.min(1, cam.position.y / radius)));

        theta -= deltaX * 0.008;
        phi = Math.max(0.15, Math.min(Math.PI - 0.15, phi - deltaY * 0.008));

        cam.position.x = radius * Math.sin(phi) * Math.sin(theta);
        cam.position.y = radius * Math.cos(phi);
        cam.position.z = radius * Math.sin(phi) * Math.cos(theta);
        cam.lookAt(0, 0, 0);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 460;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let angleAcc = orbitAngle;
    const animate = () => {
      reqAnimRef.current = requestAnimationFrame(animate);

      // Rotate Earth on axis
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += 0.006;
      }

      // Render
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update Moon Position when orbitAngle changes
  useEffect(() => {
    if (!moonMeshRef.current) return;
    const orbitRadius = 16.0;
    const rad = THREE.MathUtils.degToRad(orbitAngle);
    // Sun is at +X (angle 0 corresponds to New Moon, when Moon is between Earth (0,0,0) and Sun (+X, 0, 0))
    const moonX = Math.cos(rad) * orbitRadius;
    const moonZ = -Math.sin(rad) * orbitRadius;
    moonMeshRef.current.position.set(moonX, 0, moonZ);

    // Tidal locking: Moon always faces Earth
    moonMeshRef.current.rotation.y = rad + Math.PI / 2;
  }, [orbitAngle]);

  // Handle Play/Pause timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setOrbitAngle(prev => (prev + 0.45 * simulationSpeed) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isPlaying, simulationSpeed]);

  // Handle camera perspective change
  useEffect(() => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (viewMode === 'space') {
      cam.position.set(0, 24, 38);
      cam.lookAt(0, 0, 0);
    } else {
      // Earth-based perspective looking outward toward the Moon
      const rad = THREE.MathUtils.degToRad(orbitAngle);
      const orbitRadius = 16.0;
      const moonX = Math.cos(rad) * orbitRadius;
      const moonZ = -Math.sin(rad) * orbitRadius;
      // Position camera near Earth surface
      cam.position.set(0, 4.2, 0);
      cam.lookAt(moonX, 0, moonZ);
    }
  }, [viewMode, orbitAngle]);

  const handleSelectPhase = (phase: MoonPhaseInfo, idx: number) => {
    soundEffects.playOrbitTick();
    setOrbitAngle(phase.angle);
    setSelectedPhaseIdx(idx);
    setIsPlaying(false);
    onRecordExperiment?.();

    if (phase.name === 'Full Moon' || phase.name === 'New Moon') {
      soundEffects.playPhaseUnlock();
      onUnlockBadge?.('badge_moon_astronomer');
    }
  };

  const handleTogglePlay = () => {
    soundEffects.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    soundEffects.playClick();
    setOrbitAngle(0);
    setIsPlaying(false);
    setViewMode('space');
    setEclipseMode('none');
  };

  return (
    <div className="bg-white/95 rounded-3xl border border-indigo-100/80 overflow-hidden shadow-sm backdrop-blur-xs">
      {/* Simulation Header with Pastel Accents */}
      <div className="px-6 py-4.5 border-b border-indigo-100/70 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-sky-50/80 via-indigo-50/40 to-amber-50/60">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-indigo-200/80 text-indigo-950 shadow-2xs">
              <Moon className="w-4 h-4 fill-indigo-800" />
            </span>
            <h2 className="text-lg font-bold text-indigo-950 tracking-tight">
              3D Earth Science: Moon Phases & Orbit Laboratory
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Interactive real-time 3D simulation of the Sun-Earth-Moon orbital geometry and lunar cycles.
          </p>
        </div>

        {/* Live Status Indicators in Soft Pastel Badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/90 px-3 py-1.5 rounded-xl border border-indigo-100 shadow-2xs text-indigo-950">
            <span className="text-slate-500">Lunar Day:</span>
            <span className="font-mono font-bold text-indigo-900 tabular-nums">
              Day {currentDay.toFixed(1)} / 29.5
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/90 px-3 py-1.5 rounded-xl border border-indigo-100 shadow-2xs text-indigo-950">
            <span className="text-slate-500">Current Phase:</span>
            <span className="font-bold text-indigo-800">
              {closestPhase.name}
            </span>
          </div>

          {onLaunchAr && (
            <button
              onClick={() => {
                soundEffects.playHologramActivate();
                onLaunchAr();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>View in AR 📱</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 3D Canvas & Earth Observer Split Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-indigo-100/80">
        {/* Left Zone: 3D WebGL Canvas */}
        <div className="lg:col-span-8 relative min-h-[460px] bg-slate-950 flex flex-col justify-between overflow-hidden">
          {/* Three.js Mounting DOM */}
          <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing w-full h-full" />

          {/* Top Canvas HUD Overlay */}
          <div className="relative z-10 p-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            {/* Sun Direction Indicator */}
            <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-spin-slow" />
              <span>Sunlight Direction: From Right (+X)</span>
            </div>

            {/* View Mode Switcher */}
            <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setViewMode('space');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'space' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Space Orbit View (3D)
              </button>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  setViewMode('earth');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'earth' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Earth Surface View
              </button>
            </div>
          </div>

          {/* Bottom Floating Canvas Guidance */}
          <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
            <span className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
              🖱️ Drag to rotate 3D space · Scroll to zoom
            </span>
            <span className="text-[11px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs font-mono">
              Orbit Angle: {normalizedAngle.toFixed(0)}°
            </span>
          </div>
        </div>

        {/* Right Zone: Earth-Bound Sky View (What P6 Students See from Ground) */}
        <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="font-bold text-xs text-indigo-950 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-600" />
                <span>Observer's Sky View (From Earth)</span>
              </div>
              <span className="text-[10px] font-mono bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full font-bold">
                {closestPhase.illumination} Lit
              </span>
            </div>

            {/* Stylized Lunar Disk Rendered as Seen From Earth */}
            <div className="bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center space-y-3 shadow-inner border border-slate-800">
              <div className="w-28 h-28 rounded-full bg-slate-900 relative overflow-hidden border-2 border-slate-700 shadow-md flex items-center justify-center">
                {/* Visual representation of illuminated crescent / gibbous */}
                {closestPhase.name === 'New Moon' && (
                  <div className="w-full h-full rounded-full bg-slate-950 opacity-95" />
                )}
                {closestPhase.name === 'Waxing Crescent' && (
                  <div className="w-full h-full relative">
                    <div className="w-full h-full rounded-full bg-slate-950" />
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-amber-100 rounded-r-full" />
                    <div className="absolute inset-0 bg-slate-950 rounded-full scale-x-75" />
                  </div>
                )}
                {closestPhase.name === 'First Quarter (Half Moon)' && (
                  <div className="w-full h-full relative flex">
                    <div className="w-1/2 h-full bg-slate-950" />
                    <div className="w-1/2 h-full bg-amber-100" />
                  </div>
                )}
                {closestPhase.name === 'Waxing Gibbous' && (
                  <div className="w-full h-full relative">
                    <div className="w-full h-full rounded-full bg-amber-100" />
                    <div className="absolute left-0 top-0 w-1/4 h-full bg-slate-950 rounded-l-full" />
                  </div>
                )}
                {closestPhase.name === 'Full Moon' && (
                  <div className="w-full h-full rounded-full bg-amber-100 shadow-lg shadow-amber-200/50 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-amber-200/40 border border-amber-300/40" />
                  </div>
                )}
                {closestPhase.name === 'Waning Gibbous' && (
                  <div className="w-full h-full relative">
                    <div className="w-full h-full rounded-full bg-amber-100" />
                    <div className="absolute right-0 top-0 w-1/4 h-full bg-slate-950 rounded-r-full" />
                  </div>
                )}
                {closestPhase.name === 'Third / Last Quarter' && (
                  <div className="w-full h-full relative flex">
                    <div className="w-1/2 h-full bg-amber-100" />
                    <div className="w-1/2 h-full bg-slate-950" />
                  </div>
                )}
                {closestPhase.name === 'Waning Crescent' && (
                  <div className="w-full h-full relative">
                    <div className="w-full h-full rounded-full bg-slate-950" />
                    <div className="absolute left-0 top-0 w-1/2 h-full bg-amber-100 rounded-l-full" />
                    <div className="absolute inset-0 bg-slate-950 rounded-full scale-x-75" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-0.5">
                <div className="text-sm font-bold text-white tracking-wide">
                  {closestPhase.name}
                </div>
                <div className="text-[11px] text-amber-300 font-mono">
                  {closestPhase.riseTime}
                </div>
              </div>
            </div>

            {/* Scientific Concept & P6 Answering Tip */}
            <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 text-xs space-y-1.5 shadow-2xs">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Cambridge Stage 6 Concept:</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {closestPhase.description}
              </p>
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-900 leading-normal">
                <strong>P6 Exam Rule:</strong> {closestPhase.p6Rule}
              </div>
            </div>
          </div>

          {/* Lunar Orbit Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-600 font-semibold">
              <span>Orbit Position:</span>
              <span className="font-mono text-indigo-900">{normalizedAngle.toFixed(0)}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={normalizedAngle}
              onChange={e => {
                setOrbitAngle(Number(e.target.value));
                setIsPlaying(false);
                soundEffects.playOrbitTick();
              }}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Day 0 (New Moon)</span>
              <span>Day 14.8 (Full)</span>
              <span>Day 29.5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & 8 Phase Milestones Bar */}
      <div className="p-5 sm:p-6 bg-white space-y-4">
        {/* Playback Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 ${
                isPlaying ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300' : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-amber-900" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'Pause Orbit' : 'Play Orbit'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Reset Orbit to New Moon (0°)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Orbit Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <span className="text-slate-400 text-[11px] px-1.5">Speed:</span>
              {[1, 2, 4].map(spd => (
                <button
                  key={spd}
                  onClick={() => {
                    soundEffects.playClick();
                    setSimulationSpeed(spd);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${
                    simulationSpeed === spd ? 'bg-white text-indigo-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEffects.playCosmicChime();
                onRecordExperiment?.();
                onUnlockBadge?.('badge_moon_astronomer');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-sky-900 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-sky-600" />
              <span>Log Astronomy Observation (+25 XP)</span>
            </button>
          </div>
        </div>

        {/* 8 Lunar Phase Milestone Quick Selectors */}
        <div className="space-y-1.5">
          <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>The 8 Moon Phases (Click to jump & test observation):</span>
            <span className="text-[11px] font-normal text-slate-400">Total cycle: 29.5 days</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {LUNAR_PHASES.map((phase, idx) => {
              const isSelected = closestPhase.name === phase.name;
              return (
                <button
                  key={phase.name}
                  onClick={() => handleSelectPhase(phase, idx)}
                  className={`p-2.5 rounded-2xl text-left border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-200 text-indigo-950 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400">Day {phase.day.toFixed(0)}</span>
                    <span className="text-[10px] font-bold text-indigo-600">{phase.illumination}</span>
                  </div>
                  <div className="text-[11px] leading-tight font-semibold line-clamp-1">
                    {phase.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
