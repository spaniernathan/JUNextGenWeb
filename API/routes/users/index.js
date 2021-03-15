let express = require('express')
const { models } = require('../../../models')
const { authenticateMiddleware } = require('../../middlewares');
let router = express.Router()

router
// List all users
  .get('/users', authenticateMiddleware, (req, res) => {
    models.users.listUsers((err, rows) => {
      if (err) {
        res.sendStatus(500);
        return
      }
      res.json(rows);
    })
  })
// Get user by ID
  .get('/users/:id', authenticateMiddleware, (req, res) => {
    models.users.getUserByID(req.params.id, (err, row) => {
      if (err) {
        res.sendStatus(500);
        return
      }
      res.json(row);
    })
  })
// Get user's playlists by UserID
  .get('/users/:id/playlists', authenticateMiddleware, (req, res) => {
    // if current user getUserPlaylists
    // else getPublicUserPlaylists
  })

module.exports = router
