let { models } = require('../../../models');
var express = require('express')
var router = express.Router()

// Songs router
router
    .get('/', (req, res) => {
        models.songs.listSongs((err, rows) => {
            if (err) {
                res.status(500).json({"err": "internal server error"});
            }
            res.json(rows);
        })
    })
    .post('/', (req, res) => {
        res.json({ "message": `create song` })
    })
    .get('/:id', (req, res) => {
        models.songs.getSong(req.params.id, (err, row) => {
            if (err) {
                res.status(500).json({"err": "internal server error"});
            }
            res.json(row);
        })
    })

module.exports = router
