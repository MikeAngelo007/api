import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import { makeExecutableSchema } from 'graphql-tools';

import { mergeSchemas } from './utilities';

import {
	usersMutations,
	usersQueries,
	usersTypeDef
} from './users/typeDefs';

import {
	prestamosMutations,
	prestamosQueries,
	prestamosTypeDef
} from './historial/typeDefs';

import {
	profilePicturesQueries,
	profilePicturesTypeDef
} from './profilepictures/typeDefs';
	
// import {
// 	loginMutations,
// 	loginQueries,
// 	loginTypeDef
// } from './login/typeDefs';

import {
	bicicletasMutations,
	bicicletasQueries,
	bicicletasTypeDef
} from './bicicletas/typeDefs';

import {
	authMutations,
	authTypeDef
} from './auth/typeDefs';

import {
	estacionesQueries,
	estacionesTypeDef
} from './estaciones/typeDefs';

import usersResolvers from './users/resolvers';
import prestamosResolvers from './historial/resolvers';
import profilepicturesResolvers from './profilepictures/resolvers';
import bicicletasResolvers from './bicicletas/resolvers';
import authResolvers from './auth/resolvers';
import estacionesResolvers from "./estaciones/resolvers";
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
		authTypeDef,
		estacionesTypeDef
		// loginTypeDef,
		// usersTypeDef,
		// coursesTypeDef,
		// gradesTypeDef
	],
	[
		estacionesQueries,
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
export default makeExecutableSchema({
	typeDefs: mergedTypeDefs,
	resolvers: merge(
		{ JSON: GraphQLJSON }, // allows scalar JSON
		usersResolvers,
		prestamosResolvers,
		profilepicturesResolvers,
		bicicletasResolvers,
		authResolvers,
		estacionesResolvers
		// loginResolvers,
	)
});
