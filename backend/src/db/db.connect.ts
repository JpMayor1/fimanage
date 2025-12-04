import mongoose from "mongoose";

export default async function initDB() {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI!);
    console.log("✅ Connected to MongoDB");
    
    // Handle MongoDB connection errors after initial connection
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      // Don't exit, try to reconnect
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
      // Mongoose will automatically try to reconnect
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (err) {
    console.error("❌ MongoDB initial connection error:", err);
    // Don't exit, server can still run and retry
    // Mongoose will automatically retry connection
  }
}
