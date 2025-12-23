import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCore } from "../../../app/providers/CoreProvider";
import type {
    Transaction,
    TransactionKind,
    CurrencyCode,
    AccountId,
} from "dericer-core";

const TRANSACTIONS_QUERY_KEY = ["transactions"];

export interface CreateTransactionInput {
    accountId: AccountId;
    kind: TransactionKind; // e.g. "income" | "expense" | "debt" | ...
    amountMinor: number;
    currency: CurrencyCode;
    date: string; // ISO date (YYYY-MM-DD)
    note?: string;
}

/**
 * useTransactions encapsulates:
 * - querying transactions via core.transactions.query(...)
 * - creating a new transaction via core.transactions.create(...)
 *
 * NOTE:
 * We call query with `undefined` filter and simple date sort for now.
 * Later we can extend this with real filters (account, date range, etc.).
 */
export function useTransactions() {
    const { core, isReady } = useCore();
    const queryClient = useQueryClient();

    const listQuery = useQuery<{
        transactions: Transaction[];
        totalCount: number;
        totalAmountMinor: number;
    }>({
        queryKey: TRANSACTIONS_QUERY_KEY,
        enabled: isReady && !!core,
        queryFn: async () => {
            if (!core) {
                throw new Error("Core is not initialized");
            }

            // Adjust this call to match your actual core API signature.
            const result = await core.transactions.query(
                undefined,
                { field: "date", direction: "desc" }
            );

            return result;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (input: CreateTransactionInput) => {
            if (!core) {
                throw new Error("Core is not initialized");
            }

            const created = await core.transactions.create(input);
            return created as Transaction;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
        },
    });

    return {
        listQuery,
        createTransaction: createMutation.mutateAsync,
        isCreating: createMutation.isPending,
    };
}
