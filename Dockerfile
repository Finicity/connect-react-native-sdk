FROM node:20.9.0-alpine as build
RUN apk update && apk upgrade
COPY . /usr/code
RUN cd /usr/code
RUN npm pack

FROM node:20.9.0-alpine
COPY --from=build /usr/code/*.tgz app.tgz
RUN npm install app.tgz
