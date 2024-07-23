import { Client, Room } from "colyseus.js";
import React, { createContext, useEffect } from "react";
import * as THREE from "three";

import useColyseusStore from "../modules/store/useColyseus";
import { WorldState, Player } from "../modules/types/types.d";

interface ColyseusContextValue {
  client: Client | null;
  room: Room<WorldState> | null;
  joinOrCreate: (roomName: string) => Promise<void>;
  join: (roomName: string) => Promise<void>;
  sendPosition: (data: THREE.Vector3) => void;
}

export const ColyseusContext = createContext<ColyseusContextValue>({
  client: null,
  room: null,
  joinOrCreate: async () => {},
  join: async () => {},
  sendPosition: () => {},
});

interface ColyseusProviderProps {
  children: React.ReactNode;
}

export function ColyseusProvider({ children }: ColyseusProviderProps) {
  const clientRef = React.useRef<Client | null>(null);
  const roomRef = React.useRef<Room<WorldState> | null>(null);
  const { setStatus, setPlayer, addPlayer, removePlayer } = useColyseusStore();

  useEffect(() => {
    clientRef.current = new Client("ws://localhost:2567");

    const JoinOnInit = async () => {
      try {
        setStatus("connecting");
        if (!clientRef.current) return;
        const room: Room<WorldState> = await clientRef.current.joinOrCreate(
          "three-city"
        );
        roomRef.current = room;
        registerEvents();
        setStatus("connected");
      } catch (error) {
        console.log(error);
        setStatus("disconnected");
      }
    };

    if (clientRef.current) {
      JoinOnInit();
    }
  }, []);

  const registerEvents = () => {
    if (!roomRef.current) return;

    roomRef.current.state.players.onAdd((player: Player, sessionId: string) => {
      if (roomRef.current && sessionId === roomRef.current.sessionId) {
        setPlayer(player);
      } else {
        addPlayer(player);
      }
    }, true);

    roomRef.current.state.players.onRemove(
      (player: Player, sessionId: string) => {
        removePlayer(sessionId);
      }
    );
  };

  const joinOrCreate = async (roomName: string) => {
    try {
      setStatus("connecting");
      if (!clientRef.current) {
        throw new Error("Client not initialized");
      }
      const room: Room<WorldState> = await clientRef.current.joinOrCreate(
        roomName
      );
      roomRef.current = room;
      setStatus("connected");
    } catch (error) {
      console.log(error);
      setStatus("disconnected");
    }
  };

  const sendPosition = (data: THREE.Vector3) => {
    if (roomRef.current) {
      try {
        roomRef.current.send("movementData", data);
      } catch (e) {
        console.log("Error to send DataAxis", e);
      }
    }
  };

  const join = async (roomName: string) => {
    try {
      setStatus("connecting");
      if (!clientRef.current) {
        throw new Error("Client not initialized");
      }
      const room: Room<WorldState> = await clientRef.current.joinOrCreate(
        roomName
      );
      roomRef.current = room;
      setStatus("connected");
    } catch (error) {
      console.log(error);
      setStatus("disconnected");
    }
  };

  return (
    <ColyseusContext.Provider
      value={{
        client: clientRef.current,
        room: roomRef.current,
        sendPosition,
        joinOrCreate,
        join,
      }}
    >
      {children}
    </ColyseusContext.Provider>
  );
}
