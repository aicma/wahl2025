import type { ResultRow } from "@/schema/kerg2";

const DB_NAME = "csv-import-db";
const META_KEY = "csv-import-db-meta";

interface DbMeta {
  version: number;
  stores: string[];
}

function getMeta(): DbMeta {
  try {
    const raw = localStorage.getItem(META_KEY);
    if (raw) return JSON.parse(raw) as DbMeta;
  } catch {
    // fall through
  }
  return { version: 1, stores: [] };
}

/** Deterministic object store name derived from a source URL. */
function storeSlug(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = ((hash << 5) - hash + url.charCodeAt(i)) | 0;
  }
  return `csv_${Math.abs(hash).toString(36)}`;
}

function openDb(requiredStores: string[] = []): Promise<IDBDatabase> {
  if (!window.indexedDB) {
    return Promise.reject(
      new Error("IndexedDB is unavailable in this browser."),
    );
  }
  const meta = getMeta();
  const newStores = requiredStores.filter((s) => !meta.stores.includes(s));
  if (newStores.length > 0) {
    meta.stores.push(...newStores);
    meta.version += 1;
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, meta.version);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      for (const store of meta.stores) {
        if (!db.objectStoreNames.contains(store)) {
          db.createObjectStore(store, { autoIncrement: true });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(req.error ?? new Error("Failed to open IndexedDB."));
    req.onblocked = () =>
      reject(
        new Error("IndexedDB upgrade blocked by another open connection."),
      );
  });
}

export async function storeRecords(
  sourceUrl: string,
  records: ResultRow[],
): Promise<void> {
  if (!window.indexedDB) {
    throw new Error("IndexedDB is unavailable in this browser.");
  }
  const slug = storeSlug(sourceUrl);
  const db = await openDb([slug]);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(slug, "readwrite");
    const store = tx.objectStore(slug);
    const clearReq = store.clear();
    clearReq.onerror = () => {
      tx.abort();
      reject(clearReq.error ?? new Error("Failed to clear object store."));
    };
    clearReq.onsuccess = () => {
      for (const record of records) {
        store.add(record);
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error ?? new Error("IndexedDB transaction failed."));
    };
  });
}

export async function queryRecords(
  sourceUrl: string,
): Promise<ResultRow[]> {
  if (!window.indexedDB) {
    throw new Error("IndexedDB is unavailable in this browser.");
  }
  const slug = storeSlug(sourceUrl);
  const meta = getMeta();
  if (!meta.stores.includes(slug)) {
    return [];
  }
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(slug, "readonly");
    const store = tx.objectStore(slug);
    const req = store.getAll();
    req.onsuccess = () => {
      db.close();
      resolve(req.result as ResultRow[]);
    };
    req.onerror = () => {
      db.close();
      reject(
        req.error ?? new Error("Failed to read records from IndexedDB."),
      );
    };
  });
}

export interface GebietOption {
  /** Composite key: `Gebietsart+Gebietsnummer`, e.g. "Wahlkreis11" */
  key: string;
  gebietsnummer: number;
  gebietsname: string;
  gebietsart: string;
}

export async function queryGebietResults(
  sourceUrl: string,
  gebietKey: string,
): Promise<ResultRow[]> {
  const rows = await queryRecords(sourceUrl);
  return rows.filter(
    (row) =>
      `${row["Gebietsart"]}${row["Gebietsnummer"]}` === gebietKey
  );
}

/**
 * Returns deduplicated Gebiet options from stored records.
 * Loads all rows from IDB but only returns the unique identity tuples —
 * keeping React state lightweight for the autocomplete.
 */
export async function queryGebietOptions(
  sourceUrl: string,
): Promise<GebietOption[]> {
  const rows = await queryRecords(sourceUrl);
  const seen = new Set<string>();
  const options: GebietOption[] = [];
  for (const row of rows) {
    const key = `${row["Gebietsart"]}${row["Gebietsnummer"]}`;
    if (!seen.has(key)) {
      seen.add(key);
      options.push({
        key,
        gebietsnummer: row["Gebietsnummer"],
        gebietsname: row["Gebietsname"],
        gebietsart: row["Gebietsart"],
      });
    }
  }
  return options;
}
