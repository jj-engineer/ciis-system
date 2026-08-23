// Script to generate a complete, high-detail binary GLB 3D Robot model matching the reference turnaround
const fs = require('fs');
const path = require('path');
const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

// Polyfill FileReader for Node.js
class FileReaderPolyfill {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = 'data:' + blob.type + ';base64,' + Buffer.from(buf).toString('base64');
      if (this.onload) this.onload({ target: this });
    });
  }
}
global.FileReader = FileReaderPolyfill;

console.log('Generating high-detail 3D GLB Robot model...');

const scene = new THREE.Scene();
scene.name = 'School_AI_Robot_Scene';

// 1. PBR Materials
const matWhiteArmor = new THREE.MeshStandardMaterial({
  name: 'Mat_White_Armor',
  color: 0xfcfcfd,
  metalness: 0.1,
  roughness: 0.14
});

const matDarkTitanium = new THREE.MeshStandardMaterial({
  name: 'Mat_Dark_Titanium',
  color: 0x1e293b,
  metalness: 0.9,
  roughness: 0.28
});

const matVisorGlass = new THREE.MeshStandardMaterial({
  name: 'Mat_Visor_Glass',
  color: 0x060709,
  metalness: 0.98,
  roughness: 0.04
});

const matCyanLed = new THREE.MeshStandardMaterial({
  name: 'Mat_Cyan_LED',
  color: 0x38bdf8,
  emissive: 0x0284c7,
  emissiveIntensity: 3.6,
  roughness: 0.1
});

const matCyanCore = new THREE.MeshStandardMaterial({
  name: 'Mat_Cyan_Core',
  color: 0x00f0ff,
  emissive: 0x00b4d8,
  emissiveIntensity: 4.5,
  roughness: 0.05
});

// 2. Master Robot Hierarchy
const robotRoot = new THREE.Group();
robotRoot.name = 'School_AI_Robot';
scene.add(robotRoot);

// --- Pelvis & Hips ---
const pelvis = new THREE.Group();
pelvis.name = 'Pelvis';
pelvis.position.set(0, -0.4, 0);
robotRoot.add(pelvis);

const pelvisCore = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.3, 0.28, 24), matDarkTitanium);
pelvisCore.name = 'Pelvis_Core';
pelvis.add(pelvisCore);

const groinPlate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.26, 0.18), matWhiteArmor);
groinPlate.name = 'Groin_Plate';
groinPlate.position.set(0, -0.02, 0.18);
pelvis.add(groinPlate);

const groinLed = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.02), matCyanLed);
groinLed.name = 'Groin_LED';
groinLed.position.set(0, -0.02, 0.28);
pelvis.add(groinLed);

const hipMountL = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matDarkTitanium);
hipMountL.name = 'Hip_Mount_L';
hipMountL.position.set(-0.35, -0.06, 0);
pelvis.add(hipMountL);

const hipMountR = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), matDarkTitanium);
hipMountR.name = 'Hip_Mount_R';
hipMountR.position.set(0.35, -0.06, 0);
pelvis.add(hipMountR);

// --- Torso & Chest ---
const torso = new THREE.Group();
torso.name = 'Torso';
torso.position.set(0, 0.18, 0);
pelvis.add(torso);

const spine = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.32, 20), matDarkTitanium);
spine.name = 'Spine_Column';
spine.position.set(0, -0.16, 0);
torso.add(spine);

const chestBase = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.44, 0.68, 24), matWhiteArmor);
chestBase.name = 'Chest_Base';
chestBase.scale.set(1.16, 1.0, 0.9);
chestBase.position.set(0, 0.22, 0);
torso.add(chestBase);

const pectL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.16), matWhiteArmor);
pectL.name = 'Chest_Armor_L';
pectL.position.set(-0.2, 0.28, 0.34);
pectL.rotation.y = 0.08;
torso.add(pectL);

const pectR = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.42, 0.16), matWhiteArmor);
pectR.name = 'Chest_Armor_R';
pectR.position.set(0.2, 0.28, 0.34);
pectR.rotation.y = -0.08;
torso.add(pectR);

const hexHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.07, 6), matDarkTitanium);
hexHousing.name = 'Hex_Reactor_Housing';
hexHousing.position.set(0, 0.25, 0.4);
hexHousing.rotation.x = Math.PI * 0.5;
torso.add(hexHousing);

const hexCore = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.09, 6), matCyanCore);
hexCore.name = 'Hex_Reactor_Core';
hexCore.position.set(0, 0.25, 0.43);
hexCore.rotation.x = Math.PI * 0.5;
torso.add(hexCore);

const conduitL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.02), matCyanLed);
conduitL.name = 'Conduit_L';
conduitL.position.set(-0.25, 0.4, 0.37);
conduitL.rotation.z = -0.18;
torso.add(conduitL);

const conduitR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.02), matCyanLed);
conduitR.name = 'Conduit_R';
conduitR.position.set(0.25, 0.4, 0.37);
conduitR.rotation.z = 0.18;
torso.add(conduitR);

// Rear back panels (360° turnaround detail)
const backScapulaL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.44, 0.14), matWhiteArmor);
backScapulaL.name = 'Back_Scapula_L';
backScapulaL.position.set(-0.18, 0.24, -0.34);
backScapulaL.rotation.y = -0.08;
torso.add(backScapulaL);

const backScapulaR = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.44, 0.14), matWhiteArmor);
backScapulaR.name = 'Back_Scapula_R';
backScapulaR.position.set(0.18, 0.24, -0.34);
backScapulaR.rotation.y = 0.08;
torso.add(backScapulaR);

const backSpine = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.48, 0.08), matDarkTitanium);
backSpine.name = 'Back_Spine';
backSpine.position.set(0, 0.22, -0.42);
torso.add(backSpine);

const backVent = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 10, 20), matCyanLed);
backVent.name = 'Back_Vent_LED';
backVent.position.set(0, 0.3, -0.43);
torso.add(backVent);

// --- Neck & Head ---
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 0.16, 20), matDarkTitanium);
neck.name = 'Neck';
neck.position.set(0, 0.58, 0);
torso.add(neck);

const head = new THREE.Group();
head.name = 'Head';
head.position.set(0, 0.8, 0);
torso.add(head);

const helmetDome = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 24), matWhiteArmor);
helmetDome.name = 'Helmet_Dome';
helmetDome.scale.set(1.15, 0.94, 0.98);
head.add(helmetDome);

const browPlate = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.2), matWhiteArmor);
browPlate.name = 'Brow_Plate';
browPlate.position.set(0, 0.34, 0.45);
head.add(browPlate);

const visor = new THREE.Mesh(new THREE.SphereGeometry(0.64, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.5), matVisorGlass);
visor.name = 'Visor';
visor.scale.set(1.06, 0.76, 0.64);
visor.position.set(0, 0.02, 0.44);
visor.rotation.x = Math.PI * 0.5;
head.add(visor);

// Eyes
const eyeL = new THREE.Group();
eyeL.name = 'Eye_L';
eyeL.position.set(-0.24, 0.05, 0.78);
head.add(eyeL);
eyeL.add(new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.035, 12, 24), matCyanLed));
eyeL.add(new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), matCyanLed));

const eyeR = new THREE.Group();
eyeR.name = 'Eye_R';
eyeR.position.set(0.24, 0.05, 0.78);
head.add(eyeR);
eyeR.add(new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.035, 12, 24), matCyanLed));
eyeR.add(new THREE.Mesh(new THREE.CircleGeometry(0.07, 20), matCyanLed));

// Ear Modules
const earL = new THREE.Group();
earL.name = 'Ear_L';
earL.position.set(-0.78, 0, 0);
head.add(earL);
const earLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24), matWhiteArmor);
earLMesh.rotation.z = Math.PI * 0.5;
earL.add(earLMesh);
const earLRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.032, 10, 24), matCyanLed);
earLRing.position.set(-0.09, 0, 0);
earLRing.rotation.y = Math.PI * 0.5;
earL.add(earLRing);

