"use client";
import { Button } from "@heroui/react";
import {
  useAudioLipSync,
  useVRMAnimations,
  useVRMExpressions,
  VRMAvatar,
} from "@khaveeai/react";
import { CameraControls, Environment, Html } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";

export default function page() {
  const controls = useRef<CameraControls>(null);
  const { setExpression, resetExpressions } = useVRMExpressions();
  const { animate, stopAnimation } = useVRMAnimations();
  const { analyzeLipSync, isAnalyzing } = useAudioLipSync();

  const animations = {
    idle: "./animations/idle.fbx",
    fight: "./animations/fight.fbx",
  };
  return (
    <div className="h-dvh">
      <Canvas camera={{ position: [0.25, 0.25, 2], fov: 30 }}>
        <CameraControls
          ref={controls}
          maxPolarAngle={Math.PI / 2}
          minDistance={1}
          maxDistance={10}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} position-y={1.25} />

        <VRMAvatar
          src="./models/khavee.vrm"
          animations={animations}
          position-y={-1.25}
        />

        <ambientLight intensity={0.5} />
        <Environment preset="sunset" />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <color attach="background" args={["#333"]} />

        <Html className="space-y-10">
          <Button
            onPress={() => {
              setExpression("happy", 1);
            }}
          >
            Happy
          </Button>
          <Button variant="faded" onPress={resetExpressions}>
            Reset
          </Button>
          <Button
            color="danger"
            onPress={() => {
              analyzeLipSync("./audio/harvard.wav");
            }}
            isDisabled={isAnalyzing}
          >
            Lipsync
          </Button>
          <Button
            color="primary"
            onPress={() => {
              animate("idle");
            }}
          >
            Idle
          </Button>
          <Button
            color="primary"
            onPress={() => {
              animate("fight");
            }}
          >
            Fight
          </Button>
          <Button color="primary" variant="faded" onPress={stopAnimation}>
            Stop
          </Button>
        </Html>
      </Canvas>
    </div>
  );
}
