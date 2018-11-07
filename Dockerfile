FROM node:8.12.0-alpine

COPY package.json .
RUN npm install
COPY . .
RUN ./node_modules/.bin/grunt ci

ENV DEBUG=*

CMD ["node", "built/lib/index.js"]
