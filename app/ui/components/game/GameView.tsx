import { Form, Link, useTransition } from "@remix-run/react";
import { CellModes, UnitCost } from "~/config/rules";
import { Button } from "../base/Button";
import { useSelectedCell } from "~/ui/hooks/useSelectedCell";
import PlayersInfo from "./PlayersInfo";
import { GameWithState } from "~/domain/game/game.server";
import { useComputedGameState } from "~/ui/hooks/useComputedGameState";
import { useDirectionalPopovers } from "~/ui/hooks/useDirectionalPopovers";
import AttackPopovers from "./AttackPopovers";
import GameMap from "./GameMap";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { LogoIcon } from "../icons/LogoIcon";
import { isPlayingState } from "~/domain/game/utils";

import clsx from "clsx";
import GameFinishedOverlay from "./GameFinishedOverlay";

const animationProps = {
  layout: true,
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1, type: "spring" },
  },
  exit: { opacity: 0, scale: 0 },
};

export default function GameView(props: GameWithState) {
  const { game, state, canTakeAction } = props;
  const playerId = state.playerIdSequence[0];

  const [selectedCell, setSelectedCell] = useSelectedCell(state.cells);
  const { attackableNeighbors, canUseBuyActions, currentPlayer, selectedUnit } =
    useComputedGameState(props, selectedCell);
  const directionalPopovers = useDirectionalPopovers();

  const transition = useTransition();

  const disableActions = transition.state !== "idle";
  const isGameDone = state.playerIdSequence.length === 1;

  return (
    <div className="h-screen flex justify-center items-center flex-col">
      <GameFinishedOverlay
        lost={!canTakeAction && isGameDone}
        won={canTakeAction && isGameDone}
      />

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
          players={state.players}
          playerSequenceIds={state.playerIdSequence}
          users={game.players.map((player) => player.user)}
        />
      </div>

      <GameMap
        cells={state.cells}
        onClick={(c) => setSelectedCell(c)}
        selectedCell={selectedCell}
        attackableNeighbors={attackableNeighbors}
        directionalPopovers={directionalPopovers}
        players={state.players}
        currentPlayer={currentPlayer}
      />
      {canTakeAction && (
        <div className="flex flex-col items-center gap-8 m-4">
          <motion.div
            layout
            className={clsx(
              "fixed bottom-0 rounded-t-2xl backdrop-blur-sm left-0 right-0 flex flex-col justify-between gap-2 bg-gray-200/50 py-3 px-4 ",
              { "": canUseBuyActions && selectedCell }
            )}
          >
            {canUseBuyActions && selectedCell && (
              <motion.div
                layout
                className="flex flex-col gap-8 justify-center items-center"
              >
                <motion.div {...animationProps}>
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
                        (!!selectedUnit && currentPlayer.diamonds < UnitCost)
                      }
                      name="_intent"
                      value="buyUnit"
                    >
                      Buy Unit: ${UnitCost}
                    </Button>
                  </Form>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-5  gap-2">
                  {Object.keys(CellModes).map((cellModeId) => {
                    return (
                      <motion.div {...animationProps} key={cellModeId}>
                        <Form method="post">
                          <input
                            type="hidden"
                            name="position[x]"
                            value={selectedCell?.position.x}
                          />
                          <input
                            type="hidden"
                            name="playerId"
                            value={playerId}
                          />
                          <input
                            type="hidden"
                            name="position[y]"
                            value={selectedCell?.position.y}
                          />
                          <input
                            type="hidden"
                            name="cellModeId"
                            value={cellModeId}
                          />
                          <Button
                            type="submit"
                            name="_intent"
                            value="changeCellMode"
                            disabled={
                              disableActions ||
                              (isPlayingState(state) &&
                                currentPlayer.availableModeChanges <= 0)
                            }
                          >
                            {cellModeId}
                          </Button>
                        </Form>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
            <motion.div
              layout
              className=" flex justify-between items-center w-full h-min mt-auto"
            >
              {isPlayingState(state) ? (
                <span>
                  Available mode changes: {currentPlayer.availableModeChanges}
                </span>
              ) : (
                <span>You may change as many cells as you want</span>
              )}
              <Form method="post" className="ml-auto">
                <input type="hidden" name="playerId" value={playerId} />
                <Button
                  iconClasses="h-8 w-8"
                  disabled={disableActions}
                  RightIcon={CheckCircleIcon}
                  name="_intent"
                  value="endTurn"
                  type="submit"
                ></Button>
              </Form>
            </motion.div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
