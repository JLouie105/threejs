import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xCBC3E3);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.getElementById("Container3D").appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 5, 11);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0,1,0);
controls.update();

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(groundMesh);

// axis guide
// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );

const spotLight = new THREE.SpotLight(0xFFFFFF, 50, 100, 0.2, 0.5);
spotLight.position.set(10, 0, 15);
spotLight.castShadow = true;
scene.add(spotLight);

const topLight = new THREE.DirectionalLight(0xFFFFFF, 1);
topLight.position.set(100,100,100);
topLight.castShadow = true;
scene.add(topLight);

const light = new THREE.AmbientLight( 0xFF0000 ); 
scene.add( light );

const loader = new GLTFLoader();
loader.load('gltf/scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    mesh.position.set(0, 2.5, 0);
    mesh.rotation.y = 4.3;
    scene.add(mesh);
});

const listener = new THREE.AudioListener;
camera.add(listener);

const audioLoader = new THREE.AudioLoader();

const backgroundSound = new THREE.Audio(listener);

audioLoader.load('../music.mp3', function(buffer) {
    backgroundSound.setBuffer(buffer);
    backgroundSound.setLoop(true);
    backgroundSound.setVolume(0.4);
    backgroundSound.play();
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
}

animate();