FROM node:23-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]
