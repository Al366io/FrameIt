const Sequelize = require('sequelize');
sequelize = new Sequelize(
  'postgresql://frameit:lol123!@localhost:5432/frameitdb',
  {
    logging: false
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