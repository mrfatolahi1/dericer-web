import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardPage } from "../pages/DashboardPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { SettingsPage } from "../pages/SettingsPage";

/**
 * Central place to declare all application routes.
 */
export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/settings" element={<SettingsPage />} />

            {/* Fallback: redirect any unknown path to the dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
