import { generalRequest, getRequest, authToken  } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allUsers: async (_, { token }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return getRequest(URL,"");
			else
				throw "Autenticacion invalida"
		},
		userById: async (_, { token }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${response.id}`, 'GET');
			else
				throw "Autenticacion invalida"
		},
		/* userById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'), */
	},
	Mutation: {
		createUser: async (_, { token, user }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}`, 'POST', user);
			else
				throw "Autenticacion invalida"
		},
		updateUser: async (_, { token, id, user }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'PUT', user);
			else
				throw "Autenticacion invalida"
		},
		deleteUser: async (_, { token, id }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'DELETE');
			else
				throw "Autenticacion invalida"
		}
		/* deleteUser: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE') */
	}
};

export default resolvers;