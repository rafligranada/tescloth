import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Eye, BookOpen, RotateCcw } from 'lucide-react';
import { SubsystemId } from '../types/editorial';
import { SUBSYSTEMS } from '../data/articles';
import {
  createCarMaterialLibrary,
  PAINT_PRESETS,
  PaintPresetId,
} from '../three/carMaterials';
import { buildCarAssembly } from '../three/carGeometry';

interface CarInspection3DProps {
  initialSubsystem?: SubsystemId;
  onOpenArticle: (slug: string) => void;
  compact?: boolean;
}

const _desiredCamPos = new THREE.Vector3();
const _desiredTarget = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export const CarInspection3D: React.FC<CarInspection3DProps> = ({
  initialSubsystem = 'all',
  onOpenArticle,
  compact = false,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);

  const [activeSubsystem, setActiveSubsystem] = useState<SubsystemId>(initialSubsystem);
  const [xrayMode, setXrayMode] = useState(false);
  const [paintId, setPaintId] = useState<PaintPresetId>('cobalt');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglError, setWebglError] = useState(false);

  // Refs synced into the Three.js render-on-demand loop without tearing down scene
  const activeSubsystemRef = useRef<SubsystemId>(initialSubsystem);
  const xrayModeRef = useRef(false);
  const paintIdRef = useRef<PaintPresetId>('cobalt');
  const cameraAnimatingRef = useRef(false);
  const requestRenderRef = useRef<() => void>(() => {});
  const applyPaintRef = useRef<(id: PaintPresetId) => void>(() => {});

  useEffect(() => {
    activeSubsystemRef.current = initialSubsystem;
    setActiveSubsystem(initialSubsystem);
    if (initialSubsystem !== 'all' && (initialSubsystem === 'engine' || initialSubsystem === 'electrical' || initialSubsystem === 'ac')) {
      setXrayMode(true);
      xrayModeRef.current = true;
    }
    cameraAnimatingRef.current = true;
    requestRenderRef.current();
  }, [initialSubsystem]);

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return;

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 520;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1120);
    scene.fog = new THREE.FogExp2(0x0b1120, 0.048);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 60);
    const initialMeta = SUBSYSTEMS.find((s) => s.id === activeSubsystemRef.current) || SUBSYSTEMS[0];
    camera.position.set(...initialMeta.cameraPos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialMeta.cameraTarget);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.0;
    controls.maxDistance = 9.5;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.minPolarAngle = 0.18;
    controls.autoRotate = false;
    controls.update();

    // Warm/Cool 3-point studio lighting
    const hemi = new THREE.HemisphereLight(0xdbeafe, 0x1e293b, 0.65);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -4;
    keyLight.shadow.camera.right = 4;
    keyLight.shadow.camera.top = 4;
    keyLight.shadow.camera.bottom = -4;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 1.35);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    // Materials & Composite 3D Car Assembly
    const materials = createCarMaterialLibrary(renderer, isSoftwareGl);
    const car = buildCarAssembly(materials);
    scene.add(car.root);

    // Grounded workshop floor
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMesh = new THREE.Mesh(floorGeo, materials.floorMaterial);
    floorMesh.position.y = 0;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    applyPaintRef.current = (presetId: PaintPresetId) => {
      const p = PAINT_PRESETS[presetId];
      materials.bodyPaint.color.setHex(p.color);
      materials.bodyPaint.metalness = p.metalness;
      materials.bodyPaint.roughness = p.roughness;
      materials.hoodPaint.color.setHex(p.color);
      materials.hoodPaint.metalness = p.metalness;
      materials.hoodPaint.roughness = p.roughness;
      requestRenderRef.current();
    };
    applyPaintRef.current(paintIdRef.current);

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();
    let hoodLiftCurrent = xrayModeRef.current ? 1 : 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        if (disposed) return;
        renderDirty = false;
        const now = performance.now();
        const delta = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
        lastTime = now;

        // Smoothly damp hood lift (recessed engine bay exposes mechanical parts directly)
        const hoodTarget = xrayModeRef.current ? 1 : 0;
        hoodLiftCurrent = THREE.MathUtils.damp(hoodLiftCurrent, hoodTarget, 6.5, delta);
        car.hoodGroup.position.y = hoodLiftCurrent * 0.92;
        car.hoodGroup.position.x = -hoodLiftCurrent * 0.12;
        car.hoodGroup.rotation.z = hoodLiftCurrent * 0.42;
        materials.bodyPaint.transparent = hoodLiftCurrent > 0.05;
        materials.bodyPaint.opacity = 1 - hoodLiftCurrent * 0.25;

        // Smooth camera preset damping until arrival or user orbit start
        let stillAnimating = Math.abs(hoodLiftCurrent - hoodTarget) > 0.005;
        if (cameraAnimatingRef.current) {
          const meta =
            SUBSYSTEMS.find((s) => s.id === activeSubsystemRef.current) || SUBSYSTEMS[0];
          _desiredCamPos.set(...meta.cameraPos);
          _desiredTarget.set(...meta.cameraTarget);

          camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredCamPos.x, 5.5, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredCamPos.y, 5.5, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredCamPos.z, 5.5, delta);

          controls.target.x = THREE.MathUtils.damp(controls.target.x, _desiredTarget.x, 6.5, delta);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, _desiredTarget.y, 6.5, delta);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, _desiredTarget.z, 6.5, delta);

          if (
            camera.position.distanceTo(_desiredCamPos) < 0.03 &&
            controls.target.distanceTo(_desiredTarget) < 0.02
          ) {
            camera.position.copy(_desiredCamPos);
            controls.target.copy(_desiredTarget);
            cameraAnimatingRef.current = false;
          } else {
            stillAnimating = true;
          }
        }

        controls.update();
        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (stillAnimating || renderDirty) {
            requestRender();
          }
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;

    // Cancel camera glide when user grabs OrbitControls
    const onControlStart = () => {
      cameraAnimatingRef.current = false;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Raycasting on Layer 1 proxy hit-boxes
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // ignore orbit drag
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(car.hitProxies, false);
      if (hits.length > 0) {
        const subId = hits[0].object.userData.subsystemId as SubsystemId;
        if (subId) {
          activeSubsystemRef.current = subId;
          setActiveSubsystem(subId);
          if (subId === 'engine' || subId === 'electrical' || subId === 'ac') {
            xrayModeRef.current = true;
            setXrayMode(true);
          }
          cameraAnimatingRef.current = true;
          requestRender();
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 900;
      const h = mount.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', onResize);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };
    const onContextRestored = () => {
      requestRender();
    };
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
      controls.dispose();
      car.dispose();
      floorGeo.dispose();
      materials.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleSelectSubsystem = (id: SubsystemId) => {
    activeSubsystemRef.current = id;
    setActiveSubsystem(id);
    if (id === 'engine' || id === 'electrical' || id === 'ac') {
      xrayModeRef.current = true;
      setXrayMode(true);
    } else if (id === 'all' || id === 'body') {
      xrayModeRef.current = false;
      setXrayMode(false);
    }
    cameraAnimatingRef.current = true;
    requestRenderRef.current();
  };

  const handleToggleXray = () => {
    const next = !xrayMode;
    xrayModeRef.current = next;
    setXrayMode(next);
    requestRenderRef.current();
  };

  const handleSelectPaint = (id: PaintPresetId) => {
    paintIdRef.current = id;
    setPaintId(id);
    applyPaintRef.current(id);
  };

  const currentMeta = SUBSYSTEMS.find((s) => s.id === activeSubsystem) || SUBSYSTEMS[0];

  return (
    <div className="space-y-4">
      {/* Unobstructed 3D Viewport with Isolated Mount & Collapsible Bottom Dock */}
      <div
        className={`relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 ${
          compact ? 'h-[440px] sm:h-[500px]' : 'h-[500px] sm:h-[580px]'
        }`}
        data-testid="car-3d-viewport"
        data-active-subsystem={activeSubsystem}
        data-xray={String(xrayMode)}
      >
        {/* Dedicated Empty WebGL Container */}
        <div ref={canvasMountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

        {webglError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 p-6 text-center text-slate-200">
            <p className="font-display text-lg font-semibold">Mode Pratinjau 3D Tidak Tersedia</p>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Perangkat Anda membatasi akselerasi WebGL. Anda tetap dapat membaca seluruh panduan subsistem kendaraan di bawah ini.
            </p>
          </div>
        )}

        {/* Minimal Top-Left Spec Badge (No side panel clutter) */}
        <div className="pointer-events-none absolute top-4 left-4 right-4 flex items-start justify-between gap-4">
          <div className="rounded-lg border border-slate-700/80 bg-slate-900/90 px-3.5 py-2.5 text-white">
            <div className="font-mono-tabular text-[11px] font-medium uppercase tracking-wider text-blue-400">
              Model Inspeksi 3D
            </div>
            <div className="mt-0.5 text-sm font-semibold">{currentMeta.shortTitle}</div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectSubsystem('all')}
            aria-label="Reset sudut kamera 3D"
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/90 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-800"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>

        {/* Collapsible Bottom Control Dock (Zero backdrop-filter over WebGL) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex flex-col items-center px-3">
          <button
            type="button"
            onClick={() => setDockCollapsed((v) => !v)}
            className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/95 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800"
          >
            {dockCollapsed ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tampilkan Kontrol 3D</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sembunyikan Kontrol</span>
              </>
            )}
          </button>

          {!dockCollapsed && (
            <div className="pointer-events-auto w-full max-w-[900px] rounded-xl border border-slate-700/80 bg-slate-900/95 p-2.5 text-slate-100 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Subsystem Focus Buttons */}
                <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Pilih subsistem kendaraan">
                  {SUBSYSTEMS.map((sub) => {
                    const active = activeSubsystem === sub.id;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => handleSelectSubsystem(sub.id)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                          active
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>

                {/* X-Ray & Paint Finishes */}
                <div className="flex items-center gap-2 border-l border-slate-700 pl-2">
                  <button
                    type="button"
                    onClick={handleToggleXray}
                    aria-pressed={xrayMode}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                      xrayMode
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Bedah Bodi</span>
                  </button>

                  <div className="flex items-center gap-1.5 pl-1" role="group" aria-label="Warna cat bodi">
                    {(Object.keys(PAINT_PRESETS) as PaintPresetId[]).map((id) => {
                      const preset = PAINT_PRESETS[id];
                      const selected = paintId === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleSelectPaint(id)}
                          aria-label={`Warna ${preset.name}`}
                          title={preset.name}
                          className={`h-6 w-6 rounded-full border-2 transition-transform ${
                            selected ? 'scale-110 border-white' : 'border-slate-600 hover:scale-105'
                          }`}
                          style={{ backgroundColor: preset.hex }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostic Info Strip Below Canvas (Clean, zero canvas overlap) */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Catatan Teknis Subsistem · {currentMeta.label}
          </div>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-700">
            {currentMeta.description}{' '}
            <span className="font-medium text-slate-900">Tips cepat: {currentMeta.inspectionTip}</span>
          </p>
        </div>

        {currentMeta.relatedSlug && (
          <button
            type="button"
            onClick={() => onOpenArticle(currentMeta.relatedSlug!)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white whitespace-nowrap transition-colors hover:bg-slate-800"
          >
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            <span>Baca Panduan Lengkap</span>
          </button>
        )}
      </div>
    </div>
  );
};
