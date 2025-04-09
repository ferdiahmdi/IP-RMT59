const express = require("express");
const router = express.Router();
const { User } = require("../../models");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const { generateToken } = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");

// Handle user login
router.post("/login", async (req, res, next) => {
  try {
    const { token } = req.body;

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    const [user, created] = await User.findOrCreate({
      where: {
        email: payload.email
      },
      defaults: {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub
      }
    });
    console.log(user, "<<< user");
    console.log(created, "<<< created");

    const { id } = user;
    const access_token = generateToken({ id });

    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);

    res.status(200).json({ access_token, id: decoded.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
