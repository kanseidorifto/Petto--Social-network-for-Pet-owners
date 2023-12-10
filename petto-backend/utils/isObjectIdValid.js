import { Types } from 'mongoose';

/**
 * True if provided object ID valid
 * @param {string} id
 */
export default (id) => {
	return Types.ObjectId.isValid(id) && new Types.ObjectId(id) == id ? new Types.ObjectId(id) : null;
};
