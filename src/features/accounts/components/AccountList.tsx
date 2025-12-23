import React from "react";
import { useAccounts } from "../hooks/useAccounts";

/**
 * Simple account list that shows existing accounts.
 * Later we can extend this with balances, archive/delete actions, etc.
 */
export const AccountList: React.FC = () => {
    const { accountsQuery } = useAccounts();

    if (accountsQuery.isLoading) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                Loading accounts...
            </div>
        );
    }

    if (accountsQuery.isError) {
        return (
            <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800 shadow-sm dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                Failed to load accounts:{" "}
                {(accountsQuery.error as Error).message}
            </div>
        );
    }

    const accounts = accountsQuery.data ?? [];

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-2 font-medium">Accounts</div>
            {accounts.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                    No accounts yet. Create one using the form on the right.
                </div>
            ) : (
                <ul className="space-y-2">
                    {accounts.map((acc) => (
                        <li
                            key={acc.id}
                            className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900"
                        >
                            <div>
                                <div className="font-medium">{acc.name}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {acc.currency}
                                </div>
                            </div>
                            {/* Later we can show balance here once we wire balances API */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
