import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import AuthRoutes from './routes/AuthRoutes.js';
import UserRoutes from './routes/UserRoutes.js';
import PostRoutes from './routes/PostRoutes.js';
import PetRoutes from './routes/PetRoutes.js';

// configuration

const PORT = Number(process.env.NODE_PORT) || 8080;

const app = express();

//
mongoose.set('strictQuery', true);
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('DB OK!'))
	.catch((err) => console.error('DB Error!', err));

app.use(express.json());
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Access-Control-Allow-Origin', 'Authorization'],
	}),
);
app.use('/uploads', express.static('uploads'));

// endpoints

// routes
app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use('/post', PostRoutes);
app.use('/pet', PetRoutes);

// error handler
app.use((error, req, res, next) => {
	// generic handler
	res.status(error.status || 500).json({ message: error.message || 'Server error' });
});
// run
app.listen(PORT, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log(`Server OK on ${PORT} port!`);
});
