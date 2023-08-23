# build stage
FROM node:18-alpine as build-stage
WORKDIR /app

COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
COPY . ./
RUN ls
