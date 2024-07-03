FROM node:20-alpine AS builder

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json

WORKDIR app

RUN npm i

ADD . /app

RUN npm run bundle

FROM ghcr.io/puppeteer/puppeteer:22.10.0 AS  dist

USER root

RUN apt-get update && \
    apt-get install -y libgbm-dev xvfb

COPY --from=builder /app/dist /dist
ADD --chmod=777 entrypoint.sh /entrypoint.sh

ENTRYPOINT /entrypoint.sh $@
