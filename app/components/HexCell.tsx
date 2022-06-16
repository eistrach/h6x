import { Cell, CellType } from "~/core/grid";

const corners = Cell().corners();

export default function HexCell({ cell }: { cell: CellType }) {
  const { x, y } = cell.toPoint();
  return (
    <g
      transform={`translate(${x}, ${y})`}
      className="transition duration-300 cursor-pointer fill-transparent hover:fill-black p-2"
    >
      <polygon
        stroke="#000000"
        strokeWidth="0.5"
        points={corners.map((corner) => `${corner.x},${corner.y}`).join(" ")}
      />
    </g>
  );
}
