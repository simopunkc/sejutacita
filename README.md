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

# create .env file
cp .env.local .env

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

## Rebuild Image

Take note of the docker Image ID **sejutacita** and **sejutacita-db**.

```bash
docker image ls
```

Run the following command if you have previously run the application and want to update the docker image.

```bash
kubectl delete deploy sejutacita-deployment
kubectl delete deploy sejutacita-db-deployment
kubectl delete hpa sejutacita-deployment
kubectl delete service sejutacita-service
kubectl delete service sejutacita-db-service
docker build --rm -t sejutacita -f application.Dockerfile .
docker build --rm -t sejutacita-db -f database.Dockerfile .
docker rmi <PREVIOUS_IMAGE_ID_sejutacita>
docker rmi <PREVIOUS_IMAGE_ID_sejutacita-db>
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

### User registration

```bash
POST /register/user
```
This endpoint is used by the user for account registration. an **admin** has a role that is **1**. by default the role obtained on account registration is **2** which means the user is not an **admin**.

### User login

```bash
POST /login/user
```
This endpoint is used by the user for account login. If the **username** and **password** entered in the request body are valid, the user will get an access token and a refresh token. Access tokens have a short life span. Whereas refresh tokens have a long lifetime. Both tokens are used as cookie values ​​which are stored in the user's browser.

### Resource access

To access resources on the API such as CRUD data, authorization and authentication are required. Each request must include a refresh token and an access token in the request header.

If the user has no refresh token and access token it means the user has never been logged in so Front End should redirect the user to the login page.

If the user has a refresh token but no access token, then it is likely that the user has logged in but the access token has expired. So Front End has to redirect user to **GET** endpoint **/login/refresh** to get new access token.