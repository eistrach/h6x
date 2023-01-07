import {
  HexCell,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
  VIEWBOX_X,
  VIEWBOX_Y,
} from "~/game/game";
import CellPreview from "./CellPreview";

type GamePreviewProps = {
  cells: HexCell[];
  className?: string;
  cellClassName?: string;
};

export default function GamePreview({
  cells,
  className,
  cellClassName,
}: GamePreviewProps) {
  return (
    <svg
      className={className}
      viewBox={`${VIEWBOX_X}, ${VIEWBOX_Y}, ${VIEWBOX_WIDTH}, ${VIEWBOX_HEIGHT}`}
      fill="currentColor"
      preserveAspectRatio="xMidYMid"
    >
      <g>
        {cells.map((cell) => (
          <CellPreview key={cell.id} cell={cell} className={cellClassName} />
        ))}
      </g>
    </svg>
  );
}
