import { Router } from 'express';

import * as UserController from '../controllers/UserController.js';
import checkAuth from '../utils/checkAuth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';
import { userUpdateValidation, userSearchValidation } from '../validations/user.js';
import { memoryStorage } from '../utils/memoryStorage.js';

const UserRoutes = Router();

UserRoutes.use(checkAuth);

UserRoutes.get('/me', UserController.getMe);
UserRoutes.patch(
	'/me',
	memoryStorage.fields([
		{ name: 'avatarMedia', maxCount: 1 },
		{ name: 'coverMedia', maxCount: 1 },
	]),
	userUpdateValidation,
	handleValidationErrors,
	UserController.updateMe,
);
UserRoutes.get('/', userSearchValidation, handleValidationErrors, UserController.searchUsersByName);
UserRoutes.get('/friends', UserController.getFriendList);
UserRoutes.get('/:id', UserController.getById);
UserRoutes.get('/friends/friend-request', UserController.getFriendRequestList);
UserRoutes.post('/friends/friend-request', UserController.sendFriendRequest);
UserRoutes.patch('/friends/friend-request', UserController.acceptFriendRequest);
UserRoutes.delete('/friends/friend-request', UserController.cancelFriendRequest);

// UserRoutes.post('/register', handleValidationErrors, AuthController.register);

export default UserRoutes;
