Movies API
==========

This API connects to Star Wars API to perform movie and series management operations.

## Technologies Used:

* **Docker** : Containerization for easy deployment.
* **Node 18/ Nestjs** : Backend implementation.
* **Jest**: Testing framework for unit tests.
* **JWT:** Authentication
* **Swagger**: Documentation

## Setup and Usage

### Prerequisites:

Make sure you have Docker and `make` installed on your machine.

### Commands

* **`make up`**
  Builds and starts the Nest and Mysql container.
* **`make track`**
  Follows and shows the logs from the running container.
* **`make down`**
  Stops the container and cleans up the resources.
* **`make bash`**
  Enters the backend container's bash shell for debugging or further interaction.
* `make db:`
  Enters mysql container bash.
* `make mysql`:
  Enters mysql.
* `make logs_backend`: Track logs of backend container
* `make logs_mysql`:
  Track logs of mysql container.

> To test all endpoints and services you need to do this:
> *execute make bash or docker exec -it nest_app sh  //(you can use bash instead of sh)
> then execute npm run test*

Useful endpoints:

- hostUrl/docs
- hostUrl/api/v1/auth/login
- hostUrl/auth/register

Postman collection to test:

https://www.postman.com/speeding-shadow-778130/movies-nest-api/folder/woka36p/movies

Deployed on:
https://movies-api-production-2980.up.railway.app/api/v1
