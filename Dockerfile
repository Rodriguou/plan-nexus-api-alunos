FROM node:20.12.0

WORKDIR /backend

COPY . .

RUN npm install


ENV PORT 3334

EXPOSE 3334

CMD [ "npm", "run", "start" ]
