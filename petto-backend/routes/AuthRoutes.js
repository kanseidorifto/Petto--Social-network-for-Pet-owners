import { Router } from 'express';

import * as AuthController from '../controllers/AuthController.js';
import { loginValidation, registerValidation } from '../validations/auth.js';
import handleValidationErrors from '../utils/handleValidationErrors.js';

const AuthRoutes = Router();

AuthRoutes.post('/login', loginValidation, handleValidationErrors, AuthController.login);
AuthRoutes.post('/register', registerValidation, handleValidationErrors, AuthController.register);

export default AuthRoutes;
