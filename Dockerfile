FROM node:18

WORKDIR /opt/app

ADD package*.json ./

RUN npm install

ADD . .

RUN npm run build

CMD ["node", "./dist/main.js"]
