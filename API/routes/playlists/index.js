// Playlists router

var express = require('express')
const { models } = require('../../../models')
var router = express.Router()

router
  .get('/', (req, res) => {
    if (Object.keys(req.query).length === 0) {
      models.playlists.listPublicPlaylists((err, rows) => {
        if (err) {
          res.status(500).json({"err": "internal server error"});
      }
      res.json(rows);
      })
    } else {
      const { query } = req.query;
      models.playlists.searchPublicPlaylists({ query }, (err, rows) => {
        if (err) {
          console.log(err)
          res.status(500).json({"err": "internal server error"});
      }
      res.json(rows);
      })
    }
  })
  .post('/', (req, res) => {
    res.json({ "message": `create playlist for current user` })
  })
  .get('/:id', (req, res) => {
    models.playlists.getPlaylist(req.params.id, (err, row) => {
      if (err) {
        res.status(500).json({"err": "internal server error"});
    }
    res.json(row);
    })
  })
  .put('/:id', (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `update playlist: ${req.params.id}` })
  })
  .delete('/:id', (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `delete playlist: ${req.params.id}` })
  })
  .get('/:playlistId/:songId', (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `add song: ${req.params.songId} to playlist ${req.params.playlistId}` })
  })

module.exports = router
