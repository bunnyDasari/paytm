FROM node:22-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


EXPOSE 7000


CMD ["node", "app.js"]