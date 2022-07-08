import {
  MathCell,
  HEX_STROKE_WIDTH,
  cellCorners,
  HEX_HEIGHT,
  HEX_WIDTH,
} from "~/core/math";

type CellPreviewProps = {
  cell?: MathCell;
  className?: string;
};

export default function CellPreview({ cell, className }: CellPreviewProps) {
  const { x, y } = cell?.toPoint() || { x: 0, y: 0 };
  return (
    <g
      transform={`translate(${x - HEX_WIDTH / 2}, ${y - HEX_HEIGHT / 2}) `}
      className={className}
    >
      <polygon
        strokeWidth={HEX_STROKE_WIDTH}
        points={cellCorners
          .map((corner) => `${corner.x},${corner.y}`)
          .join(" ")}
      />
    </g>
  );
}
