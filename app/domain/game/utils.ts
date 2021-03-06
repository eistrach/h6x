import { Cell } from "../map.server";
import {
  CellModeId,
  CellModes,
  DefaultPlayerModeId,
  MinDiamondsPerTurn,
} from "~/config/rules";
import {
  PlayingState,
  PlayerState,
  CellState,
  CellStates,
  PlayerStates,
  PreparationState,
} from "~/core/actions/types";
import { compareCell } from "~/core/math";
import { toId } from "~/core/utils";
import { Game } from "./game.server";

export const getCurrentPlayer = (
  state: PlayingState
): PlayerState | undefined => {
  return state.players[state.playerIdSequence[0]];
};

export const getNextPlayer = (state: PlayingState): PlayerState | null => {
  return state.players[state.playerIdSequence[1]];
};

export const getAllCellsForPlayer = (state: PlayingState, playerId: string) => {
  const cells = Object.values(state.cells);
  return cells
    .filter((cell) => cell.ownerId === playerId)
    .map((cell) => ({ ...cell, mode: CellModes[cell.activeModeId] }));
};

export const calculateDiamondsForPlayer = (
  state: PlayingState,
  player: PlayerState | undefined
) => {
  if (!player) return 0;

  const cells = getAllCellsForPlayer(state, player.id);
  const diamonds = cells.reduce((acc, cell) => {
    return acc + cell.mode.diamondsPerTurn;
  }, 0);
  return Math.max(diamonds, MinDiamondsPerTurn);
};

export const initializePlayers = (game: Game): PlayerStates => {
  return Object.fromEntries(
    new Map(
      game.players
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .map((player, index) => [
          player.id,
          {
            id: player.id,
            userId: player.userId,
            diamonds: Math.floor(game.map.cells.length / game.players.length),
            availableModeChanges: 3,
            index,
          },
        ])
    )
  );
};

export const initializeCell = (
  cell: Cell,
  ownerId: string,
  activeModeId: CellModeId
): CellState => {
  return {
    position: { x: cell.x, y: cell.y },
    ownerId,
    activeModeId: activeModeId,
    units: 1,
  };
};

export const normalizeCells = (cells: CellState[]): CellStates => {
  return Object.fromEntries(new Map(cells.map((cell) => [toId(cell), cell])));
};

export const initializeCells = (
  playerStates: PlayerStates,
  mapCells: Cell[]
) => {
  const players = Object.values(playerStates);
  const availableCells = mapCells
    .filter((cell) => cell.type === "player")
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  const playerCellCount = Math.floor(availableCells.length / players.length);

  const cells = players.flatMap((player) => {
    const cells = availableCells.splice(0, playerCellCount);
    return cells.map((cell) => {
      return initializeCell(cell, player.id, DefaultPlayerModeId);
    });
  });

  const neutralCells = availableCells.map((cell) => {
    return initializeCell(cell, "dummy", "defensive");
  });

  return normalizeCells([...cells, ...neutralCells]);
};

export const initializePreparationState = (
  currentPlayerId: string,
  players: PlayerStates,
  cells: CellStates
): PreparationState => {
  return {
    players,
    playerIdSequence: [currentPlayerId],
    cells,
    causedBy: { name: "startPreparation", payload: {}, turn: 0 },
    done: false,
    turn: 0,
    stateId: 0,
  };
};

export const initializePlayingState = (players: PlayerStates): PlayingState => {
  return {
    players,
    playerIdSequence: Object.keys(players),
    cells: {},
    causedBy: { name: "startPreparation", payload: {}, turn: 0 },
    turn: 0,
    stateId: 0,
  };
};

export const updatePlayingState = (
  preparationStates: PreparationState[],
  initialGameState: PlayingState
): PlayingState => {
  const playerCells = preparationStates.flatMap((s) =>
    Object.values(s.cells).filter(
      (c) => c.ownerId === s.playerIdSequence[0] || c.ownerId === "kicked"
    )
  );

  const otherCells = Object.values(preparationStates[0].cells).filter(
    (c) => !playerCells.some((pc) => compareCell(pc.position, c.position))
  );

  const availablePlayerIds = [
    ...new Set(preparationStates.flatMap((ps) => ps.playerIdSequence)),
  ];

  const state = {
    ...initialGameState,
    playerIdSequence: initialGameState.playerIdSequence.filter((id) =>
      availablePlayerIds.includes(id)
    ),
    cells: normalizeCells([...playerCells, ...otherCells]),
    causedBy: { name: "startGame", payload: {}, turn: 0 },
    turn: 1,
  };

  Object.keys(state.players).forEach((id) => (state.players[id].diamonds = 0));
  const diamonds = calculateDiamondsForPlayer(state, getCurrentPlayer(state));

  if (state.playerIdSequence.length)
    state.players[state.playerIdSequence[0]].diamonds = diamonds;

  return state;
};

export const isPreparationState = (
  state: PlayingState | PreparationState
): state is PreparationState => {
  return "done" in state;
};

export const isPlayingState = (
  state: PlayingState | PreparationState | undefined | null
): state is PlayingState => {
  if (!state) return false;
  return !("done" in state);
};

export const getState = (game: Game): PlayingState | null => {
  if (game.phase === "PLAYING" || game.phase === "FINISHED") {
    return game.gameState!;
  }

  if (game.phase === "PREPARATION") {
    return Object.values(game.players)[0].preparationState!;
  }

  return null;
};
