import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

/**
 * The two themes supported by the app.
 * We keep it simple: "light" or "dark".
 */
type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "dericer-theme";

/**
 * Apply the given theme to the <html> element by toggling the "dark" class.
 * Tailwind's `dark:` styles depend on this.
 */
function applyThemeToDocument(theme: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
}

/**
 * ThemeProvider is responsible for:
 * - determining the initial theme (stored in localStorage or from system preference)
 * - exposing `theme`, `setTheme`, `toggleTheme` via context
 * - applying the theme to the document element
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>("light");

    // Initialize theme on first mount
    useEffect(() => {
        // Check if user has an explicit preference stored
        const stored = (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? null;

        if (stored === "light" || stored === "dark") {
            setThemeState(stored);
            applyThemeToDocument(stored);
            return;
        }

        // Otherwise fall back to system preference
        const prefersDark =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initial: Theme = prefersDark ? "dark" : "light";
        setThemeState(initial);
        applyThemeToDocument(initial);
    }, []);

    // Keep document + localStorage in sync when theme changes
    useEffect(() => {
        applyThemeToDocument(theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = (value: Theme) => {
        setThemeState(value);
    };

    const toggleTheme = () => {
        setThemeState((prev) => (prev === "light" ? "dark" : "light"));
    };

    const value: ThemeContextValue = {
        theme,
        setTheme,
        toggleTheme,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Convenience hook to access the current theme and actions.
 * Must be used inside <ThemeProvider>.
 */
export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used inside a ThemeProvider");
    }
    return ctx;
}
