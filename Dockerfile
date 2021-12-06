FROM node:14-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

COPY src /app/src

RUN npm i

RUN npm run tsc

FROM node:14-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist         ./dist

RUN npm install --only=production

EXPOSE 4200

CMD node dist/app.js