import produce from "immer";
import { PlayingState } from "./types";

export const registerAction = <S extends PlayingState, P>(
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

export const commitAction = (
  state: PlayingState,
  payload: any,
  name: string
) => {
  state.actions.push({ name, payload, turn: state.turn });
};
