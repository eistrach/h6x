import produce from "immer";
import { Action, PlayingState } from "./types";

export const registerAction = <S extends PlayingState<P>, P extends any>(
  name: string,
  validations: ((state: S, opts: P) => void)[],
  action: (state: S, payload: P) => void
) => {
  return produce((state: S, payload: P) => {
    validate(state, payload, validations);
    action(state, payload);
    commitAction(state, payload, name);
  });
};

export function validate<T extends PlayingState, Payload>(
  state: T,
  payload: Payload,
  validations: ((state: T, opts: Payload) => void)[]
) {
  return validations.forEach((fn) => fn(state, payload));
}

export const commitAction = <P>(
  state: PlayingState,
  payload: P,
  name: string
) => {
  state.causedBy = { name, payload, turn: state.turn };
};

export type ExtractAction<
  ActionFunc extends ReturnType<typeof registerAction>,
  S extends PlayingState = PlayingState,
  P = Parameters<ActionFunc>[1]
> = Action<P>;
