import { Form } from "@remix-run/react";
import clsx from "clsx";
import { PointyCompassDirection } from "honeycomb-grid";
import { Popover } from "~/hooks/usePopover";
import { CellState } from "~/lib/game";
import { compareCell, Point } from "~/lib/grid";
import { IconButton } from "../base/IconButton";
import { PopperPopover } from "../base/PopperPopover";
import { SwordIcon } from "../icons/SwordIcon";

export type DirectionalPopovers = { [k in PointyCompassDirection]: Popover };
export type AttackableNeighbors = { [k in PointyCompassDirection]?: CellState };

export type AttackPopoversProps = {
  playerId: string;
  directionalPopovers: DirectionalPopovers;
  sourceCell?: CellState;
  attackableNeighbors: AttackableNeighbors;
};

export const getAttackPopoverRef = (
  cell: Point,
  directionalPopovers: DirectionalPopovers,
  attackableNeighbors: AttackableNeighbors
) => {
  const [direction] = (Object.entries(attackableNeighbors).find(([_, c]) =>
    compareCell(c.position, cell)
  ) || []) as [PointyCompassDirection, CellState];
  return direction
    ? (directionalPopovers[direction].setReferenceElement as any)
    : null;
};

const AttackPopovers = ({
  playerId,
  directionalPopovers,
  sourceCell,
  attackableNeighbors,
}: AttackPopoversProps) => {
  return (
    <>
      {Object.entries(directionalPopovers).map(([k, p], i) => {
        const cell = attackableNeighbors[k as PointyCompassDirection];
        return (
          <PopperPopover
            key={i}
            wrapperClassName={clsx("bg-gray-200 p-1 rounded-full", {
              hidden: !cell,
            })}
            {...p}
          >
            <Form
              method="post"
              className="w-5 h-5 flex items-center justify-center"
            >
              <input type="hidden" name="_intent" value="attackUnit" />
              <input
                type="hidden"
                name="position[x]"
                value={sourceCell?.position.x}
              />
              <input
                type="hidden"
                name="position[y]"
                value={sourceCell?.position.y}
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
          </PopperPopover>
        );
      })}
    </>
  );
};

export default AttackPopovers;
