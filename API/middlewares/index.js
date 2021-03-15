const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecretkey"

const authenticateMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ");
    if (token == null) return res.sendStatus(401);
    if (token[0] !== "Bearer") return res.sendStatus(401);
    jwt.verify(token[1], SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

module.exports = {
    authenticateMiddleware,
}
