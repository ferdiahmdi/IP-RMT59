const express = require("express");
const router = express.Router();
const { Entry, Collection, User } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware");
const baseURL = require("../helpers/http");

// Create a new entry
router.post("/entries", async (req, res, next) => {
  try {
    const { type, progress, completed, collectionId, jikanId } = req.body;

    if (type !== "anime" && type !== "manga") {
      throw {
        statusCode: 400,
        message: "Type must be anime or manga"
      };
    }

    // Check if jikanId exists in manga or anime from Jikan API
    const response = await baseURL.get(`/${type}/${jikanId}`);
    const data = response.data;
    if (!data.data) {
      throw {
        statusCode: 404,
        message: "Manga or Anime not found"
      };
    }

    const title = data.data.title;
    // console.log(data.data);

    // Check if the collection exists
    const collection = await Collection.findByPk(+collectionId);
    if (!collection) {
      throw {
        statusCode: 404,
        message: "Collection not found"
      };
    }

    // Check if jikanId already exists in the collection
    const entryExists = await Entry.findOne({
      where: { collectionId, jikanId }
    });
    if (entryExists) {
      throw {
        statusCode: 400,
        message: "Entry already exists in the collection"
      };
    }

    const entry = await Entry.create({
      title: title,
      type: type,
      progress: progress || 0,
      completed: completed || false,
      collectionId: collectionId,
      jikanId: jikanId
    });

    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
});

// Get all entries for a collection
router.get("/collections/:userId/:collectionId", async (req, res, next) => {
  try {
    const { userId, collectionId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      throw {
        statusCode: 404,
        message: "User not found"
      };
    }

    // Check if the collection exists
    const collection = await Collection.findByPk(+collectionId);
    if (!collection) {
      throw {
        statusCode: 404,
        message: "Collection not found"
      };
    }

    const entries = await Entry.findAll({ where: { collectionId } });

    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
});

// Update an entry
router.put("/entries/:collectionId/:entryId", async (req, res, next) => {
  try {
    const { entryId, collectionId } = req.params;
    let { progress, completed } = req.body;

    // Convert completed to boolean
    if (completed === "true") {
      completed = true;
    }
    if (completed === "false") {
      completed = false;
    }

    // Convert progress to number
    progress = +progress;

    if (isNaN(+progress)) {
      throw {
        statusCode: 400,
        message: "Progress must be a number"
      };
    }

    if (typeof completed !== "boolean") {
      throw {
        statusCode: 400,
        message: "Completed must be a boolean"
      };
    }

    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      throw {
        statusCode: 404,
        message: "Collection not found"
      };
    }

    const entry = await Entry.findByPk(entryId);
    if (!entry) {
      throw {
        statusCode: 404,
        message: "Entry not found"
      };
    } else {
      await Entry.update(
        {
          progress: progress,
          completed: completed
        },
        { where: { id: entryId } }
      );
    }

    const updatedEntry = await Entry.findByPk(entryId);

    res.status(200).json(updatedEntry);
  } catch (error) {
    next(error);
  }
});

// Delete an entry
router.delete("/entries/:collectionId/:entryId", async (req, res, next) => {
  try {
    const { collectionId, entryId } = req.params;

    const collection = await Collection.findByPk(collectionId);
    if (!collection) {
      throw {
        statusCode: 404,
        message: "Collection not found"
      };
    }

    const entry = await Entry.findByPk(entryId);
    if (!entry) {
      throw {
        statusCode: 404,
        message: "Entry not found"
      };
    }
    await entry.destroy();

    res.status(200).json({ message: "Entry deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
