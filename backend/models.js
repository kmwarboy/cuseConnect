module.exports = () => {
  const Sequelize = require("sequelize");

  // const db = new Sequelize("cuseconnect", "kaitlynwarboy", "", {
  //   host: "127.0.0.1",
  //   dialect: "postgres",
  //   logging: false
  // });

  // remove db info before git push, and add db information here before deployment!

  const db = new Sequelize("postgres", "postgres", "Kv39aV9bR9wi8Sndr8Mw", {
    host: "cuseconnect.cmk1puqneyj9.us-east-2.rds.amazonaws.com",
    dialect: "postgres",
    logging: false
  });

  return {
    db,
    User: db.define("User", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: "true",
        autoIncrement: "true"
      },
      name: Sequelize.STRING,
      userName: Sequelize.STRING,
      password: Sequelize.STRING,
      houseNumber: Sequelize.INTEGER,
      streetName: Sequelize.STRING,
      trashPickup: Sequelize.STRING,
      x: Sequelize.DECIMAL,
      y: Sequelize.DECIMAL,
      quadrant: Sequelize.STRING
    }),
    init: function() {
      db.sync({ force: false });
    }
  };
};
