const sqlite3 = require('sqlite3').verbose();
var path = require('path');
let usersModels = require('./users');
let songsModels = require('./songs');
let playlistsModels = require('./playlists');

class Models {
    constructor() {
        this.database = new sqlite3.Database(path.resolve(__dirname) + '/db/sqlite3.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error("Database error: ", err.message);
                process.exit(2)
            } else {
              console.log("Successfuly connected to database");
            }
          });;
          this.database.serialize(() => {
            this.database.run("PRAGMA foreign_keys = ON");
            this.songs = new songsModels(this.database);
            this.users = new usersModels(this.database);
            this.playlists = new playlistsModels(this.database);
            this.database.run("CREATE TABLE IF NOT EXISTS playlists_songs( \
                id VARCHAR(255) UNIQUE NOT NULL, \
                song_id VARCHAR(255) NOT NULL, \
                playlist_id VARCHAR(255) NOT NULL \
            )");
        });
    }

    close = () => {
        this.database.close()
    }
};

let models = new Models();

/*
models.database.run("SELECT name FROM sqlite_master WHERE type = 'table'", (err, rows) => {
        console.log("err: ", err)
        console.log("rows: ", rows)
    })
*/

module.exports = {
    models
};
