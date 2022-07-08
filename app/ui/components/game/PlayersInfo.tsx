import { User } from "@prisma/client";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { PlayerColors } from "~/config/graphics";
import { PlayerState, PlayerStates } from "~/core/actions/types";

export type PlayersInfoProps = {
  currentPlayer: PlayerState;
  players: PlayerStates;
  playerSequenceIds: string[];
  users: User[];
};

const PlayersInfo = ({
  currentPlayer,
  players,
  playerSequenceIds,
  users,
}: PlayersInfoProps) => {
  return (
    <div className="flex w-full justify-end items-center pt-1">
      <ol className="flex-shrink-0 flex m-2 -space-x-1 items-center">
        <AnimatePresence>
          {[...playerSequenceIds].reverse().map((id) => {
            const p = players[id];
            const color = PlayerColors[p.index];

            const user = users.find((u) => u.id === p.userId)!;
            const isCurrentPlayer = p.id === currentPlayer.id;
            return (
              <motion.li
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 0.1, type: "spring" },
                }}
                layout
                exit={{ opacity: 0, scale: 0 }}
                key={p.id}
                className="flex  flex-col justify-center items-center"
              >
                <div
                  className={clsx(
                    "ring-4 shadow-md rounded-full bg-white z-10",
                    color.ring,
                    {
                      "w-10 h-10": isCurrentPlayer,
                      "w-8 h-8 opacity-75": !isCurrentPlayer,
                    }
                  )}
                >
                  <div>
                    {!!user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        className="object-cover rounded-full"
                      ></img>
                    ) : (
                      <span>{user.displayName[0]}</span>
                    )}
                  </div>
                </div>
                {true && (
                  <div
                    className={clsx("p-1 flex items-center gap-0.5", {
                      "font-bold text-sm": isCurrentPlayer,
                      "text-xs text-gray-500": !isCurrentPlayer,
                    })}
                  >
                    {p.diamonds}
                    <svg
                      width="20"
                      height="18"
                      viewBox="0 0 20 18"
                      className={clsx({
                        "w-3 h-3 fill-sky-400": isCurrentPlayer,
                        "w-2 h-2 fill-sky-400 opacity-75": !isCurrentPlayer,
                      })}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.99998 16.3599L1.27094 5.0121L4.48061 0.999991L15.5194 0.99999L18.7291 5.0121L9.99998 16.3599Z"
                        stroke="black"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                )}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
};

export default PlayersInfo;
