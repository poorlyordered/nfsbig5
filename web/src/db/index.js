/* @ts-nocheck */
const { MongoClient, Db } = require('mongodb');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local in the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.DB_URL;
if (!url) {
  throw new Error(
    'Please define the DB_URL environment variable inside .env.local'
  );
}

const dbName = process.env.DB_NAME || 'results';

const mongoClient = new MongoClient(url);

let cachedDb = null;

/**
 * Connect to MongoDB and return the database instance.
 * @returns {Promise<import('mongodb').Db>}
 */
const connectToDatabase = async () => {
  if (cachedDb) return cachedDb;

  const client = await mongoClient.connect();
  const db = client.db(dbName);
  cachedDb = db;
  return db;
};

module.exports = {
  connectToDatabase
};
