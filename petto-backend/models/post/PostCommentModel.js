import mongoose from 'mongoose';

const PostCommentSchema = mongoose.Schema(
	{
		post: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPost', required: true },
		profile: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
		writtenText: { type: String, required: true },
	},
	{ timestamps: true },
);

export default mongoose.model('PostComment', PostCommentSchema);
