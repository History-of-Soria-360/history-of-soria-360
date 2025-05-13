import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js";

let scene, camera, renderer, controls, loader, width, height;

let models = ["building_BH.glb", "building_1-3.glb", "5_4_2025.glb"];

let annotations = [
  {
    title: "Title",
    description: "Test",
    camPos: {
      x: 0,
      y: 6.1232339957367664e-27,
      z: 1e-10,
    },
    lookAt: {
      x: -23.44926801746289,
      y: 6.30744873607264,
      z: 17.576055557733937,
    },
  },
  {
    title: "Title",
    description: "Test",
    camPos: {
      x: 0,
      y: 6.1232339957367664e-27,
      z: 1e-10,
    },
    lookAt: {
      x: 19.133309885056715,
      y: 10.158381163797346,
      z: 20.686712369312204,
    },
  },
  {
    title: "Title",
    description: "Test",
    camPos: {
      x: 0,
      y: 6.1232339957367664e-27,
      z: 1e-10,
    },
    lookAt: {
      x: 14.435786069563225,
      y: 22.639917408161264,
      z: -13.330463014955665,
    },
  },
];

/* const annotationPosition = new THREE.Vector3(
  -23.44926801746289,
  6.30744873607264,
  17.576055557733937
); // Change as needed */

export function initThreejs(containerID, model) {
  if (model == null) {
    model = models[0];
  }

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

  width = document.getElementById(containerID).getBoundingClientRect().width;
  height = document.getElementById(containerID).getBoundingClientRect().height;

  controls = new OrbitControls(camera, renderer.domElement);

  loader = new GLTFLoader();
  loadModel(model);

  innitAnnotations(model);

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

function innitAnnotations(model) {
  for (const a of annotations) {
    const annotation = document.createElement("div");
    // Add a class (or multiple classes)
    annotation.className = "annotation"; // You can use "annotation another-class" for multiple
    // Optionally set other properties
    annotation.textContent =
      models[(models.indexOf(model) + 1) % models.length];
    // Assign them their location for later use
    annotation.setAttribute(
      "data-pos",
      JSON.stringify([a.lookAt.x, a.lookAt.y, a.lookAt.z])
    );

    annotation.onclick = () => {
      loadModel(models[(models.indexOf(model) + 1) % models.length]);
    };

    document.getElementById("overlay-left")?.appendChild(annotation);
  }
}

function loadModel(model) {
  loader.load(
    `3D sketches/${model}`,
    (gltf) => {
      clearScene();
      scene.add(gltf.scene);
      camera.position.set(0, 0, 0.0000001); //slight offset is needed
      innitAnnotations(model);
    },
    undefined,
    (error) => {
      console.error("GLTF load error:", error);
    }
  );
}

/* function handleFile(event) {
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
} */

function clearScene() {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    let obj = scene.children[i];
    if (obj.type === "Group" || obj.type === "Mesh") {
      scene.remove(obj);
      // delete all annotations
      document.querySelectorAll(".annotation").forEach((el) => el.remove());
    }
  }
}

function animate() {
  const annots = document.getElementsByClassName("annotation");

  for (let i = 0; i < annots.length; i++) {
    const pos = JSON.parse(annots.item(i).dataset.pos);
    const vector = new THREE.Vector3(...pos).project(camera);

    if (vector.z < 0 || vector.z > 1) {
      annots.item(i).style.display = "none";
    } else {
      annots.item(i).style.display = "block";

      const x = (vector.x * 0.5 + 0.5) * width;
      const y = (1 - (vector.y * 0.5 + 0.5)) * height;

      annots.item(i).style.left = `${x}px`;
      annots.item(i).style.top = `${y}px`;
    }
  }

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
