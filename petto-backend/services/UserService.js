import createHttpError from 'http-errors';

import UserProfileModel from '../models/profile/UserProfileModel.js';
import UserFriendshipModel from '../models/profile/UserFriendshipModel.js';

export const getUserInfo = async (userId) => {
	const user = await UserProfileModel.findById(userId);

	if (!user) {
		throw new createHttpError.NotFound('User not found');
	}

	const { passwordHash, ...userData } = user._doc;

	return userData;
};

export const getUsersByName = async (query, page, limit) => {
	const users = await UserProfileModel.find({ $text: { $search: query } })
		.skip(page * limit)
		.limit(limit)
		.exec();

	return users;
};

export const updateUserInfo = async (userId, values) => {
	const user = await UserProfileModel.findById(userId);

	if (!user) {
		throw new createHttpError.NotFound('User not found');
	}

	const updatedUser = await UserProfileModel.findOneAndUpdate(
		{
			_id: userId,
		},
		{
			avatarUrl: values.avatarUrl,
			coverUrl: values.coverUrl,
			givenName: values.givenName,
			surname: values.surname,
			bio: values.bio,
		},
		{
			returnDocument: 'after',
		},
	);
	return updatedUser;
};

export const getFriendList = async (userId) => {
	const friendRequests = await UserFriendshipModel.find({
		$or: [{ profileRequest: userId }, { profileAccept: userId }],
		status: 1,
	}).populate(['profileRequest', 'profileAccept']);

	return friendRequests;
};

export const getIncomingFriendList = async (userId) => {
	const incomingFriendRequests = await UserFriendshipModel.find({
		profileAccept: userId,
		status: 0,
	}).populate(['profileRequest', 'profileAccept']);

	return incomingFriendRequests;
};

export const getOutcomingFriendList = async (userId) => {
	const outcomingFriendRequests = await UserFriendshipModel.find({
		profileRequest: userId,
		status: 0,
	}).populate(['profileRequest', 'profileAccept']);

	return outcomingFriendRequests;
};

export const createFriendRequest = async (profileRequestId, profileAcceptId) => {
	try {
		const request = await UserFriendshipModel.findOne({
			profileRequest: profileAcceptId,
			profileAccept: profileRequestId,
		});
		if (request) {
			throw new createHttpError.Conflict();
		}
		const doc = new UserFriendshipModel({
			profileRequest: profileRequestId,
			profileAccept: profileAcceptId,
		});

		const friendRequest = await doc.save();

		return friendRequest.populate(['profileRequest', 'profileAccept']);
	} catch (err) {
		throw new createHttpError.Conflict();
	}
};

export const acceptFriendRequest = async (profileRequestId, profileAcceptId) => {
	const friendRequest = await UserFriendshipModel.findOneAndUpdate(
		{
			profileRequest: profileRequestId,
			profileAccept: profileAcceptId,
		},
		{
			status: 1,
		},
		{
			returnDocument: 'after',
		},
	);

	if (!friendRequest) {
		throw new createHttpError.NotFound('Friend request not found');
	}
	return friendRequest.populate(['profileRequest', 'profileAccept']);
};
export const cancelFriendRequest = async (profileRequestId, profileAcceptId) => {
	const friendRequest = await UserFriendshipModel.findOneAndDelete({
		$or: [
			{ profileRequest: profileRequestId, profileAccept: profileAcceptId },
			{ profileRequest: profileAcceptId, profileAccept: profileRequestId },
		],
	});

	if (!friendRequest) {
		throw new createHttpError.NotFound('Friend request not found');
	}
	return friendRequest;
};
