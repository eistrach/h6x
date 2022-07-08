import { Modifier } from "react-popper";
import { CompassDirection } from "~/core/math";
import { UnpackData } from "~/core/utils";
import { usePopover } from "./usePopover";

type Popover = UnpackData<typeof usePopover>;

export const useDirectionalPopovers = <Modifiers>(
  modifiers?: ReadonlyArray<Modifier<Modifiers>>
): { [key in CompassDirection]: Popover } => {
  return {
    S: usePopover("bottom", modifiers),
    SE: usePopover("bottom", modifiers),
    SW: usePopover("bottom", modifiers),
    N: usePopover("top", modifiers),
    NE: usePopover("top", modifiers),
    NW: usePopover("top", modifiers),
  };
};
