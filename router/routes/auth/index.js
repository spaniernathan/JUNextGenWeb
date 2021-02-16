var express = require('express')
const { models } = require('../../../models')
var router = express.Router()
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

// Auth
router.get('/signup', (req, res) => {
    res.render("signup.hbs", {
        currentUser: { ...req.session.currentUser },
        message: req.flash('signup'),
    });
});

router.post('/signup', (req, res) => {
    const { username, displayname, password } = req.body
    // TODO: more error managment (empty strings etc)
    models.users.getUserByUsername(username, (err, row) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        }
        if (row) {
            req.flash('signup', 'username already exists')
            res.redirect('/signup')
        } else {
            models.users.setUser({
                username,
                password: bcrypt.hashSync(password, salt),
                displayname,
            });
            res.redirect("/login");
        }
    })
})

router.get('/login', (req, res) => {
    res.render("login.hbs", {
        currentUser: { ...req.session.currentUser },
        message: req.flash('login'),
    });
})

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    models.users.getUserByUsername(username, (err, row) => {
        if (err) {
            console.log(err)
            // TODO: Handle error
        }
        if (row && bcrypt.compareSync(password, row.password)) {
            models.playlists.getUserPlaylists(row.id, (err, rows) => {
                req.session.currentUser = {
                    id: row.id,
                    username: row.username,
                    displayname: row.displayname,
                    logged: true,
                    playlists: rows,
                }
                res.redirect("/");
            })
        } else {
            req.flash('login', 'invalid username or password')
            res.redirect("/login");
        }
    });
})

router.post('/signout', (req, res) => {
    delete req.session.currentUser;
    res.redirect("/");
})

module.exports = router
