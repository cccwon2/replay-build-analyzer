import { GameEvent, Player } from "../types/analysis";
import BuildOrderTimeline from "./BuildOrderTimeline";
import ResourceGraph from "./ResourceGraph";
import UnitProductionChart from "./UnitProductionChart";

interface GameAnalysisOverviewProps {
  gameEvents: GameEvent[];
  players: Player[];
}

const GameAnalysisOverview = ({
  gameEvents,
  players,
}: GameAnalysisOverviewProps) => {
  return (
    <div className="game-analysis-overview">
      <BuildOrderTimeline
        key="buildOrder"
        gameEvents={gameEvents}
        players={players}
      />
      <UnitProductionChart
        key="unitProduction"
        gameEvents={gameEvents}
        players={players}
      />
      <ResourceGraph
        key="resourceGraph"
        gameEvents={gameEvents}
        players={players}
      />
    </div>
  );
};

export default GameAnalysisOverview;
