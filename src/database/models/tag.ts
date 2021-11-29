import mongoose from "mongoose";

export const tagSchema = new mongoose.Schema({
  name: {
    type: String,
  },
}, { timestamps: true });
