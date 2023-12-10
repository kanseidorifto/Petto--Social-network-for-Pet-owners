import multer from 'multer';

export const memoryStorage = multer({ storage: multer.memoryStorage() });
