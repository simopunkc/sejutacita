FROM node:alpine
WORKDIR /app/backend
COPY . /app/backend
RUN rm -rf models/redis.database.js
RUN mv models/redis.database.production.js models/redis.database.js
RUN mv .env.example .env
RUN yarn install
EXPOSE 8000
CMD yarn start