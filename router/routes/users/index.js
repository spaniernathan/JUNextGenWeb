let express = require('express')
const { models } = require('../../../models')
let router = express.Router()

router.get('/users', (req, res) => {
    models.users.listUsers((err, usersRows) => {
        if (err) {
            console.log('GET /users')
            console.log('listUsers')
            console.log(err)
            req.flash('users', 'internal server error')
            res.redirect('/users')
        } else {
            res.render("users.hbs", {
                navbar: {
                    users: true
                },
                currentUser: { ...req.session.currentUser },
                users: [...usersRows],
                message: req.flash('users')
            });
        }
    })
})

router.get('/users/:id', (req, res) => {
    models.users.getUserByID(req.params.id, (err, userRow) => {
        if (err) {
            console.log(`GET /users/${req.params.id}`)
            console.log('getUserByID')
            console.log(err)
            req.flash('users', 'internal server error')
            res.redirect(`/users/${req.params.id}`)
        } else {
            const payload = {
                navbar: {
                    users: true
                },
                currentUser: { ...req.session.currentUser },
                user: {},
                message: req.flash('users')
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
                payload.message = req.flash('users')
                res.render("user.hbs", payload);
            }
            const callbackUserPlaylist = (err, rows) => {
                if (err) {
                    console.log(`GET /users/${req.params.id}`)
                    console.log(err)
                    req.flash('users', 'internal server error')
                    res.redirect(`/users/${req.params.id}`)
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
        message: req.flash('users')
    };
    res.render('profile.hbs', payload);
})

module.exports = router
