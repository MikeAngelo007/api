import { generalRequest, getRequest, authToken } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allEstaciones: async (_, { token }) => {
			let response = await authToken(token) //Esperar por la respueseta
			if (!response.id)
				throw "Autenticacion invalida"

			var allBicicletas = await getRequest(URL, "");;
			var mapaBicicletas = {}

			allBicicletas.forEach( bicicleta => {
				if( !mapaBicicletas[bicicleta.ubicacion] )
					mapaBicicletas[bicicleta.ubicacion] = []
				mapaBicicletas[bicicleta.ubicacion].push(bicicleta)
			});

			var ansList = []

			for (let key in mapaBicicletas) {
				if (mapaBicicletas.hasOwnProperty(key)) {
					ansList.push({
						name: key,
						bicicletas: mapaBicicletas[key],
					})
				}
			}

			return ansList
		},
		estacionByName: async (_, { token, name }) => {
			var response = await authToken(token) //Esperar por la respueseta
			if (!response.id)
				throw "Autenticacion invalida"
			var allBicicletas = await getRequest(URL, "");;
			var bicicletas = []
			allBicicletas.forEach( bici => {
				if(bici.ubicacion == name)
					bicicletas.push(bici)
			});

			return bicicletas
		},
	}
};

export default resolvers;