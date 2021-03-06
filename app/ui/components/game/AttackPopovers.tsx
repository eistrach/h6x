import { Form } from "@remix-run/react";
import clsx from "clsx";
import { Popover } from "~/ui/hooks/usePopover";
import { CellState } from "~/core/actions/types";
import { compareCell, CompassDirection, Point } from "~/core/math";
import { IconButton } from "../base/IconButton";
import { PopperPopover } from "../base/PopperPopover";
import { SwordIcon } from "../icons/SwordIcon";
import {
  useCurrentHostileNeighbors,
  useCurrentPlayer,
  useGameState,
  useIsSubmitting,
} from "~/ui/context/GameContext";
import { useSelectedCell } from "~/ui/context/SelectedCellContext";

export type DirectionalPopovers = { [k in CompassDirection]: Popover };
export type AttackableNeighbors = { [k in CompassDirection]?: CellState };

export const getAttackPopoverRef = (
  cell: Point,
  directionalPopovers: DirectionalPopovers,
  attackableNeighbors: AttackableNeighbors | null
) => {
  if (!attackableNeighbors) return null;

  const [direction] = (Object.entries(attackableNeighbors).find(([_, c]) =>
    compareCell(c.position, cell)
  ) || []) as [CompassDirection, CellState];
  return direction
    ? (directionalPopovers[direction].setReferenceElement as any)
    : null;
};

const AttackPopovers = () => {
  const { directionalPopovers, nextState } = useGameState();
  const attackableNeighbors = useCurrentHostileNeighbors();
  const { selectedCell } = useSelectedCell();
  const currentPlayer = useCurrentPlayer();
  const isSubmitting = useIsSubmitting();

  if (!attackableNeighbors || !!nextState) return null;
  return (
    <>
      {Object.entries(directionalPopovers).map(([k, p], i) => {
        const cell = attackableNeighbors[k as CompassDirection];

        return (
          <PopperPopover
            key={i}
            wrapperClassName={clsx("bg-white p-1 rounded-full", {
              hidden: !cell,
            })}
            {...p}
          >
            <Form
              method="post"
              className="w-6 h-6 flex items-center justify-center"
            >
              <input
                type="hidden"
                name="_intent"
                value="attackCell"
                onChange={() => {}}
              />
              <input
                type="hidden"
                name="position[x]"
                onChange={() => {}}
                value={selectedCell?.position.x}
              />
              <input
                type="hidden"
                name="position[y]"
                onChange={() => {}}
                value={selectedCell?.position.y}
              />
              <input
                type="hidden"
                name="playerId"
                value={currentPlayer.id}
                onChange={() => {}}
              />
              <input
                type="hidden"
                name="target[x]"
                value={cell?.position.x}
                onChange={() => {}}
              />
              <input
                type="hidden"
                name="target[y]"
                value={cell?.position.y}
                onChange={() => {}}
              />
              <IconButton
                disabled={isSubmitting}
                type="submit"
                className="text-red-700"
                iconCss="w-6 h-6"
                Icon={SwordIcon}
              />
            </Form>
          </PopperPopover>
        );
      })}
    </>
  );
};

export default AttackPopovers;
