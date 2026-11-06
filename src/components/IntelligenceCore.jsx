"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function makeParticles(count = 220) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = Math.PI * (3 - Math.sqrt(5)) * i;
    positions[i * 3] = Math.cos(theta) * radius * 1.42;
    positions[i * 3 + 1] = y * 1.42;
    positions[i * 3 + 2] = Math.sin(theta) * radius * 1.42;
  }
  return { positions };
}

function IntelligenceField({ reduceMotion }) {
  const group = useRef(null);
  const particles = useMemo(() => makeParticles(), []);
  const connections = useMemo(() => {
    const points = [];
    const { positions } = particles;
    const count = positions.length / 3;
    for (let i = 0; i < count; i += 6) {
      const j = (i + 13) % count;
      points.push(
        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
    return geometry;
  }, [particles]);

  useEffect(() => () => connections.dispose(), [connections]);

  useFrame(({ pointer, camera }, delta) => {
    if (!group.current) return;
    const motion = reduceMotion ? 0 : 1;
    const scrollInfluence = typeof window === "undefined" ? 0 : Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    group.current.rotation.y += delta * 0.055 * motion;
    group.current.rotation.y += (pointer.x * 0.12 - group.current.rotation.y) * 0.012 * motion;
    group.current.rotation.x += (pointer.y * 0.08 - group.current.rotation.x) * 0.012 * motion;
    camera.position.x += (pointer.x * 0.12 - camera.position.x) * 0.02 * motion;
    camera.position.y += (pointer.y * 0.1 - camera.position.y) * 0.02 * motion;
    camera.position.z += (5.4 + scrollInfluence * 0.45 - camera.position.z) * 0.025;
    group.current.scale.setScalar(1 - scrollInfluence * 0.035);
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        </bufferGeometry>
      <pointsMaterial color="#38e0cb" size={0.026} sizeAttenuation transparent opacity={0.78} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <lineSegments geometry={connections}>
        <lineBasicMaterial color="#76a9ff" transparent opacity={0.14} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[1.08, 1]} />
        <meshBasicMaterial color="#76a9ff" wireframe transparent opacity={0.09} />
      </mesh>
      <mesh rotation={[0.8, 0.4, 0.2]}>
        <torusGeometry args={[1.58, 0.0018, 4, 120]} />
        <meshBasicMaterial color="#38e0cb" transparent opacity={0.24} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial color="#38e0cb" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

export default function IntelligenceCore({ onReady }) {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const container = useRef(null);
  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 640px)");
    const syncPreferences = () => {
      setReduceMotion(motionPreference.matches);
      setIsMobile(mobileViewport.matches);
    };
    syncPreferences();
    motionPreference.addEventListener?.("change", syncPreferences);
    mobileViewport.addEventListener?.("change", syncPreferences);
    return () => {
      motionPreference.removeEventListener?.("change", syncPreferences);
      mobileViewport.removeEventListener?.("change", syncPreferences);
    };
  }, []);

  useEffect(() => {
    if (!container.current || !("IntersectionObserver" in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return <div ref={container} className="core-scene" aria-hidden="true">
    {!isMobile && <Canvas
      className="core-canvas"
      dpr={[1, 1.2]}
      frameloop={inView && !reduceMotion ? "always" : "demand"}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      onCreated={() => onReady?.()}
      fallback={null}
    >
      <ambientLight intensity={0.45} />
      <IntelligenceField reduceMotion={reduceMotion} />
    </Canvas>}
  </div>;
}
