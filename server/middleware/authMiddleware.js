import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({
      code: "NO_TOKEN",
      message: "Authentication token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SUPER_SECRET);
    req.userId = decoded.id;

    next();
  } catch (err) {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(401).json({
      code: "INVALID_TOKEN",
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
