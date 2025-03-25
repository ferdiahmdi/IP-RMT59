if (!process.env.NODE_ENV) {
  require("dotenv").config();
}

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./controllers/animeController"));
app.use("/", require("./controllers/mangaController"));

module.exports = app;

// test
