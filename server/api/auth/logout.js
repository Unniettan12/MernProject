const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
      secure: process.env.NODE_ENV === "prod",
    });
    res.status(200).json({ message: "User successfully logged out" });
  } catch (e) {
    res.status(400).json({ message: "Log out failure" });
  }
};

export default logout;
