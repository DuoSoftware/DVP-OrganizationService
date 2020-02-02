FROM node:10-alpine
WORKDIR /usr/local/src/organizationservice
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9004
CMD [ "node", "app.js" ]
