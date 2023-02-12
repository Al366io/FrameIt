const Sequelize = require('sequelize');
const { DB_CONNECTION_STRING } = require("../config");
const sequelize = new Sequelize(
  process.env.DB_CONNECTION_STRING,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      client_encoding: 'auto'
    }
  }
);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connection to db ok');
  } catch (error) {
    console.log('err' + error);
  }
} start();
module.exports = sequelize;