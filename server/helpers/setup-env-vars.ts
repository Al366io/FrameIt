import 'dotenv/config';

export default function setUpEnvVars() {
  const {
    DB_NAME,
    DB_NAME_TEST,
    DB_USER,
    DB_USER_TEST,
    DB_PASSWORD,
    DB_PASSWORD_TEST,
    ARE_WE_TESTING,
  } = process.env;

  const dbName = ARE_WE_TESTING === 'true' ? DB_NAME_TEST : DB_NAME;
  const dbUserName = ARE_WE_TESTING === 'true' ? DB_USER_TEST : DB_USER;
  const dbPassword = ARE_WE_TESTING === 'true' ? DB_PASSWORD_TEST : DB_PASSWORD;

  return { dbName, dbUserName, dbPassword };
}
