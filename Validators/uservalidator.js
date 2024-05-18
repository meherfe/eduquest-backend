import { body } from 'express-validator';

// Validation middleware
export const userValidation = [
    body('nom').isLength({ min: 5, max: 50 }),
    body('password').isLength({ min: 6, max: 16 })
      .custom((password, { req }) => {
        if (password !== req.body.passwordconfirm) {
          throw new Error('Password confirmation does not match');
        }
        return true;
      })
      .withMessage('Password confirmation is required'),
  
    body('phone').isNumeric().isLength({ min: 8, max: 8 }),
    body('email').notEmpty().isEmail().withMessage('Please enter a valid email address'),
  
    // Moved inside the body('password') validation
    body('passwordconfirm').notEmpty().withMessage('Password confirmation required'),
];
