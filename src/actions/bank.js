"use server";

import clientPromise from '@/lib/mongoDB';

export const getCosts = async (options) => {
  try {
    const client = await clientPromise;
    const db = client.db("bank");
    const collection = db.collection("cost");
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}

export const saveCosts = async (options) => {
  try {
    const client = await clientPromise;
    const db = client.db("bank");
    const collection = db.collection("cost");
    return await collection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}