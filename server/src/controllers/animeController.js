const express = require("express");
const router = express.Router();
const baseURL = require("../helpers/http");
const authMiddleware = require("../middlewares/authMiddleware");

// Get anime recommendations from Jikan API and search if there is a query "q"
router.get("/animes", async (req, res, next) => {
  try {
    const query = req.query.q || null;
    const page = +req.query.page || 1;

    const response = !query
      ? await baseURL.get("/recommendations/anime", {
          params: {
            page: page
          }
        })
      : await baseURL.get("/anime", {
          params: {
            q: query,
            page: page
          }
        });

    const data = response.data;

    console.log("paginations", data.pagination);
    res.json(data.data);
  } catch (error) {
    if (error.response) {
      error.statusCode = error.response.status;
      error.message = error.response.data.message;
    } else {
      error.statusCode = 500;
      error.message = "Internal Server Error";
    }
    next(error);
  }
});

// Get anime details from Jikan API by id
router.get("/animes/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    const response = await baseURL.get(`/anime/${id}`);

    const data = response.data;

    res.json(data.data);
  } catch (error) {
    if (error.response) {
      error.statusCode = error.response.status;
      error.message = error.response.data.message;
    } else {
      error.statusCode = 500;
      error.message = "Internal Server Error";
    }
    next(error);
  }
});

module.exports = router;
