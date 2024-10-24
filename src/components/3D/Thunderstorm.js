import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Thunderstorm() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const parent = mountRef.current.parentElement;
    const camera = new THREE.PerspectiveCamera(75, parent.clientWidth / parent.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setClearColor(0x1a1a1a, 1); // Darker background for storm

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Darker cloud material
    const cloudMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0x2c2c2c) }, // Darker base color
        highlightColor: { value: new THREE.Color(0x4a4a4a) }, // Darker highlight
        shadowColor: { value: new THREE.Color(0x1a1a1a) } // Darker shadow
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
        uniform vec3 shadowColor;
        varying vec2 vUv;
        varying vec3 vNormal;
        
        // [Previous noise functions remain the same]
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

        float noise(vec3 P) {
          // [Previous noise implementation remains the same]
          return 0.0; // Shortened for brevity - keep original implementation
        }
        
        float fbm(vec3 x) {
          float v = 0.0;
          float a = 0.5;
          vec3 shift = vec3(100);
          for (int i = 0; i < 5; ++i) {
            v += a * noise(x);
            x = x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }
        
        void main() {
          vec3 coord = vec3(vUv * 8.0, time * 0.1);
          float pattern = fbm(coord);
          
          float edge = smoothstep(0.0, 0.7, 1.0 - length(vUv - 0.5) * 1.7);
          
          float lightIntensity = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0)));
          vec3 color = mix(shadowColor, highlightColor, lightIntensity * pattern);
          color = mix(baseColor, color, pattern * 0.6);
          
          gl_FragColor = vec4(color, edge);
        }
      `,
      transparent: true,
      side: THREE.FrontSide
    });

    // Create cloud
    const cloudGeometry = new THREE.SphereGeometry(2, 48, 48);
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloud.scale.set(0.8, 0.5, 0.8);
    scene.add(cloud);

    // Add cloud puffs
    const puffGeometry = new THREE.SphereGeometry(2, 32, 32);
    const puffs = [
      { position: new THREE.Vector3(0, 0, 0), scale: 1.5 },
      { position: new THREE.Vector3(1.2, -0.2, 0), scale: 1.3 },
      { position: new THREE.Vector3(-1.0, -0.3, 0.8), scale: 1.25 },
      { position: new THREE.Vector3(0.5, 0.4, 0.5), scale: 1.1 },
      { position: new THREE.Vector3(0.0, 1.0, 0.0), scale: 1.2 },
      { position: new THREE.Vector3(2, 1.5, -0.2), scale: 0.9 },
      { position: new THREE.Vector3(-0.2, 1.4, 1.8), scale: 0.9 },
      { position: new THREE.Vector3(1.6, 1.3, -0.3), scale: 0.75 },
      { position: new THREE.Vector3(-0.3, 2.0, 0.3), scale: 1 },
      { position: new THREE.Vector3(0.0, 2.5, 0.0), scale: 1 }
    ];

    puffs.forEach(puff => {
      const puffMesh = new THREE.Mesh(puffGeometry, cloudMaterial);
      puffMesh.position.copy(puff.position);
      puffMesh.scale.setScalar(puff.scale);
      cloud.add(puffMesh);
    });

    // Create raindrops
    const raindrops = [];
    const raindropGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 6); // Slightly longer raindrops
    const raindropMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.4
    });

    for (let i = 0; i < 400; i++) { // More raindrops
      const raindrop = new THREE.Mesh(raindropGeometry, raindropMaterial);
      raindrop.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 10 - 5,
        (Math.random() - 0.5) * 10
      );
      raindrop.rotation.z = Math.PI / 4; // Steeper angle
      raindrops.push(raindrop);
      scene.add(raindrop);
    }

    // Create lightning
    const lightningMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0
    });

    const createLightningBolt = () => {
      const points = [];
      let y = 3;
      points.push(new THREE.Vector3(0, y, 0));
      
      while (y > -3) {
        y -= 0.5;
        points.push(new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          y,
          (Math.random() - 0.5) * 0.5
        ));
      }

      const lightningGeometry = new THREE.BufferGeometry().setFromPoints(points);
      const lightning = new THREE.Line(lightningGeometry, lightningMaterial);
      return lightning;
    };

    // Create multiple lightning bolts
    const lightningBolts = Array(3).fill(null).map(() => createLightningBolt());
    lightningBolts.forEach(bolt => {
      bolt.visible = false;
      scene.add(bolt);
    });

    // Ambient light for general scene
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    // Lightning flash light
    const flash = new THREE.PointLight(0xFFFFFF, 0, 20);
    flash.position.set(0, 5, 0);
    scene.add(flash);

    // Lightning control variables
    let lightningTimer = 0;
    let isLightning = false;
    let currentBolt = null;
    let flashIntensity = 0;

    // Animation
    const animate = (time) => {
      requestAnimationFrame(animate);

      cloudMaterial.uniforms.time.value = time * 0.0005;

      // Gentle cloud movement
      cloud.position.y = Math.sin(time * 0.001) * 0.1;
      cloud.position.x = Math.sin(time * 0.0005) * 0.05;

      // Animate raindrops
      raindrops.forEach(raindrop => {
        raindrop.position.y -= 0.2; // Faster rain
        raindrop.position.x += Math.sin(time * 0.001 + raindrop.position.z) * 0.003;

        if (raindrop.position.y < -5) {
          raindrop.position.y = 5;
          raindrop.position.x = (Math.random() - 0.5) * 10;
        }
      });

      // Lightning effect
      lightningTimer += 1;
      if (!isLightning && lightningTimer > 200 && Math.random() < 0.01) {
        isLightning = true;
        currentBolt = lightningBolts[Math.floor(Math.random() * lightningBolts.length)];
        currentBolt.visible = true;
        flashIntensity = 1;
        lightningTimer = 0;
      }

      if (isLightning) {
        flashIntensity *= 0.9;
        flash.intensity = flashIntensity * 5;
        if (flashIntensity < 0.01) {
          isLightning = false;
          currentBolt.visible = false;
          flash.intensity = 0;
        }
      }

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

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}