FROM node:lts-alpine3.22

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .

COPY .env.production .env

# ganti sesuai ip atau domain backend api
ENV NEXT_PUBLIC_API_URL=http://192.168.221.41:2222

RUN npm run build

EXPOSE 3333

CMD [ "npm", "run", "start" ]