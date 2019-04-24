FROM node:11.14.0-alpine

MAINTAINER Wetelo, Inc. <i@wetelo.com>

WORKDIR /app

VOLUME /files

COPY . /app

COPY package.json /app/package.json
RUN npm install

EXPOSE 3337 3333

CMD npm start