'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

interface HeartStarProps {
  position: [number, number, number];
  onDiscover: () => void;
}

export default function HeartStar({ position, onDiscover }: HeartStarProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isDiscovered, setIsDiscovered] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0.5);

  // Create heart shape using extruded geometry
  const heartShape = useMemo(() => {
    const shape = new THREE.Shape();

    // Draw heart shape using bezier curves
    const x = 0, y = 0;
    shape.moveTo(x + 0.5, y + 0.5);
    shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    shape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    shape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.5, x + 0.5, y + 1.9);
    shape.bezierCurveTo(x + 1.2, y + 1.5, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    shape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1, y);
    shape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    return shape;
  }, []);

  // Extrude settings for 3D heart
  const extrudeSettings = useMemo(() => ({
    depth: 0.2,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 2,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  }), []);

  // Animation frame update
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();

      // Gentle floating and rotation
      meshRef.current.position.y = position[1] + Math.sin(time * 0.8) * 0.3;
      meshRef.current.rotation.z = Math.sin(time * 0.6) * 0.1;

      // Pulsing glow effect
      setGlowIntensity(0.5 + Math.sin(time * 2) * 0.3);

      // Discovery animation
      if (isDiscovered) {
        const scale = 1 + Math.sin(time * 4) * 0.2;
        meshRef.current.scale.set(scale, scale, scale);
      }
    }
  });

  // Handle discovery
  const handleDiscovery = () => {
    if (!isDiscovered) {
      setIsDiscovered(true);
      onDiscover();

      // Trigger celebration effects
      setTimeout(() => {
        // Could add confetti, sound, or other effects here
        console.log('🎉 Heart Star discovered! Special memory unlocked!');
      }, 100);
    }
  };

  return (
    <Float
      speed={1}
      rotationIntensity={0.3}
      floatIntensity={0.5}
    >
      <group
        ref={meshRef}
        position={position}
        onClick={handleDiscovery}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Main heart shape */}
        <mesh castShadow receiveShadow>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshStandardMaterial
            color={isDiscovered ? '#ff6b8a' : '#f6f7ff'}
            emissive={isDiscovered ? '#ff6b8a' : '#f6f7ff'}
            emissiveIntensity={glowIntensity}
            metalness={0.8}
            roughness={0.2}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Outer glow effect */}
        <mesh scale={[1.3, 1.3, 1.3]}>
          <extrudeGeometry args={[heartShape, extrudeSettings]} />
          <meshBasicMaterial
            color={isDiscovered ? '#ff6b8a' : '#f6f7ff'}
            transparent
            opacity={glowIntensity * 0.3}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Sparkle particles around the heart */}
        {isDiscovered && (
          <>
            {Array.from({ length: 6 }, (_, i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i * Math.PI * 2) / 6) * 1.5,
                  Math.sin((i * Math.PI * 2) / 6) * 1.5,
                  0,
                ]}
              >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshBasicMaterial color="#f6f7ff" />
              </mesh>
            ))}
          </>
        )}

        {/* Subtle ring orbit */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.2, 0.02, 8, 32]} />
          <meshBasicMaterial
            color={isDiscovered ? '#ff6b8a' : '#9b6cff'}
            transparent
            opacity={0.3}
          />
        </mesh>
      </group>
    </Float>
  );
}