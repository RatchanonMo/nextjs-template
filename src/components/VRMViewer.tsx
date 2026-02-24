"use client";
import { VRMAvatar } from "@khaveeai/react";
import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

export default function VRMViewer() {
  const controls = useRef<CameraControls>(null);

  const animations = {
    idle: "./animations/sit.fbx",
  };

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0.25, 0.25, 2], fov: 100 }}>
        <CameraControls
          ref={controls}
          maxPolarAngle={Math.PI / 2}
          minDistance={1}
          maxDistance={10}
        />
        <directionalLight position={[10, 10, 5]} intensity={2} />

        <ambientLight intensity={1} />
        <VRMAvatar
          src="./models/Masscoss.vrm"
          animations={animations}
          position-y={-1.25}
          scale={[0.8, 0.8, 0.8]}
        />
      </Canvas>
    </div>
  );
}
