import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

let scene, camera, renderer, controls, gui;
let guitar,
  config = {};

// === INIT SCENE ===
scene = new THREE.Scene();
scene.background = new THREE.Color(0xfcfcfc);

camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1, 2);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
renderer.physicallyCorrectLights = true;

document.body.appendChild(renderer.domElement);

// === LIGHTS ===
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 2.0);
dir.position.set(2, 2, 2);
dir.castShadow = true;
scene.add(dir);

// === CONTROLS ===
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.5, 0);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    metalness: 0.3,
    roughness: 0.8,
  })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.1;
floor.receiveShadow = true;
scene.add(floor);

// === LOAD GUITAR ===
const loader = new GLTFLoader();
loader.load(
  '/models/Guitar_Models.glb',
  (gltf) => {
    guitar = gltf.scene;
    guitar.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.geometry && child.geometry.attributes.normal) {
          child.geometry.computeVertexNormals();
        }
      }
    });
    scene.add(guitar);
    initConfigUI(guitar);
  },
  (xhr) => console.log(`Loading: ${(xhr.loaded / xhr.total) * 100}%`),
  (err) => console.error(err)
);

// === CONFIG + GUI ===
function initConfigUI(model) {
  // Example parts: adjust to your real node names from Blender
  const body = model.getObjectByName('Body');
  const pickguard = model.getObjectByName('Pickguard');
  const pickguardMesh = model.getObjectByName('PickguardMesh');
  const pick = model.getObjectByName('Pick');

  config = {
    bodyColor: '#f5f5f5',
    pickGuardColor: '#782121',
    showPickguard: true,
    showPick: true,
  };

  if (body) body.material = body.material.clone();

  const applyConfig = () => {
    if (body) body.material.color.set(config.bodyColor);
    if (pickguardMesh) pickguardMesh.material.color.set(config.pickGuardColor);
    if (pickguard) pickguard.visible = config.showPickguard;
    if (pick) pick.visible = config.showPick;
  };

  applyConfig();

  gui = new GUI();
  gui.addColor(config, 'bodyColor').name('Body Color').onChange(applyConfig);
  gui
    .addColor(config, 'pickGuardColor')
    .name('Pickguard Color')
    .onChange(applyConfig);
  gui.add(config, 'showPickguard').name('Show Pickguard').onChange(applyConfig);
  gui.add(config, 'showPick').name('Show Pick').onChange(applyConfig);
}

// === RENDER LOOP ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// const axes = new THREE.AxesHelper(1);
// scene.add(axes);
// const grid = new THREE.GridHelper(10, 10);
// scene.add(grid);

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
