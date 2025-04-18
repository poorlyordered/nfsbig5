const { connectToDatabase } = require('./index');

async function queryDocuments() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    const db = await connectToDatabase();
    
    // Get the collection name from environment variable or use a default
    const collectionName = process.env.DB_COLLECTION || 'test_collection';
    
    // Get reference to the collection
    const collection = db.collection(collectionName);
    
    // Count total documents
    const totalCount = await collection.countDocuments();
    console.log(`Total documents in ${collectionName}: ${totalCount}`);
    
    if (totalCount === 0) {
      console.log('No documents found in the collection.');
      process.exit(0);
      return;
    }
    
    // Find all documents
    console.log('\n--- All Documents ---');
    const allDocuments = await collection.find({}).toArray();
    allDocuments.forEach((doc, index) => {
      console.log(`Document ${index + 1}:`);
      console.log(JSON.stringify(doc, null, 2));
    });
    
    // Find documents with a specific query
    console.log('\n--- Query by Email ---');
    const emailQuery = { email: 'test@example.com' };
    const emailResults = await collection.find(emailQuery).toArray();
    console.log(`Found ${emailResults.length} documents with email 'test@example.com'`);
    
    // Find documents with a more complex query
    console.log('\n--- Query by Metadata Source ---');
    const metadataQuery = { 'metadata.source': 'create-collection script' };
    const metadataResults = await collection.find(metadataQuery).toArray();
    console.log(`Found ${metadataResults.length} documents with metadata.source = 'create-collection script'`);
    
    // Demonstrate sorting
    console.log('\n--- Documents Sorted by Creation Date (Descending) ---');
    const sortedResults = await collection.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();
    
    sortedResults.forEach((doc, index) => {
      console.log(`Document ${index + 1} (Created: ${doc.createdAt}):`);
      console.log(`  Name: ${doc.name}, Email: ${doc.email}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

queryDocuments();