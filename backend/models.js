module.exports = () => {
  const Sequelize = require("sequelize");

  const db = new Sequelize("cuseconnect", "kaitlynwarboy", "", {
    host: "127.0.0.1",
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
      y: Sequelize.DECIMAL
    }),
    init: function() {
      db.sync({ force: true });
    }
  };
};
