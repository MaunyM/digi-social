const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlite:database.db");

const { modelUser } = require("./user/model");
const { modelComptoir } = require("./comptoir/comptoirModel");
const { modelMessage } = require("./comptoir/messageModel");

const USER = modelUser(sequelize);
const COMPTOIR = modelComptoir(sequelize, USER);
modelMessage(sequelize, USER, COMPTOIR);

module.exports = sequelize;
