let express = require('express')
const { models } = require('../../../models')
let router = express.Router()

// Playlists
router.get('/playlists', (req, res) => {
    models.playlists.listPublicPlaylists((err, playlistRows) => {
        if (err) {
            console.log('GET /playlists')
            console.log('listPublicPlaylists')
            console.log('error: ', err)
            // TODO: Handle error
        }
        res.render("playlists.hbs", {
            navbar: {
                playlists: true
            },
            currentUser: { ...req.session.currentUser },
            playlists: [ ...playlistRows ],
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
        imgUrl: imgUrl || "",
    }, (err, playlistId) => {
        if (err) {
            console.log('POST /playlist-create')
            console.log('setPlaylist')
            console.log('error: ', err)
            // TODO: Handle error
        } else {
            models.playlists.getUserPlaylists(req.session.currentUser.id, (err, row) => {
                if (err) {
                    console.log('POST /playlist-create')
                    console.log('getUserPlaylists')
                    console.log('error: ', err)
                    // TODO: Handle error
                } else {
                    req.session.currentUser.playlists = row
                    res.redirect(`/playlist/${playlistId}`)
                }
            })
        }
    })
})

router.get('/playlist/:id', (req, res) => {
    models.playlists.getPlaylistSongs(req.params.id, (err, songs) => {
        if (err) {
            console.log(`GET /playlist/${req.params.id}`)
            console.log('getPlaylistSongs')
            console.log('error: ', err)
            // TODO: Handle error
        } else {
            let payload = {
                navbar: {
                    playlists: true
                },
                currentUser: { ...req.session.currentUser },
                playlist: {},
            };
            if (songs.length === 0) {
                models.playlists.getPlaylist(req.params.id, (err, playlist) => {
                    if (err) {
                        console.log(`GET /playlist/${req.params.id}`)
                        console.log('getPlaylist')
                        console.log('error: ', err)
                        // TODO: HANDLE ERROR
                    } else {
                        payload.playlist = {
                            id: playlist["id"],
                            name: playlist["name"],
                            description: playlist["description"],
                            imgUrl: playlist["imgUrl"],
                            userDisplayName: playlist["userDisplayName"],
                            songs: [],
                            owned: req.session.currentUser.id === playlist["user_id"]
                        }
                        res.render("playlist.hbs", payload)
                    }
                })
            } else {
                payload.playlist = {
                    id: songs[0]["id"],
                    name: songs[0]["name"],
                    description: songs[0]["description"],
                    imgUrl: songs[0]["imgUrl"],
                    userDisplayName: songs[0]["userDisplayName"],
                    owned: req.session.currentUser.id === songs[0]["user_id"],
                    songs: songs.reduce((prev, curr) => {
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
            console.log('POST /playlist/:playlistId/:songId')
            console.log('addSong')
            console.log('error: ', err)
            // TODO: Handle error
        }
        res.redirect(req.session.previousPath)
    })
})

router.post('/playlist-delete/:playlistId/:songId', (req, res) => {
    models.playlists.removeSong({
        songId: req.params.songId,
        playlistId: req.params.playlistId,
    }, (err, _) => {
        if (err) {
            console.log('POST /playlist-delete/:playlistId/:songId')
            console.log('removeSong')
            console.log('error: ', err)
            // TODO: Handle error
        }
        res.redirect(req.session.previousPath)
    })
})

router.post('/playlist-delete/:playlistId', (req, res) => {
    models.playlists.deletePlaylist(req.params.playlistId, (err, _) => {
        if (err) {
            console.log('POST /playlist-delete/:playlistId')
            console.log('deletePlaylist')
            console.log('error: ', err)
            // TODO: Handle error
        }
        models.playlists.getUserPlaylists(req.session.currentUser.id, (err, row) => {
            if (err) {
                console.log('POST /playlist-delete/:playlistId')
                console.log('getUserPlaylists')
                console.log('error: ', err)
                // TODO: Handle error
            } else {
                req.session.currentUser.playlists = row
                res.redirect('/')
            }
        })
    })
})

module.exports = router
