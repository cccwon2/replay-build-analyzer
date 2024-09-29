import React, { useState, useRef } from "react";
import { AnalysisResult, BuildOrder, Player } from "./types/analysis";
import GameChart from "./components/GameChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [buildOrders, setBuildOrders] = useState<BuildOrder[]>([]);
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
      setBuildOrders(result.buildOrders);
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
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Upload StarCraft Replay File
        </h2>
        <input
          type="file"
          accept=".rep"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          onClick={handleUpload}
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Analyze Replay
        </button>

        {analysisResult && (
          <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-600">Analysis Result</h3>
            <p className="text-gray-500">
              Game Version: {analysisResult.gameVersion}
            </p>
            <p className="text-gray-500">Map Name: {analysisResult.mapName}</p>

            <h4 className="text-lg font-semibold mt-4 text-gray-600">
              Players:
            </h4>
            {/* 그리드 레이아웃으로 표시 */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col justify-center items-center"
                >
                  <span className="text-lg font-semibold text-gray-700">
                    {player.Name}
                  </span>
                  <span className="text-sm text-gray-500">
                    Race: {player.Race.Name}
                  </span>
                  <span
                    className="mt-1 inline-block py-1 px-3 rounded-full text-white"
                    style={{ backgroundColor: player.Color.Name }}
                  >
                    {player.Color.Name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {players.length > 0 && buildOrders.length > 0 && (
          <div ref={chartRef}>
            <GameChart buildOrders={buildOrders} players={players} />
            <button
              onClick={handleDownloadPdf}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            >
              Download as PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
