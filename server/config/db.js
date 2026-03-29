import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "node-auth",
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // console.log(conn.connection);
  } catch (error) {
    console.error("Mongo connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
