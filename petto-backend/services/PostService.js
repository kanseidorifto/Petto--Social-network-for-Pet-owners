import createHttpError from 'http-errors';

import UserFriendshipModel from '../models/profile/UserFriendshipModel.js';
import UserPostModel from '../models/post/UserPostModel.js';
import PostLikeModel from '../models/post/PostLikeModel.js';
import PostCommentModel from '../models/post/PostCommentModel.js';
import PostTaggedPetModel from '../models/post/PostTaggedPetModel.js';
import isObjectIdValid from '../utils/isObjectIdValid.js';

export const getUserFeed = async (userId, page, limit) => {
	const posts = await UserFriendshipModel.aggregate()
		.match({
			$or: [
				{ profileRequest: isObjectIdValid(userId) },
				{ profileAccept: isObjectIdValid(userId) },
			],
			status: 1,
		})
		.lookup({
			from: 'userposts',
			let: { profileRequest: '$profileRequest', profileAccept: '$profileAccept' },
			pipeline: [
				{
					$match: {
						$expr: {
							$or: [
								{ $eq: ['$profile', '$$profileRequest'] },
								{ $gte: ['$profile', '$$profileAccept'] },
							],
						},
					},
				},
			],
			as: 'posts',
		})
		.unwind('$posts')
		.replaceRoot('$posts')
		.lookup({
			from: 'userprofiles',
			localField: 'profile',
			foreignField: '_id',
			as: 'profile',
		})
		.unwind('profile')
		.lookup({
			from: 'postlikes',
			localField: '_id',
			foreignField: 'post',
			as: 'likes',
		})
		.lookup({
			from: 'postcomments',
			localField: '_id',
			foreignField: 'post',
			as: 'comments',
		})
		.unwind({
			path: '$comments',
			preserveNullAndEmptyArrays: true,
		})
		.lookup({
			from: 'userprofiles',
			localField: 'comments.profile',
			foreignField: '_id',
			as: 'comments.profile',
		})
		.unwind({
			path: '$comments.profile',
			preserveNullAndEmptyArrays: true,
		})
		.group({
			_id: '$_id',
			root: {
				$mergeObjects: '$$ROOT',
			},
			comments: {
				$push: '$comments',
			},
		})
		.replaceRoot({
			$mergeObjects: ['$root', '$$ROOT'],
		})
		.project({ root: 0 })
		.lookup({
			from: 'posttaggedpets',
			localField: '_id',
			foreignField: 'post',
			as: 'taggedPets',
		})
		.lookup({
			from: 'petprofiles',
			localField: 'taggedPets.petProfile',
			foreignField: '_id',
			as: 'taggedPets.petProfile',
		})
		.addFields({
			taggedPets: '$taggedPets.petProfile',
		})
		.skip(page * limit)
		.limit(limit)
		.sort({ createdAt: -1 })
		.exec();

	return posts;
};

export const getAllPosts = async (page, limit) => {
	const posts = await UserPostModel.aggregate()
		.lookup({
			from: 'userprofiles',
			localField: 'profile',
			foreignField: '_id',
			as: 'profile',
		})
		.unwind('profile')
		.lookup({
			from: 'postlikes',
			localField: '_id',
			foreignField: 'post',
			as: 'likes',
		})
		.lookup({
			from: 'postcomments',
			localField: '_id',
			foreignField: 'post',
			as: 'comments',
		})
		.unwind({
			path: '$comments',
			preserveNullAndEmptyArrays: true,
		})
		.lookup({
			from: 'userprofiles',
			localField: 'comments.profile',
			foreignField: '_id',
			as: 'comments.profile',
		})
		.unwind({
			path: '$comments.profile',
			preserveNullAndEmptyArrays: true,
		})
		.group({
			_id: '$_id',
			root: {
				$mergeObjects: '$$ROOT',
			},
			comments: {
				$push: '$comments',
			},
		})
		.replaceRoot({
			$mergeObjects: ['$root', '$$ROOT'],
		})
		.project({ root: 0 })
		.lookup({
			from: 'posttaggedpets',
			localField: '_id',
			foreignField: 'post',
			as: 'taggedPets',
		})
		.lookup({
			from: 'petprofiles',
			localField: 'taggedPets.petProfile',
			foreignField: '_id',
			as: 'taggedPets.petProfile',
		})
		.addFields({
			taggedPets: '$taggedPets.petProfile',
		})
		.skip(page * limit)
		.limit(limit)
		.sort({ createdAt: -1 })
		.exec();

	return posts;
};

export const getUserPosts = async (userId, page, limit) => {
	const posts = await UserPostModel.aggregate()
		.match({ profile: isObjectIdValid(userId) })
		.lookup({
			from: 'userprofiles',
			localField: 'profile',
			foreignField: '_id',
			as: 'profile',
		})
		.unwind('profile')
		.lookup({
			from: 'postlikes',
			localField: '_id',
			foreignField: 'post',
			as: 'likes',
		})
		.lookup({
			from: 'postcomments',
			localField: '_id',
			foreignField: 'post',
			as: 'comments',
		})
		.unwind({
			path: '$comments',
			preserveNullAndEmptyArrays: true,
		})
		.lookup({
			from: 'userprofiles',
			localField: 'comments.profile',
			foreignField: '_id',
			as: 'comments.profile',
		})
		.unwind({
			path: '$comments.profile',
			preserveNullAndEmptyArrays: true,
		})
		.group({
			_id: '$_id',
			root: {
				$mergeObjects: '$$ROOT',
			},
			comments: {
				$push: '$comments',
			},
		})
		.replaceRoot({
			$mergeObjects: ['$root', '$$ROOT'],
		})
		.project({ root: 0 })
		.lookup({
			from: 'posttaggedpets',
			localField: '_id',
			foreignField: 'post',
			as: 'taggedPets',
		})
		.lookup({
			from: 'petprofiles',
			localField: 'taggedPets.petProfile',
			foreignField: '_id',
			as: 'taggedPets.petProfile',
		})
		.addFields({
			taggedPets: '$taggedPets.petProfile',
		})
		.skip(page * limit)
		.limit(limit)
		.sort({ createdAt: -1 })
		.exec();

	return posts;
};

