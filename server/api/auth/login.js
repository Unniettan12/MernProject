const login = (req, res) => {
  console.log("Requst is ", req);
  res.send({
    user: { id: "1", email: "test@test.com", name: "John Doe" },
    jwt: "fakeAssB",
  });
};

export default login;
