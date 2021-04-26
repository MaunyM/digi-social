const bcrypt = require("bcrypt");
const sequelize = require("../sequelize");
const saltRounds = 10;

const jwt = require("jsonwebtoken");

const VIEWER = "VIEWER";

const hash = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

const compare = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

exports.Service = (secret) => {
  const clean = ({ login }) => ({ login });
  const { USER } = sequelize.models;
  /**
   * Essayes de connecter un utilisateur
   * @param {*} login chaine de caracteres
   * @param {*} password  chaine de caracteres
   * @returns un JWT en cas de succés
   */
  const logUser = async (login, password) => {
    const user = await USER.findOne({ where: { login } });
    if (!user) throw "oups";
    const valid = await compare(password, user.hash);
    if (!valid) throw "oups";
    const { role } = user;
    return jwt.sign({ login, role }, secret, {
      expiresIn: "1h",
    });
  };

  /**
   * Crée un utilisateur avec le role VIEWER
   * @param {*} user un utilisateur
   * @returns l'utilisateur inséeré en base
   */
  const create = async (user) => {
    const hashedPassword = await hash(user.password);
    const {login, role} = await USER.create({ ...user, hash: hashedPassword, role: VIEWER });
    return jwt.sign({ login, role }, secret, {
      expiresIn: "1h",
    });
  };

  /**
   * @returns tous les utilisateurs
   */
  const all = async () => {
    return await USER.findAll();
  };

  /**
   * @returns  le login de tous les utilisateurs
   */
  const allRedacted = async () => {
    return await USER.findAll({ attributes: ["login"] });
  };

  /**
   *    * Ajoute un lien d'amitié entre deux utilisateurs
   * @param {*} user un utilisateur
   * @param {*} friend son nouvel ami
   * @returns l'utilisateur connecté
   */
  const addFriend = async ({ login }, { login: friendLogin }) => {
    const user = await USER.findOne({ where: { login } });
    const friend = await USER.findOne({ where: { login: friendLogin } });
    user.addFriend(friend);
    return await user.save();
  };

  /**
   * Récupere un utilisateur en base de donnée
   * @param {*} utilisateur contenant un login
   * @returns l'utilisateur connecté
   */
  const me = async ({ login }) => {
    const { role, id } = await USER.findOne({ where: { login } });
    return { login, role, id };
  };

  /**
   * Récupere la liste d'amis d'un utilisateur
   * @param {*} utilisateur contenant un login
   * @returns l'utilisateur
   */
  const friend = async ({ login }) => {
    const { friend } = await USER.findOne({
      include: "friend",
      where: { login },
    });
    return friend.map(clean);
  };

  return { logUser, create, me, all, allRedacted, friend, addFriend };
};
