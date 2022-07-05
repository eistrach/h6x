import { Modifier } from "react-popper";
import { usePopover } from "./usePopover";

export const useDirectionalPopovers = <Modifiers>(
  modifiers?: ReadonlyArray<Modifier<Modifiers>>
) => {
  return {
    E: usePopover("right", modifiers),
    NE: usePopover("top", modifiers),
    NW: usePopover("top", modifiers),
    W: usePopover("left", modifiers),
    SE: usePopover("bottom", modifiers),
    SW: usePopover("bottom", modifiers),
  };
};
