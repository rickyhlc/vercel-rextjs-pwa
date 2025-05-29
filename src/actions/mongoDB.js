import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable.');
}

console.log("Connecting to MongoDB......");
let client = new MongoClient(uri, options);
let clientPromise = client.connect();


export default clientPromise;