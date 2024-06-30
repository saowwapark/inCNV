### STAGE 1: Build ###
FROM node:20 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json angular.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build

### STAGE 2: Run ###
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=build /usr/src/app/dist/incnv-frontend /usr/share/nginx/html