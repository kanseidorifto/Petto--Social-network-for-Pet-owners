import { Router } from 'express';

import * as PostController from '../controllers/PostController.js';
import checkAuth from '../utils/checkAuth.js';
import { memoryStorage } from '../utils/memoryStorage.js';

const PostRoutes = Router();

PostRoutes.use(checkAuth);

PostRoutes.get('/me', PostController.getMyPostList);
PostRoutes.post('/me', memoryStorage.array('mediaList'), PostController.createPost);
PostRoutes.get('/feed', PostController.getMyFeed);
PostRoutes.get('/feed/all', PostController.getAllPostList);
PostRoutes.get('/user', PostController.getUserPostList);
PostRoutes.get('/pet', PostController.getPetPostList);
PostRoutes.post('/like', PostController.createLike);
PostRoutes.delete('/like', PostController.cancelLike);
PostRoutes.post('/comment', PostController.createComment);
PostRoutes.delete('/comment', PostController.deleteComment);
PostRoutes.get('/:id', PostController.getPost);
PostRoutes.delete('/:id', PostController.deletePost);

export default PostRoutes;
