# build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY ./public ./public
COPY ./src ./src
COPY ./static ./static
COPY ./package.json ./ackage.json
COPY ./yarn.lock ./yarn.lock

RUN yarn
RUN yarn build

# production stage
FROM nginx:1.17-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

