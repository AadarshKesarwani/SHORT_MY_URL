import mongoose, { Document,Schema } from "mongoose";

// Define the IUrl interface that extends Document
// This interface represents the structure of a URL document in MongoDB
// It includes the original URL, the shortened URL, the number of clicks, and timestamps for creation and updates

//example of the IUrl interface
export interface IUrl extends Document {
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    createdAt: Date;
    updatedAt: Date;
}



// Define the Mongoose schema for the URL model
// The schema includes fields for the original URL, the shortened URL, and the number of clicks
const urlSchema = new Schema<IUrl>({
    originalUrl: { type: String, required: true },
    shortUrl: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
}); 


export const Url = mongoose.model<IUrl>('Url', urlSchema);

