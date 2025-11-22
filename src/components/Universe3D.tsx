'use client';

import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Memory, SiteSettings, DeviceCapabilities } from '@/types/memory';
import MemoryNode from './MemoryNode';
import HeartStar from './HeartStar';
import ParticleField from './ParticleField';
import MemoryModal from './MemoryModal';

interface Universe3DProps {
  memories: Memory[];
  settings: SiteSettings | null;
  deviceCapabilities: DeviceCapabilities;
}

// Camera controller component
function CameraController({ autoRotate, rotationSpeed }: { autoRotate: boolean; rotationSpeed: number }) {
  const { camera } = useThree();

  useFrame(() => {
    if (autoRotate) {
      camera.position.x = camera.position.x * Math.cos(rotationSpeed) - camera.position.z * Math.sin(rotationSpeed);
      camera.position.z = camera.position.x * Math.sin(rotationSpeed) + camera.position.z * Math.cos(rotationSpeed);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// Loading fallback component
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#9b6cff" wireframe />
    </mesh>
  );
}

export default function Universe3D({ memories, settings, deviceCapabilities }: Universe3DProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [hoveredMemory, setHoveredMemory] = useState<string | null>(null);

  // Default settings if none provided
  const universeSettings = useMemo(() => ({
    autoRotate: settings?.auto_rotate ?? true,
    rotationSpeed: settings?.rotation_speed ?? 0.001,
    particleCount: settings?.particle_count ?? 1000,
    musicEnabled: settings?.music_enabled ?? true,
  }), [settings]);

  // Adjust particle count based on device capabilities
  const adjustedParticleCount = useMemo(() => {
    if (deviceCapabilities.isMobile) {
      return Math.min(universeSettings.particleCount, 200);
    }
    if (deviceCapabilities.deviceMemory < 4) {
      return Math.min(universeSettings.particleCount, 500);
    }
    return universeSettings.particleCount;
  }, [universeSettings.particleCount, deviceCapabilities]);

  // Performance settings based on device
  const performanceSettings = useMemo(() => ({
    antialias: !deviceCapabilities.isMobile,
    shadows: !deviceCapabilities.isMobile && deviceCapabilities.deviceMemory >= 4,
    pixelRatio: deviceCapabilities.isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
  }), [deviceCapabilities]);

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 2, 10], fov: 60 }}
        gl={{
          antialias: performanceSettings.antialias,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={performanceSettings.pixelRatio}
        shadows={performanceSettings.shadows}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#9b6cff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b8a" />
        <spotLight
          position={[0, 20, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#f6f7ff"
          castShadow={performanceSettings.shadows}
        />

        {/* Stars background */}
        <Stars
          radius={100}
          depth={50}
          count={adjustedParticleCount}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Custom particle field */}
        <ParticleField count={Math.floor(adjustedParticleCount / 2)} />

        {/* Camera controller */}
        <CameraController
          autoRotate={universeSettings.autoRotate}
          rotationSpeed={universeSettings.rotationSpeed}
        />

        {/* Memory nodes */}
        <group>
          {memories.map((memory) => (
            <MemoryNode
              key={memory.id}
              memory={memory}
              position={[
                memory.position.x * memory.orbit_radius,
                memory.position.y * memory.orbit_radius,
                memory.position.z * memory.orbit_radius,
              ]}
              onClick={() => setSelectedMemory(memory)}
              isHovered={hoveredMemory === memory.id}
              onHover={(hovered) => setHoveredMemory(hovered ? memory.id : null)}
            />
          ))}
        </group>

        {/* Heart Star (secret) */}
        <HeartStar
          position={[0, 0, 0]} // Center of universe
          onDiscover={() => {
            // Handle heart star discovery
            console.log('Heart Star discovered!');
          }}
        />

        {/* Orbit controls */}
        <OrbitControls
          enablePan={false}
          minDistance={3}
          maxDistance={30}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />

        {/* Instructions text */}
        {!deviceCapabilities.isMobile && (
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Text
              position={[0, -4, 0]}
              fontSize={0.5}
              color="rgba(255, 255, 255, 0.3)"
              anchorX="center"
              anchorY="middle"
            >
              Explore our memories in the stars
            </Text>
          </Float>
        )}
      </Canvas>

      {/* Memory modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <MemoryModal
            memory={selectedMemory}
            isOpen={!!selectedMemory}
            onClose={() => setSelectedMemory(null)}
            onNext={() => {
              const currentIndex = memories.findIndex(m => m.id === selectedMemory.id);
              const nextIndex = (currentIndex + 1) % memories.length;
              setSelectedMemory(memories[nextIndex]);
            }}
            onPrevious={() => {
              const currentIndex = memories.findIndex(m => m.id === selectedMemory.id);
              const prevIndex = currentIndex === 0 ? memories.length - 1 : currentIndex - 1;
              setSelectedMemory(memories[prevIndex]);
            }}
            hasNext={memories.length > 1}
            hasPrevious={memories.length > 1}
          />
        </div>
      )}
    </div>
  );
}