const { Model, DataTypes } = require("sequelize");

class USER extends Model {}

exports.modelUser = (sequelize) => {
  USER.init(
    {
      login: DataTypes.STRING,
      hash: DataTypes.STRING,
      role: DataTypes.STRING,
    },
    { sequelize }
  );

  USER.belongsToMany(USER, {as:'friend', through: 'User_Friends' });
  return USER;
};
