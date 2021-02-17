const { Sequelize } = require("sequelize");
require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` }); //choose env file depending on the environment

// DB connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false
  }
);

sequelize.authenticate()
  .then(() => {
    if (process.env.NODE_ENV == "test") {
      console.log("Connection to groupomania_test has been established successfully.")
    } else if (process.env.NODE_ENV == "dev") {
      console.log("Connection to groupomania_dev has been established successfully.")
    } else if (process.env.NODE_ENV == "prod") {
      console.log("Connection to groupomania_prod has been established successfully.")
    }
  })
  .catch((error) => console.error("Unable to connect to the database:", error));

module.exports = sequelize;