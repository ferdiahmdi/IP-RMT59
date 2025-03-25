const express = require("express");
const router = express.Router();
const { Entry } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new entry
router.post("/entries", authMiddleware, async (req, res, next) => {
  try {
    const { title, type, progress, completed, collectionId, jikanId } =
      req.body;
    const entry = await Entry.create({
      title: title,
      type: type,
      progress: progress,
      completed: completed,
      collectionId: collectionId,
      jikanId: jikanId
    });
    res.status(201).json(entry);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

// Get all entries for a collection
router.get(
  "/collections/:userId/:collectionId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { collectionId } = req.params;
      const entries = await Entry.findAll({ where: { collectionId } });
      res.json(entries);
    } catch (error) {
      error.statusCode = 400;
      next(error);
    }
  }
);

module.exports = router;
