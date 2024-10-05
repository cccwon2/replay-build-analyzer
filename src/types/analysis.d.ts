// src/types/analysis.d.ts
export interface EventType {
  Build: string;
  Train: string;
  BuildingMorph: string;
  CancelTrain: string;
  Upgrade: string;
  Tech: string;
  Order: string;
  Hotkey: string;
  Select: string;
  Land: string;
  LiftOff: string;
  Chat: string;
}

export interface GameEvent {
  time: string;
  player: string;
  action: string;
  type: keyof EventType;
}

export interface PlayerColor {
  Name: string;
  ID: number;
  RGB: number;
}

export interface PlayerRace {
  Name: string;
  ID: number;
  ShortName: string;
  Letter: number;
}

export interface PlayerType {
  Name: string;
  ID: number;
}

export interface Player {
  SlotID: number;
  ID: number;
  Type: PlayerType;
  Race: PlayerRace;
  Team: number;
  Name: string;
  Color: PlayerColor;
  Observer: boolean;
}

export interface AnalysisResult {
  gameVersion: string;
  mapName: string;
  players: Player[];
  gameEvents: GameEvent[];
}
