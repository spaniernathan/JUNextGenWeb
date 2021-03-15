let express = require('express')
const { models } = require('../../../models')
let router = express.Router()

router.get('/users', (req, res) => {
    models.users.listUsers((err, usersRows) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        }
        res.render("users.hbs", {
            navbar: {
                users: true
            },
            currentUser: { ...req.session.currentUser },
            users: [...usersRows],
        });
    })
})

router.get('/users/:id', (req, res) => {
    models.users.getUserByID(req.params.id, (err, userRow) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        } else {
            const payload = {
                navbar: {
                    users: true
                },
                currentUser: { ...req.session.currentUser },
                user: {}
            }
            const callback = (payload, rows) => {
                payload.user = {
                    displayname: userRow["displayname"],
                    playlists: rows.reduce((prev, curr) => {
                        return [...prev, {
                            id: curr["id"],
                            name: curr["name"],
                            description: curr["description"],
                            public: curr["public"],
                            createdAt: curr["created_at"],
                            imgUrl: curr["imgUrl"],
                        }]
                    }, []),
                }
                res.render("user.hbs", payload);
            }
            const callbackUserPlaylist = (err, rows) => {
                if (err) {
                    console.log(err)
                    // TODO: Handle error
                } else {
                    callback(payload, rows);
                }
            }
            if (req.session.currentUser.id === req.params.id) {
                models.playlists.getUserPlaylists(req.params.id, callbackUserPlaylist)
            } else {
                models.playlists.getPublicUserPlaylists(req.params.id, callbackUserPlaylist)
            }
        }
    })
})

router.get('/profile', (req, res) => {
    const payload = {
        navbar: {},
        currentUser: { ...req.session.currentUser },
    };
    res.render('profile.hbs', payload);
})

module.exports = router
