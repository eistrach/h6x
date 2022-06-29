import { PropsWithChildren } from "react";
import { getGamesForUser } from "~/domain/game.server";
import { copyTextToClipboard, UnpackArray, UnpackData } from "~/utils";
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
    <li className="relative bg-white  p-2 flex">
      <div className="absolute w-full h-full bg-primary-200 -z-10" />
      <div className="h-32 w-32 ">
        <GamePreview
          className=" m-2 bg-gradient-to-br shadow-md from-primary-200/80 to-primary-400/80  rounded-full "
          cellClassName="stroke-gray-900 fill-white"
          cells={game.map.cells}
        />
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex w-full justify-end">
          <ol className="flex m-2 flex-shrink-0 -space-x-2 items-center">
            {[...Array(6 - game.players.length)].map((_, index) => (
              <li
                key={index}
                className="text-primary-900 text-center w-8 h-8  rounded-full ring ring-white bg-gray-100"
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
              onClick={() =>
                copyTextToClipboard(`${window.location.href}/${game.id}/join`)
              }
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
