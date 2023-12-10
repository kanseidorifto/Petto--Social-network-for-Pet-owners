import * as AuthService from '../services/AuthService.js';

export const register = async (req, res, next) => {
	try {
		const result = await AuthService.register({
			email: req.body.email,
			password: req.body.password,
			givenName: req.body.givenName,
			surname: req.body.surname,
		});

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};

export const login = async (req, res, next) => {
	try {
		const result = await AuthService.login({
			email: req.body.email,
			password: req.body.password,
		});

		res.json(result);
	} catch (err) {
		console.log(err);
		next(err);
	}
};
