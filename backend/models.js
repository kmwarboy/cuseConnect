module.exports = () => {
  const Sequelize = require("sequelize");

  // remove db info before git push, and add db information here before deployment!

  const db = new Sequelize("postgres", "postgres", " ", {
    host: "",
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
