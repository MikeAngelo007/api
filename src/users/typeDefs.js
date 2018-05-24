export const usersTypeDef = `
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

export const usersQueries = `
    allUsers(token: String!): [User]!
    userById(token: String!): User!
`;

export const usersMutations = `
    createUser(token: String!, user: UserInput!): User!
    deleteUser(token: String!, id: Int!): User!
    updateUser(token: String!, id: Int!, user: UserInput!): User!
`;
