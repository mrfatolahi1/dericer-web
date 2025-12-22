/**
 * IndexedDB-based implementation of Dericer's StoragePort.
 *
 * This adapter persists core entities in the browser:
 * - accounts
 * - transactions
 * - categories
 * - budgets
 * - goals
 * - currencyConfigs
 *
 * Each entity type is stored in its own object store, similar in spirit to
 * separate JSON files in the Node/desktop adapter.
 */

import type {
    StoragePort,
    Account,
    Transaction,
    Category,
    Budget,
    Goal,
    CurrencyConfig,
    AccountId,
    TransactionId,
    CategoryId,
    BudgetId,
    GoalId,
} from "dericer-core";

// Database configuration
const DB_NAME = "dericer-db";
const DB_VERSION = 1;

// Object store names
const STORE_ACCOUNTS = "accounts";
const STORE_TRANSACTIONS = "transactions";
const STORE_CATEGORIES = "categories";
const STORE_BUDGETS = "budgets";
const STORE_GOALS = "goals";
const STORE_CURRENCY_CONFIGS = "currency-configs";

type StoreName =
    | typeof STORE_ACCOUNTS
    | typeof STORE_TRANSACTIONS
    | typeof STORE_CATEGORIES
    | typeof STORE_BUDGETS
    | typeof STORE_GOALS
    | typeof STORE_CURRENCY_CONFIGS;

/**
 * Open (or create) the IndexedDB database.
 * Wraps the IndexedDB callback API in a Promise.
 */
async function openDatabase(): Promise<IDBDatabase> {
    if (typeof indexedDB === "undefined") {
        throw new Error("IndexedDB is not available in this environment.");
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;

            if (!db.objectStoreNames.contains(STORE_ACCOUNTS)) {
                db.createObjectStore(STORE_ACCOUNTS, { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains(STORE_TRANSACTIONS)) {
                db.createObjectStore(STORE_TRANSACTIONS, { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains(STORE_CATEGORIES)) {
                db.createObjectStore(STORE_CATEGORIES, { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains(STORE_BUDGETS)) {
                db.createObjectStore(STORE_BUDGETS, { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains(STORE_GOALS)) {
                db.createObjectStore(STORE_GOALS, { keyPath: "id" });
            }

            if (!db.objectStoreNames.contains(STORE_CURRENCY_CONFIGS)) {
                db.createObjectStore(STORE_CURRENCY_CONFIGS, { keyPath: "currency" });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error ?? new Error("Failed to open IndexedDB"));
        };
    });
}

/**
 * Run a readonly transaction on a given store and wrap a request in a Promise.
 */
async function withReadonlyStore<T>(
    dbPromise: Promise<IDBDatabase>,
    storeName: StoreName,
    operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
    const db = await dbPromise;

    return new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);

        const request = operation(store);

        request.onsuccess = () => {
            resolve(request.result as T);
        };

        request.onerror = () => {
            reject(request.error ?? new Error("IndexedDB readonly operation failed"));
        };
    });
}

/**
 * Run a readwrite transaction on a given store and wrap a request in a Promise.
 */
async function withWriteStore<T>(
    dbPromise: Promise<IDBDatabase>,
    storeName: StoreName,
    operation: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
    const db = await dbPromise;

    return new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);

        const request = operation(store);

        request.onsuccess = () => {
            resolve(request.result as T);
        };

        request.onerror = () => {
            reject(request.error ?? new Error("IndexedDB write operation failed"));
        };
    });
}

/**
 * Read all records from a given store as an array.
 */
async function getAllFromStore<T>(
    dbPromise: Promise<IDBDatabase>,
    storeName: StoreName
): Promise<T[]> {
    return withReadonlyStore<T[]>(
        dbPromise,
        storeName,
        (store) => store.getAll()
    );
}

/**
 * Read a single record by its primary key from a given store.
 */
async function getByIdFromStore<T>(
    dbPromise: Promise<IDBDatabase>,
    storeName: StoreName,
    id: IDBValidKey
): Promise<T | undefined> {
    const result = await withReadonlyStore<T | undefined>(
        dbPromise,
        storeName,
        (store) => store.get(id)
    );
    return result as T | undefined;
}

