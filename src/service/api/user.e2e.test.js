"use strict";
const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const user = require(`./user`);
const UserService = require(`../data-service/user`);
const {HttpCode} = require(`../../constants`);

const mockArticles = [
  {
    user: `ivanov@example.com`,
    comments: [
      {
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
    title: `Как достигнуть успеха не вставая с кресла`,
    photo: `image1.jpg`,
    announce: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Программировать не настолько сложно, как об этом говорят. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [
      `Программирование`,
      `Кино`,
      `Железо`,
      `Музыка`,
      `Деревья`,
      `Без рамки`,
      `IT`,
    ],
  },
  {
    user: `ivanov@example.com`,
    comments: [
      {
        user: `petrov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        user: `petrov@example.com`,
        text: `Планируете записать видосик на эту тему? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`,
      },
      {
        user: `sidorov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Совсем немного... Это где ж такие красоты? Мне кажется или я уже читал это где-то? Согласен с автором! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        user: `sidorov@example.com`,
        text: `Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
    ],
    title: `Самый лучший музыкальный альбом этого года`,
    photo: `image2.jpg`,
    announce: `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Из под его пера вышло 8 платиновых альбомов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Программировать не настолько сложно, как об этом говорят. Золотое сечение — соотношение двух величин, гармоническая пропорция. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Собрать камни бесконечности легко, если вы прирожденный герой. Это один из лучших рок-музыкантов. Простые ежедневные упражнения помогут достичь успеха. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    categories: [`Кино`, `Музыка`],
  },
  {
    user: `petrov@example.com`,
    comments: [
      {
        user: `sidorov@example.com`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты?`,
      },
      {
        user: `sidorov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
    ],
    title: `Учим HTML и CSS`,
    photo: `image3.jpg`,
    announce: `Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Это один из лучших рок-музыкантов. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Достичь успеха помогут ежедневные повторения.`,
    categories: [
      `IT`,
      `Деревья`,
      `Кино`,
      `Без рамки`,
      `Железо`,
      `Программирование`,
    ],
  },
  {
    user: `sidorov@example.com`,
    comments: [
      {
        user: `ivanov@example.com`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты? Мне кажется или я уже читал это где-то? Хочу такую же футболку :-) Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`,
      },
      {
        user: `ivanov@example.com`,
        text: `Мне кажется или я уже читал это где-то? Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Согласен с автором! Планируете записать видосик на эту тему?`,
      },
      {
        user: `ivanov@example.com`,
        text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      },
      {
        user: `ivanov@example.com`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Совсем немного... Хочу такую же футболку :-) Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то? Это где ж такие красоты? Согласен с автором!`,
      },
    ],
    title: `Как перестать беспокоиться и начать жить`,
    photo: `image4.jpg`,
    announce: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Первая большая ёлка была установлена только в 1938 году. Это один из лучших рок-музыкантов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Достичь успеха помогут ежедневные повторения. Программировать не настолько сложно, как об этом говорят. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Из под его пера вышло 8 платиновых альбомов. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Собрать камни бесконечности легко, если вы прирожденный герой. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [`За жизнь`, `IT`, `Деревья`, `Кино`, `Музыка`, `Железо`],
  },
  {
    user: `sidorov@example.com`,
    comments: [
      {
        user: `petrov@example.com`,
        text: `Хочу такую же футболку :-) Согласен с автором!`,
      },
    ],
    title: `Как перестать беспокоиться и начать жить`,
    photo: `image5.jpg`,
    announce: `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Как начать действовать? Для начала просто соберитесь. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Программировать не настолько сложно, как об этом говорят.`,
    fullText: `Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Собрать камни бесконечности легко, если вы прирожденный герой. Он написал больше 30 хитов. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.`,
    categories: [`Музыка`, `Программирование`, `Железо`, `IT`],
  },
];

const mockUsers = [
  {
    email: `ivanov@example.com`,
    password: `ivanov`,
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar1.jpg`,
  },
  {
    email: `petrov@example.com`,
    password: `petrov`,
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar2.jpg`,
  },
  {
    email: `sidorov@example.com`,
    password: `sidorov`,
    firstName: `Артём`,
    lastName: `Сидоров`,
    avatar: `avatar3.jpg`,
  },
];

const mockCategories = [
  `Программирование`,
  `Кино`,
  `Железо`,
  `Музыка`,
  `Деревья`,
  `Без рамки`,
  `IT`,
  `За жизнь`,
];

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: true});
  const app = express();
  app.use(express.json());
  await initDB(mockDB, {
    categories: mockCategories,
    articles: mockArticles,
    users: mockUsers,
  });
  user(app, new UserService(mockDB));
  return app;
};

describe(`API создает пользователя если данные валидны`, () => {
  const validUserData = {
    firstName: `Бильбо`,
    lastName: `Беггинс`,
    email: `bilbo@example.com`,
    password: `bilbobaggins`,
    passwordRepeated: `bilbobaggins`,
    avatar: `bilbo.jpg`,
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app).post(`/user`).send(validUserData);
  });

  test(`Status code 201`, () =>
    expect(response.statusCode).toBe(HttpCode.CREATED));
});

describe(`API не позволяет создать пользователя если данные не валидны`, () => {
  const validUserData = {
    firstName: `Бильбо`,
    lastName: `Беггинс`,
    email: `bilbo@example.com`,
    password: `bilbobaggins`,
    passwordRepeated: `bilbobaggins`,
    avatar: `bilbo.jpg`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Без наличия какого-либо обязательного поля возвращает 400`, async () => {
    const dataWithoutAvatar = {
      firstName: `Бильбо`,
      lastName: `Беггинс`,
      email: `bilbo@example.com`,
      password: `bilbobaggins`,
      passwordRepeated: `bilbobaggins`,
    };
    for (const key of Object.keys(dataWithoutAvatar)) {
      const badUserData = {...validUserData};
      delete badUserData[key];
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Когда тип поля невалидный возвращает 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1},
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Когда значение поля невалидное возвращает 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`},
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`Когда пароль и повтор пароля не одинаковые возвращает 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`Когда email уже занят возвращает 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});
