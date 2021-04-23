const express = require("express");
const { Service } = require("./service");

const router = express.Router();

exports.comptoirRouter = () => {
  // Le service metier
  const service = Service();

  /**
   * Cette route permet de se créer un comptoir
   * Le body de la requete doit contenir le nom du comptoir
   * Le propriétaire de ce comptoir est l'utilisateur connecté
   */
  router.post("/", (req, rep) => {
    service.create(req.body).then(() => rep.json(req.body));
  });

  return router;
};
