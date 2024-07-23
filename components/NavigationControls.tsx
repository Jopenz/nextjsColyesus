import { KeyboardControls } from "@react-three/drei";
import { PropsWithChildren } from "react";

const controls = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "reset", keys: ["r", "R"] },
  { name: "audio", keys: ["m", "M"] },
  { name: "shift", keys: ["ShiftLeft", "ShiftRight"] },
];

function NavigationControls(props: PropsWithChildren) {
  return <KeyboardControls map={controls}>{props.children}</KeyboardControls>;
}

export { NavigationControls };
