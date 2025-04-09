const axios = require("axios");

const baseURL = axios.create({
  baseURL: "https://api.jikan.moe/v4"
});

module.exports = baseURL;
