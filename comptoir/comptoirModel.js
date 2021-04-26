const { Model, DataTypes, Sequelize } = require("sequelize");

class COMPTOIR extends Model {}

exports.modelComptoir = (sequelize, USER) => {
  COMPTOIR.init(
    {
      nom: DataTypes.STRING,
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
    },
    { sequelize }
  );

  USER.belongsTo(COMPTOIR);
  COMPTOIR.hasMany(USER, { as: "pilliers" });
  return COMPTOIR;
};
