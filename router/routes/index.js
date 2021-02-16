let express = require('express')
let router = express.Router()
let usersRouter = require('./users')
let playlistsRouter = require('./playlists')
let authRouter = require('./auth')

router.use('/users', usersRouter)
router.use('/playlists', playlistsRouter)
router.use('/auth', authRouter)

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

router.all('*', (req, res) => {
    res.render("404.hbs")
});

module.exports = router
