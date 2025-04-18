# MongoDB Integration

This directory contains utilities for connecting to MongoDB Atlas and performing common database operations.

## Configuration

The MongoDB connection is configured using environment variables in the `.env.local` file at the project root:

```
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=your_database_name
DB_COLLECTION=your_collection_name
```

## Utility Files

### index.js

The main connection module that handles connecting to MongoDB Atlas. It uses the `dotenv` package to load environment variables from `.env.local`.

```javascript
const { connectToDatabase } = require('./index');

// Example usage
async function example() {
  const db = await connectToDatabase();
  // Use db to perform operations
}
```

### test-connection.js

A simple script to test the MongoDB connection and list available collections.

```bash
node src/db/test-connection.js
```

### create-collection.js

A utility script to create a collection and insert a sample document.

```bash
node src/db/create-collection.js
```

### query-documents.js

A utility script to demonstrate querying documents from a collection.

```bash
node src/db/query-documents.js
```

## Usage in Next.js Application

To use MongoDB in your Next.js application, import the `connectToDatabase` function:

```javascript
import { connectToDatabase } from '@/db';

export async function getServerSideProps() {
  const db = await connectToDatabase();
  const collection = db.collection('your_collection');
  const data = await collection.find({}).toArray();
  
  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  };
}
```

## Common MongoDB Operations

### Insert a Document

```javascript
const collection = db.collection('your_collection');
await collection.insertOne({ name: 'John', email: 'john@example.com' });
```

### Find Documents

```javascript
// Find all documents
const allDocs = await collection.find({}).toArray();

// Find with a filter
const filteredDocs = await collection.find({ name: 'John' }).toArray();

// Find one document
const doc = await collection.findOne({ _id: ObjectId('document_id') });
```

### Update Documents

```javascript
// Update one document
await collection.updateOne(
  { name: 'John' },
  { $set: { email: 'new-email@example.com' } }
);

// Update multiple documents
await collection.updateMany(
  { active: false },
  { $set: { archived: true } }
);
```

### Delete Documents

```javascript
// Delete one document
await collection.deleteOne({ _id: ObjectId('document_id') });

// Delete multiple documents
await collection.deleteMany({ archived: true });
```

### Aggregation

```javascript
const results = await collection.aggregate([
  { $match: { active: true } },
  { $group: { _id: '$category', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]).toArray();
```

## Error Handling

Always use try/catch blocks when working with MongoDB to handle potential errors:

```javascript
try {
  const db = await connectToDatabase();
  // Perform operations
} catch (error) {
  console.error('Database error:', error);
  // Handle error appropriately
}