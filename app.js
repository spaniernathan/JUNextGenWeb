const express = require('express');
const expressHandlebars = require('express-handlebars')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');

let APIRouter = require('./API');
const router = require('./router');
const app = express()

app.use(express.static(path.join(__dirname + '/public')));
app.engine('hbs', expressHandlebars({
  defaultLayout: 'main.hbs',
}))

// Handlebars components
require('./views/components')();

app.use(bodyParser.urlencoded({ extended: true }))

// API
app.use('/api', APIRouter)

// App config
app.use(cookieParser());
app.use(session({
  genid: () => { return require('uuid')() },
  secret: "superdupersecret",
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 86400000 },
}));
app.use(flash())

// Main router
app.use('/', router)

app.all('*', (req, res) => {
  res.status(404).render("404.hbs");
});

app.listen(8080)
