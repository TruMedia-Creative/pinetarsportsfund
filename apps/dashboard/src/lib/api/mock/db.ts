import localforage from "localforage";

const mockDb = localforage.createInstance({
  name: "pinetar-sports-fund",
  storeName: "mock_api",
  description: "Persistent mock API storage for local-first development",
});

export async function dbGet<T>(key: string): Promise<T | undefined> {
  const value = await mockDb.getItem<T>(key);
  return value ?? undefined;
}

export async function dbSet<T>(key: string, value: T): Promise<void> {
  await mockDb.setItem(key, value);
}

/**
 * One-time migration path from old localStorage keys to IndexedDB.
 */
export async function migrateLocalStorageToDb<T>(
  key: string,
): Promise<T | undefined> {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return undefined;

    const parsed = JSON.parse(stored) as T;
    await dbSet(key, parsed);
    window.localStorage.removeItem(key);
    return parsed;
  } catch {
    return undefined;
  }
}
