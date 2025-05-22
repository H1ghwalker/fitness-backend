FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p logs && chmod 777 logs

EXPOSE 1337

CMD ["npm", "run", "dev"]