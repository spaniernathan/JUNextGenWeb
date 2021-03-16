let express = require('express')
const { models } = require('../../../models')
const { authenticateMiddleware } = require('../../middlewares');
let router = express.Router()

router
// List all users
  .get('/users', authenticateMiddleware, (req, res) => {
    models.users.listUsers((err, rows) => {
      if (err) {
        console.log('API GET /users')
        console.log('listUsers')
        console.log(err)
        res.sendStatus(500);
      } else {
        res.json(rows);
      }
    })
  })
// Get user by ID
  .get('/users/:id', authenticateMiddleware, (req, res) => {
    models.users.getUserByID(req.params.id, (err, row) => {
      if (err) {
        console.log('API GET /users/:id')
        console.log('getUserByID')
        console.log(err)
        res.sendStatus(500);
      } else {
        res.json(row);
      }
    })
  })
// Get user's playlists by UserID
  .get('/users/:id/playlists', authenticateMiddleware, (req, res) => {
    const callbackFn = (err, playlists) => {
      if (err) {
        console.log('API GET /users/:id/playlists');
        console.log(err);
        res.sendStatus(500);
      } else {
        res.json(playlists);
      }
    }
    if (req.user.id === req.params.id) {
      models.playlists.getUserPlaylists(req.params.id, callbackFn);
    } else {
      models.playlists.getPublicUserPlaylists(req.params.id, callbackFn);
    }
  })

module.exports = router
