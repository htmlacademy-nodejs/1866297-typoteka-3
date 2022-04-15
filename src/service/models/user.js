'use strict';

const {DataTypes, Model} = require(`sequelize`);

class User extends Model { }

const define = (sequelize) => User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  avatar: {
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(50),
    allowNull: true
  },
}, {sequelize, modelName: `User`, tableName: `users`});

module.exports = define;
