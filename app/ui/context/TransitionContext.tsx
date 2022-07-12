import { createContext, PropsWithChildren, useContext } from "react";
import { useGameStateTransitions } from "../hooks/useGameStateTransitions";

export const TransitionContext = createContext<boolean>(false);

export const TransitionContextProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const isTransitioningToNextState = useGameStateTransitions();
  return (
    <TransitionContext.Provider value={isTransitioningToNextState}>
      {children}
    </TransitionContext.Provider>
  );
};
export const useIsTransitioningToNextState = () => {
  return useContext(TransitionContext)!;
};
