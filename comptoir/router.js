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
    service.create(req.body, req.user).then((data) => rep.json(data));
  });

  /**
   * Cette route renvoie tous les comptoirs
   */
  router.get("/", (req, rep) => {
    service.all().then((data) => rep.json(data));
  });

  /**
   * Cette route renvoie le comptoir de l'utilisateur connecté
   */
  router.get("/mine", (req, rep) => {
    service.getMine(req.user).then((data) => rep.json(data));
  });

  /**
   * Cette route permet à l'utilisateur connecté de quitter son comptoir
   */
  router.put("/mine/leave", (req, rep) => {
    service.leave(req.user).then((data) => rep.json(data));
  });

    /**
   * Cette route permet à l'utilisateur connecté d'ajouter un message dans son comptoir
   */
     router.post("/mine/message", (req, rep) => {
      service.postMessage(req.user, req.body).then((data) => rep.json(data));
    });

  /**
   * Cette route permet à l'utilisateur connecté de rejoindre un comptoir existant
   */
  router.put("/:id", (req, rep) => {
    service.join(req.params.id, req.user).then((data) => rep.json(data));
  });

  return router;
};
