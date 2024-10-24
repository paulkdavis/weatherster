import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Snow() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const parent = mountRef.current.parentElement;
    const camera = new THREE.PerspectiveCamera(75, parent.clientWidth / parent.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(parent.clientWidth, parent.clientHeight);
    renderer.setClearColor(0x4A5D6B, 1); // Darker blue-grey background

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // Updated Snow Cloud material with darker colors
    const cloudMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color(0xD3D3D3) }, // Darker grey
        highlightColor: { value: new THREE.Color(0xA9A9A9) }, // Medium grey
        shadowColor: { value: new THREE.Color(0x4A4A4A) } // Dark grey
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
        
        // Noise function (same as Cloud component)
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
        vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

        float noise(vec3 P) {
          vec3 i0 = mod289(floor(P)), i1 = mod289(i0 + vec3(1.0));
          vec3 f0 = fract(P), f1 = f0 - vec3(1.0), f = fade(f0);
          vec4 ix = vec4(i0.x, i1.x, i0.x, i1.x), iy = vec4(i0.yy, i1.yy);
          vec4 iz0 = i0.zzzz, iz1 = i1.zzzz;
          vec4 ixy = permute(permute(ix) + iy), ixy0 = permute(ixy + iz0), ixy1 = permute(ixy + iz1);
          vec4 gx0 = ixy0 * (1.0 / 7.0), gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          vec4 gx1 = ixy1 * (1.0 / 7.0), gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0); gx1 = fract(gx1);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0), sz0 = step(gz0, vec4(0.0));
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1), sz1 = step(gz1, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
          gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
          vec3 g0 = vec3(gx0.x,gy0.x,gz0.x), g1 = vec3(gx0.y,gy0.y,gz0.y),
               g2 = vec3(gx0.z,gy0.z,gz0.z), g3 = vec3(gx0.w,gy0.w,gz0.w),
               g4 = vec3(gx1.x,gy1.x,gz1.x), g5 = vec3(gx1.y,gy1.y,gz1.y),
               g6 = vec3(gx1.z,gy1.z,gz1.z), g7 = vec3(gx1.w,gy1.w,gz1.w);
          vec4 norm0 = taylorInvSqrt(vec4(dot(g0,g0), dot(g2,g2), dot(g1,g1), dot(g3,g3)));
          vec4 norm1 = taylorInvSqrt(vec4(dot(g4,g4), dot(g6,g6), dot(g5,g5), dot(g7,g7)));
          g0 *= norm0.x; g2 *= norm0.y; g1 *= norm0.z; g3 *= norm0.w;
          g4 *= norm1.x; g6 *= norm1.y; g5 *= norm1.z; g7 *= norm1.w;
          vec4 nz = mix(vec4(dot(g0, vec3(f0.x, f0.y, f0.z)), dot(g1, vec3(f1.x, f0.y, f0.z)),
                             dot(g2, vec3(f0.x, f1.y, f0.z)), dot(g3, vec3(f1.x, f1.y, f0.z))),
                        vec4(dot(g4, vec3(f0.x, f0.y, f1.z)), dot(g5, vec3(f1.x, f0.y, f1.z)),
                             dot(g6, vec3(f0.x, f1.y, f1.z)), dot(g7, vec3(f1.x, f1.y, f1.z))),
                        f.z);
          return 2.2 * mix(mix(nz.x,nz.z,f.y), mix(nz.y,nz.w,f.y), f.x);
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

    // Create snow cloud
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

    // Create snowflakes
    const snowflakes = [];
    const snowflakeGeometry = new THREE.CircleGeometry(0.02, 6);
    const snowflakeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < 200; i++) {
      const snowflake = new THREE.Mesh(snowflakeGeometry, snowflakeMaterial);
      snowflake.position.set(
        (Math.random() - 0.5) * 10,
        Math.random() * 10 - 5,
        (Math.random() - 0.5) * 10
      );
      snowflake.rotation.z = Math.random() * Math.PI;
      snowflakes.push(snowflake);
      scene.add(snowflake);
    }

    // Animation
    const animate = (time) => {
      requestAnimationFrame(animate);

      cloudMaterial.uniforms.time.value = time * 0.0005;

      // Gentle cloud movement
      cloud.position.y = Math.sin(time * 0.001) * 0.1;
      cloud.position.x = Math.sin(time * 0.0005) * 0.05;

      // Animate snowflakes
      snowflakes.forEach(snowflake => {
        snowflake.position.y -= 0.01; // Fall speed
        snowflake.position.x += Math.sin(time * 0.001 + snowflake.position.z) * 0.001; // Gentle sway
        snowflake.rotation.z += 0.01; // Rotation

        // Reset snowflake position when it falls below view
        if (snowflake.position.y < -5) {
          snowflake.position.y = 5;
          snowflake.position.x = (Math.random() - 0.5) * 10;
        }
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