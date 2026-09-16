FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

# On force Vite à écouter sur 0.0.0.0 et sur le port 8080
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]