const { Op } = require("sequelize");
const sequelize = require("../sequelize");

exports.Service = () => {
  const { COMPTOIR, USER, MESSAGE } = sequelize.models;

  /**
   * Crée un nouveau comptoir
   * @param {*} comptoir un comptoir
   * @param {*} logn le login de l'utilisateur connecté
   * @returns le comptoir inséré en base
   */
  const create = async (comptoir, { login }) => {
    const connectedUser = await USER.findOne({ where: { login } });

    // On quitte notre comptoir précedent
    await leaveComptoir(connectedUser);

    //On ouvre le nouveau
    const comptoirModel = await COMPTOIR.create(comptoir);
    await connectedUser.setCOMPTOIR(comptoirModel);
    await comptoirModel.addPillier(connectedUser);
    return comptoirModel;
  };

  /**
   * L'utilisateur quitte son comptoir
   * @param {*} user un utilisateur
   */
  const leaveComptoir = async (user) => {
    const comptoir = await user.getCOMPTOIR();
    if (comptoir) {
      await comptoir.removePillier(user);
      await user.setCOMPTOIR(null);
    }
  };

  /**
   * @returns tous les comptoirs
   */
  const all = async () => {
    return await COMPTOIR.findAll();
  };

  /**
   * Rejoindre un comptoir existant
   * @param {*} user un comptoir
   * @param {*} login le login de l'utilisateur connecté
   * @returns le comptoir inséré en base
   */
  const join = async (id, { login }) => {
    const connectedUser = await USER.findOne({ where: { login } });
    const comptoirModel = await COMPTOIR.findByPk(id, {
      include: [
        { model: USER, as: "pilliers" },
        { model: MESSAGE, as: "messages", include: { model: USER } },
      ],
    });
    await comptoirModel.addPillier(connectedUser);
    await connectedUser.setCOMPTOIR(comptoirModel);
    await comptoirModel.reload();
    return comptoirModel;
  };

  /**
   * Quitter mon comptoir
   * @param {*} user un comptoir
   * @param {*} logn le login de l'utilisateur connecté
   * @returns le comptoir inséré en base
   */
  const leave = async ({ login }) => {
    const connectedUser = await USER.findOne({ where: { login } });
    await leaveComptoir(connectedUser);
  };

  /**
   * Renvoie le comptoir de l'utilisateur connecté
   * @param {*} login le login de l'utilisateur connecté
   * @returns le comptoir inséré en base
   */
  const getMine = async ({ login }) => {
    const connectedUser = await USER.findOne({ where: { login } });
    return await connectedUser.getCOMPTOIR({
      include: [
        { model: USER, as: "pilliers" },
        { model: MESSAGE, as: "messages", include: { model: USER } },
      ],
    });
  };

  /**
   * Rajoute un message dans le comptoir de l'utilisateur connecté
   * @param {*} login le login de l'utilisateur connecté
   * @param {*} message le message à rajouter
   * @returns
   */
  const postMessage = async ({ login }, message) => {
    const connectedUser = await USER.findOne({ where: { login } });
    const comptoir = await connectedUser.getCOMPTOIR();
    const messageModel = await MESSAGE.create(message);
    await comptoir.addMessage(messageModel);
    await connectedUser.addMessage(messageModel);
    await messageModel.setUSER(connectedUser);
    await messageModel.setCOMPTOIR(comptoir);
  };

  return { create, join, getMine, all, leave, postMessage };
};
