const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" } // short life
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "7d" } // long life
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
