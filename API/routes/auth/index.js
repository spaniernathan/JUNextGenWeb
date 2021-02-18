var express = require('express');
const { models } = require('../../../models');
var router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecretkey"

// POST /api/auth/login
router.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  models.users.getUserByUsername(username, (err, user) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if (user == null) {
      res.sendStatus(401);
      return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) res.sendStatus(401);
      else if (!result) res.sendStatus(401);
      else {
        jwt.sign({ id: user.id }, SECRET_KEY, (err, token) => {
          if (err) res.sendStatus(500);
          else
            res.json({
              user: { username: user.username },
              token,
            });
        });
      }
    });
  });
});

module.exports = router
