import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const REGION = process.env.OCI_REGION;
const REQUEST = process.env.OCI_REQUEST;
const NAMESPACE = process.env.OCI_NAMESPACE;
const BUCKET = process.env.OCI_BUCKET;

const uploadURL = `https://objectstorage.${REGION}.oraclecloud.com/p/${REQUEST}/n/${NAMESPACE}/b/${BUCKET}/o/`;

export const uploadToBucket = async (file, filename) => {
	const config = {
		method: 'PUT',
		maxBodyLength: Infinity,
		url: uploadURL + filename,
		headers: {
			'Content-Type': 'image',
		},
		data: file,
	};

	const response = await axios.request(config);

	if (response.statusText == 'OK') {
		return `https://objectstorage.${REGION}.oraclecloud.com/n/${NAMESPACE}/b/${BUCKET}/o/${filename}`;
	}
};
