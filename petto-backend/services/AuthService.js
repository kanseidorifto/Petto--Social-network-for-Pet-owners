import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import UserProfileModel from '../models/profile/UserProfileModel.js';
import signJWT from '../utils/signJWT.js';

export const register = async ({ email, password, givenName, surname }) => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const doc = new UserProfileModel({
		email,
		passwordHash: hash,
		givenName,
		surname,
		// avatarUrl: req.body.avatarUrl,
		// bio: req.body.bio,
	});

	const user = await doc.save();

	const token = signJWT({ _id: user._id });

	const { passwordHash, ...userData } = user._doc;

	return { ...userData, token };
};

export const login = async ({ email, password }) => {
	const user = await UserProfileModel.findOne({ email });
	if (!user) {
		throw new createHttpError.NotFound('User not found');
	}

	const isValidPassword = await bcrypt.compare(password, user._doc.passwordHash);

	if (!isValidPassword) {
		throw new createHttpError.Unauthorized('Incorrect email or password');
	}

	const token = signJWT({ _id: user._id });

	const { passwordHash, ...userData } = user._doc;

	return { ...userData, token };
};
