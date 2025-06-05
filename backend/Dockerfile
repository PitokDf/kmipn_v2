FROM node:lts-alpine3.20

WORKDIR /app

COPY package*.json ./

COPY prisma prisma

RUN npm install

COPY .env.production .env

COPY . .

RUN npm run popinstall

RUN npx prisma generate

RUN npm run build

RUN mkdir -p dist/templates

COPY src/templates/*.html dist/src/templates/

EXPOSE 2003

CMD [ "sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/src/app.js" ]