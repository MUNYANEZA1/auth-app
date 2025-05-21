// This file handles the MongoDB connection and provides a function to get the database instance.
import { MongoClient } from 'mongodb';

// Check if we have a MongoDB URI in the environment variables
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Get the MongoDB URI from the environment variables
const uri = process.env.MONGODB_URI;
// Set a default database name if not specified in the URI
const options = {};

// Create a variable to cache the MongoDB client connection
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// In development mode, use a global variable to preserve the value across module reloads
if (process.env.NODE_ENV === "development") {
  // In development mode, use a gloabal variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a separate module, the client can be shared across functions.
export default clientPromise;