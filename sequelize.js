const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlite:database.db");

const { modelUser } = require("./user/model");
const { modelComptoir } = require("./comptoir/model");


const USER = modelUser(sequelize);
modelComptoir(sequelize, USER);

module.exports = sequelize;
