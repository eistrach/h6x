import { Link } from "@remix-run/react";
import PlayersInfo from "./PlayersInfo";
import AttackPopovers from "./AttackPopovers";
import GameMap from "./GameMap";
import { LogoIcon } from "../icons/LogoIcon";
import GameFinishedOverlay from "./GameFinishedOverlay";
import GameActionBar from "./GameActionBar";
import { useIsGameFinished } from "~/ui/context/GameContext";

export default function GameView() {
  const isGameFinished = useIsGameFinished();
  return (
    <div className="h-screen flex justify-center items-center flex-col">
      {isGameFinished && <GameFinishedOverlay />}
      <AttackPopovers />

      <div className="fixed z-10 left-0 right-0 top-0 rounded-b-2xl backdrop-blur-sm  h-20 bg-gray-200/50 px-safe pt-safe flex justify-between items-center">
        <Link
          to="/"
          className="flex gap-1 justify-start items-center my-3 pl-4"
        >
          <LogoIcon className="w-10 h-10" />
          <span className="font-extrabold text-2xl">h6x</span>
        </Link>
        <PlayersInfo />
      </div>

      <GameMap />
      <GameActionBar />
    </div>
  );
}
