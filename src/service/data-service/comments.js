'use strict';

const Aliase = require(`../models/aliase`);
const BaseService = require(`./base-service`);

class CommentsService extends BaseService {
  constructor({sequelize, serviceModelName}) {
    super({sequelize, serviceModelName});
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

  async findOne(id, userId) {
    if (userId) {
      return this._Comment.findOne({
        raw: true,
        where: {id},
        attributes: [
          `Comment.*`,
          [this._sequelize.col(`users.firstName`), `firstName`],
          [this._sequelize.col(`users.lastName`), `lastName`],
          [this._sequelize.col(`users.avatar`), `avatar`],
        ],
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: [],
          },
        ],
      });
    }
    return this._Comment.findByPk(id);
  }

  async findAll({articleId, order = `ASC`, limit, includeUser = false}) {
    const extend = {
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
          [this._sequelize.col(`users.firstName`), `firstName`],
          [this._sequelize.col(`users.lastName`), `lastName`],
          [this._sequelize.col(`users.avatar`), `avatar`]
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
