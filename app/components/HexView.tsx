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
  onClick?: (cell: CellType) => void;
};

export default function HexView({ cell, onClick }: HexCellProps) {
  const { x, y } = cell.toPoint();

  return (
    <g
      onClick={() => onClick?.(cell)}
      transform={`translate(${x + SVG_OFFSET_X}, ${y + SVG_OFFSET_Y})`}
      className="transition duration-300 cursor-pointer fill-transparent hover:fill-black"
    >
      <polygon
        stroke="#000000"
        strokeWidth={HEX_STROKE_WIDTH}
        points={corners.map((corner) => `${corner.x},${corner.y}`).join(" ")}
      />
    </g>
  );
}
