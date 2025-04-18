const { connectToDatabase } = require('./index');

async function testMongoConnection() {
  try {
    const db = await connectToDatabase();
    const collections = await db.collections();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('Available collections:', collections.map(c => c.collectionName));
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:', error);
    process.exit(1);
  }
}

testMongoConnection();