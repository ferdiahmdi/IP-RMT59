if (!process.env.NODE_ENV) {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use(express.urlencoded({ extended: true }));

app.use("/", require("./controllers/animeController"));
app.use("/", require("./controllers/mangaController"));
app.use("/", require("./controllers/userController"));
app.use("/", require("./controllers/collectionController"));
app.use("/", require("./controllers/entryController"));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
