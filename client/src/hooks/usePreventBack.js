import { useEffect } from "react";

function usePreventBack(onBack) {
    useEffect(() => {
        // Add a dummy history entry
        window.history.pushState(
            { interview: true },
            "",
            window.location.href
        );

        const handlePopState = () => {
            onBack();

            // Push another history state so the user stays here
            window.history.pushState(
                { interview: true },
                "",
                window.location.href
            );
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [onBack]);
}

export default usePreventBack;