const Sequelize = require('sequelize');
const { DB_USER, DB_NAME, DB_PASSWORD } = require("../config");
const sequelize = new Sequelize(
  DB_NAME, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
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