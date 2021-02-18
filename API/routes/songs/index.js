let { models } = require('../../../models');
var express = require('express');
const { authenticateMiddleware } = require('../../middlewares');
var router = express.Router();

// Songs router
router
    .get('/songs', authenticateMiddleware, (req, res) => {
        if (Object.keys(req.query).length === 0) {
            models.songs.listSongs((err, rows) => {
                if (err) {
                    res.status(500).json({ "err": "internal server error" });
                    return
                }
                res.json(rows);
            })
        } else {
            const { query } = req.query;
            models.songs.searchSongs({ query }, (err, rows) => {
                if (err) {
                    console.log(err)
                    res.status(500).json({ "err": "internal server error" });
                    return
                }
                res.json(rows);
            })
        }
    })
    .post('/songs', authenticateMiddleware, (req, res) => {
        const { title, artist, album, duration, imageUrl } = req.body
        if (typeof title === 'undefined' || typeof artist === 'undefined' || typeof album === 'undefined' || typeof duration === 'undefined' || 
        title === "" || artist === "" || album === "" || duration === 0) {
            res.status(500).json({ "err": "songs must contain all those following: title, artist, album, duration" })
            return
        }
        models.songs.setSong({ title, artist, album, duration, imageUrl: imageUrl || "" }, (err, rows) => {
            if (err) {
                res.status(500).json({ "err": "internal server error" });
                return
            }
            res.status(200).json({ "msg": "song successfully created "});
        })
    })
    .get('/songs/:id', authenticateMiddleware, (req, res) => {
        models.songs.getSong(req.params.id, (err, row) => {
            if (err) {
                res.status(500).json({ "err": "internal server error" });
                return
            }
            res.json(row);
        })
    })

module.exports = router
