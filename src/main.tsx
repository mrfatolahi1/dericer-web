import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./styles/app/App";
import { ThemeProvider } from "./styles/app/providers/ThemeProvider";
import { QueryProvider } from "./styles/app/providers/QueryProvider";

// Import global Tailwind styles
import "./styles/globals.css";

/**
 * Entry point of the React application.
 * We wrap the app with:
 * - BrowserRouter: for client-side routing
 * - ThemeProvider: for light/dark theme handling
 * - QueryProvider: for React Query (async data) setup
 */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <QueryProvider>
                    <App />
                </QueryProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
