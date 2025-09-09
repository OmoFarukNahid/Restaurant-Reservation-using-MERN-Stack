import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 500
  },
  image: {
    type: String,
    default: ""
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

export const Recommendation = mongoose.model("Recommendation", recommendationSchema);