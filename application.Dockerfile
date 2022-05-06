FROM node:alpine
WORKDIR /app/backend
COPY . /app/backend
RUN mv .env.example .env
RUN yarn install
EXPOSE 8000
RUN yarn global add pm2
CMD [ "pm2-runtime", "npm", "--", "start" ]