
const { v4: uuidv4 } = require('uuid');

let SongsDB = class SongsDatabase {
    constructor(database) {
        this.db = database
        database.run("CREATE TABLE IF NOT EXISTS songs(id VARCHAR(255) UNIQUE NOT NULL, \
            title VARCHAR(255) NOT NULL, \
            artist VARCHAR(255) NOT NULL, \
            album VARCHAR(255) NOT NULL, \
            duration INTEGER NOT NULL, \
            imageUrl VARCHAR(255) default '', \
            PRIMARY KEY (id) \
        )");
    }

    setSong = ({title, artist, album, duration, imageUrl}) => {
        this.db.run(`INSERT INTO songs (id, title, artist, album, duration, imageUrl) \
        VALUES (?, ?, ?, ?, ?, ?)`, [uuidv4(), title, artist, album, duration, imageUrl])
    }

    getSong = (id, callback) => {
        return this.db.get(`SELECT * FROM songs WHERE id = '${id}'`, (err, row) => {
            callback(err, row);
        })
    }

    listSongs = (callback) => {
        return this.db.all(`SELECT * FROM songs`, (err, rows) => {
            callback(err, rows);
        })
    }
};

module.exports = SongsDB
