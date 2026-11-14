import * as THREE from 'three';
import { SubsystemId } from '../types/editorial';
import { CarMaterialLibrary } from './carMaterials';

export interface CarAssembly {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  hoodGroup: THREE.Group;
  wheels: THREE.Group[];
  hitProxies: THREE.Mesh[];
  subsystemHighlights: Record<Exclude<SubsystemId, 'all'>, THREE.Object3D>;
  dispose: () => void;
}

function createExtrudedBodyGeometry(): THREE.ExtrudeGeometry {
  // Side profile with recessed front engine bay (x: 0.72..2.02 drops to y: 0.44)
  // so lifting the hood exposes the engine, battery, and AC condenser cleanly.
  const shape = new THREE.Shape();
  shape.moveTo(-2.05, 0.26);
  shape.lineTo(2.02, 0.26);
  shape.quadraticCurveTo(2.14, 0.28, 2.15, 0.44);
  shape.lineTo(1.98, 0.48);
  shape.lineTo(0.86, 0.48); // recessed engine bay floor/firewall ledge
  shape.lineTo(0.76, 0.88); // firewall bulkhead up to cowl
  shape.lineTo(0.42, 1.28); // A-pillar / windshield
  shape.quadraticCurveTo(-0.15, 1.38, -0.82, 1.32); // roofline
  shape.lineTo(-1.62, 0.94); // C-pillar fastback
  shape.lineTo(-2.06, 0.84);
  shape.quadraticCurveTo(-2.14, 0.72, -2.05, 0.26);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 1.56,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.08,
    bevelThickness: 0.09,
  });
  geo.translate(0, 0, -0.78);
  geo.computeVertexNormals();
  return geo;
}

function createFrontFenderGeometry(): THREE.ExtrudeGeometry {
  const fender = new THREE.Shape();
  fender.moveTo(0.76, 0.3);
  fender.lineTo(2.06, 0.3);
  fender.quadraticCurveTo(2.14, 0.45, 2.08, 0.68);
  fender.quadraticCurveTo(1.68, 0.83, 0.88, 0.88);
  fender.lineTo(0.76, 0.88);
  fender.closePath();

  const geo = new THREE.ExtrudeGeometry(fender, {
    depth: 0.16,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.03,
    bevelThickness: 0.03,
  });
  geo.computeVertexNormals();
  return geo;
}

function createWheelSubAssembly(
  materials: CarMaterialLibrary,
  isLeft: boolean,
  geometriesToDispose: THREE.BufferGeometry[]
): THREE.Group {
  const wheelGroup = new THREE.Group();
  const sideSign = isLeft ? 1 : -1;

  // Tire
  const tireGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.24, 32);
  tireGeo.rotateX(Math.PI / 2);
  geometriesToDispose.push(tireGeo);
  const tireMesh = new THREE.Mesh(tireGeo, materials.tireRubber);
  tireMesh.castShadow = true;
  tireMesh.receiveShadow = true;
  wheelGroup.add(tireMesh);

  // Sidewall lip ring
  const lipGeo = new THREE.TorusGeometry(0.245, 0.025, 12, 28);
  geometriesToDispose.push(lipGeo);
  const lipMesh = new THREE.Mesh(lipGeo, materials.alloyRim);
  lipMesh.position.z = sideSign * 0.11;
  wheelGroup.add(lipMesh);

  // 5-Spoke Alloy Rim
  const hubGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 18);
  hubGeo.rotateX(Math.PI / 2);
  geometriesToDispose.push(hubGeo);
  const hubMesh = new THREE.Mesh(hubGeo, materials.alloyRim);
  wheelGroup.add(hubMesh);

  const spokeGeo = new THREE.BoxGeometry(0.045, 0.23, 0.03);
  geometriesToDispose.push(spokeGeo);
  for (let i = 0; i < 5; i++) {
    const spoke = new THREE.Mesh(spokeGeo, materials.alloyRim);
    const angle = (i / 5) * Math.PI * 2;
    spoke.position.set(
      Math.cos(angle) * 0.13,
      Math.sin(angle) * 0.13,
      sideSign * 0.105
    );
    spoke.rotation.z = angle + Math.PI / 2;
    wheelGroup.add(spoke);
  }

  // Cross-drilled Brake Rotor Disc
  const rotorGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.028, 28);
  rotorGeo.rotateX(Math.PI / 2);
  geometriesToDispose.push(rotorGeo);
  const rotorMesh = new THREE.Mesh(rotorGeo, materials.brakeRotor);
  rotorMesh.position.z = sideSign * 0.04;
  wheelGroup.add(rotorMesh);

  // Anodized Caliper
  const caliperGeo = new THREE.BoxGeometry(0.11, 0.16, 0.07);
  geometriesToDispose.push(caliperGeo);
  const caliperMesh = new THREE.Mesh(caliperGeo, materials.caliper);
  caliperMesh.position.set(-0.14, 0.08, sideSign * 0.045);
  caliperMesh.rotation.z = 0.45;
  wheelGroup.add(caliperMesh);

  return wheelGroup;
}

