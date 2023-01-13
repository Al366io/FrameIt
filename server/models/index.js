const Sequelize = require('sequelize');
sequelize = new Sequelize(
  'postgres://postgres:Gvs8wteUI5vB8gm@frameit-db.internal:5432',
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