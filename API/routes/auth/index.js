let express = require('express');
const { models } = require('../../../models');
let router = express.Router()
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { salt } = require('../../../pkg/auth')

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
  const { username, displayname, password } = req.body
  if (!username && !displayname && !password) {
    res.status(400).json({'message': 'missing username, displayname or password'})
  } else {
    models.users.getUserByUsername(username, (err, row) => {
      if (err) {
        console.log('API POST /auth/signup')
        console.log('getUserByUsername')
        console.log(err)
        res.sendStatus(500)
      }
      if (row) {
        res.status(400).json({'message': 'username already exists'})
      } else {
        models.users.setUser({
          username,
          password: bcrypt.hashSync(password, salt),
          displayname,
        }, (err, row) => {
          if (err) {
            console.log('API POST /auth/signup')
            console.log('setUser')
            console.log(err)
            res.sendStatus(500)
          } else {
            res.sendStatus(201)
          }
        });
      }
    })
  }
})

module.exports = router
