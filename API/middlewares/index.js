const jwt = require("jsonwebtoken");
const { models } = require('../../models');

const SECRET_KEY = "supersecretkey";

const authenticateMiddleware = (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ");
    if (token == null) return res.sendStatus(401);
    if (token[0] !== "Bearer") return res.sendStatus(401);
    jwt.verify(token[1], SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

const userOwnPlaylist = (req, res, next) => {
    const { playlistId } = req.params
    if (!!playlistId) {
        models.playlists.getPlaylist(playlistId, (err, playlist) => {
            if (err) {
                console.log('MIDDLEWARE userOwnPlaylist')
                console.log('getPlaylist')
                console.log(err)
                res.sendStatus(500)
            }
            playlist.user_id === req.user.id ? next() : res.sendStatus(403)
        })
    } else {
        res.sendStatus(400)
    }
}

module.exports = {
    authenticateMiddleware,
    userOwnPlaylist,
}
