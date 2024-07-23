import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react";
import * as THREE from "three";

const City = () => {
  const { scene } = useGLTF("/worlds/city.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.name.includes("collider")) {
          child.visible = false; // Ocultar colisionadores en la visualización
        }
      }
    });
  }, [scene]);

  return (
    <RigidBody colliders="trimesh" position={[0, 0, 0]} type="fixed">
      <primitive object={scene} />
    </RigidBody>
  );
};

export default City;
