import {
  MathCell,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
  editorCells,
} from "~/core/math";
import { Cell } from "~/domain/map.server";
import HexView from "./CellView";

type HexMapProps = {
  cells: Cell[];
  onSelect?: (cell: MathCell) => void;
};

export default function MapView({ cells, onSelect }: HexMapProps) {
  function isFilled(x: number, y: number) {
    return !!cells.find((cell) => cell.x === x && cell.y === y);
  }

  return (
    <svg
      className=""
      viewBox={`${VIEWBOX_X}, ${VIEWBOX_Y}, ${VIEWBOX_WIDTH}, ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {editorCells.map((cell) => (
          <HexView
            onSelect={onSelect}
            fill={isFilled(cell.x, cell.y)}
            key={cell.toString()}
            cell={cell}
          />
        ))}
      </g>
    </svg>
  );
}