/**
 * IndexedDbStorage implements the StoragePort interface using IndexedDB.
 */
class IndexedDbStorage implements StoragePort {
    private readonly dbPromise: Promise<IDBDatabase>;

    constructor(dbPromise: Promise<IDBDatabase>) {
        this.dbPromise = dbPromise;
    }


    async loadAllAccounts(): Promise<Account[]> {
        return getAllFromStore<Account>(this.dbPromise, STORE_ACCOUNTS);
    }

    async saveAccount(account: Account): Promise<void> {
        await withWriteStore(this.dbPromise, STORE_ACCOUNTS, (store) =>
            store.put(account)
        );
    }

    async getAccountById(id: AccountId): Promise<Account | undefined> {
        return getByIdFromStore<Account>(this.dbPromise, STORE_ACCOUNTS, id);
    }


    async loadAllTransactions(): Promise<Transaction[]> {
        return getAllFromStore<Transaction>(this.dbPromise, STORE_TRANSACTIONS);
    }

    async saveTransaction(transaction: Transaction): Promise<void> {
        await withWriteStore(this.dbPromise, STORE_TRANSACTIONS, (store) =>
            store.put(transaction)
        );
    }

    async getTransactionById(
        id: TransactionId
    ): Promise<Transaction | undefined> {
        return getByIdFromStore<Transaction>(
            this.dbPromise,
            STORE_TRANSACTIONS,
            id
        );
    }

    async loadAllCategories(): Promise<Category[]> {
        return getAllFromStore<Category>(this.dbPromise, STORE_CATEGORIES);
    }

    async saveCategory(category: Category): Promise<void> {
        await withWriteStore(this.dbPromise, STORE_CATEGORIES, (store) =>
            store.put(category)
        );
    }

    async getCategoryById(id: CategoryId): Promise<Category | undefined> {
        return getByIdFromStore<Category>(this.dbPromise, STORE_CATEGORIES, id);
    }

    async loadAllBudgets(): Promise<Budget[]> {
        return getAllFromStore<Budget>(this.dbPromise, STORE_BUDGETS);
    }

    async saveBudget(budget: Budget): Promise<void> {
        await withWriteStore(this.dbPromise, STORE_BUDGETS, (store) =>
            store.put(budget)
        );
    }

    async getBudgetById(id: BudgetId): Promise<Budget | undefined> {
        return getByIdFromStore<Budget>(this.dbPromise, STORE_BUDGETS, id);
    }

    async loadAllGoals(): Promise<Goal[]> {
        return getAllFromStore<Goal>(this.dbPromise, STORE_GOALS);
    }

    async saveGoal(goal: Goal): Promise<void> {
        await withWriteStore(this.dbPromise, STORE_GOALS, (store) =>
            store.put(goal)
        );
    }

    async getGoalById(id: GoalId): Promise<Goal | undefined> {
        return getByIdFromStore<Goal>(this.dbPromise, STORE_GOALS, id);
    }

    async loadCurrencyConfigs(): Promise<CurrencyConfig[]> {
        return getAllFromStore<CurrencyConfig>(
            this.dbPromise,
            STORE_CURRENCY_CONFIGS
        );
    }

    async saveCurrencyConfigs(configs: CurrencyConfig[]): Promise<void> {
        const db = await this.dbPromise;

        await new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_CURRENCY_CONFIGS, "readwrite");
            const store = tx.objectStore(STORE_CURRENCY_CONFIGS);

            const clearReq = store.clear();
            clearReq.onerror = () => {
                reject(
                    clearReq.error ??
                    new Error("Failed to clear currency configs object store")
                );
            };

            clearReq.onsuccess = () => {
                for (const cfg of configs) {
                    store.put(cfg);
                }
            };

            tx.oncomplete = () => resolve();
            tx.onerror = () =>
                reject(
                    tx.error ??
                    new Error("Transaction error while saving currency configs")
                );
        });
    }
}

/**
 * Factory function that creates an IndexedDbStorage instance.
 * This is async because opening the database is async.
 */
export async function createIndexedDbStorage(): Promise<StoragePort> {
    const dbPromise = openDatabase();
    return new IndexedDbStorage(dbPromise);
}
