FROM mongo:latest
EXPOSE 27017
CMD mongod --replSet=rs0 --bind_ip_all