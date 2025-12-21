import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import './Welcome.css';

const Welcome = ({ onEnter }) => {
    const [isVisible, setIsVisible] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Three.js Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        camera.position.z = 8;

        // ==================== BACKGROUND CINEMATIC SHAPES ====================
        const backgroundShapes = [];
        
        // Rotating Torus Knot
        const torusKnotGeometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 8);
        const torusKnotMaterial = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            emissive: 0x667eea,
            emissiveIntensity: 0.3,
            wireframe: false,
            transparent: true,
            opacity: 0.4
        });
        const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial);
        torusKnot.position.z = -3;
        torusKnot.castShadow = true;
        torusKnot.receiveShadow = true;
        scene.add(torusKnot);
        backgroundShapes.push({ mesh: torusKnot, rotationSpeed: { x: 0.002, y: 0.003, z: 0.001 } });

        // Rotating Icosahedron
        const icoGeometry = new THREE.IcosahedronGeometry(1.5, 4);
        const icoMaterial = new THREE.MeshPhongMaterial({
            color: 0x764ba2,
            emissive: 0x764ba2,
            emissiveIntensity: 0.2,
            wireframe: false,
            transparent: true,
            opacity: 0.3
        });
        const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
        icosahedron.position.set(-4, 3, -2);
        icosahedron.castShadow = true;
        scene.add(icosahedron);
        backgroundShapes.push({ mesh: icosahedron, rotationSpeed: { x: 0.001, y: 0.0015, z: 0.0005 } });

        // Rotating Octahedron
        const octaGeometry = new THREE.OctahedronGeometry(1, 3);
        const octaMaterial = new THREE.MeshPhongMaterial({
            color: 0xFF006E,
            emissive: 0xFF006E,
            emissiveIntensity: 0.25,
            wireframe: false,
            transparent: true,
            opacity: 0.35
        });
        const octahedron = new THREE.Mesh(octaGeometry, octaMaterial);
        octahedron.position.set(4, -3, -2);
        octahedron.castShadow = true;
        scene.add(octahedron);
        backgroundShapes.push({ mesh: octahedron, rotationSpeed: { x: 0.0025, y: 0.001, z: 0.002 } });

        // ==================== PARTICLE NETWORK ====================
        const particleCount = 40;
        const particles = [];
        const colors = [0x00D4FF, 0x667eea, 0x764ba2, 0xFF006E];

        // Create particle geometry
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 12,
                    (Math.random() - 0.5) * 12,
                    (Math.random() - 0.5) * 12
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                ),
                color: colors[Math.floor(Math.random() * colors.length)],
                mass: Math.random() * 0.5 + 0.5
            };
            particles.push(particle);
        }

        // Create particle mesh
        const particleGeometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(particleCount * 3);
        const colorArray = new Float32Array(particleCount * 3);

        particles.forEach((p, i) => {
            positionArray[i * 3] = p.position.x;
            positionArray[i * 3 + 1] = p.position.y;
            positionArray[i * 3 + 2] = p.position.z;

            const color = new THREE.Color(p.color);
            colorArray[i * 3] = color.r;
            colorArray[i * 3 + 1] = color.g;
            colorArray[i * 3 + 2] = color.b;
        });

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particlesMesh);

        // ==================== CONNECTION LINES ====================
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00D4FF,
            transparent: true,
            opacity: 0.2,
            linewidth: 1
        });
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // ==================== FLOWING LIGHT EFFECT ====================
        const flowingGeometry = new THREE.BufferGeometry();
        const flowingMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x00D4FF,
            transparent: true,
            opacity: 0.6
        });
        const flowingParticles = new THREE.Points(flowingGeometry, flowingMaterial);
        scene.add(flowingParticles);

        // ==================== VOLUMETRIC LIGHT ====================
        const coneGeometry = new THREE.ConeGeometry(1.5, 4, 32);
        const coneMaterial = new THREE.MeshPhongMaterial({
            color: 0x00D4FF,
            emissive: 0x00D4FF,
            emissiveIntensity: 0.1,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide
        });
        const lightCone1 = new THREE.Mesh(coneGeometry, coneMaterial);
        lightCone1.position.set(-3, 2, -4);
        lightCone1.rotation.x = Math.PI / 2;
        scene.add(lightCone1);

        const lightCone2 = new THREE.Mesh(coneGeometry, coneMaterial.clone());
        lightCone2.position.set(3, -2, -4);
        lightCone2.rotation.x = Math.PI / 2;
        lightCone2.material.color.set(0xFF006E);
        lightCone2.material.emissive.set(0xFF006E);
        scene.add(lightCone2);

        // ==================== ADVANCED LIGHTING ====================
        const light1 = new THREE.PointLight(0x00D4FF, 1.2, 100);
        light1.position.set(6, 6, 6);
        light1.castShadow = true;
        light1.shadow.mapSize.width = 2048;
        light1.shadow.mapSize.height = 2048;
        scene.add(light1);

        const light2 = new THREE.PointLight(0xFF006E, 1, 100);
        light2.position.set(-6, -6, 6);
        light2.castShadow = true;
        scene.add(light2);

        const light3 = new THREE.PointLight(0x667eea, 0.8, 100);
        light3.position.set(0, 0, 8);
        scene.add(light3);

        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
        directionalLight.position.set(10, 10, 10);
        directionalLight.castShadow = true;
        scene.add(directionalLight);

        // ==================== ANIMATION LOOP ====================
        const flowPositions = [];
        const connectionDistance = 4;
        let flowUpdateTime = 0;

        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate background shapes
            backgroundShapes.forEach(shape => {
                shape.mesh.rotation.x += shape.rotationSpeed.x;
                shape.mesh.rotation.y += shape.rotationSpeed.y;
                shape.mesh.rotation.z += shape.rotationSpeed.z;
            });

            // Pulse effect on background shapes
            const pulseScale = 0.95 + Math.sin(Date.now() * 0.001) * 0.05;
            torusKnot.scale.set(pulseScale, pulseScale, pulseScale);
            icosahedron.scale.set(pulseScale * 0.9, pulseScale * 0.9, pulseScale * 0.9);
            octahedron.scale.set(pulseScale * 0.85, pulseScale * 0.85, pulseScale * 0.85);

            // Update particle physics
            particles.forEach((p, i) => {
                // Attraction to center
                const centerAttraction = new THREE.Vector3()
                    .copy(p.position)
                    .multiplyScalar(-0.0001);
                p.velocity.add(centerAttraction);

                // Particle-particle repulsion
                particles.forEach((other, j) => {
                    if (i === j) return;
                    const dist = p.position.distanceTo(other.position);
                    if (dist < 8) {
                        const force = new THREE.Vector3()
                            .subVectors(p.position, other.position)
                            .normalize()
                            .multiplyScalar(0.00005 / (dist * dist + 1));
                        p.velocity.add(force);
                    }
                });

                // Damping
                p.velocity.multiplyScalar(0.98);

                // Update position
                p.position.add(p.velocity);

                // Boundary wrap
                if (Math.abs(p.position.x) > 10) p.position.x *= -0.95;
                if (Math.abs(p.position.y) > 10) p.position.y *= -0.95;
                if (Math.abs(p.position.z) > 10) p.position.z *= -0.95;

                // Update geometry
                positionArray[i * 3] = p.position.x;
                positionArray[i * 3 + 1] = p.position.y;
                positionArray[i * 3 + 2] = p.position.z;
            });

            particleGeometry.attributes.position.needsUpdate = true;

            // Update connection lines
            const linePositions = [];
            flowPositions.length = 0;

            particles.forEach((p, i) => {
                particles.forEach((other, j) => {
                    if (i < j) {
                        const dist = p.position.distanceTo(other.position);
                        if (dist < connectionDistance) {
                            linePositions.push(p.position.x, p.position.y, p.position.z);
                            linePositions.push(other.position.x, other.position.y, other.position.z);

                            // Add flowing particle at midpoint
                            const mid = new THREE.Vector3()
                                .addVectors(p.position, other.position)
                                .multiplyScalar(0.5);
                            flowPositions.push(mid.x, mid.y, mid.z);
                        }
                    }
                });
            });

            if (linePositions.length > 0) {
                lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
            }

            if (flowPositions.length > 0) {
                flowingGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(flowPositions), 3));
            }

            // Animate flowing particles
            flowUpdateTime += 0.016;
            if (flowingMaterial.opacity > 0.3) {
                flowingMaterial.opacity -= 0.003;
            } else {
                flowingMaterial.opacity = 0.8;
                flowUpdateTime = 0;
            }

            // Rotate light cones
            lightCone1.rotation.z += 0.0005;
            lightCone2.rotation.z -= 0.0005;

            // Slightly rotate scene
            scene.rotation.x += 0.00003;
            scene.rotation.y += 0.00005;

            // Update light positions (pulsing effect)
            const lightPulse = 0.5 + Math.sin(Date.now() * 0.0005) * 0.3;
            light1.intensity = 1.2 * lightPulse;
            light2.intensity = 1 * lightPulse;

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            particleGeometry.dispose();
            lineGeometry.dispose();
            flowingGeometry.dispose();
            torusKnotGeometry.dispose();
            icoGeometry.dispose();
            octaGeometry.dispose();
            coneGeometry.dispose();
        };
    }, []);

    const handleEnter = () => {
        setIsVisible(false);
        setTimeout(() => {
            onEnter();
        }, 600);
    };

    return (
        <div className={`welcome-overlay ${isVisible ? 'visible' : ''}`}>
            {/* 3D Canvas Background */}
            <canvas ref={canvasRef} className="welcome-canvas"></canvas>

            {/* Animated Background Blobs */}
            <div className="welcome-bg-animation">
                <div className="gradient-blob-1"></div>
                <div className="gradient-blob-2"></div>
                <div className="gradient-blob-3"></div>
            </div>

            <div className="welcome-container">
                {/* Animated Cloud Logo */}
                <div className="cloud-logo-container">
                    <div className="cloud-logo-main">
                        <div className="cloud-logo">☁️</div>
                        <div className="cloud-glow"></div>
                    </div>
                    <div className="cloud-pulse-1"></div>
                    <div className="cloud-pulse-2"></div>
                    <div className="cloud-pulse-3"></div>
                    <div className="floating-icons">
                        <span className="icon-float">📁</span>
                        <span className="icon-float">📝</span>
                        <span className="icon-float">💾</span>
                    </div>
                </div>

                {/* Welcome Text */}
                <div className="welcome-text">
                    <h1 className="project-title">
                        <span className="title-gradient">Cloud File Management</span>
                    </h1>
                    <p className="welcome-description">
                        Experience intelligent file organization with stunning 3D visualization.<br />
                        Manage, search, and organize your files effortlessly.
                    </p>
                </div>

                {/* Features Preview */}
                <div className="features-preview">
                    <div className="feature-item">
                        <span className="feature-icon">⚡</span>
                        <span className="feature-text">Fast</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🔐</span>
                        <span className="feature-text">Secure</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">☁️</span>
                        <span className="feature-text">Cloud</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">📊</span>
                        <span className="feature-text">Analytics</span>
                    </div>
                </div>

                {/* Enter Button */}
                <button className="enter-btn" onClick={handleEnter}>
                    <span className="btn-text">Welcome</span>
                    <span className="btn-icon">→</span>
                </button>
                <p className="enter-hint">Click to enter your dashboard</p>
            </div>
        </div>
    );
};

export default Welcome;
