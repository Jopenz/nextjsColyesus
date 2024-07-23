import { useRef } from "react";
import { Mesh } from "three";

import useColyseusStore from "../modules/store/useColyseus";

import Ball from "./Ball";
import { OpponentListComponent } from "./OpponentListComponent";
import Plane from "./Plane";

const Experience = () => {
  const ballRef = useRef<Mesh>();
  const { status } = useColyseusStore();

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight intensity={0.5} position={[-10, 10, 0]} />
      {status === "connected" && (
        <>
          <Ball ref={ballRef} />
          <OpponentListComponent />
        </>
      )}
      <Plane />
    </>
  );
};

export default Experience;