export function buildCarAssembly(materials: CarMaterialLibrary): CarAssembly {
  const root = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const hitProxies: THREE.Mesh[] = [];

  // 1. Primary Body Silhouette
  const bodyGroup = new THREE.Group();
  const bodyGeo = createExtrudedBodyGeometry();
  geometries.push(bodyGeo);
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.bodyPaint);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  bodyGroup.add(bodyMesh);

  // Left & Right Front Fenders flanking the open engine bay
  const fenderGeo = createFrontFenderGeometry();
  geometries.push(fenderGeo);
  const leftFender = new THREE.Mesh(fenderGeo, materials.bodyPaint);
  leftFender.position.z = 0.68;
  leftFender.castShadow = true;
  const rightFender = new THREE.Mesh(fenderGeo, materials.bodyPaint);
  rightFender.position.z = -0.84;
  rightFender.castShadow = true;
  bodyGroup.add(leftFender, rightFender);

  // Cabin Greenhouse Glass
  const cabinGeo = new THREE.BoxGeometry(1.75, 0.44, 1.38);
  geometries.push(cabinGeo);
  const cabinMesh = new THREE.Mesh(cabinGeo, materials.glass);
  cabinMesh.position.set(-0.28, 1.07, 0);
  bodyGroup.add(cabinMesh);

  // Underbody Chassis Floor + Side Skirts
  const chassisGeo = new THREE.BoxGeometry(4.15, 0.12, 1.62);
  geometries.push(chassisGeo);
  const chassisMesh = new THREE.Mesh(chassisGeo, materials.darkTrim);
  chassisMesh.position.set(0, 0.24, 0);
  chassisMesh.castShadow = true;
  root.add(chassisMesh);

  // Front Grille & LED Headlight Bar
  const grilleGeo = new THREE.BoxGeometry(0.14, 0.24, 1.18);
  geometries.push(grilleGeo);
  const grilleMesh = new THREE.Mesh(grilleGeo, materials.darkTrim);
  grilleMesh.position.set(2.14, 0.44, 0);
  bodyGroup.add(grilleMesh);

  const headlampGeo = new THREE.BoxGeometry(0.12, 0.07, 0.36);
  geometries.push(headlampGeo);
  const leftHead = new THREE.Mesh(headlampGeo, materials.headlightEmissive);
  leftHead.position.set(2.13, 0.62, 0.56);
  const rightHead = leftHead.clone();
  rightHead.position.z = -0.56;
  bodyGroup.add(leftHead, rightHead);

  // Rear LED Taillight Strip
  const tailGeo = new THREE.BoxGeometry(0.1, 0.07, 1.48);
  geometries.push(tailGeo);
  const tailMesh = new THREE.Mesh(tailGeo, materials.taillightEmissive);
  tailMesh.position.set(-2.09, 0.74, 0);
  bodyGroup.add(tailMesh);

  root.add(bodyGroup);

  // 2. Liftable / Explodable Hood Panel (Reveals Engine + Battery + AC)
  const hoodGroup = new THREE.Group();
  const hoodGeo = new THREE.BoxGeometry(1.12, 0.06, 1.44);
  geometries.push(hoodGeo);
  const hoodMesh = new THREE.Mesh(hoodGeo, materials.hoodPaint);
  hoodMesh.position.set(1.42, 0.87, 0);
  hoodMesh.rotation.z = -0.07;
  hoodMesh.castShadow = true;
  hoodGroup.add(hoodMesh);
  root.add(hoodGroup);

  // 3. Mechanical Engine Bay Subsystem
  const engineGroup = new THREE.Group();
  engineGroup.position.set(1.32, 0.54, 0);
  const blockGeo = new THREE.BoxGeometry(0.62, 0.34, 0.54);
  geometries.push(blockGeo);
  const blockMesh = new THREE.Mesh(blockGeo, materials.engineBlock);
  engineGroup.add(blockMesh);

  const valveCoverGeo = new THREE.BoxGeometry(0.54, 0.09, 0.34);
  geometries.push(valveCoverGeo);
  const valveCover = new THREE.Mesh(valveCoverGeo, materials.engineAccent);
  valveCover.position.y = 0.21;
  engineGroup.add(valveCover);

  // Intake manifold runners (4 tubes)
  const runnerGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.26, 12);
  geometries.push(runnerGeo);
  for (let i = 0; i < 4; i++) {
    const runner = new THREE.Mesh(runnerGeo, materials.alloyRim);
    runner.position.set(-0.18 + i * 0.12, 0.16, 0.26);
    runner.rotation.x = Math.PI / 3;
    engineGroup.add(runner);
  }
  root.add(engineGroup);

  // 4. Electrical 12V Battery & ECU Subsystem
  const electricalGroup = new THREE.Group();
  electricalGroup.position.set(1.36, 0.48, -0.46);
  const battGeo = new THREE.BoxGeometry(0.32, 0.24, 0.22);
  geometries.push(battGeo);
  const battMesh = new THREE.Mesh(battGeo, materials.batteryCase);
  electricalGroup.add(battMesh);

  const termGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.06, 12);
  geometries.push(termGeo);
  const posTerm = new THREE.Mesh(termGeo, materials.copperTerminal);
  posTerm.position.set(0.09, 0.14, 0.05);
  const negTerm = new THREE.Mesh(termGeo, materials.alloyRim);
  negTerm.position.set(-0.09, 0.14, 0.05);
  electricalGroup.add(posTerm, negTerm);
  root.add(electricalGroup);

  // 5. Front AC Condenser & Radiator Core
  const acGroup = new THREE.Group();
  acGroup.position.set(1.94, 0.48, 0);
  const condGeo = new THREE.BoxGeometry(0.08, 0.36, 1.02);
  geometries.push(condGeo);
  const condMesh = new THREE.Mesh(condGeo, materials.condenser);
  acGroup.add(condMesh);
  root.add(acGroup);

  // 6. Four Multi-Part Wheels (with Brake Discs & Calipers)
  const wheelCoords: [number, number, number, boolean][] = [
    [1.28, 0.35, 0.84, true],   // Front Left
    [1.28, 0.35, -0.84, false], // Front Right
    [-1.26, 0.35, 0.84, true],  // Rear Left
    [-1.26, 0.35, -0.84, false],// Rear Right
  ];

  const wheels: THREE.Group[] = [];
  wheelCoords.forEach(([x, y, z, isLeft]) => {
    const w = createWheelSubAssembly(materials, isLeft, geometries);
    w.position.set(x, y, z);
    root.add(w);
    wheels.push(w);
  });

  // 7. Ground Contact Shadow Plane (seated at y = 0.01)
  const shadowGeo = new THREE.PlaneGeometry(5.2, 2.7);
  shadowGeo.rotateX(-Math.PI / 2);
  geometries.push(shadowGeo);
  const shadowPlane = new THREE.Mesh(shadowGeo, materials.shadowPlaneMaterial);
  shadowPlane.position.y = 0.01;
  root.add(shadowPlane);

  // 8. Invisible Proxy Hit-Boxes on Layer 1 for Crisp Raycasting
  const proxySpecs: { id: Exclude<SubsystemId, 'all'>; size: [number, number, number]; pos: [number, number, number] }[] = [
    { id: 'engine', size: [0.8, 0.55, 0.7], pos: [1.32, 0.65, 0.05] },
    { id: 'brakes', size: [0.55, 0.55, 0.35], pos: [1.28, 0.35, 0.84] },
    { id: 'electrical', size: [0.5, 0.45, 0.4], pos: [1.36, 0.55, -0.46] },
    { id: 'tires', size: [0.8, 0.75, 0.4], pos: [-1.26, 0.35, 0.84] },
    { id: 'ac', size: [0.35, 0.5, 1.15], pos: [1.94, 0.48, 0] },
    { id: 'body', size: [1.8, 0.65, 1.4], pos: [-0.35, 1.05, 0] },
  ];

  const proxyMat = new THREE.MeshBasicMaterial({ visible: false });
  proxySpecs.forEach((spec) => {
    const pGeo = new THREE.BoxGeometry(...spec.size);
    geometries.push(pGeo);
    const proxy = new THREE.Mesh(pGeo, proxyMat);
    proxy.position.set(...spec.pos);
    proxy.layers.set(1);
    proxy.userData.subsystemId = spec.id;
    root.add(proxy);
    hitProxies.push(proxy);
  });

  return {
    root,
    bodyGroup,
    hoodGroup,
    wheels,
    hitProxies,
    subsystemHighlights: {
      engine: engineGroup,
      brakes: wheels[0],
      electrical: electricalGroup,
      tires: wheels[2],
      ac: acGroup,
      body: bodyGroup,
    },
    dispose() {
      geometries.forEach((g) => g.dispose());
      proxyMat.dispose();
    },
  };
}
