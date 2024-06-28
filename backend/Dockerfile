FROM node:20
RUN mkdir -p /usr/app/src
WORKDIR /usr/app
COPY src/ ./src/
COPY .env.dev package.json package-lock.json tsconfig.json ./
RUN npm ci
EXPOSE 3000
CMD ["npm", "run", "prod"]