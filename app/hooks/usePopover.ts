import { UnpackData } from "~/utils";
import { useState } from "react";
import { Modifier, usePopper } from "react-popper";

import * as PopperJS from "@popperjs/core";

export const usePopover = <Modifiers>(
  placement?: PopperJS.Placement,
  modifiers?: ReadonlyArray<Modifier<Modifiers>>
) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement,

    modifiers: [
      { name: "arrow", options: { element: arrowElement } } as any,
      //   {
      //     name: "offset",
      //     options: {
      //       offset: [0, -5],
      //     },
      //   },
      ...(modifiers || []),
    ],
  });

  return {
    setReferenceElement,
    setPopperElement,
    setArrowElement,
    styles,
    attributes,
  };
};

export type Popover = UnpackData<typeof usePopover>;
