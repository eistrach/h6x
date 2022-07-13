import { CheckCircleIcon } from "@heroicons/react/solid";
import { Form } from "@remix-run/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ListItemAnimationProps } from "~/config/graphics";
import { UnitCost, CellModes } from "~/config/rules";
import { isPlayingState } from "~/domain/game/utils";
import {
  useCurrentPlayer,
  useGameState,
  useIsSubmitting
} from "~/ui/context/GameContext";
import { useSelectedCell } from "~/ui/context/SelectedCellContext";
import { Button } from "../base/Button";

const GameActionBar = () => {
  const { state, canTakeAction } = useGameState();
  const { selectedCell } = useSelectedCell();
  const disableActions = useIsSubmitting();
  const canUseBuyActions = selectedCell?.isOwnCell;
  const currentPlayer = useCurrentPlayer();
  if (!canTakeAction) return null;
  return (
    <div className=" ">
      <motion.div
        layout
        className={clsx(
          "fixed bottom-0 rounded-t-2xl backdrop-blur-sm left-0 right-0 flex flex-col justify-between gap-2 bg-gray-200/50 px-safe pb-safe "
        )}
      >
        <div className="px-4 py-4">
          {canUseBuyActions && selectedCell && (
            <motion.div
              layout
              className="flex flex-col gap-8 justify-center items-center"
            >
              <motion.div {...ListItemAnimationProps}>
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
                  <input
                    type="hidden"
                    name="playerId"
                    value={currentPlayer.id}
                  />
                  <Button
                    disabled={
                      disableActions ||
                      (!!selectedCell.mode && currentPlayer.diamonds < UnitCost)
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
                    <motion.div {...ListItemAnimationProps} key={cellModeId}>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="position[x]"
                          value={selectedCell?.position.x}
                        />
                        <input
                          type="hidden"
                          name="playerId"
                          value={currentPlayer.id}
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
              <input type="hidden" name="playerId" value={currentPlayer.id} />
              <Button
                iconClasses="h-8 w-8"
                disabled={disableActions}
                RightIcon={CheckCircleIcon}
                name="_intent"
                value="endTurn"
                type="submit"
              >
                Done
              </Button>
            </Form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameActionBar;
