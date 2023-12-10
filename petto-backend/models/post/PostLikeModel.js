import mongoose from 'mongoose';

const PostLikeSchema = mongoose.Schema(
	{
		post: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPost', required: true, unique: false },
		profile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'UserProfile',
			required: true,
			unique: false,
		},
	},
	{ timestamps: true },
);

PostLikeSchema.index({ post: 1, profile: 1 }, { unique: true });

export default mongoose.model('PostLike', PostLikeSchema);
