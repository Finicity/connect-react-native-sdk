FROM node:20.9.0-alpine as build
WORKDIR /home/code
RUN apk update & apk upgrade
RUN chmod -R 777 /home/code
COPY . ./
RUN cd /home/code
RUN npm pack


FROM node:20.9.0-alpine
COPY --from=build /usr/src/*.tgz app.tgz
RUN npm install app.tgz
