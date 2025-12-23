import React, { useState, type FormEvent } from "react";
import { useAccounts } from "../hooks/useAccounts.ts";
import { useTransactions } from "../hooks/useTransactions";
import type { TransactionKind } from "dericer-core";

/**
 * Simple transaction creation form.
 * For now:
 * - you must select an account
 * - choose kind (income/expense)
 * - amount (minor units)
 * - date (YYYY-MM-DD)
 * - optional note
 */
export const TransactionForm: React.FC = () => {
    const { accountsQuery } = useAccounts();
    const { createTransaction, isCreating } = useTransactions();

    const [accountId, setAccountId] = useState<string>("");
    const [kind, setKind] = useState<TransactionKind>("expense" as TransactionKind);
    const [amount, setAmount] = useState<string>("0");
    const [date, setDate] = useState<string>(() => {
        // default to today's date in YYYY-MM-DD
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    });
    const [note, setNote] = useState<string>("");

    const [error, setError] = useState<string | null>(null);

    const accounts = accountsQuery.data ?? [];

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!accountId) {
            setError("Please select an account.");
            return;
        }

        const parsed = Number(amount);
        if (!Number.isFinite(parsed) || parsed <= 0) {
            setError("Amount must be a positive number.");
            return;
        }

        const minor = Math.round(parsed); // amountMinor is integer (minor units)

        const acc = accounts.find((a) => a.id === accountId);
        if (!acc) {
            setError("Selected account not found.");
            return;
        }

        try {
            await createTransaction({
                accountId: acc.id,
                kind,
                amountMinor: minor,
                currency: acc.currency,
                date,
                note: note.trim() || undefined,
            });

            setAmount("0");
            setNote("");
        } catch (err) {
            console.error("Failed to create transaction:", err);
            setError((err as Error).message);
        }
    };

    const isLoadingAccounts = accountsQuery.isLoading;

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
            <div className="font-medium mb-1">New transaction</div>

            <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    Account
                </label>
                <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    disabled={isLoadingAccounts || accounts.length === 0}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                    <option value="">
                        {accounts.length === 0
                            ? "No accounts - create one first"
                            : "Select an account"}
                    </option>
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                            {acc.name} ({acc.currency})
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    Kind
                </label>
                <select
                    value={kind}
                    onChange={(e) => setKind(e.target.value as TransactionKind)}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="debt">Debt</option>
                    <option value="receivable">Receivable</option>
                    <option value="transfer-out">Transfer out</option>
                    <option value="transfer-in">Transfer in</option>
                </select>
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    Amount (minor units)
                </label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
            </div>

            <div className="space-y-1">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
                    Note
                </label>
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Optional description..."
                />
            </div>

            {error && (
                <div className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isCreating || accounts.length === 0}
                className="inline-flex items-center rounded-md border border-slate-300 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-100 shadow-sm transition hover:bg-slate-800 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
            >
                {isCreating ? "Saving..." : "Save transaction"}
            </button>
        </form>
    );
};
