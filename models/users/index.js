
const { v4: uuidv4 } = require('uuid');

let UsersDB = class UsersDatabase {
    constructor(database) {
        this.db = database
        database.run("CREATE TABLE IF NOT EXISTS users(id VARCHAR(255) UNIQUE NOT NULL,\
            username VARCHAR(255) UNIQUE NOT NULL,\
            password VARCHAR(255) NOT NULL,\
            displayname VARCHAR(255) DEFAULT '',\
            PRIMARY KEY (id)\
        )");
    }

    setUser = ({username, password, displayname}, callback) => {
        this.db.run(`INSERT INTO users (id, username, password, displayname) \
        VALUES (?, ?, ?, ?)`, [uuidv4(), username, password, displayname], (err, row) => {
            if (callback) {
                callback(err, row)
            }
        })
    }

    getUserByID = (id, callback) => {
        return this.db.get(`SELECT id, username, displayname FROM users WHERE id = ?`, [id], (err, row) => {
            if (callback) {
                callback(err, row)
            }
        })
    }

    getUserByUsername = (username, callback) => {
        return this.db.get(`SELECT * FROM users WHERE username = '${username}'`, (err, row) => {
            if (callback) {
                callback(err, row)
            }
        })
    }

    listUsers = (callback) => {
        return this.db.all(`SELECT id, username, displayname FROM users`, (err, row) => {
            if (callback) {
                callback(err, row)
            }
        })
    }
};

module.exports = UsersDB
