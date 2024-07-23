import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { Player } from "../types/types.d";

export type ColyseusStore = {
  status: "connecting" | "connected" | "disconnected";
  player: Player | undefined;
  playersIds: string[];
  players: Player[];
  setStatus: (status: "connecting" | "connected" | "disconnected") => void;
  setPlayersIds: (playersIds: string[]) => void;
  setPlayers: (players: Player[]) => void;
  setPlayer: (player: Player) => void;
  addPlayer: (player: Player) => void;
  updatePlayerPosition: (
    sessionId: string,
    x: number,
    y: number,
    z: number
  ) => void;
  removePlayer: (playerId: string) => void;
  updatePlayer: (player: Player) => void;
};

const initialState: Partial<ColyseusStore> = {
  status: "disconnected",
  player: undefined,
  playersIds: [],
  players: [],
};

const useColyseusStore = create<ColyseusStore>()(
  devtools(
    (set) => ({
      status: "disconnected",
      player: undefined,
      playersIds: [],
      players: [],
      setStatus: (status) => {
        if (status === "disconnected") {
          set({ ...initialState });
        } else {
          set({ status });
        }
      },
      setPlayersIds: (playersIds: string[]) => {
        set({ playersIds });
      },
      setPlayer: (player) => {
        set({ player });
      },
      setPlayers: (players) => {
        set({ players });
      },
      addPlayer: (player) => {
        set((state) => ({
          players: [...state.players, player],
          playersIds: [...state.playersIds, player.sessionId],
        }));
      },
      removePlayer: (playerId) => {
        set((state) => ({
          players: state.players.filter(
            (player) => player.sessionId !== playerId
          ),
          playersIds: state.playersIds.filter((id) => id !== playerId),
        }));
      },
      updatePlayer: (player) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.sessionId === player.sessionId ? player : p
          ),
        }));
      },
      updatePlayerPosition: (sessionId, x, y, z) => {
        set((state) => ({
          players: state.players.map((player) => {
            if (player.sessionId === sessionId) {
              player.position.x = x;
              player.position.y = y;
              player.position.z = z;
            }
            return player;
          }),
        }));
      },
    }),
    {
      name: "colyseus",
    }
  )
);

export default useColyseusStore;
