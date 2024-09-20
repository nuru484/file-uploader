const passport = require('passport');

const loginPageGet = async (req, res) => {
  try {
    res.render('index', { title: 'Login Page' });
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).send('Internal Server Error');
  }
};

const validateUser = [
  // Username validation
  body('username')
    .exists({ checkFalsy: true })
    .withMessage('You must type a username')
    .trim()
    .escape(),

  // Password validation
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('You must type a password')
    .trim()
    .escape(),
];

const loginPagePost = [
  // validation middleware
  validateUser,
  async (req, res, next) => {
    try {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.render('index', { errors: [info], title: 'Login Page' });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          req.session.userId = user.id;
          return res.redirect('/dashboard');
        });
      })(req, res, next);
    } catch (error) {
      console.error('Error rendering during login', error);
      res.status(500).send('Internal Server Error');
    }
  },
];

const logoutGet = async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
};

module.exports = { loginPageGet, loginPagePost, logoutGet };
