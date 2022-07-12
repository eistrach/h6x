import { useTransition } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { UnpackData } from "~/core/utils";

type TransitionState = UnpackData<typeof useTransition>["state"];
export const useHasTransitioned = (
  from: TransitionState,
  to: TransitionState
) => {
  const lastTransitions = useRef<[string | null, string | null]>([null, null]);

  const transition = useTransition();

  useEffect(() => {
    lastTransitions.current = [transition.state, lastTransitions.current[0]];
  }, [transition]);

  //console.log(lastTransitions, );
  return (
    lastTransitions.current[0] === to && lastTransitions.current[1] === from
  );
};
