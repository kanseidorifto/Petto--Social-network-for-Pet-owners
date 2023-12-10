import mongoose from 'mongoose';

const PostTaggedPetSchema = mongoose.Schema(
	{
		post: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPost', required: true, unique: false },
		petProfile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PetProfile',
			required: true,
			unique: false,
		},
	},
	{ timestamps: true },
);

PostTaggedPetSchema.index({ post: 1, petProfile: 1 }, { unique: true });

export default mongoose.model('PostTaggedPet', PostTaggedPetSchema);
