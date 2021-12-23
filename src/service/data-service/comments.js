'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentsService {
  findAll(article) {
    return article.comments;
  }
  create(article, comment) {
    const newComment = Object.assign({
      id: nanoid(MAX_ID_LENGTH),
    }, comment);

    article.comments.push(newComment);
    return newComment;
  }
  delete(article, id) {
    const commentToDelete = article.comments.find((comment) => comment.id === id);

    if (!commentToDelete) {
      return null;
    }
    article.comments = article.comments.filter((comment) => comment.id !== id);
    return commentToDelete;
  }
}

module.exports = CommentsService;
