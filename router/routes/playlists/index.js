let express = require('express')
const { models } = require('../../../models')
let router = express.Router()

// Playlists
router.get('/playlists', (req, res) => {
    models.playlists.listPublicPlaylists((err, playlistRows) => {
        if (err) {
            console.log('GET /playlists')
            console.log('listPublicPlaylists')
            console.log(err)
            req.flash('playlists', 'internal server error')
            res.redirect('/playlists')
        } else {
            res.render("playlists.hbs", {
                navbar: {
                    playlists: true
                },
                currentUser: { ...req.session.currentUser },
                playlists: [ ...playlistRows ],
                message: req.flash('playlists')
            });
        }
    })
})

router.get('/playlist-create', (req, res) => {
    res.render("createPlaylist.hbs", {
        navbar: {},
        currentUser: { ...req.session.currentUser },
        message: req.flash('playlists')
    })
})

router.post('/playlist-create', (req, res) => {
    const { name, description, pub, imgUrl } = req.body;
    if (!name || !description) {
        req.flash('playlists', 'missing name or description');
        res.redirect('/playlist-create');
    } else {
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
                console.log(err)
                req.flash('playlists', 'internal server error')
                res.redirect('/playlist-create')
            } else {
                models.playlists.getUserPlaylists(req.session.currentUser.id, (err, row) => {
                    if (err) {
                        console.log('POST /playlist-create')
                        console.log('getUserPlaylists')
                        console.log(err)
                        req.flash('playlists', 'internal server error')
                        res.redirect('/playlist-create')
                    } else {
                        req.session.currentUser.playlists = row
                        res.redirect(`/playlist/${playlistId}`)
                    }
                })
            }
        })
    }
})

router.get('/playlist/:id', (req, res) => {
    models.playlists.getPlaylistSongs(req.params.id, (err, songs) => {
        if (err) {
            console.log(`GET /playlist/${req.params.id}`)
            console.log('getPlaylistSongs')
            console.log(err)
            req.flash('playlists', 'internal server error')
            res.redirect(`/playlist/${req.params.id}`)
        } else {
            let payload = {
                navbar: {
                    playlists: true
                },
                currentUser: { ...req.session.currentUser },
                playlist: {},
                message: req.flash('playlists')
            };
            if (songs.length === 0) {
                models.playlists.getPlaylist(req.params.id, (err, playlist) => {
                    if (err) {
                        console.log(`GET /playlist/${req.params.id}`)
                        console.log('getPlaylist')
                        console.log(err)
                        req.flash('playlists', 'internal server error')
                        res.redirect(`/playlist/${req.params.id}`)
                    } else {
                        payload.playlist = {
                            id: playlist["id"],
                            name: playlist["name"],
                            description: playlist["description"],
                            imgUrl: playlist["imgUrl"],
                            userDisplayName: playlist["userDisplayName"],
                            public: playlist["public"],
                            songs: [],
                            owned: req.session.currentUser.id === playlist["user_id"],
                        }
                        payload.message = req.flash('playlists')
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
                    public: songs[0]["public"],
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
                payload.message = req.flash('playlists');
                res.render("playlist.hbs", payload);
            }
        }
    })
})

router.post('/playlist-visibility/:playlistId', (req, res) => {
    console.log({ playlistId: req.params.playlistId, pub: req.body.pub }, typeof req.body.pub)
    models.playlists.updatePlaylist({ playlistId: req.params.playlistId, pub: !(req.body.pub === '1') }, (_, err) => {
        if (err) {
            console.log('/playlist-visibility/:playlistId')
            console.log('updatePlaylist')
            console.log(err)
            req.flash('playlists', 'internal server error')
        }
        res.redirect(req.session.previousPath)
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
            console.log(err)
            req.flash('playlists', 'internal server error')
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
            console.log(err)
            req.flash('playlists', 'internal server error')
        }
        res.redirect(req.session.previousPath)
    })
})

router.post('/playlist-delete/:playlistId', (req, res) => {
    models.playlists.deletePlaylist(req.params.playlistId, (err, _) => {
        if (err) {
            console.log('POST /playlist-delete/:playlistId')
            console.log('deletePlaylist')
            console.log(err)
            req.flash('playlists', 'internal server error')
            res.redirect(`/playlist/${req.params.playlistId}`)
        }
        models.playlists.getUserPlaylists(req.session.currentUser.id, (err, row) => {
            if (err) {
                console.log('POST /playlist-delete/:playlistId')
                console.log('getUserPlaylists')
                console.log(err)
                req.flash('playlists', 'internal server error')
                res.redirect(`/playlist/${req.params.playlistId}`)
            } else {
                req.session.currentUser.playlists = row
                res.redirect('/')
            }
        })
    })
})

module.exports = router
