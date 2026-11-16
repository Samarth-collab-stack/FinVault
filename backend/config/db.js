const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      const memoryServer = await MongoMemoryServer.create();
      mongoUri = memoryServer.getUri();
      console.log("Using in-memory MongoDB for local development");
    }

    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;