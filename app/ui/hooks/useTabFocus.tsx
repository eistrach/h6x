import { useEffect, useState } from "react";

export const useHasTabFocus = () => {
  const [tabHasFocus, setTabHasFocus] = useState(true);

  useEffect(() => {
    const handleChange = () => {
      setTabHasFocus(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleChange);

    return () => {
      window.removeEventListener("visibilitychange", handleChange);
    };
  }, []);

  return tabHasFocus;
};
