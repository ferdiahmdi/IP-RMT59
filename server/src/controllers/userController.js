const express = require("express");
const router = express.Router();
const { User, Collection } = require("../../models");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new user
router.post("/add-user", async (req, res, next) => {
  try {
    const { email, name, googleId } = req.body;
    const user = await User.create({
      email: email,
      name: name,
      googleId: googleId
    });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
