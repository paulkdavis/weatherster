import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Sun() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const parent = mountRef.current.parentElement;
    const camera = new THREE.PerspectiveCamera(75, parent.clientWidth / parent.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setClearColor(0x000000, 0);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Sun group
    const sunGroup = new THREE.Group();

    // Stylized sun shader
    const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0xffff00) },
        highlightColor: { value: new THREE.Color(0xffffff) }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 baseColor;
        uniform vec3 highlightColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        void main() {
          // Simple wave pattern
          float wave = sin(vUv.y * 10.0 + time * 2.0) * 0.5 + 0.5;
          
          // Mix base color with highlight color
          vec3 color = mix(baseColor, highlightColor, wave * 0.3);
          
          // Add some variation based on normal
          float variation = dot(vNormal, vec3(0.0, 0.0, 1.0)) * 0.5 + 0.5;
          color = mix(color, highlightColor, variation * 0.2);
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);

    // Simple glow effect
    const glowGeometry = new THREE.SphereGeometry(1.1, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffaa,
      transparent: true,
      opacity: 0.3
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sunGroup.add(glow);

    // Ray setup
    const numRays = 100; // Reduced number of rays
    const maxRayLength = 0.8; // Shorter rays
    const rayMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });

    // Create ray geometries
    const rays = [];
    for (let i = 0; i < numRays; i++) {
      const rayGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(6);

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      positions[0] = x;
      positions[1] = y;
      positions[2] = z;
      positions[3] = x;
      positions[4] = y;
      positions[5] = z;

      rayGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const ray = new THREE.Line(rayGeometry, rayMaterial);
      rays.push({
        line: ray,
        speed: Math.random() * 0.05 + 0.02, // Slower speed
        state: 'waiting',
        progress: 0
      });
      sunGroup.add(ray);
    }

    scene.add(sunGroup);

    // Animation
    const animate = (time) => {
      requestAnimationFrame(animate);

      // Update sun shader time uniform
      sun.material.uniforms.time.value = time * 0.001;

      // Slowly rotate sun
      sunGroup.rotation.y += 0.002;
      sunGroup.rotation.x += 0.001;

      // Animate rays
      rays.forEach((ray) => {
        const positions = ray.line.geometry.attributes.position.array;

        if (ray.state === 'waiting') {
          if (Math.random() < 0.01) { // Less frequent ray animation
            ray.state = 'extending';
            ray.progress = 0;
          }
        } else if (ray.state === 'extending') {
          ray.progress += ray.speed;
          if (ray.progress >= 1) {
            ray.state = 'retracting';
          }
        } else if (ray.state === 'retracting') {
          ray.progress -= ray.speed;
          if (ray.progress <= 0) {
            ray.state = 'waiting';
            ray.progress = 0;
          }
        }

        const length = ray.progress * maxRayLength;
        positions[3] = positions[0] * (1 + length);
        positions[4] = positions[1] * (1 + length);
        positions[5] = positions[2] * (1 + length);

        ray.line.geometry.attributes.position.needsUpdate = true;
      });

      renderer.render(scene, camera);
    };

    animate(0);

    // Window resize handler
    const handleResize = () => {
      const { clientWidth, clientHeight } = parent;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }}></div>;
}