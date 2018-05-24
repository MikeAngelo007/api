export const bicicletasTypeDef = `
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
    ubicacion: String
    estado: String
}
`;

export const bicicletasQueries = `
    allBicicletas(token: String!): [Bicicleta]!
    bicicletaById(token: String!, serial: Int!): Bicicleta!
`;

export const bicicletasMutations = `
    createBicicleta(token: String!, bicicleta: BicicletaInput!): Bicicleta!
    deleteBicicleta(token: String!, serial: Int!): Bicicleta!
    updateBicicleta(token: String!, serial: Int!, bicicleta: BicicletaInputEdit!): Bicicleta!
`;
