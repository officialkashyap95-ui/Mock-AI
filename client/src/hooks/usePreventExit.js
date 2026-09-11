import { useEffect } from "react";

function usePreventExit(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [enabled]);
}

export default usePreventExit;