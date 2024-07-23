import { RigidBody } from "@react-three/rapier";

function Plane(props: any) {
  return (
    <RigidBody type="fixed" colliders="hull" {...props}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

export default Plane;
