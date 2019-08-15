const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const models = require("./models")();
models.init();

const moment = require("moment");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.put("/user", async (req, res) => {
  await models.User.create({ userName: req.body.userName });
  res.send({ message: "user created" });
});

app.get("/users", async (req, res) => {
  res.send({ users: await models.User.findAll() });
});

// app.use("/", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "dashboard.html");
});

app.use("/css", express.static("css"));
app.use("/images", express.static("images"));

app.listen(8082, "0.0.0.0", () => {
  console.log("Server is running on port 8082!");
});
