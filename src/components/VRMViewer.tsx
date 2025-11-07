"use client";
import { useState, useRef, useEffect } from "react";
import {
  useAudioLipSync,
  useVRMAnimations,
  useVRMExpressions,
  VRMAvatar,
} from "@khaveeai/react";
import { CameraControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface VRMViewerProps {
  onMessage?: (message: string) => void;
  isTyping?: boolean;
}

export default function VRMViewer({ onMessage, isTyping = false }: VRMViewerProps) {
  const controls = useRef<CameraControls>(null);
  const { setExpression, resetExpressions } = useVRMExpressions();
  const { animate, stopAnimation } = useVRMAnimations();
  const { analyzeLipSync, isAnalyzing } = useAudioLipSync();

  // Store the latest message for emotion detection
  const [currentMessage, setCurrentMessage] = useState<string>("");

  // Update current message when onMessage is called
  // useEffect(() => {
  //   if (onMessage) {
  //     setCurrentMessage(onMessage);
  //   }
  // }, [onMessage]);

  const animations = {
    idle: "./animations/idle.fbx",
    talk : "./animations/talking.fbx",
  };

  // Handle typing animation
  // useEffect(() => {
  //   if (isTyping) {
  //     animate("sit");
  //     setExpression("thinking", 0.5);
  //   } else {
  //     animate("idle");
  //     setExpression("thinking", 0);
  //   }
  // }, [isTyping, animate, setExpression]);

  // Handle message reactions
  useEffect(() => {
    if (currentMessage) {
      // Simple emotion detection based on keywords
      if (currentMessage.includes("ได้เลย") || currentMessage.includes("สบาย")) {
        setExpression("happy", 1);
        setTimeout(() => setExpression("happy", 0), 2000);
      } else if (currentMessage.includes("?") || currentMessage.includes("อะไร")) {
        setExpression("surprised", 0.8);
        setTimeout(() => setExpression("surprised", 0), 2000);
      } else if (currentMessage.includes("!") || currentMessage.includes("ดุดัน")) {
        setExpression("excited", 1);
        setTimeout(() => setExpression("excited", 0), 2000);
      }
    }
  }, [currentMessage, setExpression]);

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
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
        />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <pointLight position={[-5, 3, 5]} intensity={0.6} color="#ffd4a3" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />

        <VRMAvatar
          src="./models/polarbear.vrm"
          animations={animations}
          position-y={-1.25}
        />

        <Environment preset="park" />
      </Canvas>
    </div>
  );
}
