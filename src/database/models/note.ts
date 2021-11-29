import mongoose from "mongoose";

export const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
    },
    checkList: {
      type: Array,
    },
    tags: {
      type: Array,
    },
  },
  { timestamps: true }
);
