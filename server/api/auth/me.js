import User from "../../models/User.js";
import jwt from "jsonwebtoken";

const me = async (req, res) => {
  const token = req.cookies.jwt;
  console.log("token is ", token);
  if (!token) {
    return res
      .status(401)
      .json({ user: null, message: "Authentication failed" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SUPER_SECRET);
    console.log("decoded is ", decoded);
    const user = await User.findById(decoded.id);
    if (user) {
      res.status(200).json({ user: user._id });
    } else {
      res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: process.env.NODE_ENV === "prod" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "prod",
      });
      res.status(401).json({ user: null, message: "Authentication failed" });
    }
  } catch (err) {
    console.log();
    res.status(401).json({ user: null, message: "failed" });
  }
};

export default me;
