const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  let accessToken;
  // Check for the access token in the Authorization header (Bearer token)
  if (req?.headers?.authorization?.startsWith('Bearer')) {
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.accessToken) {
    // If no access token in headers, check for it in cookies
    accessToken = req.cookies.accessToken;
    console.log("Access Token found in cookies: ", accessToken);
  } else {
    console.log("No access token found in header or cookies.");
    return res.status(401).json({ message: "No access token provided" });
  }
  // Now, we verify the access token using the JWT_SECRET_KEY
  try {
    // Decode the token and get the user ID
    console.log("JWT_SECRET used for verification:", process.env.JWT_SECRET_KEY);
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);

    console.log("Decoded Access Token: ", decoded); 
    // Find the user based on the decoded ID
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      console.error("User not found in database for decoded ID: ", decoded.id);
      return res.status(401).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    console.log("User found and attached to request: ", user);

    // If everything is fine, call next() to pass the request to the next handler
    next();
  } catch (error) {
    console.error("Error during JWT verification: ", error);

    // Check if the token is expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired, please refresh" });
    }

    return res.status(401).json({ message: "Token expired or invalid, please log in again" });
  }
};

module.exports = authMiddleware;
