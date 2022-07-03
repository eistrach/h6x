import { Cell } from "@prisma/client";
import clsx from "clsx";
import { PLAYER_COLORS } from "~/lib/constants";
import { CellState, PlayerState } from "~/lib/game";
import {
  asMathGrid,
  SVG_SIZE,
  cellsToMathCells,
  compareCell,
  HEX_WIDTH,
  HEX_HEIGHT,
} from "~/lib/grid";
import CellPreview from "./CellPreview";
import PlayerCell from "./PlayerCell";

type GamePreviewProps = {
  cells: Omit<Cell, "id">[];
  playerCells: CellState[];
  players: PlayerState[];
};

export default function GameView({
  cells,
  playerCells,
  players,
}: GamePreviewProps) {
  const grid = asMathGrid(cellsToMathCells(cells));

  console.log(players);

  return (
    <div className="">
      <div className="flex gap-2 p-2">
        {players.map((p) => {
          const color = PLAYER_COLORS[p.index];
          return (
            <div key={p.id} className={clsx(color.bg, "py-1 px-2 text-black")}>
              ${p.money}
            </div>
          );
        })}
      </div>
      <svg
        className=""
        viewBox={`0, 0, ${SVG_SIZE}, ${SVG_SIZE}`}
        fill="currentColor"
        preserveAspectRatio="xMidYMid"
      >
        <g>
          {grid.map((cell) => {
            const playerCell = playerCells.find((c) =>
              compareCell(c.position, cell)
            )!;
            return (
              <PlayerCell
                key={cell.toString()}
                cell={cell}
                playerCell={playerCell}
                players={players}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
