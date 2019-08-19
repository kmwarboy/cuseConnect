// const fetch = require("node-fetch");

// const data = fetch(
//   `https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Syracuse_Quadrants/FeatureServer/0/query?where=1%3D1&outFields=NAME,Quad,Shape__Area,Shape__Length&outSR=4326&f=json`
// )
//   .then(data => {
//     return data.json();
//   })
//   .then(data => {
//     console.log(data.features[3].attributes.NAME);
//   });

// let userQuadrant;

// if (pointInPolygon([data.user.x, data.user.y], northEast)) {
//   console.log("NE");
// } else if (pointInPolygon([data.user.x, data.user.y], northWest)) {
//   console.log("NW");
// } else if (pointInPolygon([data.user.x, data.user.y], southEast)) {
//   console.log("SE");
// } else if (pointInPolygon([data.user.x, data.user.y], southWest)) {
//   console.log("SW");
// } else {
//   console.log("unknown");
// }

// const northEast = polygon.features[0].attributes.NAME;
// const northWest = polygon.features[1].attributes.NAME;
// const southEast = polygon.features[2].attributes.NAME;
// const southWest = polygon.features[3].attributes.NAME;

// //   // let userQuadrant;

// //   console.log(northEast);

// //   if (polygon.features.length > 0) {
// //     trashDay = data.features[0].attributes.Trash_Pickup_Day;
// //     xGeo = data.features[0].geometry.x;
// //     yGeo = data.features[0].geometry.y;
// //   } else {
// //     trashDay = "Unknown";
// //     xGeo = 0;
// //     yGeo = 0;
// //   }
// // }

// //     const generatedPw = await bcrypt.hash(req.body.password, 10);

// //     await models.User.create({
// //       userName: req.body.userName,
// //       name: req.body.name,
// //       password: generatedPw,
// //       houseNumber: req.body.houseNumber,
// //       streetName: req.body.streetName,
// //       trashPickup: trashDay,
// //       x: xGeo,
// //       y: yGeo
// //     });

// //     res.send({ message: "user created" });
// //   });

app.get("/test", async (req, res) => {
  let quadData = await fetch(
    `https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Syracuse_Quadrants/FeatureServer/0/query?where=1%3D1&outFields=NAME,Quad,Shape__Area,Shape__Length&outSR=4326&f=json`
  );
  quadData = await quadData.json();
  let northEast = quadData.features[0].geometry.rings;

  res.send(northEast);
});

app.get("/test", async (req, res) => {
  let quadData = await fetch(
    `https://services.arcgis.com/uDTUpUPbk8X8mXwl/arcgis/rest/services/Syracuse_Quadrants/FeatureServer/0/query?where=1%3D1&outFields=NAME,Quad,Shape__Area,Shape__Length&outSR=4326&f=json`
  );
  quadData = await quadData.json();
  let northEast = quadData.features[0].geometry.rings[0];
  let northWest = quadData.features[1].geometry.rings[0];
  let southEast = quadData.features[2].geometry.rings[0];
  let southWest = quadData.features[3].geometry.rings[0];
  let userQuadrant;

  console.log(northEast);

  if (pointInPolygon([req.query.x, req.query.y], northEast)) {
    res.send("North East");
  } else if (pointInPolygon([req.query.x, req.query.y], northWest)) {
    res.send("North West");
  } else if (pointInPolygon([req.query.x, req.query.y], southEast)) {
    res.send("South East");
  } else if (pointInPolygon([req.query.x, req.query.y], southWest)) {
    res.send("South West");
  } else {
    res.send("No Idea!");
  }
});
