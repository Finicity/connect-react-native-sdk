FROM node:20.9.0-alpine as build
COPY package.json /usr/src
COPY . /usr/src
RUN cd /usr/src
RUN npm pack


FROM node:20.9.0-alpine
COPY --from=build /usr/src/*.tgz app.tgz
RUN npm install app.tgz
