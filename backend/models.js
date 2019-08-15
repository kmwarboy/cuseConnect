module.exports = () => {
  const Sequelize = require("sequelize");

  const db = new Sequelize("cuseconnect", "kaitlynwarboy", "", {
    host: "127.0.0.1",
    dialect: "postgres"
  });

  return {
    db,
    User: db.define("User", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: "true",
        autoIncrement: "true"
      },
      userName: Sequelize.STRING,
      password: Sequelize.STRING,
      address: Sequelize.STRING,
      trashPickup: Sequelize.STRING
    }),
    init: function() {
      db.sync({ force: "true" });
    }
  };
};
