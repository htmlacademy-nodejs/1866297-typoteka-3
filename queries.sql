SELECT * FROM categories;

SELECT id, name
FROM categories
  JOIN article_categories
    ON id=category_id
  GROUP BY id;

SELECT id, name, count(id)
FROM categories
  LEFT JOIN article_categories
    ON id=category_id
  GROUP BY id;

SELECT
  articles.id AS "идентификатор публикации",
  articles.title AS "заголовок публикации",
  articles.announce AS "анонс публикации",
  articles.created_date AS "дата публикации",
  concat(users.first_name, ' ', users.last_name) AS "имя и фамилия автора",
  users.email AS "контактный email",
  count(comments.id) AS "количество комментариев",
  STRING_AGG(DISTINCT categories.name, ', ') AS "наименование категорий"
FROM articles
  JOIN article_categories
    ON articles.id=article_categories.article_id
  LEFT JOIN categories
    ON article_categories.category_id=categories.id
  JOIN users
    ON users.id=articles.user_id
  LEFT JOIN comments
    ON comments.article_id=articles.id
  GROUP BY articles.id, users.id
  ORDER BY articles.created_date DESC;

SELECT articles.*,
  users.first_name,
  users.last_name,
  users.email,
  count(comments.id) AS comments_count,
  STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM articles
  JOIN article_categories
    ON articles.id=article_categories.article_id
  JOIN categories
    ON categories.id=article_categories.category_id
  JOIN users
    ON users.id=articles.user_id
  JOIN comments
    ON comments.article_id=articles.id
  WHERE articles.id=1
  GROUP BY articles.id, users.id;

SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users
    ON users.id=comments.user_id
  ORDER BY comments.created_at DESC
  LIMIT 5;

SELECT
  comments.id AS comment_id,
  comments.article_id AS article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
  JOIN users
    ON users.id=comments.user_id
  WHERE comments.article_id=2
  ORDER BY comments.created_at DESC;

UPDATE articles
SET title='Как я встретил Новый год'
WHERE id=1;
