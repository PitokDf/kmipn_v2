FROM node:lts-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY /dist /dist

EXPOSE 2003

CMD [ "npm", "run","start" ]