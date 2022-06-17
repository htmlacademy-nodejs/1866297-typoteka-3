/* eslint-disable new-cap */
'use strict';

const {DataTypes, Model} = require(`sequelize`);
const {ARTICLE_MODEL_SETTINGS} = require(`../../constants`);

class Article extends Model {}

const define = (sequelize) =>
  Article.init(
      {
        title: {
          type: DataTypes.STRING(ARTICLE_MODEL_SETTINGS.titleMaxLength),
          allowNull: false,
        },
        fullText: {
          type: DataTypes.STRING(ARTICLE_MODEL_SETTINGS.fullTextMaxLength),
          allowNull: false,
        },
        announce: {
          type: DataTypes.STRING(ARTICLE_MODEL_SETTINGS.announceMaxLength),
          allowNull: false,
        },
        photo: DataTypes.STRING(ARTICLE_MODEL_SETTINGS.photoMaxLength),
      },
      {
        sequelize,
        modelName: `Article`,
        tableName: `articles`,
      }
  );

module.exports = define;
