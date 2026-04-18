import User from "../../models/User.js";
import { createToken, maxAge } from "./index.js";

// const handleErrors = (e) => {
//   let errors = { email: null, password: null, confirmPass: null };
//   console.log("e is", e.message);
//   if (e.message?.includes("validation failed")) {
//     Object.values(e.errors).forEach(({ properties }) => {
//       console.log("errorProp ", properties);
//       errors[properties.path] = properties.message;
//     });
//   }
//   if (e?.errorResponse?.code === 11000) {
//     errors.email = "User already exists.";
//   }
//   if (e.message.includes("Match error")) {
//     errors.confirmPass = "Passwords do not match";
//   }

//   return errors;
// };

const login = async (req, res) => {
  const { email, password } = req.body;
  res.cookie("logginInDetected", true);
  try {
    const user = await User.login(email, password);
    console.log("user is ", user);

    if (user) {
      const token = await createToken(user._id);
      console.log("token  is ", token);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: maxAge * 1000,
        sameSite: process.env.NODE_ENV === "prod" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "prod",
      });
      res.status(200).json({ user: user._id });
    }
    // throw error
    // console.log("Requst is ", user);
  } catch (e) {
    // const errors = handleErrors(e);
    console.log("error is ", e);
    let errors = { email: null, password: null };
    if (e?.message.includes("Incorrect password")) {
      errors.password = "Incorrect password";
    }
    if (e?.message.includes("Incorrect email")) {
      errors.email = "Incorrect email";
    }
    res.status(400).json(errors);
  }
  // res.send({
  //   user: { id: "1", email: "test@test.com", name: "John Doe" },
  //   // jwt: "fakeAssB",
  // });
};

export default login;
