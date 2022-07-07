import { useHover } from "@use-gesture/react";
import clsx from "clsx";
import {
  MathCell,
  HEX_HEIGHT,
  HEX_WIDTH,
  cellCorners,
  HEX_STROKE_WIDTH,
} from "~/grid-math";
import DefaultSvg from "../svg/DefaultSvg";

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
      transform={`translate(${x - HEX_WIDTH / 2}, ${y - HEX_HEIGHT / 2}) `}
      className={clsx("transithion duration-300 cursor-pointer stroke-black", {
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
