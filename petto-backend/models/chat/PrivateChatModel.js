import mongoose from 'mongoose';

const PrivateChatSchema = mongoose.Schema(
	{
		profileCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
		profileAcceptor: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
	},
	{ timestamps: true },
);

export default mongoose.model('PrivateChat', PrivateChatSchema);