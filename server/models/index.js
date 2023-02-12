const Sequelize = require('sequelize');
const { AuthTableOwner } = require('./model');
const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      // Your pg options here
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