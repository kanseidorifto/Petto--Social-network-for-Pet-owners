import fs from 'fs';
import multer from 'multer';
import { randomUUID } from 'crypto';

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads');
		}
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		const fileExtName = file.originalname.split('.').pop();
		cb(null, `${randomUUID()}.${fileExtName}`);
	},
});

export const uploadStorage = multer({ storage });
