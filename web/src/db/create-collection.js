const { connectToDatabase } = require('./index');

async function createCollection() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const db = await connectToDatabase();
    
    // Get the collection name from environment variable or use a default
    const collectionName = process.env.DB_COLLECTION || 'test_collection';
    
    console.log(`Creating collection: ${collectionName}`);
    
    // Check if collection exists
    const collections = await db.collections();
    const collectionExists = collections.some(c => c.collectionName === collectionName);
    
    if (collectionExists) {
      console.log(`Collection '${collectionName}' already exists.`);
    } else {
      // Create the collection
      await db.createCollection(collectionName);
      console.log(`Collection '${collectionName}' created successfully.`);
    }
    
    // Get reference to the collection
    const collection = db.collection(collectionName);
    
    // Insert a sample document
    const sampleDocument = {
      name: 'Test User',
      email: 'test@example.com',
      createdAt: new Date(),
      metadata: {
        source: 'create-collection script',
        version: '1.0'
      }
    };
    
    const result = await collection.insertOne(sampleDocument);
    console.log(`Document inserted with _id: ${result.insertedId}`);
    
    // Fetch and display all documents in the collection
    const documents = await collection.find({}).toArray();
    console.log(`Total documents in collection: ${documents.length}`);
    console.log('Sample of documents:');
    console.log(documents.slice(0, 3));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createCollection();