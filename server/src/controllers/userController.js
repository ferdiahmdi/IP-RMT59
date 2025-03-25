const express = require("express");
const router = express.Router();
const { User } = require("../../models");
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
    error.statusCode = 400;
    next(error);
  }
});

module.exports = router;
