import { Cell, GamePhase } from "@prisma/client";
import { Form, useFetcher } from "@remix-run/react";
import clsx from "clsx";
import * as PopperJS from "@popperjs/core";
import { useState } from "react";
import { usePopper } from "react-popper";
import { PLAYER_COLORS } from "~/lib/constants";
import { CellState, PlayerState } from "~/lib/game";
import {
  asMathGrid,
  SVG_SIZE,
  cellsToMathCells,
  compareCell,
  cellsAreNeighbors,
  Point,
  getNeighboringCells,
} from "~/lib/grid";
import { getUnitForId, UNITS } from "~/lib/units";
import { useUser } from "~/utils";
import { Button } from "../base/Button";
import { IconButton } from "../base/IconButton";
import { PointyCompassDirection } from "honeycomb-grid";
import { SwordIcon } from "../map/icons/SwordIcon";
import PlayerCell from "./PlayerCell";

export type GamePreviewProps = {
  state: {
    cells: Omit<Cell, "id">[];
    playerCells: CellState[];
    players: PlayerState[];
    playerId: string;
    canTakeAction: boolean;
    phase: GamePhase;
  };
};

const PopOver = ({
  setPopperElement,
  styles,
  attributes,
  setArrowElement,
  children,
  show,
  className,
}: {
  setPopperElement: any;
  styles: any;
  attributes: any;
  setArrowElement: any;
  children: React.ReactNode;
  show: boolean;
  className?: string;
}) => {
  return (
    <div
      className={clsx("tooltip bg-gray-200 p-1 rounded-full", {
        hidden: !show,
      })}
      ref={setPopperElement as any}
      style={styles.popper}
      {...attributes.popper}
    >
      <div className={className}>{children}</div>

      <div
        className="arrow "
        ref={setArrowElement as any}
        style={styles.arrow}
      />
    </div>
  );
};

export const usePopover = (placement?: PopperJS.Placement) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,

    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      {
        name: "offset",
        options: {
          offset: [0, -5],
        },
      },
    ],
  });

  return {
    setReferenceElement,
    setPopperElement,
    setArrowElement,
    styles,
    attributes,
  };
};

export default function GameView({ state }: GamePreviewProps) {
  const { cells, playerCells, players, canTakeAction, playerId, phase } = state;
  const user = useUser();
  const fetcher = useFetcher();
  const grid = asMathGrid(cellsToMathCells(cells));
  const [selectedCellPosition, setSelectedCellPosition] =
    useState<Point | null>();
  const selectedCell = playerCells.find(
    (c) => selectedCellPosition && compareCell(c.position, selectedCellPosition)
  );

  const popovers = {
    E: usePopover("right"),
    NE: usePopover("top"),
    NW: usePopover("top"),
    W: usePopover("left"),
    SE: usePopover("bottom"),
    SW: usePopover("bottom"),
  };

  const canAttack = (cell: CellState) => {
    return (
      selectedCell?.ownerId === playerId &&
      selectedCell.count > 1 &&
      cellsAreNeighbors(selectedCell.position, cell.position) &&
      !compareCell(selectedCell.position, cell.position) &&
      selectedCell.ownerId !== cell.ownerId
    );
  };

  const onClick = (cell: CellState, player: PlayerState) => {
    setSelectedCellPosition(cell.position);
  };

  const currentPlayer = players.find((p) => p.id === playerId)!;
  const isOwnCell = selectedCell?.ownerId === currentPlayer.id;
  const selectedUnit = selectedCell && getUnitForId(selectedCell.unitId);

  const currentColor = PLAYER_COLORS[currentPlayer.index];

  const enemyNeighbors =
    canTakeAction &&
    phase === "PLAYING" &&
    selectedCell &&
    selectedCell.ownerId === currentPlayer.id
      ? Object.fromEntries(
          Object.entries(
            getNeighboringCells(selectedCell.position, playerCells)
          ).filter(([, c]) => c.ownerId !== currentPlayer.id && canAttack(c))
        )
      : {};

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

      {Object.entries(popovers).map(([k, p], i) => {
        const cell = enemyNeighbors[k];
        return (
          <PopOver key={i} show={!!cell} {...p}>
            <Form
              method="post"
              className="w-5 h-5 flex items-center justify-center"
            >
              <input type="hidden" name="_intent" value="attackUnit" />
              <input
                type="hidden"
                name="position[x]"
                value={selectedCell?.position.x}
              />
              <input
                type="hidden"
                name="position[y]"
                value={selectedCell?.position.y}
              />
              <input type="hidden" name="playerId" value={playerId} />
              <input type="hidden" name="target[x]" value={cell?.position.x} />
              <input type="hidden" name="target[y]" value={cell?.position.y} />
              <IconButton
                type="submit"
                className="text-red-700"
                iconCss="w-5 h-5"
                Icon={SwordIcon}
              />
            </Form>
          </PopOver>
        );
      })}
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
            const [direction] = (Object.entries(enemyNeighbors).find(([_, c]) =>
              compareCell(c.position, cell)
            ) || []) as [PointyCompassDirection, CellState];
            const popover = direction ? popovers[direction] : null;
            return (
              <PlayerCell
                popperRef={
                  popover ? (popover.setReferenceElement as any) : null
                }
                selected={!!isSelected}
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
                  <Button
                    disabled={
                      selectedUnit && currentPlayer.money < selectedUnit?.cost
                    }
                    name="_intent"
                    value="upgradeUnit"
                  >
                    Buy Unit: ${selectedUnit?.cost}
                  </Button>
                </Form>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5  gap-2">
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
