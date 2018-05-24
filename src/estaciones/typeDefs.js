export const estacionesTypeDef = `
type Estacion {
    name: String!
    bicicletas: [Bicicleta]!
}`;

export const estacionesQueries = `
    allEstaciones(token: String!): [Estacion]!
    estacionByName(token: String!, name: String!): [Bicicleta]!
`;
