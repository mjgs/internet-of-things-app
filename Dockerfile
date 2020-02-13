FROM node:12.15-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install