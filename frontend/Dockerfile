# build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
CMD ["yarn", "start"]

