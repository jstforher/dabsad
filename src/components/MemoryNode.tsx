'use client';

import { useRef, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Memory } from '@/types/memory';

interface MemoryNodeProps {
  memory: Memory;
  position: [number, number, number];
  onClick: () => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  deviceCapabilities?: {
    webgl: boolean;
    deviceMemory: number;
    cores: number;
    isMobile: boolean;
    isTablet: boolean;
  };
}

export default function MemoryNode({
  memory,
  position,
  onClick,
  isHovered,
  onHover,
  deviceCapabilities
}: MemoryNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [distance, setDistance] = useState(10);
  const { camera } = useThree();

  // Update distance from camera
  useFrame(() => {
    if (meshRef.current) {
      const meshPosition = new THREE.Vector3();
      meshRef.current.getWorldPosition(meshPosition);
      const currentDistance = camera.position.distanceTo(meshPosition);
      setDistance(currentDistance);
    }
  });

  // Determine LOD (Level of Detail) based on distance
  const lodLevel = useMemo(() => {
    if (distance < 5) return 'high';
    if (distance < 15) return 'medium';
    return 'low';
  }, [distance]);

  // Color based on memory properties
  const nodeColor = useMemo(() => {
    if (memory.is_secret) return '#ff6b8a'; // Secondary color for secrets
    if (memory.is_featured) return '#f6f7ff'; // Star color for featured
    return '#9b6cff'; // Primary color for regular
  }, [memory.is_secret, memory.is_featured]);

  // Size based on distance and properties
  const nodeSize = useMemo(() => {
    let baseSize = memory.is_featured ? 0.8 : 0.5;
    if (memory.is_secret) baseSize *= 1.2; // Secrets are slightly larger

    // Scale down with distance for performance
    if (lodLevel === 'medium') baseSize *= 0.8;
    if (lodLevel === 'low') baseSize *= 0.6;

    return baseSize;
  }, [lodLevel, memory.is_featured, memory.is_secret]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.1;

      // Rotation for featured memories
      if (memory.is_featured) {
        meshRef.current.rotation.y = time * 0.5;
      }

      // Hover effect
      if (isHovered) {
        meshRef.current.scale.lerp(
          new THREE.Vector3(1.2, 1.2, 1.2),
          0.1
        );
      } else {
        meshRef.current.scale.lerp(
          new THREE.Vector3(1, 1, 1),
          0.1
        );
      }
    }
  });

  // Optimized geometry based on LOD
  const geometry = useMemo(() => {
    if (lodLevel === 'high') {
      return <sphereGeometry args={[nodeSize, 32, 32]} />;
    } else if (lodLevel === 'medium') {
      return <sphereGeometry args={[nodeSize, 16, 16]} />;
    } else {
      return <sphereGeometry args={[nodeSize, 8, 8]} />;
    }
  }, [lodLevel, nodeSize]);

  // Material with performance optimizations
  const material = useMemo(() => {
    const materialProps = {
      color: nodeColor,
      emissive: nodeColor,
      emissiveIntensity: isHovered ? 0.3 : 0.1,
      transparent: true,
      opacity: lodLevel === 'low' ? 0.7 : 0.9,
      roughness: 0.3,
      metalness: 0.7,
    };

    if (deviceCapabilities?.isMobile) {
      // Simplified material for mobile
      return <meshBasicMaterial {...materialProps} />;
    }

    return <meshStandardMaterial {...materialProps} />;
  }, [nodeColor, isHovered, lodLevel, deviceCapabilities?.isMobile]);

  return (
    <Float
      speed={memory.is_featured ? 2 : 1}
      rotationIntensity={memory.is_featured ? 0.5 : 0.2}
      floatIntensity={0.2}
    >
      <group position={position}>
        {/* Main memory node */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={(event) => {
            event.stopPropagation();
            onHover(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            onHover(false);
            document.body.style.cursor = 'auto';
          }}
        >
          {geometry}
          {material}
        </mesh>

        {/* Inner glow for featured/secret memories */}
        {(memory.is_featured || memory.is_secret) && lodLevel !== 'low' && (
          <mesh scale={[1.2, 1.2, 1.2]}>
            <sphereGeometry args={[nodeSize, 16, 16]} />
            <meshBasicMaterial
              color={nodeColor}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        )}

        {/* Memory title (only show when hovered or close) */}
        {(isHovered || distance < 8) && lodLevel === 'high' && (
          <Text
            position={[0, nodeSize + 0.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={3}
            textAlign="center"
          >
            {memory.title}
          </Text>
        )}

        {/* Category indicator */}
        {lodLevel !== 'low' && (
          <mesh position={[nodeSize * 0.8, 0, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial
              color={
                memory.category === 'PHOTO' ? '#4ade80' :
                memory.category === 'VIDEO' ? '#60a5fa' :
                '#f472b6'
              }
            />
          </mesh>
        )}
      </group>
    </Float>
  );
}