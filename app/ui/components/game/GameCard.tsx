import { Button } from "../base/Button";
import GamePreview from "../map/GamePreview";
import { ShareIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { PlayIcon } from "@heroicons/react/24/solid";
import { InputTheme } from "../base/InputTheme";
import clsx from "clsx";
import { Form } from "@remix-run/react";
import { Link } from "../base/Link";
import { DocumentDuplicateIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { ClientOnly } from "remix-utils";
import { getState } from "~/domain/game/utils";
import { PlayerColors } from "~/config/graphics";
import { useUser } from "~/lib/user";
import { copyTextToClipboard } from "~/lib/utils";

const GameCard = ({ game }: any) => {
  const user = useUser();
  const canShare =
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    navigator?.canShare;
  const handleShare = () => {
    const shareUrl = `${window.location.href}/${game.id}/join`;

    if (canShare) {
      navigator.share({
        title: "Send h6x game invite",
        text: `${user.nickname} has invited you to play h6x!`,
        url: shareUrl,
      });
    } else {
      copyTextToClipboard(shareUrl);
    }
  };

  const creator = game.creator;
  const state = getState(game);

  const players =
    game.phase === "PLAYING" || game.phase === "FINISHED"
      ? [...game.players].sort((p1, p2) => {
          const i1 = state!.playerIdSequence.indexOf(p2.id);
          const i2 = state!.playerIdSequence.indexOf(p1.id);
          if (i1 === -1 && i2 > -1) {
            return 1;
          }
          if (i2 === -1 && i1 > -1) {
            return -1;
          }
          return i1 - i2;
        })
      : game.players;

  return (
    <motion.li
      variants={{
        collapsed: { scale: 0.7 },
        open: { scale: 1 },
      }}
      transition={{ duration: 0.25 }}
      className="relative w-full self-stretch sm:max-w-sm bg-white shadow-lg flex flex-col items-center"
    >
      <div className="p-2 flex w-full justify-between items-center">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 p-2 text-sm rounded-sm  text-white ">
            <div className="w-10 h-10 ring-white ring-2 shadow-md rounded-full bg-white">
              {!!creator.avatarUrl ? (
                <img
                  src={creator.avatarUrl}
                  className="object-cover rounded-full"
                ></img>
              ) : (
                <span>{creator.displayName[0]}</span>
              )}
            </div>

            <div className="flex flex-col items-end">
              <span className="font-bold  text-stone-900">
                {creator.displayName}
              </span>
              <span className="text-xs text-gray-500">
                #{creator.username.split("#")[1]}
              </span>
            </div>
          </div>
          <ol className="flex-shrink-0 flex m-2 -space-x-2 ml-auto items-center">
            {[...Array(6 - game.players.length)].map((_, index) => (
              <li
                key={index}
                className="text-primary-900 text-center w-6 h-6  rounded-full ring ring-white bg-gray-100"
              ></li>
            ))}
            {players.map((player: any) => {
              const ring = state?.players
                ? PlayerColors[state.players[player.id].index].ring
                : "ring-white";
              const lost = state && !state.playerIdSequence.includes(player.id);
              return (
                <li key={player.id} className="relative">
                  <div
                    className={clsx(
                      "  ring-2 shadow-md rounded-full bg-white relative",
                      ring,
                      { "opacity-50 w-8 h-8": lost, "w-8 h-8": !lost }
                    )}
                  >
                    {!!player.user.avatarUrl ? (
                      <img
                        src={player.user.avatarUrl}
                        className="object-cover rounded-full"
                      ></img>
                    ) : (
                      <span>{player.user.displayName[0]}</span>
                    )}
                  </div>
                  {lost && (
                    <span className="text-xs text-gray-800 absolute inset-0 flex justify-center items-center">
                      <XMarkIcon className="h-8 w-8 " />
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="w-full p-8">
        <GamePreview
          className=" bg-gradient-to-br shadow-md from-primary-200/80 to-primary-400/80  rounded-full "
          cellClassName="stroke-gray-900 fill-white"
          cells={game.map.cells}
        />
      </div>

      <div
        className={clsx(
          "flex items-center justify-between bg-gray-50 p-4 mt-2 w-full h-full rounded-lg"
        )}
      >
        {game.phase === "LOBBY" && game.players.length < 6 && (
          <ClientOnly fallback={<button />}>
            {() => (
              <Button
                onClick={handleShare}
                theme={InputTheme.Link}
                LeftIcon={canShare ? ShareIcon : DocumentDuplicateIcon}
              >
                {canShare ? "Invite" : "Copy link"}
              </Button>
            )}
          </ClientOnly>
        )}
        {game.players.length > 1 &&
          (game.phase === "LOBBY" ? (
            game?.creatorId === user.id ? (
              <Form method="post" action={`${game.id}`}>
                <Button
                  LeftIcon={PlayIcon}
                  type="submit"
                  name="_intent"
                  value="startGame"
                >
                  Start
                </Button>
              </Form>
            ) : null
          ) : (
            <Link className="ml-auto" to={game.id} LeftIcon={PlayIcon}>
              Continue
            </Link>
          ))}
      </div>
    </motion.li>
  );
};

export default GameCard;
