FROM node:alpine
WORKDIR /app/backend
COPY . /app/backend
RUN rm -rf /models/redis.connection.js
RUN mv /models/redis.connection.production.js redis.connection.js
RUN mv .env.example .env
RUN yarn install
EXPOSE 8000
CMD yarn start