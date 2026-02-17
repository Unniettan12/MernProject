const me = (req, res) => {
  res.send({
    user: { id: "1", email: "test@test.com", name: "John Doe" },

    token: "fake-jwt",
  });
};

export default me;
