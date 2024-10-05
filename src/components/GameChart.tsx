// src/components/GameChart.tsx
import { useEffect, useState, useCallback } from "react";
import { Bar, Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import "chart.js/auto";
import { GameEvent, Player } from "../types/analysis";
import namedColors from "../json/color-name-list.json";

const eventTypes = {
  Build: "Build",
  Train: "Train",
  BuildingMorph: "BuildingMorph",
  CancelTrain: "CancelTrain",
  Upgrade: "Upgrade",
  Tech: "Tech",
  Order: "Order",
  Hotkey: "Hotkey",
  Select: "Select",
  Land: "Land",
  LiftOff: "LiftOff",
  Chat: "Chat",
};

interface PlayerData {
  units: { time: number; action: string }[];
  buildings: { time: number; action: string }[];
  upgrades: { time: number; action: string }[];
  techs: { time: number; action: string }[];
  cancels: { time: number; action: string }[];
  color: string;
}

interface ChartData {
  labels: number[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor?: string;
    fill?: boolean;
    stack: string;
  }[];
}

const nameToHex = (colorName: string): string => {
  const color = namedColors.find(
    (c) => c.name.toLowerCase() === colorName.toLowerCase()
  );
  return color ? color.hex : "#000000";
};

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}분 ${remainingSeconds}초`;
};

const GameChart = ({
  gameEvents = [],
  players = [],
}: {
  gameEvents: GameEvent[];
  players: Player[];
}) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const [chartType, setChartType] = useState<"Bar" | "Line">("Bar");

  const handleChartChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChartType(e.target.value as "Bar" | "Line");
  };

  const timeToSeconds = (time: string): number => {
    if (!time || !time.includes(":")) return 0;
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  const processGameEvents = useCallback((): Record<string, PlayerData> => {
    const playerData: Record<string, PlayerData> = {};

    players.forEach((player) => {
      const playerColor = nameToHex(player.Color.Name);
      playerData[player.Name] = {
        units: [],
        buildings: [],
        upgrades: [],
        techs: [],
        cancels: [],
        color: playerColor,
      };
    });

    gameEvents.forEach((event) => {
      const timeInSeconds = timeToSeconds(event.time);
      const playerName = event.player;

      if (!playerData[playerName]) return;

      switch (event.type) {
        case eventTypes.Train:
          playerData[playerName].units.push({
            time: timeInSeconds,
            action: event.action,
          });
          break;
        case eventTypes.Build:
        case eventTypes.BuildingMorph:
          playerData[playerName].buildings.push({
            time: timeInSeconds,
            action: event.action,
          });
          break;
        case eventTypes.Upgrade:
          playerData[playerName].upgrades.push({
            time: timeInSeconds,
            action: event.action,
          });
          break;
        case eventTypes.Tech:
          playerData[playerName].techs.push({
            time: timeInSeconds,
            action: event.action,
          });
          break;
        case eventTypes.CancelTrain:
          playerData[playerName].cancels.push({
            time: timeInSeconds,
            action: event.action,
          });
          break;
        default:
          break;
      }
    });

    return playerData;
  }, [gameEvents, players]);

  const generateChartData = useCallback(
    (playersData: Record<string, PlayerData>) => {
      const maxTime = Math.max(
        ...gameEvents.map((event) => timeToSeconds(event.time))
      );
      const labels = Array.from({ length: maxTime + 1 }, (_, i) => i);

      const datasets: ChartData["datasets"] = [];

      players.forEach((player) => {
        const playerName = player.Name;
        const playerColor = playersData[playerName]?.color || "#000000";

        datasets.push({
          label: `${playerName} Units Trained`,
          data: labels.map(
            (time) =>
              playersData[playerName]?.units?.filter((u) => u.time <= time)
                .length || 0
          ),
          backgroundColor: playerColor,
          borderColor: playerColor,
          fill: true,
          stack: playerName,
        });

        datasets.push({
          label: `${playerName} Buildings Constructed`,
          data: labels.map(
            (time) =>
              playersData[playerName]?.buildings?.filter((b) => b.time <= time)
                .length || 0
          ),
          backgroundColor: playerColor,
          borderColor: playerColor,
          fill: false,
          stack: playerName,
        });

        if (playersData[playerName]?.upgrades?.length > 0) {
          datasets.push({
            label: `${playerName} Upgrades`,
            data: labels.map(
              (time) =>
                playersData[playerName]?.upgrades?.filter((u) => u.time <= time)
                  .length || 0
            ),
            backgroundColor: playerColor,
            borderColor: playerColor,
            fill: false,
            stack: playerName,
          });
        }

        if (playersData[playerName]?.techs?.length > 0) {
          datasets.push({
            label: `${playerName} Techs Researched`,
            data: labels.map(
              (time) =>
                playersData[playerName]?.techs?.filter((t) => t.time <= time)
                  .length || 0
            ),
            backgroundColor: playerColor,
            borderColor: playerColor,
            fill: false,
            stack: playerName,
          });
        }

        if (playersData[playerName]?.cancels?.length > 0) {
          datasets.push({
            label: `${playerName} Train Cancels`,
            data: labels.map(
              (time) =>
                playersData[playerName]?.cancels?.filter((c) => c.time <= time)
                  .length || 0
            ),
            backgroundColor: playerColor,
            borderColor: playerColor,
            fill: false,
            stack: playerName,
          });
        }
      });

      const data: ChartData = {
        labels,
        datasets,
      };

      if (
        datasets.length > 0 &&
        JSON.stringify(chartData) !== JSON.stringify(data)
      ) {
        setChartData(data);
      }
    },
    [chartData, gameEvents, players]
  );

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Time (seconds)",
        },
        stacked: true,
        ticks: {
          callback: function (value) {
            return `${value} (${formatTime(value as number)})`;
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
        stacked: true,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      title: {
        display: true,
        text: "Player Game Events Over Time",
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  useEffect(() => {
    const playersData = processGameEvents();
    generateChartData(playersData);
  }, [gameEvents, players, processGameEvents, generateChartData]);

  return (
    <div className="mt-6">
      <div>
        <label htmlFor="chartType">Choose chart type: </label>
        <select id="chartType" value={chartType} onChange={handleChartChange}>
          <option value="Bar">Bar Chart</option>
          <option value="Line">Line Chart</option>
        </select>
      </div>

      {chartType === "Bar" && chartData && chartData.datasets.length > 0 && (
        <Bar data={chartData} options={options} />
      )}

      {chartType === "Line" && chartData && chartData.datasets.length > 0 && (
        <Line data={chartData} options={options} />
      )}

      {chartData.datasets.length === 0 && <p>No data to display</p>}
    </div>
  );
};

export default GameChart;
