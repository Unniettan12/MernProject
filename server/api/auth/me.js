const me = (req, res) => {
  res.json({
    user: "id",
    token: "fake-jwt",
  });
};

export default me;
