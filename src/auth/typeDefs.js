export const authTypeDef = `
    type Auth {
        token: String!
        expire: String!
    }
    input AuthInput {
        id: String!
        password: String!
    }
`;

export const authMutations = `
    auth(auth: AuthInput!): Auth!
`;