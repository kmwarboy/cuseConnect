const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const moment = require("moment");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// app.use("/", express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dashboard.html");
});

app.use("/css", express.static("css"));
app.use("/images", express.static("images"));

app.listen(8082, "0.0.0.0", () => {
  console.log("Server is running on port 8082!");
});
