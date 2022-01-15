FROM node:14-slim

WORKDIR /usr/src/app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 3001

CMD ["nodemon", "www/bin"]