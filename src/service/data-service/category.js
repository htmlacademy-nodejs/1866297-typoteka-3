"use strict";

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);
const BaseService = require(`./base-service`);

class CategoryService extends BaseService {
  constructor({sequelize, serviceModelName}) {
    super({sequelize, serviceModelName});
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async update(id, data) {
    const [affectedRows] = await this._Category.update(data, {
      where: {id},
    });
    return !!affectedRows;
  }

  async findOne(id) {
    return await this._Category.findByPk(id);
  }

  async findAllInArticles(id) {
    return await this._Category.findAll({
      raw: true,
      attributes: [
        [
          Sequelize.fn(`COUNT`, Sequelize.col(`articleCategories.CategoryId`)),
          `count`,
        ],
      ],
      group: [Sequelize.col(`articleCategories.CategoryId`)],
      where: {id},
      include: [
        {
          model: this._ArticleCategory,
          as: Aliase.ARTICLE_CATEGORIES,
          attributes: [],
        },
      ],
    });
  }

  async findAll(needCount) {
    if (needCount) {
      const categories = await this._Category.findAll({
        attributes: [
          `id`,
          `name`,
          [Sequelize.fn(`COUNT`, Sequelize.col(`Category.id`)), `count`],
        ],
        group: [Sequelize.col(`Category.id`)],
        include: [
          {
            model: this._ArticleCategory,
            as: Aliase.ARTICLE_CATEGORIES,
            attributes: [],
            required: true,
          },
        ],
      });
      return categories.map((it) => it.get());
    } else {
      return this._Category.findAll({raw: true});
    }
  }
}

module.exports = CategoryService;
