"use strict";

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchText) {
    const lowerCaseText = searchText.toLowerCase();
    return this._articles.filter((article) =>
      article.title.toLowerCase().includes(lowerCaseText)
    );
  }
}

module.exports = SearchService;
