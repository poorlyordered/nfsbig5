import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../db';

/**
 * Example API route that demonstrates MongoDB integration
 * GET /api/mongodb-example - Returns all documents from the collection
 * POST /api/mongodb-example - Inserts a new document into the collection
 */
export async function GET() {
  try {
    const db = await connectToDatabase();
    const collectionName = process.env.DB_COLLECTION || 'test_collection';
    const collection = db.collection(collectionName);
    
    // Get all documents from the collection
    const documents = await collection.find({}).toArray();
    
    // Return the documents as JSON
    return NextResponse.json({ 
      success: true, 
      count: documents.length,
      data: documents 
    });
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data from MongoDB' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Request body is required' },
        { status: 400 }
      );
    }
    
    // Connect to the database
    const db = await connectToDatabase();
    const collectionName = process.env.DB_COLLECTION || 'test_collection';
    const collection = db.collection(collectionName);
    
    // Add timestamp to the document
    const documentToInsert = {
      ...body,
      createdAt: new Date()
    };
    
    // Insert the document
    const result = await collection.insertOne(documentToInsert);
    
    // Return the result
    return NextResponse.json({ 
      success: true, 
      message: 'Document inserted successfully',
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to insert document into MongoDB' },
      { status: 500 }
    );
  }
}