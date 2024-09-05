import {createContext, useContext, useEffect} from "react";
import {useLocalStorageState} from "../hooks/useLocalStorageState";

const DarkModeContext = createContext();

function DarkModeProvider({children}) {
    const [isDarkMode, setIsDarkMode] = useLocalStorageState(window.matchMedia("(prefers-color-scheme: dark)").matches, "isDarkMode"); // We can actually use the user's operating system dark mode setting as the default value here. In this example, my OS is in dark mode by default. We can access this using a media query with window.matchMedia. We pass the media query string in parentheses, which checks for '(prefers-color-scheme: dark)'. The result tells us whether the user's preference matches dark mode.
    // console.log(window.matchMedia("(prefers-color-scheme: dark)").matches);

    useEffect(function () {
        if (isDarkMode) {
            document.documentElement.classList.add("dark-mode");
            document.documentElement.classList.remove("light-mode");
        } else {
            document.documentElement.classList.add("light-mode");
            document.documentElement.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    function toggleDarkMode() {
        setIsDarkMode((isDark) => !isDark);
    }

    return (<DarkModeContext.Provider value={{isDarkMode, toggleDarkMode}}>
        {children}
    </DarkModeContext.Provider>);
}

function useDarkMode() {
    const context = useContext(DarkModeContext);
    if (context === undefined)
        throw new Error("DarkModeContext was used outside of DarkModeProvider");
    return context;
}

export {DarkModeProvider, useDarkMode};