import React from "react";

/**
 * DashboardPage will eventually show:
 * - account balances
 * - per-currency totals
 * - a few key charts (e.g. income vs expenses)
 *
 * For now we keep it as a simple placeholder.
 */
export const DashboardPage: React.FC = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Welcome to Dericer. This dashboard will show a quick summary of your
                accounts, balances, and recent activity.
            </p>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="font-medium">Total accounts</div>
                    <div className="mt-2 text-2xl font-semibold">–</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="font-medium">Total currencies</div>
                    <div className="mt-2 text-2xl font-semibold">–</div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="font-medium">This month balance</div>
                    <div className="mt-2 text-2xl font-semibold">–</div>
                </div>
            </div>
        </section>
    );
};
