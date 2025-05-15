// File: lib/db.js
import mongoose from "mongoose";

// Cache the mongoose connection to reuse it across requests
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to MongoDB
export async function connectToDatabase() {
  // If connection is already established, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is not established, create a new one
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Store the connection promise to avoid multiple connections
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  // Wait for the connection and return it
  cached.conn = await cached.promise;
  return cached.conn;
}
// This code defines a function to connect to a MongoDB database using Mongoose. It caches the connection to avoid creating multiple connections during the lifecycle of the application. The connection URI is stored in an environment variable for security and flexibility.
// The function checks if a connection already exists and reuses it if available. If not, it creates a new connection and stores the promise to ensure that only one connection is established at a time. This approach improves performance and resource management in a serverless environment like Next.js.