import {
  MathCell,
  HEX_STROKE_WIDTH,
  SVG_OFFSET_X,
  SVG_OFFSET_Y,
  cellCorners,
} from "~/grid-math";

type CellPreviewProps = {
  cell?: MathCell;
  className?: string;
};

export default function CellPreview({ cell, className }: CellPreviewProps) {
  const { x, y } = cell?.toPoint() || { x: 0, y: 0 };
  return (
    <g
      transform={`translate(${x + SVG_OFFSET_X}, ${y + SVG_OFFSET_Y})`}
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
