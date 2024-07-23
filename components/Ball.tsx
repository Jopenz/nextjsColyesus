import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { RigidBodyApi } from "@react-three/rapier/dist/declarations/src/types";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

import { ColyseusContext } from "../context/colyseusContext";

// Asegúrate de que la ruta sea correcta

interface BallProps {}

const Ball = forwardRef((props: BallProps, ref) => {
  const { room, sendPosition } = useContext(ColyseusContext);
  const previousPositionRef = useRef(new THREE.Vector3());
  const ballRef = useRef<RigidBodyApi | null>(null);
  const cameraProperties = useMemo(
    () => ({
      position: new THREE.Vector3(0, 20, 20),
      target: new THREE.Vector3(),
    }),
    []
  );
  const [ballPosition, setBallPosition] = useState(new THREE.Vector3());

  useImperativeHandle(ref, () => ballRef.current);

  const [_, getKeys] = useKeyboardControls();

  useFrame(({ camera }, delta) => {
    try {
      const ballPosition = ballRef.current?.translation();
      if (ballPosition) {
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(ballPosition);
        cameraPosition.z += 6;
        cameraPosition.y += 3;

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(ballPosition);
        cameraTarget.y += 0.5;

        cameraProperties.position.lerp(cameraPosition, 5 * delta);
        cameraProperties.target.lerp(cameraTarget, 5 * delta);

        camera.position.copy(cameraProperties.position);
        camera.lookAt(cameraProperties.target);
      }
    } catch (error) {
      console.error("Error during frame update:", error);
    }
  });

  useFrame((_, delta) => {
    try {
      const { forward, backward, left, right, jump } = getKeys();
      const impulseStrength = 50 * delta;
      const impulse = { x: 0, y: 0, z: 0 };

      if (forward) {
        impulse.z -= impulseStrength;
      }
      if (backward) {
        impulse.z += impulseStrength;
      }
      if (left) {
        impulse.x -= impulseStrength;
      }
      if (right) {
        impulse.x += impulseStrength;
      }

      ballRef.current?.applyImpulse(impulse);

      if (jump) {
        ballRef.current?.applyImpulse({ x: 0, y: 1.2, z: 0 });
      }

      const ballPosition = ballRef.current?.translation();
      if (ballPosition && !ballPosition.equals(previousPositionRef.current)) {
        if (
          ballPosition.x < 30 &&
          ballPosition.x > -30 &&
          ballPosition.z < 30 &&
          ballPosition.z > -30 &&
          ballPosition.y < 30 &&
          ballPosition.y > -30
        ) {
          sendPosition(ballPosition);
        }
        previousPositionRef.current.copy(ballPosition);
      }
    } catch (error) {
      console.error("Error applying frame updates:", error);
    }
  });

  useEffect(() => {
    if (!room) return;
    const player = room.state.players.get(sessionId);
    if (!player) return;

    setBallPosition(
      new THREE.Vector3(player.position.x, player.position.y, player.position.z)
    );
  }, [room]);

  if (!room) return null;

  const sessionId = room.sessionId;
  const player = room.state.players.get(sessionId);

  if (!player) return null;

  return (
    <RigidBody
      angularDamping={1}
      colliders="ball"
      friction={10}
      linearDamping={1}
      mass={2}
      position={ballPosition}
      ref={ballRef}
      restitution={0.2}
    >
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={player.color} />
      </mesh>
    </RigidBody>
  );
});

Ball.displayName = "Ball";

export default Ball;
