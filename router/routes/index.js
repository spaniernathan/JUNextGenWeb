let express = require('express')
let router = express.Router()
let usersRouter = require('./users')
let playlistsRouter = require('./playlists')
let authRouter = require('./auth')
let songsRouter = require('./songs')
const { models } = require('../../models')
const { pathParser, redirectIfNotLoggedIn } = require('../middlewares')

router.use(pathParser)
router.use(redirectIfNotLoggedIn)

router.use(usersRouter)
router.use(songsRouter)
router.use(playlistsRouter)
router.use(authRouter)

router.get('/', (req, res) => {
    models.playlists.listPublicPlaylists((err, playlistRows) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        } else {
            res.render("home.hbs", {
                navbar: {
                    home: true,
                },
                currentUser: { ...req.session.currentUser },
            });
        }
    })
})

router.get('/contact', (req, res) => {
    res.render("contact.hbs", {
        navbar: {
            contact: true
        },
        currentUser: { ...req.session.currentUser },
    })
})

router.get('/about', (req, res) => {
    res.render("about.hbs", {
        navbar: {
            about: true
        },
        currentUser: { ...req.session.currentUser },
    })
})

module.exports = router
