'use strict';

const Aliase = require(`../models/aliase`);

class CommentsService {
  constructor(sequelize) {
    this.sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async create(articleId, comment) {
    return this._Comment.create({
      articleId,
      ...comment,
    });
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id},
    });
    return !!deletedRows;
  }

  async findOne(id) {
    return this._Comment.findByPk(id);
  }

  async findAll({articleId, order = `ASC`, limit, includeUser = false}) {
    let extend = {
      attributes: [`Comment.*`]
    };
    if (articleId) {
      extend.where = {articleId};
    }
    if (limit) {
      extend.limit = limit;
    }
    if (includeUser) {
      extend.include = [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: []
        },
      ];
      extend.attributes.push(
          [this.sequelize.col(`users.firstName`), `firstName`],
          [this.sequelize.col(`users.lastName`), `lastName`],
          [this.sequelize.col(`users.avatar`), `avatar`]
      );
    }
    return this._Comment.findAll({
      order: [[`createdAt`, order]],
      raw: true,
      ...extend,
    });
  }
}

module.exports = CommentsService;
