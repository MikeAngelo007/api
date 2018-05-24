import { generalRequest, getRequest, authToken } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allBicicletas: async (_, { token }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return getRequest(URL,"");
			else
				throw "Autenticacion invalida"
		},
		bicicletaById: async (_, { token, serial }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${serial}`, 'GET');
			else
				throw "Autenticacion invalida"
		},
		/* bicicletaById: (_, { serial }) =>
			generalRequest(`${URL}/${serial}`, 'GET'), */
	},
	Mutation: {
		createBicicleta: async (_, { token, bicicleta }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/create`, 'POST', bicicleta);
			else
				throw "Autenticacion invalida"
		},
		/* createBicicleta: (_, { bicicleta }) =>
			generalRequest(`${URL}/create`, 'POST', bicicleta), */
		updateBicicleta: async (_, { token, serial, bicicleta }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/edit/${serial}`, 'PATCH', bicicleta);
			else
				throw "Autenticacion invalida"
		},
		deleteBicicleta: async (_, { token, serial }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/delete/${serial}`, 'DELETE');
			else
				throw "Autenticacion invalida"
		}
		/* deleteBicicleta: (_, { serial }) =>
			generalRequest(`${URL}/delete/${serial}`, 'DELETE') */
	}
};

export default resolvers;