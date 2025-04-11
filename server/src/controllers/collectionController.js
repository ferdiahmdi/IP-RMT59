const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const cloudinary = require("cloudinary").v2;

const { Collection, User, Entry } = require("../../models");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Create a new collection
router.post("/collections", authMiddleware, async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    // console.log(req.user.id);
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

// Patch a collection to update cover image
router.patch(
  "/collections/:collectionId/cover",
  authMiddleware,
  upload.single("coverImage"),
  async (req, res, next) => {
    try {
      const { collectionId } = req.params;

      // Check if the collection exists
      const collection = await Collection.findByPk(collectionId);
      if (!collection) {
        throw {
          statusCode: 404,
          message: "Collection not found"
        };
      }

      // Update the cover image
      const fileString = req.file.buffer.toString("base64");
      const base64Image = `data:${req.file.mimetype};base64,${fileString}`;
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "cover_images"
      });
      console.log(uploadResponse, "<<< uploadResponse");

      await collection.update({
        coverImage: uploadResponse.secure_url
      });

      res.status(200).json({ message: collection.coverImage });
    } catch (error) {
      next(error);
    }
  }
);

// Get all collections for a user
router.get("/collections/", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;

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
      include: Entry,
      order: [["id", "asc"]],
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    });
    if (!collections) {
      throw {
        name: "NotFound",
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
