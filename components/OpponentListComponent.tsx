import useColyseusStore from "../modules/store/useColyseus";

import PlayerBall from "./PlayerBall";

export function OpponentListComponent() {
  const otherPlayers = useColyseusStore((state) => state.playersIds);

  console.log("otherPlayers", otherPlayers);
  return (
    <group>
      {otherPlayers.map((sessionId: string) => {
        return <PlayerBall key={`player-${sessionId}`} sessionId={sessionId} />;
      })}
    </group>
  );
}
