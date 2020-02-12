FROM node:12.15-alpine AS development
WORKDIR /usr/src/app
ENV NODE_ENV development
COPY . .
RUN npm install

FROM node:12.15-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV production
COPY . .
RUN npm install
