var express = require('express')
const { models } = require('../../../models')
var router = express.Router()

// Playlists
router.get('/playlists', (req, res) => {
    models.playlists.listPublicPlaylists((err, playlistRows) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        }
        res.render("playlists.hbs", {
            navbar: {
                playlists: true
            },
            currentUser: { ...req.session.currentUser },
            playlists: [...playlistRows],
        });
    })
})

router.get('/playlist-create', (req, res) => {
    res.render("createPlaylist.hbs", {
        navbar: {},
        currentUser: { ...req.session.currentUser },
    })
})

router.post('/playlist-create', (req, res) => {
    const { name, description, pub, imgUrl } = req.body;
    models.playlists.setPlaylist({
        name,
        description,
        pub: pub === 'on',
        userId: req.session.currentUser.id,
        imgUrl,
    }, (err, playlistId) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        } else {
            models.playlists.getUserPlaylists(req.session.currentUser.id, (err, row) => {
                req.session.currentUser.playlists = row
                res.redirect(`/playlist/${playlistId}`)
            })
        }
    })
})

router.get('/playlist/:id', (req, res) => {
    models.playlists.getPlaylistSongs(req.params.id, (err, rows) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        } else {
            let payload = {
                navbar: {
                    playlists: true
                },
                currentUser: { ...req.session.currentUser },
                playlist: {}
            };
            if (rows.length === 0) {
                models.playlists.getPlaylist(req.params.id, (err, row) => {
                    if (err) {
                        console.log(err)
                        // TODO: HANDLE ERROR
                    } else {
                        payload.playlist = {
                            name: row["name"],
                            description: row["description"],
                            imgUrl: row["imgUrl"],
                            songs: [],
                        }
                        res.render("playlist.hbs", payload)
                    }
                })
            } else {
                payload.playlist = {
                    name: rows[0]["name"],
                    description: rows[0]["description"],
                    imgUrl: rows[0]["imgUrl"],
                    songs: rows.reduce((prev, curr) => {
                        return [...prev, {
                            id: curr["songId"],
                            title: curr["title"],
                            artist: curr["artist"],
                            album: curr["album"],
                            duration: curr["duration"],
                            imageUrl: curr["imageUrl"],
                        }]
                    }, []),
                };
                res.render("playlist.hbs", payload);
            }
        }
    })
})

router.post('/playlist/:playlistId/:songId', (req, res) => {
    models.playlists.addSong({
        songId: req.params.songId,
        playlistId: req.params.playlistId,
    }, (err, _) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        }
        res.redirect(req.session.previousPath)
    })
})

module.exports = router
