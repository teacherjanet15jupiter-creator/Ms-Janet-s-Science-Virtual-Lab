import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Camera, CameraOff, Sparkles, Award, Moon, Globe, Sun, RefreshCw,
  Sliders, Maximize2, Download, CheckCircle2, AlertCircle, Volume2,
  Scan, Layers, Compass, Eye, ShieldCheck, Heart
} from 'lucide-react';
import { soundEffects } from '../../utils/sound';
import { BinaBangsaLogo } from '../common/BinaBangsaLogo';

interface Props {
  onUnlockBadge?: (badgeId: string) => void;
}

type ArTarget = 'moon' | 'earth' | 'eclipse' | 'rover';

export const AugmentedRealityHub: React.FC<Props> = ({ onUnlockBadge }) => {
  const [activeTab, setActiveTab] = useState<'camera_ar' | 'hologram_sandbox' | 'cards'>('camera_ar');
  const [selectedTarget, setSelectedTarget] = useState<ArTarget>('moon');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hologramScale, setHologramScale] = useState<number>(1.2);
  const [hologramRotationSpeed, setHologramRotationSpeed] = useState<number>(1);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [lunarPhaseAngle, setLunarPhaseAngle] = useState<number>(180); // 180 = Full Moon, 0 = New Moon

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvas3dRef = useRef<HTMLCanvasElement>(null);
  const threeSceneRef = useRef<THREE.Scene | null>(null);
  const threeCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const threeRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const activeMeshRef = useRef<THREE.Group | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Hologram Position in 3D AR space (adjustable by drag)
  const [holoPos, setHoloPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize Three.js WebGL overlay canvas
  useEffect(() => {
    if (!canvas3dRef.current) return;
    const canvas = canvas3dRef.current;
    const width = canvas.parentElement?.clientWidth || 640;
    const height = canvas.parentElement?.clientHeight || 480;

    const scene = new THREE.Scene();
    threeSceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8);
    threeCameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    threeRendererRef.current = renderer;

    // Lights
    const ambient = new THREE.AmbientLight(0xFFFFFF, 0.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xFFF0DD, 2.5);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    dirLightRef.current = dirLight;

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

      if (activeMeshRef.current) {
        activeMeshRef.current.rotation.y += 0.008 * hologramRotationSpeed;
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

  // Update Hologram mesh when target changes
  const loadHologramMesh = (target: ArTarget, scene: THREE.Scene) => {
    if (activeMeshRef.current) {
      scene.remove(activeMeshRef.current);
      activeMeshRef.current = null;
    }

    const group = new THREE.Group();

    if (target === 'moon') {
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

      // Cyan holographic beacon ring
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

      // Atmosphere halo
      const glowGeo = new THREE.SphereGeometry(2.55, 32, 32);
      const glowMat = new THREE.MeshBasicMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.2, side: THREE.BackSide });
      group.add(new THREE.Mesh(glowGeo, glowMat));
    } else if (target === 'eclipse') {
      // Sun-Moon Eclipse Ray alignment
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
      // Apollo Lunar Lander stylized model
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
  }, [selectedTarget, isWireframe]);

  useEffect(() => {
    if (activeMeshRef.current) {
      activeMeshRef.current.scale.set(hologramScale, hologramScale, hologramScale);
      activeMeshRef.current.position.set(holoPos.x, holoPos.y, 0);
    }
  }, [hologramScale, holoPos]);

  useEffect(() => {
    if (dirLightRef.current) {
      if (selectedTarget === 'moon') {
        const rad = THREE.MathUtils.degToRad(lunarPhaseAngle);
        dirLightRef.current.position.set(Math.cos(rad) * 10, 0, Math.sin(rad) * 10);
      } else {
        dirLightRef.current.position.set(5, 3, 5);
      }
    }
  }, [lunarPhaseAngle, selectedTarget]);

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
      // Fallback to simulated room background
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

  // Drag interaction to move hologram in AR view
  const handleCanvasDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const ny = -((e.clientY - rect.top) / rect.height - 0.5) * 4;
    setHoloPos({ x: nx, y: ny });
  };

  // Snapshot Capture
  const handleTakeSnapshot = () => {
    soundEffects.playClick();
    soundEffects.playFanfare();

    // Composite video background and 3D WebGL canvas
    const compositeCanvas = document.createElement('canvas');
    compositeCanvas.width = 1280;
    compositeCanvas.height = 720;
    const cctx = compositeCanvas.getContext('2d');
    if (!cctx) return;

    if (cameraActive && videoRef.current) {
      cctx.drawImage(videoRef.current, 0, 0, 1280, 720);
    } else {
      // Draw simulated classroom wallpaper
      cctx.fillStyle = '#0f172a';
      cctx.fillRect(0, 0, 1280, 720);
      cctx.fillStyle = '#1e293b';
      cctx.fillRect(0, 520, 1280, 200); // Lab desk
    }

    if (canvas3dRef.current) {
      cctx.drawImage(canvas3dRef.current, 0, 0, 1280, 720);
    }

    // Watermark
    cctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    cctx.fillRect(20, 640, 520, 60);
    cctx.fillStyle = '#ffffff';
    cctx.font = 'bold 20px sans-serif';
    cctx.fillText('✨ Bina Bangsa School · Primary 6 AR Science Lab', 35, 675);

    const dataUrl = compositeCanvas.toDataURL('image/png');
    setSnapshotTaken(dataUrl);
    onUnlockBadge?.('badge_ar_pioneer');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: Augmented Reality Science Lab */}
      <div className="bg-gradient-to-r from-sky-50/90 via-indigo-50/80 to-purple-50/90 rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm relative overflow-hidden backdrop-blur-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/90 border border-sky-300 text-sky-950 text-xs font-bold shadow-2xs">
                <Scan className="w-3.5 h-3.5 text-sky-600" />
                <span>Primary 6 Augmented Reality (AR) Hub</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-950 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>Interactive 3D Holograms</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight font-serif-display">
              Bring the Moon & Earth into Your Classroom with AR!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Use your device camera to project 3D celestial holograms onto your desk or classroom floor.
              Examine lunar craters, rotate Earth's 23.5° axial tilt, and study solar eclipses up close.
            </p>
          </div>

          {/* Quick Target Selector in Header */}
          <div className="p-3 bg-white/90 rounded-2xl border border-sky-200/80 shadow-xs shrink-0 w-full sm:w-auto space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Choose 3D Hologram:
            </div>
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
          </div>
        </div>
      </div>

      {/* AR Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('camera_ar');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'camera_ar'
                ? 'bg-sky-600 text-white shadow-xs'
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
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Spatial Sandbox</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('cards');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cards'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-slate-200/70'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>AR Printable Target Cards</span>
          </button>
        </div>

        {/* Action Controls for Current Hologram */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
              isWireframe ? 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold' : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {isWireframe ? 'Solid Mesh' : 'Wireframe View'}
          </button>
        </div>
      </div>

      {/* TAB 1: Live WebCam AR Projection */}
      {activeTab === 'camera_ar' && (
        <div className="space-y-4">
          {/* Main AR Viewport Stage */}
          <div
            onMouseMove={handleCanvasDrag}
            className="relative w-full aspect-[16/9] min-h-[440px] max-h-[600px] rounded-3xl overflow-hidden bg-slate-950 border-2 border-sky-300 shadow-md flex items-center justify-center select-none"
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
                  <Camera className="w-10 h-10 text-sky-300 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold">Simulated Holographic Stage Ready</h3>
                  <p className="text-xs text-slate-300 max-w-md">
                    Click <strong>"Start Camera AR"</strong> below to project the 3D Moon directly into your classroom, or interact with the 3D model directly in this virtual stage!
                  </p>
                </div>
              </div>
            )}

            {/* Layer 3: Interactive 3D WebGL Canvas Overlay */}
            <canvas
              ref={canvas3dRef}
              className="absolute inset-0 w-full h-full z-10 pointer-events-auto cursor-move"
            />

            {/* Layer 4: AR Scanner HUD Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none p-4 sm:p-6 flex flex-col justify-between">
              {/* Top HUD Bar */}
              <div className="flex items-center justify-between">
                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-400/40 text-[11px] font-mono text-sky-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>AR LOCK: {selectedTarget.toUpperCase()}</span>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-[11px] font-mono text-slate-200">
                  Distance: 384,400 km
                </div>
              </div>

              {/* Center Target Crosshair Reticle */}
              <div className="self-center flex flex-col items-center justify-center space-y-2">
                <div className="w-40 h-40 border-2 border-dashed border-sky-400/50 rounded-full flex items-center justify-center animate-spin-slow">
                  <div className="w-20 h-20 border border-sky-300/60 rounded-full" />
                </div>
                <span className="text-[10px] font-mono bg-sky-950/80 px-2 py-0.5 rounded text-sky-300">
                  Drag with mouse / touch to reposition hologram
                </span>
              </div>

              {/* Bottom HUD Bar */}
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  POS: ({holoPos.x.toFixed(1)}, {holoPos.y.toFixed(1)}) · SCALE: {hologramScale.toFixed(1)}x
                </div>

                <div className="text-[10px] font-mono text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30">
                  Teacher Janet's AR Lab
                </div>
              </div>
            </div>
          </div>

          {/* AR Controls & Tools Toolbar */}
          <div className="bg-white/95 rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Left: Camera Start/Stop Button */}
            <div className="flex items-center gap-3">
              {!cameraActive ? (
                <button
                  onClick={startCamera}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
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

            {/* Right: Sliders for Scale & Rotation */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span>Hologram Size:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={hologramScale}
                  onChange={e => setHologramScale(Number(e.target.value))}
                  className="w-24 accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="font-mono text-sky-800 text-[11px]">{hologramScale.toFixed(1)}x</span>
              </div>

              <div className="flex items-center gap-2">
                <span>Spin Speed:</span>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.5"
                  value={hologramRotationSpeed}
                  onChange={e => setHologramRotationSpeed(Number(e.target.value))}
                  className="w-20 accent-sky-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
                <span className="font-mono text-sky-800 text-[11px]">{hologramRotationSpeed.toFixed(1)}x</span>
              </div>
            </div>
          </div>

          {/* Snapshot Preview Modal if photo captured */}
          {snapshotTaken && (
            <div className="bg-white rounded-3xl p-6 border border-sky-200 shadow-md space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-950 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Classroom AR Photo Captured!</span>
                </div>
                <a
                  href={snapshotTaken}
                  download="Bina_Bangsa_AR_Science_Lab.png"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold shadow-2xs hover:bg-sky-700"
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

      {/* TAB 2: 3D Spatial Sandbox */}
      {activeTab === 'hologram_sandbox' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-2xs space-y-3">
            <h3 className="font-bold text-base text-indigo-950 flex items-center gap-2">
              <Moon className="w-4 h-4 text-sky-600" />
              <span>3D Moon Internal Structure & Surface</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Moon has a solid iron-rich inner core, a semi-molten outer core, a rocky mantle, and an outer crust made of anorthosite rock.
              The dark smooth plains are called <strong>lunar maria</strong> (ancient solidified basalt lava).
            </p>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="p-2 bg-sky-50 rounded-xl"><strong>Diameter:</strong> 3,474 km (approx. 1/4 the width of Earth)</div>
              <div className="p-2 bg-sky-50 rounded-xl"><strong>Surface Gravity:</strong> 1/6 of Earth's gravity (1.62 m/s²)</div>
              <div className="p-2 bg-sky-50 rounded-xl"><strong>Atmosphere:</strong> Virtually none (exosphere vacuum, no weather, no wind)</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-sky-100 shadow-2xs space-y-3">
            <h3 className="font-bold text-base text-indigo-950 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-600" />
              <span>Solar & Lunar Eclipse Geometry</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eclipses happen when the Sun, Earth, and Moon form a straight syzygy line in space:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <strong className="text-amber-950">Solar Eclipse:</strong> Sun $\to$ Moon $\to$ Earth. The Moon casts its shadow (umbra) onto Earth, blocking the Sun in daytime.
              </div>
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200">
                <strong className="text-rose-950">Lunar Eclipse:</strong> Sun $\to$ Earth $\to$ Moon. Earth blocks sunlight from reaching the Moon during Full Moon; Moon turns reddish.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Printable AR Target Cards */}
      {activeTab === 'cards' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-950">
            <div className="font-bold text-sm">Classroom AR Target Cards</div>
            <p className="text-slate-600 mt-1">
              Print or display these cards on another screen. Point your camera at them to lock 3D celestial objects in AR mode!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'c1', title: 'Target 1: Moon Phases', code: '6Es.01', theme: 'Cycles', icon: Moon },
              { id: 'c2', title: 'Target 2: Earth Globe', code: '6Es.02', theme: 'Earth & Space', icon: Globe },
              { id: 'c3', title: 'Target 3: Solar Eclipse', code: '6Es.03', theme: 'Interactions', icon: Sun },
              { id: 'c4', title: 'Target 4: Apollo Lander', code: 'TWS 6TWSm.01', theme: 'Technology', icon: Compass },
            ].map(card => {
              const Icon = card.icon;
              return (
                <div key={card.id} className="bg-white rounded-3xl p-5 border-2 border-dashed border-sky-300 text-center space-y-3 shadow-2xs">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-sky-100 flex items-center justify-center text-sky-700">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-indigo-950">{card.title}</h4>
                    <span className="text-[11px] font-mono text-sky-700">{card.code} · {card.theme}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Point AR camera directly at this target card.
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
