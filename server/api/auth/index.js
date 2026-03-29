import login from "./login.js";
import logout from "./logout.js";
import me from "./me.js";
import register from "./register.js";
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

export const maxAge = 3 * 24 * 60 * 60;
export const createToken = async (id) => {
  return jwt.sign({ id }, process.env.JWT_SUPER_SECRET, {
    expiresIn: maxAge,
  });
};

router.post("/login", login);
router.post("/register", register);
router.get("/me", me);
router.get("/logout", logout);

export default router;
