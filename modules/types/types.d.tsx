import { Schema, MapSchema } from "@colyseus/schema";

export interface DataAxis extends Schema {
  x: number;
  y: number;
  z: number;
}

export interface Player extends Schema {
  color: string;
  position: DataAxis;
  status: string;
  sessionId: string;
  name: string;
  isMoving: boolean;
}

export interface WorldState extends Schema {
  name: string;
  players: MapSchema<Player>;
}
