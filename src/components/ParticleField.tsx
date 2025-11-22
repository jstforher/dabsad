'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
  radius?: number;
}

export default function ParticleField({ count = 500, radius = 20 }: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null);
  const clock = useRef<THREE.Clock>(new THREE.Clock());

  // Generate particle positions
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Random position on sphere surface
      const theta = Math.random() * Math.PI * 2; // Azimuthal angle
      const phi = Math.acos(2 * Math.random() - 1); // Polar angle

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Random colors with romantic theme
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        // Purple accent
        colors[i3] = 155 / 255;     // R
        colors[i3 + 1] = 108 / 255;  // G
        colors[i3 + 2] = 255 / 255;  // B
      } else if (colorChoice < 0.66) {
        // Pink accent
        colors[i3] = 255 / 255;     // R
        colors[i3 + 1] = 107 / 255;  // G
        colors[i3 + 2] = 138 / 255;  // B
      } else {
        // White accent
        colors[i3] = 246 / 255;     // R
        colors[i3 + 1] = 247 / 255;  // G
        colors[i3 + 2] = 255 / 255;  // B
      }
    }

    return { positions, colors };
  }, [count, radius]);

  // Create geometry and material
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(particles.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(particles.colors, 3));
    return geo;
  }, [particles]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, []);

  // Animation
  useFrame(() => {
    if (points.current) {
      const time = clock.current.getElapsedTime();

      // Rotate the entire particle field slowly
      points.current.rotation.y = time * 0.02;
      points.current.rotation.x = Math.sin(time * 0.01) * 0.1;

      // Individual particle twinkling
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      const originalPositions = particles.positions;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;

        // Gentle floating motion
        const offset = Math.sin(time + i * 0.1) * 0.02;

        positions[i3] = originalPositions[i3] + offset;
        positions[i3 + 1] = originalPositions[i3 + 1] + Math.cos(time + i * 0.1) * 0.02;
        positions[i3 + 2] = originalPositions[i3 + 2] + Math.sin(time * 0.5 + i * 0.1) * 0.02;
      }

      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return <points ref={points} geometry={geometry} material={material} />;
}