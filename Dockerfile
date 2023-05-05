FROM node:18

WORKDIR /usr/app

ADD package*.json ./

RUN npm install --force

ADD . .

RUN npm run build

CMD ["node", "./dist/main.js"]
