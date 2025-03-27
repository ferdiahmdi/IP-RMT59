const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET);
}

function authMiddleware(req, res, next) {
  const [bearer, token] = req.headers.authorization.split(" ");

  if (!token || bearer !== "Bearer") {
    throw { statusCode: 401, message: "Unauthorized" };
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { authMiddleware, generateToken };
