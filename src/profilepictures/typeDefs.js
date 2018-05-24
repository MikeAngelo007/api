export const profilePicturesTypeDef = `
type ProfilePicture {
    id: Int!
    Student: String!
    Url: String
}
`;

export const profilePicturesQueries = `
    allProfilePictures: [ProfilePicture]!
    profilePictureById(id: String!): ProfilePicture!
`;
