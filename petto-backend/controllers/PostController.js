import createHttpError from 'http-errors';
import * as PostService from '../services/PostService.js';
import isObjectIdValid from '../utils/isObjectIdValid.js';
import { uploadToBucket } from '../utils/bucketActions.js';
import { randomUUID } from 'crypto';

export const getPost = async (req, res, next) => {
	const postId = req.params.id;
	try {
		if (!isObjectIdValid(postId)) {
			throw new createHttpError.BadRequest();
		}
		const post = await PostService.getPost(postId);

		res.json(post);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getMyPostList = async (req, res, next) => {
	try {
		const postList = await PostService.getUserPosts(req.userId, 0, 10);

		res.json(postList);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getAllPostList = async (req, res, next) => {
	try {
		const postList = await PostService.getAllPosts(0, 10);

		res.json(postList);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getMyFeed = async (req, res, next) => {
	try {
		const postList = await PostService.getUserFeed(req.userId, 0, 10);

		res.json(postList);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getUserPostList = async (req, res, next) => {
	const userId = req.query.id;
	try {
		const postList = await PostService.getUserPosts(userId, 0, 10);

		res.json(postList);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getPetPostList = async (req, res, next) => {
	const petId = req.query.id;
	try {
		const postList = await PostService.getPetPosts(petId, 0, 10);

		res.json(postList);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const createPost = async (req, res, next) => {
	const writtenText = req.body.writtenText;

	const files = req.files;

	const taggedPetList = JSON.parse(req.body.taggedPetList);
	try {
		const mediaLocations = await Promise.all(
			files.map(async (file) => {
				const fileExtName = file.originalname.split('.').pop();
				return await uploadToBucket(file.buffer, `${randomUUID()}.${fileExtName}`);
			}),
		);
		const post = await PostService.createPost(
			req.userId,
			writtenText,
			mediaLocations,
			taggedPetList,
		);

		res.json(post);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const deletePost = async (req, res, next) => {
	const postId = req.params.id;
	try {
		const post = await PostService.getPost(postId);

		if (post.profile._id != req.userId) {
			throw new createHttpError.Forbidden();
		}

		const result = await PostService.removePost(postId);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const createLike = async (req, res, next) => {
	try {
		const like = await PostService.createLike(req.body.postId, req.userId);

		res.json(like);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const cancelLike = async (req, res, next) => {
	try {
		const like = await PostService.removeLike(req.body.postId, req.userId);

		res.json(like);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const createComment = async (req, res, next) => {
	const postId = req.body.postId;
	const writtenText = req.body.writtenText;
	try {
		const comment = await PostService.createComment(postId, req.userId, writtenText);

		res.json(comment);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const deleteComment = async (req, res, next) => {
	const commentId = req.body.commentId;
	try {
		const comment = await PostService.removeComment(commentId);

		res.json(comment);
	} catch (err) {
		console.log(err);
		next(err);
	}
};
