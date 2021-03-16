let express = require('express');
const { models } = require('../../../models');
let router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecretkey"

// POST /api/auth/login
router.post("/auth/login", (req, res) => {
  const { username, password, grant_type } = req.body;
  if (grant_type !== "password") {
    res.sendStatus(400)
  }
  models.users.getUserByUsername(username, (err, user) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if (user === null) {
      res.sendStatus(401);
      return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) res.sendStatus(401);
      else if (!result) res.sendStatus(401);
      else {
        jwt.sign({ id: user.id }, SECRET_KEY, (err, access_token) => {
          if (err) res.sendStatus(500);
          else {
            jwt.sign({ sub: user.id, preferred_username: user.displayname }, SECRET_KEY, (err, id_token) => {
              if (err) res.sendStatus(500);
              else {
                res.status(200).json({
                  access_token,
                  token_type: "Bearer",
                  id_token,
                });
              }
            });
          }
        });
      }
    });
  });
});

router.post('/auth/signup', (req, res) => {

})

module.exports = router
