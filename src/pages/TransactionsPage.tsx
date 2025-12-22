import React from "react";

/**
 * TransactionsPage will use the core API to:
 * - list transactions with filters and sorting
 * - provide a form to create new transactions
 *
 * For now it is just a placeholder layout.
 */
export const TransactionsPage: React.FC = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Transactions</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Here you will be able to browse, filter, and create transactions.
            </p>

            <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
                {/* Placeholder for table */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="font-medium mb-2">Transactions list</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        Table placeholder – will be replaced with a real data table.
                    </div>
                </div>

                {/* Placeholder for form */}
                <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                    <div className="font-medium mb-2">New transaction</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        Form placeholder – will be replaced with a real form connected to
                        the core.
                    </div>
                </div>
            </div>
        </section>
    );
};
