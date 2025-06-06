import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js";
import { annotations } from "./annotations.js";

let containerIDGlobal;

let scene, camera, renderer, controls, loader, width, height;
let models = ["building_BH.glb", "building_1-3.glb", "5_4_2025.glb"];
let loadedModels = {}; 

let targetIsSet = false;

/* ───────────────────────────────────────────────────────────── */

export function initThreejs(containerID, model, camPos = null, lookAt = null) {
  containerIDGlobal = containerID;
  if (model == null) model = models[0];

  /* ---------- scene & background ---------- */
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  /* ---------- lighting (works for BOTH 3-D + 360) ---------- */
  const ambient = new THREE.AmbientLight(0xffffff, 1); // ← global soft light
  scene.add(ambient);

  const dir = new THREE.DirectionalLight(0xffffff, 2); // ← main key light
  dir.position.set(10, 10, 10);
  scene.add(dir);

  /* ---------- camera ---------- */
  const container = document.getElementById(containerID);
  camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    2000
  );

  /* ---------- renderer ---------- */
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace; // ← gamma-correct output
  renderer.physicallyCorrectLights = true;
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* ---------- orbit controls ---------- */
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true; // ✅ rotation restored for 360 images
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;

  controls.domElement.addEventListener("pointerdown", (event) => {
    if (event.button === 0) {
      if (targetIsSet) {
        // camera.position.set(0, 0, 0.1);
        controls.target.set(0, 0, 0);
        controls.update();
        targetIsSet = false;
      }
    }
  });

  /* ---------- bookkeeping ---------- */
  width = container.clientWidth;
  height = container.clientHeight;
  loader = new GLTFLoader();

  loadModel(model, camPos, lookAt);
  innitAnnotations(model);
  animate();

  window.addEventListener("resize", onWindowResize, false);
}

/* ───────────────────────────────────────────────────────────── */

function onWindowResize() {
  const cont = document.getElementById(containerIDGlobal);
  camera.aspect = cont.clientWidth / cont.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(cont.clientWidth, cont.clientHeight);
}

/* ───────────────────────────────────────────────────────────── */

function setCamPosAndLookAt(camPos, lookAt) {
  if (camPos != null && lookAt != null) {
    camera.position.set(camPos.x, camPos.y, camPos.z);
    controls.target.set(lookAt.x, lookAt.y, lookAt.z);
    controls.update();
  }
}

/* ───────────────────────────────────────────────────────────── */
function innitAnnotations(model) {
  document.querySelectorAll(".annotation").forEach((el) => el.remove());
  if (!annotations[model]) return;

  for (const a of annotations[model]) {
    const ann = document.createElement("div");
    ann.className = "annotation";
    ann.textContent = a.title;
    ann.dataset.pos = JSON.stringify([a.lookAt.x, a.lookAt.y, a.lookAt.z]);

    ann.onclick = () => {
      controls.target.set(a.lookAt.x, a.lookAt.y, a.lookAt.z);
      controls.update();
      targetIsSet = true;

      // Update the description area on annotation click
      const descBox = document.getElementById("image-description");
      if (descBox) {
        descBox.innerHTML = a.description || a.title || ""; // fallback to title if no description
      }
    };
    document.getElementById("threejs-container-wrapper")?.appendChild(ann);
  }
}

/* ───────────────────────────────────────────────────────────── */

export function loadModel(model, camPos, lookAt, hidden = false) {
  let path = model;

  if (!model.includes("/") && model.endsWith(".glb")) {
    path = model.includes("Santaclara") ? `3D_models/${model}` : `3D sketches/${model}`;
  }

  loader.load(
    path,
    (gltf) => {
      const sceneObj = gltf.scene;
      const is360 = model.toLowerCase().endsWith("_360.glb");

      // 🔧 Apply 360° config
      if (is360) {
        scene.background = new THREE.Color(0x000000);
        sceneObj.scale.set(100, 100, 100);
        sceneObj.position.set(0, 0, 0);

        sceneObj.traverse((child) => {
          if (child.isMesh) {
            const oldMat = child.material;
            const tex = oldMat?.map;
            if (tex) {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.flipY = false;
              tex.needsUpdate = true;
        
              // Try BOTH sides in case the dome is inverted
              child.material = new THREE.MeshBasicMaterial({
                map: tex,
                side: THREE.DoubleSide,
                toneMapped: false,
                depthWrite: false,
              });
              child.material.needsUpdate = true;
            }
          }
        });
        

        camera.position.set(0, 0, 0.1);
        controls.target.set(0, 0, 0);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.enableRotate = true;
        controls.update();
        
      } else {
        // 🔧 Regular 3D model config
        scene.background = new THREE.Color(0xdddddd);
        sceneObj.scale.set(1, 1, 1);

        const box = new THREE.Box3().setFromObject(sceneObj);
        const center = box.getCenter(new THREE.Vector3());

        controls.target.copy(center);
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.enableRotate = true;
        controls.update();
      }

      // 🔁 Add model
      sceneObj.visible = !hidden;
      scene.add(sceneObj);
      loadedModels[model] = sceneObj;

      innitAnnotations(model);
      setCamPosAndLookAt(camPos, lookAt);
    },
    undefined,
    (err) => console.error("GLTF load error:", err)
  );
}



/* ───────────────────────────────────────────────────────────── */

function clearScene() {
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];
    if (obj.type === "Group" || obj.type === "Mesh") scene.remove(obj);
  }
  document.querySelectorAll(".annotation").forEach((el) => el.remove());
}

/* ───────────────────────────────────────────────────────────── */
export function toggleModelVisibility(modelName) {
  for (const [name, obj] of Object.entries(loadedModels)) {
    obj.visible = (name === modelName);
  }

  innitAnnotations(modelName);
}


function animate() {
  // update annotation screen positions
  Array.from(document.getElementsByClassName("annotation")).forEach((el) => {
    const pos = JSON.parse(el.dataset.pos);
    const v = new THREE.Vector3(...pos).project(camera);
    if (v.z < 0 || v.z > 1) {
      el.style.display = "none";
    } else {
      el.style.display = "block";
      el.style.left = `${(v.x * 0.5 + 0.5) * width}px`;
      el.style.top = `${(1 - (v.y * 0.5 + 0.5)) * height}px`;
    }
  });

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
