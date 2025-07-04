FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

# Создаем директории для логов и uploads
RUN mkdir -p logs uploads && chmod 777 logs uploads

EXPOSE 1337

# Используем nodemon для разработки
CMD ["npm", "run", "dev"]