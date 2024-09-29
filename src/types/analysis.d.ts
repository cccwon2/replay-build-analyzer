export interface BuildType {
  Build: string;
  Train: string;
  BuildingMorph: string;
  CancelTrain: string;
  Upgrade: string;
  Tech: string;
}

export interface BuildOrder {
  time: string;
  player: string;
  action: string;
  type: buildType;
}

export interface AnalysisResult {
  gameVersion: string;
  mapName: string;
  players: object[];
  buildOrders: buildOrder[];
}
