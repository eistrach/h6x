import { Cell } from "@prisma/client";
import { Form } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import { NEUTRAL_COLOR, PLAYER_COLORS } from "~/lib/constants";
import { CellState, PlayerState } from "~/lib/game";
import {
  asMathGrid,
  SVG_SIZE,
  cellsToMathCells,
  compareCell,
  HEX_WIDTH,
  HEX_HEIGHT,
} from "~/lib/grid";
import { UNITS } from "~/lib/units";
import { useUser } from "~/utils";
import { Button } from "../base/Button";
import CellPreview from "./CellPreview";
import PlayerCell from "./PlayerCell";

type GamePreviewProps = {
  cells: Omit<Cell, "id">[];
  playerCells: CellState[];
  players: PlayerState[];
  playerId: string;
  canTakeAction: boolean;
};

export default function GameView({
  cells,
  playerCells,
  players,
  canTakeAction,
  playerId,
}: GamePreviewProps) {
  const user = useUser();
  const grid = asMathGrid(cellsToMathCells(cells));
  const [selectedCell, setSelectedCell] = useState<CellState | null>();

  const onClick = (cell: CellState, player: PlayerState) => {
    setSelectedCell(cell);
  };

  const currentPlayer = players.find((p) => p.id === playerId)!;
  const isOwnCell = selectedCell?.ownerId === currentPlayer.id;

  const currentColor = PLAYER_COLORS[currentPlayer.index];

  return (
    <div className="">
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-2">
          {[...players]
            .sort((p1, p2) => p2.index - p1.index)
            .map((p) => {
              const color = PLAYER_COLORS[p.index];
              return (
                <div
                  key={p.id}
                  className={clsx(color.bg, "py-1 px-2 text-black")}
                >
                  ${p.money}
                </div>
              );
            })}
        </div>
        <div className={clsx(currentColor.bg, "p-4")}>{user.displayName}</div>
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

            const isSelected =
              selectedCell && compareCell(selectedCell.position, cell);
            return (
              <PlayerCell
                selected={isSelected}
                onClick={onClick}
                key={cell.toString()}
                cell={cell}
                playerCell={playerCell}
                players={players}
              />
            );
          })}
        </g>
      </svg>

      {canTakeAction && (
        <div className="flex flex-col items-center gap-8 m-4">
          {isOwnCell && (
            <div className="flex flex-col gap-8 justify-center items-center">
              <div>
                <Form method="post">
                  <input
                    type="hidden"
                    name="position[x]"
                    value={selectedCell.position.x}
                  />
                  <input
                    type="hidden"
                    name="position[y]"
                    value={selectedCell.position.y}
                  />
                  <input type="hidden" name="playerId" value={playerId} />
                  <Button name="_intent" value="upgradeUnit">
                    Buy Unit
                  </Button>
                </Form>
              </div>
              <div className="flex flex-row gap-2">
                {UNITS.map((unit) => {
                  return (
                    <Form method="post">
                      <input
                        type="hidden"
                        name="position[x]"
                        value={selectedCell.position.x}
                      />
                      <input type="hidden" name="playerId" value={playerId} />
                      <input
                        type="hidden"
                        name="position[y]"
                        value={selectedCell.position.y}
                      />
                      <input type="hidden" name="unitId" value={unit.id} />
                      <Button
                        type="submit"
                        name="_intent"
                        value="buyUnit"
                        disabled={unit.cost > currentPlayer.money}
                      >
                        {unit.name}: ${unit.cost}
                      </Button>
                    </Form>
                  );
                })}
              </div>
            </div>
          )}
          <Form method="post" className="">
            <input type="hidden" name="playerId" value={playerId} />
            <Button name="_intent" value="endTurn" type="submit">
              End Turn
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
