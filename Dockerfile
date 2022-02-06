FROM node:17-alpine3.14 as Base
RUN apk add curl net-tools
WORKDIR /app
COPY ["yarn.lock", "package.json", "."]
RUN yarn
COPY . .
CMD ["yarn", "start"]