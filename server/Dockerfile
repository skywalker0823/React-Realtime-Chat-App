FROM --platform=linux/amd64 node:19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "run" , "dev"]