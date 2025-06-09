import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISummary extends Document {
  text: string;
  summary: string;
  userId: Types.ObjectId;
}

const SummarySchema = new Schema({
  text: { type: String, required: true },
  summary: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

export default mongoose.model<ISummary>("Summary", SummarySchema);
