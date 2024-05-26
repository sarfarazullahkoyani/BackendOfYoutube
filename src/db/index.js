import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectoinInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    // console.log(connectoinInstance);
    // mongoose always gives return object
    console.log(`\n MongoDB connected!! DB Host: ${connectoinInstance}`);
  } catch (error) {
    console.log("mongoDB connection error ", error);
    process.exit(1);
  }
};

export default connectDB;
