import { Sequelize } from 'sequelize';
import setUpEnvVars from '../helpers/setup-env-vars';
import 'dotenv/config';

const { dbName, dbUserName, dbPassword } = setUpEnvVars();

const sequelize = new Sequelize(dbName!, dbUserName!, dbPassword!, {
  host: 'localhost',
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    client_encoding: 'auto',
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to db ok');
  } catch (error) {
    console.log('err' + error);
  }
})();

export default sequelize;
