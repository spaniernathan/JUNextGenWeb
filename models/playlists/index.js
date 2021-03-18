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
        this.db.get(`SELECT p.*, users.displayname AS userDisplayName \
        FROM playlists AS p \
        INNER JOIN users ON users.id = p.user_id \
        WHERE p.id = ?`, [id], (err, row) => {
            callback(err, row)
        })
    }

    addSong = ({songId, playlistId}, callback) => {
        this.db.run(`INSERT INTO playlists_songs (id, song_id, playlist_id) \
        VALUES (?, ?, ?)`, [uuidv4(), songId, playlistId], (err, row) => {
            callback(err, row)
        })
    }

    removeSong = ({songId, playlistId}, callback) => {
        this.db.run(`DELETE FROM playlists_songs WHERE id = (SELECT id FROM playlists_songs WHERE song_id = ? AND playlist_id = ? LIMIT 1)`, [songId, playlistId], (err, row) => {
            callback(err, row)
        })
    }

    getPublicUserPlaylists = (userId, callback) => {
        return this.db.all(`SELECT p.*, users.displayname AS userDisplayName \
        FROM playlists AS p \
        INNER JOIN users ON users.id = p.user_id \
        WHERE p.user_id = ? AND p.public = true`, [userId], (err, row) => {
            if (callback) {
                callback(err, row);
            }
        })
    }

    getUserPlaylists = (userId, callback) => {
        return this.db.all(`SELECT p.*, users.displayname AS userDisplayName \
        FROM playlists AS p \
        INNER JOIN users ON users.id = p.user_id \
        WHERE p.user_id = ?`, [userId], (err, rows) => {
            callback(err, rows)
        })
    }

    getPlaylistSongs = (id, callback) => {
        return this.db.all(`SELECT playlists.*, 
        songs.title, songs.album, songs.artist, songs.duration, songs.imageUrl, 
        songs.id as songId, users.displayname AS userDisplayName FROM playlists
                JOIN playlists_songs ON playlists.id = playlist_id 
                JOIN songs ON songs.id = playlists_songs.song_id
                JOIN users ON users.id = playlists.user_id 
                WHERE playlists.id = ?`, [id], (err, rows) => {
            callback(err, rows)
        })
    }

    listPublicPlaylists = (callback) => {
        return this.db.all(`SELECT p.*, users.displayname AS userDisplayName \
        FROM playlists AS p \
        INNER JOIN users ON users.id = p.user_id \
        WHERE p.public = true`, (err, rows) => {
            callback(err, rows)
        })
    }

    searchPublicPlaylists = ({ query }, callback) => {
        return this.db.all(`SELECT p.*, users.displayname AS userDisplayName \
        FROM playlists AS p \
        INNER JOIN users ON users.id = p.user_id \
        WHERE p.public = true AND (name LIKE ? OR description LIKE ?)`, [`%${query}%`, `%${query}%`], (err, rows) => {
            callback(err, rows)
        })
    }

    deletePlaylist = (id, callback) => {
        return this.db.run(`DELETE FROM playlists WHERE id = ?`, [id], (err, rows) => {
            if (err) { callback(err, rows) }
            this.db.run(`DELETE FROM playlists_songs WHERE playlist_id = ?`, [id], (err, rows) => {
                callback(err, rows)
            })
        })
    }

    updatePlaylist = (payload, callback) => {
        const {playlistId, description, imgUrl, name, pub} = payload;
        return this.db.get(`SELECT * from playlists WHERE id = ?`, [playlistId], (err, playlist) => {
            if (err) {
                callback(err, null)
            } else {
                this.db.run(`UPDATE playlists SET description = ?, imgUrl = ?, name = ?, public = ? WHERE id = ?`,
                    [description || playlist.description, imgUrl || playlist.imgUrl, name || playlist.name, pub, playlistId], (err, row) => {
                        callback(err, row)
                    })
            }
        })
    }
}

module.exports = PlaylistsDB
