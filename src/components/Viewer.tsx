import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

type ViewerProps = {
    url: string;
    minPolar: number;
    maxPolar: number;
    minAzimuth: number;
    maxAzimuth: number;
    currentPolar?: number;
    currentAzimuth?: number;
    previewAzimuth?: number;
    onAngleChange?: (azimuthDeg: number, polarDeg: number) => void;
};

export default function Viewer({
    url,
    minPolar,
    maxPolar,
    minAzimuth,
    maxAzimuth,
    currentPolar = 100,
    currentAzimuth = 80,
    previewAzimuth,
    onAngleChange
}: ViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let renderer: THREE.WebGLRenderer;
        let scene: THREE.Scene;
        let camera: THREE.PerspectiveCamera;
        let controls: OrbitControls;
        let animationId: number;

        // Set up scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            1,
            1100
        );
        camera.position.set(0, 0, 0.1);

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.innerHTML = "";
        container.appendChild(renderer.domElement);

        // Geometry and material
        const geometry = new THREE.SphereGeometry(500, 60, 40);
        geometry.scale(-1, 1, 1);

        const texture = new THREE.TextureLoader().load(url);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        


        // Controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.enablePan = false;

        /*controls.mouseButtons = {
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        };
        controls.touches = {
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        };*/

        controls.minPolarAngle = THREE.MathUtils.degToRad(minPolar);
        controls.maxPolarAngle = THREE.MathUtils.degToRad(maxPolar);
        controls.minAzimuthAngle = THREE.MathUtils.degToRad(minAzimuth);
        controls.maxAzimuthAngle = THREE.MathUtils.degToRad(maxAzimuth);

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };

        window.addEventListener("resize", handleResize);

        if (currentAzimuth !== undefined && currentPolar !== undefined) {
            const azimuth = THREE.MathUtils.degToRad(currentAzimuth);
            const polar = THREE.MathUtils.degToRad(currentPolar); // No default needed if both are expected
        
            const radius = controls ? controls.getDistance() : 1; // Get the current distance from the target
        
            camera.position.set(
                radius * Math.sin(polar) * Math.sin(azimuth),
                radius * Math.cos(polar),
                radius * Math.sin(polar) * Math.cos(azimuth)
            );
            controls.update(); // Important to update controls after manually setting the position
        }

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);

            if (onAngleChange) {
                const azimuth = controls.getAzimuthalAngle(); // radians
                const polar = controls.getPolarAngle(); // radians
                onAngleChange(
                    THREE.MathUtils.radToDeg(azimuth),
                    THREE.MathUtils.radToDeg(polar)
                );
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);

            controls.dispose();
            geometry.dispose();
            material.dispose();
            texture.dispose();
            scene.clear();

            renderer.dispose();
            renderer.forceContextLoss?.(); // this helps prevent GPU memory leak
            container.innerHTML = "";
        };
    }, [url, minPolar, maxPolar, minAzimuth, maxAzimuth, previewAzimuth]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100vw", height: "100vh", overflow: "hidden" }}
        />
    );
}
