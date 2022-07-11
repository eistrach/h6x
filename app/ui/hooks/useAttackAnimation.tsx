import { useTransition } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";
import { PlayingState } from "~/core/actions/types";
import { asMathCell, compareCell, Point } from "~/core/math";

export const useAttackAnimation = (
  state: PlayingState,
  cell: Point,
  isTransitioning: boolean
) => {
  const [attackAnimation, setAttackAnimation] = useState<{
    source: Point;
    target: Point;
  } | null>(null);
  const lastTransitions = useRef<[string | null, string | null]>([null, null]);

  const transition = useTransition();

  useEffect(() => {
    lastTransitions.current = [transition.state, lastTransitions.current[0]];
  }, [transition]);

  const triggeredAttack =
    lastTransitions.current[0] === "idle" &&
    lastTransitions.current[1] === "loading";
  useEffect(() => {
    if (!!attackAnimation) {
      const timeout = setTimeout(() => {
        setAttackAnimation(null);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [!!attackAnimation]);

  useEffect(() => {
    if (state.causedBy?.name === "attackCell") {
      const attackInfo = state.causedBy.payload as {
        source: Point;
        target: Point;
      };
      if (
        compareCell(attackInfo.source, cell) &&
        (triggeredAttack || isTransitioning)
      ) {
        setAttackAnimation({
          source: asMathCell(attackInfo.source).toPoint(),
          target: asMathCell(attackInfo.target).toPoint(),
        });
      }
    }
  }, [JSON.stringify(state), triggeredAttack, isTransitioning]);

  return attackAnimation;
};
