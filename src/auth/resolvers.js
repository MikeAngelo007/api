import { generalRequest, getRequest, generateToken } from '../utilities';
import { url, port, entryPoint } from './server';

const URL = `http://${url}:${port}/${entryPoint}`;

const resolvers = {
    Mutation: {
        auth: async (_, { auth }) => {
            const resp = await generalRequest(`${URL}`, 'POST', auth)
            if(resp.answer != "true"){
                throw "Autenticacion fallo"
            }
            return generateToken(resp.id)
        }
    }
};

export default resolvers;