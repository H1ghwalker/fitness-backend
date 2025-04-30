FROM --platform=linux/amd64 node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 1337

CMD ["npm", "run", "dev"]