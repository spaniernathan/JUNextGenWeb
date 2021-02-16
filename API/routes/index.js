let express = require('express')
let router = express.Router()
let usersRouter = require('./users')
let playlistsRouter = require('./playlists')
let authRouter = require('./auth')
let songsRouter = require('./songs')

router.use('/users', usersRouter)
router.use('/playlists', playlistsRouter)
router.use('/auth', authRouter)
router.use('/songs', songsRouter)

module.exports = router
