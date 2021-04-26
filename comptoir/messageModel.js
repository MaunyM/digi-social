const { Model, DataTypes, Sequelize } = require("sequelize");

class MESSAGE extends Model {}

exports.modelMessage = (sequelize, USER, COMPTOIR) => {
  MESSAGE.init(
    {
      content: DataTypes.STRING,
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
    },
    { sequelize }
  );

  MESSAGE.belongsTo(COMPTOIR);
  MESSAGE.belongsTo(USER);
  USER.hasMany(MESSAGE, { as: "messages"})
  COMPTOIR.hasMany(MESSAGE, { as: "messages" });
  return COMPTOIR;
};
