import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { GameEvent, Player } from "../types/analysis";
import { ChartOptions } from "chart.js";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import colorNameList from "../json/color-name-list.json";

ChartJS.register(ArcElement, Tooltip, Legend);

interface UnitProductionChartProps {
  gameEvents: GameEvent[];
  players: Player[];
}

const UnitProductionChart = ({
  gameEvents,
  players,
}: UnitProductionChartProps) => {
  const chartData = useMemo(() => {
    const playerUnitCounts: { [key: string]: { [key: string]: number } } = {};

    players.forEach((player) => {
      playerUnitCounts[player.Name] = {};
    });

    gameEvents.forEach((event) => {
      if (event.type === "Train") {
        const playerCount = playerUnitCounts[event.player];
        playerCount[event.action] = (playerCount[event.action] || 0) + 1;
      }
    });

    const allUnits = Array.from(
      new Set(
        Object.values(playerUnitCounts).flatMap((counts) => Object.keys(counts))
      )
    );

    const unitColors = allUnits.reduce((acc, unit, index) => {
      acc[unit] = colorNameList[index % colorNameList.length].hex;
      return acc;
    }, {} as { [key: string]: string });

    return players.map((player) => {
      const unitCounts = playerUnitCounts[player.Name];
      return {
        player: player.Name,
        data: {
          labels: Object.keys(unitCounts),
          datasets: [
            {
              data: Object.values(unitCounts),
              backgroundColor: Object.keys(unitCounts).map(
                (unit) => unitColors[unit]
              ),
            },
          ],
        },
      };
    });
  }, [gameEvents, players]);

  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "유닛 생산 비율",
      },
    },
  };

  return (
    <div className="unit-production-chart">
      <h3 className="text-2xl font-bold mb-4">플레이어별 유닛 생산 비율</h3>
      <div className="flex flex-row flex-wrap justify-center">
        {chartData.map((playerData, index) => (
          <div
            key={index}
            style={{ float: "left", width: "600px", height: "600px" }}
          >
            <h4 className="text-lg font-semibold mb-2">{playerData.player}</h4>
            <Pie data={playerData.data} options={chartOptions} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnitProductionChart;
