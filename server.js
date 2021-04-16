const express = require("express");
const cors = require('cors');

require("dotenv").config();

const app = express();

const corsOptions = {
    origin: process.env.REACT_URL,
  }

app.use(cors(corsOptions))

app.get("/api/message", (req, rep) => {
  rep.json([{ content: "Bonjour !" }]);
});

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`En écoute sur le port ${port}`));
