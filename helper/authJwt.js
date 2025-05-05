const expressjwt = require('express-jwt');

// Middleware to handle JWT authentication
function authJwt() {
  const secret = process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not defined");
  }

  return expressjwt({
    secret: secret,
    algorithms: ["HS256"],
    // This will extract the token from cookies instead of the Authorization header
    getToken: (req) => {
      if (req.cookies && req.cookies.accessToken) {
        return req.cookies.accessToken;
      }
      return null;
    }
  });
}

module.exports = authJwt;
