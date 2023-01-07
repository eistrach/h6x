import {
  HexCell,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
} from "~/game/game";

type HexMapProps = {
  cells: HexCell[];
  onSelect?: (cell: HexCell) => void;
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
      <g></g>
    </svg>
  );
}
