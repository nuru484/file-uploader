const passport = require('passport');

const loginPageGet = async (req, res) => {
  try {
    res.render('index', { title: 'Login Page' });
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).send('Internal Server Error');
  }
};

const loginPagePost = async (req, res, next) => {
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
        return res.redirect('/dashboard');
      });
    })(req, res, next);
  } catch (error) {
    console.error('Error rendering during login', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { loginPageGet, loginPagePost };
