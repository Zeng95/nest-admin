# What image we want to build from
FROM node:16

# Any RUN, CMD, ADD, COPY, or ENTRYPOINT command will be executed inside app
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

CMD npm run start:dev