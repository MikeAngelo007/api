'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Koa = _interopDefault(require('koa'));
var KoaRouter = _interopDefault(require('koa-router'));
var koaLogger = _interopDefault(require('koa-logger'));
var koaBody = _interopDefault(require('koa-bodyparser'));
var koaCors = _interopDefault(require('@koa/cors'));
var apolloServerKoa = require('apollo-server-koa');
var merge = _interopDefault(require('lodash.merge'));
var GraphQLJSON = _interopDefault(require('graphql-type-json'));
var graphqlTools = require('graphql-tools');
var request = _interopDefault(require('request-promise-native'));
var graphql = require('graphql');
var axios = _interopDefault(require('axios'));

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
async function generalRequest(url, method, body, fullResponse) {
	const parameters = {
		method,
		uri: encodeURI(url),
		body,
		json: true,
		resolveWithFullResponse: fullResponse
	};
	if (process.env.SHOW_URLS) {
		// eslint-disable-next-line
		console.log(url);
	}

	try {
		return await request(parameters);
	} catch (err) {
		return err;
	}
}

/**
 * Adds parameters to a given route
 * @param {string} url
 * @param {object} parameters
 * @return {string} - url with the added parameters
 */
function addParams(url, parameters) {
	let queryUrl = `${url}`;
	for (let param in parameters) {
		// check object properties
		if (
			Object.prototype.hasOwnProperty.call(parameters, param) &&
			parameters[param]
		) {
			if (Array.isArray(parameters[param])) {
				queryUrl += `${param}=${parameters[param].join(`&${param}=`)}&`;
			} else {
				queryUrl += `${param}=${parameters[param]}&`;
			}
		}
	}
	return queryUrl;
}

/**
 * Generates a GET request with a list of query params
 * @param {string} url
 * @param {string} path
 * @param {object} parameters - key values to add to the url path
 * @return {Promise.<*>}
 */
function getRequest(url, path, parameters) {
	
	const PATH = "";
	if(path && path.length > 0)
		PATH = `/${path}`;

	const queryUrl = addParams(`${url}${PATH}`, parameters);
	return generalRequest(queryUrl, 'GET');
}

/**
 * Merge the schemas in order to avoid conflicts
 * @param {Array<string>} typeDefs
 * @param {Array<string>} queries
 * @param {Array<string>} mutations
 * @return {string}
 */
function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

function formatErr(error) {
	const data = graphql.formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

function authToken(token) {
	return new Promise( resolve => {
		console.log(`http://35.193.172.140:3005/login/${token}`);
		axios({
			headers: { 'Content-Type': 'application/json' },
			url: `http://35.193.172.140:3005/login/${token}`,
			method: "GET",
			responseType: 'json'
		}).then(function (response) {
			return {
				date: response.data.date,
				id: response.data.id
			}
		}).then((data) =>
			resolve( data )
		).catch((data) => {
			resolve( data );
		});
	});
}

function generateToken(id) {
	return new Promise(resolve => {

		const data = JSON.stringify({
			id: id
		});

		console.log(`http://35.193.172.140:3005/login/`);
		axios({
			headers: { 'Content-Type': 'application/json' },
			url: `http://35.193.172.140:3005/login`,
			method: "POST",
			responseType: 'json',
			data: data
		}).then(function (response) {
			return {
				expire: response.data.date,
				token: response.data.token
			}
		}).then((data) =>
			resolve(data)
		).catch((data) => {
			resolve(data);
		});
	});
}

const usersTypeDef = `
type User {
    id: Int!
    name: String!
    lastname: String!
    id_code: Int!
    email: String!
    id_type: String!
}

input UserInput {
    name: String!
    lastname: String!
    id_code: Int!
    email: String!
    id_type: String!
}
`;

const usersQueries = `
    allUsers(token: String!): [User]!
    userById(token: String!, id: Int!): User!
`;

const usersMutations = `
    createUser(token: String!, user: UserInput!): User!
    deleteUser(token: String!, id: Int!): User!
    updateUser(token: String!, id: Int!, user: UserInput!): User!
`;

const prestamosTypeDef = `
type Prestamo {
    id: Int!
    student_id: Int!
    bici_id: Int!
    solicitud: String
}

input PrestamoInput {
    student_id: Int!
    bici_id: Int!
    solicitud: String
}

input PrestamoInputEdit {
    student_id: Int
    bici_id: Int
    solicitud: String
}
`;

const prestamosQueries = `
    allPrestamos(token: String!): [Prestamo]!
    prestamoById(token: String!, id: Int!): Prestamo!
`;

const prestamosMutations = `
    createPrestamo(token: String!, prestamo: PrestamoInput!): Prestamo!
    deletePrestamo(token: String!, id: Int!): Prestamo!
    updatePrestamo(token: String!, id: Int!, prestamo: PrestamoInputEdit!): Prestamo!
`;

const profilePicturesTypeDef = `
type ProfilePicture {
    id: Int!
    Student: String!
    Url: String
}
`;

const profilePicturesQueries = `
    allProfilePictures: [ProfilePicture]!
    profilePictureById(id: String!): ProfilePicture!
`;

const bicicletasTypeDef = `
type Bicicleta {
    serial: Int!
    marca: String
    color: String
    ubicacion: String
    estado: String
}

input BicicletaInput {
    serial: Int!
    marca: String!
    color: String!
    ubicacion: String!
    estado: String!
}

input BicicletaInputEdit {
    ubicacion: String!
    estado: String!
}
`;

const bicicletasQueries = `
    allBicicletas(token: String!): [Bicicleta]!
    bicicletaById(token: String!, serial: Int!): Bicicleta!
`;

const bicicletasMutations = `
    createBicicleta(token: String!, bicicleta: BicicletaInput!): Bicicleta!
    deleteBicicleta(token: String!, serial: Int!): Bicicleta!
    updateBicicleta(token: String!, serial: Int!, bicicleta: BicicletaInputEdit!): Bicicleta!
`;

const authTypeDef = `
    type Auth {
        token: String!
        expire: String!
    }
    input AuthInput {
        id: String!
        password: String!
    }
`;

const authMutations = `
    auth(auth: AuthInput!): Auth!
`;

const url = process.env.USERS_URL || 'users-ms';
const port = process.env.USERS_PORT || '3001';
const entryPoint = process.env.USERS_ENTRY || 'users';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
	Query: {
		allUsers: async (_, { token }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return getRequest(URL,"");
			else
				throw "Autenticacion invalida"
		},
		userById: async (_, { token, id }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'GET');
			else
				throw "Autenticacion invalida"
		},
		/* userById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'), */
	},
	Mutation: {
		createUser: async (_, { token, user }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}`, 'POST', user);
			else
				throw "Autenticacion invalida"
		},
		updateUser: async (_, { token, id, user }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'PUT', user);
			else
				throw "Autenticacion invalida"
		},
		deleteUser: async (_, { token, id }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL}/${id}`, 'DELETE');
			else
				throw "Autenticacion invalida"
		}
		/* deleteUser: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE') */
	}
};

