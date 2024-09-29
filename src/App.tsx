import React, { useState } from "react";
import { AnalysisResult, BuildOrder } from "./types/analysis";

const App = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    // 백엔드로 파일 업로드 요청
    const response = await fetch("https://yuumi.kr/parser", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log("Server Response:", result); // 서버 응답을 콘솔에 출력
    setAnalysisResult(result);
  };

  return (
    <div>
      <h2>Upload StarCraft Replay File</h2>
      <input type="file" accept=".rep" onChange={handleFileChange} />
      <button onClick={handleUpload}>Analyze Replay</button>

      {analysisResult && (
        <div>
          <h3>Analysis Result</h3>
          <p>Game Version: {analysisResult.gameVersion}</p>
          <p>Map Name: {analysisResult.mapName}</p>

          <h4>Players:</h4>
          <ul>
            {analysisResult.players.map((player: any, index: number) => (
              <li key={index}>
                <strong>Name:</strong> {player.Name} <br />
                <strong>Race:</strong> {player.Race.Name} <br />
                <strong>Team:</strong> {player.Team} <br />
                <strong>Color:</strong> {player.Color.Name} <br />
                <strong>Type:</strong> {player.Type.Name} <br />
                <strong>SlotID:</strong> {player.SlotID} <br />
              </li>
            ))}
          </ul>

          <h4>Build Orders:</h4>
          <ul>
            {analysisResult.buildOrders.map(
              (order: BuildOrder, index: number) => (
                <li key={index}>
                  <strong>Time:</strong> {order.time}, <strong>Player:</strong>{" "}
                  {order.player}, <strong>Action:</strong> {order.action},{" "}
                  <strong>Type:</strong> {order.type}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
