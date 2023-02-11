import { DataTypes } from 'sequelize';
import sequelize from './index';
import 'dotenv/config';

const AuthTableOwner = sequelize.define('AuthTableOwner', {
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  party_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

const Party = sequelize.define('Party', {
  party_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  pics: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  socket_room_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const AuthTableUser = sequelize.define('AuthTableUser', {
  user_email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  party_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

if (process.env.ARE_WE_TESTING === 'false') {
  (async () => {
    await AuthTableOwner.sync();
    await Party.sync();
    await AuthTableUser.sync();
  })();
}

export { Party, AuthTableOwner, AuthTableUser };
