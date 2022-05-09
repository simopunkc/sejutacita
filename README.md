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
MongoDB

# run Redis on your local machine
Redis
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
docker build -t sejutacita-mongodb -f mongodb.Dockerfile .
docker build -t sejutacita-redis -f redis.Dockerfile .
```

## Rebuild Image

Take note of the docker Image ID **sejutacita** and **sejutacita-db**.

```bash
docker image ls
```

Run the following command if you have previously run the application and want to update the docker image.

```bash
./stop-server.sh
docker build --rm -t sejutacita -f application.Dockerfile .
docker build --rm -t sejutacita-mongodb -f mongodb.Dockerfile .
docker build --rm -t sejutacita-redis -f redis.Dockerfile .
docker rmi <PREVIOUS_IMAGE_ID_sejutacita>
docker rmi <PREVIOUS_IMAGE_ID_sejutacita-mongodb>
docker rmi <PREVIOUS_IMAGE_ID_sejutacita-redis>
```

## Deploy

Pods

```bash
./start-server.sh
```

Check Pod status

```bash
kubectl get pods
```

Check Horizontal Pod Autoscaler status

```bash
kubectl get hpa
```

Check Service status

```bash
kubectl get svc
```

## Debugging

- Make sure the .env file is created.
- If you are running application on local machine maybe if necessary you need to create database with name ***sejutacita***.

## Test

Run Unit Tests and Integration Tests on your local machine. The results of all the tests passed and the coverage was 100%.

```bash
yarn test
```

Check the service URL for the app. After that access the URL in the browser to ensure that the API was successfully deployed.

```bash
minikube service --url sejutacita-service
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