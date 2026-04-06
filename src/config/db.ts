import mongoose from "mongoose";
import { serverConfig } from ".";

export function connectDB(){
    const MONGO_URI = serverConfig.MONGO_URI;
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log(`Connected to MongoDB at ${MONGO_URI}`);
    })
    .catch((err) => {
        console.error(`Failed to connect to MongoDB at ${MONGO_URI}:`, err);
        process.exit(1); // Exit the process with an error code
    });
}