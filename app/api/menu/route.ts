import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection string
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/resto";
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const menuItem = await request.json();
    
    // Connect to MongoDB
    await client.connect();
    const database = client.db('resto');
    const collection = database.collection('menu');
    
    // Insert the new menu item
    const result = await collection.insertOne({
      name: menuItem.name,
      price: menuItem.price,
      category: menuItem.category,
      createdAt: new Date()
    });
    
    // Return the newly created item with the DB-generated ID
    return NextResponse.json({ 
      ...menuItem, 
      id: result.insertedId.toString() 
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/menu:', error);
    return NextResponse.json(
      { error: 'Failed to add menu item' },
      { status: 500 }
    );
  } finally {
    // Close the connection
    await client.close();
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db('resto');
    const collection = database.collection('menu');
    
    // Fetch all menu items
    const menuItems = await collection.find({}).toArray();
    
    // Transform MongoDB _id to id string for client-side use
    const formattedItems = menuItems.map(item => ({
      id: item._id.toString(),
      name: item.name,
      price: item.price,
      category: item.category
    }));
    
    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error('Error in GET /api/menu:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  } finally {
    // Close the connection
    await client.close();
  }
}