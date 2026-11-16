
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let memoryServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      if (process.env.NODE_ENV === "production") {
        throw new Error("MONGO_URI is required in production");
      }

      memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();

      console.log("Using in-memory MongoDB for local development");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB Connected Successfully");

  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
