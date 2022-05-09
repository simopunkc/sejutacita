FROM mongo:latest
ENV MONGO_INITDB_ROOT_USERNAME username
ENV MONGO_INITDB_ROOT_PASSWORD password
EXPOSE 27017
CMD mongod --replSet=rs0 --bind_ip_all