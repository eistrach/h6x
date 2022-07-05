import { Form } from "@remix-run/react";
import { UNITS } from "~/config/units";
import { Button } from "../base/Button";
import { useSelectedCell } from "~/hooks/useSelectedCell";
import PlayersInfo from "./PlayersInfo";
import { GState } from "~/domain/game.server";
import { useComputedGameState } from "~/hooks/useComputedGameState";
import { useDirectionalPopovers } from "~/hooks/useDirectionalPopovers";
import AttackPopovers from "./AttackPopovers";
import GameMap from "./GameMap";

type GameViewProps = {
  state: GState;
};

export default function GameView({ state }: GameViewProps) {
  const { playerCells, players, canTakeAction, playerId } = state;
  const [selectedCell, setSelectedCell] = useSelectedCell(playerCells);
  const { attackableNeighbors, canUseBuyActions, currentPlayer, selectedUnit } =
    useComputedGameState(state, selectedCell);
  const directionalPopovers = useDirectionalPopovers();

  return (
    <div className="">
      <AttackPopovers
        attackableNeighbors={attackableNeighbors}
        directionalPopovers={directionalPopovers}
        playerId={playerId}
        sourceCell={selectedCell}
      />
      <PlayersInfo currentPlayer={currentPlayer} players={players} />
      <GameMap
        cells={playerCells}
        onClick={(c) => setSelectedCell(c)}
        selectedCell={selectedCell}
        attackableNeighbors={attackableNeighbors}
        directionalPopovers={directionalPopovers}
        players={players}
        currentPlayer={currentPlayer}
      />
      {canTakeAction && (
        <div className="flex flex-col items-center gap-8 m-4">
          {canUseBuyActions && (
            <div className="flex flex-col gap-8 justify-center items-center">
              <div>
                <Form method="post">
                  <input
                    type="hidden"
                    name="position[x]"
                    value={selectedCell?.position.x}
                  />
                  <input
                    type="hidden"
                    name="position[y]"
                    value={selectedCell?.position.y}
                  />
                  <input type="hidden" name="playerId" value={playerId} />
                  <Button
                    disabled={
                      selectedUnit && currentPlayer.money < selectedUnit?.cost
                    }
                    name="_intent"
                    value="upgradeUnit"
                  >
                    Buy Unit: ${selectedUnit?.cost}
                  </Button>
                </Form>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5  gap-2">
                {UNITS.map((unit) => {
                  return (
                    <Form method="post">
                      <input
                        type="hidden"
                        name="position[x]"
                        value={selectedCell?.position.x}
                      />
                      <input type="hidden" name="playerId" value={playerId} />
                      <input
                        type="hidden"
                        name="position[y]"
                        value={selectedCell?.position.y}
                      />
                      <input type="hidden" name="unitId" value={unit.id} />
                      <Button
                        type="submit"
                        name="_intent"
                        value="buyUnit"
                        disabled={unit.cost > currentPlayer.money}
                      >
                        {unit.name}: ${unit.cost}
                      </Button>
                    </Form>
                  );
                })}
              </div>
            </div>
          )}
          <Form method="post" className="">
            <input type="hidden" name="playerId" value={playerId} />
            <Button name="_intent" value="endTurn" type="submit">
              End Turn
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
