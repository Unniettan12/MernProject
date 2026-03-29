import mongoose from "mongoose";
import bcrypt from "bcrypt";

const schema = new mongoose.Schema({
  //   username: {
  //     type: String,
  //     unique: true,
  //   },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be at least 8 characters long"],
    maxLength: [16, "Password must be at most 16 characters long"],
  },
});

// schema.pre("validate", function (next) {
//   if (!this.email && !this.username) {
//     this.invalidate("email", "Email or username is required");
//   }
//   next();
// });

schema.pre("save", async function () {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  // next();
});

schema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    console.log("auth is", auth);
    if (auth) {
      return user;
    }
    throw new Error("Incorrect password");
  }
  throw new Error("Incorrect email");
};

export default mongoose.model("User", schema);
