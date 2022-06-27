import { useHover } from "@use-gesture/react";
import clsx from "clsx";
import {
  asMathCell,
  MathCell,
  HEX_STROKE_WIDTH,
  SVG_OFFSET_X,
  SVG_OFFSET_Y,
  cellCorners,
} from "~/lib/grid";

type CellViewProps = {
  cell: MathCell;
  fill: boolean;
  onSelect?: (cell: MathCell) => void;
};

export default function CellView({ cell, fill, onSelect }: CellViewProps) {
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
        points={cellCorners
          .map((corner) => `${corner.x},${corner.y}`)
          .join(" ")}
      />
    </g>
  );
}