const earR = new THREE.Group();
earR.name = 'Ear_R';
earR.position.set(0.78, 0, 0);
head.add(earR);
const earRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.14, 24), matWhiteArmor);
earRMesh.rotation.z = Math.PI * 0.5;
earR.add(earRMesh);
const earRRing = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.032, 10, 24), matCyanLed);
earRRing.position.set(0.09, 0, 0);
earRRing.rotation.y = Math.PI * 0.5;
earR.add(earRRing);

// --- Left Arm ---
const shoulderL = new THREE.Group();
shoulderL.name = 'Shoulder_L';
shoulderL.position.set(-0.76, 0.4, 0);
torso.add(shoulderL);

const pauldronL = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65), matWhiteArmor);
pauldronL.name = 'Pauldron_L';
pauldronL.scale.set(1.15, 0.92, 1.15);
shoulderL.add(pauldronL);

const pauldronLRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 8, 18), matCyanLed);
pauldronLRing.position.set(-0.16, 0.02, 0);
pauldronLRing.rotation.y = Math.PI * 0.5;
shoulderL.add(pauldronLRing);

const bicepL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.44, 18), matWhiteArmor);
bicepL.name = 'Bicep_L';
bicepL.position.set(0, -0.26, 0);
shoulderL.add(bicepL);

const forearmL = new THREE.Group();
forearmL.name = 'Forearm_L';
forearmL.position.set(0, -0.52, 0);
shoulderL.add(forearmL);

const elbowL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.18, 16), matDarkTitanium);
elbowL.name = 'Elbow_Joint_L';
elbowL.rotation.z = Math.PI * 0.5;
forearmL.add(elbowL);

const forearmLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.48, 18), matWhiteArmor);
forearmLMesh.name = 'Forearm_Armor_L';
forearmLMesh.position.set(0, -0.26, 0);
forearmL.add(forearmLMesh);

const forearmLLed = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.24, 0.02), matCyanLed);
forearmLLed.name = 'Forearm_LED_L';
forearmLLed.position.set(-0.13, -0.24, 0.06);
forearmL.add(forearmLLed);

const handL = new THREE.Group();
handL.name = 'Hand_L';
handL.position.set(0, -0.56, 0);
forearmL.add(handL);
handL.add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.1), matDarkTitanium));
for (let f = -2; f <= 2; f++) {
  const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.14, 8), matDarkTitanium);
  finger.position.set(f * 0.034, -0.12, 0);
  handL.add(finger);
}

// --- Right Arm ---
const shoulderR = new THREE.Group();
shoulderR.name = 'Shoulder_R';
shoulderR.position.set(0.76, 0.4, 0);
torso.add(shoulderR);

const pauldronR = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.65), matWhiteArmor);
pauldronR.name = 'Pauldron_R';
pauldronR.scale.set(1.15, 0.92, 1.15);
shoulderR.add(pauldronR);

const pauldronRRing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 8, 18), matCyanLed);
pauldronRRing.position.set(0.16, 0.02, 0);
pauldronRRing.rotation.y = Math.PI * 0.5;
shoulderR.add(pauldronRRing);

const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.44, 18), matWhiteArmor);
bicepR.name = 'Bicep_R';
bicepR.position.set(0, -0.26, 0);
shoulderR.add(bicepR);

const forearmR = new THREE.Group();
forearmR.name = 'Forearm_R';
forearmR.position.set(0, -0.52, 0);
shoulderR.add(forearmR);

const elbowR = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.18, 16), matDarkTitanium);
elbowR.name = 'Elbow_Joint_R';
elbowR.rotation.z = Math.PI * 0.5;
forearmR.add(elbowR);

const forearmRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.11, 0.48, 18), matWhiteArmor);
forearmRMesh.name = 'Forearm_Armor_R';
forearmRMesh.position.set(0, -0.26, 0);
forearmR.add(forearmRMesh);

const forearmRLed = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.24, 0.02), matCyanLed);
forearmRLed.name = 'Forearm_LED_R';
forearmRLed.position.set(0.13, -0.24, 0.06);
forearmR.add(forearmRLed);

