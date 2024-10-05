import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { GameEvent, Player } from "../types/analysis";
import { ChartData, ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ResourceGraphProps {
  gameEvents: GameEvent[];
  players: Player[];
}

const ResourceGraph = ({ gameEvents, players }: ResourceGraphProps) => {
  const chartData: ChartData<"line"> = useMemo(() => {
    const resourceData: {
      [key: string]: { minerals: number; gas: number; time: number }[];
    } = {};

    players.forEach((player) => {
      resourceData[player.Name] = [{ minerals: 50, gas: 0, time: 0 }];
    });

    gameEvents.forEach((event) => {
      const currentResources =
        resourceData[event.player][resourceData[event.player].length - 1];
      let mineralCost = 0;
      let gasCost = 0;

      // TODO : 여기에 각 이벤트 타입에 따른 자원 소모량을 계산하는 로직을 추가해야 합니다.
      if (event.type === "Train" && event.action === "Marine") {
        mineralCost = 50;
        gasCost = 0;
      }

      resourceData[event.player].push({
        minerals: currentResources.minerals - mineralCost,
        gas: currentResources.gas - gasCost,
        time: event.time.split(":").reduce((acc, time) => 60 * acc + +time, 0),
      });
    });

    return {
      labels: resourceData[players[0].Name].map((data) => data.time),
      datasets: players
        .map((player) => ({
          label: `${player.Name} Minerals`,
          data: resourceData[player.Name].map((data) => data.minerals),
          borderColor: player.Color.Name,
          fill: false,
        }))
        .concat(
          players.map((player) => ({
            label: `${player.Name} Gas`,
            data: resourceData[player.Name].map((data) => data.gas),
            borderColor: player.Color.Name,
            borderDash: [5, 5],
            fill: false,
          }))
        ),
    };
  }, [gameEvents, players]);

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Time (seconds)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Resources",
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "자원 그래프",
      },
    },
  };

  return (
    <div className="resource-graph">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default ResourceGraph;
