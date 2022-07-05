import clsx from "clsx";
import { PLAYER_COLORS } from "~/lib/constants";
import { PlayerState } from "~/lib/game";
import { useUser } from "~/utils";

export type PlayersInfoProps = {
  currentPlayer: PlayerState;
  players: PlayerState[];
};

const PlayersInfo = ({ currentPlayer, players }: PlayersInfoProps) => {
  const user = useUser();
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex gap-2">
        {[...players]
          .sort((p1, p2) => p2.index - p1.index)
          .map((p) => {
            const color = PLAYER_COLORS[p.index];
            return (
              <div
                key={p.id}
                className={clsx(color.bg, "py-1 px-2 text-black")}
              >
                ${p.money}
              </div>
            );
          })}
      </div>
      <div className={clsx(PLAYER_COLORS[currentPlayer.index].bg, "p-4")}>
        {user.displayName}
      </div>
    </div>
  );
};

export default PlayersInfo;
