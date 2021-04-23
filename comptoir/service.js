const sequelize = require("../sequelize");

exports.Service = () => {
  const { COMPTOIR } = sequelize.models;

  /**
   * Crée un nouveau comptoir
   * @param {*} user un comptoir
   * @returns le comptoir inséré en base
   */
  const create = async (comptoir) => {
    return await COMPTOIR.create({ comptoir });
  };

  return { create };
};
