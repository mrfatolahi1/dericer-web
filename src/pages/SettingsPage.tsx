import React from "react";

/**
 * SettingsPage will host:
 * - backup/export & import/restore actions
 * - possibly other configuration (e.g. default currency)
 */
export const SettingsPage: React.FC = () => {
    return (
        <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Settings</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
                Application settings and data management will be available here.
            </p>

            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="font-medium mb-2">Backup &amp; export</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                    In a later step, this section will let you export all data as JSON/ZIP
                    and import it back.
                </div>
            </div>
        </section>
    );
};
