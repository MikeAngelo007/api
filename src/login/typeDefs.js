export const loginTypeDef = `
type Login {
    id: String!
    token: String!
    date: String!
}

input LoginInput {
    id: String!
}
`;

export const loginQueries = `
    allLogin: [Login]!
    loginById(token: String!): Login!
`;

export const loginMutations = `
    createLogin(login: LoginInput!): Login!
    deleteLogin(id: Int!): Login!
    updateLogin(id: Int!, Login: LoginInput!): Login!
`;
