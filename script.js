// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // Set clear color to white
document.body.appendChild(renderer.domElement);

// Create a texture loader
const loader = new THREE.TextureLoader();

// Create a geometry with smoother edges
const geometry = new THREE.BoxGeometry(5, 5, 5);
geometry.computeVertexNormals(); // Compute normals for smooth shading

// Create a material for the cube
const material = new THREE.MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.5
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 15;

// Enhanced lighting setup
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
pointLight1.position.set(10, 10, 10);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
pointLight2.position.set(-10, -10, 10);
scene.add(pointLight2);

// Load texture and apply it to the cube
loader.load('lafourmi.png', (texture) => {
    material.map = texture;
    material.needsUpdate = true; // Notify Three.js that the material needs updating
    animate(); // Start animation once the texture is loaded
}, undefined, (err) => {
    console.error('An error occurred while loading the texture:', err);
});

// Animation loop
let spinSpeed = 0.01; // Initial spin speed
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += spinSpeed; // Rotate the cube
    cube.rotation.y += spinSpeed;
    renderer.render(scene, camera);
}

// Handle window resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Handle touch and click interaction
function handleInteraction(event) {
    event.preventDefault();

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Get the touch or mouse position
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;

    const touchX = (clientX / screenWidth) * 2 - 1;
    const touchY = -(clientY / screenHeight) * 2 + 1;

    const touchVector = new THREE.Vector3(touchX, touchY, 0.5);
    touchVector.unproject(camera);

    // Adjust movement based on touch position
    const bounceSpeed = Math.max(0.01, Math.min(0.1, (Math.abs(touchX) + Math.abs(touchY)) * 0.1));
    spinSpeed = bounceSpeed;

    // Define screen bounds in world coordinates (restrict movement)
    const boundsX = screenWidth / camera.aspect / 2 - geometry.parameters.width / 2;
    const boundsY = screenHeight / camera.aspect / 2 - geometry.parameters.height / 2;

    // Calculate random movement
    const directionX = (Math.random() - 0.5) * 10;
    const directionY = (Math.random() - 0.5) * 10;

    // Calculate new position and clamp within bounds
    let newX = cube.position.x + directionX;
    let newY = cube.position.y + directionY;

    // Ensure the cube stays within screen bounds
    newX = Math.max(-boundsX, Math.min(boundsX, newX));
    newY = Math.max(-boundsY, Math.min(boundsY, newY));

    // Bounce animation within the screen bounds
    gsap.to(cube.position, {
        x: newX,
        y: newY,
        duration: 1.0,
        ease: "bounce.out",
        onComplete: () => {
            // Bounce effect with reverse direction if out of bounds
            if (newX === -boundsX || newX === boundsX || newY === -boundsY || newY === boundsY) {
                const bounceBackX = (newX === -boundsX ? 1 : -1) * (boundsX - Math.abs(newX)) * 0.5;
                const bounceBackY = (newY === -boundsY ? 1 : -1) * (boundsY - Math.abs(newY)) * 0.5;

                gsap.to(cube.position, {
                    x: newX + bounceBackX,
                    y: newY + bounceBackY,
                    duration: 1.0,
                    ease: "bounce.out"
                });
            }
        }
    });

    // Scale and rotate effect
    gsap.to(cube.scale, {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.3,
        ease: "power1.inOut"
    });

    gsap.to(cube.rotation, {
        z: "+=" + Math.PI / 4,
        duration: 0.3,
        ease: "power1.inOut"
    });

    // Return the cube to its original size
    setTimeout(() => {
        gsap.to(cube.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.3,
            ease: "power1.inOut"
        });
        gsap.to(cube.rotation, {
            z: "-=" + Math.PI / 4,
            duration: 0.3,
            ease: "power1.inOut"
        });
    }, 300);
}

// Add both touch and mouse click event listeners
window.addEventListener('touchstart', handleInteraction);
window.addEventListener('mousedown', handleInteraction);  // Mouse click interaction