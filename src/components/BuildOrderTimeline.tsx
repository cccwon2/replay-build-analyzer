import { useState } from "react";
import { GameEvent, Player } from "../types/analysis";

interface BuildOrderTimelineProps {
  gameEvents: GameEvent[];
  players: Player[];
}

const BuildOrderTimeline = ({
  gameEvents,
  players,
}: BuildOrderTimelineProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  const buildEvents = gameEvents.filter(
    (event) =>
      event.type === "Build" ||
      event.type === "Train" ||
      event.type === "Upgrade" ||
      event.type === "Tech"
  );

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = buildEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(buildEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="build-order-timeline">
      <h3 className="text-xl font-bold mb-4">빌드 오더 타임라인</h3>
      {players.map((player) => (
        <div key={player.Name} className="player-timeline mb-6">
          <h4 className="text-lg font-semibold mb-2">{player.Name}</h4>
          <ul className="list-disc pl-5">
            {currentEvents
              .filter((event) => event.player === player.Name)
              .map((event, index) => (
                <li key={index} className="mb-1">
                  {event.time} - {event.action} ({event.type})
                </li>
              ))}
          </ul>
        </div>
      ))}
      <div className="pagination flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuildOrderTimeline;
