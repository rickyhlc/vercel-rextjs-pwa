import clientPromise from '@/actions/mongoDB';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bank");
    const collection = db.collection("cost");
    
    const costs = await collection.find({}).toArray();
    return new NextResponse(JSON.stringify(costs));
    return new NextResponse.json(costs); // this doesn't work, wait for fix/workaround
  } catch (error) {
    console.error("Error fetching costs:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}