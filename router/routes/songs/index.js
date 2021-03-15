let express = require('express')
const { models } = require('../../../models')
let router = express.Router()

// Playlists
router.get('/songs', (req, res) => {
    if (req.query.query) {
        models.songs.searchSongs({ query: req.query.query}, (err, songsRows) => {
            if (err) {
                console.log('GET /songs')
                console.log('searchSongs')
                console.log(err)
                // TODO: Handle error
            }
            res.render("songs.hbs", {
                navbar: {
                    songs: true
                },
                currentUser: { ...req.session.currentUser },
                songs: [ ...songsRows ],
            });
        })
    } else {
        models.songs.listSongs((err, songsRows) => {
            if (err) {
                console.log('GET /songs')
                console.log('listSongs')
                console.log(err)
                // TODO: Handle error
            }
            res.render("songs.hbs", {
                navbar: {
                    songs: true
                },
                currentUser: { ...req.session.currentUser },
                songs: [ ...songsRows ],
            });
        })
    }
})

module.exports = router