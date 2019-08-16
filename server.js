const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const models = require("../cuseConnect/backend/models")();
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
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
  const houseNumberInt = parseInt(req.body.houseNumber);

  // fetch(
  //   `https://services6.arcgis.com/bdPqSfflsdgFRVVM/arcgis/rest/services/Trash_Pickup_Day/FeatureServer/0/query?where=UPPER(number)%20like%20'%25${
  //     req.body.houseNumber
  //   }%25'%20AND%20UPPER(address)%20like%20'%25${req.body.streetName.toUpperCase()}%25'&outFields=number,address,Trash_Pickup_Day&outSR=4326&f=json`
  // )
  //   .then(data => {
  //     return data.json();
  //   })
  //   .then(data => {
  //     console.log(data.features[0].attributes.Trash_Pickup_Day);
  //   });

  let data = await fetch(
    `https://services6.arcgis.com/bdPqSfflsdgFRVVM/arcgis/rest/services/Trash_Pickup_Day/FeatureServer/0/query?where=UPPER(number)%20like%20'${
      req.body.houseNumber
    }%25'%20AND%20UPPER(address)%20like%20'%25${req.body.streetName.toUpperCase()}%25'&outFields=number,address,Trash_Pickup_Day&outSR=4326&f=json`
  );
  data = await data.json();
  let trashDay;

  if (data.features.length === 0) {
    let data = await fetch(
      `https://services6.arcgis.com/bdPqSfflsdgFRVVM/arcgis/rest/services/Trash_Pickup_Day/FeatureServer/0/query?where=UPPER(number)%20like%20'${houseNumberInt -
        2}%25'%20AND%20UPPER(address)%20like%20'%25${req.body.streetName.toUpperCase()}%25'&outFields=number,address,Trash_Pickup_Day&outSR=4326&f=json`
    );
    data = await data.json();

    if (data.features.length > 0) {
      trashDay = data.features[0].attributes.Trash_Pickup_Day;
    } else {
      trashDay = "Unknown";
    }
  } else {
    trashDay = data.features[0].attributes.Trash_Pickup_Day;
  }

  const generatedPw = await bcrypt.hash(req.body.password, 10);

  await models.User.create({
    userName: req.body.userName,
    name: req.body.name,
    password: generatedPw,
    houseNumber: req.body.houseNumber,
    streetName: req.body.streetName,
    trashPickup: trashDay
  });

  res.send({ message: "user created" });
});

app.get("/login", async (req, res) => {
  const user = await models.User.findOne({
    where: { userName: req.body.userName }
  });

  if (!user) {
    res.status(401).send({ error: "Can't sign in" });
  } else {
    const match = await bcrypt.compare(req.body.password, user.password);

    if (match) {
      res.send({ message: "signed in" });
    } else {
      res.status(401).send({ error: "Can't sign in" });
    }
  }
  res.send();
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
