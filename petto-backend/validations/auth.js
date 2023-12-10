import { body } from 'express-validator';

export const loginValidation = [
	body('email', 'Incorrect email format').isEmail(),
	body('password', 'Password lenght must be minimum 6 symbols').isLength({ min: 6 }),
];
export const registerValidation = [
	body('email', 'Incorrect email format').isEmail(),
	body('password', 'Password lenght must be minimum 6 symbols').isLength({ min: 6 }),
	body('givenName', 'Given Name lenght must be minimum 3 symbols').isLength({ min: 3 }),
	body('surname', 'Surname lenght must be minimum 3 symbols').isLength({ min: 3 }),
	body('avatarUrl', 'Incorrect URL for image').optional().isURL(),
	body('coverUrl', 'Incorrect URL for image').optional().isURL(),
];
