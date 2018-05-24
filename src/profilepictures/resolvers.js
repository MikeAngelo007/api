import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allProfilePictures: (_) => 
			getRequest(URL,""),
		profilePictureById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'),
	}
};

export default resolvers;