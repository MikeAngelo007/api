FROM node:carbon-slim
# Create app directory
WORKDIR /git/biciun-api

# Install app dependencies
COPY package.json /git/biciun-api/
RUN npm install

# Bundle app source
COPY . /git/biciun-api/
RUN npm run prepublish

EXPOSE 4500

CMD [ "npm", "run", "runServer" ]
