'use strict';
const BaseService = require(`./base-service`);

class UserService extends BaseService {
  constructor({sequelize, serviceModelName}) {
    super({sequelize, serviceModelName});
    this._User = sequelize.models.User;
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email},
    });
    return user && user.get();
  }
}

module.exports = UserService;
