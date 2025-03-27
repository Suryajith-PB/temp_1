import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const reservationData = await request.json();
    
    // Add server-side timestamp
    const reservationWithTimestamp = {
      ...reservationData,
      createdAt: new Date(),
      status: "confirmed"
    };

    // Connect to MongoDB and save the reservation
    const { client, db } = await connectToDatabase();
    await db.collection("reservations").insertOne(reservationWithTimestamp);
    
    return NextResponse.json({ success: true, message: "Reservation created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Failed to create reservation:", error);
    return NextResponse.json({ success: false, message: "Failed to create reservation" }, { status: 500 });
  }
}
