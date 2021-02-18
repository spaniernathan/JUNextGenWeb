// Playlists router

var express = require('express');
const { models } = require('../../../models');
const { authenticateMiddleware } = require('../../middlewares');
var router = express.Router();

router
// List all public playlists or filter them
  .get('/playlists', authenticateMiddleware, (req, res) => {
    if (Object.keys(req.query).length === 0) {
      models.playlists.listPublicPlaylists((err, rows) => {
        if (err) {
          res.status(500).json({ "err": "internal server error" });
          return
        }
        res.json(rows);
      })
    } else {
      const { query } = req.query;
      models.playlists.searchPublicPlaylists({ query }, (err, rows) => {
        if (err) {
          res.status(500).json({ "err": "internal server error" });
          return
        }
        res.json(rows);
      })
    }
  })
// Create new playlist
  .post('/playlists', authenticateMiddleware, (req, res) => {
    models.playlists.setPlaylist({}, (err, rox) => {
      if (err) {
        res.status(500).json({ "err": "internal server error" });
        return
      }
    })
    res.json({ "message": `create playlist for current user` })
  })
// Get playlist by ID
  .get('/playlists/:id', authenticateMiddleware, (req, res) => {
    models.playlists.getPlaylist(req.params.id, (err, row) => {
      if (err) {
        res.status(500).json({ "err": "internal server error" });
        return
      }
      res.json(row);
    })
  })
// Update Playlist
  .put('/playlists/:id', authenticateMiddleware, (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `update playlist: ${req.params.id}` })
  })
// Delete playlist
  .delete('/playlists/:id', authenticateMiddleware, (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `delete playlist: ${req.params.id}` })
  })
// Make plyalist private
  .patch('/playlists/:id/hide', authenticateMiddleware, (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `update playlist: ${req.params.id}` })
  })
// Make plyalist public
  .patch('/playlists/:id/unhide', authenticateMiddleware, (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `update playlist: ${req.params.id}` })
  })
// Add a song to a playlist
  .post('/playlists/:playlistId/:songId', authenticateMiddleware, (req, res) => {
    // if playlist is owned by the user
    res.json({ "message": `add song: ${req.params.songId} to playlist ${req.params.playlistId}` })
  })

module.exports = router
