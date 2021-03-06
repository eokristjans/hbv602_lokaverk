// v3 Contains a few functions that are used by many routers

const xss = require('xss');

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * Passar upp á að það sé innskráður notandi í request. Skilar næsta middleware
 * ef svo er, annars redirect á /login
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {funcion} next Næsta middleware
 */
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

/**
 * Passar upp á að það sé EKKI innskráður notandi í request.
 * Skilar redirect á / ef svo er, annars næsta middleware
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {funcion} next Næsta middleware
 */
function ensureNotLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // Er útskráður
    return res.redirect('/');
  }

  return next();
}

/**
 * Passar upp á að innskráður notandi sé admin. Skilar næsta middleware ef svo
 * er, annars redirect á /login
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {funcion} next Næsta middleware
 */
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.admin) {
    return next();
  }

  return res.redirect('/login');
}

/**
 * Hjálparfall sem XSS hreinsar reit í formi eftir heiti.
 *
 * @param {string} fieldName Heiti á reit
 * @returns {function} Middleware sem hreinsar reit ef hann finnst
 */
function sanitizeXss(fieldName) {
  return (req, res, next) => {
    if (!req.body) {
      next();
    }

    const field = req.body[fieldName];

    if (field) {
      req.body[fieldName] = xss(field);
    }

    next();
  };
}

function containsNumber(myString) {
  const value = /\d/.test(myString);
  return value;
}

function containsSymbol(myString) {
  const value = /[!#$%&/()=_?*.]/.test(myString);
  return value;
}

function containsLowerCase(myString) {
  return /[a-z]/.test(myString);
}

function containsUpperCase(myString) {
  return /[A-Z]/.test(myString);
}

module.exports = {
  catchErrors,
  ensureLoggedIn,
  ensureNotLoggedIn,
  ensureAdmin,
  sanitizeXss,
  containsNumber,
  containsSymbol,
  containsLowerCase,
  containsUpperCase,
};
