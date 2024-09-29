// src/types/analysis.d.ts
export interface BuildType {
  Build: string;
  Train: string;
  BuildingMorph: string;
  CancelTrain: string;
  Upgrade: string;
  Tech: string;
}

// 기존 BuildOrder 인터페이스 (유지)
// 'type' 필드의 타입은 'BuildType'에서 정의된 문자열 중 하나여야 하므로 'keyof BuildType'을 사용합니다.
export interface BuildOrder {
  time: string;
  player: string;
  action: string;
  type: keyof BuildType;
}

// Player의 Color 정보 타입
export interface PlayerColor {
  Name: string;
  ID: number;
  RGB: number;
}

// Player의 Race 정보 타입
export interface PlayerRace {
  Name: string;
  ID: number;
  ShortName: string;
  Letter: number;
}

// Player의 Type 정보 타입
export interface PlayerType {
  Name: string;
  ID: number;
}

// Player 정보 타입
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

// 전체 JSON의 분석 결과 타입
export interface AnalysisResult {
  gameVersion: string;
  mapName: string;
  players: Player[]; // 플레이어 배열로 정의
  buildOrders: BuildOrder[]; // BuildOrder 배열로 정의
}
// 기존 BuildType 인터페이스 (유지)
export interface BuildType {
  Build: string;
  Train: string;
  BuildingMorph: string;
  CancelTrain: string;
  Upgrade: string;
  Tech: string;
}

// 기존 BuildOrder 인터페이스 (유지)
// 'type' 필드의 타입은 'BuildType'에서 정의된 문자열 중 하나여야 하므로 'keyof BuildType'을 사용합니다.
export interface BuildOrder {
  time: string;
  player: string;
  action: string;
  type: keyof BuildType;
}

// Player의 Color 정보 타입
export interface PlayerColor {
  Name: string;
  ID: number;
  RGB: number;
}

// Player의 Race 정보 타입
export interface PlayerRace {
  Name: string;
  ID: number;
  ShortName: string;
  Letter: number;
}

// Player의 Type 정보 타입
export interface PlayerType {
  Name: string;
  ID: number;
}

// Player 정보 타입
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

// 전체 JSON의 분석 결과 타입
export interface AnalysisResult {
  gameVersion: string;
  mapName: string;
  players: Player[]; // 플레이어 배열로 정의
  buildOrders: BuildOrder[]; // BuildOrder 배열로 정의
}
