const express = require("express");
const router = express.Router();
const { Collection, User, Entry } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new collection
router.post("/collections", async (req, res, next) => {
  try {
    const { name, userId } = req.body;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: "User not found"
      };
    }

    const collection = await Collection.create({ name, userId });

    res.status(201).json(collection);
  } catch (error) {
    next(error);
  }
});

// Get all collections for a user
router.get("/collections/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: "User not found"
      };
    }

    const collections = await Collection.findAll({
      where: { userId },
      include: Entry
    });
    if (!collections) {
      throw {
        statusCode: 404,
        message: "Collections not found"
      };
    }

    res.status(200).json(collections);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
