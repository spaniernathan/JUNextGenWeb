const expressHandlebars = require('express-handlebars')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { pathParser, redirectIfNotLoggedIn } = require('./router/middlewares');
let APIRouter = require('./API');
const router = require('./router');
const app = express()

app.use(express.static('public'))
app.engine('hbs', expressHandlebars({
  defaultLayout: 'main.hbs',
}))

require('./views/components')();

// API
app.use('/api', APIRouter)

// Middleware initialisation
app.use(cookieParser());
app.use(session({
  genid: () => { return uuidv4() },
  secret: "superdupersecret",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(flash())

// Router middlewares
app.use(pathParser)
app.use(redirectIfNotLoggedIn)

// Main router
app.use('/', router)

app.listen(8080)
