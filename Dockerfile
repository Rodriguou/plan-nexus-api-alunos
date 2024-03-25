FROM node:20-alpine

WORKDIR /backend

COPY package.json ./

RUN npm install

COPY . .

ENV PORT 3333

EXPOSE 3333

CMD [ "npm" "run" "start" ]
