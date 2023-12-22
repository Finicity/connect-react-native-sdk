FROM node:20.9.0-alpine
RUN apk update && apk upgrade
COPY /lib /usr/code
