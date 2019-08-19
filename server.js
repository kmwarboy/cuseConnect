const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const models = require("../cuseConnect/backend/models")();
const fetch = require("node-fetch");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const path = require("path");
const pointInPolygon = require("point-in-polygon");
models.init();

const moment = require("moment");
const fs = require("fs");

const app = express();
// app.use(cors({ origin: "http://localhost:8082" }));
app.use(bodyparser.json());
app.use(cookieParser("abc123"));

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
  let xGeo;
  let yGeo;

  if (data.features.length === 0) {
    let data = await fetch(
      `https://services6.arcgis.com/bdPqSfflsdgFRVVM/arcgis/rest/services/Trash_Pickup_Day/FeatureServer/0/query?where=UPPER(number)%20like%20'${houseNumberInt -
        2}%25'%20AND%20UPPER(address)%20like%20'%25${req.body.streetName.toUpperCase()}%25'&outFields=number,address,Trash_Pickup_Day&outSR=4326&f=json`
    );
    data = await data.json();

    if (data.features.length > 0) {
      trashDay = data.features[0].attributes.Trash_Pickup_Day;
      xGeo = data.features[0].geometry.x;
      yGeo = data.features[0].geometry.y;
    } else {
      trashDay = "Unknown";
      xGeo = 0;
      yGeo = 0;
    }
  } else {
    trashDay = data.features[0].attributes.Trash_Pickup_Day;
    xGeo = data.features[0].geometry.x;
    yGeo = data.features[0].geometry.y;
  }

  let quadData = await fetch(
    `https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Syracuse_Quadrants/FeatureServer/0/query?where=1%3D1&outFields=NAME,Quad,Shape__Area,Shape__Length&outSR=4326&f=json`
  );
  quadData = await quadData.json();
  let northEast = quadData.features[0].geometry.rings[0];
  let northWest = quadData.features[1].geometry.rings[0];
  let southEast = quadData.features[2].geometry.rings[0];
  let southWest = quadData.features[3].geometry.rings[0];
  let userQuadrant;

  if (pointInPolygon([xGeo, yGeo], northEast)) {
    userQuadrant = "North East";
  } else if (pointInPolygon([xGeo, yGeo], northWest)) {
    userQuadrant = "North West";
  } else if (pointInPolygon([xGeo, yGeo], southEast)) {
    userQuadrant = "South East";
  } else if (pointInPolygon([xGeo, yGeo], southWest)) {
    userQuadrant = "South West";
  } else {
    userQuadrant = "No Idea!";
  }
  const generatedPw = await bcrypt.hash(req.body.password, 10);

  await models.User.create({
    userName: req.body.userName,
    name: req.body.name,
    password: generatedPw,
    houseNumber: req.body.houseNumber,
    streetName: req.body.streetName,
    trashPickup: trashDay,
    x: xGeo,
    y: yGeo,
    quadrant: userQuadrant
  });
  res.send({ message: "User created." });
  // console.log(quadData.features[3].attributes.NAME);
});

const loginChecker = async (req, res, next) => {
  if (req.cookies.userID) {
    next();
  } else {
    res.status(401).send({ error: "User is not logged in" });
  }
};

app.get("/dashboard", loginChecker, async (req, res) => {
  const user = await models.User.findOne({
    where: { id: req.cookies.userID },
    attributes: ["name", "trashPickup", "quadrant"]
  });

  res.send(user);
});

app.post("/login", async (req, res) => {
  if (req.cookies.userID) {
    res.send({ message: "User is signed in." });
  } else {
    const user = await models.User.findOne({
      where: { userName: req.body.userName }
    });

    if (!user) {
      res.status(401).send({ error: "Can't sign in." });
    } else {
      const match = await bcrypt.compare(req.body.password, user.password);

      if (match) {
        res.cookie("userID", user.id).send({ message: "User is signed in." });
      } else {
        res.status(401).send({ error: "Can't sign in" });
      }
    }
    res.send();
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.send({ message: "user is logged out" });
});

app.get("/users", async (req, res) => {
  res.send({ users: await models.User.findAll() });
});

app.use("/", express.static(path.join(__dirname, "frontend")));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "dashboard.html");
// });

app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/images", express.static(path.join(__dirname, "images")));

// app.get("/test", async (req, res) => {
//   let quadData = await fetch(
//     `https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Syracuse_Quadrants/FeatureServer/0/query?where=1%3D1&outFields=NAME,Quad,Shape__Area,Shape__Length&outSR=4326&f=json`
//   );
//   quadData = await quadData.json();
//   let northEast = quadData.features[0].geometry.rings[0];
//   let northWest = quadData.features[1].geometry.rings[0];
//   let southEast = quadData.features[2].geometry.rings[0];
//   let southWest = quadData.features[3].geometry.rings[0];
//   let userQuadrant;

//   console.log(northEast);

//   if (pointInPolygon([req.query.x, req.query.y], northEast)) {
//     res.send("North East");
//   } else if (pointInPolygon([req.query.x, req.query.y], northWest)) {
//     res.send("North West");
//   } else if (pointInPolygon([req.query.x, req.query.y], southEast)) {
//     res.send("South East");
//   } else if (pointInPolygon([req.query.x, req.query.y], southWest)) {
//     res.send("South West");
//   } else {
//     res.send("No Idea!");
//   }
// });

app.listen(8082, "0.0.0.0", () => {
  console.log("Server is running on port 8082!");
});
