FROM node:alpine
WORKDIR /app/backend
COPY . /app/backend
RUN mv .env.example .env
RUN yarn install
EXPOSE 8000
CMD yarn start