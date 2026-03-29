import User from "../../models/User.js";

const me = async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SUPER_SECRET);

    const user = await User.findById(decoded.id);

    res.status(200).json({ user });
  } catch (err) {
    res.status(401).json({ user: null });
  }
};

export default me;
