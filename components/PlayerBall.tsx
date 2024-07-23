import { RigidBody } from "@react-three/rapier";
import { RigidBodyApi } from "@react-three/rapier/dist/declarations/src/types";
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

import { ColyseusContext } from "../context/colyseusContext";

interface BallProps {
  sessionId: string;
}

const PlayerBall = forwardRef((props: BallProps, ref) => {
  const ballRef = useRef<RigidBodyApi | null>(null);
  const { room } = useContext(ColyseusContext);
  const [position, setPosition] = useState(new THREE.Vector3(0, 0, 0));

  useImperativeHandle(ref, () => ballRef.current);

  useEffect(() => {
    if (room) {
      const player = room.state.players.get(props.sessionId);
      if (!player) return;
      const listen = player.listen("position", (position) => {
        setPosition(new THREE.Vector3(position.x, position.y, position.z));
      });

      return () => {
        listen();
      };
    }
  }, [room]);

  if (!room) return null;

  const player = room.state.players.get(props.sessionId);

  if (!player) return null;

  return (
    <RigidBody
      angularDamping={1}
      colliders="ball"
      friction={10}
      linearDamping={1}
      mass={2}
      position={position}
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

PlayerBall.displayName = "PlayerBall";

export default PlayerBall;
