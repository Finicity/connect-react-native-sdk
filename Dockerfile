FROM node:20.9.0-alpine as build
WORKDIR /home/code
RUN chmod -R 777 /home/code
COPY . ./
RUN cd /home/code
RUN npm pack


FROM node:20.9.0-alpine
COPY --from=build /home/code/*.tgz app.tgz
RUN npm install app.tgz
