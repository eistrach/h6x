import { User } from "@prisma/client";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { PLAYER_COLORS } from "~/config/config";
import { PlayerState } from "~/domain/logic/game";
import { useUser } from "~/utils";

export type PlayersInfoProps = {
  currentPlayer: PlayerState;
  players: PlayerState[];
  users: User[];
};

const PlayersInfo = ({ currentPlayer, players, users }: PlayersInfoProps) => {
  return (
    <div className="flex w-full justify-end items-center pt-1">
      <ol className="flex-shrink-0 flex m-2 -space-x-1 items-center">
        <AnimatePresence>
          {[...players].reverse().map((p) => {
            const color = PLAYER_COLORS[p.index];

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
                <div
                  className={clsx("p-1", {
                    "font-bold text-sm": isCurrentPlayer,
                    "text-xs text-gray-500": !isCurrentPlayer,
                  })}
                >
                  ${p.money}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>
    </div>
  );
};

export default PlayersInfo;
