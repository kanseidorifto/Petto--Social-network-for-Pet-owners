import { body, query } from 'express-validator';

export const userUpdateValidation = [
	body('avatarMedia', 'avatarMedia must be a file').optional().isMimeType(),
	body('coverMedia', 'coverMedia must be a file').optional().isMimeType(),
	body('givenName', 'Given Name lenght must be minimum 3 symbols').isLength({ min: 3 }),
	body('surname', 'Surname lenght must be minimum 3 symbols').isLength({ min: 3 }),
	body('bio', 'Bio lenght must be maximum 128 symbols').isLength({ min: 0, max: 128 }),
];

export const userSearchValidation = [
	query('search', 'Specify search text').isString(),
	// query(['page', 'limit'], 'Specify search options'),
];
