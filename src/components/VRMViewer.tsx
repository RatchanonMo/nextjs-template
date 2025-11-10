"use client";
import { VRMAvatar } from "@khaveeai/react";
import { CameraControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

export default function VRMViewer() {
  const controls = useRef<CameraControls>(null);

  const animations = {
    idle: "./animations/idle.fbx",
    talk: "./animations/talking.fbx",
  };

  return (
    <div className="w-full md:w-1/2 h-1/2 md:h-full p-4">
      <Canvas camera={{ position: [0.25, 0.25, 2], fov: 30 }}>
        <CameraControls
          ref={controls}
          maxPolarAngle={Math.PI / 2}
          minDistance={1}
          maxDistance={10}
        />

        {/* Enhanced lighting setup for mall environment */}
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />

        <Environment preset="park" />
        <VRMAvatar
          src="./models/polarbear.vrm"
          animations={animations}
          position-y={-1.25}
        />
      </Canvas>
    </div>
  );
}
