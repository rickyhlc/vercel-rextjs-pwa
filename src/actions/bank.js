"use server";

import clientPromise from '@/lib/mongoDB';
import { auth } from "@/lib/authConfig";

const getUserAndCollection = async () => {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return { error: 'Unauthorized' };
  }
  const client = await clientPromise;
  const db = client.db("bank");
  const collection = db.collection("cost");
  return { email, collection };
}

export const checkHasBackup = async () => {
  try {
    const { email, collection, error } = await getUserAndCollection();
    if (error) {
      return { error };
    } else {
      return await collection.findOne({ email }, { projection: { _id: 0, date: 1 } });
    }
  } catch (error) {
    console.error("Error checking costs:", error);
    return { error: 'Internal Server Error' };
  }
}

export const getCosts = async (options) => {
  try {
    const { email, collection, error } = await getUserAndCollection();
    if (error) {
      return { error };
    } else {
      return await collection.findOne({ email }, { projection: { _id: 0, data: 1 } });
    }
  } catch (error) {
    console.error("Error fetching costs:", error);
    return { error: 'Internal Server Error' };
  }
}

export const saveCosts = async (costs) => {
  try {
    const { email, collection, error } = await getUserAndCollection();
    if (error) {
      return { error };
    } else {
      const backupDate = new Date().getTime();
      const res = await collection.updateOne(
        { email },
        { $set: 
          {
            date: backupDate,
            data: costs
          }
        },
        { upsert: true }
      );
      console.log("~~~~~~~~~~~~~~~~~~~", res);
      return res.acknowledged ? { success: true, date: backupDate } : { error: 'Failed to save costs' };
    }
  } catch (error) {
    console.error("Error saving costs:", error);
    return { error: 'Internal Server Error' };
  }
}