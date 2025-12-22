import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { type CoreApi } from "dericer-core";
import { createBrowserCore } from "../../core/browser-core";

/**
 * The shape of the CoreContext.
 * We expose:
 * - core: the initialized CoreApi instance
 * - isReady: whether the core is ready to be used
 * - error: optional initialization error
 */
interface CoreContextValue {
    core: CoreApi | null;
    isReady: boolean;
    error: Error | null;
}

const CoreContext = createContext<CoreContextValue | undefined>(undefined);

interface CoreProviderProps {
    children: ReactNode;
}

/**
 * CoreProvider is responsible for:
 * - creating the browser-specific core instance (IndexedDB storage + time)
 * - exposing it via React context
 * - handling loading and error states
 */
export const CoreProvider: React.FC<CoreProviderProps> = ({ children }) => {
    const [core, setCore] = useState<CoreApi | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function init() {
            try {
                const browserCore = await createBrowserCore();
                if (!isMounted) return;
                setCore(browserCore);
                setIsReady(true);
            } catch (err) {
                console.error("Failed to initialize Dericer core:", err);
                if (!isMounted) return;
                setError(err as Error);
                setIsReady(false);
            }
        }

        init();

        return () => {
            isMounted = false;
        };
    }, []);

    const value: CoreContextValue = {
        core,
        isReady,
        error,
    };

    return (
        <CoreContext.Provider value={value}>
            {children}
        </CoreContext.Provider>
    );
};

/**
 * useCore is a convenience hook for accessing the CoreApi instance.
 * It throws an error if used outside of CoreProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCore(): CoreContextValue {
    const ctx = useContext(CoreContext);
    if (!ctx) {
        throw new Error("useCore must be used inside a CoreProvider");
    }
    return ctx;
}
