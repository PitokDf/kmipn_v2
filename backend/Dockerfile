FROM node:lts-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env.production .env

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

RUN mkdir -p dist/templates && \
    cp src/templates/*.html dist/src/templates/

EXPOSE 2003

CMD [ "sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/src/app.js" ]