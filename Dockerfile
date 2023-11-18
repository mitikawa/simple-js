FROM node:latest

WORKDIR /usr/src/app

ENV DOCKERIZE_VERSION v0.7.0

RUN apt-get update \
    && apt-get install -y wget \
    && wget -O - https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz | tar xzf - -C /usr/local/bin \
    && apt-get autoremove -yqq --purge wget && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY ./src ./src

COPY ./public ./public

RUN npm run build

EXPOSE 8000

ENV REDIS_HOST redis
