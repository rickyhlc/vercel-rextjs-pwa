// this file is not used, replaced by server function

import clientPromise from '@/lib/mongoDB';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bank");
    const collection = db.collection("cost");
    
    const costs = await collection.find({}).toArray();
    return Response.json(costs); // return new NextResponse.json(costs); <-- doesn't work
  } catch (error) {
    console.error("Error fetching costs:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}