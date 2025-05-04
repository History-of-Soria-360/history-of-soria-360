import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, loader;

const annotationPosition = new THREE.Vector3(1, 2, 3); // Change as needed

export function initThreejs(containerID) {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  const light = new THREE.PointLight(0xffffff, 6, 100); // color, intensity, distance
  light.position.set(0, 0, 0); // Center of model (since model was moved to origin)
  scene.add(light);

  camera = new THREE.PerspectiveCamera(
    75,
    document.getElementById(containerID).getBoundingClientRect().width /
      document.getElementById(containerID).getBoundingClientRect().height,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(
    document.getElementById(containerID).getBoundingClientRect().width,
    document.getElementById(containerID).getBoundingClientRect().height
  );
  document.getElementById(containerID)?.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const loader = new GLTFLoader();
  loader.load(
    "3D sketches/5_4_2025.glb",
    (gltf) => {
      scene.add(gltf.scene);
      camera.position.set(0, 0, 0.0000001); //slight offset is needed
    },
    undefined,
    (error) => {
      console.error("GLTF load error:", error);
    }
  );

  animate();

  window.addEventListener("resize", onWindowResize, false);
}

function onWindowResize() {
  camera.aspect =
    document.getElementById(containerID).getBoundingClientRect().width /
    document.getElementById(containerID).getBoundingClientRect().height;
  camera.updateProjectionMatrix();
  renderer.setSize(
    document.getElementById(containerID).getBoundingClientRect().width,
    document.getElementById(containerID).getBoundingClientRect().height
  );
}

function handleFile(event) {
  const file = event.target.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    loader.load(
      url,
      function (gltf) {
        clearScene();
        scene.add(gltf.scene);
        URL.revokeObjectURL(url);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );
  }
}

function clearScene() {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    let obj = scene.children[i];
    if (obj.type === "Group" || obj.type === "Mesh") {
      scene.remove(obj);
    }
  }
}

function animate() {
  const annotationElement = document.getElementById("annotation");
  const vector = annotationPosition.clone().project(camera);

  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;

  annotationElement.style.left = `${x}px`;
  annotationElement.style.top = `${y}px`;

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
