// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a texture loader
const loader = new THREE.TextureLoader();
const texture = loader.load('lafourmi.png'); // Update with the path to your logo image

// Create a material with the logo texture
const material = new THREE.MeshBasicMaterial({ map: texture });

// Create a geometry and apply the material
const geometry = new THREE.PlaneGeometry(5, 5); // Adjust size as needed
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 10;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    plane.rotation.y += 0.01; // Rotate the logo
    renderer.render(scene, camera);
}
animate();

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});