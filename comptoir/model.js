const { Model, DataTypes } = require("sequelize");

class COMPTOIR extends Model {}

exports.modelComptoir = (sequelize, USER) => {
  COMPTOIR.init(
    {
      nom: DataTypes.STRING,
    },
    { sequelize }
  );

  COMPTOIR.hasOne(USER, {as:'prioprio'});
  return COMPTOIR;
};
