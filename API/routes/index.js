let express = require('express')
let router = express.Router()

router.use(require('./users'))
router.use(require('./playlists'))
router.use(require('./auth'))
router.use(require('./songs'))

module.exports = router
