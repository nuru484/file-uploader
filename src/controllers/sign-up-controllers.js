const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client'); // Prisma client for database access
const prisma = new PrismaClient();
const { body, validationResult } = require('express-validator');

const signUpGet = async (req, res) => {
  try {
    res.render('sign-up-form', { title: 'sign Up' });
  } catch (error) {
    console.error('Error during sign up', error);
    res.status(500).send('Internal Server Error');
  }
};

const validateUser = [
  // Username validation
  body('username')
    .exists({ checkFalsy: true })
    .withMessage('You must type a username')
    .trim()
    .escape()
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { username: value },
      });
      if (existingUser) {
        throw new Error(
          `The username "${value}" already exists in our database`
        );
      }
    }),

  // Password validation
  body('password')
    .exists({ checkFalsy: true })
    .withMessage('You must type a password')
    .trim()
    .escape(),

  // Confirm password validation
  body('confirmedPassword')
    .exists({ checkFalsy: true })
    .withMessage('You must type a confirmation password')
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password)
    .withMessage('The passwords do not match'),

  // Email validation
  body('email')
    .exists({ checkFalsy: true })
    .withMessage('You must type an email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Not a valid email address')
    .custom(async (value) => {
      const existingUser = await prisma.user.findUnique({
        where: { email: value },
      });
      if (existingUser) {
        throw new Error(
          `A user with the email "${value}" already exists in our database`
        );
      }
    }),
];

module.exports = validateUser;

const signUpPost = [
  // validation middleware
  validateUser,

  // async function to handle the sign-up logic
  async (req, res, next) => {
    // validation errors from validateUser middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, return them to the user
      return res.status(400).render('sign-up-form', {
        title: 'Sign Up',
        errors: errors.array(),
      });
    }

    try {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create the new user in the database
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
        },
      });

      // Redirect or respond with success
      res.redirect('/');
    } catch (err) {
      // If an error occurs during Prisma operation, pass it to error-handling middleware
      next(err);
    }
  },
];

module.exports = { signUpGet, signUpPost };
