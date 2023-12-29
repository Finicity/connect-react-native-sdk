FROM node:slim as build
WORKDIR /home/code
COPY . ./
RUN cd /home/code
RUN rm -rf node_modules

