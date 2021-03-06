// v2 TILBÚIÐ.
// v3 TILBÚIÐ.

require('dotenv').config();

const {
  // Sækir upplýsingar í .env ef þær eru skilgreindar.
  HOST: hostname = '127.0.0.1',
  PORT: port = 3000,
  SESSION_SECRET: sessionSecret = 'leyndó',
} = process.env;

const path = require('path');
const express = require('express');
const { sanitize } = require('express-validator');
const session = require('express-session'); // v3
const passport = require('passport'); // v3
const helmet = require('helmet'); // http hausar
const express_enforces_ssl = require('express-enforces-ssl');

// Strategy um hvernig við ætlum að nálgast og eiga við notendur
const { Strategy } = require('passport-local'); // v3

const apply = require('./routes/apply');
const applications = require('./routes/applications');
const register = require('./routes/register'); // v3
const usersPage = require('./routes/users'); // v3
const usersFunctions = require('./DAOs/users-functions'); // v3 - being used but not as middleware
const {
  catchErrors,
  ensureLoggedIn,
  ensureNotLoggedIn,
  sanitizeXss,
} = require('./DAOs/utils'); // v3


const app = express();

app.use(helmet()); // Security, set headers.
// Sets "Strict-Transport-Security: max-age=63072000; includeSubDomains; preload".
const twoYearsInSeconds = 63072000;
app.use(helmet.hsts({
  maxAge: twoYearsInSeconds,
  includeSubDomains: true,
  preload: true,
}));

// Redirects use to https connection and throws an error if users try to send data via http.
app.enable('trust proxy');
app.use(express_enforces_ssl()); // Does not work on localhost.

/**
 * Middleware that sets HTTP header "Cache-Control: no-store, no-cache"
 * and "Pragma: no-cache".
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {function} next
 */
function nocache(req, res, next) {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
}
app.use(nocache);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Erum að vinna með form, verðum að nota body parser til að fá aðgang að req.body
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public'))); // Inniheldur m.a. styles.css

/************************* PASSPORT & SESSION SETTINGS ************************/

if (!sessionSecret) { // v3
  console.error('Add SESSION_SECRET to .env');
  process.exit(1);
}

// v3 Passport mun verða notað með session
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  maxAge: 30 * 24 * 60 * 1000, // 30 dagar
  cookie: { secure: true }, // try to fix connect.sid cookie security issue
}));

/** v3
 * Athugar hvort username og password sé til í notandakerfi.
 * Callback tekur við villu sem fyrsta argument, annað argument er
 * - `false` ef notandi ekki til eða lykilorð vitlaust
 * - Notandahlutur ef rétt
 *
 * @param {string} username Notandanafn til að athuga
 * @param {string} password Lykilorð til að athuga
 * @param {function} done Fall sem kallað er í með niðurstöðu
 */
async function strat(username, password, done) {
  try {
    const user = await usersFunctions.findByUsername(username);

    // Er notandi til?
    if (!user) {
      return done(null, false);
    }

    // Verður annað hvort notanda hlutur ef lykilorð rétt, eða false
    const result = await usersFunctions.comparePasswords(password, user);
    return done(null, result);
  } catch (err) {
    console.error(err);
    return done(err);
  }
}

// v3 Notum local strategy með „strat-inu“ okkar til að leita að notanda
passport.use(new Strategy(strat));

// v3 Geymum id á notanda í session, það er nóg til að vita hvaða notandi þetta er
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// v3 Sækir notanda út frá id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersFunctions.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// v3 Látum express nota passport með session
app.use(passport.initialize());
app.use(passport.session());

// v3 Gott að skilgreina eitthvað svona til að gera user hlut
// aðgengilegan í view-um ef við erum að nota þannig
app.use((req, res, next) => {
  // Látum `user` alltaf vera til fyrir view
  res.locals.user = req.isAuthenticated() ? req.user : null;

  next();
});


/****************************** LOGIN FUNCTIONALITY ***************************/

// Fylki af öllum hreinsunum fyrir innskráningu notenda
const sanitazions = [
  // .escape() passar að ekkert HTML fari með.
  sanitize('username').escape(),
  sanitizeXss('username'),

  sanitize('password').escape(),
  sanitizeXss('password'),

];

/** v3
 * Login Form
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
app.get('/login', ensureNotLoggedIn, (req, res) => {

  // v3 setjum current page (betra væri ef þetta væri aðgerð aðgengileg öllum)
  res.locals.page = 'login';

  // Athugum hvort einhver skilaboð séu til í session, ef svo er birtum þau og hreinsum skilaboð
  let message = '';
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  const data = {
    title: 'Innskráning', // Ekki í notkun eins og er
    username: '', // current default
    password: '', // current default
    errors: [],
    message,
  };

  return res.render('loginForm', data);
});


/** v3
 * Login Post Method (Mun þurfa að verða Async vegna samskipta við gagnagrunn)
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
app.post(
  '/login',
  ensureNotLoggedIn,

  // Þetta notar strat að ofan til að skrá notanda inn
  passport.authenticate('local', {
    failureMessage: 'Notandi eða lykilorð vitlaust.',
    failureRedirect: '/login',
  }),

  // Ef við komumst hingað var notandi skráður inn, senda á /users
  (req, res) => {
    res.redirect('/users');
  },
);


/** v3
 * Log out Method
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
app.get(
  '/logout',
  ensureLoggedIn,
  (req, res) => {
    req.logout(); // Passport method
    res.redirect('/');
  },
);


/******************** USE IMPORTED ROUTERS ********************/

app.use('/', apply);
app.use('/register', ensureNotLoggedIn, register); // v3
app.use('/applications', ensureLoggedIn, applications);
app.use('/users', ensureLoggedIn, usersPage); // v3


/********** ERROR HANDLING MUST BE BELOW OTHER MIDDLEWARE **********/

/**
 * Hjálparfall til að athuga hvort reitur sé gildur eða ekki.
 *
 * @param {string} field Middleware sem grípa á villur fyrir
 * @param {array} errors Fylki af villum frá express-validator pakkanum
 * @returns {boolean} `true` ef `field` er í `errors`, `false` annars
 */
function isInvalid(field, errors) {
  return Boolean(errors.find(i => i.param === field));
}

app.locals.isInvalid = isInvalid;

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404', error: '404 fannst ekki' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  console.error(error);
  res.status(500).render('error', { title: 'Villa', error });
}

app.use(notFoundHandler);
app.use(errorHandler);

/********** LISTEN MUST BE AT THE ABSOLUTE BOTTOM **********/

app.listen(port, () => {
  // Does not listen on any specific hostname on heroku.
  console.info(`Server running at http://${hostname}:${port}/`);
});
