import request from 'request-promise-native';
import { formatError } from 'graphql';
import axios from "axios";

/**
 * Creates a request following the given parameters
 * @param {string} url
 * @param {string} method
 * @param {object} [body]
 * @param {boolean} [fullResponse]
 * @return {Promise.<*>} - promise with the error or the response object
 */
export async function generalRequest(url, method, body, fullResponse) {
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
export function addParams(url, parameters) {
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
export function getRequest(url, path, parameters) {
	
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
export function mergeSchemas(typeDefs, queries, mutations) {
	return `${typeDefs.join('\n')}
    type Query { ${queries.join('\n')} }
    type Mutation { ${mutations.join('\n')} }`;
}

export function formatErr(error) {
	const data = formatError(error);
	const { originalError } = error;
	if (originalError && originalError.error) {
		const { path } = data;
		const { error: { id: message, code, description } } = originalError;
		return { message, code, description, path };
	}
	return data;
}

export function authToken(token) {
	return new Promise( resolve => {
		console.log(`http://1a-login-ms:5000/login/${token}`)
		axios({
			headers: { 'Content-Type': 'application/json' },
			url: `http://1a-login-ms:5000/login/${token}`,
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
			resolve( data )
		})
	});
}

export function generateToken(id) {
	return new Promise(resolve => {

		const data = JSON.stringify({
			id: id
		});

		console.log(`http://1a-login-ms:5000/login/`)
		axios({
			headers: { 'Content-Type': 'application/json' },
			url: `http://1a-login-ms:5000/login`,
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
			resolve(data)
		})
	});
}
