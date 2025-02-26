FROM node:lts-alpine

ARG RESEND_API_KEY
ARG NODE_ENV

ENV RESEND_API_KEY=$RESEND_API_KEY
ENV NODE_ENV=$NODE_ENV

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --force --silent --include=dev

RUN apk add --no-cache openssl

COPY . .

RUN npm run build

EXPOSE 3000

USER node

CMD ["npm", "start"]
