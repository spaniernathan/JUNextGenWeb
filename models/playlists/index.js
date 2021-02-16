
const { v4: uuidv4 } = require('uuid');

let PlaylistsDB = class PlaylistsDatabase {
    constructor(database) {
        this.db = database
        database.run("CREATE TABLE IF NOT EXISTS playlists (id VARCHAR(255) UNIQUE NOT NULL, \
            name VARCHAR(255) NOT NULL, \
            description VARCHAR(255) DEFAULT '', \
            public BOOL DEFAULT true, \
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,\
            user_id VARCHAR(255) NOT NULL, \
            imgUrl VARCHAR(255) DEFAULT '', \
            FOREIGN KEY(user_id) REFERENCES users(id), \
            PRIMARY KEY(id) \
        )");
    }

    setPlaylist = ({name, description, pub, userId, imgUrl}, callback) => {
        const playlistId = uuidv4();
        this.db.run(`INSERT INTO playlists (id, name, description, public, user_id, imgUrl) \
        VALUES (?, ?, ?, ?, ?, ?)`, [playlistId, name, description, pub, userId, imgUrl], (err, _) => {
            callback(err, playlistId)
        })
    }

    getPlaylist = (id, callback) => {
        this.db.get(`SELECT * FROM playlists WHERE id = ?`, [id], (err, row) => {
            callback(err, row)
        })
    }

    addSong = ({songId, playlistId}, callback) => {
        this.db.run(`INSERT INTO playlists_songs (id, song_id, playlist_id) \
        VALUES (?, ?, ?)`, [uuidv4(), songId, playlistId], (err, row) => {
            callback(err, row)
        })
    }

    getPublicUserPlaylists = (userId, callback) => {
        return this.db.all(`SELECT * FROM playlists WHERE user_id = ? AND public = true`, [userId], (err, row) => {
            if (callback) {
                callback(err, row);
            }
        })
    }

    getUserPlaylists = (userId, callback) => {
        return this.db.all(`SELECT * FROM playlists WHERE user_id = ?`, [userId], (err, rows) => {
            callback(err, rows)
        })
    }

    getPlaylistSongs = (id, callback) => {
        return this.db.all(`SELECT playlists.id, playlists.name, playlists.description, \
        songs.title, songs.album, songs.artist, songs.duration, songs.imageUrl, \
        songs.id as songId FROM playlists \
                JOIN playlists_songs ON playlists.id = playlist_id \
                JOIN songs ON songs.id = playlists_songs.song_id \
                WHERE playlists.id = ?`, [id], (err, rows) => {
            callback(err, rows)
        })
    }

    listPlaylists = (callback) => {
        return this.db.all(`SELECT * FROM playlists`, (err, rows) => {
            callback(err, rows)
        })
    }

    listPublicPlaylists = (callback) => {
        return this.db.all(`SELECT * FROM playlists WHERE public = true`, (err, rows) => {
            callback(err, rows)
        })
    }

    searchPublicPlaylists = ({ query }, callback) => {
        return this.db.all(`SELECT * FROM playlists WHERE public = true AND (name LIKE '%?%' OR description LIKE '%?%')`, [query, query], (err, rows) => {
            callback(err, rows)
        })
    }
}

module.exports = PlaylistsDB
