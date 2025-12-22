import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import { ThemeProvider } from "./app/providers/ThemeProvider";
import { QueryProvider } from "./app/providers/QueryProvider";
import { CoreProvider } from "./app/providers/CoreProvider";

import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <QueryProvider>
                    <CoreProvider>
                        <App />
                    </CoreProvider>
                </QueryProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
