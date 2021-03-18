let express = require('express')
const { models } = require('../../../models')
let router = express.Router()
const bcrypt = require('bcryptjs');
const { salt } = require('../../../pkg/auth')

// Auth
router.get('/signup', (req, res) => {
    res.render("signup.hbs", {
        currentUser: { ...req.session.currentUser },
        message: req.flash('signup'),
    });
});

router.post('/signup', (req, res) => {
    const { username, displayname, password } = req.body;
    if (!username && !displayname && !password) {
        res.status(400).json({'message': 'missing username, displayname or password'})
    } else {
        models.users.getUserByUsername(username, (err, row) => {
            if (err) {
                console.log('POST /signup')
                console.log('getUserByUsername')
                console.log(err)
                req.flash('signup', 'internal server error')
                res.redirect('/signup')
            }
            if (row) {
                req.flash('signup', 'username already exists')
                res.redirect('/signup')
            } else {
                models.users.setUser({
                    username,
                    password: bcrypt.hashSync(password, salt),
                    displayname,
                }, (err, row) => {
                    if (err) {
                        console.log('POST /signup')
                        console.log('setUser')
                        console.log(err)
                        req.flash('signup', 'internal error')
                        res.redirect("/signup");
                    } else {
                        res.redirect("/login");
                    }
                });
            }
        })
    }
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
            console.log('POST /login')
            console.log('getUserByUsername')
            console.log(err)
            req.flash('login', 'internal server error')
            res.redirect('/login')
        } else {
            if (row && bcrypt.compareSync(password, row.password)) {
                models.playlists.getUserPlaylists(row.id, (err, rows) => {
                    if (err) {
                        console.log('POST /login')
                        console.log('getUserPlaylists')
                        console.log(err)
                        req.flash('login', 'internal server error')
                        res.redirect('/login')
                    } else {
                        req.session.currentUser = {
                            id: row.id,
                            username: row.username,
                            displayname: row.displayname,
                            logged: true,
                            playlists: rows,
                        }
                        res.redirect("/");
                    }
                })
            } else {
                req.flash('login', 'invalid username or password')
                res.redirect("/login");
            }
        }
    });
})

router.post('/signout', (req, res) => {
    delete req.session.currentUser;
    res.redirect("/");
})

module.exports = router
