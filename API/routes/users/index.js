// Users router

let express = require('express')
let router = express.Router()

router
  .get('/', (req, res) => {
    res.json({ "message": "list all users" })
  })

router
  .get('/:id', (req, res) => {
    res.json({ "message": `get user by id: ${req.params.id}` })
  })

router
  .get('/:id/playlists', (req, res) => {
    res.json({ "message": `get public playlists from user: ${req.params.id}` })
  })

module.exports = router
