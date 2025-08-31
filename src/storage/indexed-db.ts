import { openDB, IDBPDatabase } from 'idb';
import type { Document } from '@/types';

export const DB_NAME = 'dcs-documents';
const STORE_NAME = 'documents';

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveDocument(doc: Document): Promise<void> {
  const db = await getDB();
  await db.put(STORE_NAME, doc);
}

export async function getDocument(id: string): Promise<Document | undefined> {
  const db = await getDB();
  return db.get(STORE_NAME, id);
}

export async function listDocuments(): Promise<Document[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
