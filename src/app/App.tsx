import React from "react";
import { AppRoutes } from "./routes.tsx";
import { AppLayout } from "../components/layout/AppLayout";

/**
 * App is the top-level component for the UI.
 * It wires the global layout (sidebar, header, content) with the router.
 */
const App: React.FC = () => {
    return (
        <AppLayout>
            <AppRoutes />
        </AppLayout>
    );
};

export default App;
