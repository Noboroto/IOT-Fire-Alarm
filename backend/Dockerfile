# build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY ./app.js ./
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock

RUN yarn --production
RUN node app.js

