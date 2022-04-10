# beyond

![Client CI](https://github.com/gvazquezmorean/beyond/workflows/Client%20Beyond%20CI%20App/badge.svg)
![Server CI](https://github.com/gvazquezmorean/beyond/workflows/Server%20Beyond%20CI%20App/badge.svg)

This is the beyond project made by Morean

# Table Of Contents

- [Setup](#setup)
  - [VSCode](#vscode)
  - [Node](#node)
  - [Yarn](#yarn)
  - [Serverless](#serverless)
- [Cloning repo](#cloning-repo)
- [Installing dependencies](#installing-dependencies)
- [Running application](#running-application)
- [Documentation](#documentation)
- [Testing](#testing)

**Technology Stack**  
**_Front-End_**: React, Node, NextJS, Redux, Jest, Typescript  
**_Back-End_**: Node, Typescript, Serverless, Inversify, Joi, Jest  
**_Infrastructure in AWS_**: Lambdas, CloudFront, CloudFormation, S3, Dynamo

## Setup

### Installations

**VSCode**  
[https://code.visualstudio.com/](https://code.visualstudio.com/)

**Node**  
[https://nodejs.org/es/](https://nodejs.org/es/)

**Yarn**  
[https://yarnpkg.com/en/](https://yarnpkg.com/en/)

**Java Runtime**
This is important to run locally a dynamodb database
[https://www.java.com/es/download/](https://www.java.com/es/download/)

**Serverless**

> npm i -g serverless

## Cloning repo

> git clone https://github.com/Moreanco/beyond.git

# Installing dependencies

In the root directory:

> yarn

# Running applications

Run all the application

> yarn start

In the root directory:

Server

> yarn start:server

Client

> yarn start:client

Run local database

(The first time)

> sls dynamodb install

(Each time you want to run locally dynamodb - Open in a different terminal. It needs to be open the connection)

> sls dynamodb start

With Docker

> docker-compose up -d --build

# URLs

Client

```
http://localhost:3000/
```

Server

```
http://localhost:8080/
```

# Testing

> yarn test

Client

> yarn test:client

Server

> yarn test:server
