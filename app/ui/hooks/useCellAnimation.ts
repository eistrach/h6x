import { useTransition } from "@remix-run/react";
import { useAnimationControls } from "framer-motion";
import { useEffect } from "react";
import { Point } from "~/core/math";
import { useGameTransition } from "../context/TransitionContext";
import { PlayingState } from "~/core/actions/types";
import { asMathCell, compareCell } from "~/core/math";
import { useGameState } from "../context/GameContext";
import { useSelectedCell } from "../context/SelectedCellContext";
import { AttackTransitionDelay } from "~/config/animations";

export function getCombatPositions(source: Point, state?: PlayingState) {
  if (compareCell(source, state?.causedBy.payload.source)) {
    const ps = asMathCell(state?.causedBy.payload.source).toPoint();
    const pt = asMathCell(state?.causedBy.payload.target).toPoint();
    return [ps, pt];
  }
  return [];
}

export const useCellAnimation = (position: Point) => {
  const { nextState } = useGameState();
  const controls = useAnimationControls();
  const gameTransition = useGameTransition();
  const transition = useTransition();

  const { selectedCell } = useSelectedCell();

  const animateAttack = (pt: Point, ps: Point) => {
    controls.start({
      x: [0, (pt.x - ps.x) * 0.7, 0],
      y: [0, (pt.y - ps.y) * 0.7, 0],
      scale: 1,
      transition: {
        duration: AttackTransitionDelay / 1000,
        type: "ease-out",
      },
    });
  };

  const animateCellChange = () => {
    controls.start({
      scale: 1,
      transition: {
        type: "spring",
        velocity: 50,
        stiffness: 700,
        damping: 80,
      },
    });
  };

  // handle anim during replay/transition
  useEffect(() => {
    if (!compareCell(position, selectedCell?.position)) {
      return;
    }
    if (gameTransition === "buyUnit" || gameTransition === "changeCellMode") {
      return animateCellChange();
    }

    const [ps, pt] = getCombatPositions(position, nextState);
    if (!ps || !pt) return;
    if (gameTransition === "attackCell") {
      animateAttack(pt, ps);
    }
  }, [gameTransition]);

  // handle current player
  useEffect(() => {
    if (!compareCell(position, selectedCell?.position)) {
      return;
    }
    if (
      transition.state === "submitting" &&
      (transition.submission.formData.get("_intent") === "buyUnit" ||
        transition.submission.formData.get("_intent") === "changeCellMode")
    ) {
      return animateCellChange();
    }

    if (
      transition.state === "submitting" &&
      transition.submission.formData.get("_intent") === "attackCell"
    ) {
      if (!compareCell(selectedCell?.position, position)) return;
      const ps = asMathCell(selectedCell?.position).toPoint();
      const pt = asMathCell({
        x: Number(transition.submission.formData.get("target[x]")),
        y: Number(transition.submission.formData.get("target[y]")),
      }).toPoint();
      if (!ps || !pt) return;
      animateAttack(pt, ps);
    }
  }, [transition]);

  return controls;
};
