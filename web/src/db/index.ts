import { MongoClient, Db } from 'mongodb';

// Load environment variables from .env.local
// Note: Next.js automatically loads .env.local in the application,
// so this is only needed for standalone scripts

// Ensure DB_URL is defined
if (!process.env.DB_URL) {
  throw new Error(
    'Please define the DB_URL environment variable inside .env.local'
  );
}

const url: string = process.env.DB_URL;
const dbName = process.env.DB_NAME || 'results';

let client: MongoClient;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB and return the database instance.
 * @returns {Promise<Db>} The database instance
 */
export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb;

  if (!client) {
    client = new MongoClient(url);
    await client.connect();
  }

  const db = client.db(dbName);
  cachedDb = db;
  return db;
}

// For CommonJS compatibility (used by standalone scripts)
if (typeof module !== 'undefined') {
  module.exports = {
    connectToDatabase
  };
}