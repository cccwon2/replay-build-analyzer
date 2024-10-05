import React, { useState, useRef } from "react";
import { AnalysisResult, Player, GameEvent } from "./types/analysis";
import GameAnalysisOverview from "./components/GameAnalysisOverview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://yuumi.kr/parser", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      setAnalysisResult(result);
      setPlayers(result.players);
      setGameEvents(result.gameEvents);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDownloadPdf = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
      });
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("GameAnalysis.pdf");
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          스타크래프트 리플레이 분석기
        </h2>
        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            리플레이 파일 업로드
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".rep"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-150 ease-in-out"
          />
        </div>
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          리플레이 분석하기
        </button>

        {analysisResult && (
          <div className="mt-8 bg-gray-50 p-6 rounded-xl">
            <h3 className="text-2xl font-bold text-gray-700 mb-4">분석 결과</h3>
            <p className="text-gray-600">
              게임 버전: {analysisResult.gameVersion}
            </p>
            <p className="text-gray-600">맵 이름: {analysisResult.mapName}</p>

            <h4 className="text-xl font-semibold mt-6 mb-4 text-gray-700">
              플레이어:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <span className="text-xl font-bold text-gray-800 block mb-2">
                    {player.Name}
                  </span>
                  <span className="text-sm text-gray-600 block mb-2">
                    종족: {player.Race.Name}
                  </span>
                  <span
                    className="inline-block py-1 px-3 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: player.Color.Name }}
                  >
                    {player.Color.Name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {players.length > 0 && gameEvents.length > 0 && (
          <div ref={chartRef} className="mt-8">
            <GameAnalysisOverview gameEvents={gameEvents} players={players} />
            <button
              onClick={handleDownloadPdf}
              className="mt-6 w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              PDF로 다운로드
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
