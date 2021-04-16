const express = require("express");
require("dotenv").config();

const app = express();

app.get("/api/message", (req, rep) => {
  rep.json({ content: "Bonjour !" });
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`En écoute sur le port ${port}`));
