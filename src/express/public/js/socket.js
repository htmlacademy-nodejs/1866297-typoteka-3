"use strict";

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const socket = io(SERVER_URL);

  const LATEST_COMMENTS_MAX_COUNT = 4;
  const LATEST_COMMENTS_LENGTH_MAX_COUNT = 100;
  const HOT_ARTICLES_LENGTH_MAX_COUNT = 100;

  const formatStringWithEllipsis = (text, length) => {
    return text.length > length
        ? text.slice(0, length).trim() + "..."
        : text;
  };

  const createComment = (comment) => {
    const commentTemplate = document.querySelector(`#latest-comments-template`);
    const commentElement = commentTemplate.cloneNode(true).content;

    commentElement.querySelector(
      `.last__list-image`
    ).src = `/img/${comment.avatar}`;
    commentElement.querySelector(`.last__list-name`).textContent = `${comment.firstName} ${comment.lastName}`;
    commentElement.querySelector(
      `.last__list-link`
    ).href = `/articles/${comment.articleId}`;
    commentElement.querySelector(`.last__list-link`).textContent = formatStringWithEllipsis(comment.text, LATEST_COMMENTS_LENGTH_MAX_COUNT);

    return commentElement;
  };

  const createArticle = (article) => {
    const articleNode = document.createElement(`li`);
    articleNode.classList.add(`hot__list-item`);

    articleNode.innerHTML = `
      <a class ='hot__list-link' href='/articles/${article.id}'>
      ${formatStringWithEllipsis(
        article.announce,
        HOT_ARTICLES_LENGTH_MAX_COUNT
      )}
      <sup class='hot__link-sup'>${article.commentsLength}</sup>
      </a>
    `;

    return articleNode;
  }

  const updateLatestComments = (comment) => {
    const latestCommentsList = document.querySelector(`.last__list`);
    const latestComments =
      latestCommentsList.querySelectorAll(`.last__list-item`);
    if (latestComments.length === LATEST_COMMENTS_MAX_COUNT) {
      latestComments[latestComments.length - 1].remove();
    }
    latestCommentsList.prepend(createComment(comment));
  };

  const updateDeleteComments = (latestComments) => {
    const latestCommentsList = document.querySelector(`.last__list`);
    const commentsFragment = document.createDocumentFragment();

    latestComments.forEach((comment) => {
      commentsFragment.appendChild(createComment(comment));
    });

    latestCommentsList.innerHTML = '';
    latestCommentsList.appendChild(commentsFragment);
  };

  const updateHotArticles = (articles) => {
    const hotArticlesList = document.querySelector(`.hot__list`);
    const hotArticlesFragment = document.createDocumentFragment();

    articles.forEach((article) => {
      hotArticlesFragment.appendChild(createArticle(article));
    });

    hotArticlesList.innerHTML = '';
    hotArticlesList.appendChild(hotArticlesFragment);
  }

  socket.on("connect", () => {
    console.log(`websocket connection success`);
    socket.addEventListener("comment:create", (comment, hotArticles) => {
      updateLatestComments(comment);
      updateHotArticles(hotArticles);
    });
    socket.addEventListener("comment:delete", (latestComments, hotArticles) => {
      updateDeleteComments(latestComments);
      updateHotArticles(hotArticles);
    });
  });
})();
