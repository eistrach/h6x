import { PropsWithChildren } from "react";
import { getGamesForUser } from "~/domain/game.server";
import { UnpackArray, UnpackData } from "~/utils";
import { Button } from "../base/Button";
import GamePreview from "../map/GamePreview";
import { ShareIcon } from "@heroicons/react/solid";
import { PlayIcon } from "@heroicons/react/solid";
import { InputTheme } from "../base/InputTheme";
import { IconButton } from "../base/IconButton";
import clsx from "clsx";

export type GameCardProps = PropsWithChildren<{
  game: UnpackArray<UnpackData<typeof getGamesForUser>>;
}>;

const GameCard = ({ game }: GameCardProps) => {
  return (
    <li className="relative bg-yellow-100  border-black border-2 p-2 rounded-sm shadow-sm flex">
      <div className="p-1 bg-orange-300 text-orange-900 absolute left-0 top-0 border-black border-r-2 border-b-2">
        {game.phase}
      </div>

      <div className="w-32">
        <GamePreview
          className="m-2 bg-yellow-300 rounded-full border-2 border-black shadow-lg"
          cells={game.map.cells}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex w-full justify-end">
          <ol className="flex m-2 flex-shrink-0 -space-x-1 items-center">
            {[...Array(6 - game.players.length)].map((_, index) => (
              <li
                key={index}
                className="text-yellow-900 text-center w-8 h-8  rounded-full ring ring-yellow-300 bg-yellow-200"
              ></li>
            ))}
            {game.players.map((player) => (
              <li key={player.id}>
                <img
                  className="w-9 h-9 ring ring-green-400 shadow-md rounded-full"
                  src={player.user.avatarUrl || ""}
                ></img>
              </li>
            ))}
          </ol>
        </div>
        <div
          className={clsx(
            "ml-2 mr-0.5 mb-2 flex  items-center",

            {
              "justify-between": game.players.length > 1,
              "justify-end": game.players.length <= 1,
            }
          )}
        >
          {game.phase === "LOBBY" && game.players.length < 6 && (
            <Button
              theme={InputTheme.Outlined}
              className="rounded-sm text-gray-900"
              LeftIcon={ShareIcon}
            >
              Share
            </Button>
          )}

          {game.players.length > 1 && (
            <IconButton
              Icon={PlayIcon}
              className="w-12 h-12 text-green-500"
            ></IconButton>
          )}
        </div>
      </div>
    </li>
  );
};

export default GameCard;
