import { NavigationControls } from "../components/NavigationControls";
import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import Experience from "../components/Experience";

const World = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <NavigationControls>
        <Canvas
          shadows
          camera={{
            position: [0, 5, 10],
          }}
        >
          <color args={["#FEF9F7"]} attach="background" />
          <directionalLight
            castShadow
            intensity={1.5}
            position={[4, 6, 1]}
            shadow-camera-bottom={-10}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-near={0.01}
            shadow-camera-right={100}
            shadow-camera-top={20}
            shadow-mapSize={[4096, 4096]}
          />
          <ambientLight color="#FFDE91" intensity={0.5} />
          <Suspense fallback={null}>
            <Physics>
              <Experience />
            </Physics>
          </Suspense>
          <Environment background files="/environments/sky.exr" />
          <OrbitControls />
        </Canvas>
      </NavigationControls>
    </div>
  );
};

export default World;
