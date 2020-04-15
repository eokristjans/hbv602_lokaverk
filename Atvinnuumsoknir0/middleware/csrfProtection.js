/*
const csrf = require('csurf');
const cookieParser = require('cookie-parser'); // til geyma cookies

const csrfProtection = csrf({ cookie: true });
*/

// Chunks of code that I tried to use to get CSRF cookie to come along without cookie-parser
/*

// in data array with login form
csrfToken: req.csrfToken(),

app.use(csrf());

//const csrfProtection = csrf();
//app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken() ? req.csrfToken : null;

  next();
});
*/
