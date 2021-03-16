let { models } = require('../../../models');
let express = require('express');
const { authenticateMiddleware } = require('../../middlewares');
let router = express.Router();

// Songs router
router
    .get('/songs', authenticateMiddleware, (req, res) => {
        if (!!req.query.query) {
            models.songs.searchSongs({ query: req.query.query }, (err, rows) => {
                if (err) {
                    console.log('API GET /songs')
                    console.log('searchSongs')
                    console.log(err)
                    res.sendStatus(500);
                } else {
                    res.json(rows);
                }
            })
        } else {
            models.songs.listSongs((err, rows) => {
                if (err) {
                    console.log('API GET /songs')
                    console.log('listSongs')
                    console.log(err)
                    res.sendStatus(500);
                } else {
                    res.json(rows);
                }
            })
        }
    })
    .post('/songs', authenticateMiddleware, (req, res) => {
        const { title, artist, album, duration, imageUrl } = req.body
        if (typeof title === 'undefined' || typeof artist === 'undefined' || typeof album === 'undefined' || typeof duration === 'undefined' || 
        title === "" || artist === "" || album === "" || duration === 0) {
            res.status(400).json({ "err": "songs must contain all those following: title, artist, album, duration" })
        } else {
            models.songs.setSong({ title, artist, album, duration, imageUrl: imageUrl || "" }, (err, rows) => {
                if (err) {
                    console.log('API POST /songs')
                    console.log('setSong')
                    console.log(err)
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            })
        }
    })
    .get('/songs/:id', authenticateMiddleware, (req, res) => {
        models.songs.getSong(req.params.id, (err, row) => {
            if (err) {
                console.log('API GET /songs/:id')
                console.log('getSong')
                console.log(err)
                res.sendStatus(500);
            } else {
                res.json(row);
            }
        })
    })

module.exports = router
