"use strict";

const Aliase = require(`../models/aliase`);
const BaseService = require(`./base-service`);

class ArticleService extends BaseService {
  constructor({sequelize, serviceModelName}) {
    super({sequelize, serviceModelName});
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
    this._User = sequelize.models.User;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async findOne(id, needComments) {
    const extend = {
      include: [Aliase.CATEGORIES],
    };
    if (needComments) {
      extend.include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`password`, `email`],
            },
          },
        ],
      });
      extend.order = [[this._sequelize.col(`comments.createdAt`), `DESC`]];
    }
    return this._Article.findByPk(id, {...extend});
  }

  async update(id, article) {
    const [[affectedRows], currentArticle] = await Promise.all([
      this._Article.update(article, {
        where: {id},
      }),
      this._Article.findByPk(id),
    ]);

    const updated = !!affectedRows;

    if (updated) {
      await currentArticle.setCategories(article.categories);
    }

    return updated;
  }

  async findAll(needComments) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`password`],
        },
      },
    ];

    if (needComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`password`, `email`],
            },
          },
        ],
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [[`createdAt`, `DESC`]],
    });

    return articles.map((item) => item.get());
  }

  async findPage({limit, offset, comments}) {
    const include = [Aliase.CATEGORIES];

    if (comments) {
      include.push(Aliase.COMMENTS);
    }
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [[`createdAt`, `DESC`]],
      distinct: true,
    });
    return {count, articles: rows};
  }
  async findPageByCategory({limit, offset, id}) {
    const [[rawArticles], [resultCount]] = await Promise.all([
      this._sequelize.query(
          `
    SELECT * FROM (
	SELECT
		"articles".*,
		COUNT(DISTINCT "comments".id) AS "commentsCount",
		STRING_AGG(DISTINCT concat("categories".name, '|', "categories".id::varchar), ', ') AS "categoriesData",
		STRING_AGG(DISTINCT "categories".id::varchar, ',') AS "categoriesIds"
	  FROM "articles"
      LEFT JOIN "article_categories" ON "article_categories"."ArticleId"="articles".id
	  LEFT JOIN "comments" ON "comments"."articleId"="articles".id
	  LEFT JOIN "categories" ON "categories".id = "article_categories"."CategoryId"
	  GROUP BY "articles".id
) AS "Articles"
	  WHERE "categoriesIds" LIKE '%:id%'
    ORDER BY "createdAt" DESC
  	  LIMIT :limit
	  OFFSET :offset;`,
          {
            replacements: {
              id: Number(id),
              limit,
              offset,
            },
          }
      ),
      this._sequelize.query(
          `SELECT COUNT(*) FROM "articles"
      LEFT JOIN "article_categories" ON "article_categories"."ArticleId"="articles".id
	  JOIN "categories" ON "categories".id = "article_categories"."CategoryId"
      WHERE "article_categories"."CategoryId"=$id;`,
          {
            bind: {
              id,
            },
          }
      ),
    ]);
    const articles = rawArticles.map((article) => {
      return {
        ...article,
        categories: article.categoriesData.split(`, `).map((category) => {
          // eslint-disable-next-line no-shadow
          const [name, id] = category.split(`|`);
          return {id, name};
        }),
      };
    });
    return {
      count: resultCount[0].count,
      articles,
    };
  }
}

module.exports = ArticleService;
