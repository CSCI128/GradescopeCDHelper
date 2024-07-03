FROM node:20-alpine AS builder

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

WORKDIR app

RUN npm i

ADD . /app

RUN npm run bundle

FROM ghcr.io/puppeteer/puppeteer:16.1.0 AS  dist

COPY --from=builder /app/dist /dist

ENTRYPOINT ["node", "/dist/index.js"]
