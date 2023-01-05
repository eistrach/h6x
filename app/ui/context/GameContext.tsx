import { GamePlayer } from "@prisma/client";
import { createContext, PropsWithChildren, useContext, useMemo } from "react";
import { HexCell, HexGrid } from "~/game/game";
import { GameState } from "~/game/game.server";

export const GameContext = createContext<GameState | undefined>(undefined);

export const GameContextProvider = ({
  value,
  children,
}: PropsWithChildren<{ value: GameState | undefined }>) => {
  return (
    <GameContext.Provider value={value ? { ...value } : undefined}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => {
  return useContext(GameContext)!;
};

export const useGrid = () => {
  const state = useGameState();

  const grid = useMemo(() => {
    if (state.phase != "Preparing") return null;
    const cells = state.cells.map((cell) =>
      HexCell.create(
        { q: cell.q, r: cell.r },
        { ...cell, isCurrentPlayersCell: true }
      )
    );
    return new HexGrid(HexCell, cells);
  }, [state]);

  if (!grid) throw new Error("Grid is not available");

  return grid;
};

export const useCurrentPlayer = () => {
  return null as GamePlayer | null;
};

export const useAvailableDiamonds = () => {
  const state = useGameState();

  if (state.phase === "Preparing") return state.diamonds;

  return 0;
};

export const useAvailableModeChanges = () => {
  const state = useGameState();

  if (state.phase === "Preparing") return "unlimited";

  return 0;
};

export const useIsGameFinished = () => {
  const state = useGameState();
  return state.phase === "Finished";
};
