import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import "chart.js/auto";
import { BuildOrder, Player } from "../types/analysis";
import namedColors from "../json/color-name-list.json";

// 빌드 타입
const buildTypes = {
  Build: "Build",
  Train: "Train",
  BuildingMorph: "BuildingMorph",
  CancelTrain: "CancelTrain",
  Upgrade: "Upgrade",
  Tech: "Tech",
};

// 플레이어별 데이터 타입
interface PlayerData {
  units: { time: number; action: string }[];
  buildings: { time: number; action: string }[];
  upgrades: { time: number; action: string }[];
  techs: { time: number; action: string }[];
  cancels: { time: number; action: string }[];
  color: string;
}

// 차트 데이터 타입
interface ChartData {
  labels: number[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    stack: string;
  }[];
}

// `namedColors`의 타입을 명시적으로 지정
interface NamedColor {
  name: string;
  hex: string;
}

// 색상 이름을 HEX 코드로 변환하는 함수
const nameToHex = (colorName: string): string => {
  const color = namedColors.find(
    (c: NamedColor) => c.name.toLowerCase() === colorName.toLowerCase()
  );
  return color ? color.hex : "#000000"; // 매칭되지 않으면 검정색 반환
};

// 초를 "분:초" 형식으로 변환하는 함수
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}분 ${remainingSeconds}초`;
};

const GameChart = ({
  buildOrders = [],
  players = [],
}: {
  buildOrders: BuildOrder[];
  players: Player[];
}) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  // 시간(MM:SS)을 초로 변환하는 함수
  const timeToSeconds = (time: string): number => {
    if (!time || !time.includes(":")) return 0;
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
  };

  // 빌드 오더를 처리하는 함수
  const processBuildOrders = (): Record<string, PlayerData> => {
    const playerData: Record<string, PlayerData> = {};

    players.forEach((player) => {
      const playerColor = nameToHex(player.Color.Name); // Name을 HEX 값으로 변환
      playerData[player.Name] = {
        units: [],
        buildings: [],
        upgrades: [],
        techs: [],
        cancels: [],
        color: playerColor, // 변환된 색상 사용
      };
    });

    buildOrders.forEach((order) => {
      const timeInSeconds = timeToSeconds(order.time);
      const playerName = order.player;

      if (!playerData[playerName]) return;

      switch (order.type) {
        case buildTypes.Train:
          playerData[playerName].units.push({
            time: timeInSeconds,
            action: order.action,
          });
          break;
        case buildTypes.Build:
        case buildTypes.BuildingMorph:
          playerData[playerName].buildings.push({
            time: timeInSeconds,
            action: order.action,
          });
          break;
        case buildTypes.Upgrade:
          playerData[playerName].upgrades.push({
            time: timeInSeconds,
            action: order.action,
          });
          break;
        case buildTypes.Tech:
          playerData[playerName].techs.push({
            time: timeInSeconds,
            action: order.action,
          });
          break;
        case buildTypes.CancelTrain:
          playerData[playerName].cancels.push({
            time: timeInSeconds,
            action: order.action,
          });
          break;
        default:
          break;
      }
    });

    return playerData;
  };

  // 차트 데이터를 생성하는 함수
  const generateChartData = (playersData: Record<string, PlayerData>) => {
    // 최대 시간 계산 (빌드 오더 중 가장 큰 시간)
    const maxTime = Math.max(
      ...buildOrders.map((order) => timeToSeconds(order.time))
    );
    const labels = Array.from({ length: maxTime + 1 }, (_, i) => i);

    const datasets: ChartData["datasets"] = [];

    players.forEach((player) => {
      const playerName = player.Name;
      const playerColor = playersData[playerName]?.color || "#000000";

      // 유닛 트레이닝
      datasets.push({
        label: `${playerName} Units Trained`,
        data: labels.map(
          (time) =>
            playersData[playerName]?.units?.filter((u) => u.time <= time)
              .length || 0
        ),
        backgroundColor: playerColor,
        stack: playerName, // 플레이어별 스택
      });

      // 빌딩 건설
      datasets.push({
        label: `${playerName} Buildings Constructed`,
        data: labels.map(
          (time) =>
            playersData[playerName]?.buildings?.filter((b) => b.time <= time)
              .length || 0
        ),
        backgroundColor: playerColor,
        stack: playerName, // 플레이어별 스택
      });

      // 업그레이드
      if (playersData[playerName]?.upgrades?.length > 0) {
        datasets.push({
          label: `${playerName} Upgrades`,
          data: labels.map(
            (time) =>
              playersData[playerName]?.upgrades?.filter((u) => u.time <= time)
                .length || 0
          ),
          backgroundColor: playerColor,
          stack: playerName, // 플레이어별 스택
        });
      }

      // 기술 연구
      if (playersData[playerName]?.techs?.length > 0) {
        datasets.push({
          label: `${playerName} Techs Researched`,
          data: labels.map(
            (time) =>
              playersData[playerName]?.techs?.filter((t) => t.time <= time)
                .length || 0
          ),
          backgroundColor: playerColor,
          stack: playerName, // 플레이어별 스택
        });
      }

      // 트레이닝 취소
      if (playersData[playerName]?.cancels?.length > 0) {
        datasets.push({
          label: `${playerName} Train Cancels`,
          data: labels.map(
            (time) =>
              playersData[playerName]?.cancels?.filter((c) => c.time <= time)
                .length || 0
          ),
          backgroundColor: playerColor,
          stack: playerName, // 플레이어별 스택
        });
      }
    });

    const data: ChartData = {
      labels,
      datasets,
    };

    // 상태가 실제로 변경되는 경우에만 업데이트
    if (
      datasets.length > 0 &&
      JSON.stringify(chartData) !== JSON.stringify(data)
    ) {
      setChartData(data);
    }
  };

  // 차트 옵션 설정
  const options: ChartOptions<"bar"> = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Time (seconds)", // 이 부분을 원하면 수정 가능
        },
        stacked: true, // 스택형 막대 차트를 위해
        ticks: {
          callback: function (value) {
            return `${value} (${formatTime(value as number)})`; // 초를 "분:초" 형식으로 표시
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Count",
        },
        stacked: true, // 스택형 막대 차트를 위해
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
        text: "Player Build Orders Over Time",
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  // useEffect로 빌드 오더 데이터 처리 후 차트 데이터 생성
  useEffect(() => {
    const playersData = processBuildOrders();
    generateChartData(playersData);
  }, [buildOrders, players]);

  return (
    <div className="mt-6">
      {chartData && chartData.datasets.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

export default GameChart;
