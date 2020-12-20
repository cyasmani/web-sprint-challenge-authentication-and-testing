const jwt = require("jsonwebtoken")
const secrets = require("../config/secrets");

module.exports = (req, res, next) => {

  const [authType, token] = req.headers.authorization.split(" ");
  if(token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err) {
        res.status(401).json({yout: "Token invalid"})
      } else {
        req.decodedJwt = decodedToken
        next();
      }
    })
  } else {
    res.status(401).json({you: "Token required"})
  }
  
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
