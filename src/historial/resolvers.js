import { generalRequest, getRequest, authToken } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allPrestamos: async (_, { token }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return getRequest(URL, "");
			else
				throw "Autenticacion invalida"
		},
		prestamoById: async (_, { token, id }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'GET');
			else
				throw "Autenticacion invalida"
		},
		prestamosbyUser: async (_, { token }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (!response.id)
				throw "Autenticacion invalida"
			var allPrestamos = await getRequest(URL, "");
			var prestamosUsuario = []
			allPrestamos.forEach(prestamo => {
				if (prestamo.student_id == response.id)
					prestamosUsuario.push(prestamo)
			});
			return prestamosUsuario
		},
		prestamosPendientes: async (_, { token }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (!response.id)
				throw "Autenticacion invalida"
			var allPrestamos = await getRequest(URL, "");
			var prestamosUsuario = []
			allPrestamos.forEach(prestamo => {
				if (prestamo.student_id == response.id && (!prestamo.entrega || prestamo.entrega == ""))
					prestamosUsuario.push(prestamo)
			});
			return prestamosUsuario
		},

	},
	Mutation: {
		entregarPrestamo: async (_, {token,  id} ) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (!response.id)
				throw "Autenticacion invalida"
			let prestamo = {}
			prestamo.entrega = new Date()
			return generalRequest(`${URL}/${id}`, 'PATCH', prestamo);
		},
		createPrestamo: async (_, { token, prestamo }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (!response.id)
				throw "Autenticacion invalida"
			
			prestamo.student_id = parseInt( response.id )
			prestamo.solicitud = new Date()
			
			return generalRequest(`${URL}`, 'POST', prestamo);
		},
		updatePrestamo: async (_, { token, id, prestamo }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'PATCH', prestamo);
			else
				throw "Autenticacion invalida"
		},
		deletePrestamo: async (_, { token, id }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'DELETE');
			else
				throw "Autenticacion invalida"
		}
	}
};

export default resolvers;