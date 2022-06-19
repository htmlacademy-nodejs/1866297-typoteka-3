'use strict';

const {DataTypes, Model} = require(`sequelize`);

const AVATAR_MAX_LENGTH = 50;

class User extends Model { }

const define = (sequelize) =>
  User.init(
      {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        avatar: {
          type: DataTypes.STRING(AVATAR_MAX_LENGTH),
          allowNull: true,
        },
      },
      {sequelize, modelName: `User`, tableName: `users`}
  );

module.exports = define;