var _url = process.env.PRESTAMOS_URL;
var _port = process.env.PRESTAMOS_PORT;
var _entryPoint = process.env.PRESTAMOS_ENTRY;

console.log(`http://${_url}:${_port}/${_entryPoint}`);

const url$1 = _url ? _url : 'localhost';
const port$1 = _port ? _port : '3002';
const entryPoint$1 = _entryPoint ? _entryPoint : "prestamos";

const URL$1 = `http://${url$1}:${port$1}/${entryPoint$1}`;

const resolvers$1 = {
	Query: {
		allPrestamos: async (_, { token }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return getRequest(URL$1,"");
			else
				throw "Autenticacion invalida"
		},
		prestamoById: async (_, { token, id }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$1}/${id}`, 'GET');
			else
				throw "Autenticacion invalida"
		},
		/* prestamoById: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'GET'), */
	},
	Mutation: {
		createPrestamo: async (_, { token, prestamo }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$1}`, 'POST', prestamo);
			else
				throw "Autenticacion invalida"
		},
		updatePrestamo: async (_, { token, id, prestamo }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$1}/${id}`, 'PATCH', prestamo);
			else
				throw "Autenticacion invalida"
		},
		deletePrestamo: async (_, { token, id }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$1}/${id}`, 'DELETE');
			else
				throw "Autenticacion invalida"
		}
		/* deletePrestamo: (_, { id }) =>
			generalRequest(`${URL}/${id}`, 'DELETE') */
	}
};

const url$2 = process.env.PROFILES_PHOTOS_URL || '192.168.99.101';
const port$2 = process.env.PROFILES_PHOTOS_PORT || '3003';
const entryPoint$2 = process.env.PROFILES_PHOTOS_ENTRY || 'profilepictures';

const URL$2 = `http://${url$2}:${port$2}/${entryPoint$2}`;

const resolvers$2 = {
	Query: {
		allProfilePictures: (_) => 
			getRequest(URL$2,""),
		profilePictureById: (_, { id }) =>
			generalRequest(`${URL$2}/${id}`, 'GET'),
	}
};

var _url$1 = process.env.BICICLETAS_URL;
var _port$1 = process.env.BICICLETAS_PORT;
var _entryPoint$1 = process.env.BICICLETAS_ENTRY;

console.log(`http://${_url$1}:${_port$1}/${_entryPoint$1}`);

