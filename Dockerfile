FROM node:latest
MAINTAINER assafg
ADD . /src/app
WORKDIR /src/app

RUN npm install

EXPOSE 3000 8000

ENTRYPOINT ["npm", "start"]
