// Router fyrir register.ejs
// inniheldur aðgerðir til að skrá notanda, birta form og þakkarsíðu.

const express = require('express');
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');

const usersFunctions = require('../DAOs/users-functions'); // v3 - being used but not as middleware
const {
  catchErrors,
  sanitizeXss,
} = require('../DAOs/utils'); // v3 - being used but not as middleware


// import 500 worst passwords
const worstPasswords = require('../utils/500-worst-passwords');
const {
  containsNumber,
  containsSymbol,
  containsLowerCase,
  containsUpperCase,
} = require('../utils/utils');

const router = express.Router();

// Fylki af öllum validations fyrir notendur
const validations = [
  check('nafn')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt.'),

  check('netfang')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt.'),

  check('netfang')
    .isEmail()
    .withMessage('Netfang verður að vera á réttu sniði.'),

  check('username')
    .isLength({ min: 1 })
    .withMessage('Notendanafn má ekki vera tómt.'),

  check('username')
    // eslint-disable-next-line consistent-return
    .custom(async (value) => {
      // Check if username is in use
      const user = await usersFunctions.findByUsername(value);
      // eslint-disable-next-line prefer-promise-reject-errors
      if (user != null) return Promise.reject('Notendanafn er þegar í notkun.'); ; // eslint-disable-line no-extra-semi
    }),

  check('password')
    .isLength({ min: 8 })
    .withMessage('Lykilorð verður að vera minnst 8 stafir.'),

  check('password')
    .not().isIn(worstPasswords)
    .withMessage('Lykilorð má ekki vera í lista yfir of auðveld lykilorð.'),

  check('password')
    .custom(value => containsNumber(value))
    .withMessage('Lykilorð verður að innihalda a.m.k. einn tölustaf.'),

  check('password')
    .custom(value => containsSymbol(value))
    .withMessage('Lykilorð verður að innihalda a.m.k. eitt af táknunum ! # $ % & / ( ) = _ ? * .'),

  check('password')
    .custom(value => containsLowerCase(value))
    .withMessage('Lykilorð verður að innihalda a.m.k. einn lágstaf.'),

  check('password')
    .custom(value => containsUpperCase(value))
    .withMessage('Lykilorð verður að innihalda a.m.k. einn hástaf.'),

  check('password2')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Lykilorð verða að vera eins.'),
];

// Fylki af öllum hreinsunum fyrir nýskráningu notenda
const sanitazions = [
  // .escape() passar að ekkert HTML fari með.
  sanitize('nafn').trim().escape(),
  sanitizeXss('nafn'),

  // Sýnilausn kallar fyrst á sanitizeXss... skiptir það máli?
  sanitize('netfang').trim().normalizeEmail(),
  sanitizeXss('netfang'),

  sanitize('username').trim().escape(),
  sanitizeXss('username'),

  sanitize('password').trim().escape(),
  sanitizeXss('password'),

  sanitize('password2').trim().escape(),
  sanitizeXss('password2'),

];

/**
 * Route handler fyrir form nýskráningar.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Form fyrir umsókn
 */
function registerForm(req, res) {
  const data = {
    // nafn samsvarar nafn í index.ejs
    title: 'Nýskráning',
    nafn: '',
    netfang: '',
    username: '', // current default
    password: '', // current default
    password2: '', // current default
    errors: [],
  };

  // setjum current page (betra ef þetta væri aðgerð aðgengileg öllum)
  res.locals.page = 'register';

  res.render('registerForm', data);
}


/**
 * Route handler sem athugar stöðu á nýskráningar og birtir villur ef einhverjar,
 * sendir annars áfram í næsta middleware.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 * @returns Næsta middleware ef í lagi, annars síðu með villum
 */
function showErrors(req, res, next) {
  const {
    body: {
      nafn = '',
      netfang = '',
      username = '',
      password = '',
      password2 = '',
    } = {},
  } = req;

  const data = {
    nafn, netfang, username, password, password2,
  };

  const validationRes = validationResult(req);

  if (!validationRes.isEmpty()) {
    const errors = validationRes.array();
    data.errors = errors;
    data.title = 'Nýskráning - vandræði';

    return res.render('registerForm', data);
  }


  return next();
}


/**
 * Ósamstilltur route handler sem vistar gögn í gagnagrunn og sendir
 * á þakkarsíðu
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
async function formPost(req, res) {
  const {
    body: {
      nafn = '',
      netfang = '',
      username = '',
      password = '',
      // eslint-disable-next-line no-unused-vars
      password2 = '',
    } = {},
  } = req;

  await usersFunctions.createUser(nafn, netfang, username, password);

  delete req.password; // delete password from memory

  return res.redirect('/register/thanks');
}

/**
 * Route handler fyrir þakkarsíðu.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function thanks(req, res) {
  return res.render('thanks', { title: 'Takk fyrir að skrá þig' });
}

router.get('/', registerForm);
router.get('/thanks', thanks);


// passa að senda validation og sanitazion fylkin með í post fallið.
router.post(
  '/',
  sanitazions, // Hreinsa gögn áður en þau eru valideruð
  validations, // Athugar hvort form sé í lagi
  showErrors, // Ef form er ekki í lagi, birtir upplýsingar um það
  catchErrors(formPost), // Senda gögn í gagnagrunn
);


module.exports = router;
