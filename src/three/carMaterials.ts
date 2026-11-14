import * as THREE from 'three';

export type PaintPresetId = 'obsidian' | 'platinum' | 'cobalt' | 'crimson';

export const PAINT_PRESETS: Record<
  PaintPresetId,
  { name: string; hex: string; color: number; metalness: number; roughness: number }
> = {
  obsidian: { name: 'Obsidian Hitam', hex: '#1e293b', color: 0x1e293b, metalness: 0.78, roughness: 0.24 },
  platinum: { name: 'Platinum Perak', hex: '#cbd5e1', color: 0xcbd5e1, metalness: 0.85, roughness: 0.22 },
  cobalt: { name: 'Cobalt Biru', hex: '#1d4ed8', color: 0x1d4ed8, metalness: 0.76, roughness: 0.24 },
  crimson: { name: 'Crimson Merah', hex: '#b91c1c', color: 0xb91c1c, metalness: 0.72, roughness: 0.26 },
};

export interface CarMaterialLibrary {
  bodyPaint: THREE.MeshPhysicalMaterial;
  hoodPaint: THREE.MeshPhysicalMaterial;
  glass: THREE.MeshPhysicalMaterial;
  darkTrim: THREE.MeshStandardMaterial;
  tireRubber: THREE.MeshStandardMaterial;
  alloyRim: THREE.MeshStandardMaterial;
  brakeRotor: THREE.MeshStandardMaterial;
  caliper: THREE.MeshStandardMaterial;
  engineBlock: THREE.MeshStandardMaterial;
  engineAccent: THREE.MeshStandardMaterial;
  batteryCase: THREE.MeshStandardMaterial;
  copperTerminal: THREE.MeshStandardMaterial;
  condenser: THREE.MeshStandardMaterial;
  headlightEmissive: THREE.MeshStandardMaterial;
  taillightEmissive: THREE.MeshStandardMaterial;
  floorMaterial: THREE.MeshStandardMaterial;
  shadowPlaneMaterial: THREE.MeshBasicMaterial;
  textures: THREE.Texture[];
  dispose: () => void;
}

function createGarageFloorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
  ctx.lineWidth = 2;
  const step = 64;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(59, 130, 246, 0.22)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createBrakeRotorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const cx = size / 2;
  const cy = size / 2;
  const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 120);
  grad.addColorStop(0, '#475569');
  grad.addColorStop(0.55, '#94a3b8');
  grad.addColorStop(1, '#64748b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Cross-drilled cooling holes
  ctx.fillStyle = '#0f172a';
  for (let ring = 0; ring < 3; ring++) {
    const r = 56 + ring * 20;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + ring * 0.2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 22, 128, 128, 124);
  grad.addColorStop(0, 'rgba(2, 6, 23, 0.85)');
  grad.addColorStop(0.55, 'rgba(2, 6, 23, 0.45)');
  grad.addColorStop(1, 'rgba(2, 6, 23, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCarMaterialLibrary(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean
): CarMaterialLibrary {
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const floorTex = createGarageFloorTexture(maxAniso);
  const rotorTex = createBrakeRotorTexture(maxAniso);
  const shadowTex = createContactShadowTexture();

  const bodyPaint = new THREE.MeshPhysicalMaterial({
    color: PAINT_PRESETS.cobalt.color,
    metalness: PAINT_PRESETS.cobalt.metalness,
    roughness: PAINT_PRESETS.cobalt.roughness,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
  });

  const hoodPaint = bodyPaint.clone();

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    metalness: 0.1,
    roughness: 0.06,
    transmission: isSoftwareGl ? 0 : 0.72,
    transparent: true,
    opacity: isSoftwareGl ? 0.58 : 0.88,
    ior: 1.5,
    clearcoat: 1.0,
  });

  const darkTrim = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.22,
    roughness: 0.72,
  });

  const tireRubber = new THREE.MeshStandardMaterial({
    color: 0x111827,
    metalness: 0.05,
    roughness: 0.88,
  });

  const alloyRim = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.18,
  });

  const brakeRotor = new THREE.MeshStandardMaterial({
    map: rotorTex,
    metalness: 0.86,
    roughness: 0.28,
  });

  const caliper = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.55,
    roughness: 0.32,
  });

  const engineBlock = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    metalness: 0.8,
    roughness: 0.38,
  });

  const engineAccent = new THREE.MeshStandardMaterial({
    color: 0xdc2626,
    metalness: 0.35,
    roughness: 0.42,
  });

  const batteryCase = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.12,
    roughness: 0.65,
  });

  const copperTerminal = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.92,
    roughness: 0.2,
  });

  const condenser = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.32,
  });

  const headlightEmissive = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    emissive: 0xe0f2fe,
    emissiveIntensity: 1.8,
    roughness: 0.1,
  });

  const taillightEmissive = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 1.6,
    roughness: 0.18,
  });

  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.78,
    metalness: 0.12,
  });

  const shadowPlaneMaterial = new THREE.MeshBasicMaterial({
    map: shadowTex,
    transparent: true,
    depthWrite: false,
    opacity: 0.72,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  const allMaterials = [
    bodyPaint,
    hoodPaint,
    glass,
    darkTrim,
    tireRubber,
    alloyRim,
    brakeRotor,
    caliper,
    engineBlock,
    engineAccent,
    batteryCase,
    copperTerminal,
    condenser,
    headlightEmissive,
    taillightEmissive,
    floorMaterial,
    shadowPlaneMaterial,
  ];
  const textures = [floorTex, rotorTex, shadowTex];

  return {
    bodyPaint,
    hoodPaint,
    glass,
    darkTrim,
    tireRubber,
    alloyRim,
    brakeRotor,
    caliper,
    engineBlock,
    engineAccent,
    batteryCase,
    copperTerminal,
    condenser,
    headlightEmissive,
    taillightEmissive,
    floorMaterial,
    shadowPlaneMaterial,
    textures,
    dispose() {
      allMaterials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
    },
  };
}
