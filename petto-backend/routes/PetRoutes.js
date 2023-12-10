import { Router } from 'express';

import * as PetController from '../controllers/PetController.js';
import checkAuth from '../utils/checkAuth.js';
import { memoryStorage } from '../utils/memoryStorage.js';

const PetRoutes = Router();

PetRoutes.use(checkAuth);

PetRoutes.get('/me', PetController.getMyPetList);
PetRoutes.post('/me', memoryStorage.single('avatarMedia'), PetController.createPet);
PetRoutes.get('/user', PetController.getUserPetList);
PetRoutes.get('/:id', PetController.getPet);
PetRoutes.patch('/:id', memoryStorage.single('avatarMedia'), PetController.updatePetInfo);
PetRoutes.delete('/:id', PetController.deletePet);

export default PetRoutes;
