// Playlists router

let express = require('express');
const { models } = require('../../../models');
const { authenticateMiddleware } = require('../../middlewares');
let router = express.Router();

router
  // List all public playlists or filter them
  .get('/playlists', authenticateMiddleware, (req, res) => {
    if (Object.keys(req.query).length === 0) {
      models.playlists.listPublicPlaylists((err, rows) => {
        if (err) {
          res.sendStatus(500);
          return
        }
        res.json(rows);
      })
    } else {
      const { query } = req.query;
      models.playlists.searchPublicPlaylists({ query }, (err, rows) => {
        if (err) {
          res.sendStatus(500);
          return
        }
        res.json(rows);
      })
    }
  })
  // Create new playlist
  .post('/playlists', authenticateMiddleware, (req, res) => {
    // complete payload
    models.playlists.setPlaylist({}, (err, row) => {
      if (err) {
        res.sendStatus(500);
        return
      }
    })
    res.json({ "message": `create playlist for current user` })
  })
  // Get playlist by ID
  .get('/playlists/:id', authenticateMiddleware, (req, res) => {
    models.playlists.getPlaylist(req.params.id, (err, row) => {
      if (err) {
        res.sendStatus(500);
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
    models.playlists.getUserPlaylists(req.user.id, (err, rows) => {
      if (err) {
        console.error(err)
        res.sendStatus(500);
        return;
      } else {
        rows.forEach(p => {
          console.log(p.id, ' === ', req.params.id)
          if (p.id === req.params.id) {
            models.playlists.deletePlaylist(req.params.id, (err, row) => {
              if (err) {
                console.error(err)
                res.sendStatus(500);
                return;
              } else {
                res.json({ "msg": "success" });
                return;
              }
            })
          }
        });
      }
    })
    res.sendStatus(403);
    return;
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
