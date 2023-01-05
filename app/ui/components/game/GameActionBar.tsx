import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { SupportedCellMode } from "@prisma/client";
import { Form } from "@remix-run/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { ListItemAnimationProps } from "~/config/graphics";
import { UnitCost } from "~/config/rules";
import { useUser } from "~/lib/user";
import {
  useAvailableDiamonds,
  useAvailableModeChanges,
  useGameState,
} from "~/ui/context/GameContext";
import { useSelectedCell } from "~/ui/context/SelectedCellContext";
import { Button } from "../base/Button";

const GameActionBar = () => {
  const state = useGameState();
  const { selectedCell } = useSelectedCell();
  const isAnimating = false;
  const canUseBuyActions = selectedCell?.state.isCurrentPlayersCell;
  const currentUser = useUser();
  const diamonds = useAvailableDiamonds();
  const availableModeChanges = useAvailableModeChanges();

  if (!state.canTakeAction) return null;
  return (
    <div className=" ">
      <motion.div
        layout
        className={clsx(
          "fixed bottom-0 rounded-t-2xl backdrop-blur-sm left-0 right-0 flex flex-col justify-between gap-2 bg-gray-200/50 px-safe pb-safe "
        )}
      >
        <div className="px-4 py-4">
          {canUseBuyActions && (
            <motion.div
              layout
              className="flex flex-col gap-8 justify-center items-center"
            >
              <motion.div {...ListItemAnimationProps}>
                <Form method="post">
                  <input
                    type="hidden"
                    name="position[q]"
                    value={selectedCell?.q}
                  />
                  <input
                    type="hidden"
                    name="position[r]"
                    value={selectedCell?.r}
                  />
                  <input type="hidden" name="userId" value={currentUser.id} />
                  <Button
                    disabled={isAnimating || diamonds < UnitCost}
                    name="_intent"
                    value="buyUnit"
                  >
                    Buy Unit: ${UnitCost}
                  </Button>
                </Form>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-5  gap-2">
                {Object.keys(SupportedCellMode).map((cellModeId) => {
                  return (
                    <motion.div key={cellModeId} {...ListItemAnimationProps}>
                      <Form method="post">
                        <input
                          type="hidden"
                          name="position[q]"
                          value={selectedCell?.q}
                        />
                        <input
                          type="hidden"
                          name="userId"
                          value={currentUser.id}
                        />
                        <input
                          type="hidden"
                          name="position[r]"
                          value={selectedCell?.r}
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
                          disabled={isAnimating || availableModeChanges === 0}
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
            {availableModeChanges === "unlimited" ? (
              <span>You may change as many cells as you want</span>
            ) : (
              <span>Available mode changes: {availableModeChanges}</span>
            )}
            <Form method="post" className="ml-auto">
              <input type="hidden" name="userId" value={currentUser.id} />
              <Button
                iconClasses="h-8 w-8"
                disabled={isAnimating}
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
