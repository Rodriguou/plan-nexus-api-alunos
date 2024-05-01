FROM node:20.12.2

WORKDIR /backend

COPY . .

RUN npm install

CMD [ "npm", "start" ]
