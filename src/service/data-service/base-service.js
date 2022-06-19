'use strict';

class BaseService {
  constructor({sequelize, serviceModelName}) {
    this._serviceModelName = serviceModelName;
    this._sequelize = sequelize;
  }
  async create(data) {
    const entity = await this[this._serviceModelName].create(data);
    return entity.get();
  }

  async drop(id) {
    const deletedRows = await this[this._serviceModelName].destroy({
      where: {id},
    });
    return !!deletedRows;
  }
}

module.exports = BaseService;