const handR = new THREE.Group();
handR.name = 'Hand_R';
handR.position.set(0, -0.56, 0);
forearmR.add(handR);
handR.add(new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.15, 0.1), matDarkTitanium));
for (let f = -2; f <= 2; f++) {
  const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.018, 0.14, 8), matDarkTitanium);
  finger.position.set(f * 0.034, -0.12, 0);
  handR.add(finger);
}

// --- Left Leg ---
const legL = new THREE.Group();
legL.name = 'Leg_L';
legL.position.set(-0.35, -0.2, 0);
pelvis.add(legL);

const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.58, 20), matWhiteArmor);
thighL.name = 'Thigh_L';
thighL.position.set(0, -0.34, 0);
legL.add(thighL);

const kneeL = new THREE.Group();
kneeL.name = 'Knee_L';
kneeL.position.set(0, -0.68, 0);
legL.add(kneeL);

const kneeLGuard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.22), matWhiteArmor);
kneeL.add(kneeLGuard);
const kneeLRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.022, 10, 20), matCyanLed);
kneeLRing.position.set(0, 0, 0.12);
kneeL.add(kneeLRing);

const shinL = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.54, 20), matWhiteArmor);
shinL.name = 'Shin_L';
shinL.position.set(0, -0.36, 0);
kneeL.add(shinL);

const ankleLRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.024, 10, 20), matCyanLed);
ankleLRing.name = 'Ankle_Ring_L';
ankleLRing.position.set(-0.17, -0.66, 0);
ankleLRing.rotation.y = Math.PI * 0.5;
kneeL.add(ankleLRing);

const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.56), matWhiteArmor);
bootL.name = 'Boot_L';
bootL.position.set(0, -0.78, 0.12);
kneeL.add(bootL);

const toeLightL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.025), matCyanLed);
toeLightL.name = 'Toe_Light_L';
toeLightL.position.set(0, -0.84, 0.41);
kneeL.add(toeLightL);

// --- Right Leg ---
const legR = new THREE.Group();
legR.name = 'Leg_R';
legR.position.set(0.35, -0.2, 0);
pelvis.add(legR);

const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.58, 20), matWhiteArmor);
thighR.name = 'Thigh_R';
thighR.position.set(0, -0.34, 0);
legR.add(thighR);

const kneeR = new THREE.Group();
kneeR.name = 'Knee_R';
kneeR.position.set(0, -0.68, 0);
legR.add(kneeR);

const kneeRGuard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.22), matWhiteArmor);
kneeR.add(kneeRGuard);
const kneeRRing = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.022, 10, 20), matCyanLed);
kneeRRing.position.set(0, 0, 0.12);
kneeR.add(kneeRRing);

const shinR = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.54, 20), matWhiteArmor);
shinR.name = 'Shin_R';
shinR.position.set(0, -0.36, 0);
kneeR.add(shinR);

const ankleRRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.024, 10, 20), matCyanLed);
ankleRRing.name = 'Ankle_Ring_R';
ankleRRing.position.set(0.17, -0.66, 0);
ankleRRing.rotation.y = Math.PI * 0.5;
kneeR.add(ankleRRing);

const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.26, 0.56), matWhiteArmor);
bootR.name = 'Boot_R';
bootR.position.set(0, -0.78, 0.12);
kneeR.add(bootR);

const toeLightR = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 0.025), matCyanLed);
toeLightR.name = 'Toe_Light_R';
toeLightR.position.set(0, -0.84, 0.41);
kneeR.add(toeLightR);

// Export to binary .glb file
const exporter = new GLTFExporter();
exporter.parse(
  scene,
  (glbBuffer) => {
    const outPath = path.join(__dirname, '../public/models/school-ai-robot.glb');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, Buffer.from(glbBuffer));
    console.log(`Successfully generated production GLB: ${outPath} (${fs.statSync(outPath).size} bytes)`);
  },
  (err) => {
    console.error('Error exporting GLB:', err);
  },
  { binary: true }
);
