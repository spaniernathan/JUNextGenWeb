// Playlists router

let express = require('express');
const { models } = require('../../../models');
const { authenticateMiddleware, userOwnPlaylist } = require('../../middlewares');
let router = express.Router();

router
  // List all public playlists or filter them
  .get('/playlists', authenticateMiddleware, (req, res) => {
    if (Object.keys(req.query).length === 0) {
      models.playlists.listPublicPlaylists((err, rows) => {
        if (err) {
          res.sendStatus(500);
          console.log('API GET /playlists')
          console.log('listPublicPlaylists')
          console.log(err)
        } else {
          res.json(rows);
        }
      })
    } else {
      const { query } = req.query;
      models.playlists.searchPublicPlaylists({ query }, (err, rows) => {
        if (err) {
          res.sendStatus(500);
          console.log('API GET /playlists')
          console.log('searchPublicPlaylists')
          console.log(err)
        } else {
          res.json(rows);
        }
      })
    }
  })
  // Create new playlist
  .post('/playlists', authenticateMiddleware, (req, res) => {
    const { name, description, pub, imgUrl } = req.body;
    if (!name || !description || !pub) {
      res.status(400).json({'message': `missing name, description or pub`})
    }
    models.playlists.setPlaylist({name, description, pub, userId: req.user.id, imgUrl: imgUrl || ''}, (err, row) => {
      if (err) {
        console.log('API POST /playlists')
        console.log('setPlaylist')
        console.log(err)
        res.sendStatus(500);
      } else {
        res.sendStatus(201)
      }
    })
  })
  // Get playlist by ID
  .get('/playlists/:playlistId', authenticateMiddleware, (req, res) => {
    models.playlists.getPlaylist(req.params.playlistId, (err, row) => {
      if (err) {
        res.sendStatus(500);
        console.log('API GET /playlists/:playlistId')
        console.log('getPlaylist')
        console.log(err)
      } else {
        res.json(row);
      }
    })
  })
  // Update Playlist
  .put('/playlists/:playlistId', [authenticateMiddleware, userOwnPlaylist], (req, res) => {
    const {description, imgUrl, name, pub} = req.body;
    models.playlists.updatePlaylist({playlistId: req.params.playlistId, description, imgUrl, name, pub}, (err, row) => {
      if (err) {
        res.sendStatus(500);
        console.log('API PUT /playlists/:playlistId')
        console.log('updatePlaylist')
        console.log(err)
      } else {
        res.sendStatus(200);
      }
    })
  })
  // Delete playlist
  .delete('/playlists/:playlistId', [authenticateMiddleware, userOwnPlaylist], (req, res) => {
    models.playlists.deletePlaylist(req.params.playlistId, (err, row) => {
      if (err) {
        console.log('API DELETE /playlists/:playlistId')
        console.log('deletePlaylist')
        console.log(err)
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    })
  })

  // Make playlist private
  .patch('/playlists/:playlistId/hide', [authenticateMiddleware, userOwnPlaylist], (req, res) => {
    models.playlists.updatePlaylist({playlistId: req.params.playlistId, pub: false}, (err, _) => {
      if (err) {
        console.log('API PATCH /playlists/:playlistId/hide')
        console.log('updatePlaylist')
        console.log(err)
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    })
  })
  // Make playlist public
  .patch('/playlists/:playlistId/unhide', [authenticateMiddleware, userOwnPlaylist], (req, res) => {
    models.playlists.updatePlaylist({playlistId: req.params.playlistId, pub: true}, (err, _) => {
      if (err) {
        console.log('API PATCH /playlists/:playlistId/unhide')
        console.log('updatePlaylist')
        console.log(err)
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    })
  })
  // Add a song to a playlist
  .post('/playlists/:playlistId/:songId', [authenticateMiddleware, userOwnPlaylist], (req, res) => {
    const { songId, playlistId } = req.params;
    models.playlists.addSong({songId, playlistId}, (err, row) => {
      if (err) {
        console.log('API POST /playlists/:playlistId/:songId')
        console.log('addSong')
        console.log(err)
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    })
  })

module.exports = router
