const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const session = require('express-session');
// const flash = require('connect-flash');
// const passport = require('passport');

const config = require('./config');
const app = express();

// Config
app.use(express.static('public')); // serve static files in 'public'
app.set('view engine', 'pug'); // render with pug
app.use(logger('dev')); // logging
app.use(bodyParser.json()); // parse JSON
// app.use(cookieParser()); // read cookies
// app.use(flash()); // use connect-flash for flash messages stored in session

// Initialize passport
// TODO don't use this for production
// app.use(session({ secret: 'mysecret' })); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions

// Development only
if (app.get('env') === 'development') {
	app.locals.pretty = true; // Pretty print HTML code
}

// Import routes
const routes = require('./routes')(app/*, passport*/);
const models = require('./models');

module.exports = app;
