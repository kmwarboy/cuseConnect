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

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/dashboard.html");
});

app.listen(8081, "0.0.0.0", () => {
  console.log("Server is running");
});
