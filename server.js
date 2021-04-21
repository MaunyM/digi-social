const express = require("express");
const cors = require("cors");
const jwtMiddelware = require("express-jwt");

require("dotenv").config();

const { userRouter } = require("./user/router.js");

const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlite:database.db");

const app = express();

const corsOptions = {
  origin: process.env.REACT_URL,
};

/**
 * le secret utilisé pour signer le JWT
 * ⚠️ ne jamais commité
 */
const SECRET = process.env.SECRET;

app.use(
  cors(corsOptions), // On authorise le cors pour l'application en React
  express.json() // Renseigne l'attribut body de la requete avec le body d'une requete POST
);

/**
 * Ce middeware valide le JWT et rajoute un attribut user à la requete.
 * Cet attribut contient la payload du jeton
 */
app.use(
  jwtMiddelware({ secret: SECRET, algorithms: ["HS256"] }).unless({
    path: ["/user/login", "/user"],
  })
);

/**
 * Ce middelware gere les erreurs et les transforme en JSON
 */
app.use((err, req, rep, next) => {
  err ? rep.status(err.status).json({ error: err.message }) : next();
});

const port = process.env.PORT || 8000;

app.use("/user", userRouter(sequelize, SECRET));

sequelize
  .sync()
  .then(() =>
    app.listen(port, () => console.log(`En écoute sur le port ${port}`))
  );
