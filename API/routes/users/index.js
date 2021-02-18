// Users router

let express = require('express')
const { models } = require('../../../models')
const { authenticateMiddleware } = require('../../middlewares');
let router = express.Router()

router
// List all users
  .get('/users', authenticateMiddleware, (req, res) => {
    models.users.listUsers((err, rows) => {
      if (err) {
        res.status(500).json({ "err": "internal server error" });
        return
      }
      res.json(rows);
    })
  })
// Get user by ID
  .get('/users/:id', authenticateMiddleware, (req, res) => {
    models.users.getUserByID(req.params.id, (err, row) => {
      if (err) {
        res.status(500).json({ "err": "internal server error" });
        return
      }
      res.json(row);
    })
  })
// Get user by ID playlists
  .get('/users/:id/playlists', authenticateMiddleware, (req, res) => {
    // if current user getUserPlaylists
    // else getPublicUserPlaylists
  })

module.exports = router
