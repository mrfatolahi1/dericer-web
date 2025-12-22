import React, { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useTheme } from "../../app/providers/ThemeProvider";

/**
 * AppLayout provides the main shell of the application:
 * - Left sidebar with navigation
 * - Top header with page title and theme toggle
 * - Main content area where pages are rendered
 */
interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content column */}
            <div className="flex flex-1 flex-col">
                {/* Top header */}
                <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-slate-800 dark:bg-slate-950">
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">
                            Dericer
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Local-first personal finance
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme toggle button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                        >
                            Theme: {theme === "light" ? "Light" : "Dark"}
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto bg-slate-100 p-4 dark:bg-slate-900">
                    <div className="mx-auto max-w-5xl">{children}</div>
                </main>
            </div>
        </div>
    );
};
