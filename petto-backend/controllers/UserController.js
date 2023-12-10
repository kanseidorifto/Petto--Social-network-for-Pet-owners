import createHttpError from 'http-errors';
import * as UserService from '../services/UserService.js';
import isObjectIdValid from '../utils/isObjectIdValid.js';
import { uploadToBucket } from '../utils/bucketActions.js';
import { randomUUID } from 'crypto';

export const getMe = async (req, res, next) => {
	try {
		const result = await UserService.getUserInfo(req.userId);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const updateMe = async (req, res, next) => {
	try {
		const avatarFiles = req.files['avatarMedia'];
		const avatarFile = avatarFiles && avatarFiles[0].buffer;
		const coverFiles = req.files['coverMedia'];
		const coverFile = coverFiles && coverFiles[0].buffer;

		const avatarFilename = avatarFile ? `${randomUUID()}.png` : undefined;
		const coverFilename = coverFile ? `${randomUUID()}.png` : undefined;

		const avatarUrl = avatarFilename && (await uploadToBucket(avatarFile, avatarFilename));
		const coverUrl = coverFilename && (await uploadToBucket(coverFile, coverFilename));

		const user = await UserService.updateUserInfo(req.userId, {
			avatarUrl,
			coverUrl,
			givenName: req.body.givenName,
			surname: req.body.surname,
			bio: req.body.bio,
		});

		res.json(user);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getById = async (req, res, next) => {
	try {
		if (!isObjectIdValid(req.params.id)) {
			throw new createHttpError.BadRequest();
		}
		const result = await UserService.getUserInfo(req.params.id);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const searchUsersByName = async (req, res, next) => {
	const page = req.params.page ? Number(req.params.page) : 0;
	const limit = req.params.limit ? Number(req.params.limit) : 10;
	if (req.query.search === '' || req.query.search === null) {
		next(new createHttpError.BadRequest());
	}
	try {
		const result = await UserService.getUsersByName(req.query.search, page, limit);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getFriendList = async (req, res, next) => {
	try {
		const friends = await UserService.getFriendList(req.userId);

		res.json(friends);
	} catch (err) {
		console.log(err);
		next(err);
	}
};
export const getFriendRequestList = async (req, res, next) => {
	const direction = req.query.direction;

	try {
		switch (direction) {
			case 'incoming':
				res.json(await UserService.getIncomingFriendList(req.userId));
				break;
			case 'outcoming':
				res.json(await UserService.getOutcomingFriendList(req.userId));
				break;
			default:
				throw new createHttpError.BadRequest('Specify correct direction query parameter');
		}
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const sendFriendRequest = async (req, res, next) => {
	try {
		const profileRequestId = req.userId;
		const profileAcceptId = req.query.id;

		if (!isObjectIdValid(profileRequestId) || !isObjectIdValid(profileAcceptId)) {
			throw new createHttpError.BadRequest();
		}

		const profileAccept = await UserService.getUserInfo(profileAcceptId);
		if (profileAccept._id.toString() === profileRequestId) {
			throw new createHttpError.BadRequest("Can't send self friend request");
		}

		const result = await UserService.createFriendRequest(profileRequestId, profileAcceptId);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const acceptFriendRequest = async (req, res, next) => {
	try {
		const profileRequestId = req.query.id;
		const profileAcceptId = req.userId;

		if (!isObjectIdValid(profileRequestId) || !isObjectIdValid(profileAcceptId)) {
			throw new createHttpError.BadRequest();
		}

		const profileAccept = await UserService.getUserInfo(profileAcceptId);
		if (profileAccept._id.toString() === profileRequestId) {
			throw new createHttpError.BadRequest("Can't accept self friend request");
		}

		const result = await UserService.acceptFriendRequest(profileRequestId, profileAcceptId);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const cancelFriendRequest = async (req, res, next) => {
	try {
		const profileRequestId = req.userId;
		const profileAcceptId = req.query.id;

		if (!isObjectIdValid(profileRequestId) || !isObjectIdValid(profileAcceptId)) {
			throw new createHttpError.BadRequest();
		}

		const profileAccept = await UserService.getUserInfo(profileAcceptId);
		if (profileAccept._id.toString() === profileRequestId) {
			throw new createHttpError.BadRequest("Can't cancel self friend request");
		}

		const result = await UserService.cancelFriendRequest(profileRequestId, profileAcceptId);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};
