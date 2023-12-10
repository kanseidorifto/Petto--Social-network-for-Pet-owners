import axios from 'axios';

const recognitionAPIURL = process.env.VITE_APP_RECOGNITION_API_URL; //'/api';

export const recognizePet = async (formData) => {
	try {
		const response = await axios.post(`${recognitionAPIURL}/recognize`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return response.data;
	} catch (error) {
		console.error('Error recognizing pet:', error);
		return null;
	}
};
