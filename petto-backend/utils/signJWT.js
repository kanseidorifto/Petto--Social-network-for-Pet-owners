import * as dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';

export default (payload) =>
	jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.EXPIRES_IN,
	});
