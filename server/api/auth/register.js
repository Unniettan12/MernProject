import User from "../../models/User.js";
import { createToken, maxAge } from "./index.js";

const handleErrors = (e) => {
  let errors = { email: null, password: null, confirmPass: null };
  console.log("e is", e.message);
  if (e.message?.includes("validation failed")) {
    Object.values(e.errors).forEach(({ properties }) => {
      console.log("errorProp ", properties);
      errors[properties.path] = properties.message;
    });
  }
  if (e?.errorResponse?.code === 11000) {
    errors.email = "User already exists.";
  }
  if (e.message.includes("Match error")) {
    errors.confirmPass = "Passwords do not match";
  }

  return errors;
};

const register = async (req, res) => {
  // console.log("request is ", req);
  const { email, password, confirmPass } = req.body;
  console.log("req is ", req?.body, "aa" === "aa");
  try {
    if (confirmPass !== password) {
      throw new Error("Match error : Passwords do not match");
    }
    const user = await User.create({ email, password });
    console.log("user inside is ", user);
    const token = await createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
      sameSite: process.env.NODE_ENV === "prod" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "prod",
    });
    res.status(200).json({ user: user._id });
  } catch (e) {
    const errors = handleErrors(e);
    console.log("error is ", errors);
    res.status(400).json(errors);
  }
};

export default register;
