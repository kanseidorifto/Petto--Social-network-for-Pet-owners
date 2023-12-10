import mongoose from 'mongoose';

const PrivateMessageSchema = mongoose.Schema(
	{
		privateChat: { type: mongoose.Schema.Types.ObjectId, ref: 'PrivateChat', required: true },
		profileSender: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
		message: { type: String, required: true },
	},
	{ timestamps: true },
);

export default mongoose.model('PrivateMessage', PrivateMessageSchema);
