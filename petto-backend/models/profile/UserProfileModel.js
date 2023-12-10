import mongoose from 'mongoose';

const UserProfileSchema = mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		avatarUrl: String,
		coverUrl: String,
		givenName: { type: String, required: true },
		surname: { type: String, required: true },
		bio: String,
	},
	{ timestamps: true },
);

UserProfileSchema.index({ givenName: 'text', surname: 'text' });

export default mongoose.model('UserProfile', UserProfileSchema);
