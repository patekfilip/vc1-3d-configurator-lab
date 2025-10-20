import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

let scene, camera, renderer, controls, gui;
let guitar,
  config = {};

// === INIT SCENE ===
scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 1, 3);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// === LIGHTS ===
const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1.0);
dir.position.set(5, 10, 7);
dir.castShadow = true;
scene.add(dir);

// === ENVIRONMENT ===
const pmrem = new THREE.PMREMGenerator(renderer);
new HDRLoader().load(
  '/env/studio_small_09_1k.hdr',
  (hdrTex) => {
    const envMap = pmrem.fromEquirectangular(hdrTex).texture;
    scene.environment = envMap;
    scene.background = envMap; // optional: show HDR in background
    hdrTex.dispose();
    pmrem.dispose();
    console.log('✅ Environment map set', envMap);
  },
  undefined,
  (err) => console.warn('⚠️ Could not load HDR', err)
);

// === CONTROLS ===
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0.5, 0);

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

  config = {
    bodyColor: '#b34f2e',
    showPickguard: true,
  };

  if (body) body.material = body.material.clone();

  const applyConfig = () => {
    if (body) body.material.color.set(config.bodyColor);
    if (pickguard) pickguard.visible = config.showPickguard;
  };

  applyConfig();

  gui = new GUI();
  gui.addColor(config, 'bodyColor').name('Body Color').onChange(applyConfig);
  gui.add(config, 'showPickguard').name('Show Pickguard').onChange(applyConfig);
}

// === RENDER LOOP ===
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

const axes = new THREE.AxesHelper(1);
scene.add(axes);
const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

// === RESIZE ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
