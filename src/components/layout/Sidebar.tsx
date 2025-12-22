import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Simple navigation item with active state styling.
 */
const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive
                        ? "bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900"
                        : "text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")
            }
        >
            {label}
        </NavLink>
    );
};

/**
 * Sidebar shows the main navigation links for the app.
 */
export const Sidebar: React.FC = () => {
    return (
        <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
            <div className="px-4 py-4">
                <div className="text-lg font-semibold tracking-tight">
                    Dericer
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Personal finance core UI
                </div>
            </div>

            <nav className="mt-4 flex-1 space-y-1 px-2">
                <NavItem to="/" label="Dashboard" />
                <NavItem to="/transactions" label="Transactions" />
                {/* Future: Budgets, Goals, Reports, etc. */}
                <NavItem to="/settings" label="Settings" />
            </nav>

            <div className="px-4 py-3 text-xs text-slate-400 dark:text-slate-500">
                v0.1.0 (web)
            </div>
        </aside>
    );
};
