import {
  BASE_HEX_STROKE_WIDTH,
  HexCell,
  HEX_HEIGHT,
  HEX_WIDTH,
} from "~/game/game";

type CellPreviewProps = {
  cell: HexCell;
  className?: string;
};

export default function CellPreview({ cell, className }: CellPreviewProps) {
  const { x, y } = cell || { x: 0, y: 0 };

  return (
    <g
      transform={`translate(${x - HEX_WIDTH / 2}, ${y - HEX_HEIGHT / 2}) `}
      className={className}
    >
      <polygon
        strokeWidth={BASE_HEX_STROKE_WIDTH}
        points={cell.corners
          .map((corner) => `${corner.x},${corner.y}`)
          .join(" ")}
      />
    </g>
  );
}