const url$3 = _url$1 ? _url$1 : '192.168.99.102';
const port$3 = _port$1 ? _port$1 : '3004';
const entryPoint$3 = _entryPoint$1 ? _entryPoint$1 : "bicicletas";

const URL$3 = `http://${url$3}:${port$3}/${entryPoint$3}`;

const resolvers$3 = {
	Query: {
		allBicicletas: async (_, { token }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return getRequest(URL$3,"");
			else
				throw "Autenticacion invalida"
		},
		bicicletaById: async (_, { token, serial }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$3}/${serial}`, 'GET');
			else
				throw "Autenticacion invalida"
		},
		/* bicicletaById: (_, { serial }) =>
			generalRequest(`${URL}/${serial}`, 'GET'), */
	},
	Mutation: {
		createBicicleta: async (_, { token, bicicleta }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$3}/create`, 'POST', bicicleta);
			else
				throw "Autenticacion invalida"
		},
		/* createBicicleta: (_, { bicicleta }) =>
			generalRequest(`${URL}/create`, 'POST', bicicleta), */
		updateBicicleta: async (_, { token, serial, bicicleta }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$3}/edit/${serial}`, 'PATCH', bicicleta);
			else
				throw "Autenticacion invalida"
		},
		deleteBicicleta: async (_, { token, serial }) => {
			var response = await authToken(token); //Esperar por la respueseta
			if (response.id)
				return generalRequest(`${URL$3}/delete/${serial}`, 'DELETE');
			else
				throw "Autenticacion invalida"
		}
		/* deleteBicicleta: (_, { serial }) =>
			generalRequest(`${URL}/delete/${serial}`, 'DELETE') */
	}
};

const url$4 = process.env.AUTH_URL || 'users-ms';
const port$4 = process.env.AUTH_PORT || '3001';
const entryPoint$4 = process.env.AUTH_ENTRY || 'ldap';

const URL$4 = `http://${url$4}:${port$4}/${entryPoint$4}`;

const resolvers$4 = {
    Mutation: {
        auth: async (_, { auth }) => {
            const resp = await generalRequest(`${URL$4}`, 'POST', auth);
            if(resp.answer != "true"){
                throw "Autenticacion fallo"
            }
            return generateToken(resp.id)
        }
    }
};

// import {
// 	loginMutations,
// 	loginQueries,
// 	loginTypeDef
// } from './login/typeDefs';

/* import {
	coursesMutations,
	coursesQueries,
	coursesTypeDef
} from './courses/typeDefs';

import {
	gradesMutations,
	gradesQueries,
	gradesTypeDef
} from './grades/typeDefs'; */

// import loginResolvers from './login/resolvers';
// import coursesResolvers from './courses/resolvers';
// import gradesResolvers from './grades/resolvers';

// merge the typeDefs
const mergedTypeDefs = mergeSchemas(
	[
		'scalar JSON',
		usersTypeDef,
		prestamosTypeDef,
		profilePicturesTypeDef,
		bicicletasTypeDef,
		authTypeDef
		// loginTypeDef,
		// usersTypeDef,
		// coursesTypeDef,
		// gradesTypeDef
	],
	[
		usersQueries,
		prestamosQueries,
		profilePicturesQueries,
		bicicletasQueries
		// loginQueries,
		// usersQueries,
		// coursesQueries,
		// gradesQueries
	],
	[
		usersMutations,
		prestamosMutations,
		bicicletasMutations,
		authMutations
		// usersMutations,
		// coursesMutations,
		// gradesMutations
	]
);

// Generate the schema object from your types definition.
var graphQLSchema = graphqlTools.makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		resolvers,
		resolvers$1,
		resolvers$2,
		resolvers$3,
		resolvers$4
		// loginResolvers,
	)
});

const app = new Koa();
const router = new KoaRouter();
// Aqui se coloca el puerto en el que aparecera GraphiQL
const PORT = process.env.PORT || 4500;

app.use(koaLogger());
app.use(koaCors());

// read token from header
app.use(async (ctx, next) => {
	if (ctx.header.authorization) {
		const token = ctx.header.authorization.match(/Bearer ([A-Za-z0-9]+)/);
		if (token && token[1]) {
			ctx.state.token = token[1];
		}
	}
	await next();
});

// GraphQL
const graphql$1 = apolloServerKoa.graphqlKoa((ctx) => ({
	schema: graphQLSchema,
	context: { token: ctx.state.token },
	formatError: formatErr
}));
router.post('/graphql', koaBody(), graphql$1);
router.get('/graphql', graphql$1);

// test route
router.get('/graphiql', apolloServerKoa.graphiqlKoa({ endpointURL: '/graphql' }));

app.use(router.routes());
app.use(router.allowedMethods());
// eslint-disable-next-line
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
