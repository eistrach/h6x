import { HexCoordinates } from "honeycomb-grid";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { HexCell } from "~/game/game";
import { useGrid } from "./GameContext";

export const SelectedCellContext = createContext<{
  selectedCell: HexCell | null;
  setSelectedCell: (cell: HexCell | null, force?: boolean) => void;
}>({ selectedCell: null, setSelectedCell: () => {} });

export const SelectedCellProvider = ({ children }: PropsWithChildren<{}>) => {
  const animating = false;
  const grid = useGrid();

  const [selectedCoordinates, setSelectedCoordinates] =
    useState<HexCoordinates>();

  const setSelectedCell = (cell: HexCell | null, force = false) => {
    if (force || !animating) setSelectedCoordinates(cell?.coordinates);
  };

  if (!selectedCoordinates)
    return (
      <SelectedCellContext.Provider
        value={{ selectedCell: null, setSelectedCell }}
      >
        {children}
      </SelectedCellContext.Provider>
    );

  const selectedCell = grid.getHex(selectedCoordinates) || null;

  return (
    <SelectedCellContext.Provider value={{ selectedCell, setSelectedCell }}>
      {children}
    </SelectedCellContext.Provider>
  );
};

export const useSelectedCell = () => {
  return useContext(SelectedCellContext);
};

export const useActiveHostileCells = () => {
  const { selectedCell } = useSelectedCell();
  const grid = useGrid();

  const hostileNeighbors = useMemo(() => {
    if (!selectedCell) return [];
    return grid.hostileNeighborsOf(selectedCell);
  }, [selectedCell?.id]);

  return hostileNeighbors;
};
