# Sejutacita

Simple API for CRUD users.

## Requirements

Software tools that needs to be installed.

```bash
# manage containers
Docker

# run Kubernetes k8s on your local machine
Minikube

# run the app on your local machine
Node.js

# run SQL database on your local machine
MariaDB
```

## Installation

```bash
# clone this repo

# open "sejutacita" folder
cd sejutacita/

# install library
yarn install
```

## Build Docker Image

start Minikube.

```bash
minikube start
```

change Docker environment to Minikube.

```bash
eval $(minikube docker-env)
```

build docker image.

```bash
docker build -t sejutacita -f application.Dockerfile .
docker build -t sejutacita-db -f database.Dockerfile .
```

## Deploy

Pods

```bash
kubectl apply -f application.deployment.yml
kubectl apply -f database.deployment.yml
```

Check Pod Status

```bash
kubectl get pods
```

Horizontal Pod Autoscaler

```bash
kubectl apply -f application.hpa.yml
```

Check HPA Status

```bash
kubectl get hpa
```

Services

```bash
kubectl apply -f application.service.yml
kubectl apply -f database.service.yml
```

Check Service Status

```bash
kubectl get svc
```

## Debugging

If you are running application on local machine maybe if necessary you need to create database with name ***sejutacita***. You also need to create a database user with the name ***username*** and password ***password***.

## Test

Run Unit Tests and Integration Tests on your local machine. The results of all the tests passed and the coverage was 100%.

```bash
yarn test
```

Check the service URL for the app. After that access the URL in the browser to ensure that the API was successfully deployed.

```bash
minikube service --url sejutacita-service
```

Check the service URL for database

```bash
minikube service --url sejutacita-db-service
```

You can import the collections and environment files in the *_test/postman.test* directory into Postman. Update **baseUrl** variable in environment in Postman with URL *sejutacita-service*.

## Flow

TBD