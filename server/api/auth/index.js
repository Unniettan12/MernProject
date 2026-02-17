import login from "./login.js";
import logout from "./logout.js";
import me from "./me.js";
import register from "./register.js";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", me);
router.get("/logout", logout);

export default router;
