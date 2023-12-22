COPY *.tgz /usr/code
COPY /usr/code/*.tgz /usr/code/app.tgz

FROM node:20.9.0-alpine
RUN apk update && apk upgrade
RUN cd /usr/code
RUN npm install app.tgz
