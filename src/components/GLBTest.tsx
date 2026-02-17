"use client";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useRef } from "react";

function Model() {
  const group = useRef(null);
  const gltf = useGLTF("./models/dragon.glb");
  const { actions, names } = useAnimations(gltf.animations, group);
  // console.log(names);
  useEffect(() => {
    actions[names[0]]?.reset().play();
  }, []);

  return <primitive object={gltf.scene} ref={group} />;
}

export default function GLBTest() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        {/* <Model /> */}
        <OrbitControls />
      </Canvas>
    </div>
  );
}
