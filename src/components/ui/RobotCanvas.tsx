import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef } from 'react';
import {
  OrbitControls,
  useGLTF,
  Environment,
  useAnimations
} from '@react-three/drei';
import * as THREE from 'three';

// Dynamic asset URL resolved by Vite
const MODEL_URL = new URL('/assets/robot_playground.glb', import.meta.url).href;

function Robot() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  // Play first animation (or all) once loaded
  useEffect(() => {
    if (actions && Object.keys(actions).length) {
      // Play all clips
      Object.values(actions).forEach((action) => {
        action?.reset().play();
      });
    }
  }, [actions]);

  return (
    <primitive ref={group} object={scene} scale={0.7} position={[0, -1.0, 0]} />
  );
}
useGLTF.preload(MODEL_URL);

export default function RobotCanvas() {
  return (
    <div className="relative h-full w-full">
      <div className="relative h-[500px] w-full overflow-hidden rounded-2xl lg:h-[650px]">
        <Canvas camera={{ fov: 45, position: [0, 0.8, 3.5] }} shadows>
          <Suspense fallback={null}>
            <Environment preset="city" background={false} />
            <Robot />
            <OrbitControls
              autoRotateSpeed={2}
              enableRotate={false}
              enableZoom={false}
              enablePan={false}
              enableDamping
              minPolarAngle={Math.PI / 2.5}
              maxPolarAngle={Math.PI / 2.2}
            />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
