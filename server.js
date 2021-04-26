const express = require("express");
const http = require("http");
const cors = require("cors");
const jwtMiddelware = require("express-jwt");

const { userRouter } = require("./user/router.js");
const { comptoirRouter } = require("./comptoir/router.js");
const sequelize = require("./sequelize");
const { socket } = require("./socket");

require("dotenv").config();

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

app.use("/user", userRouter(SECRET));
app.use("/comptoir", comptoirRouter());

const httpServer = http.createServer(app);

socket(httpServer, corsOptions);

sequelize
  .sync()
  .then(() =>
    httpServer.listen(port, () => console.log(`En écoute sur le port ${port}`))
  );
