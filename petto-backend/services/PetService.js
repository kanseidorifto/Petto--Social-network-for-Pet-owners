import createHttpError from 'http-errors';

import PetProfileModel from '../models/profile/PetProfileModel.js';

export const getUserPetList = async (userId) => {
	const petList = await PetProfileModel.find({ owner: userId });

	return petList;
};

export const getPetInfo = async (petId) => {
	const pet = await PetProfileModel.findById(petId).populate('owner');

	if (!pet) {
		throw new createHttpError.NotFound('Pet not found');
	}

	return pet;
};

export const createPet = async ({ ownerId, givenName, avatarUrl, breed, age, bio }) => {
	const doc = new PetProfileModel({
		owner: ownerId,
		givenName,
		avatarUrl,
		breed,
		age,
		bio,
	});

	const pet = await doc.save();

	return pet;
};

export const updatePetInfo = async (petId, values) => {
	const pet = await PetProfileModel.findByIdAndUpdate(
		petId,
		{
			givenName: values.givenName,
			avatarUrl: values.avatarUrl,
			breed: values.breed,
			age: values.age,
			bio: values.bio,
		},
		{ returnDocument: 'after' },
	);

	if (!pet) {
		throw new createHttpError.NotFound('Pet not found');
	}

	return pet;
};

export const removePet = async (petId) => {
	const pet = await PetProfileModel.findByIdAndDelete(petId);

	if (!pet) {
		throw new createHttpError.NotFound('Pet not found');
	}

	return pet;
};
