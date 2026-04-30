import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 20,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [String],
  },
  { timeStamps: true },
);
schema.index({ title: "text", content: "text" });
export default mongoose.model("Note", schema);
