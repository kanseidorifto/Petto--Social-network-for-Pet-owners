import createHttpError from 'http-errors';

import * as PetService from '../services/PetService.js';
import { uploadToBucket } from '../utils/bucketActions.js';
import { randomUUID } from 'crypto';

export const getMyPetList = async (req, res, next) => {
	const userId = req.userId;
	try {
		const petList = await PetService.getUserPetList(userId);

		res.json(petList);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getUserPetList = async (req, res, next) => {
	const userId = req.query.id;
	try {
		const petList = await PetService.getUserPetList(userId);

		res.json(petList);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const getPet = async (req, res, next) => {
	const petId = req.params.id;
	try {
		const pet = await PetService.getPetInfo(petId);

		res.json(pet);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const createPet = async (req, res, next) => {
	try {
		const avatarFile = req.file && req.file.buffer;

		const avatarFilename = avatarFile ? `${randomUUID()}.png` : undefined;

		const avatarUrl = avatarFilename && (await uploadToBucket(avatarFile, avatarFilename));

		const pet = await PetService.createPet({
			ownerId: req.userId,
			givenName: req.body.givenName,
			avatarUrl,
			breed: req.body.breed,
			age: req.body.age,
			bio: req.body.bio,
		});

		res.json(pet);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const updatePetInfo = async (req, res, next) => {
	const petId = req.params.id;
	try {
		const pet = await PetService.getPetInfo(petId);

		if (pet.owner._id != req.userId) {
			throw new createHttpError.Forbidden('You are not an owner of this pet');
		}

		const avatarFile = req.file && req.file.buffer;

		const avatarFilename = avatarFile ? `${randomUUID()}.png` : undefined;

		const avatarUrl = avatarFilename && (await uploadToBucket(avatarFile, avatarFilename));

		const result = await PetService.updatePetInfo(petId, {
			givenName: req.body.givenName,
			avatarUrl,
			breed: req.body.breed,
			age: req.body.age,
			bio: req.body.bio,
		});

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const deletePet = async (req, res, next) => {
	const petId = req.params.id;
	try {
		const pet = await PetService.getPetInfo(petId);

		if (pet.owner._id != req.userId) {
			throw new createHttpError.Forbidden('You are not an owner of this pet');
		}

		const result = await PetService.removePet(petId);

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};
