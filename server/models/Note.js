import mongoose from "mongoose";

const schema = new mongoose.schema({
  title: "String",
  content: "String",

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export default mongoose.model("Note", schema);
