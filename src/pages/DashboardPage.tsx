import React, { useEffect, useState } from "react";
import { useCore } from "../app/providers/CoreProvider";

/**
 * DashboardPage will eventually show:
 * - account balances
 * - per-currency totals
 * - a few key charts
 *
 * For now, we only show the number of accounts to prove that
 * the core + IndexedDB wiring works.
 */
export const DashboardPage: React.FC = () => {
    const { core, isReady, error } = useCore();
    const [accountCount, setAccountCount] = useState<number | null>(null);

    useEffect(() => {
        if (!core || !isReady) return;

        let isCancelled = false;

        async function load() {
            try {
                const accounts = await core.accounts.listAll();
                if (!isCancelled) {
                    setAccountCount(accounts.length);
                }
            } catch (err) {
                console.error("Failed to load accounts in DashboardPage:", err);
                if (!isCancelled) {
                    setAccountCount(null);
                }
            }
        }

        load();

        return () => {
            isCancelled = true;
        };
    }, [core, isReady]);

    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Dashboard</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Quick overview of your Dericer data.
            </p>

            {error && (
                <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                    Failed to initialize core: {error.message}
                </div>
            )}

            {!error && !isReady && (
                <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                    Initializing core…
                </div>
            )}

            {isReady && !error && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="font-medium">Total accounts</div>
                        <div className="mt-2 text-2xl font-semibold">
                            {accountCount === null ? "—" : accountCount}
                        </div>
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
            )}
        </section>
    );
};
