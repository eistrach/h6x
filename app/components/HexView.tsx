import { useHover } from "@use-gesture/react";
import clsx from "clsx";
import {
  Cell,
  CellType,
  HEX_STROKE_WIDTH,
  SVG_OFFSET_X,
  SVG_OFFSET_Y,
} from "~/core/grid";

const corners = Cell().corners();

type HexCellProps = {
  cell: CellType;
  fill: boolean;
  onSelect?: (cell: CellType) => void;
};

export default function HexCellView({ cell, fill, onSelect }: HexCellProps) {
  const { x, y } = cell.toPoint();
  const bindHover = useHover(({ pressed, down }) => {
    (pressed || down) && onSelect?.(cell);
  });

  return (
    <g
      {...bindHover()}
      onClick={() => onSelect?.(cell)}
      transform={`translate(${x + SVG_OFFSET_X}, ${y + SVG_OFFSET_Y})`}
      className={clsx("transithion duration-300 cursor-pointer ", {
        "fill-transparent hover:fill-slate-500": !fill,
        "fill-slate-700": fill,
      })}
    >
      <polygon
        stroke="#000000"
        strokeWidth={HEX_STROKE_WIDTH}
        points={corners.map((corner) => `${corner.x},${corner.y}`).join(" ")}
      />
    </g>
  );
}
