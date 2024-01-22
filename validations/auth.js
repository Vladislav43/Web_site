import { body} from'express-validator';

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('fullname').isLength({ min: 3 }),
    body('avatarurl').optional().isURL(),
];