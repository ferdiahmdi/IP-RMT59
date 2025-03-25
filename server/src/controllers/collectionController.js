const express = require("express");
const router = express.Router();
const { Collection } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new collection
router.post("/collections", authMiddleware, async (req, res, next) => {
  try {
    const { name, userId } = req.body;
    const collection = await Collection.create({
      name: name,
      userId: userId
    });
    res.status(201).json(collection);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

// Get all collections for a user
router.get("/collections/:userId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const collections = await Collection.findAll({ where: { userId } });
    res.json(collections);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

module.exports = router;
