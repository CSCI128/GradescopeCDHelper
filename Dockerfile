FROM node:20-alpine AS builder

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

WORKDIR app

RUN npm i

ADD . /app

RUN npm run bundle

FROM ghcr.io/puppeteer/puppeteer:22.10.0 AS  dist

USER root

RUN apt-get install -y libgbm-dev xvfb

COPY --from=builder /app/dist /dist

ENTRYPOINT [ "xvfb-run", "--server-args='-screen 0 1200x800x24'", "node", "/dist/index.js"]
