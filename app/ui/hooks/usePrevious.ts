import { useState } from "react";

export const usePrevious = <T>(currentValue: T) => {
  const [tuple, setTuple] = useState<[T | null, T]>([null, currentValue]);

  if (tuple[1] !== currentValue) {
    setTuple([tuple[1], currentValue]);
  }

  return tuple[0];
};
