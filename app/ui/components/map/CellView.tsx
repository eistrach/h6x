import { useHover } from "@use-gesture/react";
import clsx from "clsx";
import {
  BASE_HEX_STROKE_WIDTH,
  HexCell,
  HEX_HEIGHT,
  HEX_WIDTH,
} from "~/game/game";

type CellViewProps = {
  cell: HexCell;
  fill: boolean;
  onSelect?: (cell: HexCell) => void;
};

export default function CellView({ cell, fill, onSelect }: CellViewProps) {
  const { x, y } = cell;
  const bindHover = useHover(({ pressed, down }) => {
    (pressed || down) && onSelect?.(cell);
  });

  return (
    <g
      {...bindHover()}
      onClick={() => onSelect?.(cell)}
      transform={`translate(${x - HEX_WIDTH / 2}, ${y - HEX_HEIGHT / 2}) `}
      className={clsx("transithion duration-300 cursor-pointer stroke-black", {
        "fill-transparent hover:fill-slate-500": !fill,
        "fill-slate-700": fill,
      })}
    >
      <polygon
        stroke="#000000"
        strokeWidth={BASE_HEX_STROKE_WIDTH}
        points={cell.corners
          .map((corner) => `${corner.x},${corner.y}`)
          .join(" ")}
      />
    </g>
  );
}
