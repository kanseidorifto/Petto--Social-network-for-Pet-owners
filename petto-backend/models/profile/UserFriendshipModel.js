import mongoose from 'mongoose';

const UserFriendshipSchema = mongoose.Schema(
	{
		profileRequest: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserProfile',
			required: true,
			unique: false,
		},
		profileAccept: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserProfile',
			required: true,
			unique: false,
		},
		status: { type: Number, default: 0 },
	},
	{ timestamps: true },
);

UserFriendshipSchema.index({ profileRequest: 1, profileAccept: 1 }, { unique: true });

export default mongoose.model('UserFriendship', UserFriendshipSchema);