export const getPetPosts = async (petId, page, limit) => {
	const posts = await PostTaggedPetModel.aggregate()
		.match({
			petProfile: isObjectIdValid(petId),
		})
		.skip(page * limit)
		.limit(limit)
		.lookup({
			from: 'userposts',
			localField: 'post',
			foreignField: '_id',
			as: 'post',
		})
		.unwind('post')
		.replaceRoot('post')
		.lookup({
			from: 'userprofiles',
			localField: 'profile',
			foreignField: '_id',
			as: 'profile',
		})
		.unwind('profile')
		.lookup({
			from: 'postlikes',
			localField: '_id',
			foreignField: 'post',
			as: 'likes',
		})
		.lookup({
			from: 'postcomments',
			localField: '_id',
			foreignField: 'post',
			as: 'comments',
		})
		.unwind({
			path: '$comments',
			preserveNullAndEmptyArrays: true,
		})
		.lookup({
			from: 'userprofiles',
			localField: 'comments.profile',
			foreignField: '_id',
			as: 'comments.profile',
		})
		.unwind({
			path: '$comments.profile',
			preserveNullAndEmptyArrays: true,
		})
		.group({
			_id: '$_id',
			root: {
				$mergeObjects: '$$ROOT',
			},
			comments: {
				$push: '$comments',
			},
		})
		.replaceRoot({
			$mergeObjects: ['$root', '$$ROOT'],
		})
		.project({ root: 0 })
		.lookup({
			from: 'posttaggedpets',
			localField: '_id',
			foreignField: 'post',
			as: 'taggedPets',
		})
		.lookup({
			from: 'petprofiles',
			localField: 'taggedPets.petProfile',
			foreignField: '_id',
			as: 'taggedPets.petProfile',
		})
		.addFields({
			taggedPets: '$taggedPets.petProfile',
		})
		.sort({ createdAt: -1 })
		.exec();

	return posts;
};

export const getPost = async (postId) => {
	const post = await UserPostModel.aggregate()
		.match({ _id: isObjectIdValid(postId) })
		.limit(1)
		.lookup({
			from: 'userprofiles',
			localField: 'profile',
			foreignField: '_id',
			as: 'profile',
		})
		.unwind('profile')
		.lookup({
			from: 'postlikes',
			localField: '_id',
			foreignField: 'post',
			as: 'likes',
		})
		.lookup({
			from: 'postcomments',
			localField: '_id',
			foreignField: 'post',
			as: 'comments',
		})
		.lookup({
			from: 'posttaggedpets',
			localField: '_id',
			foreignField: 'post',
			as: 'taggedPets',
		})
		.exec();

	if (!post[0]) {
		throw new createHttpError.NotFound('Post not found');
	}
	return post[0];
};

export const createPost = async (userId, writtenText, mediaLocations, taggedPetList) => {
	//TAG PETS
	try {
		const doc = new UserPostModel({
			profile: userId,
			writtenText,
			mediaLocations,
		});
		const post = await doc.save();

		for (const petId of taggedPetList) {
			await createTaggedPet(post._id, petId);
		}

		return post.populate('profile');
	} catch (err) {
		console.error(err);
		throw new createHttpError.Conflict();
	}
};

export const removePost = async (postId) => {
	const post = await UserPostModel.findByIdAndDelete(postId);
	if (!post) {
		throw new createHttpError.NotFound('Post not found');
	}
	return post;
};

export const getLikes = async (postId) => {
	const likes = await PostLikeModel.find({ post: postId });

	return likes;
};

export const createLike = async (postId, userId) => {
	try {
		const doc = new PostLikeModel({ post: postId, profile: userId });

		const like = await doc.save();
		return like;
	} catch (err) {
		throw new createHttpError.Conflict();
	}
};

export const removeLike = async (postId, userId) => {
	const like = await PostLikeModel.findOneAndDelete({
		post: postId,
		profile: userId,
	});
	if (!like) {
		throw new createHttpError.NotFound('Like not found');
	}
	return like;
};

export const getComments = async (postId) => {
	const comments = await PostCommentModel.find({ post: postId }).populate('profile');

	return comments;
};

export const createComment = async (postId, userId, writtenText) => {
	try {
		const doc = new PostCommentModel({ post: postId, profile: userId, writtenText });

		const comment = await doc.save();
		return comment;
	} catch (err) {
		throw new createHttpError.Conflict();
	}
};

export const removeComment = async (commentId) => {
	const comment = await PostCommentModel.findByIdAndDelete(commentId);
	if (!comment) {
		throw new createHttpError.NotFound('Comment not found');
	}
	return comment;
};

export const getTaggedPets = async (postId) => {
	const taggedPets = await PostTaggedPetModel.find({ post: postId }).populate('petProfile');

	return taggedPets;
};

export const createTaggedPet = async (postId, petId) => {
	try {
		const doc = new PostTaggedPetModel({ post: postId, petProfile: petId });

		const taggedPet = await doc.save();
		return taggedPet;
	} catch (err) {
		throw new createHttpError.Conflict();
	}
};

export const removeTaggedPet = async (postId, petId) => {
	const taggedPet = await PostTaggedPetModel.findOneAndDelete({
		post: postId,
		petProfile: petId,
	});
	if (!taggedPet) {
		throw new createHttpError.NotFound('TaggedPet not found');
	}
	return taggedPet;
};
