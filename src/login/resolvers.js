import { generalRequest, getRequest } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allLogin: (_) => 
			getRequest(URL,""),
		loginById: (_, { token }) =>
			generalRequest(`${URL}/${token}`, 'GET'),
	},
	Mutation: {
		createLogin: (_, { login }) =>
			generalRequest(`${URL}`, 'POST', login),
		updateLogin: (_, { id, login }) =>
			generalRequest(`${URL}/${id}`, 'PATCH', login),
		deleteLogin: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE')
	}
};

export default resolvers;