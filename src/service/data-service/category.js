"use strict";

class CategoryService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const articles = this._articles.reduce((acc, article) => {
      article.category.forEach((category) => acc.add(category));
      return acc;
    }, new Set());

    return [...articles];
  }
}

module.exports = CategoryService;
