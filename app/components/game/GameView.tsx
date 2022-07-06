import { Form, Link, useTransition } from "@remix-run/react";
import { UNITS } from "~/config/units";
import { Button } from "../base/Button";
import { useSelectedCell } from "~/hooks/useSelectedCell";
import PlayersInfo from "./PlayersInfo";
import { GState } from "~/domain/game.server";
import { useComputedGameState } from "~/hooks/useComputedGameState";
import { useDirectionalPopovers } from "~/hooks/useDirectionalPopovers";
import AttackPopovers from "./AttackPopovers";
import GameMap from "./GameMap";
import { motion } from "framer-motion";
import { InputTheme } from "../base/InputTheme";
import { CheckCircleIcon, CogIcon, PlusIcon } from "@heroicons/react/solid";
import { LogoIcon } from "../icons/LogoIcon";

type GameViewProps = {
  state: GState;
};

export default function GameView({ state }: GameViewProps) {
  const { playerCells, players, canTakeAction, playerId } = state;
  const [selectedCell, setSelectedCell] = useSelectedCell(playerCells);
  const { attackableNeighbors, canUseBuyActions, currentPlayer, selectedUnit } =
    useComputedGameState(state, selectedCell);
  const directionalPopovers = useDirectionalPopovers();

  const transition = useTransition();

  const disableActions = transition.state !== "idle";

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <AttackPopovers
        disabled={disableActions}
        attackableNeighbors={attackableNeighbors}
        directionalPopovers={directionalPopovers}
        playerId={playerId}
        sourceCell={selectedCell}
      />
      <div className="fixed z-10 left-0 right-0 top-0 rounded-b-2xl backdrop-blur-sm h-20 bg-gray-100/50 px-4 flex justify-between items-start">
        <Link to="/" className="flex gap-1 justify-start items-center my-3">
          <LogoIcon className="w-10 h-10" />
          <span className="font-extrabold text-2xl">h6x</span>
        </Link>
        <PlayersInfo
          currentPlayer={currentPlayer}
          players={players}
          users={state.users}
        />
      </div>

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
                      disableActions ||
                      (selectedUnit && currentPlayer.money < selectedUnit?.cost)
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
                    <Form method="post" key={unit.id}>
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
                        disabled={
                          disableActions || unit.cost > currentPlayer.money
                        }
                      >
                        {unit.name}: ${unit.cost}
                      </Button>
                    </Form>
                  );
                })}
              </div>
            </div>
          )}
          <motion.div
            layoutId="background"
            className="fixed bottom-0 rounded-t-2xl backdrop-blur-sm left-0 right-0 flex bg-gray-200/50 py-3 px-4 justify-between items-center"
          >
            <Form method="post" className="ml-auto">
              <input type="hidden" name="playerId" value={playerId} />
              <Button
                disabled={disableActions}
                RightIcon={CheckCircleIcon}
                name="_intent"
                value="endTurn"
                type="submit"
              >
                End Turn
              </Button>
            </Form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
