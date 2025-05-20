import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.169.0/examples/jsm/controls/OrbitControls.js";
import { annotations } from "./annotations.js";

let containerIDGlobal;

let scene, camera, renderer, controls, loader, width, height;
let models = ["building_BH.glb", "building_1-3.glb", "5_4_2025.glb"];

/* ───────────────────────────────────────────────────────────── */

export function initThreejs(containerID, model) {
  containerIDGlobal = containerID;
  if (model == null) model = models[0];

  /* ---------- scene & background ---------- */
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdddddd);

  /* ---------- lighting (works for BOTH 3-D + 360) ---------- */
  const ambient = new THREE.AmbientLight(0xffffff, 1);          // ← global soft light
  scene.add(ambient);

  const dir = new THREE.DirectionalLight(0xffffff, 2);          // ← main key light
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
  renderer.outputColorSpace = THREE.SRGBColorSpace;              // ← gamma-correct output
  renderer.physicallyCorrectLights = true;
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  /* ---------- orbit controls ---------- */
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate   = true;   // ✅ rotation restored for 360 images
  controls.enablePan      = false;
  controls.enableZoom     = false;
  controls.enableDamping  = true;
  controls.dampingFactor  = 0.1;

  /* ---------- bookkeeping ---------- */
  width  = container.clientWidth;
  height = container.clientHeight;
  loader = new GLTFLoader();

  loadModel(model);
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

function innitAnnotations(model) {
  document.querySelectorAll(".annotation").forEach((el) => el.remove());
  if (!annotations[model]) return;

  for (const a of annotations[model]) {
    const ann = document.createElement("div");
    ann.className = "annotation";
    ann.textContent = a.title;
    ann.dataset.pos = JSON.stringify([a.lookAt.x, a.lookAt.y, a.lookAt.z]);

    ann.onclick = () => {
      camera.position.set(a.camPos.x, a.camPos.y, a.camPos.z);
      controls.target.set(a.lookAt.x, a.lookAt.y, a.lookAt.z);
      controls.update();
    };
    document.getElementById("threejs-container-wrapper")?.appendChild(ann);
  }
}

/* ───────────────────────────────────────────────────────────── */

function loadModel(model) {
  clearScene();

  let path = model;

  // Auto-detect model folder
  if (!model.includes("/") && model.endsWith(".glb")) {
    if (model.includes("Santaclara")) {
      path = `3D_models/${model}`;
    } else {
      path = `3D sketches/${model}`;
    }
  }

  console.log("Loading model from path:", path);

  const is360 = model.toLowerCase().endsWith("_360.glb");

  loader.load(path, (gltf) => {
  
    console.log("Loading model from path:", path);
    console.log(gltf.scene.children);
    console.log("Loaded GLTF:", gltf);
  
    const mesh = gltf.scene.children[0];
    if (mesh && mesh.isMesh) {
      console.log("🧪 Mesh material:", mesh.material);
      console.log("🖼️ Texture map:", mesh.material.map);
      console.log("✨ Emissive map:", mesh.material.emissiveMap);
  
      if (!mesh.geometry.boundingBox) {
        mesh.geometry.computeBoundingBox();
      }
      console.log("📏 Geometry bounding box:", mesh.geometry.boundingBox);
    }
  
    if (is360) {
      console.log("✅ Applying 360 config");
  
      scene.children = scene.children.filter(obj => !obj.isLight);
      scene.background = new THREE.Color(0x000000);
  
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          const tex = child.material?.map || null;
  
          if (tex) {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.flipY = false;
            tex.needsUpdate = true;
          }
  
          child.material = new THREE.MeshBasicMaterial({
            map: tex,
            side: THREE.FrontSide,   // or THREE.FrontSide to test
            toneMapped: false,
            depthWrite: false,
          });
  
          console.log("🧪 Texture exists?", tex);
          console.log("🧪 Material type after change:", child.material.type);
  
          child.material.needsUpdate = true;
        }
      });
  
      gltf.scene.scale.set(100, 100, 100);
      gltf.scene.position.set(0, 0, 0);
  
      camera.position.set(0, 0, 0.1);  // <-- offset to enable rotation
      controls.target.set(0, 0, 0);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableRotate = true;
      controls.update();
  
      scene.add(gltf.scene);
    } 
      
    else {
      // Standard 3D model
      scene.background = new THREE.Color(0xdddddd);
      gltf.scene.scale.set(1, 1, 1);
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const sizeVec = box.getSize(new THREE.Vector3());
      gltf.scene.position.sub(center);
      const size = sizeVec.length();
      camera.position.copy(center.clone().add(new THREE.Vector3(0, 0, size * 1.5)));
      controls.target.copy(center);
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableRotate = true;
      controls.update();

      scene.add(gltf.scene);
    }
    
    innitAnnotations(model);
  }, undefined, (error) => {
    console.error("GLTF load error:", error);
  });
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

function animate() {
  // update annotation screen positions
  Array.from(document.getElementsByClassName("annotation")).forEach((el) => {
    const pos = JSON.parse(el.dataset.pos);
    const v   = new THREE.Vector3(...pos).project(camera);
    if (v.z < 0 || v.z > 1) {
      el.style.display = "none";
    } else {
      el.style.display = "block";
      el.style.left = `${(v.x * 0.5 + 0.5) * width}px`;
      el.style.top  = `${(1 - (v.y * 0.5 + 0.5)) * height}px`;
    }
  });

  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
